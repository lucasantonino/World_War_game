import { clamp } from '../../core/types';

export interface MoraleInputs {
  baseMorale: number;
  casualtyImpact: number;
  suppression: number;
  leaderLost: boolean;
  isolated: boolean;
  allySupport: number;
}

const LEADER_LOST_PENALTY = 18;
const ISOLATION_PENALTY = 14;
const SUPPRESSION_TO_MORALE_FACTOR = 0.45;
const MAX_MORALE_DROP_PER_SEC = 14;
const MAX_MORALE_RECOVERY_PER_SEC = 8;

/**
 * Calcula a moral alvo do pelotão segundo M = clamp(M_0 - B - S - L - I + A, 0, 100).
 */
export function computeMorale(inputs: MoraleInputs): number {
  const m0 = clamp(inputs.baseMorale, 0, 100);
  const b = Math.max(0, inputs.casualtyImpact);
  const s = clamp(inputs.suppression, 0, 100) * SUPPRESSION_TO_MORALE_FACTOR;
  const l = inputs.leaderLost ? LEADER_LOST_PENALTY : 0;
  const i = inputs.isolated ? ISOLATION_PENALTY : 0;
  const a = Math.max(0, inputs.allySupport);

  return clamp(m0 - b - s - l - i + a, 0, 100);
}

/**
 * Atualiza a moral progressivamente com taxa máxima por segundo para evitar
 * quedas instantâneas de 100 para 0 em uma única explosão.
 */
export function updateSquadMorale(
  currentMorale: number,
  targetMorale: number,
  dt: number
): number {
  const safeCurrent = clamp(currentMorale, 0, 100);
  const safeTarget = clamp(targetMorale, 0, 100);
  const safeDt = Math.max(0, dt);

  const delta = safeTarget - safeCurrent;
  if (Math.abs(delta) < 0.001 || safeDt === 0) {
    return safeCurrent;
  }

  const maxDeltaPerSec = delta < 0 ? MAX_MORALE_DROP_PER_SEC : MAX_MORALE_RECOVERY_PER_SEC;
  const maxStep = maxDeltaPerSec * safeDt;
  const applied = clamp(delta, -maxStep, maxStep);

  return clamp(safeCurrent + applied, 0, 100);
}
