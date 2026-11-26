import { Vec3, vec3Dist } from '../core/types';
import { CoverCandidate } from './CoverEvaluator';

function pickCoverNearWaypoint(
  target: Vec3,
  enemyPos: Vec3,
  candidates: readonly CoverCandidate[] | undefined,
  usedIds: Set<string>,
  minSafeEnemyDist: number
): Vec3 {
  if (!candidates || candidates.length === 0) {
    return target;
  }

  let bestCandidate: CoverCandidate | null = null;
  let bestScore = -Infinity;

  for (const c of candidates) {
    if (c.occupied || usedIds.has(c.id)) continue;
    const distToWaypoint = vec3Dist(c.position, target);
    if (distToWaypoint > 15) continue;

    const distToEnemy = vec3Dist(c.position, enemyPos);
    if (distToEnemy < minSafeEnemyDist) continue;

    const score = c.protection * 0.5 + c.routeSafety * 0.35 - distToWaypoint / 30;
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = c;
    }
  }

  if (bestCandidate) {
    usedIds.add(bestCandidate.id);
    return {
      x: bestCandidate.position.x,
      y: bestCandidate.position.y,
      z: bestCandidate.position.z
    };
  }

  return target;
}

/**
 * Planeja uma rota lateral de flanqueamento evitando avanço frontal direto e aproveitando coberturas seguras.
 */
export function computeFlankWaypoints(
  from: Vec3,
  enemyPos: Vec3,
  side: -1 | 1,
  coverCandidates?: readonly CoverCandidate[]
): Vec3[] {
  const dx = enemyPos.x - from.x;
  const dz = enemyPos.z - from.z;
  const dist = Math.hypot(dx, dz);

  const dirX = dist > 0.001 ? dx / dist : 0;
  const dirZ = dist > 0.001 ? dz / dist : -1;

  // Vetor lateral perpendicular ao eixo de engajamento no plano XZ
  const perpX = -dirZ * side;
  const perpZ = dirX * side;

  const lateralSwing = Math.max(12, Math.min(26, dist * 0.55));
  const minSafeEnemyDist = Math.max(9, Math.min(14, dist * 0.35));

  const rawStage: Vec3 = {
    x: from.x + dirX * (dist * 0.28) + perpX * (lateralSwing * 0.75),
    y: from.y,
    z: from.z + dirZ * (dist * 0.28) + perpZ * (lateralSwing * 0.75)
  };

  const rawAbeam: Vec3 = {
    x: enemyPos.x + perpX * lateralSwing,
    y: enemyPos.y,
    z: enemyPos.z + perpZ * lateralSwing
  };

  const rawStrike: Vec3 = {
    x: enemyPos.x + perpX * (lateralSwing * 0.72) + dirX * (lateralSwing * 0.45),
    y: enemyPos.y,
    z: enemyPos.z + perpZ * (lateralSwing * 0.72) + dirZ * (lateralSwing * 0.45)
  };

  const usedCoverIds = new Set<string>();
  return [
    pickCoverNearWaypoint(rawStage, enemyPos, coverCandidates, usedCoverIds, minSafeEnemyDist),
    pickCoverNearWaypoint(rawAbeam, enemyPos, coverCandidates, usedCoverIds, minSafeEnemyDist),
    pickCoverNearWaypoint(rawStrike, enemyPos, coverCandidates, usedCoverIds, minSafeEnemyDist)
  ];
}
