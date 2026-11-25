import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { getDifficultyConfig } from '../engine/DifficultyConfig';
import { InputManager } from '../engine/InputManager';
import {
  CoverState,
  DamageIndicator,
  DifficultyModifier,
  InteractablePoint,
  PlayerCheckpointSnapshot,
  WeaponId
} from '../types';
import { CoverSystem } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { ProjectileSystem } from './ProjectileSystem';
import { WeaponViewModel } from './WeaponViewModel';

export interface WeaponStats {
  name: string;
  magSize: number;
  fireInterval: number;
  reloadTime: number;
  damage: number;
  spreadHip: number;
  spreadAds: number;
  recoilPitch: number;
  recoilYaw: number;
  automatic: boolean;
}

export const WEAPON_STATS: Record<WeaponId, WeaponStats> = {
  rifle: {
    name: 'Fuzil M-42',
    magSize: 8,
    fireInterval: 0.24,
    reloadTime: 1.85,
    damage: 78,
    spreadHip: 0.022,
    spreadAds: 0.0025,
    recoilPitch: 0.036,
    recoilYaw: 0.008,
    automatic: false
  },
  smg: {
    name: 'SMG-44',
    magSize: 30,
    fireInterval: 0.088,
    reloadTime: 2.05,
    damage: 34,
    spreadHip: 0.042,
    spreadAds: 0.012,
    recoilPitch: 0.016,
    recoilYaw: 0.01,
    automatic: true
  },
  bazooka: {
    name: 'Bazuca AT-43',
    magSize: 1,
    fireInterval: 0.6,
    reloadTime: 2.9,
    damage: 115,
    spreadHip: 0.015,
    spreadAds: 0.003,
    recoilPitch: 0.085,
    recoilYaw: 0.015,
    automatic: false
  },
  grenade: {
    name: 'Granada F-1',
    magSize: 1,
    fireInterval: 0.5,
    reloadTime: 0.5,
    damage: 120,
    spreadHip: 0,
    spreadAds: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    automatic: false
  }
};

export class PlayerController {
  public readonly camera: THREE.PerspectiveCamera;
  public readonly viewModel: WeaponViewModel;

  public pos = new THREE.Vector3(0, -1.05, 30);
  public yaw = 0;
  public pitch = 0;

  public hp = 100;
  public readonly maxHp = 100;
  public bleeding = false;
  public bandages = 3;
  public bandagingProgress = 0;

  public suppression = 0;
  public tinnitus = 0;
  public dustOverlay = 0;

  public coverState: CoverState = 'sheltered';
  public exposure = 0.1;
  public overheadProtected = false;
  public isCrouching = false;
  public isSprinting = false;
  public peekDanger = 0;
  public isRegenerating = false;
  private peekExposureTimer = 0;
  private timeSinceLastDamage = 99;

  public weaponId: WeaponId = 'rifle';
  public magAmmo: Record<WeaponId, number> = { rifle: 8, smg: 30, bazooka: 1, grenade: 1 };
  public reserveAmmo: Record<WeaponId, number> = { rifle: 56, smg: 150, bazooka: 5, grenade: 3 };
  public reloadingProgress = 0;
  private isReloading = false;
  private reloadTimer = 0;

  public adsFactor = 0;
  public mgMounted = false;
  public mgAnchorPos = new THREE.Vector3();
  public mgHeat = 0;
  public mgOverheated = false;

  public cookingGrenade = false;
  public cookTimer = 0;
  public smokeGrenades = 2;

  public lastDamageCause = 'Fogo cruzado inimigo';
  public damageIndicators: DamageIndicator[] = [];
  public shotsFired = 0;
  public shotsHit = 0;
  public hitMarkerTimer = 0;
  public hitMarkerCrit = false;

  private fireCooldown = 0;
  private leanCurrent = 0;
  private currentEyeOffset = 1.64;
  private footstepTimer = 0;
  private shakeIntensity = 0;
  private recoilOffsetPitch = 0;
  private recoilOffsetYaw = 0;
  private wireCutCooldown = 0;
  private nextDamageId = 1;

