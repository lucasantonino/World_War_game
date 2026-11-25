import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { AudioEngine } from '../engine/AudioEngine';
import { getDifficultyConfig } from '../engine/DifficultyConfig';
import { DifficultyModifier, EmplacementSpec, SoldierRole } from '../types';
import { CoverSystem } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

export const MAX_SOLDIERS = 650;
const CELL_SIZE = 4;
const LOD0_MAX_DIST_SQ = 32 * 32;
const LOD0_MAX_ENEMIES = 32;
const DIRECT_SHOOTER_MAX = 6;
const REINFORCEMENT_BATCH_SIZE = 12;
const DEATH_FALL_DURATION = 0.42;
const CORPSE_RETENTION_SEC = 10.0;

const COLOR_WHITE = new THREE.Color(0xffffff);
const COLOR_TORSO_GORE = new THREE.Color(0x4a1212);
const COLOR_ALLY_UNIFORM = new THREE.Color(0x4b583b);
const COLOR_ALLY_HELMET = new THREE.Color(0x3f4934);
const COLOR_ENEMY_UNIFORM = new THREE.Color(0x4d514f);
const COLOR_ENEMY_ASSAULT = new THREE.Color(0x525754);
const COLOR_ENEMY_GRENADIER = new THREE.Color(0x575248);
const COLOR_ENEMY_MG = new THREE.Color(0x444846);
const COLOR_ENEMY_OFFICER = new THREE.Color(0x3b3e3c);
const COLOR_ENEMY_HELMET = new THREE.Color(0x2f3332);
const COLOR_OFFICER_HELMET = new THREE.Color(0x252827);

function transformPart(
  geo: THREE.BufferGeometry,
  tx: number,
  ty: number,
  tz: number,
  rx = 0,
  ry = 0,
  rz = 0,
  sx = 1,
  sy = 1,
  sz = 1
): THREE.BufferGeometry {
  if (sx !== 1 || sy !== 1 || sz !== 1) geo.scale(sx, sy, sz);
  if (rx !== 0) geo.rotateX(rx);
  if (ry !== 0) geo.rotateY(ry);
  if (rz !== 0) geo.rotateZ(rz);
  if (tx !== 0 || ty !== 0 || tz !== 0) geo.translate(tx, ty, tz);
  return geo;
}

function mergeParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const normalized: THREE.BufferGeometry[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const g = part.index ? part.toNonIndexed() : part;
    if (g !== part) part.dispose();
    if (!g.attributes.normal) g.computeVertexNormals();
    if (g.attributes.uv) g.deleteAttribute('uv');
    normalized.push(g);
  }
  const merged = mergeGeometries(normalized, false);
  for (let i = 0; i < normalized.length; i++) {
    normalized[i].dispose();
  }
  return merged ?? new THREE.BoxGeometry(0.2, 0.2, 0.2);
}

function buildTorsoGeometry(): THREE.BufferGeometry {
  return mergeParts([
    // Tunic core
    transformPart(new THREE.BoxGeometry(0.38, 0.50, 0.22), 0, 0, 0),
    // Broad shoulders / yoke
    transformPart(new THREE.BoxGeometry(0.48, 0.14, 0.24), 0, 0.18, -0.01),
    // Upper arm sleeves
    transformPart(new THREE.BoxGeometry(0.11, 0.28, 0.12), -0.24, 0.08, -0.06, -0.45, 0, 0.12),
    transformPart(new THREE.BoxGeometry(0.11, 0.26, 0.12), 0.24, 0.08, -0.04, -0.35, 0, -0.10),
    // Waist belt
    transformPart(new THREE.BoxGeometry(0.41, 0.065, 0.245), 0, -0.17, 0),
    // Front ammo pouches (-Z is forward)
    transformPart(new THREE.BoxGeometry(0.11, 0.10, 0.065), -0.11, -0.15, -0.135),
    transformPart(new THREE.BoxGeometry(0.11, 0.10, 0.065), 0.11, -0.15, -0.135),
    // Collar
    transformPart(new THREE.CylinderGeometry(0.105, 0.125, 0.075, 8), 0, 0.27, 0),
    // Dorsal haversack / backpack (+Z is rear)
    transformPart(new THREE.BoxGeometry(0.30, 0.30, 0.13), 0, 0.03, 0.165),
    // Rolled bedroll atop pack
    transformPart(new THREE.CylinderGeometry(0.062, 0.062, 0.34, 7), 0, 0.20, 0.155, 0, 0, Math.PI * 0.5)
  ]);
}

function buildHeadGeometry(): THREE.BufferGeometry {
  return mergeParts([
    // Neck
    transformPart(new THREE.CylinderGeometry(0.072, 0.085, 0.09, 7), 0, -0.10, 0.005),
    // Cranium
    transformPart(new THREE.SphereGeometry(0.128, 8, 6), 0, 0, 0, 0, 0, 0, 0.92, 1.05, 0.98),
    // Jaw / chin
    transformPart(new THREE.BoxGeometry(0.13, 0.095, 0.12), 0, -0.055, -0.035),
    // Nose bridge (-Z)
    transformPart(new THREE.BoxGeometry(0.032, 0.045, 0.045), 0, -0.005, -0.12)
  ]);
}

function buildHelmetGeometry(): THREE.BufferGeometry {
  return mergeParts([
    // Helmet dome
    transformPart(
      new THREE.SphereGeometry(0.156, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.54),
      0,
      0,
      0,
      0,
      0,
      0,
      1.02,
      0.94,
      1.08
    ),
    // Rim band
    transformPart(new THREE.CylinderGeometry(0.160, 0.164, 0.032, 10), 0, 0.004, 0),
    // Front visor peak (-Z)
    transformPart(new THREE.BoxGeometry(0.24, 0.028, 0.105), 0, -0.004, -0.135, 0.22),
    // Rear neck-guard skirt (+Z)
    transformPart(new THREE.BoxGeometry(0.31, 0.095, 0.11), 0, -0.036, 0.135, -0.28),
    // Side flares
    transformPart(new THREE.BoxGeometry(0.055, 0.09, 0.23), -0.152, -0.034, 0.02, 0, 0, -0.24),
    transformPart(new THREE.BoxGeometry(0.055, 0.09, 0.23), 0.152, -0.034, 0.02, 0, 0, 0.24)
  ]);
}

