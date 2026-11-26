import { getDoctrineProfile } from '../../ai/DoctrineProfiles';
import { EventBus } from '../../core/EventBus';
import {
  clamp,
  DoctrineType,
  SimSoldierRole,
  SoldierProfile,
  SquadCommandType,
  SquadUnit,
  Vec3,
  vec3Dist,
  WoundLevel
} from '../../core/types';
import { SimulationWorld } from '../../simulation/SimulationWorld';
import { SuppressionSystem } from '../combat/SuppressionSystem';
import { getFormationOffsets } from './SquadFormation';
import { computeMorale, updateSquadMorale } from './SquadMorale';

interface DefaultSquadMemberSpec {
  callsign: string;
  role: SimSoldierRole;
  ammunition: number;
}

const DEFAULT_PLAYER_SQUAD_SPECS: readonly DefaultSquadMemberSpec[] = [
  { callsign: 'Soldado 01 Fuzileiro', role: 'rifleman', ammunition: 120 },
  { callsign: 'Soldado 02 Fuzileiro', role: 'rifleman', ammunition: 120 },
  { callsign: 'Soldado 03 Metralhador', role: 'mg_gunner', ammunition: 300 },
  { callsign: 'Soldado 04 Antitanque', role: 'antitank', ammunition: 6 },
  { callsign: 'Soldado 05 Médico', role: 'medic', ammunition: 60 },
  { callsign: 'Soldado 06 Granadeiro', role: 'grenadier', ammunition: 90 },
  { callsign: 'Soldado 07 Rádio', role: 'radio', ammunition: 90 }
];

const ENEMY_ROLE_CYCLE: readonly SimSoldierRole[] = [
  'officer',
  'rifleman',
  'mg_gunner',
  'rifleman',
  'grenadier',
  'antitank',
  'assault',
  'medic'
];

const BLEED_RATE_BY_WOUND: Record<WoundLevel, number> = {
  none: 0,
  light: 0,
  moderate: 1.1,
  severe: 2.6,
  incapacitated: 1.4
};

function moveTowards(current: Vec3, target: Vec3, maxStep: number): Vec3 {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const dz = target.z - current.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist <= maxStep || dist < 0.0001) {
    return { x: target.x, y: target.y, z: target.z };
  }
  const ratio = maxStep / dist;
  return {
    x: current.x + dx * ratio,
    y: current.y + dy * ratio,
    z: current.z + dz * ratio
  };
}

function downgradeWoundByHealth(health: number, maxHealth: number): WoundLevel {
  const ratio = health / Math.max(1, maxHealth);
  if (ratio >= 0.82) return 'none';
  if (ratio >= 0.62) return 'light';
  if (ratio >= 0.35) return 'moderate';
  return 'severe';
}

export class SquadSystem {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly suppressionSystem = new SuppressionSystem();
  private lastElapsedSec = 0;

  constructor(world: SimulationWorld, bus: EventBus) {
    this.world = world;
    this.bus = bus;
  }

  public spawnDefaultPlayerSquad(origin: Vec3): SquadUnit {
    const squadId = 'player_squad';
    const squad: SquadUnit = {
      id: squadId,
      name: 'Pelotão Alfa',
      faction: 'ally',
      doctrine: 'coordinated',
      state: 'idle',
      morale: 88,
      memberIds: [],
      sectorId: this.world.getSectorAt(origin)?.id ?? 'sector_a',
      activeCommand: null,
      isPlayerSquad: true,
      position: { ...origin },
      targetPosition: { ...origin },
      lodLevel: 'full'
    };

    this.world.addSquad(squad);

    const offsets = getFormationOffsets('regroup', DEFAULT_PLAYER_SQUAD_SPECS.length, 0);
    DEFAULT_PLAYER_SQUAD_SPECS.forEach((spec, index) => {
      const offset = offsets[index] ?? { x: 0, y: 0, z: 0 };
      const soldier: SoldierProfile = {
        id: `${squadId}_m${index + 1}`,
        callsign: spec.callsign,
        role: spec.role,
        faction: 'ally',
        squadId,
        position: {
          x: origin.x + offset.x,
          y: origin.y + offset.y,
          z: origin.z + offset.z
        },
        health: 100,
        maxHealth: 100,
        woundLevel: 'none',
        morale: 88,
        suppression: 0,
        fatigue: 0,
        ammunition: spec.ammunition,
        alive: true,
        wounded: false,
        experience: 10,
        state: 'idle'
      };
      this.world.addSoldier(soldier);
    });

    return squad;
  }