  private audio: AudioEngine;
  private input: InputManager;
  private terrain: Terrain;
  private cover: CoverSystem;
  private projectiles: ProjectileSystem;

  constructor(
    camera: THREE.PerspectiveCamera,
    audio: AudioEngine,
    input: InputManager,
    terrain: Terrain,
    cover: CoverSystem,
    projectiles: ProjectileSystem
  ) {
    this.camera = camera;
    this.audio = audio;
    this.input = input;
    this.terrain = terrain;
    this.cover = cover;
    this.projectiles = projectiles;
    this.viewModel = new WeaponViewModel();
    this.camera.add(this.viewModel.root);
  }

  public resetForMission(x: number, z: number, yaw: number): void {
    const y = this.terrain.getTerrainHeight(x, z);
    this.pos.set(x, y, z);
    this.yaw = yaw;
    this.pitch = 0;

    this.hp = 100;
    this.bleeding = false;
    this.bandages = 3;
    this.bandagingProgress = 0;
    this.suppression = 0;
    this.tinnitus = 0;
    this.dustOverlay = 0;

    this.isCrouching = false;
    this.isSprinting = false;
    this.currentEyeOffset = 1.64;
    this.leanCurrent = 0;
    this.peekDanger = 0;
    this.isRegenerating = false;
    this.peekExposureTimer = 0;
    this.timeSinceLastDamage = 99;

    this.weaponId = 'rifle';
    this.viewModel.setWeapon('rifle');
    this.magAmmo = { rifle: 8, smg: 30, bazooka: 1, grenade: 1 };
    this.reserveAmmo = { rifle: 56, smg: 150, bazooka: 5, grenade: 3 };
    this.isReloading = false;
    this.reloadingProgress = 0;
    this.fireCooldown = 0;
    this.adsFactor = 0;

    this.mgMounted = false;
    this.mgHeat = 0;
    this.mgOverheated = false;
    this.cookingGrenade = false;
    this.cookTimer = 0;
    this.smokeGrenades = 2;

    this.damageIndicators = [];
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.hitMarkerTimer = 0;
    this.shakeIntensity = 0;
    this.recoilOffsetPitch = 0;
    this.recoilOffsetYaw = 0;
    this.lastDamageCause = 'Fogo cruzado inimigo';
  }

  public captureCheckpointState(): PlayerCheckpointSnapshot {
    return {
      hp: this.hp,
      bandages: this.bandages,
      weaponId: this.weaponId,
      magAmmo: { ...this.magAmmo },
      reserveAmmo: { ...this.reserveAmmo },
      smokeGrenades: this.smokeGrenades
    };
  }

  public restoreFromCheckpoint(snap: PlayerCheckpointSnapshot, x: number, z: number, yaw: number): void {
    this.resetForMission(x, z, yaw);
    this.hp = Math.max(75, Math.min(this.maxHp, snap.hp));
    this.bandages = Math.max(2, snap.bandages);
    this.magAmmo = { ...snap.magAmmo };
    this.reserveAmmo = { ...snap.reserveAmmo };
    this.smokeGrenades = snap.smokeGrenades ?? 2;
    this.weaponId = snap.weaponId === 'grenade' && this.reserveAmmo.grenade <= 0 ? 'rifle' : snap.weaponId;
    this.viewModel.setWeapon(this.weaponId);
  }

  public getEyeY(): number {
    return this.pos.y + this.currentEyeOffset;
  }

  public addShake(amount: number): void {
    this.shakeIntensity = Math.min(1.0, this.shakeIntensity + amount);
  }

  public registerHitMarker(crit: boolean): void {
    this.shotsHit++;
    this.hitMarkerTimer = 0.16;
    this.hitMarkerCrit = crit;
    if (crit) {
      this.audio.playHeadshotPing();
    }
  }

