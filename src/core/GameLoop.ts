export interface GameLoopStages {
  input?: (dt: number) => void;
  player?: (dt: number) => void;
  simulation?: (dt: number) => void;
  ai?: (dt: number) => void;
  combat?: (dt: number) => void;
  world?: (dt: number) => void;
  presentation?: (dt: number) => void;
  hud?: (dt: number) => void;
  render?: (dt: number) => void;
}

export const GAME_LOOP_STAGES: readonly (keyof GameLoopStages)[] = [
  'input',
  'player',
  'simulation',
  'ai',
  'combat',
  'world',
  'presentation',
  'hud',
  'render',
] as const;

/**
 * Pipeline determinístico de 9 etapas por quadro.
 */
export class GameLoop {
  public step(dt: number, stages: GameLoopStages): void {
    for (const stage of GAME_LOOP_STAGES) {
      const fn = stages[stage];
      if (fn) {
        fn(dt);
      }
    }
  }
}