  public spawnEnemySquad(
    id: string,
    name: string,
    sectorId: string,
    origin: Vec3,
    count: number,
    doctrine: DoctrineType = 'defensive'
  ): SquadUnit {
    const safeCount = Math.max(1, Math.floor(count));
    const squad: SquadUnit = {
      id,
      name,
      faction: 'enemy',
      doctrine,
      state: 'defending',
      morale: 78,
      memberIds: [],
      sectorId,
      activeCommand: null,
      isPlayerSquad: false,
      position: { ...origin },
      targetPosition: { ...origin },
      lodLevel: 'tactical'
    };

    this.world.addSquad(squad);

    const offsets = getFormationOffsets('hold', safeCount, Math.PI);
    for (let i = 0; i < safeCount; i++) {
      const role = ENEMY_ROLE_CYCLE[i % ENEMY_ROLE_CYCLE.length];
      const offset = offsets[i] ?? { x: 0, y: 0, z: 0 };
      const soldier: SoldierProfile = {
        id: `${id}_m${i + 1}`,
        callsign: `${name} #${i + 1}`,
        role,
        faction: 'enemy',
        squadId: id,
        position: {
          x: origin.x + offset.x,
          y: origin.y + offset.y,
          z: origin.z + offset.z
        },
        health: 100,
        maxHealth: 100,
        woundLevel: 'none',
        morale: 78,
        suppression: 0,
        fatigue: 0,
        ammunition: role === 'mg_gunner' ? 240 : role === 'antitank' ? 4 : 90,
        alive: true,
        wounded: false,
        experience: 5,
        state: 'patrolling'
      };
      this.world.addSoldier(soldier);
    }

    return squad;
  }

