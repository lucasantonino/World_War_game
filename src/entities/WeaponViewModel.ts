import * as THREE from 'three';
import { getProceduralTextures } from '../engine/Textures';
import { WeaponId } from '../types';

export class WeaponViewModel {
  public readonly root = new THREE.Group();
  private weaponPivot = new THREE.Group();
  private models = new Map<WeaponId, THREE.Group>();
  private bandageModel = new THREE.Group();
  private boltMesh: THREE.Mesh | null = null;
  private sniperBoltMesh: THREE.Mesh | null = null;
  private muzzleFlashMesh: THREE.Mesh;
  private muzzleLight: THREE.PointLight;

  private activeWeapon: WeaponId = 'rifle';
  private recoilZ = 0;
  private recoilPitch = 0;
  private flashTimer = 0;
  private swayTime = 0;
  private meleeTimer = 0;
  private binocularsActive = false;
  private tankViewActive = false;

  constructor() {
    this.root.add(this.weaponPivot);

    const tex = getProceduralTextures();
    const woodMat = new THREE.MeshStandardMaterial({ map: tex.timber, roughness: 0.72, metalness: 0.08 });
    const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x262928, roughness: 0.42, metalness: 0.75 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x191b1a, roughness: 0.5, metalness: 0.65 });
    const bladeSteelMat = new THREE.MeshStandardMaterial({ color: 0x9aa2a6, roughness: 0.28, metalness: 0.88 });
    const oliveMat = new THREE.MeshStandardMaterial({ color: 0x454e37, roughness: 0.8, metalness: 0.2 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x152834, roughness: 0.14, metalness: 0.9 });

    const addBayonet = (group: THREE.Group, y: number, z: number): void => {
      const mount = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.04), darkSteelMat);
      mount.position.set(0, y, z + 0.04);
      group.add(mount);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.022, 0.26), bladeSteelMat);
      blade.position.set(0, y - 0.008, z - 0.11);
      group.add(blade);
    };

    // 1. M-42 Rifle (with bayonet)
    const rifle = new THREE.Group();
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.58), woodMat);
    stock.position.set(0, -0.025, 0.1);
    rifle.add(stock);

    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.065, 0.24), gunMetalMat);
    receiver.position.set(0, 0.032, -0.04);
    rifle.add(receiver);

    this.boltMesh = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.08), darkSteelMat);
    this.boltMesh.position.set(0.028, 0.048, -0.03);
    rifle.add(this.boltMesh);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.68, 10), gunMetalMat);
    barrel.rotation.x = Math.PI * 0.5;
    barrel.position.set(0, 0.046, -0.45);
    rifle.add(barrel);

    const rearSight = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.022, 0.018), darkSteelMat);
    rearSight.position.set(0, 0.072, 0.04);
    rifle.add(rearSight);
    const frontPost = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.026, 0.012), darkSteelMat);
    frontPost.position.set(0, 0.071, -0.74);
    rifle.add(frontPost);
    addBayonet(rifle, 0.018, -0.74);
    this.models.set('rifle', rifle);
    this.weaponPivot.add(rifle);

    // 2. SMG-44
    const smg = new THREE.Group();
    const smgBody = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.075, 0.36), gunMetalMat);
    smgBody.position.set(0, 0.02, -0.08);
    smg.add(smgBody);

    const smgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.28, 10), darkSteelMat);
    smgBarrel.rotation.x = Math.PI * 0.5;
    smgBarrel.position.set(0, 0.032, -0.38);
    smg.add(smgBarrel);

    const smgMag = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.2, 0.046), darkSteelMat);
    smgMag.position.set(0, -0.1, -0.18);
    smgMag.rotation.x = 0.22;
    smg.add(smgMag);

    const smgGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.05), woodMat);
    smgGrip.position.set(0, -0.06, 0.06);
    smgGrip.rotation.x = -0.25;
    smg.add(smgGrip);

    const smgSight = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.024, 0.012), darkSteelMat);
    smgSight.position.set(0, 0.068, -0.45);
    smg.add(smgSight);
    this.models.set('smg', smg);
    this.weaponPivot.add(smg);

    // 3. Escopeta M-97 (Shotgun with perforated heat shield & bayonet)
    const shotgun = new THREE.Group();
    const sgStock = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.115, 0.48), woodMat);
    sgStock.position.set(0, -0.03, 0.12);
    shotgun.add(sgStock);

    const sgReceiver = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.078, 0.25), gunMetalMat);
    sgReceiver.position.set(0, 0.026, -0.06);
    shotgun.add(sgReceiver);

    const sgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.58, 10), darkSteelMat);
    sgBarrel.rotation.x = Math.PI * 0.5;
    sgBarrel.position.set(0, 0.048, -0.44);
    shotgun.add(sgBarrel);

    const sgHeatShield = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.36, 10, 1, false, -0.9, Math.PI + 1.8), gunMetalMat);
    sgHeatShield.rotation.x = Math.PI * 0.5;
    sgHeatShield.position.set(0, 0.052, -0.36);
    shotgun.add(sgHeatShield);

    const sgTube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.52, 8), darkSteelMat);
    sgTube.rotation.x = Math.PI * 0.5;
    sgTube.position.set(0, 0.018, -0.42);
    shotgun.add(sgTube);

    const sgPump = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.18, 10), woodMat);
    sgPump.rotation.x = Math.PI * 0.5;
    sgPump.position.set(0, 0.016, -0.35);
    shotgun.add(sgPump);

    const sgBead = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), bladeSteelMat);
    sgBead.position.set(0, 0.071, -0.70);
    shotgun.add(sgBead);
    addBayonet(shotgun, 0.012, -0.68);
    this.models.set('shotgun', shotgun);
    this.weaponPivot.add(shotgun);

    // 4. Fuzil Sniper M-40 (with telescopic scope & bayonet)
    const sniper = new THREE.Group();
    const snStock = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.108, 0.6), woodMat);
    snStock.position.set(0, -0.024, 0.1);
    sniper.add(snStock);

    const snReceiver = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.064, 0.26), gunMetalMat);
    snReceiver.position.set(0, 0.032, -0.04);
    sniper.add(snReceiver);

    this.sniperBoltMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.02, 0.085), darkSteelMat);
    this.sniperBoltMesh.position.set(0.028, 0.046, -0.03);
    sniper.add(this.sniperBoltMesh);

    const snBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.017, 0.78, 10), gunMetalMat);
    snBarrel.rotation.x = Math.PI * 0.5;
    snBarrel.position.set(0, 0.046, -0.52);
    sniper.add(snBarrel);

    // Telescopic scope mounts & tube
    for (const mz of [0.02, -0.1]) {
      const mount = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.035, 0.022), darkSteelMat);
      mount.position.set(0, 0.075, mz);
      sniper.add(mount);
    }
    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.017, 0.34, 12), darkSteelMat);
    scopeTube.rotation.x = Math.PI * 0.5;
    scopeTube.position.set(0, 0.1, -0.06);
    sniper.add(scopeTube);
    const scopeBell = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.019, 0.07, 12), darkSteelMat);
    scopeBell.rotation.x = Math.PI * 0.5;
    scopeBell.position.set(0, 0.1, -0.24);
    sniper.add(scopeBell);
    const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 12), lensMat);
    scopeLens.rotation.x = Math.PI * 0.5;
    scopeLens.position.set(0, 0.1, 0.11);
    sniper.add(scopeLens);
    addBayonet(sniper, 0.018, -0.82);
    this.models.set('sniper', sniper);
    this.weaponPivot.add(sniper);

    // 5. Metralhadora Leve MG-38 (top pan/drum magazine & folding bipod)
    const lmg = new THREE.Group();
    const lmgStock = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.115, 0.38), woodMat);
    lmgStock.position.set(0, -0.022, 0.16);
    lmg.add(lmgStock);

    const lmgReceiver = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.088, 0.42), gunMetalMat);
    lmgReceiver.position.set(0, 0.025, -0.08);
    lmg.add(lmgReceiver);

    const lmgShroud = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.48, 10), darkSteelMat);
    lmgShroud.rotation.x = Math.PI * 0.5;
    lmgShroud.position.set(0, 0.036, -0.5);
    lmg.add(lmgShroud);

    const lmgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.017, 0.24, 10), gunMetalMat);
    lmgBarrel.rotation.x = Math.PI * 0.5;
    lmgBarrel.position.set(0, 0.036, -0.82);
    lmg.add(lmgBarrel);

    // Top pan/drum magazine
    const lmgDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.052, 16), darkSteelMat);
    lmgDrum.position.set(0, 0.098, -0.14);
    lmg.add(lmgDrum);

    // Bipod legs
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.007, 0.24, 6), darkSteelMat);
      leg.position.set(side * 0.055, -0.07, -0.66);
      leg.rotation.z = side * 0.28;
      leg.rotation.x = 0.22;
      lmg.add(leg);
    }
    const lmgRearSight = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.024, 0.016), darkSteelMat);
    lmgRearSight.position.set(0, 0.082, 0.05);
    lmg.add(lmgRearSight);
    this.models.set('lmg', lmg);
    this.weaponPivot.add(lmg);

    // 6. Pistola M-1911
    const pistol = new THREE.Group();
    const pFrame = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.034, 0.19), gunMetalMat);
    pFrame.position.set(0, 0.012, -0.1);
    pistol.add(pFrame);

    const pSlide = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.036, 0.21), darkSteelMat);
    pSlide.position.set(0, 0.04, -0.11);
    pistol.add(pSlide);

    const pGrip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.11, 0.048), woodMat);
    pGrip.position.set(0, -0.045, -0.025);
    pGrip.rotation.x = -0.22;
    pistol.add(pGrip);

    const pFrontSight = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.012, 0.01), bladeSteelMat);
    pFrontSight.position.set(0, 0.064, -0.2);
    pistol.add(pFrontSight);
    this.models.set('pistol', pistol);
    this.weaponPivot.add(pistol);

    // 7. Bazooka AT-43
    const bazooka = new THREE.Group();
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 1.15, 14), oliveMat);
    tube.rotation.x = Math.PI * 0.5;
    tube.position.set(0.04, 0.03, -0.22);
    bazooka.add(tube);

    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.064, 0.12, 14), darkSteelMat);
    bell.rotation.x = Math.PI * 0.5;
    bell.position.set(0.04, 0.03, -0.82);
    bazooka.add(bell);

    const bGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.13, 0.05), woodMat);
    bGrip.position.set(0.04, -0.08, -0.18);
    bazooka.add(bGrip);

    const bSight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.01), darkSteelMat);
    bSight.position.set(-0.03, 0.075, -0.45);
    bazooka.add(bSight);
    this.models.set('bazooka', bazooka);
    this.weaponPivot.add(bazooka);

    // 8. Frag Grenade F-1
    const grenade = new THREE.Group();
    const gBody = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), oliveMat);
    gBody.scale.set(0.95, 1.25, 0.95);
    gBody.position.set(0, 0, -0.12);
    grenade.add(gBody);
    const gSpoon = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.065, 0.03), darkSteelMat);
    gSpoon.position.set(0.028, 0.035, -0.12);
    grenade.add(gSpoon);
    this.models.set('grenade', grenade);
    this.weaponPivot.add(grenade);

    // Bandage roll (shown during H heal)
    const gauzeMat = new THREE.MeshStandardMaterial({ color: 0xe6e1d3, roughness: 0.95 });
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.095, 12), gauzeMat);
    roll.rotation.z = Math.PI * 0.35;
    roll.position.set(0, -0.05, -0.22);
    this.bandageModel.add(roll);
    this.bandageModel.visible = false;
    this.weaponPivot.add(this.bandageModel);

    // Muzzle Flash
    this.muzzleFlashMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.24),
      new THREE.MeshBasicMaterial({
        map: tex.radialGlow,
        color: 0xffc66d,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.muzzleFlashMesh.position.set(0, 0.048, -0.82);
    this.muzzleFlashMesh.visible = false;
    this.weaponPivot.add(this.muzzleFlashMesh);

    this.muzzleLight = new THREE.PointLight(0xffb454, 0, 9, 2);
    this.muzzleLight.position.set(0, 0.06, -0.78);
    this.weaponPivot.add(this.muzzleLight);

    this.setWeapon('rifle');
  }

  public setWeapon(id: WeaponId): void {
    this.activeWeapon = id;
    for (const [k, m] of this.models.entries()) {
      m.visible = k === id && !this.binocularsActive && !this.tankViewActive;
    }
  }

  public setBinocularsActive(active: boolean): void {
    this.binocularsActive = active;
  }

  public setTankViewActive(active: boolean): void {
    this.tankViewActive = active;
  }

  public triggerMeleeThrust(): void {
    this.meleeTimer = 0.28;
  }

  public triggerFire(kickZ: number, kickPitch: number, showFlash: boolean): void {
    this.recoilZ = Math.min(0.14, this.recoilZ + kickZ);
    this.recoilPitch = Math.min(0.24, this.recoilPitch + kickPitch);
    if (showFlash) {
      this.flashTimer = 0.045;
      this.muzzleFlashMesh.visible = true;
      this.muzzleFlashMesh.rotation.z = Math.random() * Math.PI;
      const zOffMap: Record<WeaponId, number> = {
        rifle: -0.82,
        smg: -0.55,
        shotgun: -0.76,
        sniper: -0.94,
        lmg: -0.96,
        pistol: -0.28,
        bazooka: -0.88,
        grenade: -0.2
      };
      this.muzzleFlashMesh.position.z = zOffMap[this.activeWeapon];
      this.muzzleLight.intensity = 3.2;
    }
  }

  public update(
    dt: number,
    adsFactor: number,
    moveSpeedRatio: number,
    isReloading: number,
    isBandaging: boolean,
    cookingProgress: number,
    mgMounted: boolean,
    sniperScopeActive = false
  ): void {
    this.swayTime += dt * (1.8 + moveSpeedRatio * 6.5);

    this.recoilZ = THREE.MathUtils.lerp(this.recoilZ, 0, Math.min(1, dt * 15));
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, Math.min(1, dt * 13));
    if (this.meleeTimer > 0) {
      this.meleeTimer = Math.max(0, this.meleeTimer - dt);
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.muzzleFlashMesh.visible = false;
        this.muzzleLight.intensity = 0;
      }
    }

    if (this.boltMesh) {
      this.boltMesh.position.z = -0.03 + this.recoilZ * 0.55;
    }
    if (this.sniperBoltMesh) {
      this.sniperBoltMesh.position.z = -0.03 + this.recoilZ * 0.55;
    }

    const hideAll = this.binocularsActive || this.tankViewActive || sniperScopeActive;
    if (hideAll) {
      this.muzzleFlashMesh.visible = false;
      this.muzzleLight.intensity = 0;
    }

    // Hide handheld weapon when mounted on Heavy MG, bandaging, using binos, sniper scope or inside tank
    this.bandageModel.visible = isBandaging && !hideAll && !mgMounted;
    for (const [k, m] of this.models.entries()) {
      m.visible = !hideAll && !isBandaging && !mgMounted && k === this.activeWeapon;
    }

    if (isBandaging && !hideAll) {
      this.weaponPivot.position.set(
        Math.sin(this.swayTime * 2.2) * 0.04,
        -0.16 + Math.cos(this.swayTime * 4.4) * 0.02,
        -0.25
      );
      this.weaponPivot.rotation.set(0.2, 0, Math.sin(this.swayTime * 2.2) * 0.25);
      return;
    }

    // Hip vs ADS position
    const hipX = this.activeWeapon === 'bazooka' ? 0.24 : this.activeWeapon === 'pistol' ? 0.18 : 0.2;
    const hipY = this.activeWeapon === 'bazooka' ? -0.19 : this.activeWeapon === 'pistol' ? -0.17 : -0.2;
    const hipZ = this.activeWeapon === 'pistol' ? -0.26 : -0.34;

    const adsYMap: Record<WeaponId, number> = {
      rifle: -0.072,
      smg: -0.074,
      shotgun: -0.075,
      sniper: -0.098,
      lmg: -0.088,
      pistol: -0.058,
      bazooka: -0.095,
      grenade: -0.095
    };
    const adsX = 0.0;
    const adsY = adsYMap[this.activeWeapon];
    const adsZ = this.activeWeapon === 'pistol' ? -0.22 : -0.27;

    let x = THREE.MathUtils.lerp(hipX, adsX, adsFactor);
    let y = THREE.MathUtils.lerp(hipY, adsY, adsFactor);
    let z = THREE.MathUtils.lerp(hipZ, adsZ, adsFactor) + this.recoilZ;

    // Walk / breathe bob (reduced during ADS)
    const bobAmp = (1 - adsFactor * 0.85) * (0.004 + moveSpeedRatio * 0.016);
    x += Math.cos(this.swayTime * 0.5) * bobAmp;
    y += Math.abs(Math.sin(this.swayTime)) * bobAmp * 1.1;

    // Reload tilt down
    let reloadDrop = 0;
    let reloadRoll = 0;
    if (isReloading > 0) {
      const curve = Math.sin(isReloading * Math.PI);
      reloadDrop = curve * 0.22;
      reloadRoll = curve * 0.55;
    }

    // Grenade cook pull-back
    if (this.activeWeapon === 'grenade' && cookingProgress > 0) {
      z += 0.14;
      x += 0.08;
    }

    // Bayonet / melee forward thrust
    let meleePitch = 0;
    let meleeYaw = 0;
    if (this.meleeTimer > 0) {
      const p = 1 - this.meleeTimer / 0.28;
      const thrust = Math.sin(p * Math.PI);
      z -= thrust * 0.36;
      x -= thrust * 0.14;
      y += thrust * 0.04;
      meleePitch = -thrust * 0.18;
      meleeYaw = thrust * 0.18;
    }

    this.weaponPivot.position.set(x, y - reloadDrop, z);
    this.weaponPivot.rotation.set(this.recoilPitch - reloadDrop * 0.8 + meleePitch, meleeYaw, reloadRoll);
  }
}
