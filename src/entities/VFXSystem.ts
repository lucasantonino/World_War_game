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
  private debrisGeo = new THREE.BoxGeometry(0.14, 0.12, 0.18);

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.glowTex = getProceduralTextures().radialGlow;

    // Pre-allocate 4 dynamic flash PointLights to stay safely within WebGL uniform budgets
    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xff9b42, 0, 22, 1.7);
      this.scene.add(light);
      this.lights.push({ light, age: 1, maxAge: 1, maxIntensity: 0 });
    }
  }

  public clear(): void {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      (p.mesh.material as THREE.Material).dispose();
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
      const oldest = this.particles.shift()!;
      this.scene.remove(oldest.mesh);
      (oldest.mesh.material as THREE.Material).dispose();
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

  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.maxAge) {
        this.scene.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.age / p.maxAge;
      p.vel.y -= p.gravity * dt;
      p.mesh.position.addScaledVector(p.vel, dt);

      if (p.isMesh && p.groundY !== undefined && p.mesh.position.y < p.groundY && p.vel.y < 0) {
        p.mesh.position.y = p.groundY;
        p.vel.y = -p.vel.y * 0.35;
        p.vel.x *= 0.65;
        p.vel.z *= 0.65;
      }

      const s = THREE.MathUtils.lerp(p.startScale, p.endScale, t);
      if (p.isMesh) {
        p.mesh.scale.setScalar(s);
        p.mesh.rotation.x += dt * 7;
        p.mesh.rotation.y += dt * 5;
      } else {
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
