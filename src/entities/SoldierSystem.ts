import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { EmplacementSpec, SoldierRole } from '../types';
import { CoverSystem } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

export interface Soldier {
  id: number;
  faction: 'ally' | 'enemy';
  role: SoldierRole;
  group: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  torsoGroup: THREE.Group;
  muzzlePoint: THREE.Vector3;

  pos: THREE.Vector3;
  yaw: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  deathTimer: number;

  targetPos: THREE.Vector3;
  fireCooldown: number;
  grenadeCooldown: number;
  burstShotsLeft: number;
  firstShotGrace: number;
  walkPhase: number;
  isCrouching: boolean;
  emplaced: boolean;
}

export class SoldierSystem {
  private scene: THREE.Scene;
  private terrain: Terrain;
  private cover: CoverSystem;
  private projectiles: ProjectileSystem;
  private vfx: VFXSystem;
  private audio: AudioEngine;

  public soldiers: Soldier[] = [];
  private nextId = 1;

  // Shared geometries & materials
  private headGeo = new THREE.SphereGeometry(0.14, 8, 8);
  private helmetGeo = new THREE.SphereGeometry(0.165, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.56);
  private torsoGeo = new THREE.BoxGeometry(0.42, 0.54, 0.24);
  private legGeo = new THREE.BoxGeometry(0.15, 0.58, 0.16);
  private armGeo = new THREE.BoxGeometry(0.12, 0.42, 0.12);
  private rifleGeo = new THREE.BoxGeometry(0.06, 0.08, 0.78);

  private skinMat = new THREE.MeshStandardMaterial({ color: 0xc29b7c, roughness: 0.8 });
  private allyUniformMat = new THREE.MeshStandardMaterial({ color: 0x4b583b, roughness: 0.88 });
  private allyHelmetMat = new THREE.MeshStandardMaterial({ color: 0x3f4934, roughness: 0.65 });
  private enemyUniformMat = new THREE.MeshStandardMaterial({ color: 0x4d514f, roughness: 0.88 });
  private enemyHelmetMat = new THREE.MeshStandardMaterial({ color: 0x2f3332, roughness: 0.6 });
  private officerUniformMat = new THREE.MeshStandardMaterial({ color: 0x3b3e3c, roughness: 0.8 });
  private gunMat = new THREE.MeshStandardMaterial({ color: 0x222322, roughness: 0.5 });

  constructor(
    scene: THREE.Scene,
    terrain: Terrain,
    cover: CoverSystem,
    projectiles: ProjectileSystem,
    vfx: VFXSystem,
    audio: AudioEngine
  ) {
    this.scene = scene;
    this.terrain = terrain;
    this.cover = cover;
    this.projectiles = projectiles;
    this.vfx = vfx;
    this.audio = audio;
  }

  public clear(): void {
    for (const s of this.soldiers) {
      this.scene.remove(s.group);
    }
    this.soldiers = [];
  }

  public spawnAllies(count: number): void {
    const slots = [-24, -18, -11, -5, 3, 10, 17, 24];
    for (let i = 0; i < count; i++) {
      const x = slots[i % slots.length] + (Math.random() - 0.5) * 1.5;
      const z = 30.2 + (Math.abs(x) > 12 ? 1.5 : 0);
      this.spawnSoldier('ally', i % 3 === 0 ? 'assault' : 'rifleman', x, z, false);
    }
  }

  public spawnEmplacedGunners(emplacements: EmplacementSpec[]): void {
    for (const emp of emplacements) {
      if (emp.faction === 'enemy') {
        const s = this.spawnSoldier('enemy', 'mg_gunner', emp.x, emp.z, true);
        s.yaw = emp.yaw;
      }
    }
  }

  public spawnEnemySquad(count: number, roles: SoldierRole[], minZ = -40, maxZ = -26): void {
    for (let i = 0; i < count; i++) {
      const role = roles[i % roles.length];
      const x = (Math.random() - 0.5) * 60;
      const z = THREE.MathUtils.lerp(minZ, maxZ, Math.random());
      this.spawnSoldier('enemy', role, x, z, false);
    }
  }