  public applyDamage(
    amount: number,
    sourcePos: THREE.Vector3,
    cause: string,
    causeBleed: boolean,
    diffConfig?: DifficultyModifier
  ): void {
    if (this.hp <= 0) return;
    this.timeSinceLastDamage = 0;
    this.isRegenerating = false;

    const diffMult = diffConfig?.enemyDamageMult ?? 1;
    const peekMult = this.coverState === 'peeking' ? 0.62 + 0.38 * this.peekDanger : 1.0;
    const finalDamage = amount * diffMult * peekMult;

    this.hp = Math.max(0, this.hp - finalDamage);
    this.lastDamageCause = cause;
    if (causeBleed && this.hp > 0 && this.hp < 78) {
      this.bleeding = true;
    }
    this.addShake(Math.min(0.65, finalDamage / 45));

    const dx = sourcePos.x - this.pos.x;
    const dz = sourcePos.z - this.pos.z;
    const worldAngle = Math.atan2(dx, -dz);
    this.damageIndicators.push({
      id: this.nextDamageId++,
      angleRad: worldAngle + this.yaw,
      intensity: Math.min(1, finalDamage / 30),
      age: 0
    });
  }

  public applySuppression(amount: number): void {
    this.suppression = Math.min(1, this.suppression + amount);
  }

  public resupplyAmmo(): void {
    this.reserveAmmo.rifle = 64;
    this.reserveAmmo.smg = 180;
    this.reserveAmmo.bazooka = Math.max(this.reserveAmmo.bazooka, 6);
    this.reserveAmmo.grenade = Math.max(this.reserveAmmo.grenade, 4);
    if (this.smokeGrenades < 3) this.smokeGrenades = 3;
    this.audio.playReload();
  }

  public resupplyMedic(): void {
    this.bandages = Math.max(this.bandages, 3);
    this.hp = Math.min(this.maxHp, this.hp + 30);
    this.bleeding = false;
    this.audio.playUiClick();
  }

  public selectWeapon(id: WeaponId): void {
    if (this.mgMounted || this.bandagingProgress > 0 || this.cookingGrenade) return;
    this.switchWeapon(id);
  }

  public cycleWeapon(): void {
    if (this.mgMounted || this.bandagingProgress > 0 || this.cookingGrenade) return;
    const order: WeaponId[] = ['rifle', 'smg', 'bazooka', 'grenade'];
    const currentIdx = order.indexOf(this.weaponId);
    for (let offset = 1; offset <= order.length; offset++) {
      const nextId = order[(currentIdx + offset) % order.length];
      if (nextId === 'grenade' && this.reserveAmmo.grenade <= 0) continue;
      this.switchWeapon(nextId);
      return;
    }
  }

  public toggleCrouch(): void {
    if (!this.mgMounted) {
      this.isCrouching = !this.isCrouching;
    }
  }

  public update(
    dt: number,
    mouseSensitivity: number,
    interactables: InteractablePoint[],
    onActionTriggered: (kind: InteractablePoint['kind'], id: string) => void,
    diffConfig: DifficultyModifier = getDifficultyConfig('veteran'),
    findAutoAimTarget?: (origin: THREE.Vector3, lookDir: THREE.Vector3) => THREE.Vector3 | null
  ): {
    interactPrompt: string | null;
    actionProgress: number;
    actionLabel: string | null;
  } {
    this.timeSinceLastDamage += dt;

    // 1. Mouse look
    const { dx, dy } = this.input.consumeMouseDelta();
    const sens = 0.0021 * mouseSensitivity * (1 - this.adsFactor * 0.42);
    this.yaw -= dx * sens;
    this.pitch = Math.max(-1.42, Math.min(1.42, this.pitch - dy * sens));

    if (this.mgMounted) {
      // Clamp turret arc toward North (-Z)
      const relYaw = Math.atan2(Math.sin(this.yaw), Math.cos(this.yaw));
      this.yaw = Math.max(-1.05, Math.min(1.05, relYaw));
      this.pitch = Math.max(-0.45, Math.min(0.55, this.pitch));
    }

    // Recoil recovery
    this.recoilOffsetPitch = THREE.MathUtils.lerp(this.recoilOffsetPitch, 0, Math.min(1, dt * 8));
    this.recoilOffsetYaw = THREE.MathUtils.lerp(this.recoilOffsetYaw, 0, Math.min(1, dt * 8));
    this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 1.9);
    this.dustOverlay = Math.max(0, this.dustOverlay - dt * 0.42);
    this.tinnitus = Math.max(0, this.tinnitus - dt * 0.24);
    this.hitMarkerTimer = Math.max(0, this.hitMarkerTimer - dt);

