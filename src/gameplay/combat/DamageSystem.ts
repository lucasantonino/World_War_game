import {
  clamp,
  DamageContext,
  DamageResult,
  DamageType,
  HitZone,
  MaterialType,
  VehicleSubsystem,
  WoundLevel
} from '../../core/types';

const HIT_ZONE_MULTIPLIERS: Record<HitZone, number> = {
  head: 2.3,
  torso: 1.0,
  limb: 0.65,
  armor_front: 0.25,
  armor_side: 0.55,
  armor_rear: 0.85,
  tracks: 0.7,
  turret: 0.45,
  engine: 0.8
};

const BASE_PENETRATION_POWER: Record<DamageType, number> = {
  bullet: 0.35,
  shotgun: 0.22,
  heavy_mg: 0.62,
  sniper: 0.75,
  explosion: 0.68,
  shell: 0.96,
  fire: 0.4,
  melee: 0.25
};

const MATERIAL_RESISTANCE: Record<MaterialType, number> = {
  flesh: 0.0,
  wood: 0.18,
  sandbag: 0.34,
  masonry: 0.46,
  concrete: 0.64,
  steel_light: 0.54,
  steel_heavy: 0.86
};

const BASE_SUPPRESSION_BY_TYPE: Record<DamageType, number> = {
  bullet: 14,
  heavy_mg: 28,
  shotgun: 16,
  sniper: 22,
  explosion: 44,
  shell: 56,
  fire: 18,
  melee: 6
};

function isArmoredZone(hitZone?: HitZone): boolean {
  return (
    hitZone === 'armor_front' ||
    hitZone === 'armor_side' ||
    hitZone === 'armor_rear' ||
    hitZone === 'tracks' ||
    hitZone === 'turret' ||
    hitZone === 'engine'
  );
}

function computeDistanceFalloff(damageType: DamageType, distance: number): number {
  const d = Math.max(0, distance);
  switch (damageType) {
    case 'sniper':
    case 'shell':
    case 'explosion':
    case 'fire':
    case 'melee':
      return 1.0;
    case 'shotgun': {
      if (d <= 8) return 1.0;
      return clamp(1.0 - (d - 8) / 42, 0.12, 1.0);
    }
    case 'heavy_mg': {
      if (d <= 45) return 1.0;
      return clamp(1.0 - (d - 45) / 260, 0.45, 1.0);
    }
    case 'bullet': {
      if (d <= 25) return 1.0;
      return clamp(1.0 - (d - 25) / 210, 0.32, 1.0);
    }
  }
}

function computeArmorZoneScale(hitZone: HitZone, damageType: DamageType, baseDamage: number): number {
  if (hitZone === 'armor_front') {
    if (damageType === 'bullet' || damageType === 'shotgun' || damageType === 'melee') return 0.03;
    if (damageType === 'sniper') return 0.07;
    if (damageType === 'heavy_mg') return 0.12;
    if (damageType === 'explosion') return baseDamage < 70 ? 0.2 : 0.45;
    if (damageType === 'shell') return 0.85;
    if (damageType === 'fire') return 0.18;
  }

  if (hitZone === 'armor_side') {
    if (damageType === 'bullet' || damageType === 'shotgun') return 0.08;
    if (damageType === 'sniper') return 0.18;
    if (damageType === 'heavy_mg') return 0.32;
    if (damageType === 'explosion') return 0.62;
    if (damageType === 'shell') return 1.15;
    if (damageType === 'fire') return 0.4;
    return 0.05;
  }

  if (hitZone === 'armor_rear') {
    if (damageType === 'bullet' || damageType === 'shotgun') return 0.14;
    if (damageType === 'sniper') return 0.28;
    if (damageType === 'heavy_mg') return 0.48;
    if (damageType === 'explosion') return 0.82;
    if (damageType === 'shell') return 1.4;
    if (damageType === 'fire') return 0.65;
    return 0.08;
  }

  if (hitZone === 'tracks') {
    if (damageType === 'bullet' || damageType === 'shotgun') return 0.15;
    if (damageType === 'heavy_mg') return 0.42;
    if (damageType === 'explosion' || damageType === 'shell') return 1.2;
    return 0.35;
  }

  if (hitZone === 'turret') {
    if (damageType === 'bullet' || damageType === 'shotgun') return 0.05;
    if (damageType === 'heavy_mg') return 0.22;
    if (damageType === 'explosion') return 0.58;
    if (damageType === 'shell') return 1.0;
    return 0.25;
  }

  // engine
  if (damageType === 'bullet' || damageType === 'shotgun') return 0.16;
  if (damageType === 'heavy_mg') return 0.5;
  if (damageType === 'explosion') return 0.88;
  if (damageType === 'shell') return 1.3;
  if (damageType === 'fire') return 0.85;
  return 0.2;
}

