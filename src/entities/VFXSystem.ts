import * as THREE from 'three';
import { getProceduralTextures } from '../engine/Textures';
import { DestructibleKind, DestructionStage } from '../types';

const MAX_PARTICLES = 320;

const STRUCTURAL_DEBRIS_COLORS: Record<DestructibleKind, number> = {
  sandbag: 0x8c7b5c,
  ruin: 0x6b6a64,
  building: 0x6b6a64,
  bunker_mg: 0x6b6a64,
  bunker_main: 0x6b6a64,
  tree: 0x4d3724,
  fence: 0x4d3724,
  crate_prop: 0x4d3724,
  wire: 0x3b3f3d
};

interface Particle {
  mesh: THREE.Sprite | THREE.Mesh;
  isMesh: boolean;
  vel: THREE.Vector3;
  age: number;
  maxAge: number;
  startScale: number;
  endScale: number;
  gravity: number;
  startOpacity: number;
  groundY?: number;
  isSmokePuff?: boolean;
  isPuddle?: boolean;
  sharedMaterial?: boolean;
  rotSpeed?: number;
  growTime?: number;
  drag?: number;
}

interface FlashLightSlot {
  light: THREE.PointLight;
  age: number;
  maxAge: number;
  maxIntensity: number;
}

export class VFXSystem {
  private scene: THREE.Scene;
  private particles: Particle[] = [];
  private lights: FlashLightSlot[] = [];
  private glowTex: THREE.Texture;
  private smokeTex: THREE.Texture;
  private debrisGeo = new THREE.BoxGeometry(0.14, 0.12, 0.18);
  private headGeo = new THREE.SphereGeometry(0.13, 7, 6);
  private legGeo = new THREE.CylinderGeometry(0.06, 0.052, 0.42, 6);
  private torsoGeo = new THREE.BoxGeometry(0.24, 0.28, 0.16);
  private goreChunkGeo = new THREE.DodecahedronGeometry(0.1, 0);
  private puddleGeo = new THREE.CircleGeometry(0.32, 10);
  private goreMat = new THREE.MeshStandardMaterial({ color: 0x6b0b0b, roughness: 0.55 });
  private uniformGoreMat = new THREE.MeshStandardMaterial({ color: 0x454b3d, roughness: 0.85 });
  private helmetGoreMat = new THREE.MeshStandardMaterial({
    color: 0x3a4035,
    roughness: 0.72,
    metalness: 0.15
  });
  private groundHeightFn: ((x: number, z: number) => number) | null = null;
  private tmpPos = new THREE.Vector3();
  private tmpVel = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.glowTex = getProceduralTextures().radialGlow;
    this.smokeTex = this.buildNeutralSmokeTexture();
    this.puddleGeo.rotateX(-Math.PI * 0.5);

