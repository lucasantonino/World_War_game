import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { getDifficultyConfig } from '../engine/DifficultyConfig';
import { getProceduralTextures } from '../engine/Textures';
import { DifficultyModifier } from '../types';
import { CoverSystem, TankHullCollider } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

export interface TankEntity {
  id: string;
  heavy: boolean;
  root: THREE.Group;
  hull: THREE.Group;
  turret: THREE.Group;
  barrel: THREE.Mesh;
  smokeAnchor: THREE.Vector3;

  pos: THREE.Vector3;
  hullYaw: number;
  turretYaw: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  waypoints: Array<{ x: number; z: number }>;
  waypointIndex: number;

  cannonCooldown: number;
  mgCooldown: number;
  mgBurstCount: number;
  barrelRecoil: number;
  smokeTimer: number;
}

export class TankSystem {
  private scene: THREE.Scene;
  private terrain: Terrain;
  private cover: CoverSystem;
  private projectiles: ProjectileSystem;
  private vfx: VFXSystem;
  private audio: AudioEngine;

  public tanks: TankEntity[] = [];
  private nextId = 1;

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
    for (const t of this.tanks) {
      this.scene.remove(t.root);
    }
    this.tanks = [];
    this.cover.setTankHulls([]);
  }

  public spawnTank(
    x: number,
    z: number,
    heavy: boolean,
    waypoints: Array<{ x: number; z: number }>
  ): TankEntity {
    const tex = getProceduralTextures();
    const steelMat = new THREE.MeshStandardMaterial({
      map: tex.armorSteel,
      color: heavy ? 0x5c6158 : 0x676b5e,
      roughness: 0.58,
      metalness: 0.48
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x353833,
      roughness: 0.52,
      metalness: 0.62
    });
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1d1e1c,
      roughness: 0.9,
      metalness: 0.35
    });
    const rearGrilleMat = new THREE.MeshStandardMaterial({
      color: 0x7a2b22,
      roughness: 0.7
    });
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfff1c4,
      emissive: 0xffe29a,
      emissiveIntensity: 1.15,
      roughness: 0.25
    });

    const scale = heavy ? 1.18 : 0.96;
    const root = new THREE.Group();
    const hull = new THREE.Group();
    root.add(hull);

    // Main armored hull
    const hullBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.7 * scale, 1.05 * scale, 4.9 * scale),
      steelMat
    );
    hullBody.position.y = 0.85 * scale;
    hullBody.castShadow = true;
    hullBody.receiveShadow = true;
    hull.add(hullBody);

    // Sloped front glacis
    const glacis = new THREE.Mesh(
      new THREE.BoxGeometry(2.55 * scale, 0.72 * scale, 1.15 * scale),
      steelMat
    );
    glacis.position.set(0, 0.75 * scale, -2.5 * scale);
    glacis.rotation.x = 0.52;
    glacis.castShadow = true;
    hull.add(glacis);

    // Driver visor slit & bow MG housing (no insignia)
    const driverVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.62 * scale, 0.14 * scale, 0.22 * scale),
      darkSteelMat
    );
    driverVisor.position.set(-0.55 * scale, 1.18 * scale, -2.38 * scale);
    hull.add(driverVisor);

    // Front headlight (small emissive mesh, no PointLight)
    const headlightHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13 * scale, 0.14 * scale, 0.22 * scale, 8),
      darkSteelMat
    );
    headlightHousing.rotation.x = Math.PI * 0.5;
    headlightHousing.position.set(0.88 * scale, 1.16 * scale, -2.42 * scale);
    hull.add(headlightHousing);

    const headlightLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105 * scale, 0.105 * scale, 0.04 * scale, 8),
      headlightMat
    );
    headlightLens.rotation.x = Math.PI * 0.5;
    headlightLens.position.set(0.88 * scale, 1.16 * scale, -2.54 * scale);
    hull.add(headlightLens);

    // Rear engine weakspot grille (facing away from front)
    const rearGrille = new THREE.Mesh(
      new THREE.BoxGeometry(1.7 * scale, 0.45 * scale, 0.25 * scale),
      rearGrilleMat
    );
    rearGrille.position.set(0, 1.05 * scale, 2.46 * scale);
    hull.add(rearGrille);

    // Rear auxiliary fuel drum + twin armored exhaust pipes
    const auxFuelTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24 * scale, 0.24 * scale, 1.55 * scale, 10),
      darkSteelMat
    );
    auxFuelTank.rotation.z = Math.PI * 0.5;
    auxFuelTank.position.set(0, 1.44 * scale, 2.15 * scale);
    auxFuelTank.castShadow = true;
    hull.add(auxFuelTank);

    for (const side of [-1, 1]) {
      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.095 * scale, 0.65 * scale, 8),
        darkSteelMat
      );
      exhaust.position.set(side * 1.02 * scale, 1.18 * scale, 2.52 * scale);
      exhaust.rotation.x = -0.18;
      hull.add(exhaust);

      // Rear stowage box on hull sponson
      const stowageBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.42 * scale, 0.34 * scale, 1.1 * scale),
        steelMat
      );
      stowageBox.position.set(side * 1.38 * scale, 1.34 * scale, 1.45 * scale);
      stowageBox.castShadow = true;
      hull.add(stowageBox);
    }

    // Left & right tracks, road wheels & armored side skirts
    const roadWheelGeo = new THREE.CylinderGeometry(0.29 * scale, 0.29 * scale, 0.22 * scale, 10);
    const hubGeo = new THREE.CylinderGeometry(0.11 * scale, 0.11 * scale, 0.26 * scale, 8);
    const wheelZPositions = [-2.15, -1.32, -0.45, 0.42, 1.29, 2.15];

    for (const side of [-1, 1]) {
      const track = new THREE.Mesh(
        new THREE.BoxGeometry(0.62 * scale, 0.86 * scale, 5.25 * scale),
        trackMat
      );
      track.position.set(side * 1.52 * scale, 0.50 * scale, 0);
      track.castShadow = true;
      hull.add(track);

      // Armored side skirts shielding upper tracks
      const sideSkirt = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.48 * scale, 4.95 * scale),
        steelMat
      );
      sideSkirt.position.set(side * 1.84 * scale, 0.88 * scale, 0);
      sideSkirt.castShadow = true;
      hull.add(sideSkirt);

      // Lower road wheels + idler/drive sprocket hubs
      for (const wz of wheelZPositions) {
        const wheel = new THREE.Mesh(roadWheelGeo, darkSteelMat);
        wheel.rotation.z = Math.PI * 0.5;
        wheel.position.set(side * 1.78 * scale, 0.33 * scale, wz * scale);
        hull.add(wheel);

        const hub = new THREE.Mesh(hubGeo, steelMat);
        hub.rotation.z = Math.PI * 0.5;
        hub.position.set(side * 1.79 * scale, 0.33 * scale, wz * scale);
        hull.add(hub);
      }
    }

    // Turret
    const turret = new THREE.Group();
    turret.position.set(0, 1.55 * scale, -0.15 * scale);

    const turretBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.95 * scale, 0.82 * scale, 2.3 * scale),
      steelMat
    );
    turretBody.castShadow = true;
    turret.add(turretBody);

    // Turret rear bustle stowage box
    const turretBustle = new THREE.Mesh(
      new THREE.BoxGeometry(1.52 * scale, 0.56 * scale, 0.62 * scale),
      darkSteelMat
    );
    turretBustle.position.set(0, 0.04 * scale, 1.38 * scale);
    turretBustle.castShadow = true;
    turret.add(turretBustle);

    // Gun mantlet (armored collar at turret front)
    const mantlet = new THREE.Mesh(
      new THREE.BoxGeometry(0.92 * scale, 0.54 * scale, 0.42 * scale),
      darkSteelMat
    );
    mantlet.position.set(0, 0.04 * scale, -1.22 * scale);
    mantlet.castShadow = true;
    turret.add(mantlet);

    // Commander cupola + raised hatch + periscope blocks
    const cupola = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38 * scale, 0.42 * scale, 0.28 * scale, 10),
      steelMat
    );
    cupola.position.set(-0.3 * scale, 0.5 * scale, 0.2 * scale);
    turret.add(cupola);

    const cupolaHatch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32 * scale, 0.34 * scale, 0.08 * scale, 10),
      darkSteelMat
    );
    cupolaHatch.position.set(-0.3 * scale, 0.66 * scale, 0.2 * scale);
    turret.add(cupolaHatch);

    const periscope = new THREE.Mesh(
      new THREE.BoxGeometry(0.22 * scale, 0.11 * scale, 0.16 * scale),
      darkSteelMat
    );
    periscope.position.set(-0.3 * scale, 0.72 * scale, 0.05 * scale);
    turret.add(periscope);

    // Main cannon barrel + muzzle brake (parented to barrel so it recoils together)
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11 * scale, 0.14 * scale, 3.1 * scale, 10),
      steelMat
    );
    barrel.rotation.x = Math.PI * 0.5;
    barrel.position.set(0, 0.05 * scale, -2.1 * scale);
    barrel.castShadow = true;

    const muzzleBrake = new THREE.Mesh(
      new THREE.BoxGeometry(0.34 * scale, 0.38 * scale, 0.26 * scale),
      darkSteelMat
    );
    // In barrel local space (rotated +PI/2 around X), -Y points toward the front muzzle
    muzzleBrake.position.set(0, -1.56 * scale, 0);
    barrel.add(muzzleBrake);

    turret.add(barrel);

    hull.add(turret);

    const y = this.terrain.getTerrainHeight(x, z);
    root.position.set(x, y, z);
    this.scene.add(root);

    const maxHp = heavy ? 130 : 100;
    const tank: TankEntity = {
      id: `tank_${this.nextId++}`,
      heavy,
      root,
      hull,
      turret,
      barrel,
      smokeAnchor: new THREE.Vector3(),
      pos: new THREE.Vector3(x, y, z),
      hullYaw: Math.PI, // Facing south (+Z) toward player trench
      turretYaw: Math.PI,
      hp: maxHp,
      maxHp,
      destroyed: false,
      waypoints,
      waypointIndex: 0,
      cannonCooldown: 3.5,
      mgCooldown: 0.4,
      mgBurstCount: 0,
      barrelRecoil: 0,
      smokeTimer: 0
    };

    this.tanks.push(tank);
    this.syncHullColliders();
    return tank;
  }

  public getLivingTankCount(): number {
    return this.tanks.filter((t) => !t.destroyed).length;
  }

  public getNearestTankDistance(pos: THREE.Vector3): number {
    let min = Infinity;
    for (const t of this.tanks) {
      if (!t.destroyed) {
        const d = t.pos.distanceTo(pos);
        if (d < min) min = d;
      }
    }
    return min;
  }

  public checkProjectileHit(
    point: THREE.Vector3,
    isRocket: boolean,
    onDestroyed?: (t: TankEntity) => void
  ): boolean {
    for (const t of this.tanks) {
      const scale = t.heavy ? 1.18 : 0.96;
      const dx = point.x - t.pos.x;
      const dz = point.z - t.pos.z;
      const distXZ = Math.hypot(dx, dz);
      if (distXZ > 2.55 * scale) continue;
      if (point.y < t.pos.y || point.y > t.pos.y + 2.6 * scale) continue;

      if (!isRocket) {
        // Small arms ricochet off armor
        return true;
      }

      if (t.destroyed) return true;

      // Determine directional armor damage (rear = 100, flank = 70, front = 48)
      const fwdX = -Math.sin(t.hullYaw);
      const fwdZ = -Math.cos(t.hullYaw);
      const toHit = new THREE.Vector2(dx, dz).normalize();
      const dot = fwdX * toHit.x + fwdZ * toHit.y;

      let dmg = 70;
      if (dot > 0.45) {
        dmg = 48; // Thick front glacis
      } else if (dot < -0.45) {
        dmg = 110; // Exposed rear engine grille
      }

      t.hp -= dmg;
      if (t.hp <= 0) {
        this.destroyTank(t);
        onDestroyed?.(t);
      }
      return true;
    }
    return false;
  }

  public applyBlastDamage(
    center: THREE.Vector3,
    radius: number,
    maxDamage: number,
    onDestroyed?: (t: TankEntity) => void
  ): void {
    for (const t of this.tanks) {
      if (t.destroyed) continue;
      const d = t.pos.distanceTo(center);
      if (d <= radius) {
        const dmg = maxDamage * (1 - (d / radius) * 0.5);
        t.hp -= dmg;
        if (t.hp <= 0) {
          this.destroyTank(t);
          onDestroyed?.(t);
        }
      }
    }
  }

  private destroyTank(t: TankEntity): void {
    t.destroyed = true;
    t.hp = 0;
    t.turret.rotation.z = 0.24;
    t.turret.position.y += 0.22;
    t.hull.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.color) {
          mat.color.setHex(0x211f1d);
          mat.emissive?.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    });
    this.vfx.spawnExplosion(t.pos, 1.9);
    this.audio.playExplosion(12, 1.35, 0);
  }

  private syncHullColliders(): void {
    const hulls: TankHullCollider[] = this.tanks.map((t) => {
      const scale = t.heavy ? 1.18 : 0.96;
      return {
        id: t.id,
        x: t.pos.x,
        y: t.pos.y,
        z: t.pos.z,
        halfW: 1.85 * scale,
        halfH: 1.5 * scale,
        halfL: 2.6 * scale,
        yaw: t.hullYaw
      };
    });
    this.cover.setTankHulls(hulls);
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerEyeY: number,
    playerExposure: number,
    onExplosion: (center: THREE.Vector3, radius: number, maxDmg: number, craterR: number, craterD: number, cause: string) => void,
    peekDanger = 0,
    diffConfig: DifficultyModifier = getDifficultyConfig('veteran')
  ): void {
    const playerHead = new THREE.Vector3(playerPos.x, playerEyeY, playerPos.z);

    for (const t of this.tanks) {
      if (t.destroyed) {
        // Persistent burning wreck smoke column (becomes solid cover in No Man's Land!)
        t.smokeTimer -= dt;
        if (t.smokeTimer <= 0) {
          t.smokeTimer = 0.28;
          this.vfx.spawnSprite(
            new THREE.Vector3(t.pos.x, t.pos.y + 1.8, t.pos.z),
            new THREE.Vector3((Math.random() - 0.5) * 0.6, 2.6, (Math.random() - 0.5) * 0.6),
            0x1e1d1c,
            1.4,
            4.2,
            2.1,
            0.68,
            -0.2
          );
        }
        continue;
      }

      // 1. Move along waypoints
      if (t.waypointIndex < t.waypoints.length) {
        const wp = t.waypoints[t.waypointIndex];
        const dx = wp.x - t.pos.x;
        const dz = wp.z - t.pos.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 1.5) {
          t.waypointIndex++;
        } else {
          const desiredYaw = Math.atan2(-dx, -dz);
          const diff = Math.atan2(Math.sin(desiredYaw - t.hullYaw), Math.cos(desiredYaw - t.hullYaw));
          t.hullYaw += THREE.MathUtils.clamp(diff, -dt * 0.7, dt * 0.7);

          const speed = t.heavy ? 2.1 : 2.9;
          t.pos.x += (-Math.sin(t.hullYaw)) * speed * dt;
          t.pos.z += (-Math.cos(t.hullYaw)) * speed * dt;

          // Crush barbed wire, walls, buildings, trees, fences & sandbags in path
          this.cover.destroyWiresInRadius(t.pos.x, t.pos.z, 2.4);
          this.cover.crushByTank(t.pos, 2.85 * (t.heavy ? 1.18 : 0.96));
        }
      }

      // Ground conformance (pitch / roll over craters)
      const hC = this.terrain.getTerrainHeight(t.pos.x, t.pos.z);
      const fwdX = -Math.sin(t.hullYaw);
      const fwdZ = -Math.cos(t.hullYaw);
      const hFront = this.terrain.getTerrainHeight(t.pos.x + fwdX * 1.8, t.pos.z + fwdZ * 1.8);
      const hBack = this.terrain.getTerrainHeight(t.pos.x - fwdX * 1.8, t.pos.z - fwdZ * 1.8);

      t.pos.y = THREE.MathUtils.lerp(t.pos.y, hC, Math.min(1, dt * 8));
      t.root.position.copy(t.pos);
      t.hull.rotation.y = t.hullYaw;
      t.hull.rotation.x = THREE.MathUtils.lerp(
        t.hull.rotation.x,
        Math.atan2(hFront - hBack, 3.6),
        Math.min(1, dt * 6)
      );

      // 2. Turret tracking toward player
      const dxP = playerPos.x - t.pos.x;
      const dzP = playerPos.z - t.pos.z;
      const desiredTurretWorldYaw = Math.atan2(-dxP, -dzP);
      const desiredLocalYaw = desiredTurretWorldYaw - t.hullYaw;
      const curLocal = t.turret.rotation.y;
      const dYaw = Math.atan2(Math.sin(desiredLocalYaw - curLocal), Math.cos(desiredLocalYaw - curLocal));
      t.turret.rotation.y += THREE.MathUtils.clamp(dYaw, -dt * 0.95, dt * 0.95);
      t.turretYaw = t.hullYaw + t.turret.rotation.y;

      // Barrel recoil recovery
      t.barrelRecoil = THREE.MathUtils.lerp(t.barrelRecoil, 0, Math.min(1, dt * 10));
      const scale = t.heavy ? 1.18 : 0.96;
      t.barrel.position.z = -2.1 * scale + t.barrelRecoil;

      // 3. Fire Cannon & Coaxial MG
      const muzzlePos = new THREE.Vector3(
        t.pos.x - Math.sin(t.turretYaw) * 3.4 * scale,
        t.pos.y + 1.65 * scale,
        t.pos.z - Math.cos(t.turretYaw) * 3.4 * scale
      );
      const distPlayer = t.pos.distanceTo(playerPos);
      const pan = Math.max(-1, Math.min(1, (t.pos.x - playerPos.x) / 30));

      t.cannonCooldown -= dt;
      if (t.cannonCooldown <= 0 && distPlayer < 65) {
        t.cannonCooldown = t.heavy ? 5.2 : 6.0;
        const aimOrigin = muzzlePos.clone();
        const aimDirectly = playerExposure > 0.6 || (playerExposure > 0.3 && peekDanger >= 0.6);
        const target = aimDirectly
          ? playerHead.clone()
          : new THREE.Vector3(
              playerPos.x + (Math.random() * 2 - 1) * 2.2,
              Math.max(0, playerPos.y + 0.9),
              playerPos.z - 1.3
            );
        const dir = target.sub(aimOrigin).normalize();
        const hit = this.cover.raycastWorld(aimOrigin, dir, 65, true);
        const expPoint = hit ? hit.point : aimOrigin.clone().addScaledVector(dir, 30);

        t.barrelRecoil = 0.45;
        this.vfx.spawnFlashLight(muzzlePos, 0xffaa44, 5.5, 0.2);
        this.audio.playGunshot('tankCannon', distPlayer, pan);
        onExplosion(expPoint, 5.5, 82, 1.9, 0.65, 'Disparo de canhão de tanque');
      }

      // Coaxial MG bursts when player is exposed
      t.mgCooldown -= dt;
      if (playerExposure > 0.28 && t.mgCooldown <= 0 && distPlayer < 55) {
        if (this.cover.hasLineOfSight(muzzlePos, playerHead)) {
          t.mgCooldown = 0.11;
          const dir = playerHead.clone().sub(muzzlePos).normalize();
          const spread =
            THREE.MathUtils.lerp(0.11, playerExposure > 0.65 ? 0.028 : 0.055, peekDanger) *
            diffConfig.enemySpreadMult;
          dir.x += (Math.random() - 0.5) * spread;
          dir.y += (Math.random() - 0.5) * spread;
          dir.normalize();
          this.projectiles.spawnBullet(muzzlePos, dir, 128, 16, 'enemy');
          if (Math.random() < 0.4) {
            this.audio.playGunshot('mg', distPlayer, pan);
          }
        }
      }
    }

    this.syncHullColliders();
  }
}
