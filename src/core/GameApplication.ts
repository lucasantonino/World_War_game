import { Diagnostics } from '../infrastructure/Diagnostics.ts';
import { PerformanceManager } from '../infrastructure/PerformanceManager.ts';
import { SaveManager } from '../infrastructure/SaveManager.ts';
import { BattlefieldDirector } from '../simulation/BattlefieldDirector.ts';
import {
  SimulationScheduler,
  type SchedulerTickResult,
} from '../simulation/SimulationScheduler.ts';
import { SimulationWorld } from '../simulation/SimulationWorld.ts';
import { EventBus } from './EventBus.ts';
import { GameClock } from './GameClock.ts';
import { GAME_CONFIG } from './GameConfig.ts';
import { GameLoop, type GameLoopStages } from './GameLoop.ts';
import { ServiceContainer } from './ServiceContainer.ts';
import { StateMachine } from './StateMachine.ts';
import type { Vec3 } from './types.ts';

export type ApplicationState =
  | 'boot'
  | 'menu'
  | 'briefing'
  | 'playing'
  | 'paused'
  | 'victory'
  | 'defeat';

export interface GameApplicationOptions {
  seed?: number;
  frameBudgetMs?: number;
}

/**
 * Raiz de composição da aplicação desacoplando núcleo, simulação militar e infraestrutura.
 * Executa de forma idêntica em Node/Vitest ou acoplada a um renderer Three.js no navegador.
 */
export class GameApplication {
  public readonly bus: EventBus;
  public readonly clock: GameClock;
  public readonly loop: GameLoop;
  public readonly services: ServiceContainer;
  public readonly state: StateMachine<ApplicationState>;
  public readonly world: SimulationWorld;
  public readonly scheduler: SimulationScheduler;
  public readonly director: BattlefieldDirector;
  public readonly saves: SaveManager;
  public readonly performance: PerformanceManager;
  public readonly diagnostics: Diagnostics;

  private directorAccumulatedDt = 0;

  constructor(options: GameApplicationOptions = {}) {
    this.bus = new EventBus();
    this.clock = new GameClock();
    this.loop = new GameLoop();
    this.services = new ServiceContainer();
    this.state = new StateMachine<ApplicationState>('boot');

    this.world = new SimulationWorld();
    if (options.seed !== undefined) {
      this.world.seed = options.seed;
    }

    this.scheduler = new SimulationScheduler({
      budgetMs: options.frameBudgetMs ?? GAME_CONFIG.desktopFrameBudgetMs,
    });
    this.director = new BattlefieldDirector(this.world, this.bus, this.world.seed);
    this.saves = new SaveManager();
    this.performance = new PerformanceManager();
    this.diagnostics = new Diagnostics({
      clock: this.clock,
      world: this.world,
      bus: this.bus,
      scheduler: this.scheduler,
      performance: this.performance,
    });

    this.registerCoreServices();
    this.state.transition('menu');
  }

  public initializeMission(missionId: number, seed?: number): void {
    this.clock.reset();
    this.scheduler.reset();
    this.directorAccumulatedDt = 0;
    this.director.initializeMission(missionId, seed);
    this.state.transition('playing');
  }

  public pause(): void {
    this.clock.paused = true;
    this.state.transition('paused');
  }

  public resume(): void {
    this.clock.paused = false;
    this.state.transition('playing');
  }

  public step(
    rawDtSec: number,
    stages: GameLoopStages = {},
    playerPos?: Vec3,
    lastFrameMs?: number
  ): SchedulerTickResult {
    if (lastFrameMs !== undefined && Number.isFinite(lastFrameMs) && lastFrameMs > 0) {
      this.performance.recordFrame(lastFrameMs);
    }

    const simDt = this.clock.tick(rawDtSec);
    const schedule: SchedulerTickResult =
      simDt > 0
        ? this.scheduler.tick(simDt, lastFrameMs)
        : {
            runCombat: false,
            runAiNear: false,
            runSquad: false,
            runDirector: false,
            runDistant: false,
          };

    if (simDt > 0) {
      this.directorAccumulatedDt += simDt;
    }

    this.loop.step(simDt, {
      input: stages.input,
      player: stages.player,
      simulation: (dt) => {
        if (dt > 0 && (schedule.runDirector || schedule.runDistant)) {
          const stepDt = this.directorAccumulatedDt;
          this.directorAccumulatedDt = 0;
          this.director.update(stepDt, this.clock.simTime, playerPos);
        }
        stages.simulation?.(dt);
      },
      ai: (dt) => {
        if (dt > 0 && (schedule.runAiNear || schedule.runSquad)) {
          stages.ai?.(dt);
        }
      },
      combat: (dt) => {
        if (dt > 0 && schedule.runCombat) {
          stages.combat?.(dt);
        }
      },
      world: stages.world,
      presentation: stages.presentation,
      hud: stages.hud,
      render: stages.render,
    });

    return schedule;
  }

  public dispose(): void {
    this.bus.clear();
    this.world.clear();
    this.scheduler.reset();
    this.clock.reset();
    this.performance.reset();
    this.services.clear();
    this.directorAccumulatedDt = 0;
  }

  private registerCoreServices(): void {
    this.services.register('eventBus', this.bus);
    this.services.register('clock', this.clock);
    this.services.register('loop', this.loop);
    this.services.register('stateMachine', this.state);
    this.services.register('world', this.world);
    this.services.register('scheduler', this.scheduler);
    this.services.register('director', this.director);
    this.services.register('saveManager', this.saves);
    this.services.register('performance', this.performance);
    this.services.register('diagnostics', this.diagnostics);
  }
}
