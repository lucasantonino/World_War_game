import * as THREE from 'three';
import { CoverState, DestructibleSpec, DestructionStage, RaycastHit, SmokeCloud } from '../types';
import { Terrain } from './Terrain';

export interface SolidBoxCollider {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  blocksBullets: boolean;
  blocksMovement: boolean;
  blocksSight: boolean;
  destructibleId?: string;
}

export interface TankHullCollider {
  id: string;
  x: number;
  y: number;
  z: number;
  halfW: number;
  halfH: number;
  halfL: number;
  yaw: number;
}

export interface WireHazard {
  id: string;
  x: number;
  z: number;
  halfLen: number;
  rotY: number;
  active: boolean;
}

export interface CoverEvaluation {
  state: CoverState;
  exposure: number;
  overheadProtected: boolean;
  inWireHazard: boolean;
}

export class CoverSystem {
  private terrain: Terrain;
  private boxes: SolidBoxCollider[] = [];
  private destructibles = new Map<
    string,
    DestructibleSpec & {
      mesh?: THREE.Object3D;
      stage: DestructionStage;
      onStageChange?: (stage: DestructionStage, spec: DestructibleSpec) => void;
    }
  >();
  private tankHulls: TankHullCollider[] = [];
  private wireHazards: WireHazard[] = [];
  private smokeClouds: SmokeCloud[] = [];
  private nextSmokeId = 1;
  private onStageChangedGlobal: ((spec: DestructibleSpec, stage: DestructionStage) => void) | null =
    null;

  constructor(terrain: Terrain) {
    this.terrain = terrain;
  }

  public setOnDestructibleStageChanged(
    cb: (spec: DestructibleSpec, stage: DestructionStage) => void
  ): void {
    this.onStageChangedGlobal = cb;
  }

  public clear(): void {
    this.boxes = [];
    this.destructibles.clear();
    this.tankHulls = [];
    this.wireHazards = [];
    this.clearSmokeClouds();
  }

  public addSmokeCloud(x: number, y: number, z: number, maxRadius = 6.2, duration = 14.0): void {
    const clampedMax = Math.max(0.5, maxRadius);
    const clampedDur = Math.max(0.5, duration);
    this.smokeClouds.push({
      id: this.nextSmokeId++,
      x,
      y,
      z,
      radius: clampedMax * 0.4,
      maxRadius: clampedMax,
      age: 0,
      duration: clampedDur
    });
  }

