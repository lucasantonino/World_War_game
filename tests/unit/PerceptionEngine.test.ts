import { describe, expect, it } from 'vitest';
import { PerceptionEngine } from '../../src/ai/PerceptionEngine';

describe('PerceptionEngine', () => {
  it('transiciona percepção imperfeita de unaware -> suspicious -> detected -> lost_contact', () => {
    const perception = new PerceptionEngine();
    const observerId = 'ally-1';
    const targetId = 'enemy-1';
    const enemyPos = { x: 15, y: 0, z: -20 };

    expect(perception.getObserverState(observerId)).toBe('unaware');
    expect(perception.getPrimaryTarget(observerId)).toBeNull();

    // Estímulo sonoro fraco gera apenas suspeita
    const suspicious = perception.reportStimulus(
      observerId,
      targetId,
      'enemy',
      enemyPos,
      'audio',
      0.3,
      1.0
    );
    expect(suspicious.state).toBe('suspicious');
    expect(perception.getObserverState(observerId)).toBe('suspicious');

    // Confirma cópia defensiva da posição conhecida
    enemyPos.x = 999;
    expect(perception.getPrimaryTarget(observerId)?.lastKnownPosition.x).toBe(15);

    // Estímulo visual médio confirma detecção
    const detected = perception.reportStimulus(
      observerId,
      targetId,
      'enemy',
      { x: 16, y: 0, z: -18 },
      'visual',
      0.5,
      2.0
    );
    expect(detected.state).toBe('detected');
    expect(perception.getObserverState(observerId)).toBe('detected');

    // Sem LoS por mais de 3.5s transiciona para lost_contact
    perception.decayAll(6.0, () => false);
    expect(perception.getObserverState(observerId)).toBe('lost_contact');
    expect(perception.getPrimaryTarget(observerId)?.state).toBe('lost_contact');
  });

  it('compartilha alvo entre os integrantes do pelotão via rádio', () => {
    const perception = new PerceptionEngine();
    const squadMemberIds = ['ally-1', 'ally-2', 'ally-3', 'enemy-1'];
    const pos = { x: -12, y: 0, z: 8 };

    perception.shareWithSquad(squadMemberIds, 'enemy-1', 'enemy', pos, 4.0);

    for (const id of ['ally-1', 'ally-2', 'ally-3']) {
      const target = perception.getPrimaryTarget(id);
      expect(target).not.toBeNull();
      expect(target?.entityId).toBe('enemy-1');
      expect(target?.source).toBe('radio');
      expect(target?.lastKnownPosition).toEqual(pos);
      expect(target?.state).toBe('investigating');
    }

    // Não reporta o próprio alvo como observador de si mesmo
    expect(perception.getObserverState('enemy-1')).toBe('unaware');
  });

  it('decai confiança ao perder LoS até esquecer o alvo e mantém contato quando há LoS', () => {
    const perception = new PerceptionEngine();

    perception.reportStimulus(
      'obs-los',
      'enemy-a',
      'enemy',
      { x: 0, y: 0, z: -10 },
      'visual',
      0.85,
      0
    );
    perception.reportStimulus(
      'obs-blind',
      'enemy-b',
      'enemy',
      { x: 10, y: 0, z: -10 },
      'visual',
      0.6,
      0
    );

    const initialBlindConfidence = perception.getPrimaryTarget('obs-blind')?.confidence ?? 0;

    // Avança o tempo em passos com LoS apenas para obs-los
    for (let t = 1; t <= 12; t++) {
      perception.decayAll(t, (obs) => obs === 'obs-los');
    }

    const activeTarget = perception.getPrimaryTarget('obs-los');
    expect(activeTarget).not.toBeNull();
    expect(activeTarget?.state).toBe('engaging');
    expect(activeTarget?.confidence).toBe(1);

    // obs-blind perdeu confiança abaixo de MIN_CONFIDENCE (0.12) e esqueceu o alvo
    expect(initialBlindConfidence).toBeGreaterThan(0.5);
    expect(perception.getPrimaryTarget('obs-blind')).toBeNull();
    expect(perception.getObserverState('obs-blind')).toBe('unaware');
  });
});
