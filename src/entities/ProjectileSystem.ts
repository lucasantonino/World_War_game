import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { CoverSystem } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { VFXSystem } from './VFXSystem';

export interface BulletTracer {
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  maxAge: number;
  faction: 'ally' | 'enemy';
  damage: number;
  whizzed: boolean;
}

export interface RocketProjectile {
  mesh: THREE.Group;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  faction: 'ally' | 'enemy';
}

export interface GrenadeProjectile {
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  fuse: number;
  maxFuse: number;
  faction: 'ally' | 'enemy';
  bounces: number;
  isSmoke?: boolean;
  trailTimer?: number;
}

export interface FallingBomb {
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  velY: number;
  radius: number;
  damage: number;
  craterDepth: number;
  craterRadius: number;
}

export interface ImpactCallbacks {
  onHitEnemySoldier: (pos: THREE.Vector3, dir: THREE.Vector3, damage: number, isPlayerShot: boolean) => boolean;
  onHitAllySoldier: (pos: THREE.Vector3, dir: THREE.Vector3, damage: number) => boolean;
  onHitPlayer: (damage: number, origin: THREE.Vector3, cause: string, causeBleed: boolean) => void;
  onNearMissPlayer: (origin: THREE.Vector3) => void;
  onHitTank: (pos: THREE.Vector3, damage: number, isRocket: boolean) => boolean;
  onHitAllyTank?: (pos: THREE.Vector3, damage: number, isRocket: boolean) => boolean;
  onExplosion: (
    center: THREE.Vector3,
    radius: number,
    maxDamage: number,
    craterRadius: number,
    craterDepth: number,
    cause: string,
    isFromPlayer: boolean
  ) => void;
  onSmokeDetonate?: (pos: THREE.Vector3) => void;
}

export class ProjectileSystem {
  private scene: THREE.Scene;
  private terrain: Terrain;
  private cover: CoverSystem;
  private vfx: VFXSystem;
  private audio: AudioEngine;

  public tracers: BulletTracer[] = [];
  public rockets: RocketProjectile[] = [];
  public grenades: GrenadeProjectile[] = [];
  public bombs: FallingBomb[] = [];

