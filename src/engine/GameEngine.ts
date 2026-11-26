import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GameApplication } from '../core/GameApplication';
import { BomberSystem } from '../entities/BomberSystem';
import { PlayerController, WEAPON_STATS } from '../entities/PlayerController';
import { ProjectileSystem } from '../entities/ProjectileSystem';
import { SoldierSystem } from '../entities/SoldierSystem';
import { TankSystem } from '../entities/TankSystem';
import { VFXSystem } from '../entities/VFXSystem';
import { SquadCommandSystem } from '../gameplay/squads/SquadCommandSystem';
import { SquadCommunication } from '../gameplay/squads/SquadCommunication';
import { SquadSystem } from '../gameplay/squads/SquadSystem';
import { CampaignManager } from '../missions/CampaignManager';
import { UIManager } from '../ui/UIManager';
import {
  GameScreen,
  GameSettings,
  HUDState,
  InteractablePoint,
  MissionConfig,
  MissionEndSummary,
  MissionId,
  PlayerCheckpointSnapshot,
  PlayerLoadout,
  PrimaryWeaponId,
  RadioChannel,
  SecondaryWeaponId,
  SoldierRole,
  SquadCommandType,
  SurvivalRecord,
  WeaponId
} from '../types';
import { CoverSystem } from '../world/CoverSystem';
import { EnvironmentBuilder } from '../world/EnvironmentBuilder';
import { getMissionConfig } from '../world/MissionData';
import { Terrain } from '../world/Terrain';
import { AudioEngine } from './AudioEngine';
import { DIFFICULTY_CONFIGS, getDifficultyConfig, getMaxSimultaneousEnemies } from './DifficultyConfig';
import { InputManager } from './InputManager';

const STORAGE_COMPLETED_KEY = 'tdn_completed_ops_v1';
const STORAGE_SETTINGS_KEY = 'tdn_settings_v1';
const STORAGE_UNLOCKS_KEY = 'tdn_unlocks_v1';
const STORAGE_LOADOUT_KEY = 'tdn_loadout_v1';
const STORAGE_SURVIVAL_KEY = 'tdn_survival_best_v1';

const DEFAULT_UNLOCKED_WEAPONS: WeaponId[] = ['rifle', 'smg', 'pistol', 'bazooka', 'grenade'];

