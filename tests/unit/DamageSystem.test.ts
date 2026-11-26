import { describe, expect, it } from 'vitest';
import type { DamageContext } from '../../src/core/types';
import { DamageSystem } from '../../src/gameplay/combat/DamageSystem';

function makeContext(overrides: Partial<DamageContext> = {}): DamageContext {
  return {
    sourceId: 'shooter-1',
    targetId: 'target-1',
    damageType: 'bullet',
    baseDamage: 40,
    impactPosition: { x: 0, y: 1.5, z: 0 },
    hitZone: 'torso',
    distance: 10,
    material: 'flesh',
    targetCoverFactor: 0,
    ...overrides,
  };
}

describe('DamageSystem', () => {
  const damageSystem = new DamageSystem();

  it('aplica multiplicadores distintos para headshot, torso e membro', () => {
    const head = damageSystem.resolveDamage(makeContext({ hitZone: 'head', baseDamage: 40 }));
    const torso = damageSystem.resolveDamage(makeContext({ hitZone: 'torso', baseDamage: 40 }));
    const limb = damageSystem.resolveDamage(makeContext({ hitZone: 'limb', baseDamage: 40 }));

    expect(head.finalDamage).toBe(92);
    expect(torso.finalDamage).toBe(40);
    expect(limb.finalDamage).toBe(26);

    expect(head.finalDamage).toBeGreaterThan(torso.finalDamage);
    expect(torso.finalDamage).toBeGreaterThan(limb.finalDamage);
    expect(head.fatal).toBe(true);
    expect(torso.fatal).toBe(false);
    expect(limb.fatal).toBe(false);
  });

  it('mitiga dano e impulso de supressão conforme o fator de cobertura', () => {
    const exposed = damageSystem.resolveDamage(
      makeContext({ damageType: 'bullet', baseDamage: 50, targetCoverFactor: 0 })
    );
    const inCover = damageSystem.resolveDamage(
      makeContext({ damageType: 'bullet', baseDamage: 50, targetCoverFactor: 0.8 })
    );
    const explosionExposed = damageSystem.resolveDamage(
      makeContext({ damageType: 'explosion', baseDamage: 80, targetCoverFactor: 0 })
    );
    const explosionInCover = damageSystem.resolveDamage(
      makeContext({ damageType: 'explosion', baseDamage: 80, targetCoverFactor: 0.8 })
    );

    // Cobertura reduz projéteis em 65% do fator (0.8 * 0.65 = 0.52 -> 48% restante)
    expect(inCover.finalDamage).toBeCloseTo(exposed.finalDamage * 0.48, 2);
    expect(inCover.suppressionImpulse).toBeLessThan(exposed.suppressionImpulse);

    // Cobertura reduz explosões em 42% do fator (0.8 * 0.42 = 0.336 -> 66.4% restante)
    expect(explosionInCover.finalDamage).toBeCloseTo(explosionExposed.finalDamage * 0.664, 2);
  });

  it('diferencia resistência e penetração entre flesh e steel_heavy', () => {
    const fleshHit = damageSystem.resolveDamage(
      makeContext({
        damageType: 'bullet',
        baseDamage: 50,
        hitZone: 'torso',
        material: 'flesh',
      })
    );
    const steelBulletHit = damageSystem.resolveDamage(
      makeContext({
        damageType: 'bullet',
        baseDamage: 50,
        hitZone: 'armor_front',
        material: 'steel_heavy',
      })
    );
    const steelShellHit = damageSystem.resolveDamage(
      makeContext({
        damageType: 'shell',
        baseDamage: 140,
        hitZone: 'armor_front',
        material: 'steel_heavy',
      })
    );

    expect(fleshHit.penetration).toBeGreaterThan(steelBulletHit.penetration);
    expect(steelBulletHit.finalDamage).toBeLessThan(fleshHit.finalDamage * 0.05);
    expect(steelBulletHit.woundLevel).toBe('none');
    expect(steelBulletHit.causesBleeding).toBe(false);

    expect(steelShellHit.penetration).toBeGreaterThan(steelBulletHit.penetration);
    expect(steelShellHit.finalDamage).toBeGreaterThan(steelBulletHit.finalDamage * 10);
    expect(steelShellHit.subsystemDamaged).toBe('cannon');
  });

  it('classifica corretamente os 4 graus de ferimento e sangramento', () => {
    const none = damageSystem.resolveDamage(makeContext({ baseDamage: 0.4 }));
    const light = damageSystem.resolveDamage(makeContext({ baseDamage: 12 }));
    const moderate = damageSystem.resolveDamage(makeContext({ baseDamage: 30 }));
    const severe = damageSystem.resolveDamage(makeContext({ baseDamage: 60 }));
    const incapacitated = damageSystem.resolveDamage(makeContext({ baseDamage: 80 }));
    const fireModerate = damageSystem.resolveDamage(
      makeContext({ damageType: 'fire', baseDamage: 30 })
    );

    expect(none.woundLevel).toBe('none');
    expect(none.causesBleeding).toBe(false);

    expect(light.woundLevel).toBe('light');
    expect(light.causesBleeding).toBe(false);

    expect(moderate.woundLevel).toBe('moderate');
    expect(moderate.causesBleeding).toBe(true);

    expect(severe.woundLevel).toBe('severe');
    expect(severe.causesBleeding).toBe(true);

    expect(incapacitated.woundLevel).toBe('incapacitated');
    expect(incapacitated.causesBleeding).toBe(true);
    expect(incapacitated.fatal).toBe(false);

    expect(fireModerate.woundLevel).toBe('moderate');
    expect(fireModerate.causesBleeding).toBe(false);
  });

  it('aplica queda balística severa para shotgun à distância e preserva dano do sniper', () => {
    const shotgunClose = damageSystem.resolveDamage(
      makeContext({ damageType: 'shotgun', baseDamage: 60, distance: 5 })
    );
    const shotgunMid = damageSystem.resolveDamage(
      makeContext({ damageType: 'shotgun', baseDamage: 60, distance: 29 })
    );
    const shotgunFar = damageSystem.resolveDamage(
      makeContext({ damageType: 'shotgun', baseDamage: 60, distance: 80 })
    );

    const sniperClose = damageSystem.resolveDamage(
      makeContext({ damageType: 'sniper', baseDamage: 70, distance: 10 })
    );
    const sniperFar = damageSystem.resolveDamage(
      makeContext({ damageType: 'sniper', baseDamage: 70, distance: 250 })
    );

    expect(shotgunClose.finalDamage).toBe(60);
    expect(shotgunMid.finalDamage).toBe(30);
    expect(shotgunFar.finalDamage).toBeCloseTo(60 * 0.12, 2);

    expect(sniperClose.finalDamage).toBe(70);
    expect(sniperFar.finalDamage).toBe(70);
  });
});
