import * as THREE from 'three';

export interface ProceduralTextures {
  mud: THREE.CanvasTexture;
  timber: THREE.CanvasTexture;
  sandbag: THREE.CanvasTexture;
  concrete: THREE.CanvasTexture;
  armorSteel: THREE.CanvasTexture;
  crateAmmo: THREE.CanvasTexture;
  crateMedic: THREE.CanvasTexture;
  radialGlow: THREE.CanvasTexture;
}

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context unavailable');
  }
  return [canvas, ctx];
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function createTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
  srgb = true
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  if (srgb) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function buildMudTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512);
  const rand = seededRand(1917);
  ctx.fillStyle = '#4e4132';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4200; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 1 + rand() * 9;
    const shade = rand();
    if (shade < 0.35) {
      ctx.fillStyle = `rgba(38, 30, 22, ${0.18 + rand() * 0.25})`;
    } else if (shade < 0.75) {
      ctx.fillStyle = `rgba(88, 72, 54, ${0.14 + rand() * 0.22})`;
    } else {
      ctx.fillStyle = `rgba(62, 54, 42, ${0.2 + rand() * 0.25})`;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wet puddle streaks & pebbles
  for (let i = 0; i < 420; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(28, 24, 19, 0.42)' : 'rgba(116, 102, 82, 0.24)';
    ctx.fillRect(x, y, 2 + rand() * 4, 2 + rand() * 3);
  }
  return createTexture(c, 20, 20, true);
}

function buildTimberTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256);
  const rand = seededRand(1918);
  ctx.fillStyle = '#4f3b28';
  ctx.fillRect(0, 0, 256, 256);

  const planks = 6;
  const plankH = 256 / planks;
  for (let p = 0; p < planks; p++) {
    const y0 = p * plankH;
    const tone = Math.floor((rand() - 0.5) * 18);
    ctx.fillStyle = `rgb(${82 + tone}, ${60 + tone}, ${40 + tone})`;
    ctx.fillRect(0, y0 + 1, 256, plankH - 2);

    ctx.fillStyle = 'rgba(20, 14, 9, 0.72)';
    ctx.fillRect(0, y0, 256, 2);

    for (let g = 0; g < 36; g++) {
      const gy = y0 + 3 + rand() * (plankH - 6);
      ctx.fillStyle = `rgba(34, 22, 13, ${0.15 + rand() * 0.22})`;
      ctx.fillRect(0, gy, 256, 1 + rand() * 1.4);
    }
  }
  return createTexture(c, 2, 1, true);
}

function buildSandbagTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256);
  const rand = seededRand(1942);
  ctx.fillStyle = '#8b7b5d';
  ctx.fillRect(0, 0, 256, 256);

  // Burlap weave
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? 'rgba(54, 45, 31, 0.2)' : 'rgba(176, 160, 126, 0.14)';
    ctx.fillRect(0, y, 256, 2);
  }
  for (let x = 0; x < 256; x += 4) {
    ctx.fillStyle = x % 8 === 0 ? 'rgba(54, 45, 31, 0.18)' : 'rgba(176, 160, 126, 0.12)';
    ctx.fillRect(x, 0, 2, 256);
  }
  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = `rgba(42, 34, 23, ${0.08 + rand() * 0.16})`;
    ctx.beginPath();
    ctx.arc(rand() * 256, rand() * 256, 2 + rand() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  return createTexture(c, 2, 1, true);
}

function buildConcreteTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256);
  const rand = seededRand(1944);
  ctx.fillStyle = '#5e5f5a';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1800; i++) {
    const shade = 70 + Math.floor(rand() * 44);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade - 4}, 0.22)`;
    ctx.fillRect(rand() * 256, rand() * 256, 2 + rand() * 6, 2 + rand() * 6);
  }
  // Scorch marks & cracks
  ctx.strokeStyle = 'rgba(26, 26, 24, 0.55)';
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 14; k++) {
    let cx = rand() * 256;
    let cy = rand() * 256;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 5; s++) {
      cx += (rand() - 0.5) * 44;
      cy += (rand() - 0.5) * 44;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }
  return createTexture(c, 2, 2, true);
}

function buildArmorSteelTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256);
  const rand = seededRand(1943);
  ctx.fillStyle = '#3f453d';
  ctx.fillRect(0, 0, 256, 256);

  // Grime & scratches
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = rand() > 0.45 ? 'rgba(24, 28, 24, 0.24)' : 'rgba(92, 98, 88, 0.16)';
    ctx.fillRect(rand() * 256, rand() * 256, 2 + rand() * 14, 1 + rand() * 4);
  }
  // Rivets along plate edge
  ctx.fillStyle = 'rgba(22, 24, 21, 0.7)';
  for (let x = 12; x < 256; x += 24) {
    ctx.beginPath();
    ctx.arc(x, 12, 3, 0, Math.PI * 2);
    ctx.arc(x, 244, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return createTexture(c, 1, 1, true);
}

function buildCrateTexture(kind: 'ammo' | 'medic'): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256);
  ctx.fillStyle = kind === 'ammo' ? '#495038' : '#7b786c';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(24, 25, 20, 0.65)';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, 240, 240);

  if (kind === 'ammo') {
    ctx.fillStyle = '#d49b38';
    ctx.fillRect(36, 108, 184, 40);
    ctx.fillStyle = '#22241b';
    ctx.fillRect(58, 122, 140, 12);
  } else {
    ctx.fillStyle = '#ece8df';
    ctx.fillRect(56, 56, 144, 144);
    ctx.fillStyle = '#b93127';
    ctx.fillRect(110, 74, 36, 108);
    ctx.fillRect(74, 110, 108, 36);
  }
  return createTexture(c, 1, 1, true);
}

function buildRadialGlow(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(128);
  const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.28, 'rgba(255, 232, 178, 0.78)');
  grad.addColorStop(0.65, 'rgba(180, 120, 70, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

let cachedTextures: ProceduralTextures | null = null;

export function getProceduralTextures(): ProceduralTextures {
  if (!cachedTextures) {
    cachedTextures = {
      mud: buildMudTexture(),
      timber: buildTimberTexture(),
      sandbag: buildSandbagTexture(),
      concrete: buildConcreteTexture(),
      armorSteel: buildArmorSteelTexture(),
      crateAmmo: buildCrateTexture('ammo'),
      crateMedic: buildCrateTexture('medic'),
      radialGlow: buildRadialGlow()
    };
  }
  return cachedTextures;
}
