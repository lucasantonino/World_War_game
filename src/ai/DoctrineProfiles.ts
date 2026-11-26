import { DoctrineType } from '../core/types';

export interface DoctrineProfile {
  type: DoctrineType;
  labelPtBr: string;
  coverWeight: number;
  visionWeight: number;
  distanceWeight: number;
  routeSafetyWeight: number;
  aggressiveness: number;
  flankTendency: number;
  retreatMoraleThreshold: number;
}

export const DOCTRINE_PROFILES: Record<DoctrineType, DoctrineProfile> = {
  defensive: {
    type: 'defensive',
    labelPtBr: 'Defensivo',
    coverWeight: 0.42,
    visionWeight: 0.24,
    distanceWeight: 0.16,
    routeSafetyWeight: 0.18,
    aggressiveness: 0.35,
    flankTendency: 0.15,
    retreatMoraleThreshold: 22
  },
  aggressive: {
    type: 'aggressive',
    labelPtBr: 'Agressivo',
    coverWeight: 0.18,
    visionWeight: 0.36,
    distanceWeight: 0.32,
    routeSafetyWeight: 0.14,
    aggressiveness: 0.9,
    flankTendency: 0.68,
    retreatMoraleThreshold: 12
  },
  cautious: {
    type: 'cautious',
    labelPtBr: 'Cauteloso',
    coverWeight: 0.38,
    visionWeight: 0.18,
    distanceWeight: 0.14,
    routeSafetyWeight: 0.3,
    aggressiveness: 0.3,
    flankTendency: 0.25,
    retreatMoraleThreshold: 36
  },
  coordinated: {
    type: 'coordinated',
    labelPtBr: 'Coordenado',
    coverWeight: 0.3,
    visionWeight: 0.28,
    distanceWeight: 0.2,
    routeSafetyWeight: 0.22,
    aggressiveness: 0.65,
    flankTendency: 0.78,
    retreatMoraleThreshold: 25
  },
  disorganized: {
    type: 'disorganized',
    labelPtBr: 'Desorganizado',
    coverWeight: 0.25,
    visionWeight: 0.2,
    distanceWeight: 0.35,
    routeSafetyWeight: 0.2,
    aggressiveness: 0.55,
    flankTendency: 0.18,
    retreatMoraleThreshold: 44
  },
  reserve: {
    type: 'reserve',
    labelPtBr: 'Reserva',
    coverWeight: 0.34,
    visionWeight: 0.22,
    distanceWeight: 0.2,
    routeSafetyWeight: 0.24,
    aggressiveness: 0.48,
    flankTendency: 0.42,
    retreatMoraleThreshold: 28
  }
};

export function getDoctrineProfile(doctrine: DoctrineType): DoctrineProfile {
  return DOCTRINE_PROFILES[doctrine];
}