    // Update damage directional arcs
    for (let i = this.damageIndicators.length - 1; i >= 0; i--) {
      this.damageIndicators[i].age += dt;
      if (this.damageIndicators[i].age > 1.35) {
        this.damageIndicators.splice(i, 1);
      }
    }

    // 2. Crouch & Sprint
    if (this.input.consumeKeyPress('KeyC') && !this.mgMounted) {
      this.isCrouching = !this.isCrouching;
    }

    const moveIn = this.input.getMovementInput();
    const forwardInput = moveIn.forward;
    const strafeInput = moveIn.strafe;
    const wantsMove = Math.abs(forwardInput) > 0.001 || Math.abs(strafeInput) > 0.001;

    // ADS (RMB)
    const wantsAds =
      this.input.isRightMouseDown() &&
      !this.isReloading &&
      !this.mgMounted &&
      this.weaponId !== 'grenade';
    this.adsFactor = THREE.MathUtils.lerp(this.adsFactor, wantsAds ? 1 : 0, Math.min(1, dt * 13));

    // Light touch auto-aim tracking when aiming or firing
    let currentAutoTarget: THREE.Vector3 | null = null;
    if (this.input.isTouchActive() && findAutoAimTarget) {
      const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
      currentAutoTarget = findAutoAimTarget(this.camera.position, lookDir);
      if (currentAutoTarget && (this.adsFactor > 0.25 || this.input.isLeftMouseDown()) && !this.mgMounted) {
        const dx = currentAutoTarget.x - this.camera.position.x;
        const dy = currentAutoTarget.y - this.camera.position.y;
        const dz = currentAutoTarget.z - this.camera.position.z;
        const targetYaw = Math.atan2(-dx, -dz);
        const targetPitch = Math.atan2(dy, Math.hypot(dx, dz));
        let yawDiff = targetYaw - this.yaw;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        const aimPull = Math.min(1, dt * 4.2);
        this.yaw += yawDiff * aimPull;
        this.pitch = Math.max(-1.42, Math.min(1.42, THREE.MathUtils.lerp(this.pitch, targetPitch, aimPull)));
      }
    }

    const wantsSprint =
      (moveIn.sprinting || this.input.isKeyDown('ShiftLeft')) &&
      wantsMove &&
      forwardInput > 0 &&
      !this.isCrouching &&
      !wantsAds &&
      !this.mgMounted &&
      this.bandagingProgress <= 0;
    this.isSprinting = wantsSprint;

    // Lean Q/E
    const leanTarget =
      this.mgMounted
        ? 0
        : (this.input.isKeyDown('KeyE') ? 1 : 0) - (this.input.isKeyDown('KeyQ') ? 1 : 0);
    this.leanCurrent = THREE.MathUtils.lerp(this.leanCurrent, leanTarget, Math.min(1, dt * 11));

    // 3. Cover Evaluation
    const targetEye = this.isCrouching ? 0.88 : 1.64;
    this.currentEyeOffset = THREE.MathUtils.lerp(this.currentEyeOffset, targetEye, Math.min(1, dt * 11));

    const coverEval = this.cover.evaluatePlayerCover(
      this.pos,
      this.getEyeY(),
      this.isCrouching,
      this.isSprinting
    );
    this.coverState = coverEval.state;
    this.exposure = coverEval.exposure;
    this.overheadProtected = coverEval.overheadProtected;

