import type { EventBus } from '../core/EventBus.ts';
import {
  clamp,
  type Faction,
  type SimLODLevel,
  type SoldierProfile,
  type SquadUnit,
} from '../core/types.ts';
import { createSeededRng } from './BattlefieldState.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

export interface DistantBattleOutcome {
  sectorId: string;
  victor: Faction;
  casualties: number;
}

/**
 * Simula confrontos abstratos em setores distantes (LOD estratégico) sem instanciar projéteis,
 * preservando baixas e moral quando o pelotão se aproxima e sobe para LOD tático/completo.
 */
export class DistantBattleSimulator {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly rng: () => number;

  constructor(world: SimulationWorld, bus: EventBus, seed?: number) {
    this.world = world;
    this.bus = bus;
    this.rng = createSeededRng(seed ?? world.seed);
  }

  public step(dt: number): DistantBattleOutcome[] {
    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    if (safeDt <= 0) return [];

    const outcomes: DistantBattleOutcome[] = [];

    for (const sector of this.world.sectors) {
      const strategicSquads = this.getStrategicSquadsInSector(sector.id);
      const allySquads = strategicSquads.filter((s) => s.faction === 'ally');
      const enemySquads = strategicSquads.filter((s) => s.faction === 'enemy');

      if (allySquads.length === 0 || enemySquads.length === 0) {
        continue;
      }

      const allyPower = this.computeFactionPower(
        allySquads,
        sector.owner === 'ally' ? sector.strategicValue : 0
      );
      const enemyPower = this.computeFactionPower(
        enemySquads,
        sector.owner === 'enemy' ? sector.strategicValue : 0
      );

      if (allyPower <= 0 || enemyPower <= 0) {
        continue;
      }

      const allyRoll = allyPower * (0.85 + this.rng() * 0.3);
      const enemyRoll = enemyPower * (0.85 + this.rng() * 0.3);
      const victor: Faction = allyRoll >= enemyRoll ? 'ally' : 'enemy';

      const winnerSquads = victor === 'ally' ? allySquads : enemySquads;
      const loserSquads = victor === 'ally' ? enemySquads : allySquads;

      const intensity = clamp(safeDt / 2.5, 0.15, 1.5);
      const loserLoss = this.applyAbstractDamage(loserSquads, 28 * intensity, 9 * intensity);
      const winnerLoss = this.applyAbstractDamage(winnerSquads, 14 * intensity, 4 * intensity);
      const totalCasualties = loserLoss + winnerLoss;

      const shiftMagnitude = clamp(
        (Math.abs(allyRoll - enemyRoll) / Math.max(1, allyRoll + enemyRoll)) * 16 +
          2 * intensity,
        2,
        14
      );
      const signedShift = victor === 'ally' ? shiftMagnitude : -shiftMagnitude;
      sector.controlProgress = clamp(sector.controlProgress + signedShift, 0, 100);
      sector.contested = true;

      outcomes.push({
        sectorId: sector.id,
        victor,
        casualties: totalCasualties,
      });
    }

    return outcomes;
  }

  /**
   * Eleva o LOD de um pelotão estratégico para tático/completo mantendo baixas,
   * vida, moral e estado dos soldados intactos.
   */
  public materializeSquad(
    squadId: string,
    targetLod: Exclude<SimLODLevel, 'strategic'> = 'tactical'
  ): SquadUnit | null {
    const squad = this.world.squads.get(squadId);
    if (!squad) return null;

    squad.lodLevel = targetLod;
    const members = this.world.getSquadMembers(squadId);
    let aliveIndex = 0;

    for (const soldier of members) {
      if (!soldier.alive || soldier.state === 'dead') {
        continue;
      }
      // Reorganiza apenas o espaçamento local caso o soldado ainda esteja colado ao centro do pelotão.
      const dx = soldier.position.x - squad.position.x;
      const dz = soldier.position.z - squad.position.z;
      if (dx * dx + dz * dz < 0.04) {
        const angle = (aliveIndex * Math.PI * 2) / Math.max(1, members.length);
        const radius = 2.5 + (aliveIndex % 2) * 1.5;
        soldier.position.x = squad.position.x + Math.cos(angle) * radius;
        soldier.position.z = squad.position.z + Math.sin(angle) * radius;
        soldier.position.y = squad.position.y;
      }
      aliveIndex++;
    }

    return squad;
  }