  public updateSmokeClouds(dt: number): void {
    for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
      const c = this.smokeClouds[i];
      c.age += dt;
      if (c.age >= c.duration) {
        this.smokeClouds.splice(i, 1);
        continue;
      }

      const growDuration = Math.min(1.2, c.duration * 0.25);
      const growT = growDuration > 0 ? Math.min(1, c.age / growDuration) : 1;
      const easedGrow = growT * (2 - growT);
      let r = c.maxRadius * (0.4 + 0.6 * easedGrow);

      // Slight dissipation near end of lifetime
      const fadeDuration = Math.min(2.5, c.duration * 0.3);
      const remaining = c.duration - c.age;
      if (remaining < fadeDuration && fadeDuration > 0) {
        const fadeOutT = 1 - remaining / fadeDuration;
        r *= 1 - fadeOutT * 0.35;
      }
      c.radius = r;
    }
  }

  public clearSmokeClouds(): void {
    this.smokeClouds.length = 0;
  }

  public isPointInSmoke(x: number, y: number, z: number): boolean {
    for (let i = 0; i < this.smokeClouds.length; i++) {
      const c = this.smokeClouds[i];
      if (Math.abs(y - c.y) > c.radius * 0.85) continue;
      const dx = x - c.x;
      const dy = y - c.y;
      const dz = z - c.z;
      const effR = c.radius * 0.92;
      if (dx * dx + dy * dy + dz * dz <= effR * effR) {
        return true;
      }
    }
    return false;
  }

  public isSegmentBlockedBySmoke(
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number
  ): boolean {
    if (this.smokeClouds.length === 0) return false;
    const abx = bx - ax;
    const aby = by - ay;
    const abz = bz - az;
    const lenSq = abx * abx + aby * aby + abz * abz;
    // Ignore when both endpoints are virtually touching at point-blank minimum radius
    if (lenSq < 0.04) return false;

    for (let i = 0; i < this.smokeClouds.length; i++) {
      const c = this.smokeClouds[i];
      const effR = c.radius * 0.88;
      const acx = c.x - ax;
      const acy = c.y - ay;
      const acz = c.z - az;
      const t = Math.max(0, Math.min(1, (acx * abx + acy * aby + acz * abz) / lenSq));
      const dx = ax + abx * t - c.x;
      const dy = ay + aby * t - c.y;
      const dz = az + abz * t - c.z;
      if (dx * dx + dy * dy + dz * dz <= effR * effR) {
        return true;
      }
    }
    return false;
  }

  public addStaticBox(box: SolidBoxCollider): void {
    this.boxes.push(box);
  }

  public registerDestructible(
    spec: DestructibleSpec,
    mesh: THREE.Object3D,
    onStageChange?: (stage: DestructionStage, spec: DestructibleSpec) => void
  ): void {
    this.destructibles.set(spec.id, {
      ...spec,
      mesh,
      stage: spec.stage ?? 0,
      onStageChange
    });
    if (spec.blocksBullets || spec.blocksMovement || spec.blocksSight) {
      const rot = spec.rotationY ?? 0;
      const cos = Math.abs(Math.cos(rot));
      const sin = Math.abs(Math.sin(rot));
      const effW = spec.width * cos + spec.depth * sin;
      const effD = spec.width * sin + spec.depth * cos;

      this.boxes.push({
        id: `col_${spec.id}`,
        minX: spec.x - effW * 0.5,
        maxX: spec.x + effW * 0.5,
        minY: spec.y,
        maxY: spec.y + spec.height,
        minZ: spec.z - effD * 0.5,
        maxZ: spec.z + effD * 0.5,
        blocksBullets: spec.blocksBullets,
        blocksMovement: spec.blocksMovement,
        blocksSight: spec.blocksSight,
        destructibleId: spec.id
      });
    }
  }

  public addWireHazard(wire: WireHazard): void {
    this.wireHazards.push(wire);
  }

  public setTankHulls(hulls: TankHullCollider[]): void {
    this.tankHulls = hulls;
  }

  public damageDestructible(
    id: string,
    damage: number,
    onDestroyed?: (spec: DestructibleSpec) => void
  ): boolean {
    const item = this.destructibles.get(id);
    if (!item || item.stage >= 2) return false;

    item.hp = Math.max(0, item.hp - damage);

    if (item.hp > 0 && item.hp <= item.maxHp * 0.58 && item.stage === 0) {
      item.stage = 1;
      for (const box of this.boxes) {
        if (box.destructibleId === id) {
          box.maxY = box.minY + item.height * 0.62;
        }
      }
      item.onStageChange?.(1, item);
      this.onStageChangedGlobal?.(item, 1);
      return false;
    }

    if (item.hp <= 0 && item.stage < 2) {
      item.stage = 2;
      if (item.kind === 'sandbag' || item.kind === 'ruin' || item.kind === 'building') {
        if (item.onStageChange) {
          for (const box of this.boxes) {
            if (box.destructibleId === id) {
              box.maxY = box.minY + Math.max(0.22, item.height * 0.24);
              box.blocksMovement = false;
              box.blocksSight = false;
              box.blocksBullets = true;
            }
          }
          item.onStageChange(2, item);
        } else {
          if (item.mesh) {
            item.mesh.visible = false;
          }
          this.boxes = this.boxes.filter((b) => b.destructibleId !== id);
        }
      } else {
        this.boxes = this.boxes.filter((b) => b.destructibleId !== id);
        for (const w of this.wireHazards) {
          if (w.id === id) w.active = false;
        }
        if (item.onStageChange) {
          item.onStageChange(2, item);
        } else if (item.mesh) {
          item.mesh.visible = false;
        }
      }
      this.onStageChangedGlobal?.(item, 2);
      onDestroyed?.(item);
      return true;
    }

    return false;
  }

  public crushByTank(tankPos: THREE.Vector3, crushRadius: number): void {
    for (const [id, item] of this.destructibles.entries()) {
      if (
        item.stage < 2 &&
        item.kind !== 'bunker_main' &&
        item.kind !== 'bunker_mg' &&
        Math.hypot(item.x - tankPos.x, item.z - tankPos.z) <=
          crushRadius + Math.max(item.width, item.depth) * 0.35
      ) {
        this.damageDestructible(id, 9999);
      }
    }
  }

  public damageDestructiblesInRadius(
    center: THREE.Vector3,
    radius: number,
    damage: number,
    onDestroyed?: (spec: DestructibleSpec) => void
  ): void {
    for (const [id, item] of this.destructibles.entries()) {
      if (item.stage >= 2 || item.hp <= 0) continue;
      if (item.kind === 'bunker_main') continue; // Main bunker requires direct charge or heavy bazooka hit
      const d = Math.hypot(item.x - center.x, item.z - center.z);
      if (d <= radius) {
        const falloff = 1 - (d / radius) * 0.45;
        this.damageDestructible(id, damage * falloff, onDestroyed);
      }
    }
  }

  public destroyWiresInRadius(x: number, z: number, radius: number, onDestroyed?: (id: string) => void): void {
    for (const w of this.wireHazards) {
      if (!w.active) continue;
      if (Math.hypot(w.x - x, w.z - z) <= radius + w.halfLen * 0.4) {
        this.damageDestructible(w.id, 9999, (spec) => onDestroyed?.(spec.id));
      }
    }
  }

  public isPointInWireHazard(x: number, z: number): boolean {
    for (const w of this.wireHazards) {
      if (!w.active) continue;
      const dx = x - w.x;
      const dz = z - w.z;
      const cos = Math.cos(-w.rotY);
      const sin = Math.sin(-w.rotY);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      if (Math.abs(lx) <= w.halfLen && Math.abs(lz) <= 0.72) {
        return true;
      }
    }
    return false;
  }

  public resolvePlayerMovement(
    pos: THREE.Vector3,
    desiredStepX: number,
    desiredStepZ: number,
    wantsMantle: boolean
  ): { x: number; y: number; z: number; mantled: boolean } {
    const radius = 0.36;
    const bounds = this.terrain.getWorldBounds();
    let nx = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x + desiredStepX));
    let nz = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.z + desiredStepZ));

    const currentGroundY = this.terrain.getTerrainHeight(pos.x, pos.z);
    let targetGroundY = this.terrain.getTerrainHeight(nx, nz);
    let mantled = false;

    // Prevent casually walking out over steep trench lip without pressing Space (mantle)
    const heightRise = targetGroundY - currentGroundY;
    if (heightRise > 0.56 && !wantsMantle) {
      // Try sliding along X and Z independently
      const tryXGround = this.terrain.getTerrainHeight(nx, pos.z);
      const tryZGround = this.terrain.getTerrainHeight(pos.x, nz);
      if (tryXGround - currentGroundY <= 0.56) {
        nz = pos.z;
        targetGroundY = tryXGround;
      } else if (tryZGround - currentGroundY <= 0.56) {
        nx = pos.x;
        targetGroundY = tryZGround;
      } else {
        nx = pos.x;
        nz = pos.z;
        targetGroundY = currentGroundY;
      }
    } else if (heightRise > 0.45 && wantsMantle) {
      mantled = true;
    }

    // Resolve horizontal collision against solid boxes (dugout walls, ruins, bunkers, sandbags)
    const playerBottom = targetGroundY + 0.25;
    const playerTop = targetGroundY + 1.55;

    for (const b of this.boxes) {
      if (!b.blocksMovement) continue;
      if (playerTop <= b.minY || playerBottom >= b.maxY) continue;

      const closestX = Math.max(b.minX, Math.min(nx, b.maxX));
      const closestZ = Math.max(b.minZ, Math.min(nz, b.maxZ));
      const dx = nx - closestX;
      const dz = nz - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        const dist = Math.sqrt(distSq);
        if (dist > 1e-4) {
          const push = radius - dist;
          nx += (dx / dist) * push;
          nz += (dz / dist) * push;
        } else {
          const leftPen = Math.abs(nx - b.minX);
          const rightPen = Math.abs(b.maxX - nx);
          const topPen = Math.abs(nz - b.minZ);
          const botPen = Math.abs(b.maxZ - nz);
          const minPen = Math.min(leftPen, rightPen, topPen, botPen);
          if (minPen === leftPen) nx = b.minX - radius;
          else if (minPen === rightPen) nx = b.maxX + radius;
          else if (minPen === topPen) nz = b.minZ - radius;
          else nz = b.maxZ + radius;
        }
      }
    }

    // Resolve tank hulls
    for (const t of this.tankHulls) {
      const r = t.halfW + radius;
      const dx = nx - t.x;
      const dz = nz - t.z;
      const distSq = dx * dx + dz * dz;
      if (distSq < r * r) {
        const dist = Math.max(0.001, Math.sqrt(distSq));
        nx = t.x + (dx / dist) * r;
        nz = t.z + (dz / dist) * r;
      }
    }

    const finalY = this.terrain.getTerrainHeight(nx, nz);
    return { x: nx, y: finalY, z: nz, mantled };
  }

  public evaluatePlayerCover(
    pos: THREE.Vector3,
    eyeY: number,
    isCrouching: boolean,
    isSprinting: boolean
  ): CoverEvaluation {
    const inWireHazard = this.isPointInWireHazard(pos.x, pos.z);
    const dugout = this.terrain.getDugoutAt(pos.x, pos.z);
    if (dugout) {
      return {
        state: 'dugout',
        exposure: 0.0,
        overheadProtected: true,
        inWireHazard
      };
    }

    // Check surrounding earth height & obstacles toward enemy front (-Z and diagonals)
    const sampleAngles = [0, -0.45, 0.45];
    let shieldedRays = 0;

    for (const ang of sampleAngles) {
      const dir = new THREE.Vector3(Math.sin(ang), 0, -Math.cos(ang));
      // 1. Is eyeY below surrounding earth rim within 1.8m?
      const rimH1 = this.terrain.getTerrainHeight(pos.x + dir.x * 1.1, pos.z + dir.z * 1.1);
      const rimH2 = this.terrain.getTerrainHeight(pos.x + dir.x * 2.0, pos.z + dir.z * 2.0);
      const maxRim = Math.max(rimH1, rimH2);

      if (eyeY <= maxRim + 0.06) {
        shieldedRays++;
        continue;
      }

      // 2. Is there a sandbag, wall, bunker or tank hull blocking chest/head line of fire within 3.2m?
      const chestOrigin = new THREE.Vector3(pos.x, eyeY - 0.14, pos.z);
      const hit = this.raycastWorld(chestOrigin, dir, 3.2, false);
      if (hit && hit.distance < 3.1) {
        shieldedRays++;
      }
    }

    const groundH = this.terrain.getTerrainHeight(pos.x, pos.z);
    const inDepression = groundH < -0.42;

    if (shieldedRays >= 2) {
      return {
        state: 'sheltered',
        exposure: 0.04,
        overheadProtected: false,
        inWireHazard
      };
    }

    if (inDepression || shieldedRays === 1) {
      return {
        state: 'peeking',
        exposure: isCrouching ? 0.25 : 0.48,
        overheadProtected: false,
        inWireHazard
      };
    }

    let exposure = isCrouching ? 0.72 : 1.0;
    if (isSprinting) exposure = 1.0;
    return {
      state: 'exposed',
      exposure,
      overheadProtected: false,
      inWireHazard
    };
  }

  public raycastWorld(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxDist: number,
    checkTerrain = true
  ): RaycastHit | null {
    let closestDist = maxDist;
    let closestHit: RaycastHit | null = null;

    // 1. Box colliders (sandbags, ruins, bunkers, dugout walls)
    for (const b of this.boxes) {
      if (!b.blocksBullets) continue;
      const hit = this.intersectRayAABB(origin, dir, b, closestDist);
      if (hit && hit.distance < closestDist) {
        closestDist = hit.distance;
        closestHit = {
          point: hit.point,
          normal: hit.normal,
          distance: hit.distance,
          hitType: b.destructibleId ? 'destructible' : 'obstacle',
          destructibleId: b.destructibleId
        };
      }
    }

    // 2. Terrain heightfield raymarch with binary refinement
    if (checkTerrain) {
      const step = 0.6;
      let prevT = 0;
      let prevDiff = origin.y - this.terrain.getTerrainHeight(origin.x, origin.z);

      for (let t = step; t <= closestDist; t += step) {
        const px = origin.x + dir.x * t;
        const py = origin.y + dir.y * t;
        const pz = origin.z + dir.z * t;
        const h = this.terrain.getTerrainHeight(px, pz);
        const diff = py - h;
        if (diff <= 0 && prevDiff > 0) {
          // Binary search between prevT and t
          let lo = prevT;
          let hi = t;
          for (let iter = 0; iter < 5; iter++) {
            const mid = (lo + hi) * 0.5;
            const mx = origin.x + dir.x * mid;
            const my = origin.y + dir.y * mid;
            const mz = origin.z + dir.z * mid;
            if (my <= this.terrain.getTerrainHeight(mx, mz)) {
              hi = mid;
            } else {
              lo = mid;
            }
          }
          const hitDist = hi;
          if (hitDist < closestDist) {
            const hx = origin.x + dir.x * hitDist;
            const hy = origin.y + dir.y * hitDist;
            const hz = origin.z + dir.z * hitDist;
            const eps = 0.25;
            const nx =
              this.terrain.getTerrainHeight(hx - eps, hz) -
              this.terrain.getTerrainHeight(hx + eps, hz);
            const nz =
              this.terrain.getTerrainHeight(hx, hz - eps) -
              this.terrain.getTerrainHeight(hx, hz + eps);
            const normal = new THREE.Vector3(nx, 2 * eps, nz).normalize();
            closestDist = hitDist;
            closestHit = {
              point: new THREE.Vector3(hx, hy, hz),
              normal,
              distance: hitDist,
              hitType: 'terrain'
            };
          }
          break;
        }
        prevT = t;
        prevDiff = diff;
      }
    }

    return closestHit;
  }

  public hasLineOfSight(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const delta = new THREE.Vector3().subVectors(to, from);
    const dist = delta.length();
    if (dist < 0.1) return true;
    if (this.isSegmentBlockedBySmoke(from.x, from.y, from.z, to.x, to.y, to.z)) {
      return false;
    }
    const dir = delta.divideScalar(dist);
    const hit = this.raycastWorld(from, dir, dist - 0.15, true);
    return hit === null;
  }

  private intersectRayAABB(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    box: SolidBoxCollider,
    maxDist: number
  ): { distance: number; point: THREE.Vector3; normal: THREE.Vector3 } | null {
    const invX = dir.x !== 0 ? 1 / dir.x : 1e9;
    const invY = dir.y !== 0 ? 1 / dir.y : 1e9;
    const invZ = dir.z !== 0 ? 1 / dir.z : 1e9;

    const t1 = (box.minX - origin.x) * invX;
    const t2 = (box.maxX - origin.x) * invX;
    const t3 = (box.minY - origin.y) * invY;
    const t4 = (box.maxY - origin.y) * invY;
    const t5 = (box.minZ - origin.z) * invZ;
    const t6 = (box.maxZ - origin.z) * invZ;

    const tminX = Math.min(t1, t2);
    const tmaxX = Math.max(t1, t2);
    const tminY = Math.min(t3, t4);
    const tmaxY = Math.max(t3, t4);
    const tminZ = Math.min(t5, t6);
    const tmaxZ = Math.max(t5, t6);

    const tmin = Math.max(tminX, tminY, tminZ);
    const tmax = Math.min(tmaxX, tmaxY, tmaxZ);

    if (tmax < 0 || tmin > tmax || tmin > maxDist) {
      return null;
    }

    const hitDist = tmin >= 0 ? tmin : tmax;
    if (hitDist > maxDist || hitDist < 0.02) return null;

    const normal = new THREE.Vector3(0, 1, 0);
    if (tmin === tminX) normal.set(dir.x > 0 ? -1 : 1, 0, 0);
    else if (tmin === tminY) normal.set(0, dir.y > 0 ? -1 : 1, 0);
    else normal.set(0, 0, dir.z > 0 ? -1 : 1);

    const point = origin.clone().addScaledVector(dir, hitDist);
    return { distance: hitDist, point, normal };
  }
}
