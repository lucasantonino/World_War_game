import { clamp, Faction, PerceivedEntity, PerceptionState, Vec3 } from '../core/types';

interface InternalPerceivedRecord {
  entity: PerceivedEntity;
  lastEvaluatedAt: number;
}

const CONTACT_LOSS_THRESHOLD_SEC = 3.5;
const MIN_CONFIDENCE = 0.12;

const STATE_PRIORITY: Record<PerceptionState, number> = {
  unaware: 0,
  suspicious: 1,
  lost_contact: 2,
  investigating: 3,
  detected: 4,
  engaging: 5
};

function resolveStimulusState(
  source: 'visual' | 'audio' | 'radio',
  confidence: number
): PerceptionState {
  if (source === 'visual') {
    if (confidence >= 0.78) return 'engaging';
    if (confidence >= 0.45) return 'detected';
    return 'investigating';
  }
  if (source === 'radio') {
    if (confidence >= 0.65) return 'detected';
    if (confidence >= 0.35) return 'investigating';
    return 'suspicious';
  }
  // audio
  if (confidence >= 0.55) return 'investigating';
  return 'suspicious';
}

export class PerceptionEngine {
  private readonly observers = new Map<string, Map<string, InternalPerceivedRecord>>();

  public reportStimulus(
    observerId: string,
    targetId: string,
    faction: Faction,
    pos: Vec3,
    source: 'visual' | 'audio' | 'radio',
    strength: number,
    nowSec: number
  ): PerceivedEntity {
    let targetMap = this.observers.get(observerId);
    if (!targetMap) {
      targetMap = new Map<string, InternalPerceivedRecord>();
      this.observers.set(observerId, targetMap);
    }

    const safeStrength = clamp(strength, 0, 1);
    const baseGain =
      source === 'visual'
        ? 0.38 + safeStrength * 0.62
        : source === 'radio'
          ? 0.28 + safeStrength * 0.46
          : 0.2 + safeStrength * 0.48;

    const existing = targetMap.get(targetId);
    const prevConfidence = existing?.entity.confidence ?? 0;
    const confidence = clamp(Math.max(baseGain, prevConfidence * 0.6 + baseGain * 0.55), 0, 1);

    const nextState = resolveStimulusState(source, confidence);
    const threatBase = source === 'visual' ? 0.75 : source === 'radio' ? 0.6 : 0.45;
    const threatLevel = clamp(threatBase * 0.5 + safeStrength * 0.5, 0.1, 1);

    const entity: PerceivedEntity = {
      entityId: targetId,
      faction,
      // Copia defensiva: nunca guarda referência direta ao vetor mutável da entidade real
      lastKnownPosition: { x: pos.x, y: pos.y, z: pos.z },
      confidence: Math.round(confidence * 1000) / 1000,
      threatLevel: Math.round(threatLevel * 1000) / 1000,
      lastSeenAt: nowSec,
      source,
      state:
        existing && STATE_PRIORITY[existing.entity.state] > STATE_PRIORITY[nextState] && source !== 'visual'
          ? existing.entity.state
          : nextState
    };

    targetMap.set(targetId, {
      entity,
      lastEvaluatedAt: nowSec
    });

    return {
      ...entity,
      lastKnownPosition: { ...entity.lastKnownPosition }
    };
  }

  public shareWithSquad(
    squadMemberIds: string[],
    targetId: string,
    faction: Faction,
    pos: Vec3,
    nowSec: number
  ): void {
    for (const memberId of squadMemberIds) {
      if (memberId === targetId) continue;
      this.reportStimulus(memberId, targetId, faction, pos, 'radio', 0.65, nowSec);
    }
  }

  public decayAll(
    nowSec: number,
    hasVisualLos?: (observerId: string, targetId: string) => boolean
  ): void {
    for (const [observerId, targetMap] of this.observers.entries()) {
      for (const [targetId, record] of targetMap.entries()) {
        const entity = record.entity;
        const hasLos = hasVisualLos ? hasVisualLos(observerId, targetId) : false;

        if (hasLos) {
          entity.lastSeenAt = nowSec;
          entity.confidence = clamp(entity.confidence + 0.15, 0.55, 1.0);
          entity.source = 'visual';
          entity.state = entity.confidence >= 0.78 ? 'engaging' : 'detected';
          record.lastEvaluatedAt = nowSec;
          continue;
        }

        const dt = Math.max(0, nowSec - record.lastEvaluatedAt);
        record.lastEvaluatedAt = nowSec;

        const timeSinceContact = Math.max(0, nowSec - entity.lastSeenAt);

        if (
          timeSinceContact > CONTACT_LOSS_THRESHOLD_SEC &&
          (entity.state === 'detected' || entity.state === 'engaging')
        ) {
          entity.state = 'lost_contact';
        }

        const decayRate = timeSinceContact > CONTACT_LOSS_THRESHOLD_SEC ? 0.12 : 0.06;
        entity.confidence = clamp(entity.confidence - decayRate * dt, 0, 1);

        if (entity.confidence < MIN_CONFIDENCE) {
          targetMap.delete(targetId);
        }
      }
    }
  }

  public getPrimaryTarget(observerId: string): PerceivedEntity | null {
    const targetMap = this.observers.get(observerId);
    if (!targetMap || targetMap.size === 0) {
      return null;
    }

    let best: PerceivedEntity | null = null;
    let bestScore = -1;

    for (const { entity } of targetMap.values()) {
      const stateBonus =
        entity.state === 'engaging'
          ? 1.4
          : entity.state === 'detected'
            ? 1.25
            : entity.state === 'investigating'
              ? 0.9
              : entity.state === 'lost_contact'
                ? 0.7
                : 0.5;
      const score = entity.confidence * entity.threatLevel * stateBonus;
      if (score > bestScore) {
        bestScore = score;
        best = entity;
      }
    }

    if (!best) return null;
    return {
      ...best,
      lastKnownPosition: { ...best.lastKnownPosition }
    };
  }

  public getObserverState(observerId: string): PerceptionState {
    const targetMap = this.observers.get(observerId);
    if (!targetMap || targetMap.size === 0) {
      return 'unaware';
    }

    let highest: PerceptionState = 'unaware';
    for (const { entity } of targetMap.values()) {
      if (STATE_PRIORITY[entity.state] > STATE_PRIORITY[highest]) {
        highest = entity.state;
      }
    }
    return highest;
  }

  public getObserverTargets(observerId: string): PerceivedEntity[] {
    const targetMap = this.observers.get(observerId);
    if (!targetMap) return [];
    return Array.from(targetMap.values(), ({ entity }) => ({
      ...entity,
      lastKnownPosition: { ...entity.lastKnownPosition }
    }));
  }

  public clearObserver(observerId: string): void {
    this.observers.delete(observerId);
  }
}
