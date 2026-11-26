import { clamp, DoctrineType, Vec3, vec3Dist } from '../core/types';
import { getDoctrineProfile } from './DoctrineProfiles';

export interface CoverCandidate {
  id: string;
  position: Vec3;
  protection: number;
  visualAdvantage: number;
  routeSafety: number;
  occupied?: boolean;
}

/**
 * Avalia um ponto de cobertura segundo Score = w_p * P + w_v * V + w_d * D + w_r * R.
 */
export function scoreCoverCandidate(
  candidate: CoverCandidate,
  enemyPos: Vec3 | null,
  idealDist: number,
  doctrine: DoctrineType
): number {
  const profile = getDoctrineProfile(doctrine);

  const p = clamp(candidate.protection, 0, 1);
  const v = clamp(candidate.visualAdvantage, 0, 1);
  const r = clamp(candidate.routeSafety, 0, 1);

  let d = 0.7;
  if (enemyPos !== null) {
    const dist = vec3Dist(candidate.position, enemyPos);
    const safeIdeal = Math.max(4, idealDist);
    const tolerance = Math.max(10, safeIdeal * 0.9);
    d = clamp(1 - Math.abs(dist - safeIdeal) / tolerance, 0, 1);
  }

  const baseScore =
    profile.coverWeight * p +
    profile.visionWeight * v +
    profile.distanceWeight * d +
    profile.routeSafetyWeight * r;

  const occupiedPenalty = candidate.occupied ? 0.45 : 0;
  return Math.round(Math.max(0, baseScore - occupiedPenalty) * 10000) / 10000;
}

export function selectBestCover(
  candidates: readonly CoverCandidate[],
  enemyPos: Vec3 | null,
  idealDist: number,
  doctrine: DoctrineType
): CoverCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  let best: CoverCandidate | null = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const score = scoreCoverCandidate(candidate, enemyPos, idealDist, doctrine);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}
