import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

interface BomberPlane {
  group: THREE.Group;
  shadow: THREE.Mesh;
  propellers: THREE.Mesh[];
  offsetX: number;
  offsetZ: number;
  bombsDropped: number;
  nextDropZ: number;
}

export class BomberSystem {
  private scene: THREE.Scene;
  private projectiles: ProjectileSystem;
  private vfx: VFXSystem;
  private audio: AudioEngine;

  private active = false;
  private warningTimer = 0;
  private squadZ = -90;
  private flakTimer = 0;
  private planes: BomberPlane[] = [];
  private onComplete: (() => void) | null = null;
  private passSoundPlayed = false;

  constructor(
    scene: THREE.Scene,
    projectiles: ProjectileSystem,
    vfx: VFXSystem,
    audio: AudioEngine
  ) {
    this.scene = scene;
    this.projectiles = projectiles;
    this.vfx = vfx;
    this.audio = audio;
  }

  public isActive(): boolean {
    return this.active;
  }

  public isWarningOrPassing(): boolean {
    return this.active;
  }

  public clear(): void {
    for (const p of this.planes) {
      this.scene.remove(p.group);
      this.scene.remove(p.shadow);
    }
    this.planes = [];
    this.active = false;
    this.onComplete = null;
  }

  public triggerBomberRun(onComplete?: () => void): void {
    if (this.active) return;
    this.active = true;
    this.warningTimer = 4.6;
    this.squadZ = -95;
    this.passSoundPlayed = false;
    this.onComplete = onComplete ?? null;

    this.audio.playAirRaidSiren();

    // V-formation of 3 twin-engine bombers
    const offsets: Array<[number, number]> = [
      [0, 0],
      [-15, -9],
      [15, -9]
    ];

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3b403c, roughness: 0.55, metalness: 0.45 });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x1b1c1b });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.34,
      depthWrite: false
    });

    for (const [ox, oz] of offsets) {
      const g = new THREE.Group();
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.3, 10.5), bodyMat);
      g.add(fuselage);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.28, 2.6), bodyMat);
      wing.position.set(0, 0.25, -0.6);
      g.add(wing);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.22, 1.3), bodyMat);
      tail.position.set(0, 0.35, -4.6);
      g.add(tail);

      const stabilizers = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 1.2), bodyMat);
      stabilizers.position.set(0, 0.9, -4.6);
      g.add(stabilizers);

      const propellers: THREE.Mesh[] = [];
      for (const side of [-2.8, 2.8]) {
        const nac = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.6, 8), bodyMat);
        nac.rotation.x = Math.PI * 0.5;
        nac.position.set(side, 0.1, 0.6);
        g.add(nac);

        const prop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.14, 0.08), propMat);
        prop.position.set(side, 0.1, 1.5);
        g.add(prop);
        propellers.push(prop);
      }

      g.position.set(ox, 37, this.squadZ + oz);
      this.scene.add(g);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(4.6, 12), shadowMat);
      shadow.rotation.x = -Math.PI * 0.5;
      shadow.position.set(ox, 0.45, this.squadZ + oz);
      this.scene.add(shadow);

      this.planes.push({
        group: g,
        shadow,
        propellers,
        offsetX: ox,
        offsetZ: oz,
        bombsDropped: 0,
        nextDropZ: -20 + oz * 0.3
      });
    }
  }

  public update(dt: number, playerX: number): void {
    if (!this.active) return;

    this.flakTimer -= dt;
    if (this.flakTimer <= 0) {
      this.flakTimer = 0.45 + Math.random() * 0.45;
      this.vfx.spawnFlakBurst(
        new THREE.Vector3((Math.random() - 0.5) * 55, 29 + Math.random() * 12, -25 + Math.random() * 55)
      );
    }

    if (this.warningTimer > 0) {
      this.warningTimer -= dt;
      return;
    }

    if (!this.passSoundPlayed) {
      this.passSoundPlayed = true;
      this.audio.playBomberPass();
    }

    this.squadZ += dt * 32;

    for (const p of this.planes) {
      const zPos = this.squadZ + p.offsetZ;
      p.group.position.set(p.offsetX, 37, zPos);
      p.shadow.position.set(p.offsetX, 0.45, zPos);

      for (const prop of p.propellers) {
        prop.rotation.z += dt * 36;
      }

      // Drop carpet bombs across No Man's Land and the Ally Trench
      if (p.bombsDropped < 5 && zPos >= p.nextDropZ) {
        p.bombsDropped++;
        p.nextDropZ += 12.5;
        const dropX = p.offsetX + (Math.random() - 0.5) * 6.5;
        const dropZ = Math.min(35, Math.max(-22, zPos + 3));
        this.projectiles.spawnFallingBomb(dropX, 35, dropZ, true);
        const pan = Math.max(-1, Math.min(1, (dropX - playerX) / 28));
        this.audio.playBombWhistle(pan);
      }
    }

    if (this.squadZ > 92) {
      const doneCb = this.onComplete;
      this.clear();
      doneCb?.();
    }
  }
}
