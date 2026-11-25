import * as THREE from 'three';
import {
  Crater,
  DestructionStage,
  DugoutSpec,
  MissionConfig,
  RampSpec,
  TrenchCollapse,
  TrenchSegment
} from '../types';
import { getProceduralTextures } from '../engine/Textures';

const WORLD_WIDTH = 170;
const WORLD_DEPTH = 190;
const SEG_X = 150;
const SEG_Z = 170;
const MAX_CRATERS = 95;
const MAX_TRENCH_COLLAPSES = 45;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function distToSegmentSq(
  px: number,
  pz: number,
  x1: number,
  z1: number,
  x2: number,
  z2: number
): { distSq: number; t: number; cx: number; cz: number } {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const lenSq = dx * dx + dz * dz;
  if (lenSq < 1e-6) {
    const ex = px - x1;
    const ez = pz - z1;
    return { distSq: ex * ex + ez * ez, t: 0, cx: x1, cz: z1 };
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (pz - z1) * dz) / lenSq));
  const cx = x1 + t * dx;
  const cz = z1 + t * dz;
  const ex = px - cx;
  const ez = pz - cz;
  return { distSq: ex * ex + ez * ez, t, cx, cz };
}

export class Terrain {
  public readonly mesh: THREE.Mesh;
  public readonly geometry: THREE.PlaneGeometry;
  public readonly craters: Crater[] = [];

  private trenches: TrenchSegment[] = [];
  private dugouts: DugoutSpec[] = [];
  private ramps: RampSpec[] = [];
  private trenchCollapses: TrenchCollapse[] = [];
  private dugoutStages = new Map<string, DestructionStage>();
  private normalsDirty = false;

  constructor() {
    this.geometry = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH, SEG_X, SEG_Z);
    this.geometry.rotateX(-Math.PI / 2);

