import { clamp, DamageType } from '../../core/types';

const IMPULSE_BY_DAMAGE_TYPE: Record<DamageType, number> = {
  bullet: 16,
  heavy_mg: 32,
  shotgun: 18,
  sniper: 26,
  explosion: 60,
  shell: 75,
  fire: 24,
  melee: 6
};

export class SuppressionSystem {
  public computeSuppressionImpulse(
    distanceToImpact: number,
    radius: number,
    damageType: DamageType,
    coverFactor: number
  ): number {
    if (radius <= 0 || distanceToImpact > radius) {
      return 0;
    }

    const normalizedDist = clamp(distanceToImpact / radius, 0, 1);
    const falloff = Math.pow(1 - normalizedDist, 1.2);
    const baseImpulse = IMPULSE_BY_DAMAGE_TYPE[damageType];
    const coverMitigation = 1 - clamp(coverFactor, 0, 1) * 0.55;

    return Math.round(clamp(baseImpulse * falloff * coverMitigation, 0, 100) * 100) / 100;
  }

  public stepSuppression(current: number, dt: number, inCover: boolean): number {
    const safeCurrent = clamp(current, 0, 100);
    const safeDt = Math.max(0, dt);
    const decayRate = inCover ? 18 : 9;
    return clamp(safeCurrent - decayRate * safeDt, 0, 100);
  }

  public getAccuracyPenalty(suppression: number): number {
    const norm = clamp(suppression / 100, 0, 1);
    return Math.round(clamp(Math.pow(norm, 0.9) * 0.82, 0, 0.85) * 1000) / 1000;
  }
}
