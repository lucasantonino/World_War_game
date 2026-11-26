import type { EventBus } from '../core/EventBus.ts';
import { clamp, type BattlefieldSector, type Faction } from '../core/types.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

/**
 * Cria os 5 setores militares padrão para uma operação de campanha.
 */
export function createDefaultSectorsForMission(
  missionId: number
): BattlefieldSector[] {
  const lateralShift = ((missionId % 3) - 1) * 8;

  return [
    {
      id: 'sector-a',
      code: 'A',
      name: 'A — Trincheira Aliada',
      owner: 'ally',
      controlProgress: 95,
      strategicValue: 20,
      threatLevel: 15,
      activeSquads: [],
      reinforcementPoints: 2,
      contested: false,
      center: { x: lateralShift * 0.5, y: 0, z: 70 },
      radius: 34,
    },
    {
      id: 'sector-b',
      code: 'B',
      name: 'B — Estrada / Setor Contestável',
      owner: 'neutral',
      controlProgress: 50,
      strategicValue: 25,
      threatLevel: 45,
      activeSquads: [],
      reinforcementPoints: 2,
      contested: true,
      center: { x: 18 + lateralShift, y: 0, z: 22 },
      radius: 32,
    },
    {
      id: 'sector-c',
      code: 'C',
      name: 'C — Vilarejo / Centro',
      owner: 'enemy',
      controlProgress: 25,
      strategicValue: 35,
      threatLevel: 65,
      activeSquads: [],
      reinforcementPoints: 3,
      contested: false,
      center: { x: -6 + lateralShift * 0.5, y: 0, z: -26 },
      radius: 36,
    },
    {
      id: 'sector-d',
      code: 'D',
      name: 'D — Floresta / Flanco Oeste',
      owner: 'neutral',
      controlProgress: 45,
      strategicValue: 25,
      threatLevel: 50,
      activeSquads: [],
      reinforcementPoints: 2,
      contested: false,
      center: { x: -58 + lateralShift, y: 0, z: -12 },
      radius: 34,
    },
    {
      id: 'sector-e',
      code: 'E',
      name: 'E — Colina / Linha Inimiga',
      owner: 'enemy',
      controlProgress: 5,
      strategicValue: 40,
      threatLevel: 85,
      activeSquads: [],
      reinforcementPoints: 4,
      contested: false,
      center: { x: 12 - lateralShift, y: 0, z: -84 },
      radius: 38,
    },
  ];
}

/**
 * Avalia presença de forças vivas em cada setor, atualiza controle territorial,
 * emite eventos de contestação/captura e aplica bônus de pontos de reforço.
 */
export class SectorSystem {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly reserveCarry: Record<'ally' | 'enemy', number> = {
    ally: 0,
    enemy: 0,
  };

  constructor(world: SimulationWorld, bus: EventBus) {
    this.world = world;
    this.bus = bus;
  }

  public update(dt: number): void {
    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    const forcesBySector = new Map<
      string,
      { ally: number; enemy: number; squadIds: string[] }
    >();

    for (const sector of this.world.sectors) {
      forcesBySector.set(sector.id, { ally: 0, enemy: 0, squadIds: [] });
    }

    const squadsWithLiveSoldiers = new Set<string>();

    for (const soldier of this.world.soldiers.values()) {
      if (!soldier.alive || soldier.state === 'dead' || soldier.state === 'incapacitated') {
        continue;
      }
      const squad = this.world.squads.get(soldier.squadId);
      const spatialSector = this.world.getSectorAt(soldier.position);
      const sectorId = spatialSector?.id ?? squad?.sectorId;
      if (!sectorId) continue;

      const bucket = forcesBySector.get(sectorId);
      if (!bucket) continue;

      squadsWithLiveSoldiers.add(soldier.squadId);
      const moraleFactor = 0.6 + (clamp(soldier.morale, 0, 100) / 100) * 0.4;
      const suppressionPenalty = 1 - clamp(soldier.suppression, 0, 100) * 0.004;
      const weight = Math.max(0.25, moraleFactor * suppressionPenalty);

      if (soldier.faction === 'ally') {
        bucket.ally += weight;
      } else if (soldier.faction === 'enemy') {
        bucket.enemy += weight;
      }
    }

    for (const squad of this.world.squads.values()) {
      if (squad.state === 'disabled') continue;
      const spatialSector = this.world.getSectorAt(squad.position);
      const sectorId = spatialSector?.id ?? squad.sectorId;
      const bucket = forcesBySector.get(sectorId);
      if (!bucket) continue;

      bucket.squadIds.push(squad.id);

      // Suporte a pelotões abstratos sem soldados individuais instanciados.
      if (!squadsWithLiveSoldiers.has(squad.id) && squad.memberIds.length === 0) {
        const moraleFactor = 0.6 + (clamp(squad.morale, 0, 100) / 100) * 0.4;
        const abstractPower = 2 * moraleFactor;
        if (squad.faction === 'ally') {
          bucket.ally += abstractPower;
        } else if (squad.faction === 'enemy') {
          bucket.enemy += abstractPower;
        }
      }
    }

    for (const sector of this.world.sectors) {
      const forces = forcesBySector.get(sector.id) ?? {
        ally: 0,
        enemy: 0,
        squadIds: [],
      };
      sector.activeSquads = forces.squadIds;

      const wasContested = sector.contested;
      const bothPresent = forces.ally > 0 && forces.enemy > 0;
      const underPressure =
        (sector.owner === 'ally' && forces.enemy > 0) ||
        (sector.owner === 'enemy' && forces.ally > 0) ||
        (sector.owner === 'neutral' && (forces.ally > 0 || forces.enemy > 0));

      sector.contested = bothPresent || underPressure;

      if (!wasContested && sector.contested) {
        this.bus.emit('sector.contested', { sectorId: sector.id });
      }

      if (safeDt > 0) {
        const diff = forces.ally - forces.enemy;
        if (Math.abs(diff) > 0.01) {
          const delta = clamp(diff * 2.5, -18, 18) * safeDt;
          sector.controlProgress = clamp(sector.controlProgress + delta, 0, 100);
        }

        const newOwner = this.resolveOwner(sector.owner, sector.controlProgress);
        if (newOwner !== sector.owner) {
          sector.owner = newOwner;
          this.bus.emit('sector.captured', {
            sectorId: sector.id,
            faction: newOwner,
          });
          if (newOwner === 'ally' || newOwner === 'enemy') {
            this.world.reserves[newOwner] += Math.max(
              1,
              Math.round(sector.reinforcementPoints)
            );
          }
        }

        if ((sector.owner === 'ally' || sector.owner === 'enemy') && !sector.contested) {
          const faction = sector.owner;
          this.reserveCarry[faction] += sector.reinforcementPoints * 0.05 * safeDt;
          if (this.reserveCarry[faction] >= 1) {
            const whole = Math.floor(this.reserveCarry[faction]);
            this.reserveCarry[faction] -= whole;
            this.world.reserves[faction] += whole;
          }
        }
      }

      sector.threatLevel = Math.round(
        clamp(forces.enemy * 12 + (sector.contested ? 25 : 0), 0, 100)
      );
    }
  }

  private resolveOwner(current: Faction, controlProgress: number): Faction {
    if (controlProgress >= 75) return 'ally';
    if (controlProgress <= 25) return 'enemy';
    return current;
  }
}
