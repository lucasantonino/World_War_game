import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BomberSystem } from '../entities/BomberSystem';
import { PlayerController, WEAPON_STATS } from '../entities/PlayerController';
import { ProjectileSystem } from '../entities/ProjectileSystem';
import { SoldierSystem } from '../entities/SoldierSystem';
import { TankSystem } from '../entities/TankSystem';
import { VFXSystem } from '../entities/VFXSystem';
import { UIManager } from '../ui/UIManager';
import {
  GameScreen,
  GameSettings,
  HUDState,
  InteractablePoint,
  MissionConfig,
  MissionEndSummary,
  MissionId,
  PlayerCheckpointSnapshot
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
  private liveInteractables: InteractablePoint[] = [];

  private checkpointPhaseIndex = 0;
  private checkpointSnapshot: PlayerCheckpointSnapshot | null = null;
  private checkpointToast: string | null = null;
  private checkpointToastTimer = 0;
  private checkpointKills = 0;
  private checkpointTanks = 0;
  private checkpointElapsed = 0;

  private settings: GameSettings;
  private completedMissions = new Set<MissionId>();
  private clock = new THREE.Clock();
  private totalElapsed = 0;
  private wasInMission = false;

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.settings = this.loadSettings();
    this.completedMissions = this.loadCompleted();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = this.settings.quality !== 'low';
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
    this.soldiers = new SoldierSystem(
      this.scene,
      this.terrain,
      this.cover,
      this.projectiles,
      this.vfx,
      this.audio
    );
    this.tanks = new TankSystem(
      this.scene,
      this.terrain,
      this.cover,
      this.projectiles,
      this.vfx,
      this.audio
    );
    this.bombers = new BomberSystem(this.scene, this.projectiles, this.vfx, this.audio);

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
        const nextId = Math.min(3, this.selectedMissionId + 1) as MissionId;
        this.selectedMissionId = nextId;
        this.ui.setSelectedMission(nextId);
        this.screen = 'briefing';
        this.ui.showBriefing(getMissionConfig(nextId));
      },
      onSettingsChanged: (newSettings) => {
        this.settings = { ...newSettings };
        this.audio.setMasterVolume(this.settings.masterVolume);
        this.renderer.shadowMap.enabled = this.settings.quality !== 'low';
        this.input.setTouchModeOverride(this.settings.touchControls);
        this.saveSettings();
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
      },
      onTouchKeyHold: (code, held) => {
        this.input.setVirtualKeyHold(code, held);
      },
      onTouchSelectWeapon: (id) => {
        this.player.selectWeapon(id);
      },
      onTouchCycleWeapon: () => {
        this.player.cycleWeapon();
      },
      onTouchPause: () => {
        this.pauseGameplay();
      }
    });

    this.ui.onTouchSmoke = () => {
      this.player.throwSmokeGrenade();
    };

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
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    } else {
      (u.uTint.value as THREE.Vector3).set(0.9, 0.96, 1.06);
      u.uSaturation.value = 0.8;
      u.uContrast.value = 1.1;
      u.uVignette.value = 0.32;
    }
  }

  private pauseGameplay(): void {
    if (this.screen === 'playing') {
      this.screen = 'paused';
      this.input.setGameplayActive(false);
      this.ui.setScreen('paused');
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
    this.player.viewModel.root.visible = true;

    this.soldiers.spawnAllies(cfg.allyCount);
    this.soldiers.spawnEmplacedGunners(cfg.enemyEmplacements);

    this.phaseIndex = 0;
    this.missionElapsed = 0;
    this.kills = 0;
    this.tanksDestroyed = 0;
    this.airRaidAlert = null;
    this.radioCaption = null;
    this.radioCaptionTimer = 0;
    this.checkpointPhaseIndex = 0;
    this.checkpointSnapshot = null;
    this.checkpointToast = null;
    this.checkpointToastTimer = 0;
    this.checkpointKills = 0;
    this.checkpointTanks = 0;
    this.checkpointElapsed = 0;
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

    for (const inter of this.liveInteractables) {
      if (inter.kind === 'radio') {
        inter.active = curPhase?.type === 'activate_radio';
      } else if (inter.kind === 'bunker_charge') {
        inter.active = curPhase?.type === 'plant_charge';
      }
    }

    this.soldiers.spawnAllies(cfg.allyCount);
    this.soldiers.spawnEmplacedGunners(cfg.enemyEmplacements);

    this.kills = this.checkpointKills;
    this.tanksDestroyed = this.checkpointTanks;
    this.missionElapsed = this.checkpointElapsed;
    this.airRaidAlert = null;
    this.radioCaption = null;
    this.radioCaptionTimer = 0;
    this.checkpointToast = null;
    this.checkpointToastTimer = 0;
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

    if (phase.tanksToSpawn) {
      for (const ts of phase.tanksToSpawn) {
        this.tanks.spawnTank(ts.x, ts.z, ts.heavy, ts.waypoints);
      }
    }

    const maxSimultaneous = getMaxSimultaneousEnemies(
      this.settings.difficulty,
      this.settings.quality,
      this.isMobileDevice()
    );

    if (phase.type === 'bomber_storm') {
      this.airRaidAlert = 'ALERTA AÉREO — ENTRE NO ABRIGO SUBTERRÂNEO!';
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

  private pushRadioCaption(text: string): void {
    this.radioCaption = text;
    this.radioCaptionTimer = 5.0;
    this.audio.playRadioStatic();
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

    // Damage enemies & tanks
    this.soldiers.applyBlastDamage(center, radius, maxDamage, isFromPlayer, () => {
      if (isFromPlayer) this.kills++;
    });
    this.tanks.applyBlastDamage(center, radius * 0.8, maxDamage * 0.85, () => {
      this.tanksDestroyed++;
      this.pushRadioCaption('ALVO BLINDADO DESTRUÍDO! BOM TIRO!');
    });

    // Player blast, suppression, tinnitus & screen shake
    if (distToPlayer < 26) {
      const prox = 1 - distToPlayer / 26;
      this.player.addShake(prox * 0.85);
      this.player.applySuppression(prox * 0.7);
      if (distToPlayer < 13) {
        this.player.tinnitus = Math.min(1, this.player.tinnitus + (1 - distToPlayer / 13) * 0.95);
      }
    }

    if (distToPlayer <= radius) {
      // Dugout overhead shelter protects from aerial bombs & distant artillery!
      const isAerialOrArtillery = cause.includes('aérea') || cause.includes('Artilharia');
      if (isAerialOrArtillery && this.player.overheadProtected) {
        return;
      }
      const coverReduction =
        this.player.coverState === 'dugout'
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

    if (victory) {
      this.completedMissions.add(this.activeMission.id);
      this.saveCompleted();
      this.ui.setCompletedMissions(this.completedMissions);
      this.screen = 'victory';
    } else {
      this.screen = 'kia';
    }

    let advice = 'Mantenha-se abaixo do parapeito com [C] e avance apenas quando houver pausa no fogo.';
    if (this.player.lastDamageCause.includes('aérea')) {
      advice = 'Quando ouvir a sirene aérea, corra imediatamente para um dos ABRIGOS subterrâneos na parede traseira.';
    } else if (this.player.lastDamageCause.includes('Hemorragia')) {
      advice = 'Ao receber tiro grave, recue para a cobertura e segure [H] por 2 segundos para aplicar curativo.';
    } else if (this.player.lastDamageCause.includes('tanque')) {
      advice = 'Nunca encare a frente de um tanque em campo aberto. Flanqueie pelas crateras usando a Bazuca [3].';
    } else if (this.player.lastDamageCause.includes('Granada')) {
      advice = 'Fique atento ao aviso de granada próxima — afaste-se ou pressione [F] bem perto dela para chutá-la de volta.';
    }

    const diffConfig = getDifficultyConfig(this.settings.difficulty);
    const canRetryCheckpoint =
      !victory &&
      diffConfig.allowCheckpoints &&
      this.checkpointSnapshot !== null &&
      this.checkpointPhaseIndex >= 1;
    const checkpointPhaseLabel = canRetryCheckpoint
      ? `Fase ${this.checkpointPhaseIndex + 1}`
      : null;

    const summary: MissionEndSummary = {
      missionId: this.activeMission.id,
      missionTitle: `${this.activeMission.code} — ${this.activeMission.title}`,
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
      checkpointPhaseLabel
    };
    this.ui.showMissionEnd(summary);
  }

  private updateGameplay(dt: number): void {
    this.missionElapsed += dt;
    const diffConfig = getDifficultyConfig(this.settings.difficulty);

    if (this.radioCaptionTimer > 0) {
      this.radioCaptionTimer -= dt;
      if (this.radioCaptionTimer <= 0) this.radioCaption = null;
    }

    if (this.checkpointToastTimer > 0) {
      this.checkpointToastTimer -= dt;
      if (this.checkpointToastTimer <= 0) this.checkpointToast = null;
    }

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
        }
      },
      diffConfig,
      (origin, dir) => this.soldiers.findAutoAimTarget(origin, dir)
    );

    // Update entities
    this.soldiers.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      this.player.exposure,
      this.bombers.isWarningOrPassing(),
      (msg) => this.pushRadioCaption(msg),
      this.player.peekDanger,
      diffConfig
    );

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
          }
          return res.hit;
        },
        onHitAllySoldier: (pos, dir, damage) => {
          return this.soldiers.checkBulletHit('ally', pos, dir, damage).hit;
        },
        onHitPlayer: (damage, origin, cause, causeBleed) => {
          this.player.applyDamage(damage, origin, cause, causeBleed, diffConfig);
        },
        onNearMissPlayer: (origin) => {
          const pan = Math.max(-1, Math.min(1, (origin.x - this.player.pos.x) / 14));
          this.audio.playBulletWhiz(pan);
          this.player.applySuppression(0.24);
        },
        onHitTank: (pos, _damage, isRocket) => {
          const hit = this.tanks.checkProjectileHit(pos, isRocket, () => {
            this.tanksDestroyed++;
            this.pushRadioCaption('TANQUE INIMIGO ABATIDO!');
          });
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

    // Phase progression & ambient artillery
    const phase = this.activeMission.phases[this.phaseIndex];
    if (phase) {
      if (phase.artilleryRate && phase.artilleryRate < 100) {
        this.artilleryCooldown -= dt;
        if (this.artilleryCooldown <= 0) {
          this.artilleryCooldown = phase.artilleryRate * (0.75 + Math.random() * 0.5);
          const ax = this.player.pos.x + (Math.random() - 0.5) * 26;
          const az = Math.max(-24, Math.min(34, this.player.pos.z - 6 + (Math.random() - 0.5) * 18));
          this.projectiles.spawnFallingBomb(ax, 28, az, false);
          this.audio.playBombWhistle(Math.max(-1, Math.min(1, (ax - this.player.pos.x) / 20)));
        }
      }

      let advance = false;
      if (phase.type === 'survive_wave') {
        if (this.soldiers.getRemainingWaveCount() === 0) {
          advance = true;
        }
      } else if (phase.type === 'destroy_tanks') {
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
          const bunkerPos = new THREE.Vector3(0, 0, -36);
          this.envBuilder.shatterMainBunker();
          this.handleExplosion(bunkerPos, 15, 220, 4.5, 1.5, 'Detonação do Bunker Principal', true);
          advance = true;
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

  private emitHUDState(playerInteraction: {
    interactPrompt: string | null;
    actionProgress: number;
    actionLabel: string | null;
  }): void {
    const phase = this.activeMission.phases[this.phaseIndex];
    let objectiveBearing: number | null = null;
    let objectiveDistance: number | null = null;
    let objText = phase?.objectiveText ?? '';
    let objSub = phase?.objectiveSubtext ?? '';

    if (phase?.type === 'hold_timer' || phase?.type === 'detonate_wait') {
      objSub = `${objSub} (${Math.max(0, Math.ceil(this.phaseTimer))}s)`;
    }

    if (phase?.objectiveTarget) {
      const dx = phase.objectiveTarget.x - this.player.pos.x;
      const dz = phase.objectiveTarget.z - this.player.pos.z;
      objectiveDistance = Math.hypot(dx, dz);
      // Bearing 0 = North (-Z), PI/2 = East (+X)
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
      inSmokeScreen
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
