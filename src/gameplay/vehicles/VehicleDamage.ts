import { EventBus } from '../../core/EventBus';
import { clamp, DamageContext, DamageResult, Faction, VehicleState } from '../../core/types';
import { DamageSystem } from '../combat/DamageSystem';

export interface VehicleSubsystemsState {
  hullHp: number;
  maxHullHp: number;
  engineHp: number;
  tracksHp: number;
  turretHp: number;
  cannonHp: number;
  crewAlive: number;
  state: VehicleState;
}

export class VehicleDamageSystem {
  private readonly bus?: EventBus;
  private readonly damageSystem = new DamageSystem();

  constructor(bus?: EventBus) {
    this.bus = bus;
  }

  public createTankState(heavy = false): VehicleSubsystemsState {
    if (heavy) {
      return {
        hullHp: 520,
        maxHullHp: 520,
        engineHp: 200,
        tracksHp: 170,
        turretHp: 240,
        cannonHp: 160,
        crewAlive: 5,
        state: 'idle'
      };
    }

    return {
      hullHp: 320,
      maxHullHp: 320,
      engineHp: 140,
      tracksHp: 120,
      turretHp: 160,
      cannonHp: 120,
      crewAlive: 4,
      state: 'idle'
    };
  }

  public applyHit(
    vehicleId: string,
    faction: Faction,
    sub: VehicleSubsystemsState,
    ctx: DamageContext
  ): DamageResult {
    const resolvedCtx: DamageContext = {
      ...ctx,
      hitZone: ctx.hitZone ?? 'armor_front',
      material: ctx.material ?? 'steel_heavy'
    };

    const result = this.damageSystem.resolveDamage(resolvedCtx);
    if (sub.state === 'destroyed') {
      return result;
    }

    const wasDisabledOrDestroyed = sub.state === 'disabled';

    if (result.finalDamage > 0) {
      sub.hullHp = Math.max(0, Math.round((sub.hullHp - result.finalDamage) * 100) / 100);
    }

    if (result.subsystemDamaged && result.finalDamage > 0) {
      let subsystemHpAfter = 0;

      switch (result.subsystemDamaged) {
        case 'tracks':
          sub.tracksHp = Math.max(0, Math.round((sub.tracksHp - result.finalDamage * 1.15) * 100) / 100);
          subsystemHpAfter = sub.tracksHp;
          break;
        case 'turret':
          sub.turretHp = Math.max(0, Math.round((sub.turretHp - result.finalDamage) * 100) / 100);
          subsystemHpAfter = sub.turretHp;
          break;
        case 'engine':
          sub.engineHp = Math.max(0, Math.round((sub.engineHp - result.finalDamage * 1.1) * 100) / 100);
          subsystemHpAfter = sub.engineHp;
          break;
        case 'cannon':
          sub.cannonHp = Math.max(0, Math.round((sub.cannonHp - result.finalDamage) * 100) / 100);
          subsystemHpAfter = sub.cannonHp;
          break;
        case 'crew': {
          const crewLoss = result.finalDamage >= 65 ? 2 : result.finalDamage >= 25 ? 1 : 0;
          sub.crewAlive = Math.max(0, sub.crewAlive - crewLoss);
          subsystemHpAfter = sub.crewAlive;
          break;
        }
      }

      this.bus?.emit('vehicle.subsystem.damaged', {
        vehicleId,
        subsystem: result.subsystemDamaged,
        hp: subsystemHpAfter
      });
    }

    if (sub.hullHp <= 0 || sub.crewAlive <= 0) {
      sub.state = 'destroyed';
      if (!wasDisabledOrDestroyed) {
        this.bus?.emit('vehicle.disabled', { vehicleId, faction });
      }
    } else if (sub.tracksHp <= 0 || sub.engineHp <= 0) {
      sub.state = 'disabled';
      if (!wasDisabledOrDestroyed) {
        this.bus?.emit('vehicle.disabled', { vehicleId, faction });
      }
    } else if (
      sub.hullHp < sub.maxHullHp * 0.7 ||
      sub.turretHp <= 0 ||
      sub.cannonHp <= 0
    ) {
      sub.state = 'damaged';
    }

    return result;
  }

  public canMove(sub: VehicleSubsystemsState): boolean {
    return (
      sub.state !== 'destroyed' &&
      sub.state !== 'disabled' &&
      sub.tracksHp > 0 &&
      sub.engineHp > 0 &&
      sub.crewAlive > 0
    );
  }

  public canRotateTurret(sub: VehicleSubsystemsState): boolean {
    return sub.state !== 'destroyed' && sub.turretHp > 0 && sub.crewAlive > 0;
  }

  public getTurretSpeedMult(sub: VehicleSubsystemsState): number {
    if (!this.canRotateTurret(sub)) {
      return 0;
    }
    return clamp(0.35 + (sub.turretHp / 160) * 0.65, 0.35, 1.0);
  }
}
