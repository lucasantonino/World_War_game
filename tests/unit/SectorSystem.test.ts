import { describe, expect, it } from 'vitest';
import { EventBus } from '../../src/core/EventBus';
import type { GameEvent, SoldierProfile, SquadUnit } from '../../src/core/types';
import { createDefaultSectorsForMission, SectorSystem } from '../../src/simulation/SectorSystem';
import { SimulationWorld } from '../../src/simulation/SimulationWorld';

function createSquadWithSoldiers(
  world: SimulationWorld,
  id: string,
  faction: 'ally' | 'enemy',
  sectorId: string,
  position: { x: number; y: number; z: number },
  soldierCount: number
): SquadUnit {
  const squad: SquadUnit = {
    id,
    name: id,
    faction,
    doctrine: 'coordinated',
    state: 'idle',
    morale: 100,
    memberIds: [],
    sectorId,
    activeCommand: null,
    isPlayerSquad: false,
    position: { ...position },
    targetPosition: { ...position },
    lodLevel: 'tactical',
  };
  world.addSquad(squad);

  for (let i = 0; i < soldierCount; i++) {
    const soldier: SoldierProfile = {
      id: `${id}-m${i + 1}`,
      callsign: `${id}#${i + 1}`,
      role: 'rifleman',
      faction,
      squadId: id,
      position: { ...position },
      health: 100,
      maxHealth: 100,
      woundLevel: 'none',
      morale: 100,
      suppression: 0,
      fatigue: 0,
      ammunition: 120,
      alive: true,
      wounded: false,
      experience: 1,
      state: 'idle',
    };
    world.addSoldier(soldier);
  }

  return squad;
}

describe('SectorSystem', () => {
  it('cria os 5 setores padrão com propriedades e deslocamento lateral por missão', () => {
    const sectorsOp1 = createDefaultSectorsForMission(1);
    const sectorsOp2 = createDefaultSectorsForMission(2);

    expect(sectorsOp1).toHaveLength(5);
    expect(sectorsOp1.map((s) => s.id)).toEqual([
      'sector-a',
      'sector-b',
      'sector-c',
      'sector-d',
      'sector-e',
    ]);
    expect(sectorsOp1.map((s) => s.code)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(sectorsOp1[0].owner).toBe('ally');
    expect(sectorsOp1[1].owner).toBe('neutral');
    expect(sectorsOp1[1].contested).toBe(true);
    expect(sectorsOp1[2].owner).toBe('enemy');
    expect(sectorsOp2[1].center.x).not.toBe(sectorsOp1[1].center.x);
  });

  it('detecta disputa territorial e emite sector.contested sem duplicar enquanto contestado', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const contestedEvents: Array<Extract<GameEvent, { type: 'sector.contested' }>> = [];
    bus.on('sector.contested', (evt) => contestedEvents.push(evt));

    for (const sector of createDefaultSectorsForMission(1)) {
      world.addSector(sector);
    }

    const sectorSystem = new SectorSystem(world, bus);
    const sectorA = world.sectors[0];

    // Coloca um pelotão inimigo dentro do setor A aliado
    createSquadWithSoldiers(world, 'enemy-raid-a', 'enemy', sectorA.id, sectorA.center, 4);

    sectorSystem.update(0.5);
    expect(sectorA.contested).toBe(true);
    expect(contestedEvents).toHaveLength(1);
    expect(contestedEvents[0].payload.sectorId).toBe('sector-a');

    // Segundo passo enquanto permanece contestado não deve re-emitir o mesmo evento
    sectorSystem.update(0.5);
    expect(sectorA.contested).toBe(true);
    expect(contestedEvents).toHaveLength(1);
  });

  it('transiciona dono do setor por presença dominante e emite sector.captured', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const capturedEvents: Array<Extract<GameEvent, { type: 'sector.captured' }>> = [];
    bus.on('sector.captured', (evt) => capturedEvents.push(evt));

    for (const sector of createDefaultSectorsForMission(1)) {
      world.addSector(sector);
    }

    const sectorSystem = new SectorSystem(world, bus);
    const sectorC = world.sectors[2]; // owner: 'enemy', controlProgress: 25, reinforcementPoints: 3
    const initialAllyReserves = world.reserves.ally;

    // 8 aliados com moral 100 -> força = 8, delta/s = min(18, 8 * 2.5) = 18/s -> 25 + 54 = 79 em 3s
    createSquadWithSoldiers(world, 'ally-assault-c', 'ally', sectorC.id, sectorC.center, 8);

    sectorSystem.update(1.0);
    expect(sectorC.owner).toBe('enemy');
    expect(sectorC.controlProgress).toBeGreaterThan(25);
    expect(capturedEvents).toHaveLength(0);

    sectorSystem.update(2.0);
    expect(sectorC.controlProgress).toBeGreaterThanOrEqual(75);
    expect(sectorC.owner).toBe('ally');
    expect(capturedEvents).toHaveLength(1);
    expect(capturedEvents[0].payload).toEqual({
      sectorId: 'sector-c',
      faction: 'ally',
    });
    expect(world.reserves.ally).toBeGreaterThanOrEqual(initialAllyReserves + 3);
  });

  it('permite captura inimiga de setor neutro ou aliado quando força inimiga domina', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const capturedEvents: Array<Extract<GameEvent, { type: 'sector.captured' }>> = [];
    bus.on('sector.captured', (evt) => capturedEvents.push(evt));

    for (const sector of createDefaultSectorsForMission(1)) {
      world.addSector(sector);
    }

    const sectorSystem = new SectorSystem(world, bus);
    const sectorD = world.sectors[3]; // owner: 'neutral', controlProgress: 45

    createSquadWithSoldiers(world, 'enemy-capture-d', 'enemy', sectorD.id, sectorD.center, 6);

    // Força inimiga = 6 -> delta = -15/s -> em 2s vai de 45 para 15 (<= 25)
    sectorSystem.update(2.0);
    expect(sectorD.controlProgress).toBeLessThanOrEqual(25);
    expect(sectorD.owner).toBe('enemy');
    expect(capturedEvents).toContainEqual({
      type: 'sector.captured',
      payload: { sectorId: 'sector-d', faction: 'enemy' },
    });
  });
});
