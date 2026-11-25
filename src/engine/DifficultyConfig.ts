import { DifficultyLevel, DifficultyModifier, QualityLevel } from '../types';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyModifier> = {
  recruit: {
    id: 'recruit',
    label: 'Recruta',
    description: 'Dano e precisão inimiga reduzidos, menor risco de sangramento e checkpoints por fase.',
    enemyDamageMult: 0.65,
    enemySpreadMult: 1.35,
    bleedChanceMult: 0.45,
    waveCountMult: 0.85,
    peekLockTime: 4.8,
    openLockTime: 2.2,
    allowCheckpoints: true,
    regenCapHp: 40,
    regenDelaySec: 5.0,
    regenRatePerSec: 6.5,
    maxSimultaneousMobile: 70,
    maxSimultaneousDesktopMed: 130,
    maxSimultaneousDesktopHigh: 160
  },
  veteran: {
    id: 'veteran',
    label: 'Veterano',
    description: 'Experiência tática equilibrada: espiar exige cuidado, campo aberto é fatal e checkpoints por fase.',
    enemyDamageMult: 0.88,
    enemySpreadMult: 1.08,
    bleedChanceMult: 0.8,
    waveCountMult: 1.0,
    peekLockTime: 3.4,
    openLockTime: 1.5,
    allowCheckpoints: true,
    regenCapHp: 40,
    regenDelaySec: 6.0,
    regenRatePerSec: 5.5,
    maxSimultaneousMobile: 95,
    maxSimultaneousDesktopMed: 190,
    maxSimultaneousDesktopHigh: 240
  },
  infernal: {
    id: 'infernal',
    label: 'Infernal',
    description: 'Fogo implacável, enxames de centenas de inimigos e SEM checkpoints na operação.',
    enemyDamageMult: 1.25,
    enemySpreadMult: 0.82,
    bleedChanceMult: 1.35,
    waveCountMult: 2.2,
    peekLockTime: 2.1,
    openLockTime: 0.9,
    allowCheckpoints: false,
    regenCapHp: 40,
    regenDelaySec: 7.0,
    regenRatePerSec: 4.5,
    maxSimultaneousMobile: 120,
    maxSimultaneousDesktopMed: 260,
    maxSimultaneousDesktopHigh: 500
  }
};

export function getDifficultyConfig(level?: DifficultyLevel): DifficultyModifier {
  if (level && level in DIFFICULTY_CONFIGS) {
    return DIFFICULTY_CONFIGS[level];
  }
  return DIFFICULTY_CONFIGS.veteran;
}

export function getMaxSimultaneousEnemies(
  level: DifficultyLevel,
  quality: QualityLevel,
  isMobile: boolean
): number {
  const cfg = getDifficultyConfig(level);
  if (isMobile) return cfg.maxSimultaneousMobile;
  if (quality === 'high') return cfg.maxSimultaneousDesktopHigh;
  return cfg.maxSimultaneousDesktopMed;
}
