import type { EventBus } from '../core/EventBus.ts';
import type { GameClock } from '../core/GameClock.ts';
import type { GameEvent } from '../core/types.ts';
import type { SimulationScheduler } from '../simulation/SimulationScheduler.ts';
import type { SimulationWorld } from '../simulation/SimulationWorld.ts';
import type { PerformanceManager, RecommendedQuality } from './PerformanceManager.ts';

export interface DiagnosticsSnapshot {
  realTimeSec: number;
  simTimeSec: number;
  paused: boolean;
  averageFps: number;
  averageFrameMs: number;
  recommendedQuality: RecommendedQuality;
  schedulerLoadScale: number;
  sectorCount: number;
  squadCount: number;
  soldierCount: number;
  aliveSoldiers: number;
  reserves: Record<'ally' | 'enemy', number>;
  recentEvents: readonly GameEvent[];
}

/**
 * Coleta métricas de execução, estado do mundo e eventos recentes para depuração.
 */
export class Diagnostics {
  private readonly clock: GameClock;
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly scheduler: SimulationScheduler;
  private readonly performance: PerformanceManager;

  constructor(deps: {
    clock: GameClock;
    world: SimulationWorld;
    bus: EventBus;
    scheduler: SimulationScheduler;
    performance: PerformanceManager;
  }) {
    this.clock = deps.clock;
    this.world = deps.world;
    this.bus = deps.bus;
    this.scheduler = deps.scheduler;
    this.performance = deps.performance;
  }

  public getSnapshot(eventLimit = 16): DiagnosticsSnapshot {
    let aliveSoldiers = 0;
    for (const soldier of this.world.soldiers.values()) {
      if (soldier.alive) aliveSoldiers++;
    }

    return {
      realTimeSec: this.clock.realTime,
      simTimeSec: this.clock.simTime,
      paused: this.clock.paused,
      averageFps: Math.round(this.performance.getAverageFps() * 10) / 10,
      averageFrameMs: Math.round(this.performance.getAverageFrameMs() * 100) / 100,
      recommendedQuality: this.performance.getRecommendedQuality(),
      schedulerLoadScale: this.scheduler.getLoadScale(),
      sectorCount: this.world.sectors.length,
      squadCount: this.world.squads.size,
      soldierCount: this.world.soldiers.size,
      aliveSoldiers,
      reserves: { ...this.world.reserves },
      recentEvents: this.bus.getRecentEvents(eventLimit),
    };
  }
}