    const count = this.geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = 0.85;
      colors[i * 3 + 1] = 0.82;
      colors[i * 3 + 2] = 0.78;
    }
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const tex = getProceduralTextures().mud;
    tex.repeat.set(30, 34);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      vertexColors: true,
      roughness: 0.94,
      metalness: 0.04
    });

    this.mesh = new THREE.Mesh(this.geometry, mat);
    this.mesh.receiveShadow = true;
    this.mesh.name = 'terrain';
  }

  public loadMission(config: MissionConfig): void {
    this.trenches = config.trenches;
    this.dugouts = config.dugouts;
    this.ramps = config.ramps;
    this.craters.length = 0;
    for (const c of config.initialCraters) {
      this.craters.push({ ...c });
    }
    this.trenchCollapses = [];
    this.dugoutStages.clear();
    for (const d of config.dugouts) {
      this.dugoutStages.set(d.id, 0);
    }
    this.rebuildAllVertices();
  }

  public getWorldBounds(): { minX: number; maxX: number; minZ: number; maxZ: number } {
    return {
      minX: -WORLD_WIDTH * 0.46,
      maxX: WORLD_WIDTH * 0.46,
      minZ: -WORLD_DEPTH * 0.46,
      maxZ: WORLD_DEPTH * 0.46
    };
  }

  public isInsideTrenchOrDugout(x: number, z: number): boolean {
    for (const d of this.dugouts) {
      if (
        Math.abs(x - d.x) <= d.width * 0.52 &&
        Math.abs(z - d.z) <= d.depth * 0.52
      ) {
        return true;
      }
    }
    for (const tr of this.trenches) {
      const res = distToSegmentSq(x, z, tr.x1, tr.z1, tr.x2, tr.z2);
      const r = tr.width * 0.55;
      if (res.distSq <= r * r) {
        return true;
      }
    }
    return false;
  }

  public getDugoutAt(x: number, z: number): DugoutSpec | null {
    for (const d of this.dugouts) {
      if (
        Math.abs(x - d.x) <= d.width * 0.48 &&
        Math.abs(z - d.z) <= d.depth * 0.48
      ) {
        if ((this.dugoutStages.get(d.id) ?? 0) >= 2) {
          return null;
        }
        return d;
      }
    }
    return null;
  }

  public getDugoutStage(id: string): DestructionStage {
    return this.dugoutStages.get(id) ?? 0;
  }

  public damageDugoutAt(
    x: number,
    z: number,
    blastRadius: number
  ): { dugout: DugoutSpec; newStage: DestructionStage } | null {
    if (blastRadius < 5.5) return null;
    for (const d of this.dugouts) {
      const cur = this.dugoutStages.get(d.id) ?? 0;
      if (cur >= 2) continue;
      if (Math.hypot(x - d.x, z - d.z) <= Math.max(d.width, d.depth) * 0.75 + 2.2) {
        const next = (cur + 1) as DestructionStage;
        this.dugoutStages.set(d.id, next);
        return { dugout: d, newStage: next };
      }
    }
    return null;
  }

  public collapseTrenchAt(x: number, z: number, blastRadius: number): boolean {
    if (this.getDugoutAt(x, z) !== null) return false;

    const maxDist = blastRadius + 1.8;
    const maxDistSq = maxDist * maxDist;
    let nearTrench = false;
    for (const tr of this.trenches) {
      const seg = distToSegmentSq(x, z, tr.x1, tr.z1, tr.x2, tr.z2);
      if (seg.distSq <= maxDistSq) {
        nearTrench = true;
        break;
      }
    }
    if (!nearTrench) return false;

    const radius = Math.min(4.0, Math.max(2.2, blastRadius * 0.7));
    if (this.trenchCollapses.length >= MAX_TRENCH_COLLAPSES) {
      this.trenchCollapses.shift();
    }
    this.trenchCollapses.push({ x, z, radius, depthLoss: 0.46 });

    const rOuter = radius * 1.3;
    this.updateLocalVertices(x, z, rOuter, (idx, dist, col) => {
      const darken = 0.82 + 0.18 * smoothstep(0, rOuter, dist);
      const prevR = col.getX(idx);
      const prevG = col.getY(idx);
      const prevB = col.getZ(idx);
      col.setXYZ(
        idx,
        Math.max(0.28, prevR * darken),
        Math.max(0.26, prevG * darken),
        Math.max(0.24, prevB * darken)
      );
    });

    return true;
  }

  public getTerrainHeight(x: number, z: number): number {
    // Organic battlefield mud undulation
    let y =
      Math.sin(x * 0.14) * Math.cos(z * 0.12) * 0.12 +
      Math.sin(x * 0.37 + z * 0.29) * 0.05;

    // 1. Trenches
    let trenchOffset = 0;
    let parapetOffset = 0;
    for (let i = 0; i < this.trenches.length; i++) {
      const tr = this.trenches[i];
      const halfW = tr.width * 0.5;
      const wallMargin = 0.42;
      const maxOuter = tr.parapetSide !== 'none' ? halfW + 1.55 : halfW + wallMargin;
      const seg = distToSegmentSq(x, z, tr.x1, tr.z1, tr.x2, tr.z2);
      if (seg.distSq >= maxOuter * maxOuter) continue;

      const dist = Math.sqrt(seg.distSq);
      if (dist < halfW + wallMargin) {
        const carve = 1 - smoothstep(halfW - 0.15, halfW + wallMargin, dist);
        trenchOffset = Math.min(trenchOffset, -tr.depth * carve);
      } else if (tr.parapetSide !== 'none') {
        // Raised dirt parapet on front edge
        const isNorthOfTrench = z < seg.cz;
        const matchSide =
          (tr.parapetSide === 'north' && isNorthOfTrench) ||
          (tr.parapetSide === 'south' && !isNorthOfTrench);
        if (matchSide) {
          const ridge =
            Math.sin(smoothstep(halfW + 0.35, halfW + 1.55, dist) * Math.PI) * 0.25;
          parapetOffset += ridge;
        }
      }
    }

    // 2. Dugouts carve down flat to floorY
    for (const d of this.dugouts) {
      const dx = Math.abs(x - d.x) - d.width * 0.5;
      const dz = Math.abs(z - d.z) - d.depth * 0.5;
      const boxDist = Math.max(dx, dz);
      if (boxDist < 0.35) {
        const carve = 1 - smoothstep(-0.15, 0.35, boxDist);
        trenchOffset = Math.min(trenchOffset, d.floorY * carve);
      }
    }

    const inDugout = this.getDugoutAt(x, z) !== null;

    if (this.trenchCollapses.length > 0) {
      let collapseLift = 0;
      let collapseNorm = 0;
      for (const tc of this.trenchCollapses) {
        const dx = x - tc.x;
        const dz = z - tc.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < tc.radius * tc.radius) {
          const d = Math.sqrt(dSq);
          const factor = Math.cos((d / tc.radius) * Math.PI * 0.5);
          collapseNorm = Math.max(collapseNorm, factor);
          collapseLift = Math.max(collapseLift, tc.depthLoss * factor);
        }
      }
      if (parapetOffset > 0 && collapseNorm > 0) {
        parapetOffset *= 1 - collapseNorm * 0.75;
      }
      if (trenchOffset < -0.2 && collapseLift > 0 && !inDugout) {
        trenchOffset += Math.min(-trenchOffset * 0.75, collapseLift);
      }
    }

    y += parapetOffset + trenchOffset;

    // 3. Ramps smoothly bridge trench floor up to ground level
    for (let i = 0; i < this.ramps.length; i++) {
      const r = this.ramps[i];
      const halfW = r.width * 0.5;
      const maxOuter = halfW + 0.35;
      const seg = distToSegmentSq(x, z, r.x1, r.z1, r.x2, r.z2);
      if (seg.distSq <= maxOuter * maxOuter) {
        const dist = Math.sqrt(seg.distSq);
        const rampY = THREE.MathUtils.lerp(r.y1, r.y2, seg.t);
        const blend = 1 - smoothstep(halfW - 0.1, maxOuter, dist);
        y = THREE.MathUtils.lerp(y, rampY, blend);
      }
    }

    // 4. Craters (protected outside dugout interiors)
    if (!inDugout) {
      for (const c of this.craters) {
        const dx = x - c.x;
        const dz = z - c.z;
        const dSq = dx * dx + dz * dz;
        const rimOuter = c.radius * 1.25;
        if (dSq < rimOuter * rimOuter) {
          const d = Math.sqrt(dSq);
          if (d < c.radius) {
            const bowl = Math.cos((d / c.radius) * Math.PI * 0.5);
            y -= c.depth * bowl;
          } else {
            const rimT = (d - c.radius) / (rimOuter - c.radius);
            y += Math.sin(rimT * Math.PI) * 0.15;
          }
        }
      }
    }

    return y;
  }

  public addCrater(x: number, z: number, radius: number, depth: number): void {
    // Do not cave in the floor inside dugouts
    if (this.getDugoutAt(x, z)) return;

    const crater: Crater = { x, z, radius, depth };
    if (this.craters.length >= MAX_CRATERS) {
      this.craters.shift();
    }
    this.craters.push(crater);

    const rOuter = radius * 1.3;
    this.updateLocalVertices(x, z, rOuter, (idx, dist, col) => {
      const scorch = 1 - smoothstep(0, radius * 1.15, dist) * 0.55;
      const prevR = col.getX(idx);
      const prevG = col.getY(idx);
      const prevB = col.getZ(idx);
      col.setXYZ(
        idx,
        Math.min(prevR, 0.85 * scorch),
        Math.min(prevG, 0.78 * scorch),
        Math.min(prevB, 0.72 * scorch)
      );
    });
  }

  private updateLocalVertices(
    x: number,
    z: number,
    rOuter: number,
    shadeVertex: (idx: number, dist: number, col: THREE.BufferAttribute) => void
  ): void {
    const pos = this.geometry.attributes.position as THREE.BufferAttribute;
    const col = this.geometry.attributes.color as THREE.BufferAttribute;

    const minCol = Math.max(0, Math.floor((x - rOuter + WORLD_WIDTH * 0.5) / (WORLD_WIDTH / SEG_X)));
    const maxCol = Math.min(SEG_X, Math.ceil((x + rOuter + WORLD_WIDTH * 0.5) / (WORLD_WIDTH / SEG_X)));
    const minRow = Math.max(0, Math.floor((z - rOuter + WORLD_DEPTH * 0.5) / (WORLD_DEPTH / SEG_Z)));
    const maxRow = Math.min(SEG_Z, Math.ceil((z + rOuter + WORLD_DEPTH * 0.5) / (WORLD_DEPTH / SEG_Z)));

    const stride = SEG_X + 1;
    for (let row = minRow; row <= maxRow; row++) {
      for (let colIdx = minCol; colIdx <= maxCol; colIdx++) {
        const idx = row * stride + colIdx;
        const vx = pos.getX(idx);
        const vz = pos.getZ(idx);
        const dist = Math.hypot(vx - x, vz - z);
        if (dist <= rOuter) {
          pos.setY(idx, this.getTerrainHeight(vx, vz));
          shadeVertex(idx, dist, col);
        }
      }
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
    this.normalsDirty = true;
  }

  public flushDirtyNormals(): void {
    if (this.normalsDirty) {
      this.geometry.computeVertexNormals();
      this.normalsDirty = false;
    }
  }

  private rebuildAllVertices(): void {
    const pos = this.geometry.attributes.position as THREE.BufferAttribute;
    const col = this.geometry.attributes.color as THREE.BufferAttribute;
    const craterCount = this.craters.length;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const y = this.getTerrainHeight(vx, vz);
      pos.setY(i, y);

      let shade = 0.86;
      if (y < -0.35) {
        shade = 0.62;
      } else if (y > 0.14) {
        shade = 0.94;
      }
      for (let ci = 0; ci < craterCount; ci++) {
        const c = this.craters[ci];
        const rShade = c.radius * 1.1;
        const dx = vx - c.x;
        const dz = vz - c.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < rShade * rShade) {
          shade = Math.min(shade, 0.45 + 0.35 * (Math.sqrt(dSq) / rShade));
        }
      }
      col.setXYZ(i, shade, shade * 0.96, shade * 0.91);
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.normalsDirty = false;
  }

  public dispose(): void {
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
