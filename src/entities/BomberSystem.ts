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

interface StrafingPlane {
  group: THREE.Group;
  shadow: THREE.Mesh;
  propeller: THREE.Object3D;
  xOffset: number;
  zPos: number;
  targetX: number;
  targetZ: number;
  strafeTimer: number;
  tracerTimer: number;
  soundPlayed: boolean;
  onStrafeImpact: (pos: THREE.Vector3) => void;
}

interface StrafeTracer {
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  maxAge: number;
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
  private strafers: StrafingPlane[] = [];
  private strafeTracers: StrafeTracer[] = [];
  private onComplete: (() => void) | null = null;
  private passSoundPlayed = false;

  private strafeTracerGeo = new THREE.BoxGeometry(0.06, 0.06, 2.2);
  private strafeTracerMat = new THREE.MeshBasicMaterial({ color: 0xff7038 });
  private tmpPos = new THREE.Vector3();
  private tmpTarget = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpUpNormal = new THREE.Vector3(0, 1, 0);

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
    return this.active || this.strafers.length > 0;
  }

  public isWarningOrPassing(): boolean {
    return this.active || this.strafers.length > 0;
  }

  public clear(): void {
    for (const p of this.planes) {
      this.scene.remove(p.group);
      this.scene.remove(p.shadow);
    }
    this.planes = [];
    for (const s of this.strafers) {
      this.scene.remove(s.group);
      this.scene.remove(s.shadow);
    }
    this.strafers = [];
    for (const tr of this.strafeTracers) {
      this.scene.remove(tr.mesh);
    }
    this.strafeTracers = [];
    this.active = false;
    this.onComplete = null;
  }

  public triggerStrafingRun(
    targetX: number,
    targetZ: number,
    onStrafeImpact: (pos: THREE.Vector3) => void
  ): void {
    this.audio.playAirRaidSiren();

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3b403a, roughness: 0.52, metalness: 0.48 });
    const wingTipMat = new THREE.MeshStandardMaterial({ color: 0x6e6a42, roughness: 0.55, metalness: 0.35 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x16242c,
      roughness: 0.16,
      metalness: 0.85
    });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x181918 });
    const spinnerMat = new THREE.MeshStandardMaterial({ color: 0x80857e, roughness: 0.35, metalness: 0.65 });
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    });

    const wingmen: Array<[number, number]> = [
      [-4.2, -92],
      [4.2, -104]
    ];

    for (let idx = 0; idx < wingmen.length; idx++) {
      const [ox, startZ] = wingmen[idx];
      const g = new THREE.Group();

      // Agile single-engine fighter fuselage (+Z is nose forward)
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.92, 6.2), bodyMat);
      g.add(fuselage);

      // Tapered engine cowling & nose
      const cowling = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 1.35, 10), bodyMat);
      cowling.rotation.x = Math.PI * 0.5;
      cowling.position.set(0, -0.02, 3.55);
      g.add(cowling);

      // Bubble canopy
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.44, 1.45), glassMat);
      canopy.position.set(0, 0.62, 0.75);
      g.add(canopy);

      // Tapered straight wings
      for (const side of [-1, 1]) {
        const innerWing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 1.85), bodyMat);
        innerWing.position.set(side * 1.65, -0.1, 0.55);
        g.add(innerWing);

        const outerWing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.13, 1.25), bodyMat);
        outerWing.position.set(side * 3.95, -0.02, 0.42);
        outerWing.rotation.z = side * 0.06;
        g.add(outerWing);

        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.11, 0.95), wingTipMat);
        tip.position.set(side * 5.2, 0.04, 0.36);
        g.add(tip);

        // Wing machine gun barrel
        const mg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.7, 6), propMat);
        mg.rotation.x = Math.PI * 0.5;
        mg.position.set(side * 2.1, -0.1, 1.6);
        g.add(mg);
      }

      // Tailplane & single vertical stabilizer
      const hTail = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.14, 0.85), bodyMat);
      hTail.position.set(0, 0.14, -2.95);
      g.add(hTail);

      const vTail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.15, 1.05), bodyMat);
      vTail.position.set(0, 0.72, -2.92);
      g.add(vTail);

      // Front single propeller
      const propGroup = new THREE.Group();
      propGroup.position.set(0, -0.02, 4.26);

      const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.52, 8), spinnerMat);
      spinner.rotation.x = Math.PI * 0.5;
      spinner.position.z = 0.22;
      propGroup.add(spinner);

      const bladeA = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.16, 0.05), propMat);
      const bladeB = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.25, 0.05), propMat);
      propGroup.add(bladeA);
      propGroup.add(bladeB);
      g.add(propGroup);

      g.position.set(targetX + ox, 30, startZ);
      this.scene.add(g);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(3.2, 10), shadowMat);
      shadow.rotation.x = -Math.PI * 0.5;
      shadow.position.set(targetX + ox, 0.45, startZ);
      this.scene.add(shadow);

      this.strafers.push({
        group: g,
        shadow,
        propeller: propGroup,
        xOffset: ox,
        zPos: startZ,
        targetX,
        targetZ,
        strafeTimer: 0.05 * idx,
        tracerTimer: 0.02 * idx,
        soundPlayed: false,
        onStrafeImpact
      });
    }
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

  private clearBombers(): void {
    for (const p of this.planes) {
      this.scene.remove(p.group);
      this.scene.remove(p.shadow);
    }
    this.planes = [];
    this.active = false;
    this.onComplete = null;
  }

  public update(dt: number, playerX: number): void {
    if (this.active) {
      this.flakTimer -= dt;
      if (this.flakTimer <= 0) {
        this.flakTimer = 0.45 + Math.random() * 0.45;
        this.tmpPos.set((Math.random() - 0.5) * 55, 29 + Math.random() * 12, -25 + Math.random() * 55);
        this.vfx.spawnFlakBurst(this.tmpPos);
      }

      if (this.warningTimer > 0) {
        this.warningTimer -= dt;
      } else {
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
          this.clearBombers();
          doneCb?.();
        }
      }
    }

    // Update low-altitude strafing fighters
    for (let i = this.strafers.length - 1; i >= 0; i--) {
      const s = this.strafers[i];
      s.zPos += dt * 52;
      s.propeller.rotation.z += dt * 48;

      if (!s.soundPlayed && s.zPos > -65) {
        s.soundPlayed = true;
        this.audio.playBomberPass();
      }

      // Low-altitude dive curve: ~12-16m over targetZ, climbing out after targetZ + 12
      const dz = s.zPos - s.targetZ;
      let alt = 13.8;
      let pitch = 0;
      if (dz < -8) {
        const t = Math.min(1, (-8 - dz) / 70);
        alt = 13.8 + t * t * 18;
        pitch = 0.16 * t; // Nose down diving
      } else if (dz > 12) {
        const t = Math.min(1, (dz - 12) / 68);
        alt = 13.8 + t * t * 20;
        pitch = -0.22 * t; // Pulling up nose up
      }

      const xPos = THREE.MathUtils.clamp(s.targetX + s.xOffset, -42, 42);
      s.group.position.set(xPos, alt, s.zPos);
      s.group.rotation.set(pitch, 0, Math.sin(s.zPos * 0.04) * 0.12);
      s.shadow.position.set(xPos, 0.45, s.zPos);

      // Firing burst window sweeping along Z over target area
      if (s.zPos >= s.targetZ - 32 && s.zPos <= s.targetZ + 18) {
        s.tracerTimer -= dt;
        if (s.tracerTimer <= 0) {
          s.tracerTimer = 0.065;
          const aimZ = s.zPos + 16 + (Math.random() - 0.5) * 4;
          const aimX = s.targetX + s.xOffset * 0.45 + (Math.random() - 0.5) * 3.4;
          for (const wingSide of [-2.1, 2.1]) {
            this.tmpPos.set(xPos + wingSide, alt - 0.15, s.zPos + 1.8);
            this.tmpTarget.set(aimX + wingSide * 0.3, 0.5, aimZ);
            this.tmpDir.subVectors(this.tmpTarget, this.tmpPos).normalize();
            const mesh = new THREE.Mesh(this.strafeTracerGeo, this.strafeTracerMat);
            mesh.position.copy(this.tmpPos);
            mesh.lookAt(this.tmpTarget);
            this.scene.add(mesh);
            this.strafeTracers.push({
              mesh,
              pos: this.tmpPos.clone(),
              vel: this.tmpDir.clone().multiplyScalar(145),
              age: 0,
              maxAge: 0.35
            });
          }
          const pan = Math.max(-1, Math.min(1, (xPos - playerX) / 28));
          if (Math.random() < 0.65) {
            this.audio.playGunshot('mg', Math.max(8, Math.abs(s.zPos - s.targetZ)), pan);
          }
        }

        s.strafeTimer -= dt;
        if (s.strafeTimer <= 0) {
          s.strafeTimer = 0.16;
          const impactX = s.targetX + s.xOffset * 0.45 + (Math.random() - 0.5) * 3.6;
          const impactZ = THREE.MathUtils.clamp(s.zPos + 16 + (Math.random() - 0.5) * 3.5, -55, 45);
          this.tmpTarget.set(impactX, 0.35, impactZ);
          this.vfx.spawnBulletImpact(this.tmpTarget, this.tmpUpNormal, false);
          s.onStrafeImpact(this.tmpTarget);
        }
      }

      if (s.zPos > 98) {
        this.scene.remove(s.group);
        this.scene.remove(s.shadow);
        this.strafers.splice(i, 1);
      }
    }

    // Update visual strafe tracers
    for (let i = this.strafeTracers.length - 1; i >= 0; i--) {
      const tr = this.strafeTracers[i];
      tr.age += dt;
      tr.pos.addScaledVector(tr.vel, dt);
      tr.mesh.position.copy(tr.pos);
      if (tr.age >= tr.maxAge || tr.pos.y <= 0.1) {
        this.scene.remove(tr.mesh);
        this.strafeTracers.splice(i, 1);
      }
    }
  }
}
