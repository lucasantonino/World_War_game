import type { EventBus } from '../core/EventBus.ts';
import {
  vec3DistSq,
  type Faction,
  type RadioMessage,
  type SimSoldierRole,
  type SoldierProfile,
  type SquadUnit,
  type Vec3,
} from '../core/types.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

const REINFORCEMENT_SQUAD_SIZE = 4;
const REINFORCEMENT_ROLES: readonly SimSoldierRole[] = [
  'rifleman',
  'assault',
  'mg_gunner',
  'medic',
];

export interface ReinforcementResult {
  squad: SquadUnit;
  spawnPoint: Vec3;
  routeFromSectorId: string | null;
}

/**
 * Gerencia reservas humanas e rotas coerentes de chegada de reforços a partir de setores amigos.
 */
export class ReinforcementSystem {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly cooldownByFaction: Record<'ally' | 'enemy', number> = {
    ally: 0,
    enemy: 0,
  };
  private reinforcementSeq = 0;

  constructor(world: SimulationWorld, bus: EventBus) {
    this.world = world;
    this.bus = bus;
  }

  public getSpawnPointForFaction(
    faction: Faction,
    targetSectorId?: string
  ): { spawnPoint: Vec3; originSectorId: string | null } | null {
    if (faction === 'neutral') return null;

    const targetSector = targetSectorId
      ? this.world.sectors.find((s) => s.id === targetSectorId)
      : undefined;
    const friendlySectors = this.world.sectors.filter((s) => s.owner === faction);

    if (friendlySectors.length > 0) {
      let anchor = friendlySectors[0];
      if (targetSector) {
        let bestDistSq = Infinity;
        for (const candidate of friendlySectors) {
          const distSq = vec3DistSq(candidate.center, targetSector.center);
          if (distSq < bestDistSq) {
            bestDistSq = distSq;
            anchor = candidate;
          }
        }
      }
      const rearOffsetZ = faction === 'ally' ? 14 : -14;
      return {
        spawnPoint: {
          x: anchor.center.x,
          y: anchor.center.y,
          z: anchor.center.z + rearOffsetZ,
        },
        originSectorId: anchor.id,
      };
    }

    // Fallback coerente pela retaguarda da linha de frente.
    return {
      spawnPoint: {
        x: targetSector ? targetSector.center.x * 0.5 : 0,
        y: 0,
        z: faction === 'ally' ? 105 : -118,
      },
      originSectorId: null,
    };
  }

  public requestReinforcement(
    sectorId: string,
    faction: Faction
  ): ReinforcementResult | null {
    if (faction === 'neutral') return null;

    const targetSector = this.world.sectors.find((s) => s.id === sectorId);
    if (!targetSector) return null;

    if (this.world.reserves[faction] < REINFORCEMENT_SQUAD_SIZE) {
      return null;
    }

    const route = this.getSpawnPointForFaction(faction, sectorId);
    if (!route) return null;

    this.world.reserves[faction] -= REINFORCEMENT_SQUAD_SIZE;
    this.reinforcementSeq += 1;

    const squadId = `reinf-${faction}-${this.reinforcementSeq}`;
    const squad: SquadUnit = {
      id: squadId,
      name:
        faction === 'ally'
          ? `Reforço Aliado ${this.reinforcementSeq}`
          : `Reforço Inimigo ${this.reinforcementSeq}`,
      faction,
      doctrine: faction === 'ally' ? 'coordinated' : 'aggressive',
      state: 'moving',
      morale: 85,
      memberIds: [],
      sectorId: targetSector.id,
      activeCommand: {
        squadId,
        type: 'advance',
        targetPosition: { ...targetSector.center },
        issuedAt: 0,
      },
      isPlayerSquad: false,
      position: { ...route.spawnPoint },
      targetPosition: { ...targetSector.center },
      lodLevel: 'strategic',
    };

    this.world.addSquad(squad);

    for (let i = 0; i < REINFORCEMENT_SQUAD_SIZE; i++) {
      const role = REINFORCEMENT_ROLES[i % REINFORCEMENT_ROLES.length];
      const offsetX = (i - 1.5) * 2.2;
      const soldier: SoldierProfile = {
        id: `${squadId}-s${i + 1}`,
        callsign: `${faction === 'ally' ? 'ALFA' : 'EIXO'}-${this.reinforcementSeq}.${i + 1}`,
        role,
        faction,
        squadId,
        position: {
          x: route.spawnPoint.x + offsetX,
          y: route.spawnPoint.y,
          z: route.spawnPoint.z,
        },
        health: 100,
        maxHealth: 100,
        woundLevel: 'none',
        morale: 85,
        suppression: 0,
        fatigue: 0,
        ammunition: 120,
        alive: true,
        wounded: false,
        experience: 1,
        state: 'moving',
      };
      this.world.addSoldier(soldier);
    }

    this.bus.emit('reinforcement.requested', { sectorId, faction });

    const radioMsg: RadioMessage = {
      id: `radio-reinf-${this.reinforcementSeq}`,
      channel: 'operational',
      sender: faction === 'ally' ? 'Comando de Reservas' : 'Inteligência de Campo',
      text:
        faction === 'ally'
          ? `Reforços aliados a caminho de ${targetSector.name}.`
          : `Batedores confirmam reforços inimigos deslocando-se para ${targetSector.name}.`,
      timestamp: Date.now(),
      degraded: false,
    };
    this.world.pushRadioMessage(radioMsg);
    this.bus.emit('radio.message.sent', radioMsg);

    return {
      squad,
      spawnPoint: route.spawnPoint,
      routeFromSectorId: route.originSectorId,
    };
  }

  public update(dt: number): void {
    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    if (safeDt <= 0) return;

    this.cooldownByFaction.ally = Math.max(0, this.cooldownByFaction.ally - safeDt);
    this.cooldownByFaction.enemy = Math.max(0, this.cooldownByFaction.enemy - safeDt);

    for (const faction of ['ally', 'enemy'] as const) {
      if (this.cooldownByFaction[faction] > 0) continue;
      if (this.world.reserves[faction] < REINFORCEMENT_SQUAD_SIZE) continue;

      const threatened = this.world.sectors.find(
        (s) =>
          s.contested &&
          (s.owner === faction ||
            (s.owner === 'neutral' && s.threatLevel >= 40)) &&
          this.countFactionSquadsInSector(s.id, faction) === 0
      );

      if (threatened) {
        this.requestReinforcement(threatened.id, faction);
        this.cooldownByFaction[faction] = 28;
      }
    }
  }

  private countFactionSquadsInSector(sectorId: string, faction: Faction): number {
    let count = 0;
    for (const squad of this.world.squads.values()) {
      if (squad.faction === faction && squad.sectorId === sectorId && squad.state !== 'disabled') {
        count++;
      }
    }
    return count;
  }
}