  private getStrategicSquadsInSector(sectorId: string): SquadUnit[] {
    const list: SquadUnit[] = [];
    for (const squad of this.world.squads.values()) {
      if (squad.lodLevel !== 'strategic' || squad.state === 'disabled') {
        continue;
      }
      const spatialId = this.world.getSectorAt(squad.position)?.id;
      if ((spatialId ?? squad.sectorId) !== sectorId) {
        continue;
      }
      const liveMembers = this.getLiveMembers(squad.id);
      if (liveMembers.length > 0 || squad.memberIds.length === 0) {
        list.push(squad);
      }
    }
    return list;
  }

  private computeFactionPower(squads: SquadUnit[], defenseBonus: number): number {
    let power = 0;
    for (const squad of squads) {
      const live = this.getLiveMembers(squad.id);
      const headcount = live.length > 0 ? live.length : squad.memberIds.length === 0 ? 4 : 0;
      if (headcount <= 0) continue;

      const avgMorale =
        live.length > 0
          ? live.reduce((acc, s) => acc + s.morale, 0) / live.length
          : squad.morale;

      const moraleMult = 0.55 + (clamp(avgMorale, 0, 100) / 100) * 0.55;
      power += headcount * moraleMult;
    }

    return power * (1 + clamp(defenseBonus, 0, 100) * 0.004);
  }

  private applyAbstractDamage(
    squads: SquadUnit[],
    damagePerHit: number,
    moraleDrop: number
  ): number {
    let casualties = 0;

    for (const squad of squads) {
      const live = this.getLiveMembers(squad.id);
      if (live.length === 0) continue;

      // Escolhe de 1 a 2 alvos por passo conforme efetivo.
      const hits = live.length >= 5 ? 2 : 1;
      for (let i = 0; i < hits; i++) {
        const remaining = live.filter((s) => s.alive);
        if (remaining.length === 0) break;

        const targetIdx = Math.floor(this.rng() * remaining.length);
        const soldier = remaining[targetIdx];
        const actualDmg = damagePerHit * (0.75 + this.rng() * 0.5);
        soldier.health = Math.max(0, soldier.health - actualDmg);
        soldier.morale = clamp(soldier.morale - moraleDrop, 0, 100);

        if (soldier.health <= 0) {
          soldier.alive = false;
          soldier.wounded = false;
          soldier.woundLevel = 'incapacitated';
          soldier.state = 'dead';
          casualties++;
          this.bus.emit('soldier.killed', {
            soldierId: soldier.id,
            faction: soldier.faction,
          });
        } else if (soldier.health < soldier.maxHealth * 0.65) {
          soldier.wounded = true;
          soldier.woundLevel =
            soldier.health < soldier.maxHealth * 0.3 ? 'severe' : 'moderate';
          soldier.state = 'wounded';
        }
      }

      const aliveAfter = this.getLiveMembers(squad.id);
      if (aliveAfter.length === 0) {
        squad.morale = 0;
        squad.state = 'disabled';
      } else {
        const avgMorale =
          aliveAfter.reduce((acc, s) => acc + s.morale, 0) / aliveAfter.length;
        squad.morale = clamp(avgMorale - moraleDrop * 0.4, 0, 100);
        if (squad.morale < 25) {
          squad.state = 'retreating';
        } else {
          squad.state = 'engaging';
        }
      }
    }

    return casualties;
  }

  private getLiveMembers(squadId: string): SoldierProfile[] {
    return this.world
      .getSquadMembers(squadId)
      .filter((s) => s.alive && s.state !== 'dead' && s.state !== 'incapacitated');
  }
}
