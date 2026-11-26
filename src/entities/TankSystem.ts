import * as THREE from 'three';
import type { EventBus } from '../core/EventBus';
import type { HitZone, VehicleSubsystem } from '../core/types';
import { AudioEngine } from '../engine/AudioEngine';
import { getDifficultyConfig } from '../engine/DifficultyConfig';
import { getProceduralTextures } from '../engine/Textures';
import { VehicleDamageSystem, type VehicleSubsystemsState } from '../gameplay/vehicles/VehicleDamage';
import { DifficultyModifier, SoldierRole, TroopCarSpawnSpec } from '../types';
import { CoverSystem, TankHullCollider } from '../world/CoverSystem';
import { Terrain } from '../world/Terrain';
import { ProjectileSystem } from './ProjectileSystem';
import { VFXSystem } from './VFXSystem';

export interface TankEntity {
  id: string;
  heavy: boolean;
  root: THREE.Group;
  hull: THREE.Group;
  turret: THREE.Group;
  barrel: THREE.Mesh;
  smokeAnchor: THREE.Vector3;

  pos: THREE.Vector3;
  hullYaw: number;
  turretYaw: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  waypoints: Array<{ x: number; z: number }>;
  waypointIndex: number;

  cannonCooldown: number;
  mgCooldown: number;
  mgBurstCount: number;
  barrelRecoil: number;
  smokeTimer: number;
  subsystems: VehicleSubsystemsState;
}

export interface TroopCarEntity {
  id: string;
  root: THREE.Group;
  body: THREE.Group;
  wheels: THREE.Object3D[];
  passengerMeshes: THREE.Group[];
  pos: THREE.Vector3;
  yaw: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  state: 'approaching' | 'unloading' | 'retreating';
  dropX: number;
  dropZ: number;
  retreatX: number;
  passengers: number;
  roles?: SoldierRole[];
  unloadTimer: number;
  unloaded: boolean;
  dustTimer: number;
  smokeTimer: number;
  onUnloadSquad: (x: number, z: number, count: number, roles?: SoldierRole[]) => void;
}

interface AllyTankEntity {
  id: string;
  root: THREE.Group;
  hull: THREE.Group;
  turret: THREE.Group;
  barrelPivot: THREE.Group;
  barrel: THREE.Mesh;
  pos: THREE.Vector3;
  hullYaw: number;
  turretYaw: number;
  barrelPitch: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  shellCooldown: number;
  coaxCooldown: number;
  barrelRecoil: number;
  smokeTimer: number;
  dustTimer: number;
}

export class TankSystem {
  private scene: THREE.Scene;
  private terrain: Terrain;
  private cover: CoverSystem;
  private projectiles: ProjectileSystem;
  private vfx: VFXSystem;
  private audio: AudioEngine;

  public tanks: TankEntity[] = [];
  public troopCars: TroopCarEntity[] = [];
  private allyTank: AllyTankEntity | null = null;
  private nextId = 1;
  private vehicleDamage = new VehicleDamageSystem();
  public onSubsystemDamaged:
    | ((tank: TankEntity, subsystem: VehicleSubsystem, state: VehicleSubsystemsState) => void)
    | null = null;

