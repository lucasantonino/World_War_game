import * as THREE from 'three';
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
  MissionId
} from '../types';
import { CoverSystem } from '../world/CoverSystem';
import { EnvironmentBuilder } from '../world/EnvironmentBuilder';
import { getMissionConfig } from '../world/MissionData';
import { Terrain } from '../world/Terrain';
import { AudioEngine } from './AudioEngine';
import { InputManager } from './InputManager';

const STORAGE_COMPLETED_KEY = 'tdn_completed_ops_v1';
const STORAGE_SETTINGS_KEY = 'tdn_settings_v1';

export class GameEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

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
  private pendingSpawns: Array<{ delay: number; action: () => void }> = [];
  private liveInteractables: InteractablePoint[] = [];

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

    this.audio = new AudioEngine();
    this.audio.setMasterVolume(this.settings.masterVolume);
    this.input = new InputManager(canvas);

    this.terrain = new Terrain();
    this.scene.add(this.terrain.mesh);

    this.cover = new CoverSystem(this.terrain);
    this.envBuilder = new EnvironmentBuilder(this.scene, this.terrain, this.cover);
    this.vfx = new VFXSystem(this.scene);
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
          this.input.requestLock();
        } else {
          this.screen = 'menu';
          this.ui.setScreen('menu');
        }
      },
      onRestartMission: () => {
        this.audio.unlock();
        this.startMission(this.selectedMissionId);
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
        this.saveSettings();
      }
    });

    this.input.setOnPauseRequested(() => {
      if (this.screen === 'playing') {
        this.screen = 'paused';
        this.input.setGameplayActive(false);
        this.ui.setScreen('paused');
      }
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.previewMenuScene(0);
    this.animate();
  }

  private previewMenuScene(id: MissionId): void {
    const cfg = getMissionConfig(id);
    this.activeMission = cfg;
    this.clearCombatActors();
    this.terrain.loadMission(cfg);
    this.envBuilder.buildMission(cfg, this.settings.quality);
    this.player.viewModel.root.visible = false;
  }

  private clearCombatActors(): void {
    this.vfx.clear();
    this.projectiles.clear();
    this.soldiers.clear();
    this.tanks.clear();
    this.bombers.clear();
    this.pendingSpawns = [];
  }

  private startMission(id: MissionId): void {
    this.selectedMissionId = id;
    const cfg = getMissionConfig(id);
    this.activeMission = cfg;
    this.clearCombatActors();

    this.terrain.loadMission(cfg);
    this.envBuilder.buildMission(cfg, this.settings.quality);
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
    this.wasInMission = true;

    this.beginPhase(0);

    this.screen = 'playing';
    this.ui.setScreen('playing');
    this.input.setGameplayActive(true);
    this.input.requestLock();
  }

  private beginPhase(idx: number): void {
    this.phaseIndex = idx;
    const phase = this.activeMission.phases[idx];
    if (!phase) {
      this.finishMission(true);
      return;
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

    if (phase.type === 'bomber_storm') {
      this.airRaidAlert = 'ALERTA AÉREO — ENTRE NO ABRIGO SUBTERRÂNEO!';
      this.bombers.triggerBomberRun(() => {
        this.airRaidAlert = null;
        if (phase.enemiesToSpawn && phase.enemyRoles) {
          this.soldiers.spawnEnemySquad(phase.enemiesToSpawn, phase.enemyRoles);
          this.pushRadioCaption('Bombardeio passou! Infantaria inimiga avançando pela fumaça!');
        }
      });
    } else if (phase.enemiesToSpawn && phase.enemyRoles) {
      const firstBatch = Math.min(10, phase.enemiesToSpawn);
      const rest = phase.enemiesToSpawn - firstBatch;
      this.soldiers.spawnEnemySquad(firstBatch, phase.enemyRoles);
      if (rest > 0) {
        this.pendingSpawns.push({
          delay: 6.5,
          action: () => {
            if (this.screen === 'playing') {
              this.soldiers.spawnEnemySquad(rest, phase.enemyRoles!);
            }
          }
        });
      }
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
        this.player.applyDamage(dmg, center, cause, dmg > 25);
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
      shotsHit: this.player.shotsHit
    };
    this.ui.showMissionEnd(summary);
  }

  private updateGameplay(dt: number): void {
    this.missionElapsed += dt;

    if (this.radioCaptionTimer > 0) {
      this.radioCaptionTimer -= dt;
      if (this.radioCaptionTimer <= 0) this.radioCaption = null;
    }

    // Pending reinforcement waves
    for (let i = this.pendingSpawns.length - 1; i >= 0; i--) {
      this.pendingSpawns[i].delay -= dt;
      if (this.pendingSpawns[i].delay <= 0) {
        const act = this.pendingSpawns[i].action;
        this.pendingSpawns.splice(i, 1);
        act();
      }
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
      }
    );

    // Update entities
    this.soldiers.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      this.player.exposure,
      this.bombers.isWarningOrPassing(),
      (msg) => this.pushRadioCaption(msg)
    );

    this.tanks.update(
      dt,
      this.player.pos,
      this.player.getEyeY(),
      this.player.exposure,
      (center, radius, maxDmg, craterR, craterD, cause) => {
        this.handleExplosion(center, radius, maxDmg, craterR, craterD, cause, false);
      }
    );

    this.bombers.update(dt, this.player.pos.x);

    this.projectiles.update(dt, this.player.pos, this.player.getEyeY(), {
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
        this.player.applyDamage(damage, origin, cause, causeBleed);
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
    });

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
        if (this.pendingSpawns.length === 0 && this.soldiers.getLivingEnemyCount() === 0) {
          advance = true;
        }
      } else if (phase.type === 'destroy_tanks') {
        if (
          this.tanks.getLivingTankCount() === 0 &&
          this.pendingSpawns.length === 0 &&
          this.soldiers.getLivingEnemyCount() <= 2
        ) {
          advance = true;
        }
      } else if (phase.type === 'bomber_storm') {
        if (
          !this.bombers.isActive() &&
          this.tanks.getLivingTankCount() === 0 &&
          this.soldiers.getLivingEnemyCount() === 0
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
          this.pendingSpawns.length === 0 &&
          this.soldiers.getLivingEnemyCount() <= 1
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
      interactPrompt: playerInteraction.interactPrompt,
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
      showControlsHint: this.missionElapsed < 18 && this.selectedMissionId === 0
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

    this.renderer.render(this.scene, this.camera);
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
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (raw) return JSON.parse(raw) as GameSettings;
    } catch {
      // Ignore
    }
    return {
      mouseSensitivity: 1.0,
      masterVolume: 0.75,
      quality: 'medium'
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
  }
}
