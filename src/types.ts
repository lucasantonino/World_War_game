import * as THREE from 'three';

export type WeaponId = 'rifle' | 'smg' | 'bazooka' | 'grenade';
export type CoverState = 'dugout' | 'sheltered' | 'peeking' | 'exposed';
export type SoldierRole = 'rifleman' | 'assault' | 'grenadier' | 'mg_gunner' | 'officer';
export type MissionId = 0 | 1 | 2 | 3;
export type QualityLevel = 'low' | 'medium' | 'high';
export type DifficultyLevel = 'recruit' | 'veteran' | 'infernal';
export type TouchControlMode = 'auto' | 'on' | 'off';
export type GameScreen = 'menu' | 'briefing' | 'playing' | 'paused' | 'kia' | 'victory';

export interface DifficultyModifier {
  id: DifficultyLevel;
  label: string;
  description: string;
  enemyDamageMult: number;
  enemySpreadMult: number;
  bleedChanceMult: number;
  waveCountMult: number;
  peekLockTime: number;
  openLockTime: number;
  allowCheckpoints: boolean;
  regenCapHp: number;
  regenDelaySec: number;
  regenRatePerSec: number;
  maxSimultaneousMobile: number;
  maxSimultaneousDesktopMed: number;
  maxSimultaneousDesktopHigh: number;
}

export interface PlayerCheckpointSnapshot {
  hp: number;
  bandages: number;
  weaponId: WeaponId;
  magAmmo: Record<WeaponId, number>;
  reserveAmmo: Record<WeaponId, number>;
}

export interface TrenchSegment {
  id: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  width: number;
  depth: number;
  parapetSide: 'north' | 'south' | 'none';
  hasSandbags: boolean;
  duckboards: boolean;
  faction: 'ally' | 'enemy';
}

export interface DugoutSpec {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  floorY: number;
  ceilingY: number;
  openSide: 'north' | 'south';
  label?: string;
  damageStage?: DestructionStage;
}

export interface RampSpec {
  id: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  width: number;
  y1: number;
  y2: number;
}

export interface Crater {
  x: number;
  z: number;
  radius: number;
  depth: number;
}

export interface TrenchCollapse {
  x: number;
  z: number;
  radius: number;
  depthLoss: number;
}

export interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  rotY: number;
}

export interface TreePropSpec {
  x: number;
  z: number;
  height?: number;
}

export interface FencePropSpec {
  x: number;
  z: number;
  len: number;
  rotY: number;
}

export type DestructionStage = 0 | 1 | 2;

export type DestructibleKind =
  | 'sandbag'
  | 'wire'
  | 'ruin'
  | 'building'
  | 'tree'
  | 'fence'
  | 'bunker_mg'
  | 'bunker_main'
  | 'crate_prop';

export interface DestructibleSpec {
  id: string;
  kind: DestructibleKind;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  hp: number;
  maxHp: number;
  blocksBullets: boolean;
  blocksMovement: boolean;
  blocksSight: boolean;
  rotationY?: number;
  stage?: DestructionStage;
}

export interface EmplacementSpec {
  id: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  faction: 'ally' | 'enemy';
}

export type InteractableKind = 'ammo_crate' | 'medic_crate' | 'mg_mount' | 'radio' | 'bunker_charge';

export interface InteractablePoint {
  id: string;
  kind: InteractableKind;
  x: number;
  y: number;
  z: number;
  label: string;
  radius: number;
  active: boolean;
}

export interface MissionPhase {
  id: string;
  objectiveText: string;
  objectiveSubtext: string;
  objectiveTarget: { x: number; z: number } | null;
  type:
    | 'survive_wave'
    | 'destroy_tanks'
    | 'bomber_storm'
    | 'activate_radio'
    | 'hold_timer'
    | 'reach_zone'
    | 'clear_trench'
    | 'plant_charge'
    | 'detonate_wait';
  enemiesToSpawn?: number;
  enemyRoles?: SoldierRole[];
  tanksToSpawn?: Array<{ x: number; z: number; heavy: boolean; waypoints: Array<{ x: number; z: number }> }>;
  bomberWaves?: number;
  artilleryRate?: number;
  durationSeconds?: number;
  targetZone?: { x: number; z: number; radius: number };
  radioOpening?: string;
}

