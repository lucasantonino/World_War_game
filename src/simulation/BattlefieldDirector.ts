import type { EventBus } from '../core/EventBus.ts';
import { GAME_CONFIG } from '../core/GameConfig.ts';
import {
  vec3Dist,
  type RadioMessage,
  type SimLODLevel,
  type SimSoldierRole,
  type SoldierProfile,
  type SquadUnit,
  type Vec3,
} from '../core/types.ts';
import { BattlefieldEventSystem } from './BattlefieldEventSystem.ts';
import { DistantBattleSimulator } from './DistantBattleSimulator.ts';
import { LogisticsSystem } from './LogisticsSystem.ts';
import { ReinforcementSystem } from './ReinforcementSystem.ts';
import { createDefaultSectorsForMission, SectorSystem } from './SectorSystem.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

const PLAYER_SQUAD_ROLES: readonly SimSoldierRole[] = [
  'officer',
  'rifleman',
  'mg_gunner',
  'assault',
  'medic',
  'grenadier',
  'antitank',
  'radio',
];

const SQUAD_CALLSIGNS = [
  'Ten. Mendes',
  'Cb. Rocha',
  'Sd. Ferreira',
  'Sd. Lima',
  'Sd. Martins',
  'Sd. Costa',
  'Sd. Almeida',
  'Sd. Teixeira',
];

/**
 * Coordenador estratégico autônomo do campo de batalha:
 * gerencia LOD contínuo de pelotões, setores, combate distante, eventos, logística e reforços.
 */
export class BattlefieldDirector {
  public readonly world: SimulationWorld;
  public readonly bus: EventBus;
  public readonly sectorSystem: SectorSystem;
  public readonly distantSim: DistantBattleSimulator;
  public readonly eventSystem: BattlefieldEventSystem;
  public readonly reinforcements: ReinforcementSystem;
  public readonly logistics: LogisticsSystem;

  private lastStrategicAlertAt = -Infinity;
  private alertSeq = 0;

  constructor(world: SimulationWorld, bus: EventBus, seed?: number) {
    this.world = world;
    this.bus = bus;
    if (seed !== undefined) {
      this.world.seed = seed;
    }
    this.sectorSystem = new SectorSystem(world, bus);
    this.distantSim = new DistantBattleSimulator(world, bus, seed ?? world.seed);
    this.eventSystem = new BattlefieldEventSystem(world, bus, seed ?? world.seed);
    this.reinforcements = new ReinforcementSystem(world, bus);
    this.logistics = new LogisticsSystem(world);
  }

  public initializeMission(missionId: number, seed?: number): void {
    this.world.clear();
    this.world.seed = seed ?? 1944 + missionId * 37;
    this.lastStrategicAlertAt = -Infinity;

    const sectors = createDefaultSectorsForMission(missionId);
    for (const sector of sectors) {
      this.world.addSector(sector);
    }

    // Pelotão do jogador (8 integrantes) em A — Trincheira Aliada.
    const sectorA = sectors[0];
    this.spawnInitialSquad({
      id: 'squad-player',
      name: '1º Pelotão Vanguarda',
      faction: 'ally',
      sectorId: sectorA.id,
      center: sectorA.center,
      count: 8,
      isPlayerSquad: true,
      lodLevel: 'full',
      doctrine: 'coordinated',
    });

    // Pelotão aliado avançado disputando o setor B.
    const sectorB = sectors[1];
    this.spawnInitialSquad({
      id: 'squad-ally-b',
      name: '2º Pelotão Reconhecimento',
      faction: 'ally',
      sectorId: sectorB.id,
      center: { x: sectorB.center.x - 4, y: 0, z: sectorB.center.z + 6 },
      count: 6,
      isPlayerSquad: false,
      lodLevel: 'tactical',
      doctrine: 'aggressive',
    });

    // Pelotões inimigos em B, C, D e E para frente viva em toda a campanha.
    this.spawnInitialSquad({
      id: 'squad-enemy-b',
      name: 'Destacamento Avançado Inimigo',
      faction: 'enemy',
      sectorId: sectorB.id,
      center: { x: sectorB.center.x + 5, y: 0, z: sectorB.center.z - 6 },
      count: 6,
      isPlayerSquad: false,
      lodLevel: 'tactical',
      doctrine: 'defensive',
    });

    const sectorC = sectors[2];
    this.spawnInitialSquad({
      id: 'squad-enemy-c',
      name: 'Guarnição do Vilarejo',
      faction: 'enemy',
      sectorId: sectorC.id,
      center: sectorC.center,
      count: 8,
      isPlayerSquad: false,
      lodLevel: 'strategic',
      doctrine: 'defensive',
    });

    const sectorD = sectors[3];
    this.spawnInitialSquad({
      id: 'squad-ally-d',
      name: '3º Pelotão Flanco Oeste',
      faction: 'ally',
      sectorId: sectorD.id,
      center: { x: sectorD.center.x, y: 0, z: sectorD.center.z + 8 },
      count: 5,
      isPlayerSquad: false,
      lodLevel: 'strategic',
      doctrine: 'cautious',
    });
    this.spawnInitialSquad({
      id: 'squad-enemy-d',
      name: 'Patrulha da Floresta',
      faction: 'enemy',
      sectorId: sectorD.id,
      center: { x: sectorD.center.x, y: 0, z: sectorD.center.z - 8 },
      count: 5,
      isPlayerSquad: false,
      lodLevel: 'strategic',
      doctrine: 'cautious',
    });

    const sectorE = sectors[4];
    this.spawnInitialSquad({
      id: 'squad-enemy-e',
      name: 'Bateria da Colina',
      faction: 'enemy',
      sectorId: sectorE.id,
      center: sectorE.center,
      count: 8,
      isPlayerSquad: false,
      lodLevel: 'strategic',
      doctrine: 'defensive',
    });
  }

