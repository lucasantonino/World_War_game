export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function vec3DistSq(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

export function vec3Dist(a: Vec3, b: Vec3): number {
  return Math.sqrt(vec3DistSq(a, b));
}

export type Faction = 'ally' | 'enemy' | 'neutral';

export type SimSoldierRole =
  | 'rifleman'
  | 'mg_gunner'
  | 'antitank'
  | 'medic'
  | 'grenadier'
  | 'radio'
  | 'assault'
  | 'officer'
  | 'flamethrower';

export type SquadState =
  | 'idle'
  | 'moving'
  | 'engaging'
  | 'suppressed'
  | 'reorganizing'
  | 'retreating'
  | 'defending'
  | 'disabled';

export type SoldierState =
  | 'idle'
  | 'patrolling'
  | 'moving'
  | 'seeking_cover'
  | 'aiming'
  | 'firing'
  | 'reloading'
  | 'suppressed'
  | 'wounded'
  | 'incapacitated'
  | 'dead';

export type PerceptionState =
  | 'unaware'
  | 'suspicious'
  | 'investigating'
  | 'detected'
  | 'engaging'
  | 'lost_contact';

export type DoctrineType =
  | 'defensive'
  | 'aggressive'
  | 'cautious'
  | 'coordinated'
  | 'disorganized'
  | 'reserve';

export type WoundLevel = 'none' | 'light' | 'moderate' | 'severe' | 'incapacitated';

export type DamageType =
  | 'bullet'
  | 'heavy_mg'
  | 'shotgun'
  | 'sniper'
  | 'explosion'
  | 'shell'
  | 'fire'
  | 'melee';

export type HitZone =
  | 'head'
  | 'torso'
  | 'limb'
  | 'armor_front'
  | 'armor_side'
  | 'armor_rear'
  | 'tracks'
  | 'turret'
  | 'engine';

export type MaterialType =
  | 'flesh'
  | 'sandbag'
  | 'wood'
  | 'masonry'
  | 'concrete'
  | 'steel_light'
  | 'steel_heavy';

export type VehicleState =
  | 'idle'
  | 'moving'
  | 'engaging'
  | 'repositioning'
  | 'damaged'
  | 'disabled'
  | 'destroyed';

export type RadioChannel = 'command' | 'squad' | 'operational' | 'emergency';

export type BattlefieldEventCategory = 'combat' | 'logistics' | 'emergency' | 'environment';

export type SquadCommandType =
  | 'advance'
  | 'hold'
  | 'flank'
  | 'regroup'
  | 'focus_target'
  | 'attack_vehicle'
  | 'cover_entry'
  | 'defend_position'
  | 'rescue_wounded'
  | 'request_ammo';

export type SimLODLevel = 'strategic' | 'tactical' | 'full';

export interface SoldierProfile {
  id: string;
  callsign: string;
  role: SimSoldierRole;
  faction: Faction;
  squadId: string;
  position: Vec3;
  health: number;
  maxHealth: number;
  woundLevel: WoundLevel;
  morale: number;
  suppression: number;
  fatigue: number;
  ammunition: number;
  alive: boolean;
  wounded: boolean;
  experience: number;
  state: SoldierState;
}

export interface SquadCommand {
  squadId: string;
  type: SquadCommandType;
  targetPosition?: Vec3;
  targetEntityId?: string;
  issuedAt: number;
}

export interface SquadUnit {
  id: string;
  name: string;
  faction: Faction;
  doctrine: DoctrineType;
  state: SquadState;
  morale: number;
  memberIds: string[];
  sectorId: string;
  activeCommand: SquadCommand | null;
  isPlayerSquad: boolean;
  position: Vec3;
  targetPosition: Vec3;
  lodLevel: SimLODLevel;
}

export interface DamageContext {
  sourceId: string;
  targetId: string;
  damageType: DamageType;
  baseDamage: number;
  impactPosition: Vec3;
  hitZone?: HitZone;
  distance: number;
  material?: MaterialType;
  targetCoverFactor?: number;
}

export type VehicleSubsystem = 'engine' | 'tracks' | 'turret' | 'cannon' | 'crew';

export interface DamageResult {
  finalDamage: number;
  penetration: number;
  woundLevel: WoundLevel;
  causesBleeding: boolean;
  suppressionImpulse: number;
  subsystemDamaged?: VehicleSubsystem;
  fatal: boolean;
}

export interface PerceivedEntity {
  entityId: string;
  faction: Faction;
  lastKnownPosition: Vec3;
  confidence: number;
  threatLevel: number;
  lastSeenAt: number;
  source: 'visual' | 'audio' | 'radio';
  state: PerceptionState;
}

export interface BattlefieldSector {
  id: string;
  code: string;
  name: string;
  owner: Faction;
  controlProgress: number;
  strategicValue: number;
  threatLevel: number;
  activeSquads: string[];
  reinforcementPoints: number;
  contested: boolean;
  center: Vec3;
  radius: number;
}

export interface BattlefieldEvent {
  id: string;
  category: BattlefieldEventCategory;
  title: string;
  description: string;
  sectorId: string;
  triggeredAt: number;
  channel: RadioChannel;
}

export interface RadioMessage {
  id: string;
  channel: RadioChannel;
  sender: string;
  text: string;
  timestamp: number;
  degraded: boolean;
}

export interface CampaignOperationResult {
  missionId: number;
  victory: boolean;
  durationSec: number;
  kills: number;
  tanksDestroyed: number;
  secondaryObjectivesDone: number;
  survivingSquadIds: string[];
  lostSquadIds: string[];
  sectorsCaptured: number;
}

export interface CampaignState {
  completedOps: number[];
  squadRoster: SoldierProfile[];
  ammoBonus: number;
  artilleryBonus: number;
  supportLevel: number;
  history: CampaignOperationResult[];
}

export type GameEvent =
  | { type: 'squad.command.issued'; payload: SquadCommand }
  | { type: 'soldier.wounded'; payload: { soldierId: string; woundLevel: WoundLevel } }
  | { type: 'soldier.killed'; payload: { soldierId: string; faction: Faction } }
  | { type: 'sector.captured'; payload: { sectorId: string; faction: Faction } }
  | { type: 'sector.contested'; payload: { sectorId: string } }
  | { type: 'vehicle.disabled'; payload: { vehicleId: string; faction: Faction } }
  | {
      type: 'vehicle.subsystem.damaged';
      payload: { vehicleId: string; subsystem: VehicleSubsystem; hp: number };
    }
  | { type: 'reinforcement.requested'; payload: { sectorId: string; faction: Faction } }
  | { type: 'battlefield.event.triggered'; payload: BattlefieldEvent }
  | { type: 'radio.message.sent'; payload: RadioMessage }
  | { type: 'artillery.requested'; payload: { target: Vec3; faction: Faction } }
  | { type: 'mission.completed'; payload: CampaignOperationResult };
