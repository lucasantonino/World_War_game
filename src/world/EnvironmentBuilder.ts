import * as THREE from 'three';
import { getProceduralTextures } from '../engine/Textures';
import { DestructibleSpec, DestructionStage, MissionConfig, MissionEnvironment, QualityLevel } from '../types';
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
  private trenchStakes: Array<{ x: number; z: number; mesh: THREE.Mesh; collapsed: boolean }> = [];
  private dugoutVisuals = new Map<
    string,
    {
      roof: THREE.Mesh;
      roofBags: THREE.Mesh;
      lantern: THREE.PointLight;
      bulb: THREE.Mesh;
      sign: THREE.Mesh;
      rubble: THREE.Mesh;
      stage: DestructionStage;
    }
  >();
  private disposableTextures: THREE.Texture[] = [];
  private destructibleStageHandlers = new Map<string, (stage: DestructionStage) => void>();
  private timberMat: THREE.Material | null = null;
  private mudCollapseMat: THREE.Material | null = null;
  private bunkerMainGroup: THREE.Group | null = null;
  private sunLight: THREE.DirectionalLight | null = null;
  private hemiLight: THREE.HemisphereLight | null = null;
  private skyMesh: THREE.Mesh | null = null;
  private skyUniforms: {
    uTop: { value: THREE.Color };
    uHorizon: { value: THREE.Color };
    uFlash: { value: number };
    uFlashDir: { value: THREE.Vector3 };
    uFlashColor: { value: THREE.Color };
  } | null = null;
  private horizonFlashMesh: THREE.Mesh | null = null;
  private weatherPoints: THREE.Points | null = null;
  private weatherVelocities: Float32Array | null = null;
  private isRainWeather = false;
  private weatherBaseOpacity = 0.42;
  private weatherElapsed = 0;
  private baseFogDensity = 0.015;
  private baseSunIntensity = 1.0;
  private baseHemiIntensity = 0.6;
  private artilleryFlashTimer = 5.0;
  private artilleryFlashPulse = 0;
  private artilleryDoublePending = false;

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
    this.trenchStakes = [];
    this.dugoutVisuals.clear();
    this.destructibleStageHandlers.clear();
    this.bunkerMainGroup = null;
    this.sunLight = null;
    this.hemiLight = null;
    this.skyMesh = null;
    this.skyUniforms = null;
    this.horizonFlashMesh = null;
    this.weatherPoints = null;
    this.weatherVelocities = null;
    this.weatherElapsed = 0;
    this.artilleryFlashPulse = 0;
    this.artilleryDoublePending = false;
    this.timberMat = null;
    this.mudCollapseMat = null;

    for (const tex of this.disposableTextures) {
      tex.dispose();
    }
    this.disposableTextures = [];

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
    this.baseFogDensity = env.fogDensity;
    this.baseSunIntensity = env.sunIntensity;
    this.baseHemiIntensity = env.ambientIntensity;
    this.isRainWeather = env.hasRain;
    this.weatherElapsed = 0;
    this.artilleryFlashTimer = 3.2 + Math.random() * 5.0;
    this.artilleryFlashPulse = 0;
    this.artilleryDoublePending = false;

    this.scene.fog = new THREE.FogExp2(env.fogColor, env.fogDensity);
    this.scene.background = new THREE.Color(env.skyHorizon);

    // Sky Dome + distant artillery horizon flash billboard
    this.buildSkyDome(env.skyTop, env.skyHorizon, env.isNight);
    this.buildHorizonFlashMesh(env.isNight);

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
      this.sunLight.shadow.camera.far = 195;
      this.sunLight.shadow.camera.left = -84;
      this.sunLight.shadow.camera.right = 84;
      this.sunLight.shadow.camera.top = 84;
      this.sunLight.shadow.camera.bottom = -84;
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
    const darkWindowMat = new THREE.MeshStandardMaterial({
      color: 0x111214,
      roughness: 0.95,
      metalness: 0.05
    });
    this.timberMat = timberMat;
    this.mudCollapseMat = new THREE.MeshStandardMaterial({
      map: tex.mud,
      color: 0x6f5a46,
      roughness: 0.96,
      metalness: 0.02
    });

    // 1. Trenches (duckboards, continuous timber plank walls, destructible sandbag parapets)
    this.buildTrenches(config, timberMat, sandbagMat, tex.timber);

    // 1b. Reflective mud puddles in trench floors & craters (no extra PointLights)
    this.buildMudPuddles(config);

    // 1c. Packed-earth flank trails / dirt roads for reinforcement vehicles (no extra PointLights)
    this.buildDirtRoads(config, tex.mud);

    // 2. Dugouts (safe overhead shelters with warm lantern light)
    this.buildDugouts(config, timberMat, sandbagMat);

    // 3. Ruins & Enterable/Bombed Buildings (3-stage destructibles + tactical cover nodes)
    this.buildRuins(config, concreteMat);
    this.buildBuildings(config, concreteMat, timberMat, sandbagMat, steelMat, darkWindowMat);
    this.registerCraterTacticalNodes(config);

    // 4. Destructible Trees & Fences
    this.buildTrees(config, timberMat);
    this.buildFences(config, timberMat);

    // 5. Barbed wire entanglements
    this.buildBarbedWires(config, timberMat, steelMat);

    // 6. Bunkers
    this.buildBunkers(config, concreteMat, steelMat);

    // 7. Emplacements (tripod MGs)
    for (const emp of [...config.allyEmplacements, ...config.enemyEmplacements]) {
      const mgGroup = this.buildHeavyMGProp(emp.x, emp.y, emp.z, emp.yaw, steelMat);
      this.rootGroup.add(mgGroup);
      this.mgBarrelMeshes.set(emp.id, mgGroup);
    }

    // 8. Interactables (Ammo, Medic, Radio, Bunker Charge point)
    this.buildInteractables(config, tex, timberMat);

    // 9. Shattered dead trees fallback, anti-tank hedgehogs & battlefield clutter props
    this.buildBattlefieldAtmosphereProps(config, timberMat, steelMat);
    this.buildBattlefieldDetails(config, timberMat, steelMat);

    // 10. Atmospheric effects (Rain or Battle Ash/Embers, Flares, Searchlights)
    this.buildWeatherParticles(env, quality);
    if (env.hasFlares) {
      this.buildFlares(env.isNight);
    }
    if (env.hasSearchlights) {
      this.buildSearchlights(config);
    }
  }

  private buildSkyDome(topHex: number, horizonHex: number, isNight: boolean): void {
    const geo = new THREE.SphereGeometry(215, 24, 16);
    this.skyUniforms = {
      uTop: { value: new THREE.Color(topHex) },
      uHorizon: { value: new THREE.Color(horizonHex) },
      uFlash: { value: 0 },
      uFlashDir: { value: new THREE.Vector3(0.0, 0.08, -1.0).normalize() },
      uFlashColor: { value: new THREE.Color(isNight ? 0xffb36b : 0xff9a52) }
    };
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: this.skyUniforms,
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
        uniform float uFlash;
        uniform vec3 uFlashDir;
        uniform vec3 uFlashColor;
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = clamp(dir.y * 1.45, 0.0, 1.0);
          vec3 baseCol = mix(uHorizon, uTop, pow(h, 0.72));
          float dirGlow = pow(max(dot(dir, normalize(uFlashDir)), 0.0), 5.0);
          float horizonBand = 1.0 - smoothstep(0.0, 0.48, h);
          baseCol += uFlashColor * dirGlow * horizonBand * uFlash * 0.95;
          gl_FragColor = vec4(baseCol, 1.0);
        }
      `
    });
    this.skyMesh = new THREE.Mesh(geo, mat);
    this.rootGroup.add(this.skyMesh);
  }

  private buildHorizonFlashMesh(isNight: boolean): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
      grad.addColorStop(0, isNight ? 'rgba(255, 224, 175, 0.95)' : 'rgba(255, 200, 140, 0.85)');
      grad.addColorStop(0.35, 'rgba(255, 138, 66, 0.45)');
      grad.addColorStop(1, 'rgba(255, 100, 40, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this.disposableTextures.push(tex);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending
    });
    this.horizonFlashMesh = new THREE.Mesh(new THREE.PlaneGeometry(44, 24), mat);
    this.horizonFlashMesh.position.set(0, 8, -155);
    this.horizonFlashMesh.visible = false;
    this.rootGroup.add(this.horizonFlashMesh);
  }

  private pointToSegmentDist(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
    const vx = x2 - x1;
    const vz = z2 - z1;
    const lenSq = vx * vx + vz * vz;
    if (lenSq < 1e-6) return Math.hypot(px - x1, pz - z1);
    const t = Math.max(0, Math.min(1, ((px - x1) * vx + (pz - z1) * vz) / lenSq));
    return Math.hypot(px - (x1 + vx * t), pz - (z1 + vz * t));
  }

  private isWallOpening(wx: number, wz: number, trenchId: string, config: MissionConfig): boolean {
    for (const r of config.ramps) {
      if (this.pointToSegmentDist(wx, wz, r.x1, r.z1, r.x2, r.z2) < r.width * 0.65) {
        return true;
      }
    }
    for (const d of config.dugouts) {
      const doorZ = d.openSide === 'north' ? d.z - d.depth * 0.5 : d.z + d.depth * 0.5;
      if (Math.abs(wx - d.x) < d.width * 0.48 && Math.abs(wz - doorZ) < 1.9) {
        return true;
      }
    }
    for (const other of config.trenches) {
      if (other.id === trenchId) continue;
      if (this.pointToSegmentDist(wx, wz, other.x1, other.z1, other.x2, other.z2) < other.width * 0.48) {
        return true;
      }
    }
    return false;
  }

  private buildTrenches(
    config: MissionConfig,
    timberMat: THREE.Material,
    sandbagMat: THREE.Material,
    timberTex: THREE.Texture
  ): void {
    let bagCounter = 0;

    // Mud-darkened timber revetment materials (non-colliding visual sheathing)
    const mudPlankMat = new THREE.MeshStandardMaterial({
      map: timberTex,
      color: 0x62503e,
      roughness: 0.92,
      metalness: 0.04
    });
    const mudLowerPlankMat = new THREE.MeshStandardMaterial({
      map: timberTex,
      color: 0x3b2f24,
      roughness: 0.96,
      metalness: 0.03
    });
    const plankUnitGeo = new THREE.BoxGeometry(0.06, 0.24, 1);
    const railUnitGeo = new THREE.BoxGeometry(0.11, 0.09, 1);

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

      // Timber revetment vertical stakes & continuous horizontal plank wall sheathing
      const stakes = Math.max(3, Math.floor(len / 2.2));
      const segLen = len / stakes;
      const perpX = Math.cos(angle);
      const perpZ = -Math.sin(angle);
      const wallOffset = tr.width * 0.52;
      const wallHeight = Math.max(0.95, tr.depth);

      for (let i = 0; i <= stakes; i++) {
        const t = i / stakes;
        const px = tr.x1 + dx * t;
        const pz = tr.z1 + dz * t;
        for (const side of [-1, 1]) {
          const sx = px + perpX * wallOffset * side;
          const sz = pz + perpZ * wallOffset * side;
          if (this.isWallOpening(sx, sz, tr.id, config)) continue;
          const sy = this.terrain.getTerrainHeight(sx, sz);
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 0.14), mudLowerPlankMat);
          post.position.set(sx, sy + 0.35, sz);
          post.rotation.y = angle;
          post.castShadow = true;
          post.receiveShadow = true;
          this.rootGroup.add(post);
          this.trenchStakes.push({ x: sx, z: sz, mesh: post, collapsed: false });
        }
      }

      // Continuous horizontal wood plank tiers + top crossbeam along trench walls (no collision)
      const plankOffset = tr.width * 0.55;
      for (let i = 0; i < stakes; i++) {
        const tMid = (i + 0.5) / stakes;
        const px = tr.x1 + dx * tMid;
        const pz = tr.z1 + dz * tMid;
        const floorY = this.terrain.getTerrainHeight(px, pz);

        for (const side of [-1, 1]) {
          const wx = px + perpX * plankOffset * side;
          const wz = pz + perpZ * plankOffset * side;
          if (this.isWallOpening(wx, wz, tr.id, config)) continue;

          // 3 horizontal plank courses darkened near mud floor
          const tiers: Array<{ yFrac: number; mat: THREE.Material }> = [
            { yFrac: 0.16, mat: mudLowerPlankMat },
            { yFrac: 0.44, mat: mudLowerPlankMat },
            { yFrac: 0.72, mat: mudPlankMat }
          ];
          for (const tier of tiers) {
            const plank = new THREE.Mesh(plankUnitGeo, tier.mat);
            plank.scale.set(1, 1, segLen + 0.04);
            plank.position.set(wx, floorY + wallHeight * tier.yFrac, wz);
            plank.rotation.y = angle;
            plank.receiveShadow = true;
            this.rootGroup.add(plank);
          }

          // Upper horizontal ledger rail along the parapet rim
          const topRail = new THREE.Mesh(railUnitGeo, mudPlankMat);
          topRail.scale.set(1, 1, segLen + 0.04);
          topRail.position.set(wx, floorY + wallHeight * 0.94, wz);
          topRail.rotation.y = angle;
          topRail.receiveShadow = true;
          this.rootGroup.add(topRail);
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

          const bottomRowGroup = new THREE.Group();
          const topRowGroup = new THREE.Group();
          const rubbleGroup = new THREE.Group();
          rubbleGroup.visible = false;

          for (let col = -1; col <= 1; col++) {
            const bottomBag = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 0.44), sandbagMat);
            bottomBag.position.set(col * 0.68, 0.12, 0);
            bottomBag.castShadow = true;
            bottomBag.receiveShadow = true;
            bottomRowGroup.add(bottomBag);

            const topBag = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 0.44), sandbagMat);
            topBag.position.set(col * 0.68 + 0.12, 0.34, 0.04);
            topBag.castShadow = true;
            topBag.receiveShadow = true;
            topRowGroup.add(topBag);
          }

          // Burst/collapsed sandbag rubble for stage 2
          for (let r = 0; r < 5; r++) {
            const burstBag = new THREE.Mesh(
              new THREE.BoxGeometry(0.46, 0.11, 0.34),
              sandbagMat
            );
            burstBag.position.set(-0.7 + r * 0.36, 0.055 + (r % 2) * 0.03, ((r % 3) - 1) * 0.1);
            burstBag.rotation.set((r % 2 ? 1 : -1) * 0.08, r * 0.45, (r % 2 ? -1 : 1) * 0.12);
            burstBag.receiveShadow = true;
            rubbleGroup.add(burstBag);
          }

          bagGroup.add(bottomRowGroup);
          bagGroup.add(topRowGroup);
          bagGroup.add(rubbleGroup);
          this.rootGroup.add(bagGroup);

          const bagId = `sandbag_${bagCounter++}`;
          const spec: DestructibleSpec = {
            id: bagId,
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
          this.cover.registerDestructible(spec, bagGroup, (stage: DestructionStage) => {
            if (stage === 1) {
              topRowGroup.visible = false;
              bottomRowGroup.rotation.z = 0.08;
            } else if (stage === 2) {
              topRowGroup.visible = false;
              bottomRowGroup.visible = false;
              rubbleGroup.visible = true;
            }
          });

          if (i % 2 === 0) {
            const coverOffsetZ = tr.parapetSide === 'north' ? 1.15 : -1.15;
            const nodeZ = bz + coverOffsetZ;
            const nodeY = this.terrain.getTerrainHeight(bx, nodeZ);
            this.cover.registerTacticalNode({
              id: `sandbag_node_${bagId}`,
              x: bx,
              y: nodeY,
              z: nodeZ,
              radius: 1.15,
              insideBuilding: false,
              windowDirZ: tr.parapetSide === 'north' ? -1 : 1
            });
          }
        }
      }
    }
  }

  private buildMudPuddles(config: MissionConfig): void {
    const puddleMat = new THREE.MeshStandardMaterial({
      color: 0x1b211d,
      roughness: 0.08,
      metalness: 0.35
    });
    const puddleGeo = new THREE.CircleGeometry(1, 16);
    puddleGeo.rotateX(-Math.PI * 0.5);

    // Reflective mud puddles inside crater basins
    for (let i = 0; i < config.initialCraters.length; i++) {
      const c = config.initialCraters[i];
      if (c.radius < 1.9) continue;
      const cy = this.terrain.getTerrainHeight(c.x, c.z);
      const r = Math.max(0.62, c.radius * 0.42);
      const puddle = new THREE.Mesh(puddleGeo, puddleMat);
      puddle.scale.set(r, 1, r * (0.88 + (i % 3) * 0.08));
      puddle.position.set(c.x, cy + 0.038, c.z);
      puddle.rotation.y = (i * 0.9) % Math.PI;
      puddle.receiveShadow = true;
      this.rootGroup.add(puddle);
    }

    // Reflective puddles along muddy trench floors (below/between duckboards, zero collision)
    for (const tr of config.trenches) {
      const dx = tr.x2 - tr.x1;
      const dz = tr.z2 - tr.z1;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);
      const perpX = Math.cos(angle);
      const perpZ = -Math.sin(angle);
      const puddleCount = Math.max(1, Math.floor(len / 7.0));

      for (let i = 0; i < puddleCount; i++) {
        const t = (i + 0.35) / puddleCount;
        const sideShift = ((i % 2 === 0 ? 1 : -1) * tr.width) * 0.22;
        const px = tr.x1 + dx * t + perpX * sideShift;
        const pz = tr.z1 + dz * t + perpZ * sideShift;
        const py = this.terrain.getTerrainHeight(px, pz);

        const puddle = new THREE.Mesh(puddleGeo, puddleMat);
        puddle.scale.set(0.46, 1, 0.85);
        puddle.position.set(px, py + 0.025, pz);
        puddle.rotation.y = angle + (i % 2 ? 0.15 : -0.12);
        puddle.receiveShadow = true;
        this.rootGroup.add(puddle);
      }
    }
  }

  private buildDirtRoads(config: MissionConfig, mudTex: THREE.Texture): void {
    const roadMat = new THREE.MeshStandardMaterial({
      map: mudTex,
      color: 0x4b3d2f,
      roughness: 0.97,
      metalness: 0.02
    });
    const rutMat = new THREE.MeshStandardMaterial({
      color: 0x2e251c,
      roughness: 0.98,
      metalness: 0.01
    });

    const addRoadStrip = (x1: number, z1: number, x2: number, z2: number, width: number) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      if (len < 2) return;
      const steps = Math.max(2, Math.floor(len / 4.2));
      const segLen = len / steps;
      const yaw = Math.atan2(dx, dz);
      const perpX = Math.cos(yaw);
      const perpZ = -Math.sin(yaw);

      const slabGeo = new THREE.BoxGeometry(width, 0.04, segLen + 0.35);
      const rutGeo = new THREE.BoxGeometry(0.42, 0.05, segLen + 0.32);

      for (let i = 0; i < steps; i++) {
        const t = (i + 0.5) / steps;
        const px = x1 + dx * t;
        const pz = z1 + dz * t;
        if (this.terrain.isInsideTrenchOrDugout(px, pz)) continue;

        let blockedByBuilding = false;
        for (const b of config.buildings ?? []) {
          if (Math.hypot(px - b.x, pz - b.z) < Math.max(b.w, b.d) * 0.65) {
            blockedByBuilding = true;
            break;
          }
        }
        if (blockedByBuilding) continue;

        const py = this.terrain.getTerrainHeight(px, pz);
        const ny = this.terrain.getTerrainHeight(px + (dx / len) * 1.4, pz + (dz / len) * 1.4);
        const by = this.terrain.getTerrainHeight(px - (dx / len) * 1.4, pz - (dz / len) * 1.4);
        const pitch = Math.atan2(by - ny, 2.8);

        const slab = new THREE.Mesh(slabGeo, roadMat);
        slab.position.set(px, py + 0.018, pz);
        slab.rotation.set(pitch, yaw, 0);
        slab.receiveShadow = true;
        this.rootGroup.add(slab);

        for (const side of [-1, 1]) {
          const rx = px + perpX * (width * 0.28) * side;
          const rz = pz + perpZ * (width * 0.28) * side;
          const rut = new THREE.Mesh(rutGeo, rutMat);
          rut.position.set(rx, py + 0.022, rz);
          rut.rotation.set(pitch, yaw, 0);
          rut.receiveShadow = true;
          this.rootGroup.add(rut);
        }
      }
    };

    // Subtle flank dirt tracks for troop carrier approach
    addRoadStrip(-56, -84, -48, 28, 3.6);
    addRoadStrip(56, -84, 48, 28, 3.6);

    // Additional paths derived from troopCarsToSpawn routes in mission phases
    const seenRoutes = new Set<string>();
    for (const ph of config.phases) {
      if (!ph.troopCarsToSpawn) continue;
      for (const car of ph.troopCarsToSpawn) {
        const key = `${Math.round(car.x / 6)}_${Math.round(car.dropX / 6)}_${Math.round(car.dropZ / 10)}`;
        if (seenRoutes.has(key)) continue;
        seenRoutes.add(key);
        addRoadStrip(car.x, car.z, car.dropX, car.dropZ, 3.4);
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
      const signLabel = d.label ?? 'ABRIGO';
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
        sctx.font = signLabel.length > 8 ? 'bold 24px Oswald, sans-serif' : 'bold 34px Oswald, sans-serif';
        sctx.textAlign = 'center';
        sctx.textBaseline = 'middle';
        sctx.fillText(signLabel, 128, 34);
      }
      const signTex = new THREE.CanvasTexture(signCanvas);
      signTex.colorSpace = THREE.SRGBColorSpace;
      this.disposableTextures.push(signTex);
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.38),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      const frontZ = d.openSide === 'north' ? d.z - d.depth * 0.5 - 0.32 : d.z + d.depth * 0.5 + 0.32;
      sign.position.set(d.x, d.ceilingY + 0.22, frontZ);
      if (d.openSide === 'south') sign.rotation.y = Math.PI;
      group.add(sign);

      // Collapsed entrance rubble (hidden until stage 2)
      const entranceZ = d.openSide === 'north' ? d.z - d.depth * 0.4 : d.z + d.depth * 0.4;
      const rubble = new THREE.Mesh(
        new THREE.BoxGeometry(d.width * 0.86, 0.92, 1.35),
        sandbagMat
      );
      rubble.position.set(d.x, d.floorY + 0.46, entranceZ);
      rubble.castShadow = true;
      rubble.receiveShadow = true;
      rubble.visible = false;

      const beamDebris = new THREE.Mesh(
        new THREE.BoxGeometry(d.width * 0.9, 0.24, 0.32),
        timberMat
      );
      beamDebris.position.set(0, 0.42, -0.15);
      beamDebris.rotation.set(0.24, 0.08, -0.16);
      rubble.add(beamDebris);
      group.add(rubble);

      this.dugoutVisuals.set(d.id, {
        roof,
        roofBags,
        lantern,
        bulb,
        sign,
        rubble,
        stage: 0
      });

      if (d.damageStage) {
        this.setDugoutStage(d.id, d.damageStage);
      }

      this.animatedProps.push({
        update: (_dt, elapsed) => {
          const v = this.dugoutVisuals.get(d.id);
          if (!v) return;
          if (v.stage === 2) {
            v.lantern.intensity = 0;
          } else if (v.stage === 1) {
            const flicker =
              Math.sin(elapsed * 23.0 + d.x) * Math.cos(elapsed * 37.0 + d.z) > -0.25 ? 1.55 : 0.25;
            v.lantern.intensity = flicker + Math.sin(elapsed * 14.0) * 0.25;
          } else {
            v.lantern.intensity = 2.0 + Math.sin(elapsed * 9.5 + d.x) * 0.22;
          }
        }
      });

      this.rootGroup.add(group);
    }
  }

  private buildRuins(config: MissionConfig, concreteMat: THREE.Material): void {
    for (let i = 0; i < config.ruins.length; i++) {
      const r = config.ruins[i];
      const baseY = this.terrain.getTerrainHeight(r.x, r.z);
      const group = new THREE.Group();
      group.position.set(r.x, baseY, r.z);
      group.rotation.y = r.rotY;

      const midSection = new THREE.Group();
      const midH = r.h * 0.56;
      const lowerWall = new THREE.Mesh(new THREE.BoxGeometry(r.w, midH, r.d), concreteMat);
      lowerWall.position.y = midH * 0.5;
      lowerWall.castShadow = true;
      lowerWall.receiveShadow = true;
      midSection.add(lowerWall);

      const topSection = new THREE.Group();
      const topH = r.h * 0.44;
      const leftTop = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.46, topH, r.d * 0.96), concreteMat);
      leftTop.position.set(-r.w * 0.25, midH + topH * 0.5, 0);
      leftTop.castShadow = true;
      leftTop.receiveShadow = true;
      topSection.add(leftTop);

      const rightTop = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.36, topH * 0.78, r.d * 0.96), concreteMat);
      rightTop.position.set(r.w * 0.28, midH + topH * 0.39, 0);
      rightTop.castShadow = true;
      rightTop.receiveShadow = true;
      topSection.add(rightTop);

      const rubbleBase = new THREE.Group();
      rubbleBase.visible = false;
      const baseMound = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.95, 0.24, r.d * 1.25), concreteMat);
      baseMound.position.y = 0.12;
      baseMound.receiveShadow = true;
      rubbleBase.add(baseMound);
      for (let c = 0; c < 4; c++) {
        const chunk = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.22, 0.22, r.d * 0.8), concreteMat);
        chunk.position.set((-0.34 + c * 0.23) * r.w, 0.22, (c % 2 === 0 ? 1 : -1) * 0.12);
        chunk.rotation.set(0.2 * (c % 2 ? 1 : -1), c * 0.6, 0.25 * (c % 2 ? -1 : 1));
        chunk.castShadow = true;
        chunk.receiveShadow = true;
        rubbleBase.add(chunk);
      }

      group.add(midSection);
      group.add(topSection);
      group.add(rubbleBase);
      this.rootGroup.add(group);

      const ruinId = `ruin_${i}`;
      const spec: DestructibleSpec = {
        id: ruinId,
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
      this.cover.registerDestructible(spec, group, (stage: DestructionStage) => {
        if (stage === 1) {
          topSection.visible = false;
          midSection.rotation.z = 0.06;
        } else if (stage === 2) {
          topSection.visible = false;
          midSection.visible = false;
          rubbleBase.visible = true;
        }
      });

      const cosR = Math.cos(r.rotY);
      const sinR = Math.sin(r.rotY);
      const localOffZ = r.d * 0.5 + 0.95;
      for (const dirZ of [1, -1]) {
        const wx = r.x + localOffZ * dirZ * sinR;
        const wz = r.z + localOffZ * dirZ * cosR;
        const wy = this.terrain.getTerrainHeight(wx, wz);
        this.cover.registerTacticalNode({
          id: `${ruinId}_node_${dirZ > 0 ? 's' : 'n'}`,
          x: wx,
          y: wy,
          z: wz,
          radius: 1.2,
          insideBuilding: false,
          windowDirZ: -dirZ * cosR
        });
      }
    }
  }

  private registerCraterTacticalNodes(config: MissionConfig): void {
    for (let i = 0; i < config.initialCraters.length; i++) {
      const c = config.initialCraters[i];
      if (c.radius < 2.4) continue;
      const cy = this.terrain.getTerrainHeight(c.x, c.z);
      this.cover.registerTacticalNode({
        id: `crater_node_${i}`,
        x: c.x,
        y: cy,
        z: c.z,
        radius: Math.max(1.1, c.radius * 0.52),
        insideBuilding: false
      });
    }
  }

  private buildBuildings(
    config: MissionConfig,
    concreteMat: THREE.Material,
    timberMat: THREE.Material,
    sandbagMat: THREE.Material,
    steelMat: THREE.Material,
    darkWindowMat: THREE.Material
  ): void {
    const buildings = config.buildings ?? [];
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      const buildingId = `building_${i}`;
      const baseY = this.terrain.getTerrainHeight(b.x, b.z);
      const group = new THREE.Group();
      group.position.set(b.x, baseY, b.z);
      group.rotation.y = b.rotY;

      const wallT = 0.34;
      const isEnterable = b.enterable !== false;
      const kind = b.kind ?? 'house';
      const cosR = Math.cos(b.rotY);
      const sinR = Math.sin(b.rotY);
      const absCos = Math.abs(cosR);
      const absSin = Math.abs(sinR);

      if (!isEnterable) {
        const midH = b.h * 0.54;
        const topH = b.h - midH;

        const midSection = new THREE.Group();
        for (const zSide of [-1, 1]) {
          const wall = new THREE.Mesh(new THREE.BoxGeometry(b.w, midH, wallT), concreteMat);
          wall.position.set(0, midH * 0.5, zSide * (b.d * 0.5 - wallT * 0.5));
          wall.castShadow = true;
          wall.receiveShadow = true;
          midSection.add(wall);

          for (const wx of [-b.w * 0.28, b.w * 0.28]) {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.72, wallT + 0.05), darkWindowMat);
            win.position.set(wx, midH * 0.56, zSide * (b.d * 0.5 - wallT * 0.5));
            midSection.add(win);
          }
        }
        for (const xSide of [-1, 1]) {
          const sideWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, midH, b.d - wallT * 2), concreteMat);
          sideWall.position.set(xSide * (b.w * 0.5 - wallT * 0.5), midH * 0.5, 0);
          sideWall.castShadow = true;
          sideWall.receiveShadow = true;
          midSection.add(sideWall);

          const sideWin = new THREE.Mesh(new THREE.BoxGeometry(wallT + 0.05, 0.72, 0.85), darkWindowMat);
          sideWin.position.set(xSide * (b.w * 0.5 - wallT * 0.5), midH * 0.56, 0);
          midSection.add(sideWin);
        }

        const topSection = new THREE.Group();
        const upperFront = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.88, topH, wallT), concreteMat);
        upperFront.position.set(-b.w * 0.04, midH + topH * 0.5, -(b.d * 0.5 - wallT * 0.5));
        upperFront.castShadow = true;
        upperFront.receiveShadow = true;
        topSection.add(upperFront);

        const upperBack = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.72, topH * 0.85, wallT), concreteMat);
        upperBack.position.set(b.w * 0.1, midH + topH * 0.42, b.d * 0.5 - wallT * 0.5);
        upperBack.castShadow = true;
        upperBack.receiveShadow = true;
        topSection.add(upperBack);

        for (const xSide of [-1, 1]) {
          const uSide = new THREE.Mesh(
            new THREE.BoxGeometry(wallT, topH * 0.75, b.d * 0.65),
            concreteMat
          );
          uSide.position.set(xSide * (b.w * 0.5 - wallT * 0.5), midH + topH * 0.37, -b.d * 0.12);
          uSide.castShadow = true;
          topSection.add(uSide);
        }

        const rubbleBase = this.buildBuildingRubble(b.w, b.d, concreteMat, timberMat);
        group.add(midSection, topSection, rubbleBase);
        this.rootGroup.add(group);

        const spec: DestructibleSpec = {
          id: buildingId,
          kind: 'building',
          x: b.x,
          y: baseY,
          z: b.z,
          width: b.w,
          height: b.h,
          depth: b.d,
          hp: 380,
          maxHp: 380,
          blocksBullets: true,
          blocksMovement: true,
          blocksSight: true,
          rotationY: b.rotY
        };
        const applyStage = (stage: DestructionStage) => {
          if (stage === 1) {
            topSection.visible = false;
            midSection.rotation.z = 0.06;
          } else if (stage === 2) {
            topSection.visible = false;
            midSection.visible = false;
            rubbleBase.visible = true;
          }
        };
        this.destructibleStageHandlers.set(buildingId, applyStage);
        this.cover.registerDestructible(spec, group, applyStage);
        continue;
      }

      // Enterable hollow structure ('house' | 'shed' | 'outpost')
      const wallMat = kind === 'shed' ? timberMat : concreteMat;
      const roofMat = kind === 'shed' ? steelMat : timberMat;
      const sillMat = kind === 'outpost' ? sandbagMat : wallMat;

      const doorW = Math.max(1.65, Math.min(2.05, b.w * 0.34));
      const sillH = 1.04;
      const doorH = 2.05;
      const lintelH = Math.max(0.24, Math.min(0.32, b.h - doorH));
      const lintelTopY = doorH + lintelH;
      const upperH = Math.max(0.45, b.h - lintelTopY);

      const midSection = new THREE.Group();
      const topSection = new THREE.Group();
      let wallColIdx = 0;

      const addWallPart = (
        targetGroup: THREE.Group,
        lx: number,
        ly: number,
        lz: number,
        w: number,
        h: number,
        d: number,
        mat: THREE.Material,
        registerCollider = true,
        blocksMovement = true,
        blocksSight = true,
        groundAnchored = false
      ) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(lx, ly, lz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        targetGroup.add(mesh);

        if (!registerCollider) return;

        const wx = b.x + lx * cosR + lz * sinR;
        const wz = b.z - lx * sinR + lz * cosR;
        const effW = w * absCos + d * absSin;
        const effD = w * absSin + d * absCos;
        const minY = groundAnchored ? baseY - 0.35 : baseY + (ly - h * 0.5);
        const maxY = baseY + (ly + h * 0.5);

        this.cover.addStaticBox({
          id: `${buildingId}_wall_${wallColIdx++}`,
          minX: wx - effW * 0.5,
          maxX: wx + effW * 0.5,
          minY,
          maxY,
          minZ: wz - effD * 0.5,
          maxZ: wz + effD * 0.5,
          blocksBullets: true,
          blocksMovement,
          blocksSight,
          destructibleId: buildingId,
          rotY: Math.abs(b.rotY) > 1e-4 ? b.rotY : undefined,
          cx: wx,
          cz: wz,
          halfW: w * 0.5,
          halfD: d * 0.5
        });
      };

      // Interior floor slab (top at baseY + 0.04, extending downward so corners never float)
      const floorSlab = new THREE.Mesh(
        new THREE.BoxGeometry(b.w - 0.16, 0.34, b.d - 0.16),
        kind === 'outpost' ? concreteMat : timberMat
      );
      floorSlab.position.set(0, -0.13, 0);
      floorSlab.receiveShadow = true;
      midSection.add(floorSlab);

      // North (-Z) and South (+Z) walls with centered open doorway (>= 1.65m) and firing windows
      const wingW = (b.w - doorW) * 0.5;
      for (const zSide of [-1, 1]) {
        const wallZ = zSide * (b.d * 0.5 - wallT * 0.5);

        for (const xSide of [-1, 1]) {
          if (wingW >= 1.35) {
            const pierW = Math.max(0.32, Math.min(0.46, wingW * 0.24));
            const winW = wingW - pierW * 2;
            const outerPierX = xSide * (b.w * 0.5 - pierW * 0.5);
            const jambPierX = xSide * (doorW * 0.5 + pierW * 0.5);
            const winCenterX = xSide * (doorW * 0.5 + wingW * 0.5);

            addWallPart(midSection, outerPierX, doorH * 0.5, wallZ, pierW, doorH, wallT, wallMat, true, true, true, true);
            addWallPart(midSection, jambPierX, doorH * 0.5, wallZ, pierW, doorH, wallT, wallMat, true, true, true, true);
            addWallPart(midSection, winCenterX, sillH * 0.5, wallZ, winW, sillH, wallT, sillMat, true, true, true, true);

            // Visual timber window sill trim
            addWallPart(midSection, winCenterX, sillH + 0.025, wallZ, winW + 0.04, 0.05, wallT + 0.04, timberMat, false);
          } else {
            const wingCenterX = xSide * (doorW * 0.5 + wingW * 0.5);
            addWallPart(midSection, wingCenterX, doorH * 0.5, wallZ, wingW, doorH, wallT, wallMat, true, true, true, true);
          }
        }

        // Door/window header lintel beam above y = 2.05m
        addWallPart(
          midSection,
          0,
          doorH + lintelH * 0.5,
          wallZ,
          b.w,
          lintelH,
          wallT,
          kind === 'shed' ? timberMat : wallMat,
          true,
          true,
          true,
          false
        );

        // Upper wall section (breaks off in Stage 1)
        addWallPart(
          topSection,
          0,
          lintelTopY + upperH * 0.5,
          wallZ,
          b.w * 0.94,
          upperH,
          wallT,
          wallMat,
          true,
          true,
          true,
          false
        );
      }

      // West (-X) and East (+X) walls with real center firing windows (1.04m sill)
      const sideLen = Math.max(1.8, b.d - wallT * 2);
      const sideWinW = Math.max(0.95, Math.min(1.65, sideLen * 0.42));
      const sidePierD = Math.max(0.35, (sideLen - sideWinW) * 0.5);
      for (const xSide of [-1, 1]) {
        const wallX = xSide * (b.w * 0.5 - wallT * 0.5);

        for (const zPierSide of [-1, 1]) {
          const pierZ = zPierSide * (sideWinW * 0.5 + sidePierD * 0.5);
          addWallPart(midSection, wallX, doorH * 0.5, pierZ, wallT, doorH, sidePierD, wallMat, true, true, true, true);
        }
        addWallPart(midSection, wallX, sillH * 0.5, 0, wallT, sillH, sideWinW, sillMat, true, true, true, true);
        addWallPart(midSection, wallX, sillH + 0.025, 0, wallT + 0.04, 0.05, sideWinW + 0.04, timberMat, false);

        // Side header lintel above y = 2.05m
        addWallPart(midSection, wallX, doorH + lintelH * 0.5, 0, wallT, lintelH, sideLen, wallMat, true, true, true, false);

        // Upper side wall (breaks off in Stage 1)
        addWallPart(
          topSection,
          wallX,
          lintelTopY + upperH * 0.5,
          0,
          wallT,
          upperH,
          sideLen * 0.85,
          wallMat,
          true,
          true,
          true,
          false
        );
      }

      // Roof beams & overhead shelter deck (falls in Stage 1)
      for (let r = -1; r <= 1; r++) {
        addWallPart(topSection, r * (b.w * 0.3), b.h - 0.06, 0, 0.16, 0.16, b.d + 0.24, timberMat, false);
      }
      addWallPart(topSection, -b.w * 0.24, b.h + 0.06, 0, b.w * 0.48, 0.12, b.d + 0.18, roofMat, false);
      addWallPart(topSection, b.w * 0.24, b.h + 0.06, -b.d * 0.06, b.w * 0.46, 0.12, b.d * 0.88, roofMat, false);

      // Roof collider (protects against overhead hits until Stage 1)
      this.cover.addStaticBox({
        id: `${buildingId}_wall_roof`,
        minX: b.x - (b.w * absCos + b.d * absSin) * 0.5,
        maxX: b.x + (b.w * absCos + b.d * absSin) * 0.5,
        minY: baseY + b.h - 0.12,
        maxY: baseY + b.h + 0.28,
        minZ: b.z - (b.w * absSin + b.d * absCos) * 0.5,
        maxZ: b.z + (b.w * absSin + b.d * absCos) * 0.5,
        blocksBullets: true,
        blocksMovement: false,
        blocksSight: true,
        destructibleId: buildingId,
        rotY: Math.abs(b.rotY) > 1e-4 ? b.rotY : undefined,
        cx: b.x,
        cz: b.z,
        halfW: b.w * 0.5,
        halfD: b.d * 0.5
      });

      const rubbleBase = this.buildBuildingRubble(b.w, b.d, concreteMat, timberMat);
      group.add(midSection, topSection, rubbleBase);
      this.rootGroup.add(group);

      // Register enterable bounds (interior floor area inside walls)
      const innerHalfW = Math.max(0.8, b.w * 0.5 - wallT * 0.8);
      const innerHalfD = Math.max(0.8, b.d * 0.5 - wallT * 0.8);
      this.cover.registerEnterableBuildingBounds(
        buildingId,
        b.x - innerHalfW,
        b.x + innerHalfW,
        b.z - innerHalfD,
        b.z + innerHalfD,
        baseY + b.h,
        b.rotY
      );

      // Register 3-4 TacticalCoverNodes inside at the firing windows
      const nodeOffX = Math.max(1.15, doorW * 0.5 + wingW * 0.5);
      const nodeOffZ = Math.max(0.85, b.d * 0.5 - wallT - 0.72);
      const localNodes: Array<{ id: string; lx: number; lz: number; dirZ: number }> = [
        { id: `${buildingId}_node_nw`, lx: -nodeOffX, lz: -nodeOffZ, dirZ: -1 },
        { id: `${buildingId}_node_ne`, lx: nodeOffX, lz: -nodeOffZ, dirZ: -1 },
        { id: `${buildingId}_node_sw`, lx: -nodeOffX, lz: nodeOffZ, dirZ: 1 }
      ];
      if (b.w >= 5.0) {
        localNodes.push({ id: `${buildingId}_node_se`, lx: nodeOffX, lz: nodeOffZ, dirZ: 1 });
      }
      for (const ln of localNodes) {
        const wx = b.x + ln.lx * cosR + ln.lz * sinR;
        const wz = b.z - ln.lx * sinR + ln.lz * cosR;
        const wy = this.terrain.getTerrainHeight(wx, wz);
        this.cover.registerTacticalNode({
          id: ln.id,
          x: wx,
          y: wy,
          z: wz,
          radius: 1.1,
          insideBuilding: true,
          buildingId,
          windowDirZ: ln.dirZ * cosR
        });
      }

      const spec: DestructibleSpec = {
        id: buildingId,
        kind: 'building',
        x: b.x,
        y: baseY,
        z: b.z,
        width: b.w,
        height: b.h,
        depth: b.d,
        hp: 420,
        maxHp: 420,
        blocksBullets: false,
        blocksMovement: false,
        blocksSight: false,
        rotationY: b.rotY
      };
      const applyStage = (stage: DestructionStage) => {
        if (stage === 1) {
          topSection.visible = false;
          midSection.rotation.z = 0.04;
        } else if (stage === 2) {
          topSection.visible = false;
          midSection.visible = false;
          rubbleBase.visible = true;
          this.cover.removeStaticCollidersByPrefix(buildingId);
          this.cover.removeEnterableBuildingBounds(buildingId);
          this.cover.removeNodesForBuilding(buildingId);
        }
      };
      this.destructibleStageHandlers.set(buildingId, applyStage);
      this.cover.registerDestructible(spec, group, applyStage);
    }
  }

  private buildBuildingRubble(
    w: number,
    d: number,
    concreteMat: THREE.Material,
    timberMat: THREE.Material
  ): THREE.Group {
    const rubbleBase = new THREE.Group();
    rubbleBase.visible = false;
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.34, d * 0.96), concreteMat);
    foundation.position.y = 0.17;
    foundation.receiveShadow = true;
    rubbleBase.add(foundation);

    for (let c = 0; c < 6; c++) {
      const masonry = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.72), concreteMat);
      masonry.position.set(
        ((c % 3) - 1) * (w * 0.28),
        0.34 + (c % 2) * 0.12,
        (c < 3 ? -1 : 1) * (d * 0.22)
      );
      masonry.rotation.set(0.2 * (c % 2 ? 1 : -1), c * 0.55, 0.18);
      masonry.castShadow = true;
      rubbleBase.add(masonry);
    }
    for (let t = 0; t < 2; t++) {
      const fallenBeam = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 0.14, 0.16), timberMat);
      fallenBeam.position.set(t === 0 ? -0.4 : 0.4, 0.44, t === 0 ? -0.35 : 0.45);
      fallenBeam.rotation.set(0.12, 0.4 + t * 0.9, 0.22);
      fallenBeam.castShadow = true;
      rubbleBase.add(fallenBeam);
    }
    return rubbleBase;
  }

  public setDestructibleStage(id: string, stage: DestructionStage): void {
    const handler = this.destructibleStageHandlers.get(id);
    if (handler) {
      handler(stage);
    } else if (stage === 2 && id.startsWith('building_')) {
      this.cover.removeStaticCollidersByPrefix(id);
      this.cover.removeEnterableBuildingBounds(id);
      this.cover.removeNodesForBuilding(id);
    }
  }

  private buildTrees(config: MissionConfig, timberMat: THREE.Material): void {
    const trees = config.trees ?? [];
    for (let i = 0; i < trees.length; i++) {
      const t = trees[i];
      const baseY = this.terrain.getTerrainHeight(t.x, t.z);
      const treeHeight = t.height ?? 4.4;

      const treeGroup = new THREE.Group();
      treeGroup.position.set(t.x, baseY, t.z);

      // Trunk pivoted at base (y = 0)
      const trunkPivot = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.32, treeHeight, 7),
        timberMat
      );
      trunk.position.y = treeHeight * 0.5;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      trunkPivot.add(trunk);

      const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.13, 1.65, 5), timberMat);
      branch1.position.set(0.48, treeHeight * 0.65, 0.08);
      branch1.rotation.z = -0.78;
      branch1.castShadow = true;
      trunkPivot.add(branch1);

      const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 1.25, 5), timberMat);
      branch2.position.set(-0.36, treeHeight * 0.78, -0.14);
      branch2.rotation.z = 0.85;
      branch2.rotation.y = 0.4;
      branch2.castShadow = true;
      trunkPivot.add(branch2);

      treeGroup.add(trunkPivot);
      this.rootGroup.add(treeGroup);

      let fallen = false;
      let fallProgress = 0;
      const fallDir = i % 2 === 0 ? 1 : -1;

      this.animatedProps.push({
        update: (dt) => {
          if (fallen && fallProgress < 1) {
            fallProgress = Math.min(1, fallProgress + dt * 2.1);
            const eased = fallProgress * fallProgress;
            trunkPivot.rotation.z = fallDir * (0.12 + (1.48 - 0.12) * eased);
          }
        }
      });

      this.cover.registerDestructible(
        {
          id: `tree_${i}`,
          kind: 'tree',
          x: t.x,
          y: baseY,
          z: t.z,
          width: 0.72,
          height: treeHeight,
          depth: 0.72,
          hp: 65,
          maxHp: 65,
          blocksBullets: true,
          blocksMovement: true,
          blocksSight: false
        },
        treeGroup,
        (stage: DestructionStage) => {
          if (stage === 1) {
            trunkPivot.rotation.z = fallDir * 0.12;
          } else if (stage === 2) {
            fallen = true;
          }
        }
      );
    }
  }

  private buildFences(config: MissionConfig, timberMat: THREE.Material): void {
    const fences = config.fences ?? [];
    for (let i = 0; i < fences.length; i++) {
      const f = fences[i];
      const baseY = this.terrain.getTerrainHeight(f.x, f.z);

      const fenceGroup = new THREE.Group();
      fenceGroup.position.set(f.x, baseY, f.z);
      fenceGroup.rotation.y = f.rotY;

      // Posts + horizontal boards pivoted at base (y = 0)
      const pivotGroup = new THREE.Group();
      const postCount = Math.max(2, Math.round(f.len / 1.8) + 1);
      for (let p = 0; p < postCount; p++) {
        const px = -f.len * 0.46 + (p / (postCount - 1)) * (f.len * 0.92);
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.12), timberMat);
        post.position.set(px, 0.525, 0);
        post.castShadow = true;
        post.receiveShadow = true;
        pivotGroup.add(post);
      }

      for (const railY of [0.36, 0.78]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(f.len, 0.12, 0.05), timberMat);
        rail.position.set(0, railY, 0.05);
        rail.castShadow = true;
        rail.receiveShadow = true;
        pivotGroup.add(rail);
      }

      fenceGroup.add(pivotGroup);
      this.rootGroup.add(fenceGroup);

      let fallen = false;
      let fallProgress = 0;
      const fallDir = i % 2 === 0 ? 1 : -1;

      this.animatedProps.push({
        update: (dt) => {
          if (fallen && fallProgress < 1) {
            fallProgress = Math.min(1, fallProgress + dt * 2.8);
            const eased = fallProgress * fallProgress;
            pivotGroup.rotation.x = fallDir * (0.14 + (1.46 - 0.14) * eased);
          }
        }
      });

      this.cover.registerDestructible(
        {
          id: `fence_${i}`,
          kind: 'fence',
          x: f.x,
          y: baseY,
          z: f.z,
          width: f.len,
          height: 1.05,
          depth: 0.25,
          hp: 45,
          maxHp: 45,
          blocksBullets: false,
          blocksMovement: true,
          blocksSight: false,
          rotationY: f.rotY
        },
        fenceGroup,
        (stage: DestructionStage) => {
          if (stage === 1) {
            pivotGroup.rotation.x = fallDir * 0.14;
          } else if (stage === 2) {
            fallen = true;
          }
        }
      );
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
    config: MissionConfig,
    timberMat: THREE.Material,
    steelMat: THREE.Material
  ): void {
    if (!config.trees || config.trees.length === 0) {
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

  private isPropSpotClear(x: number, z: number, config: MissionConfig, minTrenchMargin = 0.4): boolean {
    for (const inter of config.interactables) {
      if (Math.hypot(x - inter.x, z - inter.z) < 2.6) return false;
    }
    for (const r of config.ramps) {
      if (this.pointToSegmentDist(x, z, r.x1, r.z1, r.x2, r.z2) < r.width * 0.8) return false;
    }
    for (const d of config.dugouts) {
      if (Math.abs(x - d.x) < d.width * 0.7 && Math.abs(z - d.z) < d.depth * 0.8) return false;
    }
    for (const tr of config.trenches) {
      if (this.pointToSegmentDist(x, z, tr.x1, tr.z1, tr.x2, tr.z2) < tr.width * minTrenchMargin) {
        return false;
      }
    }
    return true;
  }

  private buildBattlefieldDetails(
    config: MissionConfig,
    timberMat: THREE.Material,
    steelMat: THREE.Material
  ): void {
    // Generic weathered war materials — zero extremist/political insignias
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0x3b4238,
      roughness: 0.72,
      metalness: 0.35
    });
    const rustMat = new THREE.MeshStandardMaterial({
      color: 0x4f3023,
      roughness: 0.88,
      metalness: 0.42
    });
    const uniformMudMat = new THREE.MeshStandardMaterial({
      color: 0x3b382e,
      roughness: 0.94,
      metalness: 0.04
    });

    const addFallenHelmet = (hx: number, hz: number, rotY: number) => {
      const hy = this.terrain.getTerrainHeight(hx, hz);
      const hg = new THREE.Group();
      hg.position.set(hx, hy + 0.02, hz);
      hg.rotation.set(0.28, rotY, -0.22);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.54),
        helmetMat
      );
      dome.castShadow = true;
      hg.add(dome);
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.185, 0.21, 0.03, 10, 1, true),
        helmetMat
      );
      brim.position.y = 0.01;
      hg.add(brim);
      this.rootGroup.add(hg);
    };

    const addBrokenCrate = (cx: number, cz: number, rotY: number) => {
      const cy = this.terrain.getTerrainHeight(cx, cz);
      const cg = new THREE.Group();
      cg.position.set(cx, cy + 0.16, cz);
      cg.rotation.set(0.08, rotY, -0.14);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.46), timberMat);
      body.castShadow = true;
      body.receiveShadow = true;
      cg.add(body);
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 0.12), timberMat);
      slat.position.set(0.1, 0.22, 0.15);
      slat.rotation.set(0.2, 0.45, -0.24);
      cg.add(slat);
      this.rootGroup.add(cg);
    };

    const addWheelbarrow = (wx: number, wz: number, rotY: number) => {
      const wy = this.terrain.getTerrainHeight(wx, wz);
      const wg = new THREE.Group();
      wg.position.set(wx, wy + 0.22, wz);
      wg.rotation.set(0.05, rotY, 0.32);
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.24, 0.74), timberMat);
      tray.castShadow = true;
      tray.receiveShadow = true;
      wg.add(tray);
      for (const side of [-0.22, 0.22]) {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.28), timberMat);
        handle.position.set(side, -0.06, 0.14);
        wg.add(handle);
      }
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 10), steelMat);
      wheel.rotation.z = Math.PI * 0.5;
      wheel.position.set(0, -0.12, -0.48);
      wheel.castShadow = true;
      wg.add(wheel);
      this.rootGroup.add(wg);
    };

    const addRustedDrum = (dx: number, dz: number, tipped: boolean, rotY: number) => {
      const dy = this.terrain.getTerrainHeight(dx, dz);
      const dg = new THREE.Group();
      dg.position.set(dx, dy + (tipped ? 0.28 : 0.43), dz);
      dg.rotation.set(tipped ? Math.PI * 0.46 : 0.04, rotY, tipped ? 0.18 : -0.05);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.86, 12), rustMat);
      drum.castShadow = true;
      drum.receiveShadow = true;
      dg.add(drum);
      for (const ribY of [-0.18, 0.18]) {
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.305, 0.04, 12), rustMat);
        rib.position.y = ribY;
        dg.add(rib);
      }
      this.rootGroup.add(dg);
    };

    const addFallenSilhouette = (sx: number, sz: number, rotY: number) => {
      const sy = this.terrain.getTerrainHeight(sx, sz);
      const sg = new THREE.Group();
      sg.position.set(sx, sy + 0.04, sz);
      sg.rotation.y = rotY;
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.58), uniformMudMat);
      torso.position.y = 0.05;
      torso.receiveShadow = true;
      sg.add(torso);
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.56), uniformMudMat);
      legs.position.set(0.03, 0.03, 0.5);
      legs.rotation.y = 0.14;
      sg.add(legs);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.42), uniformMudMat);
      arm.position.set(-0.26, 0.03, -0.06);
      arm.rotation.y = -0.45;
      sg.add(arm);
      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
        helmetMat
      );
      helmet.position.set(0.05, 0.07, -0.35);
      helmet.rotation.x = -0.25;
      sg.add(helmet);
      this.rootGroup.add(sg);
    };

    // Scatter helmets & silhouettes along crater rims in No Man's Land
    for (let i = 0; i < config.initialCraters.length; i++) {
      const c = config.initialCraters[i];
      const ang = i * 1.7 + 0.4;
      const hx = c.x + Math.cos(ang) * (c.radius * 0.72);
      const hz = c.z + Math.sin(ang) * (c.radius * 0.72);
      if (this.isPropSpotClear(hx, hz, config, 0.55)) {
        addFallenHelmet(hx, hz, ang);
      }

      if (i % 3 === 1) {
        const sx = c.x - Math.cos(ang) * (c.radius * 0.85);
        const sz = c.z - Math.sin(ang) * (c.radius * 0.85);
        if (this.isPropSpotClear(sx, sz, config, 0.65)) {
          addFallenSilhouette(sx, sz, ang + 0.8);
        }
      }
    }

    // Trench flank crates, wheelbarrows & rusted drums (always outside walkable centerline)
    const crateSpots: Array<[number, number, number]> = [
      [-10.5, 32.1, 0.4],
      [11.2, 32.1, -0.6],
      [-21.5, 33.4, 0.9],
      [20.8, 33.4, -0.3],
      [-7.2, 27.6, 0.25]
    ];
    for (const [cx, cz, rot] of crateSpots) {
      if (this.isPropSpotClear(cx, cz, config, 0.58)) {
        addBrokenCrate(cx, cz, rot);
      }
    }

    const cartSpots: Array<[number, number, number]> = [
      [-13.5, 34.4, 0.75],
      [13.8, 34.2, -0.95]
    ];
    for (const [wx, wz, rot] of cartSpots) {
      if (this.isPropSpotClear(wx, wz, config, 0.62)) {
        addWheelbarrow(wx, wz, rot);
      }
    }

    const drumSpots: Array<[number, number, boolean, number]> = [
      [-24.5, 35.8, false, 0.2],
      [-25.3, 35.5, true, 1.1],
      [24.2, 35.6, false, 0.6],
      [-19.5, 12.0, true, 0.8],
      [20.5, 10.5, false, 0.3],
      [21.2, 11.1, true, 2.0]
    ];
    for (const [dx, dz, tipped, rot] of drumSpots) {
      if (this.isPropSpotClear(dx, dz, config, 0.62)) {
        addRustedDrum(dx, dz, tipped, rot);
      }
    }

    // Extra tucked helmets right inside trench corners (against wall edge, non-blocking)
    for (let i = 0; i < config.trenches.length; i++) {
      const tr = config.trenches[i];
      const dx = tr.x2 - tr.x1;
      const dz = tr.z2 - tr.z1;
      const angle = Math.atan2(dx, dz);
      const perpX = Math.cos(angle);
      const perpZ = -Math.sin(angle);
      const t = 0.22 + (i % 3) * 0.24;
      const side = i % 2 === 0 ? 1 : -1;
      const hx = tr.x1 + dx * t + perpX * (tr.width * 0.39) * side;
      const hz = tr.z1 + dz * t + perpZ * (tr.width * 0.39) * side;
      if (this.isPropSpotClear(hx, hz, config, 0.28)) {
        addFallenHelmet(hx, hz, angle + side);
      }
    }
  }

  private buildWeatherParticles(env: MissionEnvironment, quality: QualityLevel): void {
    const isRain = env.hasRain;
    const baseCount = isRain ? 980 : 380;
    const count = quality === 'low' ? Math.floor(baseCount * 0.5) : baseCount;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 136;
      positions[i * 3 + 1] = Math.random() * 27;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 136;
      velocities[i] = 0.78 + Math.random() * 0.44;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.weatherVelocities = velocities;

    const colorHex = isRain ? 0xaab6bf : env.isNight ? 0xb59c84 : 0x998e82;
    this.weatherBaseOpacity = isRain ? 0.44 : 0.34;

    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: isRain ? 0.16 : 0.13,
      transparent: true,
      opacity: this.weatherBaseOpacity,
      depthWrite: false
    });
    this.weatherPoints = new THREE.Points(geo, mat);
    this.rootGroup.add(this.weatherPoints);
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

  private buildSearchlights(config: MissionConfig): void {
    const baseZ = config.bunkers.length > 0 ? config.bunkers[0].z - 4 : -48;
    for (const [sx, sz, phase] of [
      [-24, baseZ, 0],
      [24, baseZ, 2.1]
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

  public setTrenchWallCollapsedAt(x: number, z: number, radius: number): void {
    const limit = radius + 1.2;
    const limitSq = limit * limit;
    let idx = 0;

    for (const stake of this.trenchStakes) {
      idx++;
      if (stake.collapsed) continue;
      const dx = stake.x - x;
      const dz = stake.z - z;
      if (dx * dx + dz * dz > limitSq) continue;

      stake.collapsed = true;
      const dir = idx % 2 === 0 ? 1 : -1;
      stake.mesh.rotation.z = dir * 0.65;
      stake.mesh.rotation.x = 0.35;
      stake.mesh.position.y -= 0.28;

      const baseY = this.terrain.getTerrainHeight(stake.x, stake.z);
      const dirtMound = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.28, 0.64),
        this.mudCollapseMat ?? new THREE.MeshStandardMaterial({ color: 0x3b2f24, roughness: 0.96 })
      );
      dirtMound.position.set(stake.x, baseY + 0.12, stake.z);
      dirtMound.rotation.y = (idx * 0.7) % Math.PI;
      dirtMound.castShadow = true;
      dirtMound.receiveShadow = true;
      this.rootGroup.add(dirtMound);

      const brokenPlank = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.08, 0.2),
        this.timberMat ?? new THREE.MeshStandardMaterial({ color: 0x4b3828, roughness: 0.9 })
      );
      brokenPlank.position.set(stake.x + dir * 0.14, baseY + 0.25, stake.z);
      brokenPlank.rotation.set(0.22, dir * 0.5, dir * 0.28);
      brokenPlank.castShadow = true;
      brokenPlank.receiveShadow = true;
      this.rootGroup.add(brokenPlank);
    }
  }

  public setDugoutStage(dugoutId: string, stage: DestructionStage): void {
    const v = this.dugoutVisuals.get(dugoutId);
    if (!v || v.stage >= stage) return;
    v.stage = stage;

    if (stage === 1) {
      v.roof.rotation.z = 0.11;
      v.roofBags.rotation.z = 0.11;
      v.sign.rotation.z = -0.18;
      v.lantern.color.setHex(0xff5533);
    } else if (stage === 2) {
      v.roof.position.y -= 0.72;
      v.roof.rotation.x = 0.26;
      v.roofBags.position.y -= 0.78;
      v.lantern.intensity = 0;
      v.bulb.visible = false;
      v.sign.visible = false;
      v.rubble.visible = true;
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

  public update(dt: number, elapsed?: number): void {
    this.weatherElapsed += dt;
    const t = elapsed ?? this.weatherElapsed;

    for (const prop of this.animatedProps) {
      prop.update(dt, t);
    }

    // 1. Breathing war fog density modulation
    if (this.scene.fog && this.scene.fog instanceof THREE.FogExp2) {
      const wave = Math.sin(this.weatherElapsed * 0.14) * 0.12 + Math.sin(this.weatherElapsed * 0.053 + 1.3) * 0.08;
      const buildup = Math.min(0.2, this.weatherElapsed * 0.0008);
      this.scene.fog.density = this.baseFogDensity * (1 + wave + buildup);
    }

    // 2. Wind-tilted rain / battle ash particles with gusts and intensity ramp
    if (this.weatherPoints && this.weatherVelocities) {
      const pos = this.weatherPoints.geometry.attributes.position as THREE.BufferAttribute;
      const intensityRamp = Math.min(1.45, 0.85 + this.weatherElapsed * 0.004);
      const gustX =
        (Math.sin(this.weatherElapsed * 0.24) * 3.6 + Math.sin(this.weatherElapsed * 0.71) * 1.9 + 1.5) *
        intensityRamp;
      const gustZ =
        (Math.cos(this.weatherElapsed * 0.19) * 2.2 + Math.sin(this.weatherElapsed * 0.53) * 1.1) *
        intensityRamp;
      const fallSpeed = this.isRainWeather ? 25.0 * intensityRamp : 1.75 * intensityRamp;
      const windDriftScale = this.isRainWeather ? 0.9 : 0.65;

      for (let i = 0; i < pos.count; i++) {
        const vScale = this.weatherVelocities[i];
        let x = pos.getX(i) + gustX * windDriftScale * vScale * dt;
        let y = pos.getY(i) - fallSpeed * vScale * dt;
        let z = pos.getZ(i) + gustZ * windDriftScale * vScale * dt;

        if (!this.isRainWeather) {
          x += Math.sin(this.weatherElapsed * 1.3 + i * 0.7) * 0.45 * dt;
        }
        if (y < -1) y = 26;
        if (x > 68) x -= 136;
        else if (x < -68) x += 136;
        if (z > 68) z -= 136;
        else if (z < -68) z += 136;

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;

      const pMat = this.weatherPoints.material as THREE.PointsMaterial;
      pMat.opacity = Math.min(0.75, this.weatherBaseOpacity * intensityRamp);
    }

    // 3. Distant horizon artillery flashes (no extra PointLights)
    this.artilleryFlashTimer -= dt;
    if (this.artilleryFlashTimer <= 0) {
      this.artilleryFlashPulse = 0.85 + Math.random() * 0.35;
      const flashX = (Math.random() - 0.5) * 180;
      const flashZ = -140 - Math.random() * 25;
      const flashY = 7 + Math.random() * 8;
      if (this.skyUniforms) {
        this.skyUniforms.uFlashDir.value.set(flashX, flashY, flashZ).normalize();
      }
      if (this.horizonFlashMesh) {
        this.horizonFlashMesh.position.set(flashX, flashY, flashZ);
        this.horizonFlashMesh.lookAt(0, 2, 20);
        const scale = 0.85 + Math.random() * 0.55;
        this.horizonFlashMesh.scale.set(scale, scale, 1);
      }
      if (!this.artilleryDoublePending && Math.random() < 0.35) {
        this.artilleryDoublePending = true;
        this.artilleryFlashTimer = 0.14 + Math.random() * 0.12;
      } else {
        this.artilleryDoublePending = false;
        this.artilleryFlashTimer = 4.2 + Math.random() * 7.8;
      }
    }

    if (this.artilleryFlashPulse > 0) {
      this.artilleryFlashPulse = Math.max(0, this.artilleryFlashPulse - dt * 4.2);
    }
    if (this.skyUniforms) {
      this.skyUniforms.uFlash.value = this.artilleryFlashPulse;
    }
    if (this.horizonFlashMesh) {
      this.horizonFlashMesh.visible = this.artilleryFlashPulse > 0.01;
      (this.horizonFlashMesh.material as THREE.MeshBasicMaterial).opacity =
        Math.min(1, this.artilleryFlashPulse * 0.9);
    }
    if (this.hemiLight) {
      this.hemiLight.intensity = this.baseHemiIntensity + this.artilleryFlashPulse * 0.55;
    }
    if (this.sunLight) {
      this.sunLight.intensity = this.baseSunIntensity + this.artilleryFlashPulse * 0.42;
    }
  }
}