function buildLegGeometry(): THREE.BufferGeometry {
  // Hip pivot at y=0 extending down to y=-0.56
  return mergeParts([
    // Trouser thigh
    transformPart(new THREE.BoxGeometry(0.15, 0.27, 0.16), 0, -0.135, 0),
    // Puttee / lower leg gaiter
    transformPart(new THREE.CylinderGeometry(0.070, 0.062, 0.20, 8), 0, -0.36, 0),
    // Boot ankle
    transformPart(new THREE.BoxGeometry(0.12, 0.09, 0.15), 0, -0.485, -0.008),
    // Boot sole/toe (-Z forward)
    transformPart(new THREE.BoxGeometry(0.124, 0.068, 0.22), 0, -0.525, -0.042)
  ]);
}

function buildWeaponGeometry(): THREE.BufferGeometry {
  return mergeParts([
    // Buttstock (+Z rear)
    transformPart(new THREE.BoxGeometry(0.052, 0.11, 0.26), 0, -0.022, 0.25, 0.12),
    // Receiver / wooden-steel body
    transformPart(new THREE.BoxGeometry(0.062, 0.09, 0.34), 0, 0, 0),
    // Forend / handguard
    transformPart(new THREE.BoxGeometry(0.050, 0.062, 0.28), 0, 0.005, -0.28),
    // Steel barrel (-Z forward)
    transformPart(new THREE.CylinderGeometry(0.017, 0.022, 0.42, 6), 0, 0.022, -0.51, Math.PI * 0.5),
    // Front sight
    transformPart(new THREE.BoxGeometry(0.016, 0.034, 0.022), 0, 0.046, -0.68),
    // Magazine
    transformPart(new THREE.BoxGeometry(0.038, 0.14, 0.072), 0, -0.092, -0.05, -0.18)
  ]);
}

export interface Soldier {
  id: number;
  faction: 'ally' | 'enemy';
  role: SoldierRole;
  uniformColor: THREE.Color;
  helmetColor: THREE.Color;

  pos: THREE.Vector3;
  yaw: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  deathTimer: number;
  fallPitch: number;
  fallOffsetY: number;
  fallDir: number;
  fallRoll: number;

  targetPos: THREE.Vector3;
  fireCooldown: number;
  grenadeCooldown: number;
  firstShotGrace: number;
  muzzleTimer: number;
  walkPhase: number;
  isMoving: boolean;
  leftLegRotX: number;
  rightLegRotX: number;
  torsoY: number;
  isCrouching: boolean;
  emplaced: boolean;

  missingHead: boolean;
  missingLeftLeg: boolean;
  missingRightLeg: boolean;
  torsoGore: boolean;

  distToPlayerSq: number;
  isLod0: boolean;
  canFocusPlayer: boolean;
  allyTarget: Soldier | null;
  allyRetargetTimer: number;
}

interface ReinforcementBatch {
  remaining: number;
  roles: SoldierRole[];
  maxSimultaneous: number;
  minZ: number;
  maxZ: number;
  roleCursor: number;
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
  private frameCounter = 0;

  private reinforcementQueue: ReinforcementBatch[] = [];
  private maxSimultaneousEnemies = MAX_SOLDIERS;
  private colorsDirty = false;

  // Spatial Grid 2D (CELL_SIZE = 4) with array pooling for zero per-frame allocations
  private spatialGrid: Map<number, Soldier[]> = new Map();
  private gridPool: Soldier[][] = [];

  // Shared geometries & materials
  private torsoGeo = buildTorsoGeometry();
  private headGeo = buildHeadGeometry();
  private helmetGeo = buildHelmetGeometry();
  private legGeo = buildLegGeometry();
  private rifleGeo = buildWeaponGeometry();

