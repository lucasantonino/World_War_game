import type {
  BattlefieldEvent,
  BattlefieldSector,
  RadioMessage,
  SoldierProfile,
  SquadUnit,
} from '../core/types.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

/**
 * PRNG determinístico Mulberry32 para tornar batalhas e eventos reproduzíveis por semente.
 */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BattlefieldSnapshot {
  version: number;
  seed: number;
  timestamp: number;
  reserves: Record<'ally' | 'enemy', number>;
  sectors: BattlefieldSector[];
  squads: SquadUnit[];
  soldiers: SoldierProfile[];
  events: BattlefieldEvent[];
  radioLog: RadioMessage[];
}

function cloneSquad(squad: SquadUnit): SquadUnit {
  return {
    ...squad,
    memberIds: [...squad.memberIds],
    position: { ...squad.position },
    targetPosition: { ...squad.targetPosition },
    activeCommand: squad.activeCommand
      ? {
          ...squad.activeCommand,
          targetPosition: squad.activeCommand.targetPosition
            ? { ...squad.activeCommand.targetPosition }
            : undefined,
        }
      : null,
  };
}

function cloneSoldier(soldier: SoldierProfile): SoldierProfile {
  return {
    ...soldier,
    position: { ...soldier.position },
  };
}

/**
 * Gera um snapshot JSON-serializável completo do estado atual do campo de batalha.
 */
export function createBattlefieldSnapshot(
  world: SimulationWorld,
  timestamp = Date.now()
): BattlefieldSnapshot {
  return {
    version: 1,
    seed: world.seed,
    timestamp,
    reserves: { ...world.reserves },
    sectors: world.getSectorsSnapshot(),
    squads: Array.from(world.squads.values(), cloneSquad),
    soldiers: Array.from(world.soldiers.values(), cloneSoldier),
    events: world.events.map((evt) => ({ ...evt })),
    radioLog: world.radioLog.map((msg) => ({ ...msg })),
  };
}

/**
 * Restaura um SimulationWorld a partir de um snapshot serializado.
 */
export function restoreBattlefieldSnapshot(
  world: SimulationWorld,
  snapshot: BattlefieldSnapshot
): void {
  world.clear();
  world.seed = snapshot.seed;
  world.reserves = { ...snapshot.reserves };

  for (const sector of snapshot.sectors) {
    world.addSector({
      ...sector,
      activeSquads: [...sector.activeSquads],
      center: { ...sector.center },
    });
  }

  for (const squad of snapshot.squads) {
    world.addSquad(cloneSquad(squad));
  }

  for (const soldier of snapshot.soldiers) {
    world.addSoldier(cloneSoldier(soldier));
  }

  for (const evt of snapshot.events) {
    world.events.push({ ...evt });
  }

  for (const msg of snapshot.radioLog) {
    world.pushRadioMessage({ ...msg });
  }
}
