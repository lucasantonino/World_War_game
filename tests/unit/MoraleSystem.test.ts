import { describe, expect, it } from 'vitest';
import { computeMorale, updateSquadMorale } from '../../src/gameplay/squads/SquadMorale';

describe('MoraleSystem (SquadMorale)', () => {
  it('calcula moral alvo considerando baixas, supressão, perda de líder, isolamento e apoio aliado', () => {
    const base = computeMorale({
      baseMorale: 85,
      casualtyImpact: 0,
      suppression: 0,
      leaderLost: false,
      isolated: false,
      allySupport: 0,
    });
    expect(base).toBe(85);

    const withCasualties = computeMorale({
      baseMorale: 85,
      casualtyImpact: 25,
      suppression: 0,
      leaderLost: false,
      isolated: false,
      allySupport: 0,
    });
    expect(withCasualties).toBe(60);

    // 60 * 0.45 = 27
    const withSuppression = computeMorale({
      baseMorale: 85,
      casualtyImpact: 0,
      suppression: 60,
      leaderLost: false,
      isolated: false,
      allySupport: 0,
    });
    expect(withSuppression).toBeCloseTo(58, 5);

    // Perda de líder (-18) e isolamento (-14)
    const leaderAndIsolated = computeMorale({
      baseMorale: 85,
      casualtyImpact: 0,
      suppression: 0,
      leaderLost: true,
      isolated: true,
      allySupport: 0,
    });
    expect(leaderAndIsolated).toBe(53);

    // Apoio aliado (+15) compensando parte das penalidades
    const withAllySupport = computeMorale({
      baseMorale: 85,
      casualtyImpact: 20,
      suppression: 40, // -18
      leaderLost: true, // -18
      isolated: false,
      allySupport: 15,
    });
    expect(withAllySupport).toBe(44);

    // Saturação entre 0 e 100
    expect(
      computeMorale({
        baseMorale: 40,
        casualtyImpact: 50,
        suppression: 90,
        leaderLost: true,
        isolated: true,
        allySupport: 0,
      })
    ).toBe(0);

    expect(
      computeMorale({
        baseMorale: 95,
        casualtyImpact: 0,
        suppression: 0,
        leaderLost: false,
        isolated: false,
        allySupport: 25,
      })
    ).toBe(100);
  });

  it('atualiza a moral progressivamente sem saltar de 100 para 0 em um único passo', () => {
    const afterOneSecDrop = updateSquadMorale(100, 0, 1.0);
    expect(afterOneSecDrop).toBe(86);
    expect(afterOneSecDrop).toBeGreaterThan(0);
    expect(afterOneSecDrop).toBeLessThan(100);

    const afterExplosionTick = updateSquadMorale(100, 0, 0.25);
    expect(afterExplosionTick).toBe(96.5);

    // Simula vários passos de 1s até convergir para 0
    let morale = 100;
    for (let i = 0; i < 4; i++) {
      morale = updateSquadMorale(morale, 0, 1.0);
    }
    expect(morale).toBe(44);

    for (let i = 0; i < 5; i++) {
      morale = updateSquadMorale(morale, 0, 1.0);
    }
    expect(morale).toBe(0);

    // Recuperação progressiva também respeita o teto de 8/s
    const afterRecovery = updateSquadMorale(20, 100, 1.0);
    expect(afterRecovery).toBe(28);
    expect(updateSquadMorale(50, 50, 1.0)).toBe(50);
    expect(updateSquadMorale(80, 10, 0)).toBe(80);
  });
});