    // 4. Movement
    let speedRatio = 0;
    if (!this.mgMounted && wantsMove) {
      let speed = this.isSprinting ? 6.15 : this.isCrouching ? 2.45 : 4.25;
      if (this.adsFactor > 0.3) speed *= 0.65;
      if (this.bandagingProgress > 0) speed *= 0.45;
      if (coverEval.inWireHazard) {
        speed *= 0.45;
        this.wireCutCooldown -= dt;
        if (this.wireCutCooldown <= 0) {
          this.wireCutCooldown = 0.7;
          this.applyDamage(5, this.pos, 'Preso em arame farpado sob fogo inimigo', false);
        }
      }

      const sin = Math.sin(this.yaw);
      const cos = Math.cos(this.yaw);
      let moveX = (-sin * forwardInput + cos * strafeInput);
      let moveZ = (-cos * forwardInput - sin * strafeInput);
      const len = Math.hypot(moveX, moveZ);
      const inputMag = Math.min(1, Math.hypot(forwardInput, strafeInput));
      if (len > 0.001) {
        moveX = (moveX / len) * speed * inputMag * dt;
        moveZ = (moveZ / len) * speed * inputMag * dt;
      }

      const wantsMantle = this.input.isKeyDown('Space');
      const res = this.cover.resolvePlayerMovement(this.pos, moveX, moveZ, wantsMantle);
      this.pos.x = res.x;
      this.pos.y = THREE.MathUtils.lerp(this.pos.y, res.y, Math.min(1, dt * 18));
      this.pos.z = res.z;

      speedRatio = (speed * inputMag) / 6.15;
      this.footstepTimer -= dt * (this.isSprinting ? 1.4 : 1.0);
      if (this.footstepTimer <= 0) {
        this.footstepTimer = this.isCrouching ? 0.54 : 0.39;
        this.audio.playFootstep(this.terrain.isInsideTrenchOrDugout(this.pos.x, this.pos.z));
      }
    } else if (this.mgMounted) {
      this.pos.x = this.mgAnchorPos.x;
      this.pos.z = this.mgAnchorPos.z;
      this.pos.y = this.terrain.getTerrainHeight(this.pos.x, this.pos.z);
    }

    // 4b. Accumulated Exposure Time & Partial Cover Regeneration
    if (this.coverState === 'dugout' || this.coverState === 'sheltered') {
      this.peekExposureTimer = Math.max(0, this.peekExposureTimer - 1.9 * dt);
    } else if (this.coverState === 'peeking') {
      const leanFactor = Math.abs(this.leanCurrent) > 0.25 ? 0.72 : 1.0;
      this.peekExposureTimer = Math.min(
        diffConfig.peekLockTime,
        Math.max(0, this.peekExposureTimer + dt * leanFactor - speedRatio * 0.45 * dt)
      );
    } else {
      const rate = diffConfig.peekLockTime / Math.max(0.4, diffConfig.openLockTime);
      this.peekExposureTimer = Math.min(diffConfig.peekLockTime, this.peekExposureTimer + dt * rate);
    }
    this.peekDanger = Math.max(0, Math.min(1, this.peekExposureTimer / Math.max(0.5, diffConfig.peekLockTime)));

    if (
      this.hp > 0 &&
      this.hp < diffConfig.regenCapHp &&
      !this.bleeding &&
      this.timeSinceLastDamage >= diffConfig.regenDelaySec &&
      (this.coverState === 'dugout' || this.coverState === 'sheltered')
    ) {
      this.isRegenerating = true;
      this.hp = Math.min(diffConfig.regenCapHp, this.hp + diffConfig.regenRatePerSec * dt);
    } else {
      this.isRegenerating = false;
    }

    // 5. Suppression decay (fast in cover, slow in the open)
    const decay =
      this.coverState === 'dugout' || this.coverState === 'sheltered'
        ? 0.48
        : this.coverState === 'peeking'
          ? 0.2
          : 0.07;
    this.suppression = Math.max(0, this.suppression - decay * dt);

    // Bleeding drain
    if (this.bleeding) {
      this.hp -= 4.2 * dt;
      if (this.hp <= 0) {
        this.hp = 0;
        this.lastDamageCause = 'Hemorragia fatal sem aplicar curativo';
      }
    }

    // 6. Bandaging [H]
    let actionProgress = 0;
    let actionLabel: string | null = null;

    if (
      this.input.isKeyDown('KeyH') &&
      this.bandages > 0 &&
      (this.bleeding || this.hp < 95) &&
      !this.isSprinting &&
      !this.mgMounted
    ) {
      this.bandagingProgress += dt / 2.0;
      actionProgress = Math.min(1, this.bandagingProgress);
      actionLabel = 'APLICANDO CURATIVO...';
      if (this.bandagingProgress >= 1) {
        this.bandagingProgress = 0;
        this.bandages--;
        this.bleeding = false;
        this.hp = Math.min(this.maxHp, this.hp + 38);
        this.audio.playUiClick();
      }
    } else {
      this.bandagingProgress = 0;
    }