  public spawnSoldier(
    faction: 'ally' | 'enemy',
    role: SoldierRole,
    x: number,
    z: number,
    emplaced: boolean
  ): Soldier {
    const y = this.terrain.getTerrainHeight(x, z);
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const uniform =
      faction === 'ally'
        ? this.allyUniformMat
        : role === 'officer'
          ? this.officerUniformMat
          : this.enemyUniformMat;
    const helmetMat = faction === 'ally' ? this.allyHelmetMat : this.enemyHelmetMat;

    const leftLeg = new THREE.Mesh(this.legGeo, uniform);
    leftLeg.position.set(-0.11, 0.29, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(this.legGeo, uniform);
    rightLeg.position.set(0.11, 0.29, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.85, 0);

    const torso = new THREE.Mesh(this.torsoGeo, uniform);
    torso.castShadow = true;
    torsoGroup.add(torso);

    const head = new THREE.Mesh(this.headGeo, this.skinMat);
    head.position.set(0, 0.4, 0);
    head.castShadow = true;
    torsoGroup.add(head);

    const helmet = new THREE.Mesh(this.helmetGeo, helmetMat);
    helmet.position.set(0, 0.43, 0);
    helmet.castShadow = true;
    torsoGroup.add(helmet);

    const leftArm = new THREE.Mesh(this.armGeo, uniform);
    leftArm.position.set(-0.26, 0.05, -0.14);
    leftArm.rotation.x = 1.1;
    torsoGroup.add(leftArm);

    const rightArm = new THREE.Mesh(this.armGeo, uniform);
    rightArm.position.set(0.24, 0.05, -0.16);
    rightArm.rotation.x = 1.2;
    torsoGroup.add(rightArm);

    const gun = new THREE.Mesh(this.rifleGeo, this.gunMat);
    gun.position.set(0.12, 0.06, -0.44);
    torsoGroup.add(gun);

    group.add(torsoGroup);
    this.scene.add(group);

    const hp = role === 'mg_gunner' ? 120 : role === 'officer' ? 115 : 85;
    const targetZ =
      faction === 'ally'
        ? z
        : role === 'grenadier'
          ? 12 + Math.random() * 6
          : 23 + Math.random() * 8;

    const soldier: Soldier = {
      id: this.nextId++,
      faction,
      role,
      group,
      leftLeg,
      rightLeg,
      torsoGroup,
      muzzlePoint: new THREE.Vector3(),
      pos: new THREE.Vector3(x, y, z),
      yaw: faction === 'ally' ? 0 : Math.PI,
      hp,
      maxHp: hp,
      alive: true,
      deathTimer: 0,
      targetPos: new THREE.Vector3(x * 0.72 + (Math.random() - 0.5) * 10, 0, targetZ),
      fireCooldown: 0.6 + Math.random() * 1.1,
      grenadeCooldown: 5 + Math.random() * 6,
      burstShotsLeft: 0,
      firstShotGrace: 0.35,
      walkPhase: Math.random() * Math.PI * 2,
      isCrouching: false,
      emplaced
    };

    this.soldiers.push(soldier);
    return soldier;
  }

  public getLivingEnemyCount(): number {
    let count = 0;
    for (const s of this.soldiers) {
      if (s.alive && s.faction === 'enemy') count++;
    }
    return count;
  }

  public checkBulletHit(
    factionTarget: 'ally' | 'enemy',
    point: THREE.Vector3,
    dir: THREE.Vector3,
    damage: number,
    onKill?: (s: Soldier, isHeadshot: boolean) => void
  ): { hit: boolean; headshot: boolean } {
    for (const s of this.soldiers) {
      if (!s.alive || s.faction !== factionTarget) continue;
      const dx = point.x - s.pos.x;
      const dz = point.z - s.pos.z;
      const distXZ = Math.hypot(dx, dz);
      if (distXZ > 0.44) continue;

      const bodyTop = s.pos.y + (s.isCrouching ? 1.1 : 1.56);
      if (point.y < s.pos.y + 0.05 || point.y > bodyTop) continue;

      const headLine = s.pos.y + (s.isCrouching ? 0.85 : 1.24);
      const isHeadshot = point.y >= headLine;
      const finalDmg = isHeadshot ? damage * 2.2 : damage;

      s.hp -= finalDmg;
      this.vfx.spawnSprite(point, dir.clone().multiplyScalar(1.2), 0x8a1c17, 0.25, 0.55, 0.25, 0.7);
      if (s.hp <= 0) {
        s.alive = false;
        s.deathTimer = 0;
        onKill?.(s, isHeadshot);
      }
      return { hit: true, headshot: isHeadshot };
    }
    return { hit: false, headshot: false };
  }

  public applyBlastDamage(
    center: THREE.Vector3,
    radius: number,
    maxDamage: number,
    fromPlayer: boolean,
    onKill?: (s: Soldier) => void
  ): void {
    for (const s of this.soldiers) {
      if (!s.alive) continue;
      const d = s.pos.distanceTo(center);
      if (d <= radius) {
        if (s.faction === 'ally' && fromPlayer) continue;
        const falloff = 1 - (d / radius) * 0.65;
        s.hp -= maxDamage * falloff;
        if (s.hp <= 0) {
          s.alive = false;
          s.deathTimer = 0;
          onKill?.(s);
        }
      }
    }
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerEyeY: number,
    playerExposure: number,
    airRaidActive: boolean,
    onRadioShout: (msg: string) => void
  ): void {
    const playerHead = new THREE.Vector3(playerPos.x, playerEyeY, playerPos.z);

    for (let i = this.soldiers.length - 1; i >= 0; i--) {
      const s = this.soldiers[i];

      if (!s.alive) {
        s.deathTimer += dt;
        const fallT = Math.min(1, s.deathTimer / 0.42);
        s.group.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 0.48, fallT);
        s.group.position.y = s.pos.y + 0.14 * (1 - fallT);
        if (s.deathTimer > 12) {
          this.scene.remove(s.group);
          this.soldiers.splice(i, 1);
        }
        continue;
      }

      if (s.faction === 'ally') {
        this.updateAlly(s, dt, airRaidActive);
      } else {
        this.updateEnemy(s, dt, playerPos, playerHead, playerExposure, onRadioShout);
      }
    }
  }