    // Pre-allocate 4 dynamic flash PointLights to stay safely within WebGL uniform budgets
    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xff9b42, 0, 22, 1.7);
      this.scene.add(light);
      this.lights.push({ light, age: 1, maxAge: 1, maxIntensity: 0 });
    }
  }

  public setGroundHeightResolver(fn: (x: number, z: number) => number): void {
    this.groundHeightFn = fn;
  }

  private buildNeutralSmokeTexture(): THREE.Texture {
    if (typeof document === 'undefined') return this.glowTex;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return this.glowTex;

    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    grad.addColorStop(0.42, 'rgba(242, 245, 242, 0.72)');
    grad.addColorStop(0.76, 'rgba(220, 225, 220, 0.28)');
    grad.addColorStop(1, 'rgba(200, 205, 200, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  public clear(): void {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      if (!p.sharedMaterial) {
        (p.mesh.material as THREE.Material).dispose();
      }
    }
    this.particles = [];
    for (const l of this.lights) {
      l.light.intensity = 0;
      l.age = l.maxAge;
    }
  }

  public spawnFlashLight(pos: THREE.Vector3, color: number, intensity: number, duration: number): void {
    let slot = this.lights[0];
    let bestScore = -1;
    for (const l of this.lights) {
      const ratio = l.age / l.maxAge;
      if (ratio >= 1) {
        slot = l;
        break;
      }
      if (ratio > bestScore) {
        bestScore = ratio;
        slot = l;
      }
    }
    slot.light.position.copy(pos);
    slot.light.color.setHex(color);
    slot.light.intensity = intensity;
    slot.maxIntensity = intensity;
    slot.age = 0;
    slot.maxAge = duration;
  }

  private enforceParticlePoolLimit(): void {
    while (this.particles.length >= MAX_PARTICLES) {
      let evictIdx = 0;
      for (let i = 0; i < this.particles.length; i++) {
        if (!this.particles[i].isSmokePuff) {
          evictIdx = i;
          break;
        }
      }
      const evicted = this.particles.splice(evictIdx, 1)[0];
      this.scene.remove(evicted.mesh);
      if (!evicted.sharedMaterial) {
        (evicted.mesh.material as THREE.Material).dispose();
      }
    }
  }

  public spawnSprite(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    colorHex: number,
    startScale: number,
    endScale: number,
    maxAge: number,
    startOpacity = 0.85,
    gravity = 0,
    additive = false
  ): void {
    this.enforceParticlePoolLimit();
    const mat = new THREE.SpriteMaterial({
      map: this.glowTex,
      color: colorHex,
      transparent: true,
      opacity: startOpacity,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);
    sprite.scale.set(startScale, startScale, 1);
    this.scene.add(sprite);

    this.particles.push({
      mesh: sprite,
      isMesh: false,
      vel: vel.clone(),
      age: 0,
      maxAge,
      startScale,
      endScale,
      gravity,
      startOpacity
    });
  }

  public spawnDebrisChunk(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    colorHex: number,
    maxAge: number,
    groundY?: number
  ): void {
    this.enforceParticlePoolLimit();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.9
    });
    const mesh = new THREE.Mesh(this.debrisGeo, mat);
    mesh.position.copy(pos);
    mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    this.scene.add(mesh);

    this.particles.push({
      mesh,
      isMesh: true,
      vel: vel.clone(),
      age: 0,
      maxAge,
      startScale: 1,
      endScale: 0.7,
      gravity: 17.5,
      startOpacity: 1,
      groundY: groundY ?? (pos.y - 0.35)
    });
  }

  public spawnExplosion(pos: THREE.Vector3, scale = 1.0): void {
    this.spawnFlashLight(
      new THREE.Vector3(pos.x, pos.y + 1.2, pos.z),
      0xff8a2b,
      6.5 * scale,
      0.34
    );

    // Core fireball
    this.spawnSprite(
      new THREE.Vector3(pos.x, pos.y + 0.5, pos.z),
      new THREE.Vector3(0, 2.2 * scale, 0),
      0xff9b38,
      1.8 * scale,
      5.2 * scale,
      0.38,
      0.95,
      -1.5,
      true
    );

    // Secondary embers
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + Math.random() * 0.6;
      const spd = (2.5 + Math.random() * 4.5) * scale;
      this.spawnSprite(
        new THREE.Vector3(pos.x, pos.y + 0.35, pos.z),
        new THREE.Vector3(Math.cos(ang) * spd, (4.5 + Math.random() * 5) * scale, Math.sin(ang) * spd),
        0xff6b22,
        1.1 * scale,
        2.5 * scale,
        0.52,
        0.85,
        8,
        true
      );
    }

    // Thick smoke plume
    for (let i = 0; i < 5; i++) {
      this.spawnSprite(
        new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * 1.4 * scale,
          pos.y + 0.4 + Math.random() * 0.8,
          pos.z + (Math.random() - 0.5) * 1.4 * scale
        ),
        new THREE.Vector3((Math.random() - 0.5) * 1.6, 2.8 + Math.random() * 2.5, (Math.random() - 0.5) * 1.6),
        0x242220,
        2.2 * scale,
        6.5 * scale,
        1.9 + Math.random() * 0.8,
        0.72,
        -0.4,
        false
      );
    }

    // Mud & splinter chunks
    const chunkCount = scale > 1.3 ? 12 : 7;
    for (let i = 0; i < chunkCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (2.5 + Math.random() * 7.5) * scale;
      this.spawnDebrisChunk(
        new THREE.Vector3(pos.x, pos.y + 0.3, pos.z),
        new THREE.Vector3(Math.cos(ang) * spd, 6.5 + Math.random() * 7.5 * scale, Math.sin(ang) * spd),
        i % 3 === 0 ? 0x523e2a : 0x362b21,
        1.1 + Math.random() * 0.6
      );
    }
  }

  public spawnBulletImpact(pos: THREE.Vector3, normal: THREE.Vector3, metallic = false): void {
    const color = metallic ? 0xffd27a : 0x6b5c49;
    const count = metallic ? 4 : 3;
    for (let i = 0; i < count; i++) {
      const v = normal
        .clone()
        .multiplyScalar(2.4 + Math.random() * 2.5)
        .add(new THREE.Vector3((Math.random() - 0.5) * 2.6, Math.random() * 2.0, (Math.random() - 0.5) * 2.6));
      this.spawnSprite(
        pos,
        v,
        color,
        metallic ? 0.22 : 0.35,
        metallic ? 0.05 : 0.9,
        metallic ? 0.18 : 0.32,
        metallic ? 0.95 : 0.65,
        metallic ? 9 : 4,
        metallic
      );
    }
  }

  public spawnFlakBurst(pos: THREE.Vector3): void {
    this.spawnSprite(pos, new THREE.Vector3(0, 0.2, 0), 0xffaa44, 1.5, 4.2, 0.24, 0.9, 0, true);
    this.spawnSprite(pos, new THREE.Vector3(0.4, 0.6, 0), 0x1a1a1a, 2.5, 7.5, 2.8, 0.78, 0, false);
  }

  public spawnFlameJet(origin: THREE.Vector3, dir: THREE.Vector3): void {
    this.tmpDir.copy(dir);
    if (this.tmpDir.lengthSq() < 1e-5) {
      this.tmpDir.set(0, 0, 1);
    } else {
      this.tmpDir.normalize();
    }

    // Two glowing flame tongues (yellow-orange core + deep orange envelope), strictly within MAX_PARTICLES=320 & 0 new PointLights
    for (let i = 0; i < 2; i++) {
      const speed = 13.5 + Math.random() * 5.0;
      const spread = 0.16;
      this.tmpVel.set(
        this.tmpDir.x * speed + (Math.random() - 0.5) * speed * spread,
        this.tmpDir.y * speed + 0.55 + Math.random() * 1.1,
        this.tmpDir.z * speed + (Math.random() - 0.5) * speed * spread
      );
      this.tmpPos.copy(origin).addScaledVector(this.tmpDir, 0.25 + i * 0.28);
      const colorHex = i === 0 ? 0xffc642 : 0xff6218;
      this.spawnSprite(
        this.tmpPos,
        this.tmpVel,
        colorHex,
        0.34 + i * 0.1,
        1.25 + Math.random() * 0.45,
        0.34 + Math.random() * 0.14,
        0.92,
        -1.5,
        true
      );
    }

    // Warm dark smoke wisp
    if (Math.random() < 0.5) {
      const speed = 7.2 + Math.random() * 2.5;
      this.tmpVel.set(
        this.tmpDir.x * speed + (Math.random() - 0.5) * 1.5,
        1.5 + Math.random() * 1.4,
        this.tmpDir.z * speed + (Math.random() - 0.5) * 1.5
      );
      this.tmpPos.copy(origin).addScaledVector(this.tmpDir, 0.9);
      this.spawnSprite(
        this.tmpPos,
        this.tmpVel,
        0x2e2521,
        0.48,
        1.85,
        0.65 + Math.random() * 0.25,
        0.52,
        -1.2,
        false
      );
    }
  }

  private spawnDustCloud(
    pos: THREE.Vector3,
    count: number,
    colorHex: number,
    startScale: number,
    endScale: number,
    spread: number,
    maxAge: number,
    opacity = 0.68
  ): void {
    for (let i = 0; i < count; i++) {
      this.spawnSprite(
        new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * spread,
          pos.y + Math.random() * 0.45,
          pos.z + (Math.random() - 0.5) * spread
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 1.4,
          0.9 + Math.random() * 1.4,
          (Math.random() - 0.5) * 1.4
        ),
        colorHex,
        startScale,
        endScale,
        maxAge + Math.random() * 0.4,
        opacity,
        -0.3,
        false
      );
    }
  }

  public spawnStructuralDebris(
    pos: THREE.Vector3,
    kind: DestructibleKind,
    stage: DestructionStage
  ): void {
    if (stage === 0) return;

    const colorHex = STRUCTURAL_DEBRIS_COLORS[kind];
    const chunkCount = stage === 2 ? 10 : 5;
    const groundY = pos.y - 0.6;

    for (let i = 0; i < chunkCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.8 + Math.random() * (stage === 2 ? 5.2 : 3.6);
      this.spawnDebrisChunk(
        new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * 0.6,
          pos.y + (Math.random() - 0.3) * 0.4,
          pos.z + (Math.random() - 0.5) * 0.6
        ),
        new THREE.Vector3(Math.cos(ang) * spd, 3.2 + Math.random() * 4.5, Math.sin(ang) * spd),
        colorHex,
        0.95 + Math.random() * 0.55,
        groundY
      );
    }

    this.spawnDustCloud(
      pos,
      stage === 2 ? 4 : 2,
      kind === 'sandbag' ? 0x8a7d65 : 0x686259,
      stage === 2 ? 1.4 : 1.0,
      stage === 2 ? 3.8 : 2.6,
      0.9,
      1.1,
      0.58
    );
  }

  public spawnTrenchCollapseDebris(pos: THREE.Vector3): void {
    for (let i = 0; i < 8; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.6 + Math.random() * 4.2;
      this.spawnDebrisChunk(
        new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * 0.9,
          pos.y + 0.25,
          pos.z + (Math.random() - 0.5) * 0.9
        ),
        new THREE.Vector3(Math.cos(ang) * spd, 3.5 + Math.random() * 4.2, Math.sin(ang) * spd),
        i % 2 === 0 ? 0x4a3826 : 0x3a2d21,
        1.0 + Math.random() * 0.55,
        pos.y - 0.45
      );
    }

    this.spawnDustCloud(pos, 4, 0x544232, 1.5, 4.2, 1.4, 1.25, 0.66);
  }

  public spawnDugoutCollapseDebris(pos: THREE.Vector3, destroyed: boolean): void {
    const chunkCount = destroyed ? 14 : 8;
    const floorY = pos.y - 1.6;

    for (let i = 0; i < chunkCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.2 + Math.random() * (destroyed ? 4.8 : 3.0);
      this.spawnDebrisChunk(
        new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * 2.2,
          pos.y - Math.random() * 0.25,
          pos.z + (Math.random() - 0.5) * 1.8
        ),
        new THREE.Vector3(
          Math.cos(ang) * spd,
          destroyed ? 2.2 + Math.random() * 3.8 : 0.8 + Math.random() * 2.2,
          Math.sin(ang) * spd
        ),
        i % 2 === 0 ? 0x4a3520 : 0x3a2818,
        1.2 + Math.random() * 0.6,
        floorY
      );
    }

    this.spawnDustCloud(
      new THREE.Vector3(pos.x, floorY + 0.6, pos.z),
      destroyed ? 6 : 4,
      destroyed ? 0x332b24 : 0x4a3d31,
      destroyed ? 2.2 : 1.5,
      destroyed ? 5.6 : 3.8,
      2.2,
      destroyed ? 1.8 : 1.35,
      destroyed ? 0.78 : 0.65
    );
  }

  private spawnBloodPuddle(
    x: number,
    fallbackY: number,
    z: number,
    startScale: number,
    endScale: number,
    maxAge: number
  ): void {
    this.enforceParticlePoolLimit();
    const gy = this.groundHeightFn ? this.groundHeightFn(x, z) + 0.035 : fallbackY;
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4f0606,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1
    });
    const mesh = new THREE.Mesh(this.puddleGeo, mat);
    mesh.position.set(x, gy, z);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.scale.set(startScale, 1, startScale);
    this.scene.add(mesh);

    this.particles.push({
      mesh,
      isMesh: true,
      isPuddle: true,
      vel: new THREE.Vector3(0, 0, 0),
      age: 0,
      maxAge,
      startScale,
      endScale,
      gravity: 0,
      startOpacity: 0.78
    });
  }

  private spawnGoreFragment(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    maxAge: number,
    groundY: number
  ): void {
    this.enforceParticlePoolLimit();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    this.scene.add(mesh);

    this.particles.push({
      mesh,
      isMesh: true,
      sharedMaterial: true,
      vel: vel.clone(),
      age: 0,
      maxAge,
      startScale: 1,
      endScale: 0.92,
      gravity: 17.8,
      startOpacity: 1,
      groundY
    });
  }

  public spawnBloodSplatter(pos: THREE.Vector3, dir?: THREE.Vector3, intensity = 1.0): void {
    const power = Math.max(0.4, Math.min(2.2, intensity));
    const dropCount = Math.min(9, Math.max(3, Math.round(5 * power)));
    const hasDir = Boolean(dir && dir.lengthSq() > 1e-4);
    if (hasDir && dir) {
      this.tmpDir.copy(dir).normalize();
    }

    for (let i = 0; i < dropCount; i++) {
      this.enforceParticlePoolLimit();
      if (hasDir) {
        const forwardSpd = (1.8 + Math.random() * 3.4) * power;
        this.tmpVel.set(
          this.tmpDir.x * forwardSpd + (Math.random() - 0.5) * 2.4 * power,
          0.9 + Math.random() * 2.6 * power,
          this.tmpDir.z * forwardSpd + (Math.random() - 0.5) * 2.4 * power
        );
      } else {
        const ang = Math.random() * Math.PI * 2;
        const spd = (1.1 + Math.random() * 2.6) * power;
        this.tmpVel.set(Math.cos(ang) * spd, 1.4 + Math.random() * 2.8 * power, Math.sin(ang) * spd);
      }

      const mat = new THREE.SpriteMaterial({
        map: this.smokeTex,
        color: i % 3 === 0 ? 0x540505 : i % 2 === 0 ? 0x7c0b0b : 0x941313,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(
        pos.x + (Math.random() - 0.5) * 0.14,
        pos.y + (Math.random() - 0.5) * 0.14,
        pos.z + (Math.random() - 0.5) * 0.14
      );
      const s0 = (0.18 + Math.random() * 0.12) * Math.min(1.4, power);
      sprite.scale.set(s0, s0, 1);
      this.scene.add(sprite);

      this.particles.push({
        mesh: sprite,
        isMesh: false,
        vel: this.tmpVel.clone(),
        age: 0,
        maxAge: 0.34 + Math.random() * 0.28,
        startScale: s0,
        endScale: s0 * 0.45,
        gravity: 15.5,
        startOpacity: 0.9
      });
    }

    const px = pos.x + (hasDir ? this.tmpDir.x * 0.35 : 0) + (Math.random() - 0.5) * 0.25;
    const pz = pos.z + (hasDir ? this.tmpDir.z * 0.35 : 0) + (Math.random() - 0.5) * 0.25;
    this.spawnBloodPuddle(
      px,
      pos.y - 0.82,
      pz,
      0.38 * Math.min(1.5, power),
      1.05 * Math.min(1.5, power),
      4.2 + Math.random() * 1.8
    );
  }

  public spawnDismemberment(
    pos: THREE.Vector3,
    type: 'head' | 'leg' | 'torso',
    blastDir?: THREE.Vector3
  ): void {
    const hasDir = Boolean(blastDir && blastDir.lengthSq() > 1e-4);
    if (hasDir && blastDir) {
      this.tmpDir.copy(blastDir).normalize();
    }
    const groundY = this.groundHeightFn ? this.groundHeightFn(pos.x, pos.z) + 0.08 : pos.y - 0.35;

    const specs: Array<{ geo: THREE.BufferGeometry; mat: THREE.Material }> =
      type === 'head'
        ? [
            { geo: this.headGeo, mat: this.helmetGoreMat },
            { geo: this.goreChunkGeo, mat: this.goreMat }
          ]
        : type === 'leg'
          ? [
              { geo: this.legGeo, mat: this.uniformGoreMat },
              { geo: this.goreChunkGeo, mat: this.goreMat }
            ]
          : [
              { geo: this.torsoGeo, mat: this.uniformGoreMat },
              { geo: this.legGeo, mat: this.uniformGoreMat },
              { geo: this.goreChunkGeo, mat: this.goreMat }
            ];

    for (let i = 0; i < specs.length; i++) {
      const ang = Math.random() * Math.PI * 2;
      const lateral = 2.2 + Math.random() * 3.8;
      this.tmpVel.set(
        Math.cos(ang) * lateral + (hasDir ? this.tmpDir.x * 3.8 : 0),
        4.6 + Math.random() * 4.2,
        Math.sin(ang) * lateral + (hasDir ? this.tmpDir.z * 3.8 : 0)
      );
      this.tmpPos.set(
        pos.x + (Math.random() - 0.5) * 0.22,
        pos.y + 0.25 + Math.random() * 0.35,
        pos.z + (Math.random() - 0.5) * 0.22
      );
      this.spawnGoreFragment(
        this.tmpPos,
        this.tmpVel,
        specs[i].geo,
        specs[i].mat,
        3.2 + Math.random() * 1.4,
        groundY
      );
    }

    this.spawnBloodSplatter(pos, blastDir, 1.5);
  }

  public spawnGoreExplosion(pos: THREE.Vector3): void {
    // Dense crimson mist
    for (let i = 0; i < 5; i++) {
      this.enforceParticlePoolLimit();
      const ang = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
      const spd = 1.2 + Math.random() * 2.4;
      this.tmpVel.set(Math.cos(ang) * spd, 1.1 + Math.random() * 1.8, Math.sin(ang) * spd);
      const mat = new THREE.SpriteMaterial({
        map: this.smokeTex,
        color: i % 2 === 0 ? 0x6b0808 : 0x450404,
        transparent: true,
        opacity: 0.82,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(
        pos.x + (Math.random() - 0.5) * 0.5,
        pos.y + 0.45 + Math.random() * 0.45,
        pos.z + (Math.random() - 0.5) * 0.5
      );
      sprite.scale.set(0.75, 0.75, 1);
      this.scene.add(sprite);

      this.particles.push({
        mesh: sprite,
        isMesh: false,
        vel: this.tmpVel.clone(),
        age: 0,
        maxAge: 0.75 + Math.random() * 0.35,
        startScale: 0.75,
        endScale: 2.35,
        gravity: 1.8,
        startOpacity: 0.82,
        growTime: 0.45,
        drag: 2.2
      });
    }

    // Multiple anatomical/gore fragments
    const groundY = this.groundHeightFn ? this.groundHeightFn(pos.x, pos.z) + 0.08 : pos.y + 0.04;
    const fragGeos = [this.torsoGeo, this.legGeo, this.goreChunkGeo, this.goreChunkGeo];
    const fragMats = [this.uniformGoreMat, this.uniformGoreMat, this.goreMat, this.goreMat];
    for (let i = 0; i < fragGeos.length; i++) {
      const ang = (i / fragGeos.length) * Math.PI * 2 + Math.random() * 0.7;
      const spd = 3.2 + Math.random() * 4.6;
      this.tmpVel.set(Math.cos(ang) * spd, 5.2 + Math.random() * 4.8, Math.sin(ang) * spd);
      this.tmpPos.set(pos.x, pos.y + 0.35, pos.z);
      this.spawnGoreFragment(
        this.tmpPos,
        this.tmpVel,
        fragGeos[i],
        fragMats[i],
        3.5 + Math.random() * 1.4,
        groundY
      );
    }

    // Larger blood pool on ground
    this.spawnBloodPuddle(pos.x, pos.y + 0.035, pos.z, 0.75, 1.85, 5.4);
  }

  public spawnPersistentSmokeScreen(
    pos: THREE.Vector3,
    radius = 6.2,
    duration = 14.0
  ): void {
    const puffCount = radius >= 5.5 ? 16 : radius >= 4.2 ? 10 : 7;
    const palette = [0xc2cbc2, 0xaeb9ae, 0xd4dad2, 0x9aa69b];

    for (let i = 0; i < puffCount; i++) {
      this.enforceParticlePoolLimit();
      const ringFactor = i < 4 ? 0.18 + Math.random() * 0.25 : 0.35 + Math.random() * 0.55;
      const ang = (i / puffCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.55;
      const dist = radius * ringFactor * 0.72;
      const px = pos.x + Math.cos(ang) * dist;
      const pz = pos.z + Math.sin(ang) * dist;
      const py = pos.y + 0.65 + Math.random() * Math.min(2.6, radius * 0.42);

      const outSpd = 0.7 + Math.random() * 1.4;
      this.tmpVel.set(
        Math.cos(ang) * outSpd + (Math.random() - 0.5) * 0.35,
        0.35 + Math.random() * 0.55,
        Math.sin(ang) * outSpd + (Math.random() - 0.5) * 0.35
      );

      const startScale = radius * (0.42 + Math.random() * 0.16);
      const endScale = radius * (0.95 + Math.random() * 0.38);
      const baseLife = Math.min(duration, 10.5 + Math.random() * 3.5);
      const life = duration < 10.5 ? duration * (0.85 + Math.random() * 0.15) : baseLife;
      const opacity = 0.56 + Math.random() * 0.16;

      const mat = new THREE.SpriteMaterial({
        map: this.smokeTex,
        color: palette[i % palette.length],
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        rotation: Math.random() * Math.PI * 2
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(px, py, pz);
      sprite.scale.set(startScale, startScale, 1);
      this.scene.add(sprite);

      this.particles.push({
        mesh: sprite,
        isMesh: false,
        isSmokePuff: true,
        vel: this.tmpVel.clone(),
        age: 0,
        maxAge: life,
        startScale,
        endScale,
        gravity: -0.05,
        startOpacity: opacity,
        rotSpeed: (Math.random() - 0.5) * 0.24,
        growTime: 1.25 + Math.random() * 0.45,
        drag: 1.45
      });
    }
  }

  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.maxAge) {
        this.scene.remove(p.mesh);
        if (!p.sharedMaterial) {
          (p.mesh.material as THREE.Material).dispose();
        }
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.age / p.maxAge;
      if (p.isPuddle) {
        const spreadT = Math.min(1, p.age / 0.65);
        const eased = spreadT * (2 - spreadT);
        const s = THREE.MathUtils.lerp(p.startScale, p.endScale, eased);
        p.mesh.scale.set(s, 1, s);
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = t > 0.7 ? p.startOpacity * (1 - (t - 0.7) / 0.3) : p.startOpacity;
        continue;
      }

      if (p.drag) {
        const damp = Math.max(0, 1 - p.drag * dt);
        p.vel.x *= damp;
        p.vel.z *= damp;
      }
      p.vel.y -= p.gravity * dt;
      p.mesh.position.addScaledVector(p.vel, dt);

      if (p.isMesh) {
        const gy =
          this.groundHeightFn !== null
            ? this.groundHeightFn(p.mesh.position.x, p.mesh.position.z) + 0.08
            : p.groundY;
        if (gy !== undefined && p.mesh.position.y < gy && p.vel.y < 0) {
          p.mesh.position.y = gy;
          p.vel.y = -p.vel.y * 0.35;
          p.vel.x *= 0.65;
          p.vel.z *= 0.65;
        }
        const s = THREE.MathUtils.lerp(p.startScale, p.endScale, t);
        p.mesh.scale.setScalar(s);
        if (gy === undefined || p.mesh.position.y > gy + 0.04 || Math.abs(p.vel.y) > 0.25) {
          p.mesh.rotation.x += dt * 7;
          p.mesh.rotation.y += dt * 5;
        }
      } else if (p.isSmokePuff) {
        const growDur = p.growTime ?? 1.35;
        const growT = Math.min(1, p.age / growDur);
        const easedGrow = growT * (2 - growT);
        const baseScale = THREE.MathUtils.lerp(p.startScale, p.endScale, easedGrow);
        const driftScale = baseScale * (1 + t * 0.12);
        p.mesh.scale.set(driftScale, driftScale, 1);

        const mat = p.mesh.material as THREE.SpriteMaterial;
        mat.rotation += (p.rotSpeed ?? 0) * dt;
        const fadeIn = Math.min(1, p.age / 0.38);
        const remaining = p.maxAge - p.age;
        const fadeOut = remaining < 2.4 ? Math.max(0, remaining / 2.4) : 1;
        mat.opacity = p.startOpacity * fadeIn * fadeOut;
      } else {
        const growT = p.growTime ? Math.min(1, p.age / p.growTime) : t;
        const s = THREE.MathUtils.lerp(p.startScale, p.endScale, growT);
        p.mesh.scale.set(s, s, 1);
        const mat = p.mesh.material as THREE.SpriteMaterial;
        mat.opacity = p.startOpacity * (1 - t * t);
      }
    }

    for (const l of this.lights) {
      if (l.age < l.maxAge) {
        l.age += dt;
        const t = Math.min(1, l.age / l.maxAge);
        l.light.intensity = l.maxIntensity * (1 - t);
      } else {
        l.light.intensity = 0;
      }
    }
  }
}