  public update(dt: number, elapsedSec: number, playerPos?: Vec3): void {
    const safeDt = Number.isFinite(dt) && dt > 0 ? dt : 0;
    const referencePos =
      playerPos ??
      this.world.getPlayerSquad()?.position ?? { x: 0, y: 0, z: 70 };

    this.updateSquadLods(referencePos);
    this.sectorSystem.update(safeDt);
    this.distantSim.step(safeDt);
    this.logistics.update(safeDt);
    this.reinforcements.update(safeDt);
    this.eventSystem.update(safeDt, elapsedSec);
    this.evaluateStrategicAlerts(elapsedSec);
  }

  private updateSquadLods(referencePos: Vec3): void {
    for (const squad of this.world.squads.values()) {
      const distance = vec3Dist(referencePos, squad.position);
      let targetLod: SimLODLevel;
      if (distance < GAME_CONFIG.squadFullLodRadius) {
        targetLod = 'full';
      } else if (distance < GAME_CONFIG.squadTacticalLodRadius) {
        targetLod = 'tactical';
      } else {
        targetLod = 'strategic';
      }

      if (squad.lodLevel === 'strategic' && targetLod !== 'strategic') {
        this.distantSim.materializeSquad(squad.id, targetLod);
      } else {
        squad.lodLevel = targetLod;
      }
    }
  }

  private evaluateStrategicAlerts(elapsedSec: number): void {
    if (elapsedSec - this.lastStrategicAlertAt < 30) {
      return;
    }

    if (this.world.reserves.ally <= 4) {
      this.pushAlert(
        'command',
        'Alto Comando',
        'Atenção: reservas aliadas em nível crítico. Consolide setores capturados.',
        elapsedSec
      );
      return;
    }

    const threatenedAllySector = this.world.sectors.find(
      (s) => s.owner === 'ally' && s.contested && s.controlProgress < 60
    );
    if (threatenedAllySector) {
      this.pushAlert(
        'emergency',
        'Posto de Observação',
        `Alerta tático: ${threatenedAllySector.name} sob forte pressão inimiga!`,
        elapsedSec
      );
    }
  }

  private pushAlert(
    channel: RadioMessage['channel'],
    sender: string,
    text: string,
    timestamp: number
  ): void {
    this.lastStrategicAlertAt = timestamp;
    this.alertSeq += 1;
    const msg: RadioMessage = {
      id: `radio-alert-${this.alertSeq}`,
      channel,
      sender,
      text,
      timestamp,
      degraded: false,
    };
    this.world.pushRadioMessage(msg);
    this.bus.emit('radio.message.sent', msg);
  }

  private spawnInitialSquad(opts: {
    id: string;
    name: string;
    faction: 'ally' | 'enemy';
    sectorId: string;
    center: Vec3;
    count: number;
    isPlayerSquad: boolean;
    lodLevel: SimLODLevel;
    doctrine: SquadUnit['doctrine'];
  }): void {
    const squad: SquadUnit = {
      id: opts.id,
      name: opts.name,
      faction: opts.faction,
      doctrine: opts.doctrine,
      state: 'defending',
      morale: 88,
      memberIds: [],
      sectorId: opts.sectorId,
      activeCommand: null,
      isPlayerSquad: opts.isPlayerSquad,
      position: { ...opts.center },
      targetPosition: { ...opts.center },
      lodLevel: opts.lodLevel,
    };

    this.world.addSquad(squad);

    for (let i = 0; i < opts.count; i++) {
      const angle = (i / Math.max(1, opts.count)) * Math.PI * 2;
      const spread = 3 + (i % 2) * 1.5;
      const role = PLAYER_SQUAD_ROLES[i % PLAYER_SQUAD_ROLES.length];
      const callsign = opts.isPlayerSquad
        ? SQUAD_CALLSIGNS[i % SQUAD_CALLSIGNS.length]
        : `${opts.faction === 'ally' ? 'AL' : 'IN'}-${opts.id.slice(-1).toUpperCase()}${i + 1}`;

      const soldier: SoldierProfile = {
        id: `${opts.id}-m${i + 1}`,
        callsign,
        role,
        faction: opts.faction,
        squadId: opts.id,
        position: {
          x: opts.center.x + Math.cos(angle) * spread,
          y: opts.center.y,
          z: opts.center.z + Math.sin(angle) * spread,
        },
        health: 100,
        maxHealth: 100,
        woundLevel: 'none',
        morale: 88,
        suppression: 0,
        fatigue: 0,
        ammunition: 120,
        alive: true,
        wounded: false,
        experience: 1,
        state: 'idle',
      };

      this.world.addSoldier(soldier);
    }
  }
}