  private updateAlly(s: Soldier, dt: number, airRaidActive: boolean): void {
    // Allies crouch under air raid or artillery
    s.isCrouching = airRaidActive;
    s.torsoGroup.position.y = THREE.MathUtils.lerp(s.torsoGroup.position.y, s.isCrouching ? 0.56 : 0.85, dt * 8);

    // Find closest living enemy
    let targetEnemy: Soldier | null = null;
    let bestDist = 48;
    for (const other of this.soldiers) {
      if (other.alive && other.faction === 'enemy') {
        const d = other.pos.distanceTo(s.pos);
        if (d < bestDist) {
          bestDist = d;
          targetEnemy = other;
        }
      }
    }

    if (targetEnemy && !airRaidActive) {
      const dx = targetEnemy.pos.x - s.pos.x;
      const dz = targetEnemy.pos.z - s.pos.z;
      s.yaw = Math.atan2(-dx, -dz);
      s.group.rotation.y = s.yaw;

      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        s.fireCooldown = s.role === 'assault' ? 0.25 + Math.random() * 0.2 : 0.9 + Math.random() * 0.7;
        const origin = new THREE.Vector3(s.pos.x, s.pos.y + 1.25, s.pos.z);
        const aimTarget = new THREE.Vector3(
          targetEnemy.pos.x + (Math.random() - 0.5) * 1.1,
          targetEnemy.pos.y + 0.9 + (Math.random() - 0.5) * 0.6,
          targetEnemy.pos.z + (Math.random() - 0.5) * 1.1
        );
        const dir = aimTarget.sub(origin).normalize();
        this.projectiles.spawnBullet(origin, dir, 130, 26, 'ally');
      }
    }
  }

  private updateEnemy(
    s: Soldier,
    dt: number,
    playerPos: THREE.Vector3,
    playerHead: THREE.Vector3,
    playerExposure: number,
    onRadioShout: (msg: string) => void
  ): void {
    const enemyEye = new THREE.Vector3(s.pos.x, s.pos.y + 1.32, s.pos.z);
    const distToPlayer = s.pos.distanceTo(playerPos);
    const canSeePlayer =
      distToPlayer < 58 &&
      playerExposure > 0.28 &&
      this.cover.hasLineOfSight(enemyEye, playerHead);

    // Movement (non-emplaced)
    if (!s.emplaced) {
      const toTargetX = s.targetPos.x - s.pos.x;
      const toTargetZ = s.targetPos.z - s.pos.z;
      const distTarget = Math.hypot(toTargetX, toTargetZ);

      const shouldAdvance = distTarget > 1.8 && (!canSeePlayer || s.role === 'assault' || distToPlayer > 22);
      if (shouldAdvance) {
        const moveSpeed = s.role === 'assault' ? 3.55 : 2.75;
        const stepX = (toTargetX / distTarget) * moveSpeed * dt;
        const stepZ = (toTargetZ / distTarget) * moveSpeed * dt;
        s.pos.x += stepX;
        s.pos.z += stepZ;
        s.pos.y = this.terrain.getTerrainHeight(s.pos.x, s.pos.z);
        s.group.position.copy(s.pos);

        s.walkPhase += dt * moveSpeed * 3.1;
        s.leftLeg.rotation.x = Math.sin(s.walkPhase) * 0.55;
        s.rightLeg.rotation.x = -Math.sin(s.walkPhase) * 0.55;
      } else {
        s.leftLeg.rotation.x = 0;
        s.rightLeg.rotation.x = 0;
      }
    }

    // Aiming & Combat
    if (canSeePlayer) {
      const dx = playerPos.x - s.pos.x;
      const dz = playerPos.z - s.pos.z;
      s.yaw = Math.atan2(-dx, -dz);
      s.group.rotation.y = s.yaw;

      // Grenadier throws grenade into player trench
      if (s.role === 'grenadier' && distToPlayer > 11 && distToPlayer < 29) {
        s.grenadeCooldown -= dt;
        if (s.grenadeCooldown <= 0) {
          s.grenadeCooldown = 8.5 + Math.random() * 4;
          const throwVel = new THREE.Vector3(
            playerPos.x - s.pos.x,
            0,
            playerPos.z - s.pos.z
          );
          const horizDist = Math.max(1, throwVel.length());
          throwVel.normalize().multiplyScalar(Math.min(16, horizDist * 0.72));
          throwVel.y = 7.4;
          this.projectiles.spawnGrenade(enemyEye, throwVel, 3.3, 'enemy');
          onRadioShout('GRANADA NA TRINCHEIRA! SAIA OU CHUTE DE VOLTA [F]!');
        }
      }

      // First burst grace gives 0.35s warning crack before deadly focus when exposed
      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        if (s.role === 'mg_gunner') {
          s.fireCooldown = 0.11;
        } else if (s.role === 'assault') {
          s.fireCooldown = 0.16;
        } else {
          s.fireCooldown = 0.95 + Math.random() * 0.65;
        }

        const dir = new THREE.Vector3().subVectors(playerHead, enemyEye).normalize();
        // Exposed player gets laser-focused after warning; sheltered player receives suppressive spread
        const accuracyError =
          playerExposure > 0.65 && s.firstShotGrace <= 0
            ? 0.025
            : playerExposure > 0.38
              ? 0.065
              : 0.13;
        s.firstShotGrace = Math.max(0, s.firstShotGrace - 0.18);

        dir.x += (Math.random() - 0.5) * accuracyError;
        dir.y += (Math.random() - 0.5) * accuracyError;
        dir.z += (Math.random() - 0.5) * accuracyError;
        dir.normalize();

        const dmg = s.role === 'mg_gunner' ? 18 : s.role === 'rifleman' ? 24 : 15;
        this.projectiles.spawnBullet(enemyEye, dir, 118, dmg, 'enemy');

        const pan = Math.max(-1, Math.min(1, (s.pos.x - playerPos.x) / 28));
        if (Math.random() < 0.45) {
          this.audio.playGunshot(s.role === 'mg_gunner' ? 'mg' : 'rifle', distToPlayer, pan);
        }
      }
    } else {
      // Face toward ally trench and occasionally suppress allies
      s.yaw = Math.PI;
      s.group.rotation.y = s.yaw;
      s.firstShotGrace = 0.35;

      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        s.fireCooldown = s.role === 'mg_gunner' ? 0.26 : 1.7 + Math.random() * 1.4;
        const targetAlly = this.findRandomLivingAlly();
        if (targetAlly) {
          const dir = new THREE.Vector3()
            .subVectors(
              new THREE.Vector3(targetAlly.pos.x, targetAlly.pos.y + 1.0, targetAlly.pos.z),
              enemyEye
            )
            .normalize();
          dir.x += (Math.random() - 0.5) * 0.12;
          dir.y += (Math.random() - 0.5) * 0.09;
          dir.normalize();
          this.projectiles.spawnBullet(enemyEye, dir, 112, 16, 'enemy');
        }
      }
    }
  }

  private findRandomLivingAlly(): Soldier | null {
    const allies = this.soldiers.filter((s) => s.alive && s.faction === 'ally');
    if (allies.length === 0) return null;
    return allies[Math.floor(Math.random() * allies.length)];
  }
}