export interface MissionEnvironment {
  skyTop: number;
  skyHorizon: number;
  fogColor: number;
  fogDensity: number;
  ambientColor: number;
  ambientIntensity: number;
  sunColor: number;
  sunIntensity: number;
  sunPosition: [number, number, number];
  isNight: boolean;
  hasRain: boolean;
  hasFlak: boolean;
  hasFlares: boolean;
  hasSearchlights: boolean;
}

export interface MissionConfig {
  id: MissionId;
  code: string;
  title: string;
  subtitle: string;
  briefingSummary: string;
  objectivesSummary: string[];
  threatsSummary: string[];
  fieldTip: string;
  environment: MissionEnvironment;
  playerSpawn: { x: number; z: number; yaw: number };
  trenches: TrenchSegment[];
  dugouts: DugoutSpec[];
  ramps: RampSpec[];
  initialCraters: Crater[];
  ruins: Array<{ x: number; z: number; w: number; h: number; d: number; rotY: number }>;
  buildings?: BuildingSpec[];
  trees?: TreePropSpec[];
  fences?: FencePropSpec[];
  barbedWires: Array<{ x: number; z: number; len: number; rotY: number }>;
  bunkers: Array<{
    id: string;
    kind: 'bunker_mg' | 'bunker_main';
    x: number;
    z: number;
    w: number;
    h: number;
    d: number;
    hp: number;
  }>;
  allyEmplacements: EmplacementSpec[];
  enemyEmplacements: EmplacementSpec[];
  interactables: InteractablePoint[];
  allyCount: number;
  phases: MissionPhase[];
}

export interface DamageIndicator {
  id: number;
  angleRad: number;
  intensity: number;
  age: number;
}

export interface GrenadeWarning {
  angleRad: number;
  distance: number;
  fuseProgress: number;
}

export interface HUDState {
  hp: number;
  maxHp: number;
  bleeding: boolean;
  bandages: number;
  bandagingProgress: number;
  suppression: number;
  tinnitus: number;
  exposure: number;
  coverState: CoverState;
  isCrouching: boolean;
  isSprinting: boolean;
  weaponId: WeaponId;
  ammoInMag: number;
  magCapacity: number;
  ammoReserve: number;
  reloadingProgress: number;
  grenades: number;
  rockets: number;
  cookingGrenadeProgress: number;
  adsFactor: number;
  mgMounted: boolean;
  mgHeat: number;
  mgOverheated: boolean;
  interactPrompt: string | null;
  actionProgress: number;
  actionLabel: string | null;
  grenadeWarning: GrenadeWarning | null;
  airRaidAlert: string | null;
  damageIndicators: DamageIndicator[];
  objectiveText: string;
  objectiveSubtext: string;
  radioCaption: string | null;
  compassYaw: number;
  objectiveBearing: number | null;
  objectiveDistance: number | null;
  missionTime: number;
  kills: number;
  tanksDestroyed: number;
  hitMarkerTimer: number;
  hitMarkerCrit: boolean;
  spreadPx: number;
  showControlsHint: boolean;
  peekDanger: number;
  isRegenerating: boolean;
  difficulty: DifficultyLevel;
  phaseIndex: number;
  totalPhases: number;
  checkpointToast: string | null;
  livingEnemies: number;
  remainingWaveEnemies: number;
  touchActive: boolean;
}

export interface GameSettings {
  mouseSensitivity: number;
  masterVolume: number;
  quality: QualityLevel;
  difficulty: DifficultyLevel;
  touchControls: TouchControlMode;
}

export interface RaycastHit {
  point: THREE.Vector3;
  normal: THREE.Vector3;
  distance: number;
  hitType: 'terrain' | 'obstacle' | 'destructible';
  destructibleId?: string;
}

export interface MissionEndSummary {
  missionId: MissionId;
  missionTitle: string;
  victory: boolean;
  causeOfDeath: string;
  tacticalAdvice: string;
  durationSeconds: number;
  kills: number;
  tanksDestroyed: number;
  shotsFired: number;
  shotsHit: number;
  difficulty: DifficultyLevel;
  canRetryCheckpoint: boolean;
  checkpointPhaseLabel: string | null;
}