  private tracerGeo = new THREE.BoxGeometry(0.032, 0.032, 1.35);
  private allyTracerMat = new THREE.MeshBasicMaterial({ color: 0xffe484 });
  private enemyTracerMat = new THREE.MeshBasicMaterial({ color: 0xff6238 });
  private grenadeGeo = new THREE.SphereGeometry(0.085, 8, 8);
  private grenadeMat = new THREE.MeshStandardMaterial({ color: 0x4b5739, roughness: 0.75 });
  private smokeGrenadeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.22, 8);
  private smokeGrenadeMat = new THREE.MeshStandardMaterial({
    color: 0x4b6344,
    metalness: 0.45,
    roughness: 0.45
  });
  private smokeBandGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.055, 8);
  private smokeBandMat = new THREE.MeshStandardMaterial({ color: 0xebeae4, roughness: 0.5 });
  private bombGeo = new THREE.CylinderGeometry(0.18, 0.24, 1.15, 8);
  private bombMat = new THREE.MeshStandardMaterial({ color: 0x262825, roughness: 0.6 });
  private tmpTrailVel = new THREE.Vector3(0, 0.35, 0);
  private tmpRocketTrailVel = new THREE.Vector3(0, 0.3, 0);
  private tmpPlayerHead = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpNegDir = new THREE.Vector3();
  private tmpNextPos = new THREE.Vector3();
  private tmpSamplePos = new THREE.Vector3();
  private tmpStep = new THREE.Vector3();
  private tmpAB = new THREE.Vector3();
  private tmpPA = new THREE.Vector3();
  private tmpProj = new THREE.Vector3();

  constructor(
    scene: THREE.Scene,
    terrain: Terrain,
    cover: CoverSystem,
    vfx: VFXSystem,
    audio: AudioEngine
  ) {
    this.scene = scene;
    this.terrain = terrain;
    this.cover = cover;
    this.vfx = vfx;
    this.audio = audio;
  }

  public clear(): void {
    for (const t of this.tracers) this.scene.remove(t.mesh);
    for (const r of this.rockets) this.scene.remove(r.mesh);
    for (const g of this.grenades) this.scene.remove(g.mesh);
    for (const b of this.bombs) this.scene.remove(b.mesh);
    this.tracers = [];
    this.rockets = [];
    this.grenades = [];
    this.bombs = [];
  }

  public spawnBullet(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    speed: number,
    damage: number,
    faction: 'ally' | 'enemy'
  ): void {
    const mesh = new THREE.Mesh(
      this.tracerGeo,
      faction === 'ally' ? this.allyTracerMat : this.enemyTracerMat
    );
    mesh.position.copy(origin);
    mesh.lookAt(origin.clone().add(dir));
    this.scene.add(mesh);

    this.tracers.push({
      mesh,
      pos: origin.clone(),
      vel: dir.clone().normalize().multiplyScalar(speed),
      age: 0,
      maxAge: 1.35,
      faction,
      damage,
      whizzed: false
    });
  }

  public spawnRocket(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    faction: 'ally' | 'enemy',
    speed = 44
  ): void {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.55, 8),
      new THREE.MeshStandardMaterial({ color: 0x454e37, roughness: 0.6 })
    );
    body.rotation.x = Math.PI * 0.5;
    g.add(body);
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffaa44 })
    );
    tip.position.z = 0.28;
    g.add(tip);

    g.position.copy(origin);
    this.tmpNextPos.copy(origin).add(dir);
    g.lookAt(this.tmpNextPos);
    this.scene.add(g);

    this.rockets.push({
      mesh: g,
      pos: origin.clone(),
      vel: dir.clone().normalize().multiplyScalar(speed),
      age: 0,
      faction
    });
  }

  public spawnGrenade(
    origin: THREE.Vector3,
    vel: THREE.Vector3,
    fuse: number,
    faction: 'ally' | 'enemy'
  ): void {
    const mesh = new THREE.Mesh(this.grenadeGeo, this.grenadeMat);
    mesh.position.copy(origin);
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.grenades.push({
      mesh,
      pos: origin.clone(),
      vel: vel.clone(),
      fuse,
      maxFuse: fuse,
      faction,
      bounces: 0
    });
  }

  public spawnSmokeGrenade(origin: THREE.Vector3, vel: THREE.Vector3, fuse = 1.35): void {
    const mesh = new THREE.Mesh(this.smokeGrenadeGeo, this.smokeGrenadeMat);
    const band = new THREE.Mesh(this.smokeBandGeo, this.smokeBandMat);
    mesh.add(band);
    mesh.position.copy(origin);
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.grenades.push({
      mesh,
      pos: origin.clone(),
      vel: vel.clone(),
      fuse,
      maxFuse: fuse,
      faction: 'ally',
      bounces: 0,
      isSmoke: true,
      trailTimer: 0
    });
  }

  public spawnFallingBomb(x: number, y: number, z: number, heavy: boolean): void {
    const mesh = new THREE.Mesh(this.bombGeo, this.bombMat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    this.bombs.push({
      mesh,
      pos: new THREE.Vector3(x, y, z),
      velY: -22,
      radius: heavy ? 9.5 : 7.0,
      damage: heavy ? 135 : 95,
      craterRadius: heavy ? 3.5 : 2.6,
      craterDepth: heavy ? 1.25 : 0.95
    });
  }

  public getNearestDangerGrenade(
    playerPos: THREE.Vector3,
    playerYaw: number
  ): { grenade: GrenadeProjectile; dist: number; angleRad: number; fuseProgress: number } | null {
    let best: GrenadeProjectile | null = null;
    let bestDist = 7.5;
    for (const g of this.grenades) {
      if (g.isSmoke) continue;
      const d = g.pos.distanceTo(playerPos);
      if (d < bestDist) {
        bestDist = d;
        best = g;
      }
    }
    if (!best) return null;

    const dx = best.pos.x - playerPos.x;
    const dz = best.pos.z - playerPos.z;
    const worldAngle = Math.atan2(dx, -dz);
    const angleRad = worldAngle + playerYaw;
    return {
      grenade: best,
      dist: bestDist,
      angleRad,
      fuseProgress: 1 - Math.max(0, best.fuse / best.maxFuse)
    };
  }

  public kickGrenade(g: GrenadeProjectile, dir: THREE.Vector3): void {
    g.vel.copy(dir).multiplyScalar(14);
    g.vel.y = 5.5;
    g.faction = 'ally';
    this.audio.playGrenadeBounce(1);
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerEyeY: number,
    callbacks: ImpactCallbacks,
    bleedChanceMult = 1.0
  ): void {
    this.tmpPlayerHead.set(playerPos.x, playerEyeY, playerPos.z);

    // 1. Bullets (sub-step raycasted)
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.age += dt;
      if (t.age >= t.maxAge) {
        this.scene.remove(t.mesh);
        this.tracers.splice(i, 1);
        continue;
      }

      const stepDist = t.vel.length() * dt;
      this.tmpDir.copy(t.vel).normalize();
      this.tmpNextPos.copy(t.pos).addScaledVector(this.tmpDir, stepDist);

      // Whiz check for enemy bullets passing close to player
      if (t.faction === 'enemy' && !t.whizzed) {
        const distToPlayer = this.pointSegmentDist(this.tmpPlayerHead, t.pos, this.tmpNextPos);
        if (distToPlayer < 2.2) {
          t.whizzed = true;
          callbacks.onNearMissPlayer(t.pos);
        }
      }

      // Check soldier/player/tank collision
      let consumed = false;
      const samples = 2;
      for (let s = 1; s <= samples; s++) {
        this.tmpSamplePos.copy(t.pos).lerp(this.tmpNextPos, s / samples);
        if (t.faction === 'ally') {
          if (callbacks.onHitEnemySoldier(this.tmpSamplePos, this.tmpDir, t.damage, true)) {
            consumed = true;
            break;
          }
          if (callbacks.onHitTank(this.tmpSamplePos, t.damage, false)) {
            this.tmpNegDir.copy(this.tmpDir).negate();
            this.vfx.spawnBulletImpact(this.tmpSamplePos, this.tmpNegDir, true);
            this.audio.playRicochet(0);
            consumed = true;
            break;
          }
        } else {
          if (callbacks.onHitAllyTank?.(this.tmpSamplePos, t.damage, false)) {
            this.tmpNegDir.copy(this.tmpDir).negate();
            this.vfx.spawnBulletImpact(this.tmpSamplePos, this.tmpNegDir, true);
            this.audio.playRicochet(0);
            consumed = true;
            break;
          }
          // Enemy bullet hitting player
          const playerHitDist = Math.hypot(this.tmpSamplePos.x - playerPos.x, this.tmpSamplePos.z - playerPos.z);
          const groundY = playerPos.y;
          if (playerHitDist < 0.38 && this.tmpSamplePos.y >= groundY + 0.15 && this.tmpSamplePos.y <= playerEyeY + 0.18) {
            callbacks.onHitPlayer(
              t.damage,
              t.pos,
              'Fogo cruzado inimigo sem cobertura',
              Math.random() < 0.24 * bleedChanceMult
            );
            consumed = true;
            break;
          }
          if (callbacks.onHitAllySoldier(this.tmpSamplePos, this.tmpDir, t.damage)) {
            consumed = true;
            break;
          }
        }
      }

      if (consumed) {
        this.scene.remove(t.mesh);
        this.tracers.splice(i, 1);
        continue;
      }

      // World / cover hit
      const worldHit = this.cover.raycastWorld(t.pos, this.tmpDir, stepDist, true);
      if (worldHit) {
        this.vfx.spawnBulletImpact(worldHit.point, worldHit.normal, false);
        if (worldHit.destructibleId) {
          this.cover.damageDestructible(worldHit.destructibleId, t.damage * 0.45);
        }
        this.scene.remove(t.mesh);
        this.tracers.splice(i, 1);
        continue;
      }

      t.pos.copy(this.tmpNextPos);
      t.mesh.position.copy(this.tmpNextPos);
    }

    // 2. Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.age += dt;
      const stepDist = r.vel.length() * dt;
      this.tmpDir.copy(r.vel).normalize();
      this.tmpNextPos.copy(r.pos).addScaledVector(this.tmpDir, stepDist);

      // Smoke trail
      this.vfx.spawnSprite(r.pos, this.tmpRocketTrailVel, 0xcac6be, 0.32, 0.95, 0.55, 0.55, 0);

      let impactedPoint: THREE.Vector3 | null = null;
      for (let s = 1; s <= 2; s++) {
        this.tmpSamplePos.copy(r.pos).lerp(this.tmpNextPos, s / 2);
        if (r.faction === 'ally') {
          if (
            callbacks.onHitTank(this.tmpSamplePos, 115, true) ||
            callbacks.onHitEnemySoldier(this.tmpSamplePos, this.tmpDir, 25, true)
          ) {
            impactedPoint = this.tmpSamplePos;
            break;
          }
        } else {
          if (
            callbacks.onHitAllyTank?.(this.tmpSamplePos, 115, true) ||
            callbacks.onHitAllySoldier(this.tmpSamplePos, this.tmpDir, 25)
          ) {
            impactedPoint = this.tmpSamplePos;
            break;
          }
        }
      }

      if (!impactedPoint) {
        const hit = this.cover.raycastWorld(r.pos, this.tmpDir, stepDist, true);
        if (hit) {
          impactedPoint = hit.point;
          if (hit.destructibleId) {
            this.cover.damageDestructible(hit.destructibleId, 240);
          }
        }
      }

      if (impactedPoint || r.age > 3.5) {
        const expPos = impactedPoint ? impactedPoint.clone() : this.tmpNextPos.clone();
        callbacks.onExplosion(
          expPos,
          5.8,
          115,
          2.2,
          0.75,
          'Explosão de foguete antitanque',
          r.faction === 'ally'
        );
        this.cover.addSmokeCloud(expPos.x, expPos.y, expPos.z, 3.5, 5.5);
        this.vfx.spawnPersistentSmokeScreen(expPos, 3.5, 5.5);
        this.scene.remove(r.mesh);
        this.rockets.splice(i, 1);
        continue;
      }

      r.pos.copy(this.tmpNextPos);
      r.mesh.position.copy(this.tmpNextPos);
    }

    // 3. Grenades
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i];
      g.fuse -= dt;
      g.vel.y -= 16.5 * dt;

      this.tmpStep.copy(g.vel).multiplyScalar(dt);
      this.tmpNextPos.copy(g.pos).add(this.tmpStep);

      // Bounce off terrain
      const groundH = this.terrain.getTerrainHeight(this.tmpNextPos.x, this.tmpNextPos.z);
      if (this.tmpNextPos.y <= groundH + 0.09) {
        this.tmpNextPos.y = groundH + 0.09;
        if (Math.abs(g.vel.y) > 1.8) {
          g.vel.y = Math.abs(g.vel.y) * 0.42;
          g.vel.x *= 0.62;
          g.vel.z *= 0.62;
          g.bounces++;
          if (g.bounces <= 3) {
            this.audio.playGrenadeBounce(g.pos.distanceTo(playerPos));
          }
        } else {
          g.vel.set(g.vel.x * 0.85, 0, g.vel.z * 0.85);
        }
      }

      g.pos.copy(this.tmpNextPos);
      g.mesh.position.copy(this.tmpNextPos);
      g.mesh.rotation.x += dt * 7;
      g.mesh.rotation.z += dt * 5;

      if (g.isSmoke) {
        g.trailTimer = (g.trailTimer ?? 0) + dt;
        if (g.trailTimer >= 0.045) {
          g.trailTimer = 0;
          this.vfx.spawnSprite(g.pos, this.tmpTrailVel, 0xe8ede6, 0.14, 0.48, 0.42, 0.48, 0);
        }
      }

      if (g.fuse <= 0) {
        if (g.isSmoke) {
          this.cover.addSmokeCloud(g.pos.x, g.pos.y, g.pos.z, 6.4, 15.0);
          this.vfx.spawnPersistentSmokeScreen(g.pos, 6.4, 15.0);
          callbacks.onSmokeDetonate?.(g.pos);
          const pan = Math.max(-1, Math.min(1, (g.pos.x - playerPos.x) / 20));
          this.audio.playExplosion(Math.max(10, g.pos.distanceTo(playerPos) + 8), 0.24, pan);
        } else {
          callbacks.onExplosion(
            g.pos,
            6.8,
            120,
            2.1,
            0.7,
            g.faction === 'enemy' ? 'Granada inimiga dentro da trincheira' : 'Sua própria granada explodiu perto demais',
            g.faction === 'ally'
          );
          this.cover.addSmokeCloud(g.pos.x, g.pos.y, g.pos.z, 3.6, 5.5);
          this.vfx.spawnPersistentSmokeScreen(g.pos, 3.6, 5.5);
        }
        this.scene.remove(g.mesh);
        this.grenades.splice(i, 1);
      }
    }

    // 4. Falling Aerial / Artillery Bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const b = this.bombs[i];
      b.velY -= 14 * dt;
      b.pos.y += b.velY * dt;
      b.mesh.position.copy(b.pos);

      const groundY = this.terrain.getTerrainHeight(b.pos.x, b.pos.z);
      if (b.pos.y <= groundY + 0.25) {
        b.pos.y = groundY;
        callbacks.onExplosion(
          b.pos,
          b.radius,
          b.damage,
          b.craterRadius,
          b.craterDepth,
          'Explosão de bomba aérea fora do abrigo',
          false
        );
        if (b.radius >= 7.0) {
          this.cover.addSmokeCloud(b.pos.x, b.pos.y, b.pos.z, 5.5, 9.0);
          this.vfx.spawnPersistentSmokeScreen(b.pos, 5.5, 9.0);
        } else if (b.radius >= 2.8) {
          this.cover.addSmokeCloud(b.pos.x, b.pos.y, b.pos.z, 3.5, 5.5);
          this.vfx.spawnPersistentSmokeScreen(b.pos, 3.5, 5.5);
        }
        this.scene.remove(b.mesh);
        this.bombs.splice(i, 1);
      }
    }
  }

  private pointSegmentDist(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): number {
    this.tmpAB.subVectors(b, a);
    const lenSq = this.tmpAB.lengthSq();
    if (lenSq < 1e-5) return p.distanceTo(a);
    this.tmpPA.subVectors(p, a);
    const t = Math.max(0, Math.min(1, this.tmpPA.dot(this.tmpAB) / lenSq));
    this.tmpProj.copy(a).addScaledVector(this.tmpAB, t);
    return p.distanceTo(this.tmpProj);
  }
}
