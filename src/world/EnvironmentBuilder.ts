import * as THREE from 'three';
import { getProceduralTextures } from '../engine/Textures';
import { DestructibleSpec, MissionConfig, QualityLevel } from '../types';
import { CoverSystem } from './CoverSystem';
import { Terrain } from './Terrain';

export interface AnimatedProp {
  update: (dt: number, elapsed: number) => void;
}

export class EnvironmentBuilder {
  private scene: THREE.Scene;
  private terrain: Terrain;
  private cover: CoverSystem;

  private rootGroup = new THREE.Group();
  private animatedProps: AnimatedProp[] = [];
  private interactableMeshes = new Map<string, THREE.Object3D>();
  private mgBarrelMeshes = new Map<string, THREE.Object3D>();
  private bunkerMainGroup: THREE.Group | null = null;
  private sunLight: THREE.DirectionalLight | null = null;
  private hemiLight: THREE.HemisphereLight | null = null;
  private skyMesh: THREE.Mesh | null = null;
  private rainPoints: THREE.Points | null = null;

  constructor(scene: THREE.Scene, terrain: Terrain, cover: CoverSystem) {
    this.scene = scene;
    this.terrain = terrain;
    this.cover = cover;
    this.scene.add(this.rootGroup);
  }

  public clear(): void {
    this.cover.clear();
    this.animatedProps = [];
    this.interactableMeshes.clear();
    this.mgBarrelMeshes.clear();
    this.bunkerMainGroup = null;
    this.rainPoints = null;

    while (this.rootGroup.children.length > 0) {
      const child = this.rootGroup.children[0];
      this.rootGroup.remove(child);
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else if (mat) {
          mat.dispose();
        }
      });
    }
  }

  public buildMission(config: MissionConfig, quality: QualityLevel): void {
    this.clear();

    const env = config.environment;
    this.scene.fog = new THREE.FogExp2(env.fogColor, env.fogDensity);
    this.scene.background = new THREE.Color(env.skyHorizon);

    // Sky Dome
    this.buildSkyDome(env.skyTop, env.skyHorizon);

    // Lighting (strict light budget <= 8 total scene lights)
    this.hemiLight = new THREE.HemisphereLight(env.ambientColor, 0x261e17, env.ambientIntensity);
    this.rootGroup.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(env.sunColor, env.sunIntensity);
    this.sunLight.position.set(...env.sunPosition);
    if (quality !== 'low') {
      this.sunLight.castShadow = true;
      const mapSize = quality === 'high' ? 2048 : 1024;
      this.sunLight.shadow.mapSize.set(mapSize, mapSize);
      this.sunLight.shadow.camera.near = 5;
      this.sunLight.shadow.camera.far = 145;
      this.sunLight.shadow.camera.left = -56;
      this.sunLight.shadow.camera.right = 56;
      this.sunLight.shadow.camera.top = 56;
      this.sunLight.shadow.camera.bottom = -56;
      this.sunLight.shadow.bias = -0.0008;
    }
    this.rootGroup.add(this.sunLight);

    const tex = getProceduralTextures();
    const timberMat = new THREE.MeshStandardMaterial({
      map: tex.timber,
      roughness: 0.9,
      metalness: 0.05
    });
    const sandbagMat = new THREE.MeshStandardMaterial({
      map: tex.sandbag,
      roughness: 0.96,
      metalness: 0.02
    });
    const concreteMat = new THREE.MeshStandardMaterial({
      map: tex.concrete,
      roughness: 0.92,
      metalness: 0.06
    });
    const steelMat = new THREE.MeshStandardMaterial({
      map: tex.armorSteel,
      roughness: 0.65,
      metalness: 0.45
    });

    // 1. Trenches (duckboards, timber walls, destructible sandbag parapets)
    this.buildTrenches(config, timberMat, sandbagMat);

    // 2. Dugouts (safe overhead shelters with warm lantern light)
    this.buildDugouts(config, timberMat, sandbagMat);

    // 3. Ruins
    for (let i = 0; i < config.ruins.length; i++) {
      const r = config.ruins[i];
      const baseY = this.terrain.getTerrainHeight(r.x, r.z);
      const geo = new THREE.BoxGeometry(r.w, r.h, r.d);
      const mesh = new THREE.Mesh(geo, concreteMat);
      mesh.position.set(r.x, baseY + r.h * 0.45, r.z);
      mesh.rotation.y = r.rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.rootGroup.add(mesh);

      const spec: DestructibleSpec = {
        id: `ruin_${i}`,
        kind: 'ruin',
        x: r.x,
        y: baseY,
        z: r.z,
        width: r.w,
        height: r.h,
        depth: r.d,
        hp: 260,
        maxHp: 260,
        blocksBullets: true,
        blocksMovement: true,
        blocksSight: true,
        rotationY: r.rotY
      };
      this.cover.registerDestructible(spec, mesh);
    }

    // 4. Barbed wire entanglements
    this.buildBarbedWires(config, timberMat, steelMat);

    // 5. Bunkers
    this.buildBunkers(config, concreteMat, steelMat);

    // 6. Emplacements (tripod MGs)
    for (const emp of [...config.allyEmplacements, ...config.enemyEmplacements]) {
      const mgGroup = this.buildHeavyMGProp(emp.x, emp.y, emp.z, emp.yaw, steelMat);
      this.rootGroup.add(mgGroup);
      this.mgBarrelMeshes.set(emp.id, mgGroup);
    }

    // 7. Interactables (Ammo, Medic, Radio, Bunker Charge point)
    this.buildInteractables(config, tex, timberMat);

    // 8. Shattered dead trees & distant battlefield silhouette backdrop
    this.buildBattlefieldAtmosphereProps(timberMat, steelMat);

    // 9. Atmospheric effects (Rain, Flares, Searchlights)
    if (env.hasRain) {
      this.buildRain();
    }
    if (env.hasFlares) {
      this.buildFlares(env.isNight);
    }
    if (env.hasSearchlights) {
      this.buildSearchlights();
    }
  }

  private buildSkyDome(topHex: number, horizonHex: number): void {
    const geo = new THREE.SphereGeometry(170, 24, 16);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(topHex) },
        uHorizon: { value: new THREE.Color(horizonHex) }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp(normalize(vWorldPos).y * 1.45, 0.0, 1.0);
          gl_FragColor = vec4(mix(uHorizon, uTop, pow(h, 0.72)), 1.0);
        }
      `
    });
    this.skyMesh = new THREE.Mesh(geo, mat);
    this.rootGroup.add(this.skyMesh);
  }

  private buildTrenches(
    config: MissionConfig,
    timberMat: THREE.Material,
    sandbagMat: THREE.Material
  ): void {
    let bagCounter = 0;

    for (const tr of config.trenches) {
      const dx = tr.x2 - tr.x1;
      const dz = tr.z2 - tr.z1;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);

      if (tr.duckboards) {
        const planks = Math.max(2, Math.floor(len / 1.4));
        for (let i = 0; i < planks; i++) {
          const t = (i + 0.5) / planks;
          const px = tr.x1 + dx * t;
          const pz = tr.z1 + dz * t;
          const py = this.terrain.getTerrainHeight(px, pz);
          const board = new THREE.Mesh(
            new THREE.BoxGeometry(tr.width * 0.52, 0.06, 1.25),
            timberMat
          );
          board.position.set(px, py + 0.03, pz);
          board.rotation.y = angle;
          board.receiveShadow = true;
          this.rootGroup.add(board);
        }
      }

      // Timber revetment wall stakes along trench edges
      const stakes = Math.max(3, Math.floor(len / 2.2));
      const perpX = Math.cos(angle);
      const perpZ = -Math.sin(angle);
      for (let i = 0; i <= stakes; i++) {
        const t = i / stakes;
        const px = tr.x1 + dx * t;
        const pz = tr.z1 + dz * t;
        for (const side of [-1, 1]) {
          const sx = px + perpX * (tr.width * 0.52) * side;
          const sz = pz + perpZ * (tr.width * 0.52) * side;
          const sy = this.terrain.getTerrainHeight(sx, sz);
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 0.14), timberMat);
          post.position.set(sx, sy + 0.35, sz);
          post.castShadow = true;
          this.rootGroup.add(post);
        }
      }

      // Destructible Sandbag Parapet (leaving firing gaps every 4th block)
      if (tr.hasSandbags && tr.parapetSide !== 'none') {
        const segments = Math.max(2, Math.floor(len / 2.3));
        for (let i = 0; i < segments; i++) {
          // Periodic small firing slit gap on wide trenches
          if (segments > 5 && i % 4 === 2) continue;

          const t = (i + 0.5) / segments;
          const bx = tr.x1 + dx * t;
          const bz = tr.z1 + dz * t + (tr.parapetSide === 'north' ? -tr.width * 0.64 : tr.width * 0.64);
          const by = this.terrain.getTerrainHeight(bx, bz);

          const bagGroup = new THREE.Group();
          bagGroup.position.set(bx, by, bz);
          bagGroup.rotation.y = Math.atan2(dz, -dx);

          // Stacked 2 rows of sandbags
          for (let row = 0; row < 2; row++) {
            for (let col = -1; col <= 1; col++) {
              const bag = new THREE.Mesh(
                new THREE.BoxGeometry(0.68, 0.24, 0.44),
                sandbagMat
              );
              bag.position.set(col * 0.68 + (row % 2) * 0.12, 0.12 + row * 0.22, (row % 2) * 0.04);
              bag.castShadow = true;
              bag.receiveShadow = true;
              bagGroup.add(bag);
            }
          }
          this.rootGroup.add(bagGroup);

          const spec: DestructibleSpec = {
            id: `sandbag_${bagCounter++}`,
            kind: 'sandbag',
            x: bx,
            y: by - 0.1,
            z: bz,
            width: 2.1,
            height: 0.62,
            depth: 0.56,
            hp: 90,
            maxHp: 90,
            blocksBullets: true,
            blocksMovement: false,
            blocksSight: false
          };
          this.cover.registerDestructible(spec, bagGroup);
        }
      }
    }
  }

  private buildDugouts(
    config: MissionConfig,
    timberMat: THREE.Material,
    sandbagMat: THREE.Material
  ): void {
    for (const d of config.dugouts) {
      const group = new THREE.Group();
      const wallH = d.ceilingY - d.floorY;

      // Overhead reinforced log roof + dirt cap
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(d.width + 0.8, 0.42, d.depth + 0.6),
        timberMat
      );
      roof.position.set(d.x, d.ceilingY + 0.21, d.z);
      roof.castShadow = true;
      roof.receiveShadow = true;
      group.add(roof);

      const roofBags = new THREE.Mesh(
        new THREE.BoxGeometry(d.width + 0.4, 0.26, d.depth + 0.2),
        sandbagMat
      );
      roofBags.position.set(d.x, d.ceilingY + 0.54, d.z);
      roofBags.castShadow = true;
      roofBags.receiveShadow = true;
      group.add(roofBags);

      // Left & right walls
      for (const side of [-1, 1]) {
        const wx = d.x + side * (d.width * 0.5);
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, wallH, d.depth),
          timberMat
        );
        wall.position.set(wx, d.floorY + wallH * 0.5, d.z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        this.cover.addStaticBox({
          id: `${d.id}_wall_${side}`,
          minX: wx - 0.24,
          maxX: wx + 0.24,
          minY: d.floorY,
          maxY: d.ceilingY + 0.4,
          minZ: d.z - d.depth * 0.5,
          maxZ: d.z + d.depth * 0.5,
          blocksBullets: true,
          blocksMovement: true,
          blocksSight: true
        });
      }

      // Back wall
      const backZ = d.openSide === 'north' ? d.z + d.depth * 0.5 : d.z - d.depth * 0.5;
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(d.width + 0.5, wallH, 0.45),
        timberMat
      );
      backWall.position.set(d.x, d.floorY + wallH * 0.5, backZ);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      group.add(backWall);

      this.cover.addStaticBox({
        id: `${d.id}_back`,
        minX: d.x - d.width * 0.5 - 0.2,
        maxX: d.x + d.width * 0.5 + 0.2,
        minY: d.floorY,
        maxY: d.ceilingY + 0.4,
        minZ: backZ - 0.24,
        maxZ: backZ + 0.24,
        blocksBullets: true,
        blocksMovement: true,
        blocksSight: true
      });

      // Roof bullet/bomb collider
      this.cover.addStaticBox({
        id: `${d.id}_roof`,
        minX: d.x - d.width * 0.55,
        maxX: d.x + d.width * 0.55,
        minY: d.ceilingY,
        maxY: d.ceilingY + 0.65,
        minZ: d.z - d.depth * 0.55,
        maxZ: d.z + d.depth * 0.55,
        blocksBullets: true,
        blocksMovement: false,
        blocksSight: true
      });

      // Warm amber lantern inside dugout
      const lantern = new THREE.PointLight(0xffaa44, 2.2, 8.5, 1.8);
      lantern.position.set(d.x, d.ceilingY - 0.22, d.z);
      group.add(lantern);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffcc77 })
      );
      bulb.position.copy(lantern.position);
      group.add(bulb);

      // Painted wood "ABRIGO" sign on entrance header
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 256;
      signCanvas.height = 64;
      const sctx = signCanvas.getContext('2d');
      if (sctx) {
        sctx.fillStyle = '#2d2318';
        sctx.fillRect(0, 0, 256, 64);
        sctx.strokeStyle = '#d49b38';
        sctx.lineWidth = 4;
        sctx.strokeRect(4, 4, 248, 56);
        sctx.fillStyle = '#f2dec0';
        sctx.font = 'bold 34px Oswald, sans-serif';
        sctx.textAlign = 'center';
        sctx.textBaseline = 'middle';
        sctx.fillText('ABRIGO', 128, 34);
      }
      const signTex = new THREE.CanvasTexture(signCanvas);
      signTex.colorSpace = THREE.SRGBColorSpace;
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.38),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      const frontZ = d.openSide === 'north' ? d.z - d.depth * 0.5 - 0.32 : d.z + d.depth * 0.5 + 0.32;
      sign.position.set(d.x, d.ceilingY + 0.22, frontZ);
      if (d.openSide === 'south') sign.rotation.y = Math.PI;
      group.add(sign);

      this.animatedProps.push({
        update: (_dt, elapsed) => {
          lantern.intensity = 2.0 + Math.sin(elapsed * 9.5 + d.x) * 0.22;
        }
      });

      this.rootGroup.add(group);
    }
  }

  private buildBarbedWires(
    config: MissionConfig,
    timberMat: THREE.Material,
    steelMat: THREE.Material
  ): void {
    for (let i = 0; i < config.barbedWires.length; i++) {
      const w = config.barbedWires[i];
      const baseY = this.terrain.getTerrainHeight(w.x, w.z);
      const group = new THREE.Group();
      group.position.set(w.x, baseY, w.z);
      group.rotation.y = w.rotY;

      const posts = Math.max(3, Math.floor(w.len / 2.2));
      for (let p = 0; p < posts; p++) {
        const px = -w.len * 0.5 + (p / (posts - 1)) * w.len;
        for (const tilt of [-0.45, 0.45]) {
          const stake = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.05, 0.08), timberMat);
          stake.position.set(px, 0.4, 0);
          stake.rotation.x = tilt;
          stake.castShadow = true;
          group.add(stake);
        }
      }
      // Coiled steel strands
      for (let c = 0; c < Math.floor(w.len * 1.3); c++) {
        const cx = -w.len * 0.48 + (c / Math.max(1, Math.floor(w.len * 1.3) - 1)) * w.len * 0.96;
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 5, 10), steelMat);
        coil.position.set(cx, 0.42, (c % 2 === 0 ? 1 : -1) * 0.08);
        coil.rotation.y = Math.PI * 0.5 + (c % 3) * 0.2;
        group.add(coil);
      }

      this.rootGroup.add(group);

      const id = `wire_${i}`;
      this.cover.registerDestructible(
        {
          id,
          kind: 'wire',
          x: w.x,
          y: baseY,
          z: w.z,
          width: w.len,
          height: 0.85,
          depth: 1.0,
          hp: 75,
          maxHp: 75,
          blocksBullets: false,
          blocksMovement: false,
          blocksSight: false,
          rotationY: w.rotY
        },
        group
      );
      this.cover.addWireHazard({
        id,
        x: w.x,
        z: w.z,
        halfLen: w.len * 0.5,
        rotY: w.rotY,
        active: true
      });
    }
  }

  private buildBunkers(
    config: MissionConfig,
    concreteMat: THREE.Material,
    steelMat: THREE.Material
  ): void {
    for (const b of config.bunkers) {
      const baseY = this.terrain.getTerrainHeight(b.x, b.z);
      const group = new THREE.Group();
      group.position.set(b.x, baseY, b.z);

      // Thick bunker block
      const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), concreteMat);
      body.position.y = b.h * 0.5;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Sloped concrete cap
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 0.5, 0.45, b.d + 0.5),
        concreteMat
      );
      cap.position.y = b.h + 0.15;
      cap.castShadow = true;
      group.add(cap);

      // Dark firing slit facing south (+Z)
      const slit = new THREE.Mesh(
        new THREE.BoxGeometry(b.w * 0.52, 0.34, 0.3),
        new THREE.MeshBasicMaterial({ color: 0x0a0a09 })
      );
      slit.position.set(0, b.h * 0.54, b.d * 0.5 + 0.02);
      group.add(slit);

      if (b.kind === 'bunker_main') {
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.25), steelMat);
        door.position.set(0, 1.0, b.d * 0.5 + 0.04);
        group.add(door);
        this.bunkerMainGroup = group;
      }

      this.rootGroup.add(group);

      this.cover.registerDestructible(
        {
          id: b.id,
          kind: b.kind,
          x: b.x,
          y: baseY,
          z: b.z,
          width: b.w,
          height: b.h + 0.4,
          depth: b.d,
          hp: b.hp,
          maxHp: b.hp,
          blocksBullets: true,
          blocksMovement: true,
          blocksSight: true
        },
        group
      );
    }
  }

  private buildHeavyMGProp(
    x: number,
    y: number,
    z: number,
    yaw: number,
    steelMat: THREE.Material
  ): THREE.Group {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = yaw;

    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.36, 0.55, 6), steelMat);
    tripod.position.y = -0.25;
    g.add(tripod);

    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.65), steelMat);
    receiver.position.set(0, 0.08, -0.05);
    g.add(receiver);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.85, 8), steelMat);
    barrel.rotation.x = Math.PI * 0.5;
    barrel.position.set(0, 0.1, -0.58);
    g.add(barrel);

    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.36, 0.04), steelMat);
    shield.position.set(0, 0.12, -0.32);
    g.add(shield);

    return g;
  }

  private buildInteractables(
    config: MissionConfig,
    tex: ReturnType<typeof getProceduralTextures>,
    timberMat: THREE.Material
  ): void {
    for (const inter of config.interactables) {
      const y = this.terrain.getTerrainHeight(inter.x, inter.z);
      const g = new THREE.Group();
      g.position.set(inter.x, y, inter.z);

      if (inter.kind === 'ammo_crate') {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.55, 0.62),
          new THREE.MeshStandardMaterial({ map: tex.crateAmmo, roughness: 0.85 })
        );
        box.position.y = 0.275;
        box.castShadow = true;
        box.receiveShadow = true;
        g.add(box);
      } else if (inter.kind === 'medic_crate') {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.52, 0.58),
          new THREE.MeshStandardMaterial({ map: tex.crateMedic, roughness: 0.85 })
        );
        box.position.y = 0.26;
        box.castShadow = true;
        g.add(box);
      } else if (inter.kind === 'radio') {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.72, 0.55), timberMat);
        table.position.y = 0.36;
        g.add(table);
        const unit = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.38, 0.38),
          new THREE.MeshStandardMaterial({ color: 0x3b4036, roughness: 0.7 })
        );
        unit.position.y = 0.91;
        g.add(unit);
        const antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.02, 1.35, 6),
          new THREE.MeshStandardMaterial({ color: 0x888d82 })
        );
        antenna.position.set(0.2, 1.55, 0);
        g.add(antenna);
      } else if (inter.kind === 'bunker_charge') {
        const beacon = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.32, 0.14),
          new THREE.MeshBasicMaterial({ color: 0xd49b38 })
        );
        beacon.position.y = 0.9;
        g.add(beacon);
        this.animatedProps.push({
          update: (_dt, elapsed) => {
            beacon.visible = inter.active && Math.sin(elapsed * 8) > -0.3;
          }
        });
      }

      this.rootGroup.add(g);
      this.interactableMeshes.set(inter.id, g);
    }
  }

  private buildBattlefieldAtmosphereProps(
    timberMat: THREE.Material,
    steelMat: THREE.Material
  ): void {
    const deadTreeSpots = [
      [-36, 10],
      [-32, -12],
      [34, 8],
      [36, -15],
      [-42, -26],
      [40, -30]
    ];

    for (const [tx, tz] of deadTreeSpots) {
      const ty = this.terrain.getTerrainHeight(tx, tz);
      const tree = new THREE.Group();
      tree.position.set(tx, ty, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.34, 4.2, 7), timberMat);
      trunk.position.y = 2.0;
      trunk.rotation.z = (tx > 0 ? -1 : 1) * 0.08;
      trunk.castShadow = true;
      tree.add(trunk);

      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 1.8, 5), timberMat);
      branch.position.set(0.55, 2.7, 0.1);
      branch.rotation.z = -0.78;
      tree.add(branch);

      this.rootGroup.add(tree);
    }

    // Anti-tank Czech hedgehogs along flanks
    for (const [hx, hz] of [
      [-28, 18],
      [28, 17],
      [-29, -12],
      [29, -11]
    ]) {
      const hy = this.terrain.getTerrainHeight(hx, hz);
      const hh = new THREE.Group();
      hh.position.set(hx, hy + 0.55, hz);
      for (const rot of [
        [0.6, 0.6, 0],
        [-0.6, 0.2, 0.7],
        [0.2, -0.6, -0.7]
      ]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.65, 0.12), steelMat);
        bar.rotation.set(rot[0], rot[1], rot[2]);
        bar.castShadow = true;
        hh.add(bar);
      }
      this.rootGroup.add(hh);
    }
  }

  private buildRain(): void {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xaab5bd,
      size: 0.16,
      transparent: true,
      opacity: 0.45
    });
    this.rainPoints = new THREE.Points(geo, mat);
    this.rootGroup.add(this.rainPoints);

    this.animatedProps.push({
      update: (dt) => {
        if (!this.rainPoints) return;
        const pos = this.rainPoints.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          let y = pos.getY(i) - dt * 26;
          if (y < -1) y = 26;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }
    });
  }

  private buildFlares(isNight: boolean): void {
    const flare = new THREE.Group();
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 8),
      new THREE.MeshBasicMaterial({ color: isNight ? 0xeef4ff : 0xffcc77 })
    );
    flare.add(bulb);
    const light = new THREE.PointLight(isNight ? 0xd8e6ff : 0xffb366, isNight ? 3.5 : 1.8, 48, 1.2);
    flare.add(light);
    flare.position.set(-10, 24, -6);
    this.rootGroup.add(flare);

    this.animatedProps.push({
      update: (_dt, elapsed) => {
        const cycle = (elapsed * 0.08) % 1;
        flare.position.y = 26 - cycle * 19;
        flare.position.x = -8 + Math.sin(elapsed * 0.7) * 8;
        flare.position.z = -5 + Math.cos(elapsed * 0.45) * 6;
        light.intensity = (isNight ? 3.4 : 1.7) * (0.85 + Math.sin(elapsed * 16) * 0.15);
      }
    });
  }

  private buildSearchlights(): void {
    for (const [sx, sz, phase] of [
      [-18, -36, 0],
      [18, -36, 2.1]
    ]) {
      const coneGeo = new THREE.ConeGeometry(6.5, 42, 16, 1, true);
      coneGeo.translate(0, -21, 0);
      coneGeo.rotateX(Math.PI * 0.5);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xcfe2ff,
        transparent: true,
        opacity: 0.085,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const beam = new THREE.Mesh(coneGeo, coneMat);
      beam.position.set(sx, 2.8, sz);
      this.rootGroup.add(beam);

      this.animatedProps.push({
        update: (_dt, elapsed) => {
          beam.rotation.y = Math.sin(elapsed * 0.42 + phase) * 0.75;
          beam.rotation.x = -0.18 + Math.cos(elapsed * 0.55 + phase) * 0.1;
        }
      });
    }
  }

  public shatterMainBunker(): void {
    if (this.bunkerMainGroup) {
      this.bunkerMainGroup.rotation.z = 0.18;
      this.bunkerMainGroup.position.y -= 1.25;
      this.bunkerMainGroup.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (m.color) m.color.setHex(0x282624);
        }
      });
    }
  }

  public update(dt: number, elapsed: number): void {
    for (const prop of this.animatedProps) {
      prop.update(dt, elapsed);
    }
  }
}
