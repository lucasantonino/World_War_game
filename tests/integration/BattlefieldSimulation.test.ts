import { describe, expect, it } from 'vitest';
import { GameApplication } from '../../src/core/GameApplication';
import { GAME_LOOP_STAGES } from '../../src/core/GameLoop';
import type { CampaignOperationResult, GameEvent, SoldierProfile } from '../../src/core/types';
import { SquadCommandSystem } from '../../src/gameplay/squads/SquadCommandSystem';
import { SquadSystem } from '../../src/gameplay/squads/SquadSystem';
import { SaveManager } from '../../src/infrastructure/SaveManager';
import { CampaignManager } from '../../src/missions/CampaignManager';

describe('BattlefieldSimulation (Integração Ponta a Ponta)', () => {
  it('executa Vertical Slice completo com GameApplication, pelotão de 8, ordens hold/flank e avanço de tempo simulado', () => {
    const app = new GameApplication({ seed: 1944 });
    app.initializeMission(1, 1944);

    expect(app.state.current).toBe('playing');
    expect(app.world.sectors).toHaveLength(5);

    const playerSquad = app.world.getPlayerSquad();
    expect(playerSquad).toBeDefined();
    expect(playerSquad?.id).toBe('squad-player');
    expect(playerSquad?.memberIds).toHaveLength(8);
    expect(app.world.getSquadMembers('squad-player')).toHaveLength(8);

    const squadSystem = new SquadSystem(app.world, app.bus);
    const commandSystem = new SquadCommandSystem(app.world, app.bus);

    const issuedCommands: Array<Extract<GameEvent, { type: 'squad.command.issued' }>> = [];
    app.bus.on('squad.command.issued', (evt) => issuedCommands.push(evt));

    const stagesExecuted = new Set<string>();
    let squadTicks = 0;
    let directorTicks = 0;
    let squadDtAcc = 0;

    // 1. Emite ordem HOLD e avança simulação por 2 segundos (50 passos * 0.04s)
    const holdPos = { ...playerSquad!.position };
    const holdCmd = commandSystem.issueCommand(playerSquad!.id, 'hold', holdPos, undefined, 0);
    expect(holdCmd?.type).toBe('hold');
    expect(playerSquad!.state).toBe('defending');

    for (let i = 0; i < 50; i++) {
      squadDtAcc += 0.04;
      const schedule = app.step(
        0.04,
        {
          input: () => stagesExecuted.add('input'),
          player: () => stagesExecuted.add('player'),
          simulation: () => stagesExecuted.add('simulation'),
          ai: () => stagesExecuted.add('ai'),
          combat: () => stagesExecuted.add('combat'),
          world: () => stagesExecuted.add('world'),
          presentation: () => stagesExecuted.add('presentation'),
          hud: () => stagesExecuted.add('hud'),
          render: () => stagesExecuted.add('render'),
        },
        holdPos,
        8.5
      );

      if (schedule.runDirector || schedule.runDistant) {
        directorTicks++;
      }
      if (schedule.runSquad) {
        squadTicks++;
        squadSystem.update(squadDtAcc, app.clock.simTime, holdPos);
        squadDtAcc = 0;
      }
    }

    expect(stagesExecuted.size).toBe(GAME_LOOP_STAGES.length);
    for (const stage of GAME_LOOP_STAGES) {
      expect(stagesExecuted.has(stage)).toBe(true);
    }
    expect(app.clock.simTime).toBeCloseTo(2.0, 4);
    expect(squadTicks).toBeGreaterThan(0);
    expect(directorTicks).toBeGreaterThan(0);

    // 2. Emite ordem FLANK para uma posição avançada no flanco e simula mais 4 segundos (100 passos * 0.04s)
    const initialSquadPos = { ...playerSquad!.position };
    const flankTarget = {
      x: initialSquadPos.x - 16,
      y: initialSquadPos.y,
      z: initialSquadPos.z - 20,
    };
    const flankCmd = commandSystem.issueCommand(
      playerSquad!.id,
      'flank',
      flankTarget,
      undefined,
      app.clock.simTime
    );
    expect(flankCmd?.type).toBe('flank');
    expect(playerSquad!.state).toBe('moving');

    squadDtAcc = 0;
    for (let i = 0; i < 100; i++) {
      squadDtAcc += 0.04;
      const schedule = app.step(0.04, {}, flankTarget, 8.5);
      if (schedule.runSquad) {
        squadSystem.update(squadDtAcc, app.clock.simTime, flankTarget);
        squadDtAcc = 0;
      }
    }

    expect(app.clock.simTime).toBeCloseTo(6.0, 4);
    expect(issuedCommands.map((e) => e.payload.type)).toEqual(['hold', 'flank']);

    // Pelotão deve ter se deslocado em direção ao flanco ordenado
    const distBefore = Math.hypot(
      flankTarget.x - initialSquadPos.x,
      flankTarget.z - initialSquadPos.z
    );
    const distAfter = Math.hypot(
      flankTarget.x - playerSquad!.position.x,
      flankTarget.z - playerSquad!.position.z
    );
    expect(distAfter).toBeLessThan(distBefore);

    app.dispose();
  });

  it('resolve combate distante via DistantBattleSimulator e materializa pelotão preservando baixas, saúde e moral', () => {
    const app = new GameApplication({ seed: 2026 });
    app.initializeMission(1, 2026);

    const sectorD = app.world.sectors.find((s) => s.id === 'sector-d');
    const allyD = app.world.squads.get('squad-ally-d');
    const enemyD = app.world.squads.get('squad-enemy-d');

    expect(sectorD).toBeDefined();
    expect(allyD?.lodLevel).toBe('strategic');
    expect(enemyD?.lodLevel).toBe('strategic');

    // Roda passos do simulador de batalha distante enquanto o jogador está longe (Setor A)
    let totalOutcomes = 0;
    for (let i = 0; i < 12; i++) {
      const outcomes = app.director.distantSim.step(2.5);
      totalOutcomes += outcomes.filter((o) => o.sectorId === 'sector-d').length;
    }

    expect(totalOutcomes).toBeGreaterThan(0);
    expect(sectorD!.contested).toBe(true);

    const preMaterializeAllyMembers = app.world
      .getSquadMembers('squad-ally-d')
      .map((s) => ({
        id: s.id,
        alive: s.alive,
        health: s.health,
        morale: s.morale,
        woundLevel: s.woundLevel,
      }));
    const preMaterializeEnemyMembers = app.world
      .getSquadMembers('squad-enemy-d')
      .map((s) => ({
        id: s.id,
        alive: s.alive,
        health: s.health,
        morale: s.morale,
        woundLevel: s.woundLevel,
      }));

    // Verifica que houve impacto real do combate distante (dano/baixas ou queda de moral)
    const allSoldiersAfterDistant = [
      ...preMaterializeAllyMembers,
      ...preMaterializeEnemyMembers,
    ];
    expect(
      allSoldiersAfterDistant.some((s) => !s.alive || s.health < 100 || s.morale < 88)
    ).toBe(true);

    // Aproxima a posição do jogador do setor D para o BattlefieldDirector materializar os pelotões
    app.director.update(0.1, 30, sectorD!.center);

    expect(allyD!.lodLevel).not.toBe('strategic');
    expect(enemyD!.lodLevel).not.toBe('strategic');

    const postMaterializeAllyMembers = app.world.getSquadMembers('squad-ally-d');
    const postMaterializeEnemyMembers = app.world.getSquadMembers('squad-enemy-d');

    expect(postMaterializeAllyMembers.map((s) => ({
      id: s.id,
      alive: s.alive,
      health: s.health,
      morale: s.morale,
      woundLevel: s.woundLevel,
    }))).toEqual(preMaterializeAllyMembers);

    expect(postMaterializeEnemyMembers.map((s) => ({
      id: s.id,
      alive: s.alive,
      health: s.health,
      morale: s.morale,
      woundLevel: s.woundLevel,
    }))).toEqual(preMaterializeEnemyMembers);

    app.dispose();
  });

  it('persiste bônus estratégicos e sobreviventes entre operações via CampaignManager e SaveManager', async () => {
    const app = new GameApplication({ seed: 1945 });
    app.initializeMission(1, 1945);

    const saveManager = new SaveManager();
    const campaign = new CampaignManager(saveManager, app.bus);
    const completedEvents: Array<Extract<GameEvent, { type: 'mission.completed' }>> = [];
    app.bus.on('mission.completed', (evt) => completedEvents.push(evt));

    const rosterOp1: SoldierProfile[] = app.world
      .getSquadMembers('squad-player')
      .map((s, idx) => ({
        ...s,
        position: { ...s.position },
        // Simula 2 baixas e 2 feridos sobreviventes ao fim da Operação 1
        alive: idx < 6,
        state: idx < 6 ? (idx >= 4 ? 'wounded' : 'idle') : 'dead',
        health: idx < 4 ? 100 : idx < 6 ? 45 : 0,
        woundLevel: idx < 4 ? 'none' : idx < 6 ? 'moderate' : 'incapacitated',
        wounded: idx >= 4 && idx < 6,
      }));

    const op1Result: CampaignOperationResult = {
      missionId: 1,
      victory: true,
      durationSec: 420,
      kills: 15,
      tanksDestroyed: 1,
      secondaryObjectivesDone: 2,
      survivingSquadIds: ['squad-player'],
      lostSquadIds: [],
      sectorsCaptured: 3,
    };

    const stateAfterOp1 = campaign.recordOperationOutcome(op1Result, rosterOp1);

    expect(completedEvents).toHaveLength(1);
    expect(stateAfterOp1.completedOps).toEqual([1]);
    expect(stateAfterOp1.squadRoster).toHaveLength(6);
    expect(stateAfterOp1.squadRoster.every((s) => s.alive && s.health === s.maxHealth && s.woundLevel === 'none')).toBe(true);
    // expGain = 25 (victory) + 2*12 + 15 + 1*8 = 72; experiência inicial era 1 -> 73
    expect(stateAfterOp1.squadRoster[0].experience).toBe(73);
    // ammoBonus = 2*25 + 6*5 = 80; artilleryBonus = 3 + 1 = 4; supportLevel = 1 + 1 + 1 = 3
    expect(stateAfterOp1.ammoBonus).toBe(80);
    expect(stateAfterOp1.artilleryBonus).toBe(4);
    expect(stateAfterOp1.supportLevel).toBe(3);

    // Recria CampaignManager usando o mesmo SaveManager para validar persistência entre operações
    const reloadedCampaign = new CampaignManager(saveManager, app.bus);
    const loadedState = await reloadedCampaign.loadAsync();

    expect(loadedState.completedOps).toEqual([1]);
    expect(loadedState.squadRoster).toHaveLength(6);
    expect(loadedState.ammoBonus).toBe(80);
    expect(loadedState.artilleryBonus).toBe(4);
    expect(loadedState.supportLevel).toBe(3);

    const op2Result: CampaignOperationResult = {
      missionId: 2,
      victory: true,
      durationSec: 510,
      kills: 20,
      tanksDestroyed: 2,
      secondaryObjectivesDone: 1,
      survivingSquadIds: ['squad-player'],
      lostSquadIds: [],
      sectorsCaptured: 2,
    };

    const stateAfterOp2 = reloadedCampaign.recordOperationOutcome(
      op2Result,
      loadedState.squadRoster
    );

    expect(stateAfterOp2.completedOps).toEqual([1, 2]);
    expect(stateAfterOp2.history).toHaveLength(2);
    expect(stateAfterOp2.ammoBonus).toBe(80 + 25 + 30);
    expect(stateAfterOp2.artilleryBonus).toBe(4 + 2);
    expect(stateAfterOp2.supportLevel).toBe(3 + 1 + 1);
    expect(reloadedCampaign.getTotalSquadExperience()).toBeGreaterThan(
      stateAfterOp1.squadRoster.reduce((acc, s) => acc + s.experience, 0)
    );

    app.dispose();
  });
});
