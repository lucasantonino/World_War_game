import * as THREE from 'three';
import {
  CoverState,
  DestructibleSpec,
  DestructionStage,
  RaycastHit,
  SmokeCloud,
  TacticalCoverNode
} from '../types';
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
  rotY?: number;
  cx?: number;
  cz?: number;
  halfW?: number;
  halfD?: number;
  cosR?: number;
  sinR?: number;
}

interface EnterableBuildingBounds {
  buildingId: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  ceilingY: number;
  rotY: number;
  cx: number;
  cz: number;
  halfW: number;
  halfD: number;
  cosR: number;
  sinR: number;
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
  private tacticalNodes: TacticalCoverNode[] = [];
  private enterableBuildings = new Map<string, EnterableBuildingBounds>();
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
    this.tacticalNodes = [];
    this.enterableBuildings.clear();
    this.clearSmokeClouds();
  }

  public registerTacticalNode(node: TacticalCoverNode): void {
    this.tacticalNodes.push({
      ...node,
      occupiedById: node.occupiedById ?? null
    });
  }

  public getTacticalNodes(): readonly TacticalCoverNode[] {
    return this.tacticalNodes;
  }

  public releaseTacticalNode(soldierId: number): void {
    for (let i = 0; i < this.tacticalNodes.length; i++) {
      if (this.tacticalNodes[i].occupiedById === soldierId) {
        this.tacticalNodes[i].occupiedById = null;
      }
    }
  }

  public removeNodesForBuilding(buildingId: string): void {
    this.tacticalNodes = this.tacticalNodes.filter((n) => n.buildingId !== buildingId);
  }

  public registerEnterableBuildingBounds(
    buildingId: string,
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    ceilingY: number,
    rotY = 0
  ): void {
    const cx = (minX + maxX) * 0.5;
    const cz = (minZ + maxZ) * 0.5;
    const halfW = (maxX - minX) * 0.5;
    const halfD = (maxZ - minZ) * 0.5;
    const cosR = Math.cos(rotY);
    const sinR = Math.sin(rotY);
    this.enterableBuildings.set(buildingId, {
      buildingId,
      minX,
      maxX,
      minZ,
      maxZ,
      ceilingY,
      rotY,
      cx,
      cz,
      halfW,
      halfD,
      cosR,
      sinR
    });
  }

  public removeEnterableBuildingBounds(buildingId: string): void {
    this.enterableBuildings.delete(buildingId);
  }

  public isInsideEnterableBuilding(x: number, z: number): boolean {
    for (const b of this.enterableBuildings.values()) {
      if (Math.abs(b.rotY) <= 1e-4) {
        if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) {
          return true;
        }
      } else {
        const dx = x - b.cx;
        const dz = z - b.cz;
        // Inverse Y rotation (-rotY): lx = dx * cos - dz * sin, lz = dx * sin + dz * cos
        const lx = dx * b.cosR - dz * b.sinR;
        const lz = dx * b.sinR + dz * b.cosR;
        if (Math.abs(lx) <= b.halfW && Math.abs(lz) <= b.halfD) {
          return true;
        }
      }
    }
    return false;
  }

  public findTacticalCoverNode(
    fromX: number,
    fromZ: number,
    targetZ: number,
    faction: 'ally' | 'enemy',
    soldierId: number
  ): TacticalCoverNode | null {
    if (this.tacticalNodes.length === 0) return null;

    const dzToTarget = targetZ - fromZ;
    const distToTargetZ = Math.abs(dzToTarget);
    const dirZ = distToTargetZ > 0.5 ? Math.sign(dzToTarget) : faction === 'enemy' ? 1 : -1;
    const nearTarget = distToTargetZ <= 12;

    let bestNode: TacticalCoverNode | null = null;
    let bestScore = -Infinity;

    for (let i = 0; i < this.tacticalNodes.length; i++) {
      const node = this.tacticalNodes[i];
      if (node.occupiedById != null && node.occupiedById !== soldierId) {
        continue;
      }

      const stepZ = (node.z - fromZ) * dirZ;
      const dist2D = Math.hypot(node.x - fromX, node.z - fromZ);
      const overshootZ = (node.z - targetZ) * dirZ;

      if (!nearTarget) {
        // Require gradual forward progress (prefer 10m..30m hops, never skip to end of map)
        if (stepZ < 3.0 || stepZ > Math.min(34.0, distToTargetZ + 6.0)) continue;
        if (overshootZ > 8.0) continue;
        if (dist2D > 42.0) continue;
      } else {
        // Already close to targetZ: allow holding/repositioning near targetZ
        if (Math.abs(node.z - targetZ) > 14.0 || dist2D > 28.0) continue;
      }

      let score = 0;
      if (node.insideBuilding) {
        score += 48;
      } else if (node.id.startsWith('ruin_') || node.id.startsWith('sandbag_')) {
        score += 24;
      } else {
        score += 12;
      }

      if (!nearTarget) {
        if (stepZ >= 10 && stepZ <= 30) {
          score += 22 - Math.abs(stepZ - 18) * 0.45;
        } else {
          score += 8 - Math.abs(stepZ - 18) * 0.65;
        }
      } else {
        score += 16 - Math.abs(node.z - targetZ) * 1.1;
      }

      // Penalize excessive lateral detour so soldiers advance naturally in lanes
      score -= Math.abs(node.x - fromX) * 0.45;
      score -= dist2D * 0.2;

      // Slight preference for window facing toward enemy direction
      if (node.windowDirZ !== undefined) {
        const desiredFacing = faction === 'ally' ? -1 : 1;
        if (node.windowDirZ * desiredFacing > 0.2) {
          score += 6;
        }
      }

      if (node.occupiedById === soldierId) {
        score += 3;
      }

      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    }

    if (!bestNode) return null;

    this.releaseTacticalNode(soldierId);
    bestNode.occupiedById = soldierId;
    return bestNode;
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
    if (box.rotY !== undefined && Math.abs(box.rotY) > 1e-4) {
      box.cosR = Math.cos(box.rotY);
      box.sinR = Math.sin(box.rotY);
    }
    this.boxes.push(box);
  }

  public removeStaticCollidersByPrefix(prefix: string): void {
    const wallPrefix = prefix.endsWith('_') ? prefix : `${prefix}_`;
    this.boxes = this.boxes.filter(
      (b) => !b.id.startsWith(wallPrefix) && b.destructibleId !== prefix
    );
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

      this.addStaticBox({
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
        destructibleId: spec.id,
        rotY: Math.abs(rot) > 1e-4 ? rot : undefined,
        cx: spec.x,
        cz: spec.z,
        halfW: spec.width * 0.5,
        halfD: spec.depth * 0.5
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
      const stage1RoofLimit = item.y + item.height * 0.62;
      for (const box of this.boxes) {
        if (box.destructibleId === id) {
          if (box.minY >= item.y + item.height * 0.56) {
            box.blocksBullets = false;
            box.blocksMovement = false;
            box.blocksSight = false;
          } else {
            box.maxY = Math.min(box.maxY, stage1RoofLimit);
          }
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
              box.maxY = Math.min(box.maxY, item.y + Math.max(0.22, item.height * 0.24));
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

      if (b.cosR !== undefined && b.sinR !== undefined && b.cx !== undefined && b.cz !== undefined && b.halfW !== undefined && b.halfD !== undefined) {
        if (nx + radius < b.minX || nx - radius > b.maxX || nz + radius < b.minZ || nz - radius > b.maxZ) {
          continue;
        }
        const relX = nx - b.cx;
        const relZ = nz - b.cz;
        let lx = relX * b.cosR - relZ * b.sinR;
        let lz = relX * b.sinR + relZ * b.cosR;

        const closestX = Math.max(-b.halfW, Math.min(lx, b.halfW));
        const closestZ = Math.max(-b.halfD, Math.min(lz, b.halfD));
        const dx = lx - closestX;
        const dz = lz - closestZ;
        const distSq = dx * dx + dz * dz;

        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          if (dist > 1e-4) {
            const push = radius - dist;
            lx += (dx / dist) * push;
            lz += (dz / dist) * push;
          } else {
            const leftPen = Math.abs(lx + b.halfW);
            const rightPen = Math.abs(b.halfW - lx);
            const topPen = Math.abs(lz + b.halfD);
            const botPen = Math.abs(b.halfD - lz);
            const minPen = Math.min(leftPen, rightPen, topPen, botPen);
            if (minPen === leftPen) lx = -b.halfW - radius;
            else if (minPen === rightPen) lx = b.halfW + radius;
            else if (minPen === topPen) lz = -b.halfD - radius;
            else lz = b.halfD + radius;
          }
          nx = b.cx + lx * b.cosR + lz * b.sinR;
          nz = b.cz - lx * b.sinR + lz * b.cosR;
        }
        continue;
      }

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

    const inBuilding = this.isInsideEnterableBuilding(pos.x, pos.z);

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
        overheadProtected: inBuilding,
        inWireHazard
      };
    }

    if (inBuilding) {
      return {
        state: isCrouching ? 'sheltered' : 'peeking',
        exposure: isCrouching ? 0.06 : 0.34,
        overheadProtected: true,
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
    const invX = dir.x !== 0 ? 1 / dir.x : 1e9;
    const invY = dir.y !== 0 ? 1 / dir.y : 1e9;
    const invZ = dir.z !== 0 ? 1 / dir.z : 1e9;

    // 1. Box colliders (sandbags, ruins, bunkers, dugout walls, enterable building walls)
    let winningBox: SolidBoxCollider | null = null;
    let winningFace = 0; // 0=X, 1=Y, 2=Z
    let winningSign = 1;

    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i];
      if (!b.blocksBullets) continue;
      const res = this.intersectRayBoxRaw(
        origin.x,
        origin.y,
        origin.z,
        dir.x,
        dir.y,
        dir.z,
        invX,
        invY,
        invZ,
        b,
        closestDist
      );
      if (res && res.distance < closestDist) {
        closestDist = res.distance;
        winningBox = b;
        winningFace = res.face;
        winningSign = res.sign;
      }
    }

    if (winningBox) {
      const point = origin.clone().addScaledVector(dir, closestDist);
      let nx = 0;
      let ny = 0;
      let nz = 0;
      if (winningFace === 1) {
        ny = winningSign;
      } else if (winningBox.cosR !== undefined && winningBox.sinR !== undefined) {
        const lnx = winningFace === 0 ? winningSign : 0;
        const lnz = winningFace === 2 ? winningSign : 0;
        nx = lnx * winningBox.cosR + lnz * winningBox.sinR;
        nz = -lnx * winningBox.sinR + lnz * winningBox.cosR;
      } else {
        if (winningFace === 0) nx = winningSign;
        else nz = winningSign;
      }
      closestHit = {
        point,
        normal: new THREE.Vector3(nx, ny, nz),
        distance: closestDist,
        hitType: winningBox.destructibleId ? 'destructible' : 'obstacle',
        destructibleId: winningBox.destructibleId
      };
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
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq < 0.01) return true;
    if (this.isSegmentBlockedBySmoke(from.x, from.y, from.z, to.x, to.y, to.z)) {
      return false;
    }

    const dist = Math.sqrt(distSq);
    const maxDist = dist - 0.15;
    if (maxDist <= 0.02) return true;

    const invDist = 1 / dist;
    const dirX = dx * invDist;
    const dirY = dy * invDist;
    const dirZ = dz * invDist;
    const invX = dirX !== 0 ? 1 / dirX : 1e9;
    const invY = dirY !== 0 ? 1 / dirY : 1e9;
    const invZ = dirZ !== 0 ? 1 / dirZ : 1e9;

    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i];
      if (!b.blocksSight) continue;
      if (
        this.intersectRayBoxRaw(
          from.x,
          from.y,
          from.z,
          dirX,
          dirY,
          dirZ,
          invX,
          invY,
          invZ,
          b,
          maxDist
        ) !== null
      ) {
        return false;
      }
    }

    const step = 0.65;
    let prevDiff = from.y - this.terrain.getTerrainHeight(from.x, from.z);
    for (let t = step; t <= maxDist; t += step) {
      const px = from.x + dirX * t;
      const py = from.y + dirY * t;
      const pz = from.z + dirZ * t;
      const diff = py - this.terrain.getTerrainHeight(px, pz);
      if (diff <= 0 && prevDiff > 0) {
        return false;
      }
      prevDiff = diff;
    }

    return true;
  }

  private intersectRayBoxRaw(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    invX: number,
    invY: number,
    invZ: number,
    box: SolidBoxCollider,
    maxDist: number
  ): { distance: number; face: number; sign: number } | null {
    // Broadphase AABB check
    const bt1 = (box.minX - ox) * invX;
    const bt2 = (box.maxX - ox) * invX;
    const bt3 = (box.minY - oy) * invY;
    const bt4 = (box.maxY - oy) * invY;
    const bt5 = (box.minZ - oz) * invZ;
    const bt6 = (box.maxZ - oz) * invZ;

    const btminX = bt1 < bt2 ? bt1 : bt2;
    const btmaxX = bt1 > bt2 ? bt1 : bt2;
    const btminY = bt3 < bt4 ? bt3 : bt4;
    const btmaxY = bt3 > bt4 ? bt3 : bt4;
    const btminZ = bt5 < bt6 ? bt5 : bt6;
    const btmaxZ = bt5 > bt6 ? bt5 : bt6;

    const btmin = Math.max(btminX, btminY, btminZ);
    const btmax = Math.min(btmaxX, btmaxY, btmaxZ);

    if (btmax < 0 || btmin > btmax || btmin > maxDist) {
      return null;
    }

    // If axis-aligned, broadphase IS exact!
    if (
      box.cosR === undefined ||
      box.sinR === undefined ||
      box.cx === undefined ||
      box.cz === undefined ||
      box.halfW === undefined ||
      box.halfD === undefined
    ) {
      const hitDist = btmin >= 0 ? btmin : btmax;
      if (hitDist > maxDist || hitDist < 0.02) return null;
      if (btmin === btminX) return { distance: hitDist, face: 0, sign: dx > 0 ? -1 : 1 };
      if (btmin === btminY) return { distance: hitDist, face: 1, sign: dy > 0 ? -1 : 1 };
      return { distance: hitDist, face: 2, sign: dz > 0 ? -1 : 1 };
    }

    // Exact OBB intersection in box local space
    const rx = ox - box.cx;
    const rz = oz - box.cz;
    const lox = rx * box.cosR - rz * box.sinR;
    const loz = rx * box.sinR + rz * box.cosR;
    const ldx = dx * box.cosR - dz * box.sinR;
    const ldz = dx * box.sinR + dz * box.cosR;

    const linvX = ldx !== 0 ? 1 / ldx : 1e9;
    const linvZ = ldz !== 0 ? 1 / ldz : 1e9;

    const t1 = (-box.halfW - lox) * linvX;
    const t2 = (box.halfW - lox) * linvX;
    const t5 = (-box.halfD - loz) * linvZ;
    const t6 = (box.halfD - loz) * linvZ;

    const tminX = t1 < t2 ? t1 : t2;
    const tmaxX = t1 > t2 ? t1 : t2;
    const tminZ = t5 < t6 ? t5 : t6;
    const tmaxZ = t5 > t6 ? t5 : t6;

    const tmin = Math.max(tminX, btminY, tminZ);
    const tmax = Math.min(tmaxX, btmaxY, tmaxZ);

    if (tmax < 0 || tmin > tmax || tmin > maxDist) {
      return null;
    }

    const hitDist = tmin >= 0 ? tmin : tmax;
    if (hitDist > maxDist || hitDist < 0.02) return null;

    if (tmin === tminX) return { distance: hitDist, face: 0, sign: ldx > 0 ? -1 : 1 };
    if (tmin === btminY) return { distance: hitDist, face: 1, sign: dy > 0 ? -1 : 1 };
    return { distance: hitDist, face: 2, sign: ldz > 0 ? -1 : 1 };
  }
}
