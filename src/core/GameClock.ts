import { GAME_CONFIG } from './GameConfig.ts';

/**
 * Relógio da simulação com proteção contra saltos de delta, pausa e escala temporal.
 */
export class GameClock {
  public paused = false;
  public timeScale = 1;
  public realTime = 0;
  public simTime = 0;

  public tick(rawDtSec: number): number {
    const finiteDt = Number.isFinite(rawDtSec) ? rawDtSec : 0;
    const clampedDt = Math.max(0, Math.min(GAME_CONFIG.maxDtSec, finiteDt));
    this.realTime += clampedDt;

    if (this.paused) {
      return 0;
    }

    const safeScale = Number.isFinite(this.timeScale)
      ? Math.max(0, this.timeScale)
      : 1;
    const simDt = Math.min(GAME_CONFIG.maxDtSec, clampedDt * safeScale);
    this.simTime += simDt;
    return simDt;
  }

  public reset(): void {
    this.paused = false;
    this.timeScale = 1;
    this.realTime = 0;
    this.simTime = 0;
  }
}
