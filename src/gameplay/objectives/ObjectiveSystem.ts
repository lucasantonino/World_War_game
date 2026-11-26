import { BattlefieldSector, Faction } from '../../core/types';

export type ObjectiveKind = 'capture_sector' | 'defend_sector' | 'eliminate_threat';
export type ObjectivePriority = 'primary' | 'secondary';
export type ObjectiveStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface ObjectiveDefinition {
  id: string;
  titlePtBr: string;
  descriptionPtBr: string;
  priority: ObjectivePriority;
  kind: ObjectiveKind;
  sectorId?: string;
  targetFaction?: Faction;
  requiredHoldSec?: number;
  threatTargetCount?: number;
}

export interface ObjectiveRuntimeState extends ObjectiveDefinition {
  status: ObjectiveStatus;
  progress: number; // 0..1
  holdTimerSec: number;
}

export class ObjectiveSystem {
  private readonly objectives = new Map<string, ObjectiveRuntimeState>();

  public addObjective(def: ObjectiveDefinition, initialStatus: ObjectiveStatus = 'active'): ObjectiveRuntimeState {
    const state: ObjectiveRuntimeState = {
      ...def,
      status: initialStatus,
      progress: 0,
      holdTimerSec: 0
    };
    this.objectives.set(def.id, state);
    return { ...state };
  }

  public activateObjective(id: string): void {
    const obj = this.objectives.get(id);
    if (obj && obj.status === 'pending') {
      obj.status = 'active';
    }
  }

  public completeObjective(id: string): void {
    const obj = this.objectives.get(id);
    if (obj && obj.status !== 'failed') {
      obj.status = 'completed';
      obj.progress = 1;
    }
  }

  public failObjective(id: string): void {
    const obj = this.objectives.get(id);
    if (obj && obj.status !== 'completed') {
      obj.status = 'failed';
    }
  }

  public evaluate(
    sectors: ReadonlyMap<string, BattlefieldSector> | readonly BattlefieldSector[],
    eliminatedThreats = 0,
    dt = 0
  ): ObjectiveRuntimeState[] {
    const sectorLookup = new Map<string, BattlefieldSector>();
    if (Array.isArray(sectors)) {
      for (const s of sectors) {
        sectorLookup.set(s.id, s);
      }
    } else {
      for (const [k, v] of (sectors as ReadonlyMap<string, BattlefieldSector>).entries()) {
        sectorLookup.set(k, v);
      }
    }

    const safeDt = Math.max(0, dt);

    for (const obj of this.objectives.values()) {
      if (obj.status !== 'active') continue;

      if (obj.kind === 'capture_sector' && obj.sectorId) {
        const sector = sectorLookup.get(obj.sectorId);
        if (!sector) continue;

        const targetFaction = obj.targetFaction ?? 'ally';
        if (sector.owner === targetFaction && !sector.contested) {
          const reqHold = obj.requiredHoldSec ?? 0;
          if (reqHold > 0) {
            obj.holdTimerSec += safeDt;
            obj.progress = Math.min(1, obj.holdTimerSec / reqHold);
            if (obj.holdTimerSec >= reqHold) {
              obj.status = 'completed';
              obj.progress = 1;
            }
          } else {
            obj.status = 'completed';
            obj.progress = 1;
          }
        } else {
          obj.holdTimerSec = Math.max(0, obj.holdTimerSec - safeDt * 0.5);
          obj.progress = Math.max(0, Math.min(0.95, (sector.controlProgress + 100) / 200));
        }
      } else if (obj.kind === 'defend_sector' && obj.sectorId) {
        const sector = sectorLookup.get(obj.sectorId);
        if (!sector) continue;

        const targetFaction = obj.targetFaction ?? 'ally';
        if (sector.owner !== targetFaction && !sector.contested) {
          obj.status = 'failed';
          obj.progress = 0;
        } else {
          const reqHold = Math.max(1, obj.requiredHoldSec ?? 60);
          obj.holdTimerSec += safeDt;
          obj.progress = Math.min(1, obj.holdTimerSec / reqHold);
          if (obj.holdTimerSec >= reqHold) {
            obj.status = 'completed';
            obj.progress = 1;
          }
        }
      } else if (obj.kind === 'eliminate_threat') {
        const required = Math.max(1, obj.threatTargetCount ?? 1);
        obj.progress = Math.min(1, eliminatedThreats / required);
        if (eliminatedThreats >= required) {
          obj.status = 'completed';
          obj.progress = 1;
        }
      }
    }

    return this.getObjectives();
  }

  public getObjectives(): ObjectiveRuntimeState[] {
    return Array.from(this.objectives.values(), (o) => ({ ...o }));
  }

  public getObjective(id: string): ObjectiveRuntimeState | null {
    const obj = this.objectives.get(id);
    return obj ? { ...obj } : null;
  }

  public getPrimaryCompletedCount(): number {
    let count = 0;
    for (const o of this.objectives.values()) {
      if (o.priority === 'primary' && o.status === 'completed') count++;
    }
    return count;
  }

  public getSecondaryCompletedCount(): number {
    let count = 0;
    for (const o of this.objectives.values()) {
      if (o.priority === 'secondary' && o.status === 'completed') count++;
    }
    return count;
  }

  public areAllPrimariesCompleted(): boolean {
    let hasPrimary = false;
    for (const o of this.objectives.values()) {
      if (o.priority === 'primary') {
        hasPrimary = true;
        if (o.status !== 'completed') return false;
      }
    }
    return hasPrimary;
  }

  public hasPrimaryFailed(): boolean {
    for (const o of this.objectives.values()) {
      if (o.priority === 'primary' && o.status === 'failed') return true;
    }
    return false;
  }

  public clear(): void {
    this.objectives.clear();
  }
}