function resolveSubsystem(hitZone: HitZone | undefined, finalDamage: number): VehicleSubsystem | undefined {
  if (!hitZone || finalDamage <= 2) return undefined;
  switch (hitZone) {
    case 'tracks':
      return 'tracks';
    case 'turret':
      return finalDamage >= 45 ? 'cannon' : 'turret';
    case 'engine':
    case 'armor_rear':
      return 'engine';
    case 'armor_front':
      return finalDamage >= 40 ? 'cannon' : 'turret';
    case 'armor_side':
      return finalDamage >= 35 ? 'crew' : 'tracks';
    default:
      return undefined;
  }
}

function classifyWound(finalDamage: number, armoredTarget: boolean): WoundLevel {
  if (armoredTarget || finalDamage <= 0.5) return 'none';
  if (finalDamage < 18) return 'light';
  if (finalDamage < 42) return 'moderate';
  if (finalDamage < 75) return 'severe';
  return 'incapacitated';
}

export class DamageSystem {
  public resolveDamage(ctx: DamageContext): DamageResult {
    const hitZone: HitZone = ctx.hitZone ?? 'torso';
    const material: MaterialType = ctx.material ?? 'flesh';
    const coverFactor = clamp(ctx.targetCoverFactor ?? 0, 0, 1);

    const armoredZone = isArmoredZone(hitZone);
    const armoredMaterial = material === 'steel_heavy' || material === 'steel_light';
    const armoredTarget = armoredZone || armoredMaterial;

    const falloff = computeDistanceFalloff(ctx.damageType, ctx.distance);

    const penPower = BASE_PENETRATION_POWER[ctx.damageType];
    const matResistance = MATERIAL_RESISTANCE[material];
    const zonePenalty = hitZone === 'armor_front' ? 1.15 : hitZone === 'turret' ? 1.05 : 0.85;
    const rawPenetration = clamp(
      penPower - matResistance * (armoredTarget ? zonePenalty : 0.7) + 0.35,
      0.02,
      1.0
    );

    const materialMultiplier =
      material === 'flesh'
        ? 1.0
        : material === 'steel_heavy'
          ? clamp(rawPenetration * 1.15, 0.04, 1.0)
          : material === 'steel_light'
            ? clamp(rawPenetration * 1.25, 0.1, 1.0)
            : clamp(1.0 - matResistance * 0.65, 0.25, 1.0);

    const zoneMultiplier = armoredZone
      ? computeArmorZoneScale(hitZone, ctx.damageType, ctx.baseDamage)
      : HIT_ZONE_MULTIPLIERS[hitZone];

    const coverMitigation =
      ctx.damageType === 'melee' || ctx.damageType === 'fire'
        ? 1.0 - coverFactor * 0.1
        : ctx.damageType === 'explosion' || ctx.damageType === 'shell'
          ? 1.0 - coverFactor * 0.42
          : 1.0 - coverFactor * 0.65;

    const finalDamage = Math.max(
      0,
      ctx.baseDamage * falloff * zoneMultiplier * materialMultiplier * coverMitigation
    );

    const woundLevel = classifyWound(finalDamage, armoredTarget);
    const causesBleeding =
      !armoredTarget &&
      (woundLevel === 'moderate' || woundLevel === 'severe' || woundLevel === 'incapacitated') &&
      ctx.damageType !== 'fire';

    const suppressionImpulse = clamp(
      BASE_SUPPRESSION_BY_TYPE[ctx.damageType] * (1.0 - coverFactor * 0.35) * (0.6 + 0.4 * falloff),
      0,
      100
    );

    const subsystemDamaged = armoredTarget ? resolveSubsystem(hitZone, finalDamage) : undefined;
    const fatal = !armoredTarget && (finalDamage >= 100 || (hitZone === 'head' && finalDamage >= 85));

    return {
      finalDamage: Math.round(finalDamage * 100) / 100,
      penetration: Math.round(rawPenetration * 1000) / 1000,
      woundLevel,
      causesBleeding,
      suppressionImpulse: Math.round(suppressionImpulse * 100) / 100,
      subsystemDamaged,
      fatal
    };
  }
}
