import { clamp, type Faction } from '../core/types.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

export interface SupplyStatus {
  faction: Exclude<Faction, 'neutral'>;
  controlledSectors: number;
  supplyFactor: number;
  ammoReserve: number;
  resupplyRatePerSec: number;
}

/**
 * Calcula disponibilidade logística e reabastecimento de munição a partir dos setores controlados.
 */
export class LogisticsSystem {
  private readonly world: SimulationWorld;
  private readonly ammoStock: Record<'ally' | 'enemy', number> = {
    ally: 300,
    enemy: 320,
  };

  constructor(world: SimulationWorld) {
    this.world = world;
  }

  public getSupplyStatus(faction: Exclude<Faction, 'neutral'>): SupplyStatus {
    const owned = this.world.sectors.filter((s) => s.owner === faction);
    const uncontestedWeight = owned.reduce((acc, sector) => {
      const penalty = sector.contested ? 0.45 : 1;
      return acc + sector.strategicValue * penalty;
    }, 0);

    const supplyFactor = clamp(0.25 + uncontestedWeight / 80, 0.25, 1.5);
    const resupplyRatePerSec = owned.length * 1.4 * supplyFactor;

    return {
      faction,
      controlledSectors: owned.length,
      supplyFactor,
      ammoReserve: Math.round(this.ammoStock[faction]),
      resupplyRatePerSec,
    };
  }

  public consumeAmmo(faction: Exclude<Faction, 'neutral'>, amount: number): boolean {
    if (amount <= 0) return true;
    if (this.ammoStock[faction] < amount) return false;
    this.ammoStock[faction] -= amount;
    return true;
  }

  public update(dt: number): void {
    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    if (safeDt <= 0) return;

    for (const faction of ['ally', 'enemy'] as const) {
      const status = this.getSupplyStatus(faction);
      this.ammoStock[faction] = clamp(
        this.ammoStock[faction] + status.resupplyRatePerSec * safeDt,
        0,
        1200
      );
    }

    // Reabastece gradualmente soldados em setores aliados sem supressão crítica.
    for (const soldier of this.world.soldiers.values()) {
      if (!soldier.alive || soldier.faction === 'neutral') continue;
      if (soldier.ammunition >= 120 || soldier.suppression > 65) continue;

      const sector = this.world.getSectorAt(soldier.position);
      if (sector && sector.owner === soldier.faction && !sector.contested) {
        const faction = soldier.faction;
        const status = this.getSupplyStatus(faction);
        const replenish = Math.min(
          120 - soldier.ammunition,
          4 * status.supplyFactor * safeDt
        );
        if (replenish > 0 && this.consumeAmmo(faction, replenish * 0.25)) {
          soldier.ammunition += replenish;
        }
      }
    }
  }
}