    // 7. Weapon switching & Reloading
    if (!this.mgMounted && this.bandagingProgress <= 0 && !this.cookingGrenade) {
      if (this.input.consumeKeyPress('Digit1')) this.switchWeapon('rifle');
      else if (this.input.consumeKeyPress('Digit2')) this.switchWeapon('smg');
      else if (this.input.consumeKeyPress('Digit3')) this.switchWeapon('bazooka');
      else if (this.input.consumeKeyPress('Digit4')) this.switchWeapon('grenade');

      if (this.input.consumeKeyPress('KeyX') || this.input.consumeKeyPress('Digit5')) {
        this.throwSmokeGrenade();
      }

      if (this.input.consumeKeyPress('KeyR')) {
        this.startReload();
      }
    }

    if (this.isReloading) {
      const dur = WEAPON_STATS[this.weaponId].reloadTime;
      this.reloadTimer += dt;
      this.reloadingProgress = Math.min(1, this.reloadTimer / dur);
      if (this.reloadTimer >= dur) {
        this.finishReload();
      }
    } else {
      this.reloadingProgress = 0;
    }

    // 8. Quick Grenade [G] or Armed Grenade [LMB]
    this.handleGrenadeInput(dt);

    // 9. Firing Weapons or Mounted Heavy MG
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    this.mgHeat = Math.max(0, this.mgHeat - dt * (this.mgOverheated ? 0.28 : 0.34));
    if (this.mgOverheated && this.mgHeat <= 0.15) {
      this.mgOverheated = false;
    }

    if (this.mgMounted) {
      if (this.input.isLeftMouseDown() && !this.mgOverheated && this.fireCooldown <= 0) {
        this.fireMountedMG(currentAutoTarget);
      }
    } else if (
      this.weaponId !== 'grenade' &&
      !this.isReloading &&
      this.bandagingProgress <= 0 &&
      !this.cookingGrenade
    ) {
      const stats = WEAPON_STATS[this.weaponId];
      const wantsFire = stats.automatic
        ? this.input.isLeftMouseDown()
        : this.input.consumeLeftMouseClick();

      if (wantsFire && this.fireCooldown <= 0) {
        if (this.magAmmo[this.weaponId] > 0) {
          this.fireActiveWeapon(currentAutoTarget);
        } else if (this.reserveAmmo[this.weaponId] > 0) {
          this.startReload();
        }
      }
    }

    // 10. Contextual Interactions [F]
    let interactPrompt: string | null = null;
    const dangerGrenade = this.projectiles.getNearestDangerGrenade(this.pos, this.yaw);
    if (dangerGrenade && dangerGrenade.dist < 2.65 && dangerGrenade.grenade.faction === 'enemy') {
      interactPrompt = '[F] Chutar Granada de Volta!';
      if (this.input.consumeKeyPress('KeyF')) {
        const throwDir = new THREE.Vector3(-Math.sin(this.yaw), 0.25, -Math.cos(this.yaw)).normalize();
        this.projectiles.kickGrenade(dangerGrenade.grenade, throwDir);
      }
    } else if (this.mgMounted) {
      interactPrompt = '[F] Sair da Metralhadora Pesada';
      if (this.input.consumeKeyPress('KeyF')) {
        this.mgMounted = false;
      }
    } else {
      let bestInter: InteractablePoint | null = null;
      let bestDist = Infinity;
      for (const inter of interactables) {
        if (!inter.active) continue;
        const d = Math.hypot(inter.x - this.pos.x, inter.z - this.pos.z);
        if (d <= inter.radius && d < bestDist) {
          bestDist = d;
          bestInter = inter;
        }
      }
      if (bestInter) {
        interactPrompt = bestInter.label;
        if (this.input.consumeKeyPress('KeyF')) {
          if (bestInter.kind === 'ammo_crate') {
            this.resupplyAmmo();
          } else if (bestInter.kind === 'medic_crate') {
            this.resupplyMedic();
          } else if (bestInter.kind === 'mg_mount') {
            this.mgMounted = true;
            this.isCrouching = false;
            this.mgAnchorPos.set(bestInter.x, this.pos.y, bestInter.z);
            this.yaw = 0;
          }
          onActionTriggered(bestInter.kind, bestInter.id);
        }
      }
    }