  // Reusable math temporaries (zero per-frame allocations)
  private tmpPlayerHead = new THREE.Vector3();
  private tmpMuzzle = new THREE.Vector3();
  private tmpCoaxMuzzle = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpTarget = new THREE.Vector3();
  private tmpSmokePos = new THREE.Vector3();
  private tmpSmokeVel = new THREE.Vector3();
  private tmpAllyPosOut = new THREE.Vector3();
  private tmpToHit = new THREE.Vector2();
  private hullColliderPool: TankHullCollider[] = [];

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
  }

  public setEventBus(bus: EventBus): void {
    this.vehicleDamage = new VehicleDamageSystem(bus);
  }

  public clear(): void {
    for (const t of this.tanks) {
      this.scene.remove(t.root);
    }
    this.tanks = [];
    for (const c of this.troopCars) {
      this.scene.remove(c.root);
    }
    this.troopCars = [];
    if (this.allyTank) {
      this.scene.remove(this.allyTank.root);
      this.allyTank = null;
    }
    this.cover.setTankHulls([]);
  }

  public getEnemyTanks(): readonly TankEntity[] {
    return this.tanks;
  }

  public spawnTank(
    x: number,
    z: number,
    heavy: boolean,
    waypoints: Array<{ x: number; z: number }>
  ): TankEntity {
    const tex = getProceduralTextures();
    const steelMat = new THREE.MeshStandardMaterial({
      map: tex.armorSteel,
      color: heavy ? 0x5c6158 : 0x676b5e,
      roughness: 0.58,
      metalness: 0.48
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x353833,
      roughness: 0.52,
      metalness: 0.62
    });
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1d1e1c,
      roughness: 0.9,
      metalness: 0.35
    });
    const rearGrilleMat = new THREE.MeshStandardMaterial({
      color: 0x7a2b22,
      roughness: 0.7
    });
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfff1c4,
      emissive: 0xffe29a,
      emissiveIntensity: 1.15,
      roughness: 0.25
    });

    const scale = heavy ? 1.18 : 0.96;
    const root = new THREE.Group();
    const hull = new THREE.Group();
    root.add(hull);

    // Main armored hull
    const hullBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.7 * scale, 1.05 * scale, 4.9 * scale),
      steelMat
    );
    hullBody.position.y = 0.85 * scale;
    hullBody.castShadow = true;
    hullBody.receiveShadow = true;
    hull.add(hullBody);

    // Sloped front glacis
    const glacis = new THREE.Mesh(
      new THREE.BoxGeometry(2.55 * scale, 0.72 * scale, 1.15 * scale),
      steelMat
    );
    glacis.position.set(0, 0.75 * scale, -2.5 * scale);
    glacis.rotation.x = 0.52;
    glacis.castShadow = true;
    hull.add(glacis);

    // Driver visor slit & bow MG housing (no insignia)
    const driverVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.62 * scale, 0.14 * scale, 0.22 * scale),
      darkSteelMat
    );
    driverVisor.position.set(-0.55 * scale, 1.18 * scale, -2.38 * scale);
    hull.add(driverVisor);

    // Front headlight (small emissive mesh, no PointLight)
    const headlightHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13 * scale, 0.14 * scale, 0.22 * scale, 8),
      darkSteelMat
    );
    headlightHousing.rotation.x = Math.PI * 0.5;
    headlightHousing.position.set(0.88 * scale, 1.16 * scale, -2.42 * scale);
    hull.add(headlightHousing);

    const headlightLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105 * scale, 0.105 * scale, 0.04 * scale, 8),
      headlightMat
    );
    headlightLens.rotation.x = Math.PI * 0.5;
    headlightLens.position.set(0.88 * scale, 1.16 * scale, -2.54 * scale);
    hull.add(headlightLens);

    // Rear engine weakspot grille (facing away from front)
    const rearGrille = new THREE.Mesh(
      new THREE.BoxGeometry(1.7 * scale, 0.45 * scale, 0.25 * scale),
      rearGrilleMat
    );
    rearGrille.position.set(0, 1.05 * scale, 2.46 * scale);
    hull.add(rearGrille);

    // Rear auxiliary fuel drum + twin armored exhaust pipes
    const auxFuelTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24 * scale, 0.24 * scale, 1.55 * scale, 10),
      darkSteelMat
    );
    auxFuelTank.rotation.z = Math.PI * 0.5;
    auxFuelTank.position.set(0, 1.44 * scale, 2.15 * scale);
    auxFuelTank.castShadow = true;
    hull.add(auxFuelTank);

    for (const side of [-1, 1]) {
      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.095 * scale, 0.65 * scale, 8),
        darkSteelMat
      );
      exhaust.position.set(side * 1.02 * scale, 1.18 * scale, 2.52 * scale);
      exhaust.rotation.x = -0.18;
      hull.add(exhaust);

      // Rear stowage box on hull sponson
      const stowageBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.42 * scale, 0.34 * scale, 1.1 * scale),
        steelMat
      );
      stowageBox.position.set(side * 1.38 * scale, 1.34 * scale, 1.45 * scale);
      stowageBox.castShadow = true;
      hull.add(stowageBox);
    }

    // Left & right tracks, road wheels & armored side skirts
    const roadWheelGeo = new THREE.CylinderGeometry(0.29 * scale, 0.29 * scale, 0.22 * scale, 10);
    const hubGeo = new THREE.CylinderGeometry(0.11 * scale, 0.11 * scale, 0.26 * scale, 8);
    const wheelZPositions = [-2.15, -1.32, -0.45, 0.42, 1.29, 2.15];

    for (const side of [-1, 1]) {
      const track = new THREE.Mesh(
        new THREE.BoxGeometry(0.62 * scale, 0.86 * scale, 5.25 * scale),
        trackMat
      );
      track.position.set(side * 1.52 * scale, 0.50 * scale, 0);
      track.castShadow = true;
      hull.add(track);

      // Armored side skirts shielding upper tracks
      const sideSkirt = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.48 * scale, 4.95 * scale),
        steelMat
      );
      sideSkirt.position.set(side * 1.84 * scale, 0.88 * scale, 0);
      sideSkirt.castShadow = true;
      hull.add(sideSkirt);

      // Lower road wheels + idler/drive sprocket hubs
      for (const wz of wheelZPositions) {
        const wheel = new THREE.Mesh(roadWheelGeo, darkSteelMat);
        wheel.rotation.z = Math.PI * 0.5;
        wheel.position.set(side * 1.78 * scale, 0.33 * scale, wz * scale);
        hull.add(wheel);

        const hub = new THREE.Mesh(hubGeo, steelMat);
        hub.rotation.z = Math.PI * 0.5;
        hub.position.set(side * 1.79 * scale, 0.33 * scale, wz * scale);
        hull.add(hub);
      }
    }

    // Turret
    const turret = new THREE.Group();
    turret.position.set(0, 1.55 * scale, -0.15 * scale);

    const turretBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.95 * scale, 0.82 * scale, 2.3 * scale),
      steelMat
    );
    turretBody.castShadow = true;
    turret.add(turretBody);

    // Turret rear bustle stowage box
    const turretBustle = new THREE.Mesh(
      new THREE.BoxGeometry(1.52 * scale, 0.56 * scale, 0.62 * scale),
      darkSteelMat
    );
    turretBustle.position.set(0, 0.04 * scale, 1.38 * scale);
    turretBustle.castShadow = true;
    turret.add(turretBustle);

    // Gun mantlet (armored collar at turret front)
    const mantlet = new THREE.Mesh(
      new THREE.BoxGeometry(0.92 * scale, 0.54 * scale, 0.42 * scale),
      darkSteelMat
    );
    mantlet.position.set(0, 0.04 * scale, -1.22 * scale);
    mantlet.castShadow = true;
    turret.add(mantlet);

    // Commander cupola + raised hatch + periscope blocks
    const cupola = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38 * scale, 0.42 * scale, 0.28 * scale, 10),
      steelMat
    );
    cupola.position.set(-0.3 * scale, 0.5 * scale, 0.2 * scale);
    turret.add(cupola);

    const cupolaHatch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32 * scale, 0.34 * scale, 0.08 * scale, 10),
      darkSteelMat
    );
    cupolaHatch.position.set(-0.3 * scale, 0.66 * scale, 0.2 * scale);
    turret.add(cupolaHatch);

    const periscope = new THREE.Mesh(
      new THREE.BoxGeometry(0.22 * scale, 0.11 * scale, 0.16 * scale),
      darkSteelMat
    );
    periscope.position.set(-0.3 * scale, 0.72 * scale, 0.05 * scale);
    turret.add(periscope);

    // Main cannon barrel + muzzle brake (parented to barrel so it recoils together)
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11 * scale, 0.14 * scale, 3.1 * scale, 10),
      steelMat
    );
    barrel.rotation.x = Math.PI * 0.5;
    barrel.position.set(0, 0.05 * scale, -2.1 * scale);
    barrel.castShadow = true;

    const muzzleBrake = new THREE.Mesh(
      new THREE.BoxGeometry(0.34 * scale, 0.38 * scale, 0.26 * scale),
      darkSteelMat
    );
    // In barrel local space (rotated +PI/2 around X), -Y points toward the front muzzle
    muzzleBrake.position.set(0, -1.56 * scale, 0);
    barrel.add(muzzleBrake);

    turret.add(barrel);

    hull.add(turret);

    const y = this.terrain.getTerrainHeight(x, z);
    root.position.set(x, y, z);
    this.scene.add(root);

    const subsystems = this.vehicleDamage.createTankState(heavy);
    const maxHp = subsystems.maxHullHp;
    const tank: TankEntity = {
      id: `tank_${this.nextId++}`,
      heavy,
      root,
      hull,
      turret,
      barrel,
      smokeAnchor: new THREE.Vector3(),
      pos: new THREE.Vector3(x, y, z),
      hullYaw: Math.PI, // Facing south (+Z) toward player trench
      turretYaw: Math.PI,
      hp: maxHp,
      maxHp,
      destroyed: false,
      waypoints,
      waypointIndex: 0,
      cannonCooldown: 3.5,
      mgCooldown: 0.4,
      mgBurstCount: 0,
      barrelRecoil: 0,
      smokeTimer: 0,
      subsystems
    };

    this.tanks.push(tank);
    this.syncHullColliders();
    return tank;
  }

  public spawnTroopCar(
    spec: TroopCarSpawnSpec,
    onUnloadSquad: (x: number, z: number, count: number, roles?: SoldierRole[]) => void
  ): void {
    const tex = getProceduralTextures();
    const bodyMat = new THREE.MeshStandardMaterial({
      map: tex.armorSteel,
      color: 0x4b4f48,
      roughness: 0.68,
      metalness: 0.28
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x262826,
      roughness: 0.58,
      metalness: 0.52
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c4732,
      roughness: 0.86
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x181918,
      roughness: 0.92
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e2c33,
      roughness: 0.18,
      metalness: 0.78,
      transparent: true,
      opacity: 0.72
    });
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfff0c2,
      emissive: 0xffe296,
      emissiveIntensity: 1.15,
      roughness: 0.25
    });
    const soldierUniformMat = new THREE.MeshStandardMaterial({ color: 0x4d514f, roughness: 0.88 });
    const soldierHelmetMat = new THREE.MeshStandardMaterial({ color: 0x2f3332, roughness: 0.62 });
    const soldierSkinMat = new THREE.MeshStandardMaterial({ color: 0xc29b7c, roughness: 0.8 });

    const root = new THREE.Group();
    const body = new THREE.Group();
    root.add(body);

    // Armored chassis rails & underbody (-Z is forward)
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.34, 4.45), darkMetalMat);
    chassis.position.set(0, 0.52, 0);
    chassis.castShadow = true;
    body.add(chassis);

    // Front & rear bumpers
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.18, 0.22), darkMetalMat);
    frontBumper.position.set(0, 0.52, -2.28);
    body.add(frontBumper);
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.16, 0.18), darkMetalMat);
    rearBumper.position.set(0, 0.50, 2.25);
    body.add(rearBumper);

    // Engine hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.64, 1.32), bodyMat);
    hood.position.set(0, 0.98, -1.56);
    hood.castShadow = true;
    body.add(hood);

    // Front slatted radiator grille
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.52, 0.12), darkMetalMat);
    grilleFrame.position.set(0, 0.96, -2.22);
    body.add(grilleFrame);
    for (let s = -2; s <= 2; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.045, 0.05), bodyMat);
      slat.position.set(0, 0.96 + s * 0.09, -2.27);
      body.add(slat);
    }

    // Emissive headlights (zero extra PointLights)
    for (const side of [-1, 1]) {
      const lampHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.16, 8), darkMetalMat);
      lampHousing.rotation.x = Math.PI * 0.5;
      lampHousing.position.set(side * 0.66, 0.96, -2.18);
      body.add(lampHousing);

      const lampLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 8), headlightMat);
      lampLens.rotation.x = Math.PI * 0.5;
      lampLens.position.set(side * 0.66, 0.96, -2.27);
      body.add(lampLens);
    }

    // Angled windshield frame & tinted glass
    const windshieldFrame = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.58, 0.09), bodyMat);
    windshieldFrame.position.set(0, 1.54, -0.92);
    windshieldFrame.rotation.x = -0.22;
    body.add(windshieldFrame);

    const windshieldGlass = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.42, 0.04), glassMat);
    windshieldGlass.position.set(0, 1.55, -0.95);
    windshieldGlass.rotation.x = -0.22;
    body.add(windshieldGlass);

    // Open cab sides, dashboard & bench seat
    const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.14, 1.05), darkMetalMat);
    cabFloor.position.set(0, 0.72, -0.45);
    body.add(cabFloor);

    const cabBackWall = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.68, 0.12), bodyMat);
    cabBackWall.position.set(0, 1.06, 0.06);
    body.add(cabBackWall);

    for (const side of [-1, 1]) {
      const cabDoor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.96), bodyMat);
      cabDoor.position.set(side * 0.80, 1.03, -0.42);
      cabDoor.castShadow = true;
      body.add(cabDoor);

      const fender = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 1.15), bodyMat);
      fender.position.set(side * 0.84, 0.86, -1.52);
      body.add(fender);
    }

    const cabSeat = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.24, 0.48), woodMat);
    cabSeat.position.set(0, 0.92, -0.22);
    body.add(cabSeat);

    // Cargo bed (caçamba) with side walls, tailgate & benches
    const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.14, 2.08), woodMat);
    bedFloor.position.set(0, 0.74, 1.16);
    body.add(bedFloor);

    for (const side of [-1, 1]) {
      const bedWall = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.68, 2.08), bodyMat);
      bedWall.position.set(side * 0.84, 1.12, 1.16);
      bedWall.castShadow = true;
      body.add(bedWall);

      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 1.85), woodMat);
      bench.position.set(side * 0.62, 0.98, 1.16);
      body.add(bench);
    }

    const tailgate = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.56, 0.10), bodyMat);
    tailgate.position.set(0, 1.06, 2.16);
    tailgate.castShadow = true;
    body.add(tailgate);

    // Up to 5 seated low-poly passengers in cargo bed
    const passengerMeshes: THREE.Group[] = [];
    const seatSlots: Array<[number, number, number]> = [
      [-0.58, 0.62, Math.PI * 0.5],
      [0.58, 0.62, -Math.PI * 0.5],
      [-0.58, 1.24, Math.PI * 0.5],
      [0.58, 1.24, -Math.PI * 0.5],
      [0.0, 1.78, Math.PI]
    ];
    const seatedCount = Math.max(1, Math.min(5, spec.passengers));
    for (let i = 0; i < seatedCount; i++) {
      const [px, pz, rotY] = seatSlots[i];
      const pg = new THREE.Group();
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.20), soldierUniformMat);
      torso.position.set(0, 0.22, 0);
      pg.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 6), soldierSkinMat);
      head.position.set(0, 0.54, 0);
      pg.add(head);

      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.135, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55),
        soldierHelmetMat
      );
      helmet.position.set(0, 0.57, 0);
      pg.add(helmet);

      pg.position.set(px, 1.02, pz);
      pg.rotation.y = rotY;
      body.add(pg);
      passengerMeshes.push(pg);
    }

    // 4 rotating wheels
    const wheels: THREE.Object3D[] = [];
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 12);
    const rimGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.30, 8);
    const wheelOffsets: Array<[number, number]> = [
      [-0.92, -1.50],
      [0.92, -1.50],
      [-0.92, 1.32],
      [0.92, 1.32]
    ];
    for (const [wx, wz] of wheelOffsets) {
      const wg = new THREE.Group();
      wg.position.set(wx, 0.42, wz);
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.z = Math.PI * 0.5;
      tire.castShadow = true;
      wg.add(tire);
      const rim = new THREE.Mesh(rimGeo, bodyMat);
      rim.rotation.z = Math.PI * 0.5;
      wg.add(rim);
      body.add(wg);
      wheels.push(wg);
    }

    const dx = spec.dropX - spec.x;
    const dz = spec.dropZ - spec.z;
    const initialYaw = Math.atan2(-dx, -dz);
    const y = this.terrain.getTerrainHeight(spec.x, spec.z);
    root.position.set(spec.x, y, spec.z);
    body.rotation.y = initialYaw;
    this.scene.add(root);

    this.troopCars.push({
      id: `car_${this.nextId++}`,
      root,
      body,
      wheels,
      passengerMeshes,
      pos: new THREE.Vector3(spec.x, y, spec.z),
      yaw: initialYaw,
      hp: 190,
      maxHp: 190,
      destroyed: false,
      state: 'approaching',
      dropX: spec.dropX,
      dropZ: spec.dropZ,
      retreatX: spec.x,
      passengers: spec.passengers,
      roles: spec.roles,
      unloadTimer: 2.5,
      unloaded: false,
      dustTimer: 0,
      smokeTimer: 0,
      onUnloadSquad
    });
    this.syncHullColliders();
  }

  public spawnAllyTank(x: number, z: number): void {
    if (this.allyTank) {
      this.scene.remove(this.allyTank.root);
      this.allyTank = null;
    }

    const tex = getProceduralTextures();
    const oliveMat = new THREE.MeshStandardMaterial({
      map: tex.armorSteel,
      color: 0x4b5c3b,
      roughness: 0.56,
      metalness: 0.44
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x2c3028,
      roughness: 0.54,
      metalness: 0.60
    });
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1b1c1a,
      roughness: 0.9,
      metalness: 0.35
    });
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfff1c4,
      emissive: 0xffe29a,
      emissiveIntensity: 1.1,
      roughness: 0.25
    });

    const scale = 1.06;
    const root = new THREE.Group();
    const hull = new THREE.Group();
    root.add(hull);

    // Main olive armored hull (-Z is forward)
    const hullBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.72 * scale, 1.04 * scale, 4.95 * scale),
      oliveMat
    );
    hullBody.position.y = 0.85 * scale;
    hullBody.castShadow = true;
    hullBody.receiveShadow = true;
    hull.add(hullBody);

    const glacis = new THREE.Mesh(
      new THREE.BoxGeometry(2.58 * scale, 0.72 * scale, 1.18 * scale),
      oliveMat
    );
    glacis.position.set(0, 0.76 * scale, -2.52 * scale);
    glacis.rotation.x = 0.54;
    glacis.castShadow = true;
    hull.add(glacis);

    const driverVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.64 * scale, 0.14 * scale, 0.22 * scale),
      darkSteelMat
    );
    driverVisor.position.set(-0.55 * scale, 1.18 * scale, -2.38 * scale);
    hull.add(driverVisor);

    const headlightHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13 * scale, 0.14 * scale, 0.22 * scale, 8),
      darkSteelMat
    );
    headlightHousing.rotation.x = Math.PI * 0.5;
    headlightHousing.position.set(0.88 * scale, 1.16 * scale, -2.42 * scale);
    hull.add(headlightHousing);

    const headlightLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105 * scale, 0.105 * scale, 0.04 * scale, 8),
      headlightMat
    );
    headlightLens.rotation.x = Math.PI * 0.5;
    headlightLens.position.set(0.88 * scale, 1.16 * scale, -2.54 * scale);
    hull.add(headlightLens);

    const rearGrille = new THREE.Mesh(
      new THREE.BoxGeometry(1.7 * scale, 0.42 * scale, 0.24 * scale),
      darkSteelMat
    );
    rearGrille.position.set(0, 1.06 * scale, 2.46 * scale);
    hull.add(rearGrille);

    const roadWheelGeo = new THREE.CylinderGeometry(0.29 * scale, 0.29 * scale, 0.22 * scale, 10);
    const hubGeo = new THREE.CylinderGeometry(0.11 * scale, 0.11 * scale, 0.26 * scale, 8);
    const wheelZPositions = [-2.15, -1.32, -0.45, 0.42, 1.29, 2.15];

    for (const side of [-1, 1]) {
      const track = new THREE.Mesh(
        new THREE.BoxGeometry(0.62 * scale, 0.86 * scale, 5.25 * scale),
        trackMat
      );
      track.position.set(side * 1.52 * scale, 0.50 * scale, 0);
      track.castShadow = true;
      hull.add(track);

      const sideSkirt = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.48 * scale, 4.95 * scale),
        oliveMat
      );
      sideSkirt.position.set(side * 1.84 * scale, 0.88 * scale, 0);
      sideSkirt.castShadow = true;
      hull.add(sideSkirt);

      for (const wz of wheelZPositions) {
        const wheel = new THREE.Mesh(roadWheelGeo, darkSteelMat);
        wheel.rotation.z = Math.PI * 0.5;
        wheel.position.set(side * 1.78 * scale, 0.33 * scale, wz * scale);
        hull.add(wheel);

        const hub = new THREE.Mesh(hubGeo, oliveMat);
        hub.rotation.z = Math.PI * 0.5;
        hub.position.set(side * 1.79 * scale, 0.33 * scale, wz * scale);
        hull.add(hub);
      }
    }

    // Turret
    const turret = new THREE.Group();
    turret.position.set(0, 1.55 * scale, -0.15 * scale);

    const turretBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.98 * scale, 0.84 * scale, 2.34 * scale),
      oliveMat
    );
    turretBody.castShadow = true;
    turret.add(turretBody);

    const turretBustle = new THREE.Mesh(
      new THREE.BoxGeometry(1.54 * scale, 0.54 * scale, 0.62 * scale),
      darkSteelMat
    );
    turretBustle.position.set(0, 0.04 * scale, 1.38 * scale);
    turret.add(turretBustle);

    const mantlet = new THREE.Mesh(
      new THREE.BoxGeometry(0.94 * scale, 0.54 * scale, 0.42 * scale),
      darkSteelMat
    );
    mantlet.position.set(0, 0.04 * scale, -1.24 * scale);
    turret.add(mantlet);

    const cupola = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38 * scale, 0.42 * scale, 0.28 * scale, 10),
      oliveMat
    );
    cupola.position.set(-0.3 * scale, 0.5 * scale, 0.2 * scale);
    turret.add(cupola);

    const cupolaHatch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32 * scale, 0.34 * scale, 0.08 * scale, 10),
      darkSteelMat
    );
    cupolaHatch.position.set(-0.3 * scale, 0.66 * scale, 0.2 * scale);
    turret.add(cupolaHatch);

    // Barrel elevation pivot & recoiling cannon
    const barrelPivot = new THREE.Group();
    barrelPivot.position.set(0, 0.05 * scale, -1.15 * scale);
    turret.add(barrelPivot);

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11 * scale, 0.14 * scale, 3.15 * scale, 10),
      oliveMat
    );
    barrel.rotation.x = Math.PI * 0.5;
    barrel.position.set(0, 0, -1.2 * scale);
    barrel.castShadow = true;

    const muzzleBrake = new THREE.Mesh(
      new THREE.BoxGeometry(0.34 * scale, 0.38 * scale, 0.26 * scale),
      darkSteelMat
    );
    muzzleBrake.position.set(0, -1.56 * scale, 0);
    barrel.add(muzzleBrake);
    barrelPivot.add(barrel);

    // Coaxial MG barrel
    const coaxBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035 * scale, 0.04 * scale, 0.9 * scale, 6),
      darkSteelMat
    );
    coaxBarrel.rotation.x = Math.PI * 0.5;
    coaxBarrel.position.set(0.32 * scale, 0.02 * scale, -1.55 * scale);
    turret.add(coaxBarrel);

    hull.add(turret);

    const y = this.terrain.getTerrainHeight(x, z);
    root.position.set(x, y, z);
    this.scene.add(root);

    this.allyTank = {
      id: `ally_tank_${this.nextId++}`,
      root,
      hull,
      turret,
      barrelPivot,
      barrel,
      pos: new THREE.Vector3(x, y, z),
      hullYaw: 0, // Facing north (-Z) toward enemy lines
      turretYaw: 0,
      barrelPitch: 0,
      hp: 750,
      maxHp: 750,
      destroyed: false,
      shellCooldown: 0,
      coaxCooldown: 0,
      barrelRecoil: 0,
      smokeTimer: 0,
      dustTimer: 0
    };
    this.syncHullColliders();
  }

  public hasLivingAllyTank(): boolean {
    return this.allyTank !== null && !this.allyTank.destroyed;
  }

  public getAllyTankPosition(): THREE.Vector3 | null {
    if (!this.allyTank || this.allyTank.destroyed) return null;
    return this.tmpAllyPosOut.copy(this.allyTank.pos);
  }

  public getAllyTankStatus(): { hp: number; maxHp: number; shellCooldown: number; alive: boolean } {
    if (!this.allyTank) {
      return { hp: 0, maxHp: 750, shellCooldown: 0, alive: false };
    }
    return {
      hp: Math.max(0, this.allyTank.hp),
      maxHp: this.allyTank.maxHp,
      shellCooldown: Math.max(0, this.allyTank.shellCooldown),
      alive: !this.allyTank.destroyed
    };
  }

  public applyDamageToAllyTank(amount: number): void {
    if (!this.allyTank || this.allyTank.destroyed) return;
    this.allyTank.hp = Math.max(0, this.allyTank.hp - amount);
    if (this.allyTank.hp <= 0) {
      this.allyTank.destroyed = true;
      this.allyTank.turret.rotation.z = 0.22;
      this.allyTank.turret.position.y += 0.2;
      this.allyTank.hull.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.color) {
            mat.color.setHex(0x211f1d);
            mat.emissive?.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      });
      this.vfx.spawnExplosion(this.allyTank.pos, 1.9);
      this.audio.playExplosion(4, 1.35, 0);
    }
  }

  public checkAllyTankProjectileHit(point: THREE.Vector3, damage: number, isRocket: boolean): boolean {
    const t = this.allyTank;
    if (!t || t.destroyed) return false;
    const dx = point.x - t.pos.x;
    const dz = point.z - t.pos.z;
    if (Math.hypot(dx, dz) > 2.65) return false;
    if (point.y < t.pos.y || point.y > t.pos.y + 2.7) return false;

    if (isRocket) {
      this.applyDamageToAllyTank(Math.max(45, damage * 0.7));
    } else {
      // Small arms ping armor with minor chip
      this.applyDamageToAllyTank(Math.max(1.5, damage * 0.12));
    }
    return true;
  }

  public updatePlayerControlledAllyTank(
    dt: number,
    throttle: number,
    steer: number,
    aimYaw: number,
    aimPitch: number,
    fireCannon: boolean,
    fireCoax: boolean,
    cameraOutPos: THREE.Vector3,
    onPlayerShellFired?: (origin: THREE.Vector3, dir: THREE.Vector3) => void,
    onPlayerCoaxFired?: (origin: THREE.Vector3, dir: THREE.Vector3) => void
  ): void {
    const t = this.allyTank;
    if (!t || t.destroyed) return;

    const clampedThrottle = THREE.MathUtils.clamp(throttle, -1, 1);
    const clampedSteer = THREE.MathUtils.clamp(steer, -1, 1);

    // 1. Hull drive & steering
    if (Math.abs(clampedSteer) > 0.01) {
      const steerDir = clampedThrottle < -0.1 ? -clampedSteer : clampedSteer;
      t.hullYaw += steerDir * 1.35 * dt;
    }

    if (Math.abs(clampedThrottle) > 0.01) {
      const speed = clampedThrottle >= 0 ? 6.4 : 3.8;
      const moveStep = clampedThrottle * speed * dt;
      t.pos.x = THREE.MathUtils.clamp(t.pos.x + (-Math.sin(t.hullYaw)) * moveStep, -44, 44);
      t.pos.z = THREE.MathUtils.clamp(t.pos.z + (-Math.cos(t.hullYaw)) * moveStep, -74, 54);

      this.cover.destroyWiresInRadius(t.pos.x, t.pos.z, 2.7);
      this.cover.crushByTank(t.pos, 3.05);

      t.dustTimer -= dt;
      if (t.dustTimer <= 0) {
        t.dustTimer = 0.14;
        this.tmpSmokePos.set(t.pos.x + (Math.random() - 0.5) * 2.0, t.pos.y + 0.35, t.pos.z + (Math.random() - 0.5) * 2.0);
        this.tmpSmokeVel.set((Math.random() - 0.5) * 1.1, 0.8 + Math.random() * 0.7, (Math.random() - 0.5) * 1.1);
        this.vfx.spawnSprite(this.tmpSmokePos, this.tmpSmokeVel, 0x6b5f4f, 0.85, 2.2, 0.85, 0.42, -0.2);
      }
    }

    // Terrain conformance
    const hC = this.terrain.getTerrainHeight(t.pos.x, t.pos.z);
    const fwdX = -Math.sin(t.hullYaw);
    const fwdZ = -Math.cos(t.hullYaw);
    const hFront = this.terrain.getTerrainHeight(t.pos.x + fwdX * 1.9, t.pos.z + fwdZ * 1.9);
    const hBack = this.terrain.getTerrainHeight(t.pos.x - fwdX * 1.9, t.pos.z - fwdZ * 1.9);

    t.pos.y = THREE.MathUtils.lerp(t.pos.y, hC, Math.min(1, dt * 10));
    t.root.position.copy(t.pos);
    t.hull.rotation.y = t.hullYaw;
    t.hull.rotation.x = THREE.MathUtils.lerp(
      t.hull.rotation.x,
      Math.atan2(hFront - hBack, 3.8),
      Math.min(1, dt * 7)
    );

    // 2. Turret tracking toward player aimYaw & barrel elevation
    const desiredLocalYaw = aimYaw - t.hullYaw;
    const curLocal = t.turret.rotation.y;
    const dYaw = Math.atan2(Math.sin(desiredLocalYaw - curLocal), Math.cos(desiredLocalYaw - curLocal));
    t.turret.rotation.y += THREE.MathUtils.clamp(dYaw, -dt * 2.8, dt * 2.8);
    t.turretYaw = t.hullYaw + t.turret.rotation.y;

    t.barrelPitch = THREE.MathUtils.clamp(aimPitch, -0.14, 0.34);
    t.barrelPivot.rotation.x = t.barrelPitch;

    // Recoil recovery
    const scale = 1.06;
    t.barrelRecoil = THREE.MathUtils.lerp(t.barrelRecoil, 0, Math.min(1, dt * 9));
    t.barrel.position.z = -1.2 * scale + t.barrelRecoil;

    // 3. Cooldowns & Firing
    t.shellCooldown = Math.max(0, t.shellCooldown - dt);
    t.coaxCooldown = Math.max(0, t.coaxCooldown - dt);

    const cosPitch = Math.cos(t.barrelPitch);
    this.tmpDir.set(
      -Math.sin(t.turretYaw) * cosPitch,
      Math.sin(t.barrelPitch),
      -Math.cos(t.turretYaw) * cosPitch
    ).normalize();

    if (fireCannon && t.shellCooldown <= 0) {
      t.shellCooldown = 2.6;
      t.barrelRecoil = 0.56;
      this.tmpMuzzle.set(
        t.pos.x + this.tmpDir.x * 3.8,
        t.pos.y + 1.65 * scale + this.tmpDir.y * 3.8,
        t.pos.z + this.tmpDir.z * 3.8
      );
      this.projectiles.spawnRocket(this.tmpMuzzle, this.tmpDir, 'ally', 56);
      this.vfx.spawnFlashLight(this.tmpMuzzle, 0xffaa44, 6.2, 0.22);
      this.audio.playGunshot('tankCannon', 1, 0);
      onPlayerShellFired?.(this.tmpMuzzle, this.tmpDir);
    }

    if (fireCoax && t.coaxCooldown <= 0) {
      t.coaxCooldown = 0.095;
      const rightX = Math.cos(t.turretYaw);
      const rightZ = -Math.sin(t.turretYaw);
      this.tmpCoaxMuzzle.set(
        t.pos.x + this.tmpDir.x * 2.4 + rightX * 0.32,
        t.pos.y + 1.62 * scale + this.tmpDir.y * 2.4,
        t.pos.z + this.tmpDir.z * 2.4 + rightZ * 0.32
      );
      this.tmpDir.x += (Math.random() - 0.5) * 0.022;
      this.tmpDir.y += (Math.random() - 0.5) * 0.022;
      this.tmpDir.z += (Math.random() - 0.5) * 0.022;
      this.tmpDir.normalize();
      this.projectiles.spawnBullet(this.tmpCoaxMuzzle, this.tmpDir, 138, 24, 'ally');
      this.audio.playGunshot('mg', 1, 0);
      onPlayerCoaxFired?.(this.tmpCoaxMuzzle, this.tmpDir);
    }

    // 4. Write commander cupola hatch position into cameraOutPos
    const sinT = Math.sin(t.turretYaw);
    const cosT = Math.cos(t.turretYaw);
    const localHatchX = -0.32;
    const localHatchZ = 0.05;
    cameraOutPos.set(
      t.pos.x + localHatchX * cosT + localHatchZ * sinT,
      t.pos.y + 2.52 * scale,
      t.pos.z - localHatchX * sinT + localHatchZ * cosT
    );

    this.syncHullColliders();
  }

  public getLivingTankCount(): number {
    let count = 0;
    for (let i = 0; i < this.tanks.length; i++) {
      if (!this.tanks[i].destroyed) count++;
    }
    return count;
  }

  public getNearestTankDistance(pos: THREE.Vector3): number {
    let min = Infinity;
    for (const t of this.tanks) {
      if (!t.destroyed) {
        const d = t.pos.distanceTo(pos);
        if (d < min) min = d;
      }
    }
    return min;
  }

  public checkProjectileHit(
    point: THREE.Vector3,
    isRocket: boolean,
    onDestroyed?: (t: TankEntity) => void,
    bulletDamage = 35
  ): boolean {
    for (const t of this.tanks) {
      const scale = t.heavy ? 1.18 : 0.96;
      const dx = point.x - t.pos.x;
      const dz = point.z - t.pos.z;
      const distXZ = Math.hypot(dx, dz);
      if (distXZ > 2.55 * scale) continue;
      if (point.y < t.pos.y || point.y > t.pos.y + 2.6 * scale) continue;

      if (!isRocket) {
        // Small arms ricochet off armor
        return true;
      }

      if (t.destroyed) return true;

      // Determine directional hitZone (tracks on lower hull / flanks, turret on upper hull, front/rear/side)
      const fwdX = -Math.sin(t.hullYaw);
      const fwdZ = -Math.cos(t.hullYaw);
      this.tmpToHit.set(dx, dz).normalize();
      const dot = fwdX * this.tmpToHit.x + fwdZ * this.tmpToHit.y;
      const relY = point.y - t.pos.y;

      let hitZone: HitZone = 'armor_side';
      if (relY <= 1.15 * scale && dot <= 0.55) {
        hitZone = 'tracks';
      } else if (relY >= 1.48 * scale) {
        hitZone = 'turret';
      } else if (dot > 0.45) {
        hitZone = 'armor_front';
      } else if (dot < -0.45) {
        hitZone = 'armor_rear';
      }

      const result = this.vehicleDamage.applyHit(t.id, 'enemy', t.subsystems, {
        sourceId: 'player',
        targetId: t.id,
        damageType: 'shell',
        baseDamage: 240,
        impactPosition: { x: point.x, y: point.y, z: point.z },
        hitZone,
        distance: 25,
        material: 'steel_heavy'
      });

      t.hp = t.subsystems.hullHp;
      if (result.subsystemDamaged) {
        this.onSubsystemDamaged?.(t, result.subsystemDamaged, t.subsystems);
      }
      if (t.subsystems.state === 'destroyed' || t.hp <= 0) {
        this.destroyTank(t);
        onDestroyed?.(t);
      }
      return true;
    }

    // Check active troopCars (vulnerable to bullets AND rockets)
    for (const c of this.troopCars) {
      if (c.destroyed) continue;
      const dx = point.x - c.pos.x;
      const dz = point.z - c.pos.z;
      if (Math.hypot(dx, dz) > 2.25) continue;
      if (point.y < c.pos.y || point.y > c.pos.y + 2.25) continue;

      const dmg = isRocket ? 150 : Math.max(8, bulletDamage);
      c.hp -= dmg;
      if (c.hp <= 0) {
        this.destroyTroopCar(c);
      }
      return true;
    }

    return false;
  }

  public applyBlastDamage(
    center: THREE.Vector3,
    radius: number,
    maxDamage: number,
    onDestroyed?: (t: TankEntity) => void
  ): void {
    for (const t of this.tanks) {
      if (t.destroyed) continue;
      const d = t.pos.distanceTo(center);
      if (d <= radius) {
        const dx = center.x - t.pos.x;
        const dz = center.z - t.pos.z;
        const distXZ = Math.max(0.01, Math.hypot(dx, dz));
        const fwdX = -Math.sin(t.hullYaw);
        const fwdZ = -Math.cos(t.hullYaw);
        const dot = (fwdX * dx + fwdZ * dz) / distXZ;
        const relY = center.y - t.pos.y;
        const hitZone: HitZone =
          relY <= 1.25 ? 'tracks' : dot > 0.45 ? 'armor_front' : dot < -0.45 ? 'armor_rear' : 'armor_side';

        const falloff = 1 - (d / radius) * 0.5;
        const result = this.vehicleDamage.applyHit(t.id, 'enemy', t.subsystems, {
          sourceId: 'explosion',
          targetId: t.id,
          damageType: 'explosion',
          baseDamage: Math.max(60, maxDamage * 1.45 * falloff),
          impactPosition: { x: center.x, y: center.y, z: center.z },
          hitZone,
          distance: d,
          material: 'steel_heavy'
        });
        t.hp = t.subsystems.hullHp;
        if (result.subsystemDamaged) {
          this.onSubsystemDamaged?.(t, result.subsystemDamaged, t.subsystems);
        }
        if (t.subsystems.state === 'destroyed' || t.hp <= 0) {
          this.destroyTank(t);
          onDestroyed?.(t);
        }
      }
    }

    for (const c of this.troopCars) {
      if (c.destroyed) continue;
      const d = c.pos.distanceTo(center);
      if (d <= radius) {
        const dmg = maxDamage * 1.25 * (1 - (d / radius) * 0.5);
        c.hp -= dmg;
        if (c.hp <= 0) {
          this.destroyTroopCar(c);
        }
      }
    }
  }

  private destroyTroopCar(c: TroopCarEntity): void {
    c.destroyed = true;
    c.hp = 0;
    if (!c.unloaded) {
      c.unloaded = true;
      for (const p of c.passengerMeshes) {
        p.visible = false;
      }
    }
    c.body.rotation.z = 0.14;
    c.body.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.color) {
          mat.color.setHex(0x22201e);
          mat.emissive?.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    });
    this.vfx.spawnExplosion(c.pos, 1.55);
    this.audio.playExplosion(12, 1.15, 0);
  }

  private destroyTank(t: TankEntity): void {
    t.destroyed = true;
    t.hp = 0;
    t.subsystems.hullHp = 0;
    t.subsystems.state = 'destroyed';
    t.turret.rotation.z = 0.24;
    t.turret.position.y += 0.22;
    t.hull.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.color) {
          mat.color.setHex(0x211f1d);
          mat.emissive?.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    });
    this.vfx.spawnExplosion(t.pos, 1.9);
    this.audio.playExplosion(12, 1.35, 0);
  }

  private syncHullColliders(): void {
    this.hullColliderPool.length = 0;

    for (let i = 0; i < this.tanks.length; i++) {
      const t = this.tanks[i];
      const scale = t.heavy ? 1.18 : 0.96;
      this.hullColliderPool.push({
        id: t.id,
        x: t.pos.x,
        y: t.pos.y,
        z: t.pos.z,
        halfW: 1.85 * scale,
        halfH: 1.5 * scale,
        halfL: 2.6 * scale,
        yaw: t.hullYaw
      });
    }

    for (let i = 0; i < this.troopCars.length; i++) {
      const c = this.troopCars[i];
      this.hullColliderPool.push({
        id: c.id,
        x: c.pos.x,
        y: c.pos.y,
        z: c.pos.z,
        halfW: 1.05,
        halfH: 1.05,
        halfL: 2.25,
        yaw: c.yaw
      });
    }

    if (this.allyTank) {
      const a = this.allyTank;
      this.hullColliderPool.push({
        id: a.id,
        x: a.pos.x,
        y: a.pos.y,
        z: a.pos.z,
        halfW: 1.9,
        halfH: 1.55,
        halfL: 2.65,
        yaw: a.hullYaw
      });
    }

    this.cover.setTankHulls(this.hullColliderPool);
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerEyeY: number,
    playerExposure: number,
    onExplosion: (center: THREE.Vector3, radius: number, maxDmg: number, craterR: number, craterD: number, cause: string) => void,
    peekDanger = 0,
    diffConfig: DifficultyModifier = getDifficultyConfig('veteran')
  ): void {
    this.tmpPlayerHead.set(playerPos.x, playerEyeY, playerPos.z);

    // Update Ally Tank passive smoke / cooldowns when player isn't actively driving
    if (this.allyTank) {
      const a = this.allyTank;
      if (a.destroyed) {
        a.smokeTimer -= dt;
        if (a.smokeTimer <= 0) {
          a.smokeTimer = 0.3;
          this.tmpSmokePos.set(a.pos.x, a.pos.y + 1.8, a.pos.z);
          this.tmpSmokeVel.set((Math.random() - 0.5) * 0.6, 2.5, (Math.random() - 0.5) * 0.6);
          this.vfx.spawnSprite(this.tmpSmokePos, this.tmpSmokeVel, 0x1e1d1c, 1.4, 4.2, 2.0, 0.65, -0.2);
        }
      } else {
        a.shellCooldown = Math.max(0, a.shellCooldown - dt);
        a.coaxCooldown = Math.max(0, a.coaxCooldown - dt);
        a.barrelRecoil = THREE.MathUtils.lerp(a.barrelRecoil, 0, Math.min(1, dt * 9));
        a.barrel.position.z = -1.2 * 1.06 + a.barrelRecoil;
      }
    }

    // Update TroopCars
    for (let i = this.troopCars.length - 1; i >= 0; i--) {
      const c = this.troopCars[i];
      if (c.destroyed) {
        c.smokeTimer -= dt;
        if (c.smokeTimer <= 0) {
          c.smokeTimer = 0.32;
          this.tmpSmokePos.set(c.pos.x, c.pos.y + 1.2, c.pos.z);
          this.tmpSmokeVel.set((Math.random() - 0.5) * 0.5, 2.2, (Math.random() - 0.5) * 0.5);
          this.vfx.spawnSprite(this.tmpSmokePos, this.tmpSmokeVel, 0x201e1d, 1.0, 3.1, 1.6, 0.58, -0.2);
        }
        continue;
      }

      if (c.state === 'approaching') {
        const dx = c.dropX - c.pos.x;
        const dz = c.dropZ - c.pos.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.2) {
          c.state = 'unloading';
          c.unloadTimer = 2.5;
        } else {
          const desiredYaw = Math.atan2(-dx, -dz);
          const diff = Math.atan2(Math.sin(desiredYaw - c.yaw), Math.cos(desiredYaw - c.yaw));
          c.yaw += THREE.MathUtils.clamp(diff, -dt * 2.2, dt * 2.2);
          const speed = 8.4;
          c.pos.x += (-Math.sin(c.yaw)) * speed * dt;
          c.pos.z += (-Math.cos(c.yaw)) * speed * dt;
          for (const w of c.wheels) {
            w.rotation.x -= speed * dt * 2.3;
          }
          this.cover.destroyWiresInRadius(c.pos.x, c.pos.z, 2.1);

          c.dustTimer -= dt;
          if (c.dustTimer <= 0) {
            c.dustTimer = 0.12;
            this.tmpSmokePos.set(c.pos.x, c.pos.y + 0.25, c.pos.z);
            this.tmpSmokeVel.set((Math.random() - 0.5) * 1.2, 0.9 + Math.random() * 0.6, (Math.random() - 0.5) * 1.2);
            this.vfx.spawnSprite(this.tmpSmokePos, this.tmpSmokeVel, 0x6b5d4a, 0.75, 2.1, 0.85, 0.45, -0.2);
          }
        }
      } else if (c.state === 'unloading') {
        if (!c.unloaded) {
          c.unloaded = true;
          for (const p of c.passengerMeshes) {
            p.visible = false;
          }
          c.onUnloadSquad(c.pos.x, c.pos.z, c.passengers, c.roles);
        }
        c.unloadTimer -= dt;
        if (c.unloadTimer <= 0) {
          c.state = 'retreating';
        }
      } else if (c.state === 'retreating') {
        const dx = c.retreatX - c.pos.x;
        const dz = -96 - c.pos.z;
        const desiredYaw = Math.atan2(-dx, -dz);
        const diff = Math.atan2(Math.sin(desiredYaw - c.yaw), Math.cos(desiredYaw - c.yaw));
        c.yaw += THREE.MathUtils.clamp(diff, -dt * 1.8, dt * 1.8);
        const speed = 9.2;
        c.pos.x += (-Math.sin(c.yaw)) * speed * dt;
        c.pos.z += (-Math.cos(c.yaw)) * speed * dt;
        for (const w of c.wheels) {
          w.rotation.x -= speed * dt * 2.3;
        }
        if (c.pos.z <= -92) {
          this.scene.remove(c.root);
          this.troopCars.splice(i, 1);
          continue;
        }
      }

      const hC = this.terrain.getTerrainHeight(c.pos.x, c.pos.z);
      const fwdX = -Math.sin(c.yaw);
      const fwdZ = -Math.cos(c.yaw);
      const hFront = this.terrain.getTerrainHeight(c.pos.x + fwdX * 1.6, c.pos.z + fwdZ * 1.6);
      const hBack = this.terrain.getTerrainHeight(c.pos.x - fwdX * 1.6, c.pos.z - fwdZ * 1.6);
      c.pos.y = THREE.MathUtils.lerp(c.pos.y, hC, Math.min(1, dt * 10));
      c.root.position.copy(c.pos);
      c.body.rotation.y = c.yaw;
      c.body.rotation.x = THREE.MathUtils.lerp(c.body.rotation.x, Math.atan2(hFront - hBack, 3.2), Math.min(1, dt * 8));
    }

    // Update Enemy Tanks
    for (const t of this.tanks) {
      if (t.destroyed) {
        // Persistent burning wreck smoke column (becomes solid cover in No Man's Land!)
        t.smokeTimer -= dt;
        if (t.smokeTimer <= 0) {
          t.smokeTimer = 0.28;
          this.tmpSmokePos.set(t.pos.x, t.pos.y + 1.8, t.pos.z);
          this.tmpSmokeVel.set((Math.random() - 0.5) * 0.6, 2.6, (Math.random() - 0.5) * 0.6);
          this.vfx.spawnSprite(
            this.tmpSmokePos,
            this.tmpSmokeVel,
            0x1e1d1c,
            1.4,
            4.2,
            2.1,
            0.68,
            -0.2
          );
        }
        continue;
      }

      // 1. Move along waypoints (only if tracks & engine are operational)
      const canMove = this.vehicleDamage.canMove(t.subsystems);
      if (canMove && t.waypointIndex < t.waypoints.length) {
        const wp = t.waypoints[t.waypointIndex];
        const dx = wp.x - t.pos.x;
        const dz = wp.z - t.pos.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 1.5) {
          t.waypointIndex++;
        } else {
          const desiredYaw = Math.atan2(-dx, -dz);
          const diff = Math.atan2(Math.sin(desiredYaw - t.hullYaw), Math.cos(desiredYaw - t.hullYaw));
          t.hullYaw += THREE.MathUtils.clamp(diff, -dt * 0.7, dt * 0.7);

          const speed = t.heavy ? 2.1 : 2.9;
          t.pos.x += (-Math.sin(t.hullYaw)) * speed * dt;
          t.pos.z += (-Math.cos(t.hullYaw)) * speed * dt;

          // Crush barbed wire, walls, buildings, trees, fences & sandbags in path
          this.cover.destroyWiresInRadius(t.pos.x, t.pos.z, 2.4);
          this.cover.crushByTank(t.pos, 2.85 * (t.heavy ? 1.18 : 0.96));
        }
      } else if (!canMove || t.subsystems.state === 'disabled') {
        t.smokeTimer -= dt;
        if (t.smokeTimer <= 0) {
          t.smokeTimer = 0.42;
          this.tmpSmokePos.set(t.pos.x, t.pos.y + 1.35, t.pos.z + 1.4);
          this.tmpSmokeVel.set((Math.random() - 0.5) * 0.5, 1.8, (Math.random() - 0.5) * 0.5);
          this.vfx.spawnSprite(this.tmpSmokePos, this.tmpSmokeVel, 0x2b2927, 0.9, 2.6, 1.4, 0.5, -0.15);
        }
      }

      // Ground conformance (pitch / roll over craters)
      const hC = this.terrain.getTerrainHeight(t.pos.x, t.pos.z);
      const fwdX = -Math.sin(t.hullYaw);
      const fwdZ = -Math.cos(t.hullYaw);
      const hFront = this.terrain.getTerrainHeight(t.pos.x + fwdX * 1.8, t.pos.z + fwdZ * 1.8);
      const hBack = this.terrain.getTerrainHeight(t.pos.x - fwdX * 1.8, t.pos.z - fwdZ * 1.8);

      t.pos.y = THREE.MathUtils.lerp(t.pos.y, hC, Math.min(1, dt * 8));
      t.root.position.copy(t.pos);
      t.hull.rotation.y = t.hullYaw;
      t.hull.rotation.x = THREE.MathUtils.lerp(
        t.hull.rotation.x,
        Math.atan2(hFront - hBack, 3.6),
        Math.min(1, dt * 6)
      );

      // 2. Turret tracking toward player (scaled by turret subsystem health)
      const turretSpeedMult = this.vehicleDamage.getTurretSpeedMult(t.subsystems);
      if (turretSpeedMult > 0) {
        const dxP = playerPos.x - t.pos.x;
        const dzP = playerPos.z - t.pos.z;
        const desiredTurretWorldYaw = Math.atan2(-dxP, -dzP);
        const desiredLocalYaw = desiredTurretWorldYaw - t.hullYaw;
        const curLocal = t.turret.rotation.y;
        const dYaw = Math.atan2(Math.sin(desiredLocalYaw - curLocal), Math.cos(desiredLocalYaw - curLocal));
        const maxTurretStep = dt * 0.95 * turretSpeedMult;
        t.turret.rotation.y += THREE.MathUtils.clamp(dYaw, -maxTurretStep, maxTurretStep);
      }
      t.turretYaw = t.hullYaw + t.turret.rotation.y;

      // Barrel recoil recovery
      t.barrelRecoil = THREE.MathUtils.lerp(t.barrelRecoil, 0, Math.min(1, dt * 10));
      const scale = t.heavy ? 1.18 : 0.96;
      t.barrel.position.z = -2.1 * scale + t.barrelRecoil;

      // 3. Fire Cannon & Coaxial MG (only if turret/cannon operational)
      const canFireCannon =
        t.subsystems.turretHp > 0 && t.subsystems.cannonHp > 0 && t.subsystems.crewAlive > 0;
      const canFireMg = t.subsystems.turretHp > 0 && t.subsystems.crewAlive > 0;

      this.tmpMuzzle.set(
        t.pos.x - Math.sin(t.turretYaw) * 3.4 * scale,
        t.pos.y + 1.65 * scale,
        t.pos.z - Math.cos(t.turretYaw) * 3.4 * scale
      );
      const distPlayer = t.pos.distanceTo(playerPos);
      const pan = Math.max(-1, Math.min(1, (t.pos.x - playerPos.x) / 30));

      t.cannonCooldown -= dt;
      if (canFireCannon && t.cannonCooldown <= 0 && distPlayer < 65) {
        t.cannonCooldown = t.heavy ? 5.2 : 6.0;
        const aimDirectly = playerExposure > 0.6 || (playerExposure > 0.3 && peekDanger >= 0.6);
        if (aimDirectly) {
          this.tmpTarget.copy(this.tmpPlayerHead);
        } else {
          this.tmpTarget.set(
            playerPos.x + (Math.random() * 2 - 1) * 2.2,
            Math.max(0, playerPos.y + 0.9),
            playerPos.z - 1.3
          );
        }
        this.tmpDir.copy(this.tmpTarget).sub(this.tmpMuzzle).normalize();
        const hit = this.cover.raycastWorld(this.tmpMuzzle, this.tmpDir, 65, true);
        if (hit) {
          this.tmpTarget.copy(hit.point);
        } else {
          this.tmpTarget.copy(this.tmpMuzzle).addScaledVector(this.tmpDir, 30);
        }

        t.barrelRecoil = 0.45;
        this.vfx.spawnFlashLight(this.tmpMuzzle, 0xffaa44, 5.5, 0.2);
        this.audio.playGunshot('tankCannon', distPlayer, pan);
        onExplosion(this.tmpTarget.clone(), 5.5, 82, 1.9, 0.65, 'Disparo de canhão de tanque');
      }

      // Coaxial MG bursts when player is exposed
      t.mgCooldown -= dt;
      if (canFireMg && playerExposure > 0.28 && t.mgCooldown <= 0 && distPlayer < 55) {
        if (this.cover.hasLineOfSight(this.tmpMuzzle, this.tmpPlayerHead)) {
          t.mgCooldown = 0.11;
          this.tmpDir.copy(this.tmpPlayerHead).sub(this.tmpMuzzle).normalize();
          const spread =
            THREE.MathUtils.lerp(0.11, playerExposure > 0.65 ? 0.028 : 0.055, peekDanger) *
            diffConfig.enemySpreadMult;
          this.tmpDir.x += (Math.random() - 0.5) * spread;
          this.tmpDir.y += (Math.random() - 0.5) * spread;
          this.tmpDir.normalize();
          this.projectiles.spawnBullet(this.tmpMuzzle, this.tmpDir, 128, 16, 'enemy');
          if (Math.random() < 0.4) {
            this.audio.playGunshot('mg', distPlayer, pan);
          }
        }
      }
    }

    this.syncHullColliders();
  }
}
