import { describe, expect, it } from 'vitest';
import { PerceptionEngine } from '../../src/ai/PerceptionEngine';
import { EventBus } from '../../src/core/EventBus';
import type { SoldierProfile, SquadUnit } from '../../src/core/types';
import { SquadSystem } from '../../src/gameplay/squads/SquadSystem';
import { BattlefieldDirector } from '../../src/simulation/BattlefieldDirector';
import { createDefaultSectorsForMission } from '../../src/simulation/SectorSystem';
import { SimulationScheduler } from '../../src/simulation/SimulationScheduler';
import { SimulationWorld } from '../../src/simulation/SimulationWorld';

describe('SoldierSimulation (Performance Benchmark)', () => {
  it('simula 160 soldados e 12 pelotões por 120 ticks escalonados dentro do orçamento (< 12ms/tick)', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const scheduler = new SimulationScheduler();
    const director = new BattlefieldDirector(world, bus, 1944);
    const squadSystem = new SquadSystem(world, bus);
    const perception = new PerceptionEngine();

    for (const sector of createDefaultSectorsForMission(1)) {
      world.addSector(sector);
    }

    // 12 pelotões somando exatamente 160 soldados: 8 pelotões de 13 + 4 pelotões de 14 = 160
    const squadCount = 12;
    for (let sIdx = 0; sIdx < squadCount; sIdx++) {
      const sector = world.sectors[sIdx % world.sectors.length];
      const faction = sIdx % 2 === 0 ? 'ally' : 'enemy';
      const memberTarget = sIdx < 8 ? 13 : 14;
      const squadId = `perf-squad-${sIdx + 1}`;
      const squadPos = {
        x: sector.center.x + (faction === 'ally' ? -6 : 6),
        y: 0,
        z: sector.center.z + (sIdx % 3) * 4,
      };

      const squad: SquadUnit = {
        id: squadId,
        name: `Pelotão ${sIdx + 1}`,
        faction,
        doctrine: faction === 'ally' ? 'coordinated' : 'defensive',
        state: 'engaging',
        morale: 85,
        memberIds: [],
        sectorId: sector.id,
        activeCommand: {
          squadId,
          type: faction === 'ally' ? 'advance' : 'hold',
          targetPosition: { ...sector.center },
          issuedAt: 0,
        },
        isPlayerSquad: sIdx === 0,
        position: { ...squadPos },
        targetPosition: { ...sector.center },
        lodLevel: sIdx < 4 ? 'full' : sIdx < 8 ? 'tactical' : 'strategic',
      };
      world.addSquad(squad);

      for (let mIdx = 0; mIdx < memberTarget; mIdx++) {
        const soldierId = `${squadId}-m${mIdx + 1}`;
        const soldier: SoldierProfile = {
          id: soldierId,
          callsign: `S-${sIdx + 1}-${mIdx + 1}`,
          role: mIdx === 0 ? 'officer' : mIdx === 1 ? 'medic' : 'rifleman',
          faction,
          squadId,
          position: {
            x: squadPos.x + (mIdx % 4) * 2.2,
            y: 0,
            z: squadPos.z + Math.floor(mIdx / 4) * 2.2,
          },
          health: 100,
          maxHealth: 100,
          woundLevel: 'none',
          morale: 85,
          suppression: mIdx % 3 === 0 ? 25 : 0,
          fatigue: 0,
          ammunition: 120,
          alive: true,
          wounded: false,
          experience: 5,
          state: 'idle',
        };
        world.addSoldier(soldier);
      }
    }

    expect(world.squads.size).toBe(12);
    expect(world.soldiers.size).toBe(160);

    const allSoldiers = Array.from(world.soldiers.values());
    const allySoldiers = allSoldiers.filter((s) => s.faction === 'ally');
    const enemySoldiers = allSoldiers.filter((s) => s.faction === 'enemy');
    const playerPos = { ...world.sectors[0].center };

    const dt = 1 / 30;
    const totalTicks = 120;
    let elapsedSec = 0;
    let squadAccumulator = 0;
    let directorAccumulator = 0;

    // Warmup breve para estabilizar JIT antes da medição dos 120 ticks
    for (let w = 0; w < 5; w++) {
      squadSystem.update(dt, w * dt, playerPos);
      director.update(dt, w * dt, playerPos);
    }

    const startMs = performance.now();

    for (let tick = 0; tick < totalTicks; tick++) {
      elapsedSec += dt;
      squadAccumulator += dt;
      directorAccumulator += dt;

      const schedule = scheduler.tick(dt);

      if (schedule.runAiNear) {
        for (let i = 0; i < allySoldiers.length; i++) {
          const observer = allySoldiers[i];
          const target = enemySoldiers[i % enemySoldiers.length];
          perception.reportStimulus(
            observer.id,
            target.id,
            target.faction,
            target.position,
            i % 2 === 0 ? 'visual' : 'audio',
            0.7,
            elapsedSec
          );
        }
        perception.decayAll(elapsedSec, (_obs, _tgt) => tick % 2 === 0);
      }

      if (schedule.runSquad) {
        squadSystem.update(squadAccumulator, elapsedSec, playerPos);
        squadAccumulator = 0;
      }

      if (schedule.runDirector || schedule.runDistant) {
        director.update(directorAccumulator, elapsedSec, playerPos);
        directorAccumulator = 0;
      }
    }

    const totalMs = performance.now() - startMs;
    const avgMsPerTick = totalMs / totalTicks;

    expect(avgMsPerTick).toBeLessThan(12);
  });
});