  private uniformMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 });
  private helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62 });
  private skinMat = new THREE.MeshStandardMaterial({ color: 0xc29b7c, roughness: 0.8 });
  private gunMat = new THREE.MeshStandardMaterial({ color: 0x262422, roughness: 0.48, metalness: 0.35 });

  // 6 InstancedMeshes for up to 650 soldiers in 6 draw calls
  private torsoInst: THREE.InstancedMesh;
  private headInst: THREE.InstancedMesh;
  private helmetInst: THREE.InstancedMesh;
  private leftLegInst: THREE.InstancedMesh;
  private rightLegInst: THREE.InstancedMesh;
  private gunInst: THREE.InstancedMesh;
  private allInstancedMeshes: THREE.InstancedMesh[];

  // Reusable math objects (zero allocations per frame)
  private rootObj = new THREE.Object3D();
  private partObj = new THREE.Object3D();
  private tmpMat = new THREE.Matrix4();
  private zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
  private tmpPlayerHead = new THREE.Vector3();
  private tmpEye = new THREE.Vector3();
  private tmpOrigin = new THREE.Vector3();
  private tmpTarget = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpVel = new THREE.Vector3();
  private tmpHitPos = new THREE.Vector3();
  private tmpBlastDir = new THREE.Vector3();

  // Reusable per-frame candidate buffers
  private lod0Candidates: Soldier[] = [];
  private livingAllies: Soldier[] = [];

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

    this.rootObj.rotation.order = 'YXZ';
    this.partObj.rotation.order = 'YXZ';

    this.torsoInst = new THREE.InstancedMesh(this.torsoGeo, this.uniformMat, MAX_SOLDIERS);
    this.headInst = new THREE.InstancedMesh(this.headGeo, this.skinMat, MAX_SOLDIERS);
    this.helmetInst = new THREE.InstancedMesh(this.helmetGeo, this.helmetMat, MAX_SOLDIERS);
    this.leftLegInst = new THREE.InstancedMesh(this.legGeo, this.uniformMat, MAX_SOLDIERS);
    this.rightLegInst = new THREE.InstancedMesh(this.legGeo, this.uniformMat, MAX_SOLDIERS);
    this.gunInst = new THREE.InstancedMesh(this.rifleGeo, this.gunMat, MAX_SOLDIERS);

    this.allInstancedMeshes = [
      this.torsoInst,
      this.headInst,
      this.helmetInst,
      this.leftLegInst,
      this.rightLegInst,
      this.gunInst
    ];

    for (const mesh of this.allInstancedMeshes) {
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      for (let i = 0; i < MAX_SOLDIERS; i++) {
        mesh.setMatrixAt(i, this.zeroMatrix);
        mesh.setColorAt(i, COLOR_WHITE);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
      mesh.count = 0;
      this.scene.add(mesh);
    }
  }

  public clear(): void {
    this.soldiers = [];
    this.reinforcementQueue = [];
    this.maxSimultaneousEnemies = MAX_SOLDIERS;
    this.lod0Candidates.length = 0;
    this.livingAllies.length = 0;
    this.colorsDirty = false;
    this.releaseSpatialGrid();

    for (const mesh of this.allInstancedMeshes) {
      mesh.count = 0;
    }
  }

  public dispose(): void {
    this.clear();
    for (const mesh of this.allInstancedMeshes) {
      this.scene.remove(mesh);
      mesh.dispose();
    }
    this.torsoGeo.dispose();
    this.headGeo.dispose();
    this.helmetGeo.dispose();
    this.legGeo.dispose();
    this.rifleGeo.dispose();
    this.uniformMat.dispose();
    this.helmetMat.dispose();
    this.skinMat.dispose();
    this.gunMat.dispose();
  }

  public spawnAllies(count: number): void {
    const slots = [-24, -18, -11, -5, 3, 10, 17, 24];
    for (let i = 0; i < count; i++) {
      const x = slots[i % slots.length] + (Math.random() - 0.5) * 1.5;
      const z = 30.2 + (Math.abs(x) > 12 ? 1.5 : 0);
      this.spawnSoldier('ally', i % 3 === 0 ? 'assault' : 'rifleman', x, z, false);
    }
    this.syncInstancedMeshes();
  }

  public spawnEmplacedGunners(emplacements: EmplacementSpec[]): void {
    for (const emp of emplacements) {
      if (emp.faction === 'enemy') {
        const s = this.spawnSoldier('enemy', 'mg_gunner', emp.x, emp.z, true);
        if (s) s.yaw = emp.yaw;
      }
    }
    this.syncInstancedMeshes();
  }

  public spawnEnemySquad(count: number, roles: SoldierRole[], minZ = -40, maxZ = -26): void {
    if (count <= 0 || roles.length === 0) return;

    const freeSlots = Math.max(0, MAX_SOLDIERS - this.soldiers.length);
    const immediate = Math.min(count, freeSlots);

    for (let i = 0; i < immediate; i++) {
      const role = roles[i % roles.length];
      const x = (Math.random() - 0.5) * 60;
      const z = THREE.MathUtils.lerp(minZ, maxZ, Math.random());
      this.spawnSoldier('enemy', role, x, z, false);
    }

    if (count > immediate) {
      this.reinforcementQueue.push({
        remaining: count - immediate,
        roles: [...roles],
        maxSimultaneous: MAX_SOLDIERS,
        minZ,
        maxZ,
        roleCursor: immediate
      });
    }

    this.syncInstancedMeshes();
  }

  public queueEnemyWave(
    totalCount: number,
    roles: SoldierRole[],
    maxSimultaneous: number,
    minZ = -46,
    maxZ = -26
  ): void {
    if (totalCount <= 0 || roles.length === 0) return;
    const clampedMax = Math.max(1, Math.min(MAX_SOLDIERS, maxSimultaneous));
    this.maxSimultaneousEnemies = clampedMax;
    this.reinforcementQueue.push({
      remaining: totalCount,
      roles: [...roles],
      maxSimultaneous: clampedMax,
      minZ,
      maxZ,
      roleCursor: 0
    });
  }

  public spawnSoldier(
    faction: 'ally' | 'enemy',
    role: SoldierRole,
    x: number,
    z: number,
    emplaced: boolean
  ): Soldier | null {
    if (this.soldiers.length >= MAX_SOLDIERS) return null;

    const y = this.terrain.getTerrainHeight(x, z);
    const hp = role === 'mg_gunner' ? 120 : role === 'officer' ? 115 : 85;
    const targetZ =
      faction === 'ally'
        ? z
        : role === 'grenadier'
          ? 12 + Math.random() * 6
          : 23 + Math.random() * 8;

    const uniformColor = this.getUniformColor(faction, role);
    const helmetColor =
      faction === 'ally'
        ? COLOR_ALLY_HELMET
        : role === 'officer'
          ? COLOR_OFFICER_HELMET
          : COLOR_ENEMY_HELMET;

    const soldier: Soldier = {
      id: this.nextId++,
      faction,
      role,
      uniformColor,
      helmetColor,
      pos: new THREE.Vector3(x, y, z),
      yaw: faction === 'ally' ? 0 : Math.PI,
      hp,
      maxHp: hp,
      alive: true,
      deathTimer: 0,
      fallPitch: 0,
      fallOffsetY: 0,
      fallDir: 1,
      fallRoll: 0,
      targetPos: new THREE.Vector3(x * 0.72 + (Math.random() - 0.5) * 10, 0, targetZ),
      fireCooldown: 0.6 + Math.random() * 1.1,
      grenadeCooldown: 5 + Math.random() * 6,
      firstShotGrace: 0.35,
      muzzleTimer: 0,
      walkPhase: Math.random() * Math.PI * 2,
      isMoving: false,
      leftLegRotX: 0,
      rightLegRotX: 0,
      torsoY: 0.85,
      isCrouching: false,
      emplaced,
      missingHead: false,
      missingLeftLeg: false,
      missingRightLeg: false,
      torsoGore: false,
      distToPlayerSq: 0,
      isLod0: false,
      canFocusPlayer: false,
      allyTarget: null,
      allyRetargetTimer: 0
    };

    this.soldiers.push(soldier);
    this.insertIntoSpatialGrid(soldier);
    this.colorsDirty = true;
    return soldier;
  }

  public getLivingEnemyCount(): number {
    let count = 0;
    for (let i = 0; i < this.soldiers.length; i++) {
      const s = this.soldiers[i];
      if (s.alive && s.faction === 'enemy') count++;
    }
    return count;
  }

  public getRemainingWaveCount(): number {
    let pending = 0;
    for (let i = 0; i < this.reinforcementQueue.length; i++) {
      pending += this.reinforcementQueue[i].remaining;
    }
    return this.getLivingEnemyCount() + pending;
  }

  public checkBulletHit(
    factionTarget: 'ally' | 'enemy',
    point: THREE.Vector3,
    dir: THREE.Vector3,
    damage: number,
    onKill?: (s: Soldier, isHeadshot: boolean) => void
  ): { hit: boolean; headshot: boolean } {
    const cx = Math.floor(point.x / CELL_SIZE) + 128;
    const cz = Math.floor(point.z / CELL_SIZE) + 128;

    for (let dxCell = -1; dxCell <= 1; dxCell++) {
      const rowBase = (cx + dxCell) * 256;
      for (let dzCell = -1; dzCell <= 1; dzCell++) {
        const cell = this.spatialGrid.get(rowBase + (cz + dzCell));
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const s = cell[i];
          if (!s.alive || s.faction !== factionTarget) continue;

          const dx = point.x - s.pos.x;
          const dz = point.z - s.pos.z;
          if (dx * dx + dz * dz > 0.44 * 0.44) continue;

          const bodyTop = s.pos.y + (s.isCrouching ? 1.1 : 1.56);
          if (point.y < s.pos.y + 0.05 || point.y > bodyTop) continue;

          const headLine = s.pos.y + (s.isCrouching ? 0.85 : 1.24);
          const isHeadshot = point.y >= headLine;
          const finalDmg = isHeadshot ? damage * 2.2 : damage;

          s.hp -= finalDmg;
          this.vfx.spawnBloodSplatter(point, dir, isHeadshot ? 1.5 : 0.9);
          if (s.hp <= 0) {
            s.alive = false;
            s.deathTimer = 0;
            s.fallDir = Math.random() < 0.75 ? 1 : -1;
            s.fallRoll = (Math.random() - 0.5) * 0.48;
            if (isHeadshot) {
              s.missingHead = true;
              this.tmpHitPos.set(s.pos.x, s.pos.y + (s.isCrouching ? 0.92 : 1.28), s.pos.z);
              this.vfx.spawnDismemberment(this.tmpHitPos, 'head', dir);
            }
            onKill?.(s, isHeadshot);
          }
          return { hit: true, headshot: isHeadshot };
        }
      }
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
    const minCx = Math.floor((center.x - radius) / CELL_SIZE) + 128;
    const maxCx = Math.floor((center.x + radius) / CELL_SIZE) + 128;
    const minCz = Math.floor((center.z - radius) / CELL_SIZE) + 128;
    const maxCz = Math.floor((center.z + radius) / CELL_SIZE) + 128;
    const radiusSq = radius * radius;

    for (let cx = minCx; cx <= maxCx; cx++) {
      const rowBase = cx * 256;
      for (let cz = minCz; cz <= maxCz; cz++) {
        const cell = this.spatialGrid.get(rowBase + cz);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const s = cell[i];
          if (!s.alive) continue;
          if (s.faction === 'ally' && fromPlayer) continue;

          const dx = s.pos.x - center.x;
          const dy = s.pos.y - center.y;
          const dz = s.pos.z - center.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq <= radiusSq) {
            const d = Math.sqrt(distSq);
            const falloff = 1 - (d / radius) * 0.65;
            const dmg = maxDamage * falloff;
            s.hp -= dmg;

            this.tmpBlastDir.set(dx, Math.max(0.45, dy + 0.8), dz);
            if (this.tmpBlastDir.lengthSq() < 0.0001) {
              this.tmpBlastDir.set(0, 1, 0);
            } else {
              this.tmpBlastDir.normalize();
            }

            if (s.hp <= 0) {
              s.alive = false;
              s.deathTimer = 0;
              s.fallDir = Math.random() < 0.5 ? 1 : -1;
              s.fallRoll = (Math.random() - 0.5) * 0.72;

              const heavyBlast = d < radius * 0.55 || dmg >= 75;
              this.tmpHitPos.set(s.pos.x, s.pos.y + 0.85, s.pos.z);

              if (heavyBlast) {
                s.torsoGore = true;
                this.colorsDirty = true;
                this.vfx.spawnGoreExplosion(this.tmpHitPos);

                if (Math.random() < 0.45) {
                  s.missingHead = true;
                  this.tmpOrigin.set(s.pos.x, s.pos.y + 1.25, s.pos.z);
                  this.vfx.spawnDismemberment(this.tmpOrigin, 'head', this.tmpBlastDir);
                }
                if (Math.random() < 0.68) {
                  s.missingLeftLeg = true;
                  this.tmpOrigin.set(s.pos.x - 0.12, s.pos.y + 0.35, s.pos.z);
                  this.vfx.spawnDismemberment(this.tmpOrigin, 'leg', this.tmpBlastDir);
                }
                if (Math.random() < 0.68 || (!s.missingHead && !s.missingLeftLeg)) {
                  s.missingRightLeg = true;
                  this.tmpOrigin.set(s.pos.x + 0.12, s.pos.y + 0.35, s.pos.z);
                  this.vfx.spawnDismemberment(this.tmpOrigin, 'leg', this.tmpBlastDir);
                }
                if (d < radius * 0.32 || dmg >= 100) {
                  this.vfx.spawnDismemberment(this.tmpHitPos, 'torso', this.tmpBlastDir);
                }
              } else {
                this.vfx.spawnBloodSplatter(this.tmpHitPos, this.tmpBlastDir, 1.2);
              }
              onKill?.(s);
            } else if (dmg >= 25) {
              this.tmpHitPos.set(s.pos.x, s.pos.y + 0.9, s.pos.z);
              this.vfx.spawnBloodSplatter(this.tmpHitPos, this.tmpBlastDir, 1.0);
            }
          }
        }
      }
    }
  }

  public findAutoAimTarget(
    origin: THREE.Vector3,
    lookDir: THREE.Vector3,
    maxAngleRad = 0.14,
    maxDist = 52
  ): THREE.Vector3 | null {
    this.tmpDir.copy(lookDir).normalize();
    const minCos = Math.cos(maxAngleRad);
    const maxDistSq = maxDist * maxDist;

    let bestDot = minCos;
    let bestSoldier: Soldier | null = null;

    for (let i = 0; i < this.soldiers.length; i++) {
      const s = this.soldiers[i];
      if (!s.alive || s.faction !== 'enemy') continue;

      const tx = s.pos.x - origin.x;
      const ty = s.pos.y + 1.15 - origin.y;
      const tz = s.pos.z - origin.z;
      const distSq = tx * tx + ty * ty + tz * tz;
      if (distSq > maxDistSq || distSq < 0.0001) continue;

      const invDist = 1 / Math.sqrt(distSq);
      const dot = (tx * this.tmpDir.x + ty * this.tmpDir.y + tz * this.tmpDir.z) * invDist;
      if (dot >= bestDot) {
        bestDot = dot;
        bestSoldier = s;
      }
    }

    if (!bestSoldier) return null;
    return new THREE.Vector3(bestSoldier.pos.x, bestSoldier.pos.y + 1.15, bestSoldier.pos.z);
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerEyeY: number,
    playerExposure: number,
    airRaidActive: boolean,
    onRadioShout: (msg: string) => void,
    peekDanger = 0,
    diffConfig: DifficultyModifier = getDifficultyConfig('veteran')
  ): void {
    this.frameCounter++;
    this.drainReinforcementQueue();
    this.rebuildSpatialGrid();

    this.tmpPlayerHead.set(playerPos.x, playerEyeY, playerPos.z);

    // Classify living allies & LOD0 enemy candidates (< 32m, capped at 32 closest)
    this.lod0Candidates.length = 0;
    this.livingAllies.length = 0;

    for (let i = 0; i < this.soldiers.length; i++) {
      const s = this.soldiers[i];
      if (!s.alive) continue;

      if (s.faction === 'ally') {
        this.livingAllies.push(s);
      } else {
        s.isLod0 = false;
        s.canFocusPlayer = false;
        const dx = s.pos.x - playerPos.x;
        const dy = s.pos.y - playerPos.y;
        const dz = s.pos.z - playerPos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        s.distToPlayerSq = distSq;
        if (distSq < LOD0_MAX_DIST_SQ) {
          this.lod0Candidates.push(s);
        }
      }
    }

    if (this.lod0Candidates.length > 1) {
      this.lod0Candidates.sort((a, b) => a.distToPlayerSq - b.distToPlayerSq);
    }
    const lod0Count = Math.min(LOD0_MAX_ENEMIES, this.lod0Candidates.length);
    for (let i = 0; i < lod0Count; i++) {
      const candidate = this.lod0Candidates[i];
      candidate.isLod0 = true;
      if (i < DIRECT_SHOOTER_MAX) {
        candidate.canFocusPlayer = true;
      }
    }

    // Update soldiers (backwards for O(1) swap-and-pop corpse recycling)
    for (let i = this.soldiers.length - 1; i >= 0; i--) {
      const s = this.soldiers[i];

      if (!s.alive) {
        s.deathTimer += dt;
        const fallT = Math.min(1, s.deathTimer / DEATH_FALL_DURATION);
        const fallEase = fallT * fallT;
        s.fallPitch = THREE.MathUtils.lerp(0, s.fallDir * Math.PI * 0.48, fallEase);
        s.fallOffsetY = THREE.MathUtils.lerp(0.02, 0.13, fallEase);
        s.leftLegRotX = THREE.MathUtils.lerp(s.leftLegRotX, 0.14, Math.min(1, dt * 8));
        s.rightLegRotX = THREE.MathUtils.lerp(s.rightLegRotX, -0.08, Math.min(1, dt * 8));
        s.isMoving = false;
        if (s.muzzleTimer > 0) s.muzzleTimer = Math.max(0, s.muzzleTimer - dt);
        if (s.deathTimer > CORPSE_RETENTION_SEC) {
          const lastIdx = this.soldiers.length - 1;
          if (i !== lastIdx) {
            this.soldiers[i] = this.soldiers[lastIdx];
          }
          this.soldiers.pop();
          this.colorsDirty = true;
        }
        continue;
      }

      if (s.muzzleTimer > 0) {
        s.muzzleTimer = Math.max(0, s.muzzleTimer - dt);
      }

      if (s.faction === 'ally') {
        this.updateAlly(s, dt, airRaidActive);
      } else if (s.isLod0) {
        this.updateEnemyLod0(
          s,
          dt,
          playerPos,
          this.tmpPlayerHead,
          playerExposure,
          onRadioShout,
          peekDanger,
          diffConfig
        );
      } else {
        this.updateEnemyLod1(s, dt, playerPos, this.tmpPlayerHead, diffConfig);
      }
    }

    this.syncInstancedMeshes();
  }

  private drainReinforcementQueue(): void {
    if (this.reinforcementQueue.length === 0) return;

    const head = this.reinforcementQueue[0];
    const limit = Math.min(this.maxSimultaneousEnemies, head.maxSimultaneous);
    const livingEnemies = this.getLivingEnemyCount();
    const freeSlots = MAX_SOLDIERS - this.soldiers.length;

    if (livingEnemies >= limit || freeSlots <= 0) return;

    const toSpawn = Math.min(
      REINFORCEMENT_BATCH_SIZE,
      head.remaining,
      limit - livingEnemies,
      freeSlots
    );

    for (let i = 0; i < toSpawn; i++) {
      const role = head.roles[head.roleCursor % head.roles.length];
      head.roleCursor++;
      const x = (Math.random() - 0.5) * 68; // -34 .. 34
      const z = THREE.MathUtils.lerp(head.minZ, head.maxZ, Math.random());
      this.spawnSoldier('enemy', role, x, z, false);
    }

    head.remaining -= toSpawn;
    if (head.remaining <= 0) {
      this.reinforcementQueue.shift();
    }
  }

  private getCellKey(x: number, z: number): number {
    const cx = Math.floor(x / CELL_SIZE) + 128;
    const cz = Math.floor(z / CELL_SIZE) + 128;
    return cx * 256 + cz;
  }

  private releaseSpatialGrid(): void {
    for (const cell of this.spatialGrid.values()) {
      cell.length = 0;
      this.gridPool.push(cell);
    }
    this.spatialGrid.clear();
  }

  private insertIntoSpatialGrid(s: Soldier): void {
    const key = this.getCellKey(s.pos.x, s.pos.z);
    let cell = this.spatialGrid.get(key);
    if (!cell) {
      cell = this.gridPool.pop() ?? [];
      this.spatialGrid.set(key, cell);
    }
    cell.push(s);
  }

  private rebuildSpatialGrid(): void {
    this.releaseSpatialGrid();
    for (let i = 0; i < this.soldiers.length; i++) {
      const s = this.soldiers[i];
      if (s.alive) {
        this.insertIntoSpatialGrid(s);
      }
    }
  }

  private getUniformColor(faction: 'ally' | 'enemy', role: SoldierRole): THREE.Color {
    if (faction === 'ally') return COLOR_ALLY_UNIFORM;
    switch (role) {
      case 'officer':
        return COLOR_ENEMY_OFFICER;
      case 'mg_gunner':
        return COLOR_ENEMY_MG;
      case 'grenadier':
        return COLOR_ENEMY_GRENADIER;
      case 'assault':
        return COLOR_ENEMY_ASSAULT;
      default:
        return COLOR_ENEMY_UNIFORM;
    }
  }

  private updateAlly(s: Soldier, dt: number, airRaidActive: boolean): void {
    s.isMoving = false;
    s.isCrouching = airRaidActive;
    s.torsoY = THREE.MathUtils.lerp(s.torsoY, s.isCrouching ? 0.52 : 0.85, dt * 8);

    s.allyRetargetTimer -= dt;
    if (!s.allyTarget || !s.allyTarget.alive || s.allyRetargetTimer <= 0) {
      s.allyRetargetTimer = 0.25 + Math.random() * 0.2;
      let targetEnemy: Soldier | null = null;
      let bestDistSq = 48 * 48;

      for (let i = 0; i < this.soldiers.length; i++) {
        const other = this.soldiers[i];
        if (!other.alive || other.faction !== 'enemy') continue;
        const dx = other.pos.x - s.pos.x;
        const dy = other.pos.y - s.pos.y;
        const dz = other.pos.z - s.pos.z;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          targetEnemy = other;
        }
      }
      s.allyTarget = targetEnemy;
    }

    const targetEnemy = s.allyTarget;
    if (targetEnemy && !airRaidActive) {
      const dx = targetEnemy.pos.x - s.pos.x;
      const dz = targetEnemy.pos.z - s.pos.z;
      s.yaw = Math.atan2(-dx, -dz);

      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        s.fireCooldown = s.role === 'assault' ? 0.25 + Math.random() * 0.2 : 0.9 + Math.random() * 0.7;
        s.muzzleTimer = s.role === 'assault' ? 0.10 : 0.14;
        this.tmpOrigin.set(s.pos.x, s.pos.y + 1.25, s.pos.z);
        this.tmpTarget.set(
          targetEnemy.pos.x + (Math.random() - 0.5) * 1.1,
          targetEnemy.pos.y + 0.9 + (Math.random() - 0.5) * 0.6,
          targetEnemy.pos.z + (Math.random() - 0.5) * 1.1
        );
        this.tmpDir.subVectors(this.tmpTarget, this.tmpOrigin).normalize();
        this.projectiles.spawnBullet(this.tmpOrigin, this.tmpDir, 130, 26, 'ally');
      }
    }
  }

  private updateEnemyLod0(
    s: Soldier,
    dt: number,
    playerPos: THREE.Vector3,
    playerHead: THREE.Vector3,
    playerExposure: number,
    onRadioShout: (msg: string) => void,
    peekDanger: number,
    diffConfig: DifficultyModifier
  ): void {
    this.tmpEye.set(s.pos.x, s.pos.y + 1.32, s.pos.z);
    const distToPlayer = Math.sqrt(s.distToPlayerSq);
    const canSeePlayer =
      playerExposure >= 0.2 && this.cover.hasLineOfSight(this.tmpEye, playerHead);

    // Movement (non-emplaced)
    if (!s.emplaced) {
      const toTargetX = s.targetPos.x - s.pos.x;
      const toTargetZ = s.targetPos.z - s.pos.z;
      const distTargetSq = toTargetX * toTargetX + toTargetZ * toTargetZ;

      const shouldAdvance =
        distTargetSq > 1.8 * 1.8 && (!canSeePlayer || s.role === 'assault' || distToPlayer > 22);
      if (shouldAdvance) {
        const distTarget = Math.sqrt(distTargetSq);
        const moveSpeed = s.role === 'assault' ? 3.55 : 2.75;
        s.pos.x += (toTargetX / distTarget) * moveSpeed * dt;
        s.pos.z += (toTargetZ / distTarget) * moveSpeed * dt;
        s.pos.y = this.terrain.getTerrainHeight(s.pos.x, s.pos.z);

        s.isMoving = true;
        s.walkPhase += dt * moveSpeed * 3.4;
        const swingAmp = s.role === 'assault' ? 0.72 : 0.62;
        const swing = Math.sin(s.walkPhase) * swingAmp;
        s.leftLegRotX = swing;
        s.rightLegRotX = -swing;
      } else {
        s.isMoving = false;
        s.leftLegRotX = 0;
        s.rightLegRotX = 0;
      }
    } else {
      s.isMoving = false;
    }

    const spreadMult = diffConfig.enemySpreadMult;

    if (canSeePlayer && s.canFocusPlayer) {
      const dx = playerPos.x - s.pos.x;
      const dz = playerPos.z - s.pos.z;
      s.yaw = Math.atan2(-dx, -dz);

      // Grenadier throws grenade into player trench
      if (s.role === 'grenadier' && distToPlayer > 11 && distToPlayer < 29) {
        s.grenadeCooldown -= dt;
        if (s.grenadeCooldown <= 0) {
          s.grenadeCooldown = 8.5 + Math.random() * 4;
          this.tmpVel.set(playerPos.x - s.pos.x, 0, playerPos.z - s.pos.z);
          const horizDist = Math.max(1, this.tmpVel.length());
          this.tmpVel.normalize().multiplyScalar(Math.min(16, horizDist * 0.72));
          this.tmpVel.y = 7.4;
          this.projectiles.spawnGrenade(this.tmpEye, this.tmpVel, 3.3, 'enemy');
          onRadioShout('GRANADA NA TRINCHEIRA! SAIA OU CHUTE DE VOLTA [F]!');
        }
      }

      // First burst grace gives warning before deadly focus when exposed
      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        s.fireCooldown = this.getEnemyFireCooldown(s.role);

        this.tmpDir.subVectors(playerHead, this.tmpEye).normalize();
        let accuracyError =
          playerExposure <= 0.6
            ? THREE.MathUtils.lerp(0.135, 0.036, peekDanger) * spreadMult
            : THREE.MathUtils.lerp(0.068, 0.022, peekDanger) * spreadMult;
        if (s.firstShotGrace > 0) {
          accuracyError += 0.06;
        }
        s.firstShotGrace = Math.max(0, s.firstShotGrace - 0.18);

        this.fireEnemyShot(s, this.tmpEye, this.tmpDir, accuracyError, playerPos.x, distToPlayer);
      }
    } else if (canSeePlayer) {
      s.firstShotGrace = 0.35;
      const targetAlly = Math.random() < 0.55 ? this.findRandomLivingAlly() : null;
      if (targetAlly) {
        this.tmpTarget.set(targetAlly.pos.x, targetAlly.pos.y + 1.0, targetAlly.pos.z);
      } else {
        this.tmpTarget.set(
          playerPos.x + (Math.random() - 0.5) * 3.5,
          Math.max(playerHead.y + 0.65, playerPos.y + 1.45),
          playerPos.z - 0.6
        );
      }

      const dx = this.tmpTarget.x - s.pos.x;
      const dz = this.tmpTarget.z - s.pos.z;
      s.yaw = Math.atan2(-dx, -dz);

      s.fireCooldown -= dt;
      if (s.fireCooldown <= 0) {
        s.fireCooldown =
          s.role === 'mg_gunner' ? 0.18 : s.role === 'assault' ? 0.24 : 1.15 + Math.random() * 0.7;
        this.tmpDir.subVectors(this.tmpTarget, this.tmpEye).normalize();
        this.fireEnemyShot(s, this.tmpEye, this.tmpDir, 0.16 * spreadMult, playerPos.x, distToPlayer);
      }
    } else {
      s.yaw = Math.PI;
      s.firstShotGrace = 0.35;
      this.fireSuppressiveVolley(s, dt, playerPos, playerHead, spreadMult, distToPlayer, false);
    }
  }

  private updateEnemyLod1(
    s: Soldier,
    dt: number,
    playerPos: THREE.Vector3,
    playerHead: THREE.Vector3,
    diffConfig: DifficultyModifier
  ): void {
    // Advance along No Man's Land with terrain height sampled every 2 frames per soldier
    if (!s.emplaced) {
      const toTargetX = s.targetPos.x - s.pos.x;
      const toTargetZ = s.targetPos.z - s.pos.z;
      const distTargetSq = toTargetX * toTargetX + toTargetZ * toTargetZ;

      if (distTargetSq > 1.8 * 1.8) {
        const distTarget = Math.sqrt(distTargetSq);
        const moveSpeed = s.role === 'assault' ? 3.55 : 2.75;
        s.pos.x += (toTargetX / distTarget) * moveSpeed * dt;
        s.pos.z += (toTargetZ / distTarget) * moveSpeed * dt;

        if (((s.id + this.frameCounter) & 1) === 0) {
          s.pos.y = this.terrain.getTerrainHeight(s.pos.x, s.pos.z);
        }

        s.isMoving = true;
        s.walkPhase += dt * moveSpeed * 3.4;
        const swingAmp = s.role === 'assault' ? 0.72 : 0.62;
        const swing = Math.sin(s.walkPhase) * swingAmp;
        s.leftLegRotX = swing;
        s.rightLegRotX = -swing;
      } else {
        s.isMoving = false;
        s.leftLegRotX = 0;
        s.rightLegRotX = 0;
      }
    } else {
      s.isMoving = false;
    }

    s.yaw = Math.PI;
    s.firstShotGrace = 0.35;

    this.tmpEye.set(s.pos.x, s.pos.y + 1.32, s.pos.z);
    const distToPlayer = Math.sqrt(s.distToPlayerSq);
    this.fireSuppressiveVolley(
      s,
      dt,
      playerPos,
      playerHead,
      diffConfig.enemySpreadMult,
      distToPlayer,
      true
    );
  }

  private fireSuppressiveVolley(
    s: Soldier,
    dt: number,
    playerPos: THREE.Vector3,
    playerHead: THREE.Vector3,
    spreadMult: number,
    distToPlayer: number,
    sparseLod1: boolean
  ): void {
    s.fireCooldown -= dt;
    if (s.fireCooldown > 0) return;

    if (sparseLod1) {
      s.fireCooldown = s.role === 'mg_gunner' ? 0.65 + Math.random() * 0.45 : 2.8 + Math.random() * 2.4;
    } else {
      s.fireCooldown = s.role === 'mg_gunner' ? 0.26 : 1.7 + Math.random() * 1.4;
    }

    const targetAlly = this.findRandomLivingAlly();
    if (targetAlly) {
      s.muzzleTimer = s.role === 'mg_gunner' ? 0.10 : 0.14;
      this.tmpTarget.set(targetAlly.pos.x, targetAlly.pos.y + 1.0, targetAlly.pos.z);
      this.tmpDir.subVectors(this.tmpTarget, this.tmpEye).normalize();
      this.tmpDir.x += (Math.random() - 0.5) * 0.14;
      this.tmpDir.y += (Math.random() - 0.5) * 0.1;
      this.tmpDir.normalize();
      this.projectiles.spawnBullet(this.tmpEye, this.tmpDir, 112, 16, 'enemy');
    } else if (distToPlayer < 58) {
      s.muzzleTimer = s.role === 'mg_gunner' ? 0.10 : 0.14;
      this.tmpTarget.set(
        playerPos.x + (Math.random() - 0.5) * 5.0,
        Math.max(playerHead.y + 0.8, playerPos.y + 1.55),
        playerPos.z - 0.6
      );
      this.tmpDir.subVectors(this.tmpTarget, this.tmpEye).normalize();
      const suppressSpread = 0.16 * spreadMult;
      this.tmpDir.x += (Math.random() - 0.5) * suppressSpread;
      this.tmpDir.y += (Math.random() - 0.5) * suppressSpread;
      this.tmpDir.normalize();
      this.projectiles.spawnBullet(this.tmpEye, this.tmpDir, 112, 16, 'enemy');
    }
  }

  private getEnemyFireCooldown(role: SoldierRole): number {
    if (role === 'mg_gunner') return 0.11;
    if (role === 'assault') return 0.16;
    return 0.95 + Math.random() * 0.65;
  }

  private fireEnemyShot(
    s: Soldier,
    enemyEye: THREE.Vector3,
    dir: THREE.Vector3,
    accuracyError: number,
    playerX: number,
    distToPlayer: number
  ): void {
    dir.x += (Math.random() - 0.5) * accuracyError;
    dir.y += (Math.random() - 0.5) * accuracyError;
    dir.z += (Math.random() - 0.5) * accuracyError;
    dir.normalize();

    const dmg = s.role === 'mg_gunner' ? 18 : s.role === 'rifleman' ? 24 : 15;
    s.muzzleTimer = s.role === 'mg_gunner' || s.role === 'assault' ? 0.10 : 0.14;
    this.projectiles.spawnBullet(enemyEye, dir, 118, dmg, 'enemy');

    const pan = Math.max(-1, Math.min(1, (s.pos.x - playerX) / 28));
    if (Math.random() < 0.45) {
      this.audio.playGunshot(s.role === 'mg_gunner' ? 'mg' : 'rifle', distToPlayer, pan);
    }
  }

  private findRandomLivingAlly(): Soldier | null {
    const len = this.livingAllies.length;
    if (len === 0) return null;
    return this.livingAllies[Math.floor(Math.random() * len)];
  }

  private syncInstancedMeshes(): void {
    const count = this.soldiers.length;

    for (let i = 0; i < count; i++) {
      const s = this.soldiers[i];

      const bobY = s.alive && s.isMoving && !s.isCrouching ? Math.abs(Math.sin(s.walkPhase)) * 0.055 : 0;
      const recoilT = s.muzzleTimer > 0 ? Math.min(1, s.muzzleTimer / 0.12) : 0;

      let torsoPitch = 0;
      if (s.alive) {
        if (s.isCrouching) {
          torsoPitch = -0.26;
        } else if (s.isMoving) {
          torsoPitch = s.role === 'assault' ? -0.18 : -0.11;
        } else if (s.emplaced) {
          torsoPitch = -0.08;
        }
        torsoPitch += recoilT * 0.09;
      }

      this.rootObj.position.set(s.pos.x, s.pos.y + s.fallOffsetY + bobY, s.pos.z);
      this.rootObj.rotation.set(s.fallPitch, s.yaw, s.fallRoll);
      this.rootObj.updateMatrix();
      const rootMat = this.rootObj.matrix;

      const isCrouchPose = s.alive && s.isCrouching;
      const hipY = isCrouchPose ? s.torsoY - 0.18 : Math.max(0.48, s.torsoY - 0.27);
      const legScaleY = isCrouchPose ? 0.68 : 1.0;
      const leftRotX = isCrouchPose ? -0.45 : s.leftLegRotX;
      const rightRotX = isCrouchPose ? 0.42 : s.rightLegRotX;

      // Left leg
      if (s.missingLeftLeg) {
        this.leftLegInst.setMatrixAt(i, this.zeroMatrix);
      } else {
        this.partObj.scale.set(1, legScaleY, 1);
        this.partObj.position.set(-0.11, hipY, 0);
        this.partObj.rotation.set(leftRotX, 0, 0);
        this.partObj.updateMatrix();
        this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
        this.leftLegInst.setMatrixAt(i, this.tmpMat);
      }

      // Right leg
      if (s.missingRightLeg) {
        this.rightLegInst.setMatrixAt(i, this.zeroMatrix);
      } else {
        this.partObj.scale.set(1, legScaleY, 1);
        this.partObj.position.set(0.11, hipY, 0);
        this.partObj.rotation.set(rightRotX, 0, 0);
        this.partObj.updateMatrix();
        this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
        this.rightLegInst.setMatrixAt(i, this.tmpMat);
      }

      this.partObj.scale.set(1, 1, 1);

      // Torso
      this.partObj.rotation.set(torsoPitch, 0, 0);
      this.partObj.position.set(0, s.torsoY, 0);
      this.partObj.updateMatrix();
      this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
      this.torsoInst.setMatrixAt(i, this.tmpMat);

      // Head & Helmet
      if (s.missingHead) {
        this.headInst.setMatrixAt(i, this.zeroMatrix);
        this.helmetInst.setMatrixAt(i, this.zeroMatrix);
      } else {
        const sinPitch = Math.sin(torsoPitch);
        const cosPitch = Math.cos(torsoPitch);
        this.partObj.rotation.set(torsoPitch * 0.5, 0, 0);

        this.partObj.position.set(0, s.torsoY + cosPitch * 0.39, sinPitch * 0.38);
        this.partObj.updateMatrix();
        this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
        this.headInst.setMatrixAt(i, this.tmpMat);

        this.partObj.position.set(0, s.torsoY + cosPitch * 0.425, sinPitch * 0.41);
        this.partObj.updateMatrix();
        this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
        this.helmetInst.setMatrixAt(i, this.tmpMat);
      }

      // Gun (with firing recoil kick)
      const gunY = s.torsoY + (isCrouchPose ? 0.04 : 0.06) + recoilT * 0.02;
      const gunZ = (isCrouchPose ? -0.32 : -0.36) + recoilT * 0.13;
      const gunPitch = recoilT * 0.16 + (s.alive && s.isMoving && !isCrouchPose ? -0.06 : 0);
      this.partObj.position.set(0.13, gunY, gunZ);
      this.partObj.rotation.set(gunPitch, 0, 0);
      this.partObj.updateMatrix();
      this.tmpMat.multiplyMatrices(rootMat, this.partObj.matrix);
      this.gunInst.setMatrixAt(i, this.tmpMat);

      if (this.colorsDirty) {
        this.torsoInst.setColorAt(i, s.torsoGore ? COLOR_TORSO_GORE : s.uniformColor);
        this.leftLegInst.setColorAt(i, s.uniformColor);
        this.rightLegInst.setColorAt(i, s.uniformColor);
        this.helmetInst.setColorAt(i, s.helmetColor);
      }
    }

    for (const mesh of this.allInstancedMeshes) {
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (this.colorsDirty) {
      if (this.torsoInst.instanceColor) this.torsoInst.instanceColor.needsUpdate = true;
      if (this.leftLegInst.instanceColor) this.leftLegInst.instanceColor.needsUpdate = true;
      if (this.rightLegInst.instanceColor) this.rightLegInst.instanceColor.needsUpdate = true;
      if (this.helmetInst.instanceColor) this.helmetInst.instanceColor.needsUpdate = true;
      this.colorsDirty = false;
    }
  }
}
