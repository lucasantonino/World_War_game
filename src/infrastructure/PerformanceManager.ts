import { GAME_CONFIG } from '../core/GameConfig.ts';
import { clamp } from '../core/types.ts';

export type RecommendedQuality = 'low' | 'medium' | 'high';

/**
 * Monitora média móvel de tempo de quadro e FPS para recomendar qualidade gráfica e escala de LOD.
 */
export class PerformanceManager {
  private readonly samples: number[] = [];
  private readonly maxSamples: number;
  private sumMs = 0;

  constructor(windowSize = 60) {
    this.maxSamples = Math.max(5, windowSize);
  }

  public recordFrame(frameTimeMs: number): void {
    const safeMs =
      Number.isFinite(frameTimeMs) && frameTimeMs > 0 ? frameTimeMs : 0.1;

    this.samples.push(safeMs);
    this.sumMs += safeMs;

    if (this.samples.length > this.maxSamples) {
      const removed = this.samples.shift() ?? 0;
      this.sumMs -= removed;
    }
  }

  public getAverageFrameMs(): number {
    if (this.samples.length === 0) return GAME_CONFIG.desktopFrameBudgetMs;
    return this.sumMs / this.samples.length;
  }

  public getAverageFps(): number {
    const avgMs = this.getAverageFrameMs();
    return avgMs > 0 ? 1000 / avgMs : 60;
  }

  public getRecommendedQuality(): RecommendedQuality {
    const avgMs = this.getAverageFrameMs();
    if (avgMs <= GAME_CONFIG.desktopFrameBudgetMs * 1.05) {
      return 'high';
    }
    if (avgMs <= GAME_CONFIG.mobileFrameBudgetMs * 0.9) {
      return 'medium';
    }
    return 'low';
  }

  public getRecommendedLodScale(): number {
    const avgMs = this.getAverageFrameMs();
    if (avgMs <= GAME_CONFIG.desktopFrameBudgetMs) return 1.0;
    const ratio = GAME_CONFIG.desktopFrameBudgetMs / avgMs;
    return clamp(ratio, 0.5, 1.0);
  }

  public reset(): void {
    this.samples.length = 0;
    this.sumMs = 0;
  }
}
