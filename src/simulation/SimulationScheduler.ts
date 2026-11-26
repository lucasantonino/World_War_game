import { GAME_CONFIG } from '../core/GameConfig.ts';
import { clamp } from '../core/types.ts';

export interface SchedulerConfig {
  combatHz?: number;
  aiNearHz?: number;
  squadHz?: number;
  directorHz?: number;
  distantBattleHz?: number;
  budgetMs?: number;
}

export interface SchedulerTickResult {
  runCombat: boolean;
  runAiNear: boolean;
  runSquad: boolean;
  runDirector: boolean;
  runDistant: boolean;
}

/**
 * Escalonador adaptativo por canal de frequência (Hz) com redução automática sob carga alta.
 */
export class SimulationScheduler {
  private readonly rates: {
    combat: number;
    aiNear: number;
    squad: number;
    director: number;
    distant: number;
  };
  private readonly budgetMs: number;
  private readonly accumulators = {
    combat: 0,
    aiNear: 0,
    squad: 0,
    director: 0,
    distant: 0,
  };
  private loadScale = 1;

  constructor(config: SchedulerConfig = {}) {
    this.rates = {
      combat: Math.max(1, config.combatHz ?? GAME_CONFIG.combatHz),
      aiNear: Math.max(1, config.aiNearHz ?? GAME_CONFIG.aiNearHz),
      squad: Math.max(0.5, config.squadHz ?? GAME_CONFIG.squadHz),
      director: Math.max(0.1, config.directorHz ?? GAME_CONFIG.directorHz),
      distant: Math.max(0.1, config.distantBattleHz ?? GAME_CONFIG.distantBattleHz),
    };
    this.budgetMs = Math.max(8, config.budgetMs ?? GAME_CONFIG.desktopFrameBudgetMs);
  }

  public tick(dt: number, lastFrameMs?: number): SchedulerTickResult {
    if (lastFrameMs !== undefined && Number.isFinite(lastFrameMs) && lastFrameMs > 0) {
      if (lastFrameMs > this.budgetMs) {
        const overloadRatio = this.budgetMs / lastFrameMs;
        this.loadScale = clamp(
          Math.min(this.loadScale * 0.9, overloadRatio),
          0.4,
          1
        );
      } else if (lastFrameMs < this.budgetMs * 0.85) {
        this.loadScale = clamp(this.loadScale + 0.05, 0.4, 1);
      }
    }

    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    const effectiveDt = safeDt * this.loadScale;

    return {
      runCombat: this.stepChannel('combat', effectiveDt, this.rates.combat),
      runAiNear: this.stepChannel('aiNear', effectiveDt, this.rates.aiNear),
      runSquad: this.stepChannel('squad', effectiveDt, this.rates.squad),
      runDirector: this.stepChannel('director', effectiveDt, this.rates.director),
      runDistant: this.stepChannel('distant', effectiveDt, this.rates.distant),
    };
  }

  public getLoadScale(): number {
    return this.loadScale;
  }

  public reset(): void {
    this.accumulators.combat = 0;
    this.accumulators.aiNear = 0;
    this.accumulators.squad = 0;
    this.accumulators.director = 0;
    this.accumulators.distant = 0;
    this.loadScale = 1;
  }

  private stepChannel(
    channel: keyof typeof this.accumulators,
    effectiveDt: number,
    hz: number
  ): boolean {
    const period = 1 / hz;
    let acc = this.accumulators[channel] + effectiveDt;
    if (acc < period) {
      this.accumulators[channel] = acc;
      return false;
    }

    acc -= period;
    // Evita acúmulo excessivo após picos de latência.
    if (acc >= period) {
      acc = acc % period;
    }
    this.accumulators[channel] = acc;
    return true;
  }
}
