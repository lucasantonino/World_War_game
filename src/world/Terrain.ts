import * as THREE from 'three';
import { Crater, DugoutSpec, MissionConfig, RampSpec, TrenchSegment } from '../types';
import { getProceduralTextures } from '../engine/Textures';

const WORLD_WIDTH = 110;
const WORLD_DEPTH = 120;
const SEG_X = 110;
const SEG_Z = 120;
const MAX_CRATERS = 70;

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
      if (Math.sqrt(res.distSq) <= tr.width * 0.55) {
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
        return d;
      }
    }
    return null;
  }

  public getTerrainHeight(x: number, z: number): number {
    // Organic battlefield mud undulation
    let y =
      Math.sin(x * 0.14) * Math.cos(z * 0.12) * 0.12 +
      Math.sin(x * 0.37 + z * 0.29) * 0.05;

    // 1. Trenches
    let trenchOffset = 0;
    for (const tr of this.trenches) {
      const seg = distToSegmentSq(x, z, tr.x1, tr.z1, tr.x2, tr.z2);
      const dist = Math.sqrt(seg.distSq);
      const halfW = tr.width * 0.5;
      const wallMargin = 0.42;

      if (dist < halfW + wallMargin) {
        const carve = 1 - smoothstep(halfW - 0.15, halfW + wallMargin, dist);
        trenchOffset = Math.min(trenchOffset, -tr.depth * carve);
      } else if (tr.parapetSide !== 'none' && dist < halfW + 1.55) {
        // Raised dirt parapet on front edge
        const isNorthOfTrench = z < seg.cz;
        const matchSide =
          (tr.parapetSide === 'north' && isNorthOfTrench) ||
          (tr.parapetSide === 'south' && !isNorthOfTrench);
        if (matchSide) {
          const ridge =
            Math.sin(smoothstep(halfW + 0.35, halfW + 1.55, dist) * Math.PI) * 0.25;
          y += ridge;
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

    y += trenchOffset;

    // 3. Ramps smoothly bridge trench floor up to ground level
    for (const r of this.ramps) {
      const seg = distToSegmentSq(x, z, r.x1, r.z1, r.x2, r.z2);
      const dist = Math.sqrt(seg.distSq);
      const halfW = r.width * 0.5;
      if (dist <= halfW + 0.35) {
        const rampY = THREE.MathUtils.lerp(r.y1, r.y2, seg.t);
        const blend = 1 - smoothstep(halfW - 0.1, halfW + 0.35, dist);
        y = THREE.MathUtils.lerp(y, rampY, blend);
      }
    }

    // 4. Craters (protected outside dugout interiors)
    const inDugout = this.getDugoutAt(x, z) !== null;
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

    const pos = this.geometry.attributes.position as THREE.BufferAttribute;
    const col = this.geometry.attributes.color as THREE.BufferAttribute;

    const rOuter = radius * 1.3;
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
          const newY = this.getTerrainHeight(vx, vz);
          pos.setY(idx, newY);
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
      for (const c of this.craters) {
        const d = Math.hypot(vx - c.x, vz - c.z);
        if (d < c.radius * 1.1) {
          shade = Math.min(shade, 0.45 + 0.35 * (d / (c.radius * 1.1)));
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