const WAR_GRADE_VIGNETTE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uTint: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
    uSaturation: { value: 0.84 },
    uContrast: { value: 1.06 },
    uVignette: { value: 0.26 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;
    uniform float uSaturation;
    uniform float uContrast;
    uniform float uVignette;
    varying vec2 vUv;
    void main() {
      vec4 tex = texture2D(tDiffuse, vUv);
      vec3 col = tex.rgb;
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, uSaturation);
      col = (col - 0.5) * uContrast + 0.5;
      col *= uTint;
      float dist = distance(vUv, vec2(0.5));
      float vig = smoothstep(0.38, 0.92, dist);
      col *= 1.0 - vig * uVignette;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), tex.a);
    }
  `
};

interface ArtillerySalvoShell {
  x: number;
  z: number;
  delay: number;
  whistled: boolean;
}

export class GameEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private gradePass: ShaderPass | null = null;

  private audio: AudioEngine;
  private input: InputManager;
  private terrain: Terrain;
  private cover: CoverSystem;
  private envBuilder: EnvironmentBuilder;
  private vfx: VFXSystem;
  private projectiles: ProjectileSystem;
  private player: PlayerController;
  private soldiers: SoldierSystem;
  private tanks: TankSystem;
  private bombers: BomberSystem;
  private ui: UIManager;

  private screen: GameScreen = 'menu';
  private activeMission: MissionConfig;
  private selectedMissionId: MissionId = 0;
  private phaseIndex = 0;
  private phaseTimer = 0;
  private artilleryCooldown = 999;
  private missionElapsed = 0;
  private kills = 0;
  private tanksDestroyed = 0;

  private radioCaption: string | null = null;
  private radioCaptionTimer = 0;
  private airRaidAlert: string | null = null;
  private airRaidAlertTimer = 0;
  private liveInteractables: InteractablePoint[] = [];
  private dropMeshes = new Map<string, THREE.Object3D>();
  private nextDropId = 1;

  private artillerySalvoQueue: ArtillerySalvoShell[] = [];
  private pendingStrafeWaves = 0;
  private strafeCooldown = 999;
  private troopCarTimer = 26;

  private campAnchor = new THREE.Vector3();
  private campTimer = 0;
  private mortarZeroed = false;
  private mortarZeroSalvoCooldown = 0;
  private mortarWarningText: string | null = null;

  private survivalWave = 1;
  private survivalRecord: SurvivalRecord;

  private checkpointPhaseIndex = 0;
  private checkpointSnapshot: PlayerCheckpointSnapshot | null = null;
  private checkpointToast: string | null = null;
  private checkpointToastTimer = 0;
  private checkpointKills = 0;
  private checkpointTanks = 0;
  private checkpointElapsed = 0;

  private settings: GameSettings;
  private completedMissions = new Set<MissionId>();
  private unlockedWeapons = new Set<WeaponId>(DEFAULT_UNLOCKED_WEAPONS);
  private loadout: PlayerLoadout;

  private clock = new THREE.Clock();
  private totalElapsed = 0;
  private wasInMission = false;
  private tmpTankCamPos = new THREE.Vector3();

  private app: GameApplication;
  private squadSystem: SquadSystem;
  private squadCommands: SquadCommandSystem;
  private squadComms: SquadCommunication;
  private campaignManager: CampaignManager;
  private radioChannel: RadioChannel = 'command';
  private radioDegraded = false;
  private squadActiveCommand: SquadCommandType = 'hold';
  private squadStepAccumDt = 0;
  private sectorsCapturedCount = 0;
  private reportedDisabledSubsystems = new Set<string>();
  private medicRadioCooldown = 0;

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.app = new GameApplication();
    this.squadSystem = new SquadSystem(this.app.world, this.app.bus);
    this.squadCommands = new SquadCommandSystem(this.app.world, this.app.bus);
    this.squadComms = new SquadCommunication(this.app.world, this.app.bus);
    this.campaignManager = new CampaignManager(this.app.saves, this.app.bus);
    this.settings = this.loadSettings();
    this.completedMissions = this.loadCompleted();
    this.unlockedWeapons = this.loadUnlocks();
    this.syncCompletedUnlocks();
    this.loadout = this.loadLoadout();
    this.survivalRecord = this.loadSurvivalRecord();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 240);
    this.scene.add(this.camera);

    this.initPostProcessing();

    this.audio = new AudioEngine();
    this.audio.setMasterVolume(this.settings.masterVolume);
    this.input = new InputManager(canvas);
    this.input.setTouchModeOverride(this.settings.touchControls);
    this.applyRendererQuality();

    this.terrain = new Terrain();
    this.scene.add(this.terrain.mesh);

    this.cover = new CoverSystem(this.terrain);
    this.envBuilder = new EnvironmentBuilder(this.scene, this.terrain, this.cover);
    this.vfx = new VFXSystem(this.scene);
    this.cover.setOnDestructibleStageChanged((spec, stage) => {
      this.vfx.spawnStructuralDebris(
        new THREE.Vector3(spec.x, spec.y + spec.height * 0.5, spec.z),
        spec.kind,
        stage
      );
    });
    this.projectiles = new ProjectileSystem(this.scene, this.terrain, this.cover, this.vfx, this.audio);
    this.player = new PlayerController(
      this.camera,
      this.audio,
      this.input,
      this.terrain,
      this.cover,
      this.projectiles
    );
    this.player.onMeleeRequested = (origin, forward) => this.handlePlayerMelee(origin, forward);
    this.player.onCallArtilleryRequested = (origin, dir) => this.handleArtilleryCall(origin, dir);
    this.player.onSquadOrderRequested = (type, targetPos) => {
      this.issuePlayerSquadOrder(type, targetPos);
    };

    this.soldiers = new SoldierSystem(
      this.scene,
      this.terrain,
      this.cover,
      this.projectiles,
      this.vfx,
      this.audio
    );
    this.soldiers.setOnSoldierKilled((pos, role, faction) => {
      if (faction === 'enemy') {
        this.maybeSpawnWeaponDrop(pos, role);
      }
    });
    this.soldiers.setOnPlayerHealedByMedic((amount) => {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
      this.player.bleeding = false;
      this.player.woundLevel = this.player.hp >= 82 ? 'none' : 'light';
      this.audio.playUiClick();
      if (this.medicRadioCooldown <= 0) {
        this.medicRadioCooldown = 6.0;
        this.pushRadioCaption(
          'Soldado 05 Médico: "Curativo aplicado e hemorragia estancada! Aguente firme!"',
          'squad',
          this.radioDegraded
        );
      }
    });

    this.tanks = new TankSystem(
      this.scene,
      this.terrain,
      this.cover,
      this.projectiles,
      this.vfx,
      this.audio
    );
    this.tanks.setEventBus(this.app.bus);
    this.tanks.onSubsystemDamaged = (tank, subsystem, state) => {
      const key = `${tank.id}:${subsystem}`;
      if (this.reportedDisabledSubsystems.has(key)) return;
      if (subsystem === 'tracks' && state.tracksHp <= 0) {
        this.reportedDisabledSubsystems.add(key);
        this.pushRadioCaption('Esteiras do blindado inimigo destruídas! Tanque imobilizado!', 'operational');
      } else if (subsystem === 'turret' && state.turretHp <= 0) {
        this.reportedDisabledSubsystems.add(key);
        this.pushRadioCaption('Torre do blindado inimigo travada!', 'operational');
      } else if (subsystem === 'cannon' && state.cannonHp <= 0) {
        this.reportedDisabledSubsystems.add(key);
        this.pushRadioCaption('Canhão do tanque inimigo inutilizado!', 'operational');
      } else if (subsystem === 'engine' && state.engineHp <= 0) {
        this.reportedDisabledSubsystems.add(key);
        this.pushRadioCaption('Motor do blindado inimigo destruído! Veículo imobilizado!', 'operational');
      }
    };
    this.bombers = new BomberSystem(this.scene, this.projectiles, this.vfx, this.audio);

    this.bindSimulationBusEvents();

    this.activeMission = getMissionConfig(0);

    this.ui = new UIManager(uiRoot, this.settings, this.completedMissions, {
      onSelectMission: (id) => {
        this.audio.unlock();
        this.audio.playUiClick();
        this.selectedMissionId = id;
        this.previewMenuScene(id);
      },
      onStartMissionBriefing: () => {
        this.audio.unlock();
        this.audio.playUiClick();
        this.screen = 'briefing';
        this.ui.showBriefing(getMissionConfig(this.selectedMissionId));
      },
      onEnterBattle: () => {
        this.audio.unlock();
        this.startMission(this.selectedMissionId);
      },
      onResumeBattle: () => {
        if (this.wasInMission) {
          this.screen = 'playing';
          this.ui.setScreen('playing');
          this.input.setGameplayActive(true);
          if (!this.input.isTouchActive()) {
            this.input.requestLock();
          }
        } else {
          this.screen = 'menu';
          this.ui.setScreen('menu');
        }
      },
      onRestartMission: () => {
        this.audio.unlock();
        this.startMission(this.selectedMissionId);
      },
      onRetryCheckpoint: () => {
        this.audio.unlock();
        this.retryFromCheckpoint();
      },
      onReturnToMenu: () => {
        this.wasInMission = false;
        this.input.setGameplayActive(false);
        this.screen = 'menu';
        this.ui.setScreen('menu');
        this.previewMenuScene(this.selectedMissionId);
      },
      onNextMission: () => {
        const nextId = Math.min(5, this.selectedMissionId + 1) as MissionId;
        this.selectedMissionId = nextId;
        this.ui.setSelectedMission(nextId);
        this.screen = 'briefing';
        this.ui.showBriefing(getMissionConfig(nextId));
      },
      onSettingsChanged: (newSettings) => {
        this.settings = { ...newSettings };
        this.audio.setMasterVolume(this.settings.masterVolume);
        this.input.setTouchModeOverride(this.settings.touchControls);
        this.applyRendererQuality();
        this.saveSettings();
      },
      onLoadoutChanged: (newLoadout) => {
        this.loadout = { ...newLoadout };
        this.saveLoadout();
      },
      onTouchMove: (x, y, sprinting) => {
        this.input.setTouchMove(x, y, sprinting);
      },
      onTouchLook: (dx, dy) => {
        this.input.addTouchLookDelta(dx, dy);
      },
      onTouchFire: (firing) => {
        this.input.setTouchFiring(firing);
      },
      onTouchAdsToggle: () => {
        this.input.toggleTouchAds();
      },
      onTouchKeyPress: (code) => {
        this.input.triggerVirtualKeyPress(code);
        if (code === 'Space') {
          this.input.triggerTouchMantle(0.85);
        }
      },
      onTouchKeyHold: (code, held) => {
        this.input.setVirtualKeyHold(code, held);
        if (code === 'Space' && held) {
          this.input.triggerTouchMantle(0.85);
        }
      },
      onTouchSelectWeapon: (id) => {
        this.player.selectWeapon(id);
      },
      onTouchCycleWeapon: () => {
        this.player.cycleWeapon();
      },
      onTouchPause: () => {
        this.pauseGameplay();
      },
      onTouchMelee: () => {
        this.player.triggerMelee((o, f) => this.handlePlayerMelee(o, f));
      },
      onTouchBinoculars: () => {
        this.player.toggleBinoculars();
      }
    });

    this.ui.onTouchSmoke = () => {
      this.player.throwSmokeGrenade();
    };
    this.ui.onTouchMelee = () => {
      this.player.triggerMelee((o, f) => this.handlePlayerMelee(o, f));
    };
    this.ui.onTouchBinoculars = () => {
      this.player.toggleBinoculars();
    };
    this.ui.onIssueSquadOrder = (type) => {
      this.handleUiSquadOrder(type);
    };
    this.ui.onToggleSquadMenu = () => {
      if (this.screen === 'playing' && !this.player.inAllyTank && !this.player.mgMounted && this.player.hp > 0) {
        this.player.squadMenuOpen = !this.player.squadMenuOpen;
        this.audio.playUiClick();
      }
    };

    this.ui.setArsenalState(this.unlockedWeapons, this.loadout);
    this.ui.setSurvivalRecord(this.survivalRecord);

    this.input.setOnPauseRequested(() => {
      this.pauseGameplay();
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      if (this.composer) {
        const maxRatio = this.isMobileDevice() ? 1.35 : 2;
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
        this.composer.setSize(w, h);
      }
      if (this.bloomPass) {
        this.bloomPass.resolution.set(w, h);
      }
    });

    this.previewMenuScene(0);
    this.animate();
  }

  private initPostProcessing(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.composer.setSize(w, h);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.26, 0.35, 0.82);
    this.composer.addPass(this.bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    this.gradePass = new ShaderPass(WAR_GRADE_VIGNETTE_SHADER);
    this.composer.addPass(this.gradePass);

    this.applyMissionColorGrade(0);
  }

  private applyRendererQuality(): void {
    const mobile = this.isMobileDevice();
    const maxRatio = mobile ? 1.35 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
    this.renderer.shadowMap.enabled =
      this.settings.quality !== 'low' && (!mobile || this.settings.quality === 'high');
    if (this.composer) {
      this.composer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
    }
  }

  private shouldUsePostProcessing(): boolean {
    return !this.isMobileDevice() && this.settings.quality !== 'low';
  }

  private applyMissionColorGrade(id: MissionId): void {
    if (!this.gradePass) return;
    const u = this.gradePass.uniforms;
    if (id === 0) {
      (u.uTint.value as THREE.Vector3).set(1.03, 0.99, 0.93);
      u.uSaturation.value = 0.84;
      u.uContrast.value = 1.06;
      u.uVignette.value = 0.26;
    } else if (id === 1) {
      (u.uTint.value as THREE.Vector3).set(0.93, 0.98, 1.04);
      u.uSaturation.value = 0.78;
      u.uContrast.value = 1.08;
      u.uVignette.value = 0.28;
    } else if (id === 2) {
      (u.uTint.value as THREE.Vector3).set(1.05, 0.95, 0.91);
      u.uSaturation.value = 0.82;
      u.uContrast.value = 1.09;
      u.uVignette.value = 0.28;
    } else if (id === 4) {
      (u.uTint.value as THREE.Vector3).set(1.04, 0.96, 0.88);
      u.uSaturation.value = 0.86;
      u.uContrast.value = 1.08;
      u.uVignette.value = 0.27;
    } else if (id === 5 || id === 99) {
      (u.uTint.value as THREE.Vector3).set(1.02, 0.94, 0.92);
      u.uSaturation.value = 0.79;
      u.uContrast.value = 1.1;
      u.uVignette.value = 0.3;
    } else {
      (u.uTint.value as THREE.Vector3).set(0.9, 0.96, 1.06);
      u.uSaturation.value = 0.8;
      u.uContrast.value = 1.1;
      u.uVignette.value = 0.32;
    }
  }

  private pauseGameplay(): void {
    if (this.screen === 'playing') {
      this.player.squadMenuOpen = false;
      this.screen = 'paused';
      this.input.setGameplayActive(false);
      this.ui.setScreen('paused');
    }
  }

  private bindSimulationBusEvents(): void {
    this.app.bus.on('sector.captured', (ev) => {
      if (this.screen !== 'playing') return;
      if (ev.payload.faction === 'ally') {
        this.sectorsCapturedCount++;
      }
      const sector = this.app.world.sectors.find((s) => s.id === ev.payload.sectorId);
      const label = sector?.name ?? ev.payload.sectorId;
      const msg =
        ev.payload.faction === 'ally'
          ? `Setor ${label} assegurado pelas forças aliadas!`
          : `Alerta: forças inimigas retomaram ${label}!`;
      this.pushRadioCaption(msg, 'command', this.radioDegraded);
    });

    this.app.bus.on('sector.contested', (ev) => {
      if (this.screen !== 'playing') return;
      const sector = this.app.world.sectors.find((s) => s.id === ev.payload.sectorId);
      const label = sector?.name ?? ev.payload.sectorId;
      this.pushRadioCaption(`Combate intenso em ${label}!`, 'operational', this.radioDegraded);
    });

    this.app.bus.on('battlefield.event.triggered', (ev) => {
      if (this.screen !== 'playing') return;
      this.pushRadioCaption(
        `${ev.payload.title}: ${ev.payload.description}`,
        ev.payload.channel,
        this.radioDegraded
      );
    });

    this.app.bus.on('vehicle.disabled', (ev) => {
      if (this.screen !== 'playing') return;
      if (!this.reportedDisabledSubsystems.has(`${ev.payload.vehicleId}:tracks`)) {
        this.pushRadioCaption('Veículo blindado neutralizado no setor!', 'operational', this.radioDegraded);
      }
    });

    this.app.bus.on('radio.message.sent', (ev) => {
      if (this.screen !== 'playing') return;
      this.pushRadioCaption(
        `${ev.payload.sender}: ${ev.payload.text}`,
        ev.payload.channel,
        ev.payload.degraded
      );
    });
  }

  private initializeSimulationForMission(id: MissionId, applyCampaignBonuses: boolean): void {
    this.app.initializeMission(id);

    // Substitui o pelotão genérico do diretor pelo pelotão do jogador (Soldado 01..07)
    const oldPlayerSquad = this.app.world.squads.get('squad-player');
    if (oldPlayerSquad) {
      for (const memberId of oldPlayerSquad.memberIds) {
        this.app.world.soldiers.delete(memberId);
      }
      this.app.world.squads.delete('squad-player');
    }

    this.squadSystem.spawnDefaultPlayerSquad({
      x: this.player.pos.x,
      y: this.player.pos.y,
      z: this.player.pos.z
    });

    this.squadActiveCommand = 'hold';
    this.squadStepAccumDt = 0;
    this.sectorsCapturedCount = 0;
    this.reportedDisabledSubsystems.clear();
    this.medicRadioCooldown = 0;
    this.radioChannel = 'command';
    this.radioDegraded = false;

    if (applyCampaignBonuses) {
      const campaignState = this.campaignManager.getState();
      if (campaignState.ammoBonus > 0) {
        const extraRounds = Math.min(90, Math.max(8, Math.round(campaignState.ammoBonus * 0.25)));
        this.player.reserveAmmo.rifle += Math.ceil(extraRounds * 0.5);
        this.player.reserveAmmo.smg += extraRounds;
        this.player.reserveAmmo.lmg += extraRounds;
        this.player.reserveAmmo.shotgun += Math.ceil(extraRounds * 0.3);
        this.player.reserveAmmo.sniper += Math.ceil(extraRounds * 0.25);
        this.player.reserveAmmo.bazooka += Math.min(3, Math.floor(campaignState.ammoBonus / 80));
        this.player.reserveAmmo.grenade += Math.min(2, Math.floor(campaignState.ammoBonus / 100));
      }
      if (campaignState.supportLevel > 1) {
        this.player.bandages = Math.min(5, this.player.bandages + Math.floor(campaignState.supportLevel / 3));
      }
    }
  }

  private isRadioOperatorAlive(): boolean {
    const members = this.app.world.getSquadMembers('player_squad');
    const radioOp = members.find((m) => m.role === 'radio');
    return radioOp ? radioOp.alive && radioOp.state !== 'dead' : true;
  }

  private getStormIntensity(): number {
    return this.activeMission.environment.hasRain ? 0.65 : 0.1;
  }

  private handleUiSquadOrder(type: SquadCommandType): void {
    if (this.screen !== 'playing' || this.player.inAllyTank || this.player.mgMounted || this.player.hp <= 0) {
      return;
    }
    let targetPos: THREE.Vector3;
    if (type === 'advance' || type === 'flank') {
      const origin = this.camera.position;
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
      const hit = this.cover.raycastWorld(origin, dir, 65, true);
      if (hit) {
        targetPos = hit.point.clone();
      } else {
        targetPos = new THREE.Vector3(
          THREE.MathUtils.clamp(origin.x + dir.x * 24, -44, 44),
          this.player.pos.y,
          THREE.MathUtils.clamp(origin.z + dir.z * 24, -72, 48)
        );
        targetPos.y = this.terrain.getTerrainHeight(targetPos.x, targetPos.z);
      }
    } else {
      targetPos = this.player.pos.clone();
    }
    this.player.squadMenuOpen = false;
    this.audio.playUiClick();
    this.issuePlayerSquadOrder(type, targetPos);
  }

  private issuePlayerSquadOrder(type: SquadCommandType, targetPos?: THREE.Vector3): void {
    const resolvedTarget = targetPos ?? this.player.pos.clone();
    this.squadActiveCommand = type;

    this.squadCommands.issueCommand(
      'player_squad',
      type,
      { x: resolvedTarget.x, y: resolvedTarget.y, z: resolvedTarget.z },
      undefined,
      this.missionElapsed
    );

    this.soldiers.setPlayerSquadOrder(type, resolvedTarget, this.player.pos);

    const radioAlive = this.isRadioOperatorAlive();
    const storm = this.getStormIntensity();

    if (type === 'flank') {
      this.squadComms.reportFlankOrder('Líder', 'posição inimiga', this.missionElapsed, radioAlive, storm);
    } else if (type === 'advance') {
      this.squadComms.sendContextualMessage(
        'squad',
        'Líder',
        'Pelotão, avançar em cunha! Mantenham fogo de supressão!',
        this.missionElapsed,
        radioAlive,
        storm
      );
    } else if (type === 'hold') {
      this.squadComms.sendContextualMessage(
        'squad',
        'Líder',
        'Manter posição e buscar cobertura! Fogo à vontade!',
        this.missionElapsed,
        radioAlive,
        storm
      );
    } else if (type === 'regroup') {
      this.squadComms.sendContextualMessage(
        'squad',
        'Líder',
        'Pelotão, reagrupar na minha posição!',
        this.missionElapsed,
        radioAlive,
        storm
      );
    } else {
      this.squadComms.sendContextualMessage(
        'squad',
        'Líder',
        `Ordem tática: ${this.squadCommands.getCommandLabelPtBr(type)}.`,
        this.missionElapsed,
        radioAlive,
        storm
      );
    }
  }

  private isMobileDevice(): boolean {
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 900
    );
  }

  private previewMenuScene(id: MissionId): void {
    const cfg = getMissionConfig(id);
    this.activeMission = cfg;
    this.clearCombatActors();
    this.terrain.loadMission(cfg);
    this.envBuilder.buildMission(cfg, this.settings.quality);
    this.applyMissionColorGrade(id);
    this.player.viewModel.root.visible = false;
  }

  private clearCombatActors(): void {
    this.vfx.clear();
    this.projectiles.clear();
    this.soldiers.clear();
    this.tanks.clear();
    this.bombers.clear();
    for (const mesh of this.dropMeshes.values()) {
      this.scene.remove(mesh);
    }
    this.dropMeshes.clear();
    this.artillerySalvoQueue = [];
    this.pendingStrafeWaves = 0;
  }

  private spawnAllyTankWithInteractable(x: number, z: number): void {
    this.tanks.spawnAllyTank(x, z);
    const existing = this.liveInteractables.find((i) => i.kind === 'ally_tank');
    if (existing) {
      existing.x = x;
      existing.y = this.terrain.getTerrainHeight(x, z);
      existing.z = z;
      existing.active = true;
    } else {
      this.liveInteractables.push({
        id: 'ally_tank_interact',
        kind: 'ally_tank',
        x,
        y: this.terrain.getTerrainHeight(x, z),
        z,
        label: '[F] Embarcar no Tanque Aliado',
        radius: 4.4,
        active: true
      });
    }
  }

  private startMission(id: MissionId): void {
    this.selectedMissionId = id;
    const cfg = getMissionConfig(id);
    this.activeMission = cfg;
    this.clearCombatActors();

    this.terrain.loadMission(cfg);
    this.envBuilder.buildMission(cfg, this.settings.quality);
    this.applyMissionColorGrade(id);
    this.liveInteractables = cfg.interactables.map((i) => ({ ...i }));

    this.player.resetForMission(cfg.playerSpawn.x, cfg.playerSpawn.z, cfg.playerSpawn.yaw);
    this.player.setLoadout(this.loadout);
    this.player.viewModel.root.visible = true;

    this.initializeSimulationForMission(id, !cfg.isSurvival && id !== 99);

    if (cfg.allyTankSpawn) {
      this.spawnAllyTankWithInteractable(cfg.allyTankSpawn.x, cfg.allyTankSpawn.z);
    }

    this.soldiers.spawnAllies(cfg.allyCount);
    this.soldiers.updateAllySquadProfiles(this.app.world);
    this.soldiers.spawnEmplacedGunners(cfg.enemyEmplacements);

    this.phaseIndex = 0;
    this.missionElapsed = 0;
    this.kills = 0;
    this.tanksDestroyed = 0;
    this.survivalWave = 1;
    this.airRaidAlert = null;
    this.airRaidAlertTimer = 0;
    this.radioCaption = null;
    this.radioCaptionTimer = 0;
    this.checkpointPhaseIndex = 0;
    this.checkpointSnapshot = null;
    this.checkpointToast = null;
    this.checkpointToastTimer = 0;
    this.checkpointKills = 0;
    this.checkpointTanks = 0;
    this.checkpointElapsed = 0;
    this.campAnchor.copy(this.player.pos);
    this.campTimer = 0;
    this.mortarZeroed = false;
    this.mortarZeroSalvoCooldown = 0;
    this.mortarWarningText = null;
    this.troopCarTimer = 26;
    this.wasInMission = true;

    this.beginPhase(0);

    this.screen = 'playing';
    this.ui.setScreen('playing');
    this.input.setGameplayActive(true);
    if (!this.input.isTouchActive()) {
      this.input.requestLock();
    }
  }

  private retryFromCheckpoint(): void {
    const diffConfig = getDifficultyConfig(this.settings.difficulty);
    if (!this.checkpointSnapshot || !diffConfig.allowCheckpoints) {
      this.startMission(this.selectedMissionId);
      return;
    }

    const cfg = getMissionConfig(this.selectedMissionId);
    this.activeMission = cfg;
    this.clearCombatActors();

    this.terrain.loadMission(cfg);
    this.envBuilder.buildMission(cfg, this.settings.quality);
    this.applyMissionColorGrade(this.selectedMissionId);
    this.liveInteractables = cfg.interactables.map((i) => ({ ...i }));

    let spawnX = cfg.playerSpawn.x;
    let spawnZ = cfg.playerSpawn.z;
    const spawnYaw = cfg.playerSpawn.yaw;
    const curPhase = cfg.phases[this.checkpointPhaseIndex];
    const prevPhase = cfg.phases[this.checkpointPhaseIndex - 1];
    if (curPhase?.type === 'plant_charge' || curPhase?.type === 'detonate_wait') {
      spawnX = 0;
      spawnZ = -25;
    } else if (prevPhase?.type === 'reach_zone' && prevPhase.targetZone) {
      spawnX = prevPhase.targetZone.x;
      spawnZ = prevPhase.targetZone.z;
    }

    this.player.restoreFromCheckpoint(this.checkpointSnapshot, spawnX, spawnZ, spawnYaw);
    this.player.viewModel.root.visible = true;

    this.initializeSimulationForMission(this.selectedMissionId, false);

    if (cfg.allyTankSpawn) {
      this.spawnAllyTankWithInteractable(cfg.allyTankSpawn.x, cfg.allyTankSpawn.z);
    }

    for (const inter of this.liveInteractables) {
      if (inter.kind === 'radio') {
        inter.active = curPhase?.type === 'activate_radio';
      } else if (inter.kind === 'bunker_charge') {
        inter.active = curPhase?.type === 'plant_charge';
      }
    }

    this.soldiers.spawnAllies(cfg.allyCount);
    this.soldiers.updateAllySquadProfiles(this.app.world);
    this.soldiers.spawnEmplacedGunners(cfg.enemyEmplacements);

    this.kills = this.checkpointKills;
    this.tanksDestroyed = this.checkpointTanks;
    this.missionElapsed = this.checkpointElapsed;
    this.airRaidAlert = null;
    this.airRaidAlertTimer = 0;
    this.radioCaption = null;
    this.radioCaptionTimer = 0;
    this.checkpointToast = null;
    this.checkpointToastTimer = 0;
    this.campAnchor.copy(this.player.pos);
    this.campTimer = 0;
    this.mortarZeroed = false;
    this.mortarWarningText = null;
    this.troopCarTimer = 26;
    this.wasInMission = true;

    this.beginPhase(this.checkpointPhaseIndex, false);

    this.screen = 'playing';
    this.ui.setScreen('playing');
    this.input.setGameplayActive(true);
    if (!this.input.isTouchActive()) {
      this.input.requestLock();
    }
  }

  private beginPhase(idx: number, saveCheckpoint = true): void {
    this.phaseIndex = idx;
    const phase = this.activeMission.phases[idx];
    if (!phase) {
      this.finishMission(true);
      return;
    }

    const diffConfig = getDifficultyConfig(this.settings.difficulty);
    if (
      saveCheckpoint &&
      idx >= 1 &&
      idx < this.activeMission.phases.length &&
      !this.activeMission.isSurvival &&
      diffConfig.allowCheckpoints
    ) {
      this.checkpointPhaseIndex = idx;
      this.checkpointSnapshot = this.player.captureCheckpointState();
      this.checkpointKills = this.kills;
      this.checkpointTanks = this.tanksDestroyed;
      this.checkpointElapsed = this.missionElapsed;
      this.checkpointToast = `CHECKPOINT SALVO — FASE ${idx + 1}`;
      this.checkpointToastTimer = 3.5;
    }

    this.phaseTimer = phase.durationSeconds ?? 0;
    this.artilleryCooldown = phase.artilleryRate ?? 999;
    this.pendingStrafeWaves = phase.strafingWaves ?? 0;
    this.strafeCooldown = this.pendingStrafeWaves > 0 ? 4.5 : 999;
    this.troopCarTimer = 26;

    if (phase.radioOpening) {
      this.pushRadioCaption(phase.radioOpening);
    }

    // Activate special interactables when reaching their phase
    if (phase.type === 'activate_radio') {
      for (const inter of this.liveInteractables) {
        if (inter.kind === 'radio') inter.active = true;
      }
    }
    if (phase.type === 'plant_charge') {
      for (const inter of this.liveInteractables) {
        if (inter.kind === 'bunker_charge') inter.active = true;
      }
    }

    if (phase.spawnAllyTank && !this.tanks.hasLivingAllyTank()) {
      this.spawnAllyTankWithInteractable(phase.spawnAllyTank.x, phase.spawnAllyTank.z);
    }

    if (phase.tanksToSpawn) {
      for (const ts of phase.tanksToSpawn) {
        this.tanks.spawnTank(ts.x, ts.z, ts.heavy, ts.waypoints);
      }
    }

    if (phase.troopCarsToSpawn) {
      for (const spec of phase.troopCarsToSpawn) {
        this.tanks.spawnTroopCar(spec, (x, z, count, roles) => {
          this.soldiers.spawnSquadAt(x, z, count, roles);
        });
      }
    }

    const maxSimultaneous = getMaxSimultaneousEnemies(
      this.settings.difficulty,
      this.settings.quality,
      this.isMobileDevice()
    );

    if (phase.type === 'bomber_storm') {
      this.airRaidAlert = 'ALERTA AÉREO — ENTRE NO ABRIGO SUBTERRÂNEO!';
      this.airRaidAlertTimer = 0;
      this.bombers.triggerBomberRun(() => {
        this.airRaidAlert = null;
        if (phase.enemiesToSpawn && phase.enemyRoles) {
          const enemyCount = Math.max(1, Math.round(phase.enemiesToSpawn * diffConfig.waveCountMult));
          this.soldiers.queueEnemyWave(enemyCount, phase.enemyRoles, maxSimultaneous);
          this.pushRadioCaption('Bombardeio passou! Infantaria inimiga avançando pela fumaça!');
        }
      });
    } else if (phase.enemiesToSpawn && phase.enemyRoles) {
      const enemyCount = Math.max(1, Math.round(phase.enemiesToSpawn * diffConfig.waveCountMult));
      this.soldiers.queueEnemyWave(enemyCount, phase.enemyRoles, maxSimultaneous);
    }
  }

  private pushRadioCaption(
    text: string,
    channel: RadioChannel = 'operational',
    degraded = this.radioDegraded
  ): void {
    this.radioCaption = text;
    this.radioCaptionTimer = 5.0;
    this.radioChannel = channel;
    this.radioDegraded = degraded;
    this.audio.playRadioStatic();
  }

  private maybeSpawnWeaponDrop(pos: THREE.Vector3, role: SoldierRole): void {
    if (
      role !== 'officer' &&
      role !== 'mg_gunner' &&
      role !== 'flamethrower' &&
      role !== 'assault'
    ) {
      return;
    }

    let activeDrops = 0;
    for (const inter of this.liveInteractables) {
      if (inter.kind === 'weapon_drop' && inter.active) activeDrops++;
    }
    if (activeDrops >= 6) return;

    const chance = role === 'assault' ? 0.16 : 0.28;
    if (Math.random() > chance) return;

    let weaponDropId: WeaponId = 'smg';
    if (role === 'officer') {
      weaponDropId = Math.random() < 0.55 ? 'sniper' : 'pistol';
    } else if (role === 'mg_gunner') {
      weaponDropId = 'lmg';
    } else if (role === 'flamethrower') {
      weaponDropId = 'shotgun';
    } else {
      weaponDropId = Math.random() < 0.45 ? 'shotgun' : 'smg';
    }

    const id = `drop_${this.nextDropId++}`;
    const y = this.terrain.getTerrainHeight(pos.x, pos.z);
    const inter: InteractablePoint = {
      id,
      kind: 'weapon_drop',
      x: pos.x,
      y,
      z: pos.z,
      label: `[F] Pegar ${WEAPON_STATS[weaponDropId].name}`,
      radius: 2.4,
      active: true,
      weaponDropId
    };
    this.liveInteractables.push(inter);

    const dropGroup = new THREE.Group();
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.16, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x3b4032, roughness: 0.72, metalness: 0.25 })
    );
    crate.position.y = 0.08;
    dropGroup.add(crate);

    const gunBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.06, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x222524, roughness: 0.45, metalness: 0.7 })
    );
    gunBar.position.y = 0.2;
    gunBar.rotation.y = Math.random() * Math.PI;
    dropGroup.add(gunBar);

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.36, 16),
      new THREE.MeshBasicMaterial({
        color: 0xe6b450,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      })
    );
    marker.rotation.x = -Math.PI * 0.5;
    marker.position.y = 0.03;
    dropGroup.add(marker);

    dropGroup.position.set(pos.x, y, pos.z);
    this.scene.add(dropGroup);
    this.dropMeshes.set(id, dropGroup);
  }

  private handlePlayerMelee(origin: THREE.Vector3, forward: THREE.Vector3): void {
    const res = this.soldiers.checkMeleeHit(origin, forward, 2.5);
    if (res.hit) {
      this.player.registerHitMarker(res.killed);
      if (res.killed) {
        this.kills++;
      }
      if (res.pos) {
        this.soldiers.suppressInRadius(res.pos.x, res.pos.z, 4.0, 1.8);
      }
    }
  }

  private handleArtilleryCall(origin: THREE.Vector3, dir: THREE.Vector3): void {
    const hit = this.cover.raycastWorld(origin, dir, 130, true);
    let tx: number;
    let tz: number;
    if (hit) {
      tx = hit.point.x;
      tz = hit.point.z;
    } else {
      tx = THREE.MathUtils.clamp(origin.x + dir.x * 65, -42, 42);
      tz = THREE.MathUtils.clamp(origin.z + dir.z * 65, -42, 42);
    }

    this.pushRadioCaption('ARTILHARIA ALIADA CONFIRMADA! SALVA DE OBUSES A CAMINHO (2.6s)!');
    for (let i = 0; i < 4; i++) {
      this.artillerySalvoQueue.push({
        x: THREE.MathUtils.clamp(tx + (Math.random() - 0.5) * 8.5, -42, 42),
        z: THREE.MathUtils.clamp(tz + (Math.random() - 0.5) * 8.5, -42, 42),
        delay: 2.6 + i * 0.42,
        whistled: false
      });
    }
  }

  private triggerStrafeWave(diffConfig: ReturnType<typeof getDifficultyConfig>): void {
    const tx = THREE.MathUtils.clamp(this.player.pos.x + (Math.random() - 0.5) * 10, -34, 34);
    const tz = THREE.MathUtils.clamp(this.player.pos.z + (Math.random() - 0.5) * 8, -32, 34);
    this.audio.playStrafeSiren();
    this.airRaidAlert = 'CAÇA RASANTE INIMIGO — ABAIXE-SE NA VALA!';
    this.airRaidAlertTimer = 5.4;

    this.bombers.triggerStrafingRun(tx, tz, (impactPos) => {
      this.vfx.spawnBulletImpact(impactPos, new THREE.Vector3(0, 1, 0), false);
      const dist = impactPos.distanceTo(this.player.pos);
      if (this.player.inAllyTank) {
        if (dist < 4.0) {
          this.tanks.applyDamageToAllyTank(14);
        }
      } else if (dist < 3.4 && this.player.coverState !== 'dugout' && !this.player.overheadProtected) {
        const insideBuilding = this.cover.isInsideEnterableBuilding(this.player.pos.x, this.player.pos.z);
        if (!insideBuilding) {
          const coverMult = this.player.coverState === 'sheltered' && this.player.isCrouching ? 0.3 : 1.0;
          const dmg = 26 * coverMult;
          if (dmg > 4) {
            this.player.applyDamage(dmg, impactPos, 'Metralhamento de caça rasante', dmg > 18, diffConfig);
          }
        }
      }
      this.soldiers.applyBlastDamage(impactPos, 2.4, 42, false);
    });
  }

  private handleExplosion(
    center: THREE.Vector3,
    radius: number,
    maxDamage: number,
    craterRadius: number,
    craterDepth: number,
    cause: string,
    isFromPlayer: boolean
  ): void {
    this.terrain.addCrater(center.x, center.z, craterRadius, craterDepth);
    this.cover.destroyWiresInRadius(center.x, center.z, radius * 0.75);
    this.cover.damageDestructiblesInRadius(center, radius * 0.85, maxDamage * 1.15);

    if (craterRadius >= 1.8) {
      if (this.terrain.collapseTrenchAt(center.x, center.z, radius * 0.7)) {
        this.envBuilder.setTrenchWallCollapsedAt(center.x, center.z, radius * 0.7);
        this.vfx.spawnTrenchCollapseDebris(center);
      }
    }

    if (radius >= 5.5) {
      const dugHit = this.terrain.damageDugoutAt(center.x, center.z, radius);
      if (dugHit) {
        this.envBuilder.setDugoutStage(dugHit.dugout.id, dugHit.newStage);
        this.vfx.spawnDugoutCollapseDebris(
          new THREE.Vector3(dugHit.dugout.x, dugHit.dugout.ceilingY, dugHit.dugout.z),
          dugHit.newStage === 2
        );
        const label = dugHit.dugout.label ?? 'ABRIGO';
        if (dugHit.newStage === 1) {
          this.pushRadioCaption(`${label} COMPROMETIDO! O teto vai ceder no próximo impacto!`);
          this.player.addShake(0.65);
        } else {
          this.pushRadioCaption(`${label} DESTRUÍDO! MUDE PARA OUTRO ABRIGO!`);
          const inThisDugout =
            !this.player.inAllyTank &&
            Math.abs(this.player.pos.x - dugHit.dugout.x) <= dugHit.dugout.width * 0.56 &&
            Math.abs(this.player.pos.z - dugHit.dugout.z) <= dugHit.dugout.depth * 0.56;
          if (inThisDugout) {
            const diffConfig = getDifficultyConfig(this.settings.difficulty);
            this.player.applyDamage(
              65,
              center,
              'Soterrado pelo desabamento do abrigo subterrâneo',
              true,
              diffConfig
            );
          }
        }
      }
    }

    this.vfx.spawnExplosion(center, Math.max(0.85, radius / 6.2));
    const distToPlayer = center.distanceTo(this.player.pos);
    const pan = Math.max(-1, Math.min(1, (center.x - this.player.pos.x) / 28));
    this.audio.playExplosion(distToPlayer, Math.max(0.8, radius / 6.5), pan);

    // Damage & suppress enemies & tanks
    this.soldiers.suppressInRadius(center.x, center.z, Math.max(5.5, radius * 1.15), 2.5);
    this.soldiers.applyBlastDamage(center, radius, maxDamage, isFromPlayer, () => {
      if (isFromPlayer) this.kills++;
    });
    this.tanks.applyBlastDamage(center, radius * 0.85, maxDamage * 0.9, () => {
      this.tanksDestroyed++;
      this.pushRadioCaption('ALVO BLINDADO DESTRUÍDO! BOM TIRO!');
    });

    // Ally tank blast damage
    if (!isFromPlayer && this.tanks.hasLivingAllyTank()) {
      const allyPos = this.tanks.getAllyTankPosition();
      if (allyPos) {
        const dAlly = allyPos.distanceTo(center);
        if (dAlly <= radius + 1.5) {
          const dmg = maxDamage * 0.55 * (1 - Math.min(0.8, dAlly / (radius + 2)));
          this.tanks.applyDamageToAllyTank(dmg);
        }
      }
    }

    // Player blast, suppression, tinnitus & screen shake
    if (distToPlayer < 26) {
      const prox = 1 - distToPlayer / 26;
      this.player.addShake(prox * 0.85);
      this.player.applySuppression(prox * (this.player.inAllyTank ? 0.25 : 0.7));
      if (distToPlayer < 13 && !this.player.inAllyTank) {
        this.player.tinnitus = Math.min(1, this.player.tinnitus + (1 - distToPlayer / 13) * 0.95);
      }
    }

    if (distToPlayer <= radius && !this.player.inAllyTank) {
      // Dugout / building overhead shelter protects from aerial bombs & distant artillery!
      const isAerialOrArtillery = cause.includes('aérea') || cause.includes('Artilharia') || cause.includes('Morteiro');
      const insideBuilding = this.cover.isInsideEnterableBuilding(this.player.pos.x, this.player.pos.z);
      if (isAerialOrArtillery && (this.player.overheadProtected || insideBuilding)) {
        return;
      }
      const coverReduction =
        this.player.coverState === 'dugout' || insideBuilding
          ? 0.2
          : this.player.coverState === 'sheltered' && !cause.includes('Granada')
            ? 0.35
            : 1.0;
      const falloff = 1 - (distToPlayer / radius) * 0.65;
      const dmg = maxDamage * falloff * coverReduction;
      if (dmg > 4) {
        const diffConfig = getDifficultyConfig(this.settings.difficulty);
        this.player.applyDamage(dmg, center, cause, dmg > 25, diffConfig);
      }
    }
  }

  private finishMission(victory: boolean): void {
    this.wasInMission = false;
    this.input.setGameplayActive(false);

    const isSurvival = Boolean(this.activeMission.isSurvival || this.activeMission.id === 99);
    if (isSurvival) {
      this.updateAndSaveSurvivalRecord();
    }

    if (victory && !isSurvival) {
      this.completedMissions.add(this.activeMission.id);
      this.saveCompleted();
      this.syncCompletedUnlocks();
      this.saveUnlocks();
      this.ui.setCompletedMissions(this.completedMissions);
      this.ui.setArsenalState(this.unlockedWeapons, this.loadout);
      this.screen = 'victory';
    } else {
      this.screen = victory ? 'victory' : 'kia';
    }

    let advice = 'Mantenha-se abaixo do parapeito com [C] e avance apenas quando houver pausa no fogo.';
    if (this.player.lastDamageCause.includes('aérea') || this.player.lastDamageCause.includes('caça')) {
      advice = 'Quando ouvir a sirene aérea, corra imediatamente para um dos ABRIGOS subterrâneos ou edificações fechadas.';
    } else if (this.player.lastDamageCause.includes('Morteiro')) {
      advice = 'Não permaneça parado no mesmo ponto fora de abrigos! Mude de cratera assim que o morteiro começar a calibrar.';
    } else if (this.player.lastDamageCause.includes('Hemorragia')) {
      advice = 'Ao receber tiro grave, recue para a cobertura e segure [H] por 2 segundos para aplicar curativo.';
    } else if (this.player.lastDamageCause.includes('tanque')) {
      advice = 'Nunca encare a frente de um tanque em campo aberto. Flanqueie pelas crateras usando a Bazuca [3] ou Artilharia [B].';
    } else if (this.player.lastDamageCause.includes('Granada')) {
      advice = 'Fique atento ao aviso de granada próxima — afaste-se ou pressione [F] bem perto dela para chutá-la de volta.';
    }

    const diffConfig = getDifficultyConfig(this.settings.difficulty);
    const canRetryCheckpoint =
      !victory &&
      !isSurvival &&
      diffConfig.allowCheckpoints &&
      this.checkpointSnapshot !== null &&
      this.checkpointPhaseIndex >= 1;
    const checkpointPhaseLabel = canRetryCheckpoint
      ? `Fase ${this.checkpointPhaseIndex + 1}`
      : null;

    const squadMembers = this.app.world.getSquadMembers('player_squad');
    const squadSurvivors = squadMembers.filter((m) => m.alive && m.state !== 'dead').length;
    const squadCasualties = Math.max(0, squadMembers.length - squadSurvivors);
    const allySectors = this.app.world.sectors.filter((s) => s.owner === 'ally').length;
    const sectorsCaptured = Math.max(this.sectorsCapturedCount, allySectors);
    let campaignBonusNote: string | undefined;

    if (!isSurvival) {
      const survivingSquadIds = squadMembers
        .filter((m) => m.alive && m.state !== 'dead')
        .map((m) => m.id);
      const lostSquadIds = squadMembers
        .filter((m) => !m.alive || m.state === 'dead')
        .map((m) => m.id);
      const nextCampaign = this.campaignManager.recordOperationOutcome(
        {
          missionId: this.activeMission.id,
          victory,
          durationSec: this.missionElapsed,
          kills: this.kills,
          tanksDestroyed: this.tanksDestroyed,
          secondaryObjectivesDone: sectorsCaptured > 1 ? 1 : 0,
          survivingSquadIds,
          lostSquadIds,
          sectorsCaptured
        },
        squadMembers
      );
      campaignBonusNote = `Campanha: +${nextCampaign.ammoBonus} munição reserva • Apoio logístico Nv.${nextCampaign.supportLevel}`;
    }

    const summary: MissionEndSummary = {
      missionId: this.activeMission.id,
      missionTitle: isSurvival
        ? `${this.activeMission.code} — Vaga ${this.survivalWave}`
        : `${this.activeMission.code} — ${this.activeMission.title}`,
      victory,
      causeOfDeath: this.player.lastDamageCause,
      tacticalAdvice: advice,
      durationSeconds: this.missionElapsed,
      kills: this.kills,
      tanksDestroyed: this.tanksDestroyed,
      shotsFired: this.player.shotsFired,
      shotsHit: this.player.shotsHit,
      difficulty: this.settings.difficulty,
      canRetryCheckpoint,
      checkpointPhaseLabel,
      squadSurvivors: squadMembers.length > 0 ? squadSurvivors : undefined,
      squadCasualties: squadMembers.length > 0 ? squadCasualties : undefined,
      sectorsCaptured,
      campaignBonusNote
    };
    this.ui.showMissionEnd(summary);
  }

  private updateGameplay(dt: number): void {
    this.missionElapsed += dt;
    this.medicRadioCooldown = Math.max(0, this.medicRadioCooldown - dt);
    const diffConfig = getDifficultyConfig(this.settings.difficulty);
    const isSurvival = Boolean(this.activeMission.isSurvival || this.activeMission.id === 99);

    if (this.radioCaptionTimer > 0) {
      this.radioCaptionTimer -= dt;
      if (this.radioCaptionTimer <= 0) this.radioCaption = null;
    }

    if (this.checkpointToastTimer > 0) {
      this.checkpointToastTimer -= dt;
      if (this.checkpointToastTimer <= 0) this.checkpointToast = null;
    }

    if (this.airRaidAlertTimer > 0) {
      this.airRaidAlertTimer -= dt;
      if (this.airRaidAlertTimer <= 0 && !this.bombers.isActive()) {
        this.airRaidAlert = null;
      }
    }

    // Sync ally tank interactable position
    const allyTankPos = this.tanks.getAllyTankPosition();
    const allyTankStatus = this.tanks.getAllyTankStatus();
    for (const inter of this.liveInteractables) {
      if (inter.kind === 'ally_tank') {
        if (allyTankPos && allyTankStatus.alive) {
          inter.x = allyTankPos.x;
          inter.y = allyTankPos.y;
          inter.z = allyTankPos.z;
          inter.active = !this.player.inAllyTank;
        } else {
          inter.active = false;
        }
      }
    }

    const prevShotsFired = this.player.shotsFired;

    // Player update
    const playerInteraction = this.player.update(
      dt,
      this.settings.mouseSensitivity,
      this.liveInteractables,
      (kind, id) => {
        if (kind === 'radio') {
          for (const inter of this.liveInteractables) {
            if (inter.id === id) inter.active = false;
          }
          if (this.activeMission.phases[this.phaseIndex]?.type === 'activate_radio') {
            this.beginPhase(this.phaseIndex + 1);
          }
        } else if (kind === 'bunker_charge') {
          for (const inter of this.liveInteractables) {
            if (inter.id === id) inter.active = false;
          }
          if (this.activeMission.phases[this.phaseIndex]?.type === 'plant_charge') {
            this.beginPhase(this.phaseIndex + 1);
          }
        } else if (kind === 'weapon_drop') {
          const dropInter = this.liveInteractables.find((i) => i.id === id);
          if (dropInter && dropInter.weaponDropId) {
            dropInter.active = false;
            const mesh = this.dropMeshes.get(id);
            if (mesh) {
              this.scene.remove(mesh);
              this.dropMeshes.delete(id);
            }
            const msg = this.player.equipDroppedWeapon(dropInter.weaponDropId);
            this.unlockWeapon(dropInter.weaponDropId);
            this.pushRadioCaption(msg);
          }
        } else if (kind === 'ally_tank') {
          if (id === 'exit_ally_tank' || this.player.inAllyTank) {
            const tp = this.tanks.getAllyTankPosition();
            const safePos = tp
              ? new THREE.Vector3(
                  THREE.MathUtils.clamp(tp.x + 2.8, -38, 38),
                  tp.y,
                  THREE.MathUtils.clamp(tp.z + 1.5, -38, 38)
                )
              : undefined;
            this.player.exitAllyTank(safePos);
          } else if (allyTankStatus.alive) {
            this.player.enterAllyTank();
            this.pushRadioCaption('Tanque aliado sob seu controle! Avance e abra fogo!');
          }
        }
      },
      diffConfig,
      (origin, dir) => this.soldiers.findAutoAimTarget(origin, dir)
    );

    // Update player-controlled ally tank
    if (this.player.inAllyTank) {
      if (!allyTankStatus.alive) {
        this.player.exitAllyTank();
        this.player.applyDamage(
          45,
          this.player.pos,
          'Blindado aliado destruído em combate',
          true,
          diffConfig
        );
      } else {
        const ctrl = this.player.getTankControlInput();
        this.tanks.updatePlayerControlledAllyTank(
          dt,
          ctrl.throttle,
          ctrl.steer,
          ctrl.aimYaw,
          ctrl.aimPitch,
          ctrl.fireCannon,
          ctrl.fireCoax,
          this.tmpTankCamPos,
          (origin, dir) => {
            this.projectiles.spawnRocket(origin, dir, 'ally');
            this.audio.playTankCannonShot();
            this.player.addShake(0.45);
            this.player.shotsFired++;
          },
          (origin, dir) => {
            this.projectiles.spawnBullet(origin, dir, 152, 26, 'ally');
            this.audio.playGunshot('mg', 0, 0);
            this.player.shotsFired++;
          }
        );
        this.player.syncAllyTankCamera(this.tmpTankCamPos, this.tanks.getAllyTankPosition());
      }
    }

    // Report player gunshot sound & suppress enemies near player gunfire impacts
    if (this.player.shotsFired > prevShotsFired) {
      this.soldiers.reportPlayerSound(this.player.pos, 48);
      const camDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
      const impact = this.cover.raycastWorld(this.camera.position, camDir, 75, true);
      if (impact) {
        this.soldiers.suppressInRadius(impact.point.x, impact.point.z, 5.5, 2.4);
      }
    }

    // Update entities & modular tactical simulation
    this.soldiers.setPlayerMedicalStatus(this.player.hp, this.player.bleeding);
    this.soldiers.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      this.player.exposure,
      this.bombers.isWarningOrPassing(),
      (msg) => this.pushRadioCaption(msg, 'emergency'),
      this.player.peekDanger,
      diffConfig
    );

    const playerVec3 = { x: this.player.pos.x, y: this.player.pos.y, z: this.player.pos.z };
    const schedule = this.app.step(dt, {}, playerVec3, dt * 1000);
    this.squadStepAccumDt += dt;
    if (schedule.runSquad) {
      this.squadSystem.update(this.squadStepAccumDt, this.missionElapsed, playerVec3);
      this.squadStepAccumDt = 0;
    }
    this.soldiers.updateAllySquadProfiles(this.app.world);

    const radioAlive = this.isRadioOperatorAlive();
    const signalQuality = this.squadComms.computeSignalQuality(
      radioAlive,
      this.getStormIntensity(),
      Math.hypot(this.player.pos.x, this.player.pos.z - 40)
    );
    this.radioDegraded = signalQuality < 0.45;

    this.tanks.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      this.player.exposure,
      (center, radius, maxDmg, craterR, craterD, cause) => {
        this.handleExplosion(center, radius, maxDmg, craterR, craterD, cause, false);
      },
      this.player.peekDanger,
      diffConfig
    );

    this.bombers.update(dt, this.player.pos.x);

    // Delayed allied artillery salvos from [B] binoculars
    for (let i = this.artillerySalvoQueue.length - 1; i >= 0; i--) {
      const shell = this.artillerySalvoQueue[i];
      shell.delay -= dt;
      if (shell.delay <= 1.0 && !shell.whistled) {
        shell.whistled = true;
        const pan = Math.max(-1, Math.min(1, (shell.x - this.player.pos.x) / 22));
        this.audio.playBombWhistle(pan);
      }
      if (shell.delay <= 0) {
        const y = this.terrain.getTerrainHeight(shell.x, shell.z);
        this.handleExplosion(
          new THREE.Vector3(shell.x, y, shell.z),
          9.5,
          165,
          3.2,
          1.15,
          'Barragem de Artilharia Aliada',
          true
        );
        this.artillerySalvoQueue.splice(i, 1);
      }
    }

    this.projectiles.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      {
        onHitEnemySoldier: (pos, dir, damage, isPlayerShot) => {
          const res = this.soldiers.checkBulletHit('enemy', pos, dir, damage, () => {
            if (isPlayerShot) this.kills++;
          });
          if (res.hit && isPlayerShot) {
            this.player.registerHitMarker(res.headshot);
            this.soldiers.suppressInRadius(pos.x, pos.z, 5.5, 2.4);
          }
          return res.hit;
        },
        onHitAllySoldier: (pos, dir, damage) => {
          return this.soldiers.checkBulletHit('ally', pos, dir, damage).hit;
        },
        onHitPlayer: (damage, origin, cause, causeBleed) => {
          if (this.player.inAllyTank) {
            this.tanks.applyDamageToAllyTank(damage * 0.45);
          } else {
            this.player.applyDamage(damage, origin, cause, causeBleed, diffConfig);
          }
        },
        onNearMissPlayer: (origin) => {
          if (this.player.inAllyTank) return;
          const pan = Math.max(-1, Math.min(1, (origin.x - this.player.pos.x) / 14));
          this.audio.playBulletWhiz(pan);
          this.player.applySuppression(0.24);
        },
        onHitTank: (pos, damage, isRocket) => {
          const bulletDmg =
            damage > 0
              ? damage
              : this.player.inAllyTank
                ? 26
                : WEAPON_STATS[this.player.weaponId].damage;
          const hit = this.tanks.checkProjectileHit(
            pos,
            isRocket,
            () => {
              this.tanksDestroyed++;
              this.pushRadioCaption('VEÍCULO INIMIGO DESTRUÍDO! BOM TIRO!');
            },
            bulletDmg
          );
          if (hit && isRocket) {
            this.player.registerHitMarker(true);
          }
          return hit;
        },
        onExplosion: (center, radius, maxDamage, craterR, craterD, cause, isFromPlayer) => {
          this.handleExplosion(center, radius, maxDamage, craterR, craterD, cause, isFromPlayer);
        }
      },
      diffConfig.bleedChanceMult
    );

    this.cover.updateSmokeClouds(dt);
    this.vfx.update(dt);
    this.envBuilder.update(dt, this.totalElapsed);
    this.terrain.flushDirtyNormals();

    // Audio spatial & physiological update
    const nearestTankDist = this.tanks.getNearestTankDistance(this.player.pos);
    this.audio.updateState(
      dt,
      this.player.suppression,
      this.player.tinnitus,
      this.player.hp,
      this.player.bleeding,
      nearestTankDist,
      true
    );

    // Phase progression, strafing runs, troop car reinforcements, mortar zeroing & Survival waves
    const phase = this.activeMission.phases[this.phaseIndex];
    if (phase) {
      if (phase.artilleryRate && phase.artilleryRate < 100) {
        this.artilleryCooldown -= dt;
        if (this.artilleryCooldown <= 0) {
          this.artilleryCooldown = phase.artilleryRate * (0.75 + Math.random() * 0.5);
          const spreadX = this.mortarZeroed ? 5.5 : 26;
          const spreadZ = this.mortarZeroed ? 5.5 : 18;
          const ax = this.player.pos.x + (Math.random() - 0.5) * spreadX;
          const az = Math.max(
            -24,
            Math.min(34, this.player.pos.z + (this.mortarZeroed ? 0 : -6) + (Math.random() - 0.5) * spreadZ)
          );
          this.projectiles.spawnFallingBomb(ax, 28, az, false);
          this.audio.playBombWhistle(Math.max(-1, Math.min(1, (ax - this.player.pos.x) / 20)));
        }
      }

      // Strafing runs
      if (this.pendingStrafeWaves > 0) {
        this.strafeCooldown -= dt;
        if (this.strafeCooldown <= 0) {
          this.pendingStrafeWaves--;
          this.strafeCooldown = 16;
          this.triggerStrafeWave(diffConfig);
        }
      }

      // Periodic troop car reinforcements in long phases
      if (
        (phase.type === 'survive_wave' || phase.type === 'clear_trench' || phase.type === 'tank_assault') &&
        this.soldiers.getRemainingWaveCount() > 18
      ) {
        this.troopCarTimer -= dt;
        if (this.troopCarTimer <= 0) {
          this.troopCarTimer = 28;
          const sx = (Math.random() - 0.5) * 32;
          this.tanks.spawnTroopCar(
            {
              x: sx,
              z: -45,
              dropX: sx * 0.65,
              dropZ: -16 + Math.random() * 8,
              passengers: 5,
              roles: ['assault', 'rifleman', 'grenadier']
            },
            (x, z, count, roles) => this.soldiers.spawnSquadAt(x, z, count, roles)
          );
        }
      }

      // Mortar zeroing anti-camping
      if (phase.mortarZeroing || isSurvival) {
        const insideBuilding = this.cover.isInsideEnterableBuilding(this.player.pos.x, this.player.pos.z);
        const safeFromZeroing =
          this.player.coverState === 'dugout' ||
          this.player.overheadProtected ||
          insideBuilding ||
          this.player.inAllyTank;

        const distMoved = Math.hypot(
          this.player.pos.x - this.campAnchor.x,
          this.player.pos.z - this.campAnchor.z
        );

        if (safeFromZeroing || distMoved > 5.0) {
          this.campAnchor.copy(this.player.pos);
          this.campTimer = 0;
          this.mortarZeroed = false;
          this.mortarZeroSalvoCooldown = 0;
          this.mortarWarningText = null;
        } else if (distMoved < 3.8) {
          this.campTimer += dt;
          if (this.campTimer > 9.0) {
            this.mortarZeroed = true;
            this.mortarWarningText = 'MORTEIRO CALIBRADO! SAIA DA POSIÇÃO IMEDIATAMENTE!';
            this.mortarZeroSalvoCooldown -= dt;
            if (this.mortarZeroSalvoCooldown <= 0) {
              this.mortarZeroSalvoCooldown = 3.1;
              const mx = this.player.pos.x + (Math.random() - 0.5) * 3.0;
              const mz = this.player.pos.z + (Math.random() - 0.5) * 3.0;
              this.projectiles.spawnFallingBomb(mx, 28, mz, false);
              this.audio.playBombWhistle(0);
            }
          } else if (this.campTimer > 6.5) {
            this.mortarWarningText = 'MORTEIRO INIMIGO CALIBRANDO SUA POSIÇÃO — MOVA-SE!';
          }
        }
      } else {
        this.campTimer = 0;
        this.mortarZeroed = false;
        this.mortarWarningText = null;
      }

      let advance = false;
      if (phase.type === 'survive_wave') {
        if (this.soldiers.getRemainingWaveCount() === 0) {
          advance = true;
        }
      } else if (phase.type === 'destroy_tanks' || phase.type === 'tank_assault') {
        if (
          this.tanks.getLivingTankCount() === 0 &&
          this.soldiers.getRemainingWaveCount() <= 2
        ) {
          advance = true;
        }
      } else if (phase.type === 'bomber_storm') {
        if (
          !this.bombers.isActive() &&
          this.tanks.getLivingTankCount() === 0 &&
          this.soldiers.getRemainingWaveCount() === 0
        ) {
          advance = true;
        }
      } else if (phase.type === 'hold_timer') {
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) advance = true;
      } else if (phase.type === 'reach_zone' && phase.targetZone) {
        const d = Math.hypot(
          this.player.pos.x - phase.targetZone.x,
          this.player.pos.z - phase.targetZone.z
        );
        if (d <= phase.targetZone.radius) advance = true;
      } else if (phase.type === 'clear_trench') {
        if (
          this.tanks.getLivingTankCount() === 0 &&
          this.soldiers.getRemainingWaveCount() <= 1
        ) {
          advance = true;
        }
      } else if (phase.type === 'detonate_wait') {
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) {
          const mainBunker = this.activeMission.bunkers.find((b) => b.kind === 'bunker_main');
          const bunkerPos = new THREE.Vector3(mainBunker?.x ?? 0, 0, mainBunker?.z ?? -36);
          this.envBuilder.shatterMainBunker();
          this.handleExplosion(bunkerPos, 15, 220, 4.5, 1.5, 'Detonação do Bunker Principal', true);
          advance = true;
        }
      } else if (phase.type === 'survival_endless') {
        if (
          this.soldiers.getRemainingWaveCount() === 0 &&
          this.tanks.getLivingTankCount() === 0
        ) {
          this.advanceSurvivalWave(diffConfig);
        }
      }

      if (advance) {
        this.beginPhase(this.phaseIndex + 1);
      }
    }

    // Check Player Death
    if (this.player.hp <= 0) {
      this.finishMission(false);
      return;
    }

    // Push HUD State
    this.emitHUDState(playerInteraction);
  }

  private advanceSurvivalWave(diffConfig: ReturnType<typeof getDifficultyConfig>): void {
    this.survivalWave++;
    this.updateAndSaveSurvivalRecord();
    this.pushRadioCaption(`VAGA ${this.survivalWave} INICIADA! REFORÇOS INIMIGOS NA TERRA DE NINGUÉM!`);

    // Small breather supply bonus every 2 waves
    if (this.survivalWave % 2 === 1) {
      this.player.bandages = Math.min(5, this.player.bandages + 1);
      this.player.smokeGrenades = Math.min(4, this.player.smokeGrenades + 1);
    }

    const maxSimultaneous = getMaxSimultaneousEnemies(
      this.settings.difficulty,
      this.settings.quality,
      this.isMobileDevice()
    );

    const enemyCount = Math.min(
      260,
      Math.round((22 + this.survivalWave * 9) * diffConfig.waveCountMult)
    );
    const roles: SoldierRole[] = ['rifleman', 'assault', 'grenadier'];
    if (this.survivalWave >= 2) roles.push('mg_gunner', 'officer');
    if (this.survivalWave >= 3) roles.push('flamethrower');

    this.soldiers.queueEnemyWave(enemyCount, roles, maxSimultaneous);

    // Spawn troop car on waves >= 2
    const sx = (Math.random() - 0.5) * 30;
    this.tanks.spawnTroopCar(
      {
        x: sx,
        z: -45,
        dropX: sx * 0.6,
        dropZ: -14 + Math.random() * 6,
        passengers: Math.min(7, 4 + Math.floor(this.survivalWave / 2)),
        roles: ['assault', 'grenadier', 'flamethrower']
      },
      (x, z, count, r) => this.soldiers.spawnSquadAt(x, z, count, r)
    );

    // Enemy tanks every 2 waves
    if (this.survivalWave % 2 === 0) {
      const tankCount = this.survivalWave >= 6 ? 2 : 1;
      for (let i = 0; i < tankCount; i++) {
        const tx = (i === 0 ? -1 : 1) * (10 + Math.random() * 8);
        this.tanks.spawnTank(tx, -38, this.survivalWave >= 4, [
          { x: tx * 0.7, z: -12 },
          { x: tx * 0.4, z: 10 },
          { x: 0, z: 22 }
        ]);
      }
    }

    // Air strike / strafing every 3 waves
    if (this.survivalWave % 3 === 0) {
      this.triggerStrafeWave(diffConfig);
    }
  }

  private emitHUDState(playerInteraction: {
    interactPrompt: string | null;
    actionProgress: number;
    actionLabel: string | null;
  }): void {
    const phase = this.activeMission.phases[this.phaseIndex];
    const isSurvival = Boolean(this.activeMission.isSurvival || this.activeMission.id === 99);
    let objectiveBearing: number | null = null;
    let objectiveDistance: number | null = null;
    let objText = phase?.objectiveText ?? '';
    let objSub = phase?.objectiveSubtext ?? '';

    if (isSurvival) {
      objText = `SOBREVIVA À VAGA ${this.survivalWave}`;
      objSub = `Elimine todas as forças inimigas • Abates: ${this.kills}`;
    } else if (phase?.type === 'hold_timer' || phase?.type === 'detonate_wait') {
      objSub = `${objSub} (${Math.max(0, Math.ceil(this.phaseTimer))}s)`;
    }

    if (phase?.objectiveTarget) {
      const dx = phase.objectiveTarget.x - this.player.pos.x;
      const dz = phase.objectiveTarget.z - this.player.pos.z;
      objectiveDistance = Math.hypot(dx, dz);
      objectiveBearing = Math.atan2(dx, -dz);
      if (objectiveBearing < 0) objectiveBearing += Math.PI * 2;
    }

    const gWarn = this.projectiles.getNearestDangerGrenade(this.player.pos, this.player.yaw);
    const inSmokeScreen = this.cover.isPointInSmoke(
      this.player.pos.x,
      this.player.pos.y + 1.0,
      this.player.pos.z
    );
    const touchActive = this.input.isTouchActive();
    const smokeHintPrompt =
      !playerInteraction.interactPrompt &&
      !touchActive &&
      !inSmokeScreen &&
      !this.player.inAllyTank &&
      this.player.smokeGrenades > 0 &&
      this.missionElapsed < 35 &&
      (this.player.coverState === 'exposed' || this.player.peekDanger > 0.65)
        ? '[X] Lançar Granada de Fumaça'
        : null;

    const stats = WEAPON_STATS[this.player.weaponId];
    const spreadPx =
      (THREE.MathUtils.lerp(stats.spreadHip, stats.spreadAds, this.player.adsFactor) +
        this.player.suppression * 0.035) *
      460;
    const allyTankStatus = this.tanks.getAllyTankStatus();
    const campaignState = this.campaignManager.getState();
    const rawMembers = this.app.world.getSquadMembers('player_squad');
    const squadMembers = rawMembers.map((m) => ({
      id: m.id,
      callsign: m.callsign,
      role: m.role,
      hp: m.health,
      maxHp: m.maxHealth,
      alive: m.alive,
      wounded: m.wounded,
      state: m.state
    }));
    const sectors = this.app.world.getSectorsSnapshot();

    const hud: HUDState = {
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      bleeding: this.player.bleeding,
      bandages: this.player.bandages,
      bandagingProgress: this.player.bandagingProgress,
      suppression: this.player.suppression,
      tinnitus: this.player.tinnitus,
      exposure: this.player.exposure,
      coverState: this.player.coverState,
      isCrouching: this.player.isCrouching,
      isSprinting: this.player.isSprinting,
      weaponId: this.player.weaponId,
      ammoInMag: this.player.magAmmo[this.player.weaponId],
      magCapacity: stats.magSize,
      ammoReserve: this.player.reserveAmmo[this.player.weaponId],
      reloadingProgress: this.player.reloadingProgress,
      grenades: this.player.reserveAmmo.grenade,
      rockets: this.player.reserveAmmo.bazooka,
      cookingGrenadeProgress: this.player.cookingGrenade
        ? Math.min(1, this.player.cookTimer / 3.2)
        : 0,
      adsFactor: this.player.adsFactor,
      mgMounted: this.player.mgMounted,
      mgHeat: this.player.mgHeat,
      mgOverheated: this.player.mgOverheated,
      interactPrompt: playerInteraction.interactPrompt ?? smokeHintPrompt,
      actionProgress: playerInteraction.actionProgress,
      actionLabel: playerInteraction.actionLabel,
      grenadeWarning: gWarn
        ? { angleRad: gWarn.angleRad, distance: gWarn.dist, fuseProgress: gWarn.fuseProgress }
        : null,
      airRaidAlert: this.airRaidAlert,
      damageIndicators: this.player.damageIndicators,
      objectiveText: objText,
      objectiveSubtext: objSub,
      radioCaption: this.radioCaption,
      compassYaw: this.player.yaw,
      objectiveBearing,
      objectiveDistance,
      missionTime: this.missionElapsed,
      kills: this.kills,
      tanksDestroyed: this.tanksDestroyed,
      hitMarkerTimer: this.player.hitMarkerTimer,
      hitMarkerCrit: this.player.hitMarkerCrit,
      spreadPx,
      showControlsHint: this.missionElapsed < 20 && (this.selectedMissionId === 0 || this.selectedMissionId === 3),
      peekDanger: this.player.peekDanger,
      isRegenerating: this.player.isRegenerating,
      difficulty: this.settings.difficulty,
      phaseIndex: this.phaseIndex,
      totalPhases: this.activeMission.phases.length,
      checkpointToast: this.checkpointToast,
      livingEnemies: this.soldiers.getLivingEnemyCount(),
      remainingWaveEnemies: this.soldiers.getRemainingWaveCount(),
      touchActive,
      smokeGrenades: this.player.smokeGrenades,
      inSmokeScreen,
      primaryWeaponId: this.player.primaryWeapon,
      secondaryWeaponId: this.player.secondaryWeapon,
      binocularsActive: this.player.binocularsActive,
      artilleryCallCooldown: this.player.artilleryCallCooldown,
      artilleryCallReady: this.player.artilleryCallCooldown <= 0,
      meleeCooldown: this.player.meleeCooldown,
      sniperScopeActive: this.player.sniperScopeActive,
      inAllyTank: this.player.inAllyTank,
      allyTankHp: allyTankStatus.hp,
      allyTankMaxHp: allyTankStatus.maxHp,
      allyTankShellCooldown: allyTankStatus.shellCooldown,
      mortarWarning: this.mortarWarningText,
      survivalWave: this.survivalWave,
      isSurvival,
      squadMenuOpen: this.player.squadMenuOpen,
      squadActiveCommand: this.squadActiveCommand,
      squadMembers,
      sectors,
      radioChannel: this.radioChannel,
      radioDegraded: this.radioDegraded,
      woundLevel: this.player.woundLevel,
      campaignAmmoBonus: campaignState.ammoBonus,
      campaignSupportLevel: campaignState.supportLevel
    };

    this.ui.updateHUD(hud);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.totalElapsed += dt;

    if (this.screen === 'playing') {
      this.updateGameplay(dt);
    } else {
      // Live atmospheric battlefield camera behind Menu / Briefing
      this.envBuilder.update(dt, this.totalElapsed);
      this.audio.updateState(dt, 0, 0, 100, false, 999, false);
      if (this.screen === 'menu' || this.screen === 'briefing') {
        const sway = Math.sin(this.totalElapsed * 0.16) * 8;
        this.camera.position.set(sway, 4.2, 34);
        this.camera.lookAt(sway * 0.4, 0.2, -14);
      }
    }

    if (this.composer && this.shouldUsePostProcessing()) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private syncCompletedUnlocks(): void {
    if (this.completedMissions.has(0)) {
      this.unlockedWeapons.add('shotgun');
    }
    if (this.completedMissions.has(1)) {
      this.unlockedWeapons.add('sniper');
    }
    if (this.completedMissions.has(2)) {
      this.unlockedWeapons.add('lmg');
    }
  }

  private unlockWeapon(id: WeaponId): void {
    if (!this.unlockedWeapons.has(id)) {
      this.unlockedWeapons.add(id);
      this.saveUnlocks();
      this.ui.setArsenalState(this.unlockedWeapons, this.loadout);
    }
  }

  private loadCompleted(): Set<MissionId> {
    try {
      const raw = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as MissionId[];
      return new Set(arr);
    } catch {
      return new Set();
    }
  }

  private saveCompleted(): void {
    try {
      localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify([...this.completedMissions]));
    } catch {
      // Ignore storage errors
    }
  }

  private loadUnlocks(): Set<WeaponId> {
    const base = new Set<WeaponId>(DEFAULT_UNLOCKED_WEAPONS);
    try {
      const raw = localStorage.getItem(STORAGE_UNLOCKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WeaponId[];
        if (Array.isArray(parsed)) {
          for (const w of parsed) {
            if (w in WEAPON_STATS) base.add(w);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
    return base;
  }

  private saveUnlocks(): void {
    try {
      localStorage.setItem(STORAGE_UNLOCKS_KEY, JSON.stringify([...this.unlockedWeapons]));
    } catch {
      // Ignore storage errors
    }
  }

  private loadLoadout(): PlayerLoadout {
    const defaults: PlayerLoadout = { primary: 'rifle', secondary: 'pistol' };
    try {
      const raw = localStorage.getItem(STORAGE_LOADOUT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlayerLoadout>;
        const primary: PrimaryWeaponId =
          parsed.primary &&
          (['rifle', 'smg', 'shotgun', 'sniper', 'lmg'] as string[]).includes(parsed.primary)
            ? parsed.primary
            : defaults.primary;
        const secondary: SecondaryWeaponId =
          parsed.secondary &&
          (['pistol', 'smg', 'rifle'] as string[]).includes(parsed.secondary)
            ? parsed.secondary
            : defaults.secondary;
        return { primary, secondary };
      }
    } catch {
      // Ignore storage errors
    }
    return defaults;
  }

  private saveLoadout(): void {
    try {
      localStorage.setItem(STORAGE_LOADOUT_KEY, JSON.stringify(this.loadout));
    } catch {
      // Ignore storage errors
    }
  }

  private loadSurvivalRecord(): SurvivalRecord {
    const defaults: SurvivalRecord = { bestWave: 0, bestKills: 0, bestTimeSec: 0 };
    try {
      const raw = localStorage.getItem(STORAGE_SURVIVAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SurvivalRecord>;
        return {
          bestWave: typeof parsed.bestWave === 'number' ? parsed.bestWave : 0,
          bestKills: typeof parsed.bestKills === 'number' ? parsed.bestKills : 0,
          bestTimeSec: typeof parsed.bestTimeSec === 'number' ? parsed.bestTimeSec : 0
        };
      }
    } catch {
      // Ignore storage errors
    }
    return defaults;
  }

  private updateAndSaveSurvivalRecord(): void {
    const improved =
      this.survivalWave > this.survivalRecord.bestWave ||
      (this.survivalWave === this.survivalRecord.bestWave && this.kills > this.survivalRecord.bestKills) ||
      (this.survivalWave === this.survivalRecord.bestWave &&
        this.kills === this.survivalRecord.bestKills &&
        this.missionElapsed > this.survivalRecord.bestTimeSec);

    if (improved) {
      this.survivalRecord = {
        bestWave: Math.max(this.survivalRecord.bestWave, this.survivalWave),
        bestKills: Math.max(this.survivalRecord.bestKills, this.kills),
        bestTimeSec: Math.max(this.survivalRecord.bestTimeSec, Math.floor(this.missionElapsed))
      };
      try {
        localStorage.setItem(STORAGE_SURVIVAL_KEY, JSON.stringify(this.survivalRecord));
      } catch {
        // Ignore storage errors
      }
      this.ui.setSurvivalRecord(this.survivalRecord);
    }
  }

  private loadSettings(): GameSettings {
    const defaults: GameSettings = {
      mouseSensitivity: 1.0,
      masterVolume: 0.75,
      quality: 'medium',
      difficulty: 'veteran',
      touchControls: 'auto'
    };
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GameSettings>;
        const difficulty =
          parsed.difficulty && parsed.difficulty in DIFFICULTY_CONFIGS
            ? parsed.difficulty
            : defaults.difficulty;
        const quality =
          parsed.quality === 'low' || parsed.quality === 'medium' || parsed.quality === 'high'
            ? parsed.quality
            : defaults.quality;
        const touchControls =
          parsed.touchControls === 'auto' ||
          parsed.touchControls === 'on' ||
          parsed.touchControls === 'off'
            ? parsed.touchControls
            : defaults.touchControls;
        return {
          mouseSensitivity:
            typeof parsed.mouseSensitivity === 'number'
              ? parsed.mouseSensitivity
              : defaults.mouseSensitivity,
          masterVolume:
            typeof parsed.masterVolume === 'number'
              ? parsed.masterVolume
              : defaults.masterVolume,
          quality,
          difficulty,
          touchControls
        };
      }
    } catch {
      // Ignore
    }
    return defaults;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
  }
}
