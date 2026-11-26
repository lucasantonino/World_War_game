/**
 * Constantes canônicas de frequência de simulação, orçamento de quadro e faixas de LOD.
 */
export const GAME_CONFIG = {
  combatHz: 30,
  aiNearHz: 10,
  squadHz: 3,
  directorHz: 1,
  distantBattleHz: 0.4,

  desktopFrameBudgetMs: 16.7,
  mobileFrameBudgetMs: 33.3,

  fullLodRadius: 32,
  tacticalLodRadius: 72,

  squadFullLodRadius: 36,
  squadTacticalLodRadius: 78,

  maxDtSec: 0.05,
} as const;

export type GameConfig = typeof GAME_CONFIG;
