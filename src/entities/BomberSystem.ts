import * as THREE from 'three';
import { AudioEngine } from '../engine/AudioEngine';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

interface BomberPlane {
  group: THREE.Group;
  shadow: THREE.Mesh;
  propellers: THREE.Object3D[];
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
    const detailMat = new THREE.MeshStandardMaterial({ color: 0x2a2e2b, roughness: 0.62, metalness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x16242c,
      roughness: 0.16,
      metalness: 0.82
    });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x181918 });
    const spinnerMat = new THREE.MeshStandardMaterial({ color: 0x70756e, roughness: 0.35, metalness: 0.65 });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.34,
      depthWrite: false
    });

    for (const [ox, oz] of offsets) {
      const g = new THREE.Group();

      // Main fuselage (+Z is forward nose, -Z is tail)
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.32, 9.6), bodyMat);
      g.add(fuselage);

      // Tapered glazed nose cone (+Z)
      const noseFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.7, 8), bodyMat);
      noseFrame.rotation.x = Math.PI * 0.5;
      noseFrame.position.set(0, -0.02, 5.1);
      g.add(noseFrame);

      const glazedNose = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.60, 1.45, 8), glassMat);
      glazedNose.rotation.x = Math.PI * 0.5;
      glazedNose.position.set(0, -0.04, 6.1);
      g.add(glazedNose);

      // Elevated framed cockpit canopy + dorsal spine
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.52, 1.85), glassMat);
      canopy.position.set(0, 0.82, 3.05);
      g.add(canopy);

      const canopySpine = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.34, 2.2), bodyMat);
      canopySpine.position.set(0, 0.75, 1.1);
      g.add(canopySpine);

      // Underbelly bomb bay & slightly open doors
      const bombBay = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.36, 3.7), detailMat);
      bombBay.position.set(0, -0.74, 0.25);
      g.add(bombBay);

      for (const side of [-1, 1]) {
        const bayDoor = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.32, 3.5), detailMat);
        bayDoor.position.set(side * 0.56, -0.86, 0.25);
        bayDoor.rotation.z = side * 0.34;
        g.add(bayDoor);
      }

      // Tapered / swept wings with trailing-edge flaps
      for (const side of [-1, 1]) {
        const innerWing = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.30, 2.75), bodyMat);
        innerWing.position.set(side * 2.55, 0.24, 0.3);
        g.add(innerWing);

        const outerWing = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.22, 1.85), bodyMat);
        outerWing.position.set(side * 6.0, 0.32, -0.22);
        outerWing.rotation.y = side * -0.18;
        outerWing.rotation.z = side * 0.045;
        g.add(outerWing);

        const flap = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 0.52), detailMat);
        flap.position.set(side * 2.65, 0.18, -1.25);
        flap.rotation.x = 0.16;
        g.add(flap);
      }

      // Horizontal tailplane + twin vertical stabilizers (H-tail)
      const tail = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.22, 1.35), bodyMat);
      tail.position.set(0, 0.36, -4.65);
      g.add(tail);

      for (const side of [-1, 1]) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.55, 1.35), bodyMat);
        fin.position.set(side * 2.48, 0.72, -4.72);
        g.add(fin);

        const rudder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.35, 0.42), detailMat);
        rudder.position.set(side * 2.48, 0.72, -5.45);
        g.add(rudder);
      }

      // Twin radial engine nacelles, cowlings & spinning propellers
      const propellers: THREE.Object3D[] = [];
      for (const side of [-2.85, 2.85]) {
        const nac = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 2.25, 10), bodyMat);
        nac.rotation.x = Math.PI * 0.5;
        nac.position.set(side, 0.08, 0.68);
        g.add(nac);

        // Radial engine cowling ring
        const cowling = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.47, 0.68, 10), detailMat);
        cowling.rotation.x = Math.PI * 0.5;
        cowling.position.set(side, 0.08, 1.72);
        g.add(cowling);

        const propGroup = new THREE.Group();
        propGroup.position.set(side, 0.08, 2.12);

        const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.46, 8), spinnerMat);
        spinner.rotation.x = Math.PI * 0.5;
        spinner.position.z = 0.18;
        propGroup.add(spinner);

        const bladeA = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.18, 0.06), propMat);
        const bladeB = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.15, 0.06), propMat);
        propGroup.add(bladeA);
        propGroup.add(bladeB);

        g.add(propGroup);
        propellers.push(propGroup);
      }

      g.position.set(ox, 37, this.squadZ + oz);
      this.scene.add(g);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(4.9, 12), shadowMat);
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