  public update(dt: number, elapsedSec: number, playerPos?: Vec3): void {
    const safeDt = Math.max(0, dt);
    this.lastElapsedSec = Math.max(this.lastElapsedSec, elapsedSec);

    const allSquads = Array.from(this.world.squads.values());

    for (const squad of allSquads) {
      const members = this.world.getSquadMembers(squad.id);
      const aliveMembers = members.filter((m) => m.alive && m.state !== 'dead');

      if (aliveMembers.length === 0) {
        squad.state = 'disabled';
        squad.morale = 0;
        continue;
      }

      // 1. Atualiza supressão e sangramento dos soldados vivos
      for (const soldier of aliveMembers) {
        const inCover =
          soldier.state === 'seeking_cover' ||
          squad.state === 'defending' ||
          squad.state === 'suppressed';
        soldier.suppression = this.suppressionSystem.stepSuppression(
          soldier.suppression,
          safeDt,
          inCover
        );

        const bleedRate = BLEED_RATE_BY_WOUND[soldier.woundLevel];
        if (bleedRate > 0 && safeDt > 0) {
          soldier.health = Math.max(0, soldier.health - bleedRate * safeDt);
          if (soldier.health <= 0) {
            soldier.alive = false;
            soldier.wounded = true;
            soldier.woundLevel = 'incapacitated';
            soldier.state = 'dead';
            this.bus.emit('soldier.killed', {
              soldierId: soldier.id,
              faction: soldier.faction
            });
          }
        }
      }

      const activeAlive = aliveMembers.filter((m) => m.alive && m.state !== 'dead');
      if (activeAlive.length === 0) {
        squad.state = 'disabled';
        squad.morale = 0;
        continue;
      }

      // 2. Atendimento médico em campo (Soldado Médico tratando feridos próximos)
      const medic = activeAlive.find(
        (m) => m.role === 'medic' && m.woundLevel !== 'incapacitated' && m.state !== 'incapacitated'
      );
      let medicTargetId: string | null = null;
      if (medic && safeDt > 0) {
        const woundedList = activeAlive
          .filter(
            (m) =>
              m.id !== medic.id &&
              (m.woundLevel === 'moderate' ||
                m.woundLevel === 'severe' ||
                m.woundLevel === 'incapacitated')
          )
          .sort(
            (a, b) => vec3Dist(medic.position, a.position) - vec3Dist(medic.position, b.position)
          );

        const patient = woundedList[0];
        if (patient) {
          medicTargetId = patient.id;
          const distToPatient = vec3Dist(medic.position, patient.position);
          if (distToPatient <= 4.5) {
            patient.health = Math.min(patient.maxHealth, patient.health + 14 * safeDt);
            patient.woundLevel = downgradeWoundByHealth(patient.health, patient.maxHealth);
            patient.wounded = patient.woundLevel !== 'none';
            if (patient.woundLevel !== 'incapacitated' && patient.state === 'incapacitated') {
              patient.state = 'wounded';
            } else if (!patient.wounded && patient.state === 'wounded') {
              patient.state = 'idle';
            }
          } else {
            medic.position = moveTowards(medic.position, patient.position, 4.6 * safeDt);
            medic.state = 'moving';
          }
        }
      }

      // 3. Atualização progressiva da moral do pelotão
      const totalCount = Math.max(members.length, squad.memberIds.length, 1);
      const casualtyImpact = (1 - activeAlive.length / totalCount) * 55;
      const avgSuppression =
        activeAlive.reduce((acc, m) => acc + m.suppression, 0) / activeAlive.length;

      const hadOfficer = members.some((m) => m.role === 'officer');
      const leaderLost = hadOfficer
        ? members.some((m) => m.role === 'officer' && !m.alive)
        : false;

      let nearbyAllies = 0;
      for (const other of allSquads) {
        if (other.id === squad.id || other.faction !== squad.faction || other.state === 'disabled') {
          continue;
        }
        if (vec3Dist(squad.position, other.position) <= 65) {
          nearbyAllies++;
        }
      }
      const playerNear =
        squad.isPlayerSquad && playerPos ? vec3Dist(squad.position, playerPos) <= 35 : false;
      const isolated = nearbyAllies === 0 && !playerNear && (squad.isPlayerSquad ? !!playerPos : true);
      const allySupport = clamp(nearbyAllies * 8 + (playerNear ? 10 : 0), 0, 22);

      const targetMorale = computeMorale({
        baseMorale: 86,
        casualtyImpact,
        suppression: avgSuppression,
        leaderLost,
        isolated,
        allySupport
      });
      squad.morale = updateSquadMorale(squad.morale, targetMorale, safeDt);

      for (const m of activeAlive) {
        m.morale = squad.morale;
      }

      // 4. Estado do pelotão e deslocamento em formação tática
      const doctrine = getDoctrineProfile(squad.doctrine);
      if (squad.morale < doctrine.retreatMoraleThreshold) {
        squad.state = 'retreating';
      } else if (avgSuppression >= 55) {
        squad.state = 'suppressed';
      }

      const commandType: SquadCommandType = squad.activeCommand?.type ?? 'hold';
      const anchor: Vec3 =
        commandType === 'regroup' && squad.isPlayerSquad && playerPos
          ? playerPos
          : squad.targetPosition;

      const dx = anchor.x - squad.position.x;
      const dz = anchor.z - squad.position.z;
      const yaw = Math.hypot(dx, dz) > 0.25 ? Math.atan2(dx, -dz) : 0;

      const offsets = getFormationOffsets(commandType, activeAlive.length, yaw);

      let sumX = 0;
      let sumY = 0;
      let sumZ = 0;

      activeAlive.forEach((soldier, idx) => {
        if (
          soldier.id !== medicTargetId ||
          soldier.role !== 'medic'
        ) {
          if (soldier.woundLevel !== 'incapacitated' && soldier.state !== 'incapacitated' && safeDt > 0) {
            // Se este soldado é o médico e está indo atender um ferido, preserva deslocamento médico
            const isMedicAttending = soldier.role === 'medic' && medicTargetId !== null;
            if (!isMedicAttending) {
              const offset = offsets[idx] ?? { x: 0, y: 0, z: 0 };
              const slotPos: Vec3 = {
                x: anchor.x + offset.x,
                y: anchor.y + offset.y,
                z: anchor.z + offset.z
              };
              const distToSlot = vec3Dist(soldier.position, slotPos);
              if (distToSlot > 0.45) {
                const woundFactor =
                  soldier.woundLevel === 'severe'
                    ? 0.55
                    : soldier.woundLevel === 'moderate'
                      ? 0.78
                      : 1.0;
                const suppFactor = soldier.suppression >= 60 ? 0.68 : 1.0;
                const speed = 4.2 * woundFactor * suppFactor;
                soldier.position = moveTowards(soldier.position, slotPos, speed * safeDt);
                soldier.state = soldier.suppression >= 55 ? 'suppressed' : 'moving';
              } else if (soldier.state === 'moving') {
                soldier.state = soldier.suppression >= 55 ? 'suppressed' : 'idle';
              }
            }
          }
        }

        sumX += soldier.position.x;
        sumY += soldier.position.y;
        sumZ += soldier.position.z;
      });

      squad.position = {
        x: sumX / activeAlive.length,
        y: sumY / activeAlive.length,
        z: sumZ / activeAlive.length
      };

      if (
        squad.state === 'moving' &&
        vec3Dist(squad.position, anchor) <= 2.2
      ) {
        squad.state = commandType === 'advance' ? 'engaging' : 'defending';
      }
    }
  }
}