    // 11. Update Camera & ViewModel transforms
    const targetFov = this.adsFactor > 0 ? THREE.MathUtils.lerp(72, 46, this.adsFactor) : 72;
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = targetFov;
      this.camera.updateProjectionMatrix();
    }

    const leanOffsetX = Math.cos(this.yaw) * this.leanCurrent * 0.42;
    const leanOffsetZ = -Math.sin(this.yaw) * this.leanCurrent * 0.42;
    const shakeAmt = this.shakeIntensity * 0.045 + this.suppression * 0.008;
    const sx = (Math.random() - 0.5) * shakeAmt;
    const sy = (Math.random() - 0.5) * shakeAmt;

    this.camera.position.set(
      this.pos.x + leanOffsetX + sx,
      this.getEyeY() + sy,
      this.pos.z + leanOffsetZ
    );

    const euler = new THREE.Euler(
      this.pitch + this.recoilOffsetPitch,
      this.yaw + this.recoilOffsetYaw,
      -this.leanCurrent * 0.14,
      'YXZ'
    );
    this.camera.quaternion.setFromEuler(euler);

    this.viewModel.update(
      dt,
      this.adsFactor,
      speedRatio,
      this.reloadingProgress,
      this.bandagingProgress > 0,
      this.cookingGrenade ? Math.min(1, this.cookTimer / 3.2) : 0,
      this.mgMounted
    );

    return { interactPrompt, actionProgress, actionLabel };
  }

  private switchWeapon(id: WeaponId): void {
    if (this.weaponId === id) return;
    if (id === 'grenade' && this.reserveAmmo.grenade <= 0) return;
    this.weaponId = id;
    this.isReloading = false;
    this.reloadingProgress = 0;
    this.viewModel.setWeapon(id);
    this.audio.playUiClick();
  }

  private startReload(): void {
    if (this.isReloading || this.weaponId === 'grenade') return;
    const cap = WEAPON_STATS[this.weaponId].magSize;
    if (this.magAmmo[this.weaponId] >= cap || this.reserveAmmo[this.weaponId] <= 0) return;
    this.isReloading = true;
    this.reloadTimer = 0;
    this.audio.playReload();
  }

  private finishReload(): void {
    const cap = WEAPON_STATS[this.weaponId].magSize;
    const needed = cap - this.magAmmo[this.weaponId];
    const take = Math.min(needed, this.reserveAmmo[this.weaponId]);
    this.magAmmo[this.weaponId] += take;
    this.reserveAmmo[this.weaponId] -= take;
    this.isReloading = false;
    this.reloadTimer = 0;
  }

  private handleGrenadeInput(dt: number): void {
    const quickPress = this.input.isKeyDown('KeyG');
    const armedLmb = this.weaponId === 'grenade' && this.input.isLeftMouseDown();

    if ((quickPress || armedLmb) && !this.cookingGrenade && this.reserveAmmo.grenade > 0 && !this.mgMounted) {
      this.cookingGrenade = true;
      this.cookTimer = 0;
    }

    if (this.cookingGrenade) {
      this.cookTimer += dt;
      const shouldRelease = (!quickPress && !armedLmb) || this.cookTimer >= 3.15;
      if (shouldRelease) {
        const fuseLeft = Math.max(0.25, 3.2 - this.cookTimer);
        this.throwGrenade(fuseLeft);
        this.cookingGrenade = false;
        this.cookTimer = 0;
        if (this.weaponId === 'grenade' && this.reserveAmmo.grenade <= 0) {
          this.switchWeapon('rifle');
        }
      }
    }
  }

  private throwGrenade(fuse: number): void {
    if (this.reserveAmmo.grenade <= 0) return;
    this.reserveAmmo.grenade--;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
    dir.y += 0.24;
    dir.normalize();
    const origin = this.camera.position.clone().addScaledVector(dir, 0.45);
    this.projectiles.spawnGrenade(origin, dir.multiplyScalar(17.5), fuse, 'ally');
  }

  public throwSmokeGrenade(): boolean {
    if (
      this.hp <= 0 ||
      this.mgMounted ||
      this.isReloading ||
      this.bandagingProgress > 0 ||
      this.cookingGrenade ||
      this.smokeGrenades <= 0
    ) {
      return false;
    }

    this.smokeGrenades--;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
    dir.y += 0.22;
    dir.normalize();
    const origin = this.camera.position.clone().addScaledVector(dir, 0.45);
    const vel = dir.multiplyScalar(16.5);
    this.projectiles.spawnSmokeGrenade(origin, vel, 1.3);
    this.fireCooldown = Math.max(this.fireCooldown, 0.25);
    this.audio.playUiClick();
    this.viewModel.triggerFire(0.05, 0.04, false);
    return true;
  }

  private applyTouchAutoAimToDir(dir: THREE.Vector3, autoTarget: THREE.Vector3 | null): void {
    if (!this.input.isTouchActive() || !autoTarget) return;
    const toTarget = autoTarget.clone().sub(this.camera.position);
    if (toTarget.lengthSq() <= 0.0001) return;
    toTarget.normalize();
    dir.lerp(toTarget, 0.42).normalize();
  }

  private fireActiveWeapon(autoTarget: THREE.Vector3 | null = null): void {
    const stats = WEAPON_STATS[this.weaponId];
    this.magAmmo[this.weaponId]--;
    this.fireCooldown = stats.fireInterval;
    this.shotsFired++;

    const spreadBase = THREE.MathUtils.lerp(stats.spreadHip, stats.spreadAds, this.adsFactor);
    const spread = spreadBase * (1 + this.suppression * 1.4);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    if (this.weaponId !== 'grenade') {
      this.applyTouchAutoAimToDir(dir, autoTarget);
    }
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.z += (Math.random() - 0.5) * spread;
    dir.normalize();

    const origin = this.camera.position.clone().addScaledVector(dir, 0.48);

    if (this.weaponId === 'bazooka') {
      this.projectiles.spawnRocket(origin, dir, 'ally');
      this.audio.playGunshot('bazooka', 0, 0);
      this.viewModel.triggerFire(0.11, 0.14, true);
      this.addShake(0.35);
    } else {
      this.projectiles.spawnBullet(origin, dir, 145, stats.damage, 'ally');
      this.audio.playGunshot(this.weaponId === 'rifle' ? 'rifle' : 'smg', 0, 0);
      this.viewModel.triggerFire(
        this.weaponId === 'rifle' ? 0.08 : 0.036,
        this.weaponId === 'rifle' ? 0.095 : 0.04,
        true
      );
      if (this.weaponId === 'rifle' && this.magAmmo.rifle === 0) {
        setTimeout(() => this.audio.playGarandPing(), 90);
      }
    }

    this.recoilOffsetPitch += stats.recoilPitch * (1 - this.adsFactor * 0.22);
    this.recoilOffsetYaw += (Math.random() - 0.5) * stats.recoilYaw;
  }

  private fireMountedMG(autoTarget: THREE.Vector3 | null = null): void {
    this.fireCooldown = 0.085;
    this.shotsFired++;
    this.mgHeat = Math.min(1, this.mgHeat + 0.042);
    if (this.mgHeat >= 1) {
      this.mgOverheated = true;
    }

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.applyTouchAutoAimToDir(dir, autoTarget);
    dir.x += (Math.random() - 0.5) * 0.024;
    dir.y += (Math.random() - 0.5) * 0.024;
    dir.normalize();

    const origin = this.camera.position.clone().addScaledVector(dir, 0.7);
    this.projectiles.spawnBullet(origin, dir, 155, 52, 'ally');
    this.audio.playGunshot('mg', 0, 0);
    this.recoilOffsetPitch += 0.014;
    this.recoilOffsetYaw += (Math.random() - 0.5) * 0.012;
  }
}
