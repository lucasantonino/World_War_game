import {
  BuildingSpec,
  Crater,
  DugoutSpec,
  MissionConfig,
  MissionId,
  TrenchSegment
} from '../types';

function makeMainAllyTrench(): TrenchSegment[] {
  return [
    {
      id: 'ally_west',
      x1: -34,
      z1: 33,
      x2: -12,
      z2: 30,
      width: 2.5,
      depth: 1.05,
      parapetSide: 'north',
      hasSandbags: true,
      duckboards: true,
      faction: 'ally'
    },
    {
      id: 'ally_center',
      x1: -12,
      z1: 30,
      x2: 12,
      z2: 30,
      width: 2.6,
      depth: 1.05,
      parapetSide: 'north',
      hasSandbags: true,
      duckboards: true,
      faction: 'ally'
    },
    {
      id: 'ally_east',
      x1: 12,
      z1: 30,
      x2: 34,
      z2: 33,
      width: 2.5,
      depth: 1.05,
      parapetSide: 'north',
      hasSandbags: true,
      duckboards: true,
      faction: 'ally'
    },
    {
      id: 'ally_comm_sap',
      x1: 0,
      z1: 30,
      x2: 0,
      z2: 41.5,
      width: 2.1,
      depth: 1.05,
      parapetSide: 'none',
      hasSandbags: false,
      duckboards: true,
      faction: 'ally'
    }
  ];
}

function makeStandardDugouts(): DugoutSpec[] {
  return [
    {
      id: 'dug_west',
      x: -16,
      z: 35.5,
      width: 5.0,
      depth: 4.2,
      floorY: -1.05,
      ceilingY: 0.55,
      openSide: 'north',
      label: 'ABRIGO OESTE'
    },
    {
      id: 'dug_center',
      x: 0,
      z: 40.5,
      width: 4.8,
      depth: 4.0,
      floorY: -1.05,
      ceilingY: 0.55,
      openSide: 'north',
      label: 'ABRIGO CENTRAL'
    },
    {
      id: 'dug_east',
      x: 16,
      z: 35.5,
      width: 5.0,
      depth: 4.2,
      floorY: -1.05,
      ceilingY: 0.55,
      openSide: 'north',
      label: 'ABRIGO LESTE'
    }
  ];
}

function makeExtendedCraters(): Crater[] {
  return [
    { x: -16, z: 18, radius: 2.6, depth: 0.9 },
    { x: -4, z: 16, radius: 2.9, depth: 1.0 },
    { x: 11, z: 17, radius: 2.5, depth: 0.85 },
    { x: 35, z: 14, radius: 3.0, depth: 1.0 },
    { x: -34, z: 6, radius: 3.1, depth: 1.05 },
    { x: -8, z: 4, radius: 2.8, depth: 0.95 },
    { x: 6, z: 2, radius: 3.3, depth: 1.15 },
    { x: 20, z: -2, radius: 2.7, depth: 0.9 },
    { x: -5, z: -12, radius: 3.2, depth: 1.1 },
    { x: 10, z: -14, radius: 2.9, depth: 1.0 },
    { x: -32, z: -18, radius: 2.8, depth: 0.95 },
    { x: 32, z: -20, radius: 3.0, depth: 1.0 },
    { x: -14, z: -32, radius: 3.4, depth: 1.15 },
    { x: 4, z: -34, radius: 3.1, depth: 1.05 },
    { x: 24, z: -38, radius: 2.9, depth: 0.95 },
    { x: -36, z: -42, radius: 3.0, depth: 1.0 },
    { x: -8, z: -50, radius: 3.3, depth: 1.1 },
    { x: 14, z: -52, radius: 3.0, depth: 1.0 },
    { x: -24, z: -64, radius: 3.2, depth: 1.05 },
    { x: 28, z: -68, radius: 2.9, depth: 0.95 }
  ];
}

export const MISSIONS: MissionConfig[] = [
  // OPERAÇÃO I — ALVORADA DE AÇO
  {
    id: 0,
    code: 'OP-01',
    title: 'Alvorada de Aço',
    subtitle: 'Setor Norte • Segurar a Primeira Linha',
    briefingSummary:
      'A neblina da madrugada mal se dissipou e batedores confirmam infantaria inimiga cruzando a Terra de Ninguém estendida, apoiada por caminhões de tropas nos flancos. Use as ruínas e construções entráveis como postos avançados e prepare o lançador antitanque para a vanguarda blindada.',
    objectivesSummary: [
      'Conter a primeira vaga de infantaria na Terra de Ninguém',
      'Interceptar reforços transportados por carros e granadeiros nos flancos',
      'Destruir o tanque leve de escolta e repelir o assalto final'
    ],
    threatsSummary: [
      'Fogo de supressão e atiradores inimigos — ficar exposto é morte rápida',
      'Carros de transporte despejando pelotões frescos pelas trilhas laterais',
      'Tanque Leve rompendo arame farpado na fase final'
    ],
    fieldTip:
      'Entre nas casas e postos avançados pelas portas Sul/Norte e atire pelas janelas agachado [C] para proteção total contra artilharia.',
    environment: {
      skyTop: 0x3b3532,
      skyHorizon: 0x8e5d3b,
      fogColor: 0x5c4c3f,
      fogDensity: 0.0125,
      ambientColor: 0xa09184,
      ambientIntensity: 1.15,
      sunColor: 0xffb878,
      sunIntensity: 1.85,
      sunPosition: [46, 26, -55],
      isNight: false,
      hasRain: false,
      hasFlak: false,
      hasFlares: true,
      hasSearchlights: false
    },
    playerSpawn: { x: -2, z: 30, yaw: 0 },
    trenches: makeMainAllyTrench(),
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 22, z1: 31.2, x2: 22, z2: 27.6, width: 2.0, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeExtendedCraters(),
    ruins: [
      { x: -12, z: 12, w: 3.8, h: 1.45, d: 0.7, rotY: 0.14 },
      { x: 13, z: 9, w: 4.2, h: 1.6, d: 0.75, rotY: -0.18 },
      { x: -2, z: -4, w: 4.8, h: 1.5, d: 0.8, rotY: 0.08 },
      { x: -22, z: -26, w: 4.4, h: 1.6, d: 0.75, rotY: 0.2 },
      { x: 16, z: -42, w: 4.6, h: 1.55, d: 0.75, rotY: -0.15 }
    ],
    buildings: [
      { x: -25, z: 15, w: 5.4, h: 3.1, d: 4.4, rotY: 0.14, enterable: true, kind: 'shed' },
      { x: 25, z: 13, w: 5.6, h: 3.2, d: 4.6, rotY: -0.12, enterable: true, kind: 'house' },
      { x: -16, z: -14, w: 5.8, h: 3.3, d: 4.8, rotY: 0.08, enterable: true, kind: 'house' },
      { x: 22, z: -24, w: 5.2, h: 3.0, d: 4.2, rotY: -0.14, enterable: true, kind: 'outpost' },
      { x: -26, z: -48, w: 6.0, h: 3.3, d: 4.8, rotY: 0.1, enterable: true, kind: 'house' },
      { x: 14, z: -64, w: 5.4, h: 3.1, d: 4.4, rotY: -0.08, enterable: true, kind: 'outpost' }
    ],
    trees: [
      { x: -38, z: 16, height: 4.6 },
      { x: -40, z: -8, height: 4.4 },
      { x: -12, z: -22, height: 4.8 },
      { x: -42, z: -34, height: 5.0 },
      { x: -38, z: -58, height: 4.7 },
      { x: 16, z: 20, height: 4.1 },
      { x: 38, z: 10, height: 4.7 },
      { x: 40, z: -16, height: 4.5 },
      { x: 36, z: -46, height: 4.6 },
      { x: -4, z: -42, height: 4.4 }
    ],
    fences: [
      { x: -32, z: 20, len: 6.5, rotY: 0.12 },
      { x: 32, z: 19, len: 6.5, rotY: -0.15 },
      { x: -32, z: -32, len: 6.0, rotY: 0.25 },
      { x: 32, z: -34, len: 6.0, rotY: -0.25 }
    ],
    barbedWires: [
      { x: -18, z: 23, len: 10, rotY: 0.08 },
      { x: -2, z: 22, len: 9, rotY: -0.05 },
      { x: 16, z: 23, len: 11, rotY: -0.08 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_1', x: 8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [{ id: 'en_mg_1', x: -18, y: 0.35, z: -52, yaw: Math.PI, faction: 'enemy' }],
    interactables: [
      {
        id: 'ammo_1',
        kind: 'ammo_crate',
        x: -6,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.4,
        active: true
      },
      {
        id: 'med_1',
        kind: 'medic_crate',
        x: 5,
        y: -1.05,
        z: 31.1,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.4,
        active: true
      },
      {
        id: 'mg_1',
        kind: 'mg_mount',
        x: 8,
        y: -1.05,
        z: 29.6,
        label: '[F] Assumir Metralhadora Pesada',
        radius: 2.2,
        active: true
      }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op1_p1',
        type: 'survive_wave',
        objectiveText: 'SEGURE A TRINCHEIRA — PRIMEIRA VAGA',
        objectiveSubtext: 'Elimine as vagas de vanguarda inimiga que avançam pela neblina',
        objectiveTarget: { x: 0, z: -14 },
        enemiesToSpawn: 95,
        enemyRoles: ['rifleman', 'rifleman', 'assault'],
        artilleryRate: 12,
        radioOpening:
          'Posto 2 na escuta! Vultos incontáveis na Terra de Ninguém! Abaixo do parapeito!'
      },
      {
        id: 'op1_p2',
        type: 'survive_wave',
        objectiveText: 'CONTER O ASSALTO E CARROS DE REFORÇO',
        objectiveSubtext: 'Inimigos desembarcam pelos flancos — proteja-se das granadas',
        objectiveTarget: { x: -4, z: -10 },
        enemiesToSpawn: 120,
        enemyRoles: ['rifleman', 'assault', 'grenadier', 'rifleman'],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -74,
            dropX: -40,
            dropZ: -12,
            passengers: 6,
            roles: ['assault', 'rifleman', 'grenadier']
          },
          {
            x: 56,
            z: -74,
            dropX: 40,
            dropZ: -10,
            passengers: 6,
            roles: ['assault', 'rifleman']
          }
        ],
        artilleryRate: 6.0,
        radioOpening:
          'Motores nos flancos! Carros inimigos trazendo tropas de choque para as ruínas!'
      },
      {
        id: 'op1_p3',
        type: 'destroy_tanks',
        objectiveText: 'DESTRUA O TANQUE LEVE E A ESCOLTA',
        objectiveSubtext: 'Equipe a Bazuca [3] e acerte a lateral ou traseira do blindado',
        objectiveTarget: { x: 4, z: 6 },
        enemiesToSpawn: 110,
        enemyRoles: ['assault', 'rifleman', 'grenadier'],
        tanksToSpawn: [
          {
            x: 4,
            z: -62,
            heavy: false,
            waypoints: [
              { x: 4, z: -26 },
              { x: 2, z: 2 },
              { x: 6, z: 22 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -54,
            z: -78,
            dropX: -38,
            dropZ: 4,
            passengers: 5,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 9,
        radioOpening: 'TANQUE À FRENTE! Peguem o lançador antitanque [3]! Fogo pela traseira!'
      }
    ]
  },

  // OPERAÇÃO II — MANDÍBULAS DE FERRO
  {
    id: 1,
    code: 'OP-02',
    title: 'Mandíbulas de Ferro',
    subtitle: 'Corredor Central • Deter Coluna Blindada',
    briefingSummary:
      'Sob chuva fria e lama espessa, uma ponta de lança blindada avança pelo corredor de 190 metros acompanhada de comboios motorizados. Use as casas de alvenaria, postos e trincheiras para flanquear os tanques com a Bazuca AT-43.',
    objectivesSummary: [
      'Interceptar a primeira ponta blindada na Terra de Ninguém',
      'Destruir todos os 3 Tanques Pesados antes que rompam a retaguarda',
      'Neutralizar a escolta mecanizada de infantaria'
    ],
    threatsSummary: [
      'Canhões de 75mm que destroem paredes e causam surdez/tinnitus',
      'Carros de reforço desembarcando tropas pelas trilhas laterais',
      'Infantaria de assalto aproveitando a sombra dos blindados para invadir a vala'
    ],
    fieldTip:
      'Tiros de fuzil e SMG ricocheteiam na blindagem. Atire das janelas das casas com a Bazuca [3] nos flancos ou traseira vermelha dos tanques!',
    environment: {
      skyTop: 0x2b3033,
      skyHorizon: 0x5c6366,
      fogColor: 0x454b4d,
      fogDensity: 0.012,
      ambientColor: 0x92999b,
      ambientIntensity: 1.1,
      sunColor: 0xcfd6d8,
      sunIntensity: 1.55,
      sunPosition: [-36, 40, -32],
      isNight: false,
      hasRain: true,
      hasFlak: false,
      hasFlares: false,
      hasSearchlights: false
    },
    playerSpawn: { x: 4, z: 30, yaw: 0 },
    trenches: [
      ...makeMainAllyTrench(),
      {
        id: 'forward_crater_sap',
        x1: -22,
        z1: 12,
        x2: -10,
        z2: 11,
        width: 2.3,
        depth: 0.95,
        parapetSide: 'north',
        hasSandbags: true,
        duckboards: false,
        faction: 'ally'
      }
    ],
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_w', x1: -22, z1: 31.2, x2: -22, z2: 27.5, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeExtendedCraters(),
    ruins: [
      { x: -16, z: 16, w: 4.4, h: 1.7, d: 0.8, rotY: 0.25 },
      { x: 15, z: 15, w: 4.6, h: 1.7, d: 0.8, rotY: -0.2 },
      { x: 0, z: 0, w: 5.0, h: 1.65, d: 0.85, rotY: 0.05 },
      { x: -20, z: -30, w: 4.2, h: 1.55, d: 0.75, rotY: -0.15 },
      { x: 20, z: -36, w: 4.2, h: 1.55, d: 0.75, rotY: 0.18 }
    ],
    buildings: [
      { x: -30, z: 10, w: 5.6, h: 3.2, d: 4.5, rotY: 0.12, enterable: true, kind: 'house' },
      { x: 30, z: 8, w: 5.4, h: 3.0, d: 4.4, rotY: -0.16, enterable: true, kind: 'shed' },
      { x: -18, z: -18, w: 5.6, h: 3.2, d: 4.6, rotY: 0.06, enterable: true, kind: 'outpost' },
      { x: 24, z: -22, w: 6.0, h: 3.3, d: 4.8, rotY: -0.1, enterable: true, kind: 'house' },
      { x: -26, z: -50, w: 5.4, h: 3.1, d: 4.4, rotY: 0.14, enterable: true, kind: 'shed' },
      { x: 18, z: -64, w: 5.8, h: 3.2, d: 4.6, rotY: -0.06, enterable: true, kind: 'outpost' }
    ],
    trees: [
      { x: -42, z: 16, height: 4.5 },
      { x: -41, z: -12, height: 4.9 },
      { x: -38, z: -40, height: 4.6 },
      { x: -4, z: 15, height: 4.0 },
      { x: 6, z: -12, height: 4.4 },
      { x: 40, z: 15, height: 4.7 },
      { x: 42, z: -10, height: 4.6 },
      { x: 38, z: -42, height: 4.4 },
      { x: -36, z: -62, height: 5.0 },
      { x: 36, z: -64, height: 4.8 }
    ],
    fences: [
      { x: -34, z: 21, len: 6.5, rotY: 0.1 },
      { x: 34, z: 21, len: 6.5, rotY: -0.1 },
      { x: -35, z: -4, len: 5.5, rotY: 1.45 },
      { x: 35, z: -4, len: 5.5, rotY: -1.42 }
    ],
    barbedWires: [
      { x: -24, z: 22, len: 8, rotY: 0.05 },
      { x: 24, z: 22, len: 8, rotY: -0.05 }
    ],
    bunkers: [],
    allyEmplacements: [],
    enemyEmplacements: [
      { id: 'en_mg_2a', x: -24, y: 0.35, z: -54, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_2b', x: 24, y: 0.35, z: -54, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      {
        id: 'ammo_2w',
        kind: 'ammo_crate',
        x: -12,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.6,
        active: true
      },
      {
        id: 'ammo_2e',
        kind: 'ammo_crate',
        x: 12,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.6,
        active: true
      },
      {
        id: 'med_2',
        kind: 'medic_crate',
        x: 0,
        y: -1.05,
        z: 32.8,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op2_p1',
        type: 'destroy_tanks',
        objectiveText: 'DESTRUA O TANQUE DE VANGUARDA',
        objectiveSubtext: 'Acerte os flancos ou retaguarda com a Bazuca [3]',
        objectiveTarget: { x: -8, z: -12 },
        enemiesToSpawn: 100,
        enemyRoles: ['rifleman', 'assault', 'grenadier'],
        tanksToSpawn: [
          {
            x: -8,
            z: -66,
            heavy: true,
            waypoints: [
              { x: -8, z: -30 },
              { x: -6, z: -4 },
              { x: -6, z: 22 }
            ]
          }
        ],
        artilleryRate: 10,
        radioOpening: 'Blindado pesado rompendo a neblina à esquerda! Segurem as posições!'
      },
      {
        id: 'op2_p2',
        type: 'destroy_tanks',
        objectiveText: 'DETENHA A PINÇA BLINDADA (2 TANQUES)',
        objectiveSubtext: 'Reabasteça foguetes nas caixas [F] e elimine os dois tanques',
        objectiveTarget: { x: 8, z: -10 },
        enemiesToSpawn: 135,
        enemyRoles: ['assault', 'rifleman', 'grenadier', 'assault'],
        tanksToSpawn: [
          {
            x: -10,
            z: -70,
            heavy: true,
            waypoints: [
              { x: -10, z: -34 },
              { x: -8, z: 12 }
            ]
          },
          {
            x: 10,
            z: -70,
            heavy: true,
            waypoints: [
              { x: 10, z: -32 },
              { x: 8, z: 14 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -76,
            dropX: -40,
            dropZ: -8,
            passengers: 6,
            roles: ['assault', 'grenadier']
          },
          {
            x: 56,
            z: -76,
            dropX: 40,
            dropZ: -6,
            passengers: 6,
            roles: ['assault', 'rifleman']
          }
        ],
        artilleryRate: 7.5,
        radioOpening:
          'DOIS TANQUES PESADOS E CARROS DE INFANTARIA AVANÇANDO PELOS FLANCOS!'
      },
      {
        id: 'op2_p3',
        type: 'survive_wave',
        objectiveText: 'LIQUIDE A INFANTARIA DE ASSALTO',
        objectiveSubtext: 'Sem cobertura blindada, eles vêm em massa pelas casas e valas',
        objectiveTarget: { x: 0, z: 5 },
        enemiesToSpawn: 120,
        enemyRoles: ['assault', 'grenadier', 'assault'],
        troopCarsToSpawn: [
          {
            x: 54,
            z: -76,
            dropX: 38,
            dropZ: 6,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 11,
        radioOpening: 'Blindados abatidos! Mantenham fogo cerrado na infantaria remanescente!'
      }
    ]
  },

  // OPERAÇÃO III — CÉU DE CHUMBO
  {
    id: 2,
    code: 'OP-03',
    title: 'Céu de Chumbo',
    subtitle: 'Setor Leste • Sobreviver ao Bombardeio Aéreo',
    briefingSummary:
      'Esquadrões de bombardeiros pesados foram detectados no radar. Sempre que a sirene soar, corra para os Abrigos Subterrâneos (Dugouts) ou construções intactas — e saia logo após as bombas para deter a infantaria e os carros de reforço.',
    objectivesSummary: [
      'Sobreviver às vagas de bombardeio aéreo dentro dos Abrigos',
      'Repelir as tropas de choque, carros e blindados após cada bombardeio',
      'Ativar o Rádio de Campo e resistir 25s pelo contra-ataque'
    ],
    threatsSummary: [
      'Tapete de bombas aéreas — mortal fora do teto reforçado dos Abrigos',
      'Bombardeio abre novas crateras e compromete estruturas e sacos de areia',
      'Inimigos chegam de carro pelos flancos aproveitando a fumaça pós-explosão'
    ],
    fieldTip:
      'Procure as placas [ABRIGO] e a luz âmbar dentro da trincheira traseira quando a sirene tocar. Somente o teto reforçado salva de uma bomba direta.',
    environment: {
      skyTop: 0x321c1c,
      skyHorizon: 0x9b3e2b,
      fogColor: 0x522e28,
      fogDensity: 0.0115,
      ambientColor: 0xa28179,
      ambientIntensity: 1.05,
      sunColor: 0xff8357,
      sunIntensity: 1.75,
      sunPosition: [52, 22, -45],
      isNight: false,
      hasRain: false,
      hasFlak: true,
      hasFlares: false,
      hasSearchlights: false
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    trenches: makeMainAllyTrench(),
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeExtendedCraters(),
    ruins: [
      { x: -12, z: 8, w: 3.8, h: 1.5, d: 0.75, rotY: 0.1 },
      { x: 12, z: 10, w: 3.8, h: 1.5, d: 0.75, rotY: -0.15 },
      { x: -8, z: -28, w: 4.4, h: 1.6, d: 0.75, rotY: 0.12 },
      { x: 12, z: -40, w: 4.2, h: 1.55, d: 0.75, rotY: -0.14 }
    ],
    buildings: [
      { x: -24, z: 14, w: 5.4, h: 3.1, d: 4.4, rotY: 0.14, enterable: true, kind: 'outpost' },
      { x: 24, z: 12, w: 5.6, h: 3.2, d: 4.6, rotY: -0.14, enterable: true, kind: 'house' },
      { x: -20, z: -12, w: 5.8, h: 3.2, d: 4.6, rotY: 0.08, enterable: true, kind: 'house' },
      { x: 22, z: -18, w: 5.4, h: 3.0, d: 4.4, rotY: -0.12, enterable: true, kind: 'shed' },
      { x: -16, z: -48, w: 5.6, h: 3.2, d: 4.5, rotY: 0.08, enterable: true, kind: 'house' },
      { x: 26, z: -62, w: 5.4, h: 3.1, d: 4.4, rotY: -0.1, enterable: true, kind: 'outpost' }
    ],
    trees: [
      { x: -38, z: 14, height: 4.6 },
      { x: -39, z: -14, height: 4.4 },
      { x: -14, z: -24, height: 4.8 },
      { x: 38, z: 12, height: 4.5 },
      { x: 39, z: -16, height: 4.7 },
      { x: 16, z: -28, height: 4.3 },
      { x: -38, z: -48, height: 5.0 },
      { x: 38, z: -48, height: 4.9 }
    ],
    fences: [
      { x: -30, z: 19, len: 6.5, rotY: 0.15 },
      { x: 30, z: 19, len: 6.5, rotY: -0.15 },
      { x: -30, z: -28, len: 6.0, rotY: 0.22 },
      { x: 30, z: -30, len: 6.0, rotY: -0.22 }
    ],
    barbedWires: [
      { x: -16, z: 23, len: 10, rotY: 0 },
      { x: 16, z: 23, len: 10, rotY: 0 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_3', x: -8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [{ id: 'en_mg_3', x: 18, y: 0.35, z: -52, yaw: Math.PI, faction: 'enemy' }],
    interactables: [
      {
        id: 'ammo_3',
        kind: 'ammo_crate',
        x: -3,
        y: -1.05,
        z: 31,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_3',
        kind: 'medic_crate',
        x: 4,
        y: -1.05,
        z: 31,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      },
      {
        id: 'mg_3',
        kind: 'mg_mount',
        x: -8,
        y: -1.05,
        z: 29.6,
        label: '[F] Assumir Metralhadora Pesada',
        radius: 2.2,
        active: true
      },
      {
        id: 'radio_3',
        kind: 'radio',
        x: 1.5,
        y: -1.05,
        z: 39.2,
        label: '[F] Chamar Contra-Ataque pelo Rádio',
        radius: 2.5,
        active: false
      }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op3_p1',
        type: 'bomber_storm',
        objectiveText: 'ALERTA AÉREO — ABRIGUE-SE DO BOMBARDEIO',
        objectiveSubtext: 'Corra para o ABRIGO subterrâneo antes da passagem dos bombardeiros',
        objectiveTarget: { x: -16, z: 35 },
        bomberWaves: 1,
        enemiesToSpawn: 90,
        enemyRoles: ['assault', 'rifleman'],
        radioOpening: 'SIRENE AÉREA! Bombardeiros no horizonte! Todo mundo para os ABRIGOS!'
      },
      {
        id: 'op3_p2',
        type: 'bomber_storm',
        objectiveText: 'SEGUNDA VAGA DE BOMBARDEIO E TANQUE',
        objectiveSubtext: 'Sobreviva às bombas no abrigo e destrua o tanque + reforços de carro',
        objectiveTarget: { x: 16, z: 35 },
        bomberWaves: 2,
        enemiesToSpawn: 125,
        enemyRoles: ['assault', 'grenadier', 'rifleman'],
        tanksToSpawn: [
          {
            x: 0,
            z: -62,
            heavy: false,
            waypoints: [
              { x: 0, z: -24 },
              { x: 2, z: 12 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -76,
            dropX: -38,
            dropZ: -4,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        radioOpening:
          'Mais bombardeiros a caminho! Depois deles vem blindado e carros pelos flancos!'
      },
      {
        id: 'op3_p3',
        type: 'activate_radio',
        objectiveText: 'ATIVE O RÁDIO DE CAMPO NO ABRIGO CENTRAL',
        objectiveSubtext: 'Desça pela trincheira central até o Abrigo Central (Z +39) e pressione [F]',
        objectiveTarget: { x: 1.5, z: 39.2 },
        radioOpening:
          'Nossas defesas estão em ruínas! Vá até o rádio no Abrigo Central e peça apoio!'
      },
      {
        id: 'op3_p4',
        type: 'hold_timer',
        objectiveText: 'RESISTA ATÉ O APOIO CHEGAR (25s)',
        objectiveSubtext: 'Segure a linha contra a maré desesperada de assalto inimigo',
        objectiveTarget: { x: 0, z: 18 },
        durationSeconds: 25,
        enemiesToSpawn: 145,
        enemyRoles: ['assault', 'assault', 'grenadier', 'rifleman'],
        troopCarsToSpawn: [
          {
            x: 56,
            z: -74,
            dropX: 40,
            dropZ: 2,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 5,
        radioOpening:
          'Sinal confirmado! 25 segundos para nossa artilharia varrer o setor! Aguentem firme!'
      }
    ]
  },

  // OPERAÇÃO IV — VILAREJO EM RUÍNAS
  {
    id: 3,
    code: 'OP-04',
    title: 'Vilarejo em Ruínas',
    subtitle: 'Setor Urbano • Combate Casa a Casa',
    briefingSummary:
      'O antigo vilarejo de Saint-Véran virou um labirinto de fachadas perfuradas e ruas cobertas de escombros. Avance de casa em casa, neutralize esquadrões com lança-chamas e corte os comboios de carros inimigos que descem pelas vias laterais.',
    objectivesSummary: [
      'Avançar pelas ruas do vilarejo e tomar a praça central',
      'Destruir os blindados inimigos e conter os reforços pelas vias laterais',
      'Expulsar a guarnição do casarão norte e limpar o vilarejo'
    ],
    threatsSummary: [
      'Soldados inimigos com lança-chamas emboscando entre casas e esquinas',
      'Carros de transporte entrando continuamente pelas estradas laterais',
      'Blindados patrulhando a avenida central e atirando contra paredes'
    ],
    fieldTip:
      'Nunca atravesse a rua central descoberto! Use as portas Sul/Norte das 9 casas para flanquear pelas janelas e evite aproximação curta contra lança-chamas.',
    environment: {
      skyTop: 0x2c3034,
      skyHorizon: 0x7b6a58,
      fogColor: 0x564c44,
      fogDensity: 0.0115,
      ambientColor: 0x9d948b,
      ambientIntensity: 1.15,
      sunColor: 0xffe0b5,
      sunIntensity: 1.75,
      sunPosition: [40, 32, -38],
      isNight: false,
      hasRain: false,
      hasFlak: true,
      hasFlares: false,
      hasSearchlights: false
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    trenches: makeMainAllyTrench(),
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26, width: 2.6, y1: -1.05, y2: 0 },
      { id: 'ramp_w', x1: -22, z1: 31.2, x2: -22, z2: 27.5, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 22, z1: 31.2, x2: 22, z2: 27.5, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: [
      { x: -4, z: 21, radius: 2.5, depth: 0.85 },
      { x: 5, z: 16, radius: 2.7, depth: 0.9 },
      { x: -24, z: 12, radius: 2.6, depth: 0.85 },
      { x: 24, z: 10, radius: 2.6, depth: 0.85 },
      { x: 0, z: -2, radius: 3.0, depth: 1.0 },
      { x: -25, z: -14, radius: 2.8, depth: 0.95 },
      { x: 25, z: -18, radius: 2.9, depth: 0.95 },
      { x: -2, z: -26, radius: 3.1, depth: 1.05 },
      { x: -14, z: -48, radius: 3.0, depth: 1.0 },
      { x: 15, z: -52, radius: 3.0, depth: 1.0 }
    ],
    ruins: [
      { x: -5, z: 6, w: 3.6, h: 1.5, d: 0.75, rotY: 0.1 },
      { x: 6, z: -6, w: 3.8, h: 1.5, d: 0.75, rotY: -0.12 },
      { x: -22, z: -22, w: 4.0, h: 1.6, d: 0.8, rotY: 0.08 },
      { x: 22, z: -26, w: 4.0, h: 1.6, d: 0.8, rotY: -0.08 }
    ],
    buildings: [
      { x: -14, z: 14, w: 6.2, h: 3.4, d: 5.0, rotY: 0, enterable: true, kind: 'house' },
      { x: 14, z: 12, w: 6.0, h: 3.3, d: 4.8, rotY: 0, enterable: true, kind: 'house' },
      { x: -32, z: 4, w: 5.6, h: 3.1, d: 4.6, rotY: 0.06, enterable: true, kind: 'shed' },
      { x: 32, z: 2, w: 5.8, h: 3.2, d: 4.6, rotY: -0.06, enterable: true, kind: 'shed' },
      { x: -14, z: -12, w: 6.4, h: 3.4, d: 5.2, rotY: 0, enterable: true, kind: 'house' },
      { x: 14, z: -14, w: 6.2, h: 3.3, d: 5.0, rotY: 0, enterable: true, kind: 'house' },
      { x: -30, z: -36, w: 5.8, h: 3.2, d: 4.8, rotY: 0.05, enterable: true, kind: 'outpost' },
      { x: 0, z: -40, w: 6.8, h: 3.5, d: 5.4, rotY: 0, enterable: true, kind: 'house' },
      { x: 28, z: -38, w: 6.0, h: 3.2, d: 4.8, rotY: -0.05, enterable: true, kind: 'shed' }
    ],
    trees: [
      { x: -44, z: 14, height: 4.6 },
      { x: -46, z: -18, height: 4.8 },
      { x: -44, z: -48, height: 4.5 },
      { x: 44, z: 12, height: 4.7 },
      { x: 46, z: -20, height: 4.8 },
      { x: 44, z: -50, height: 4.6 }
    ],
    fences: [
      { x: -24, z: 22, len: 6.0, rotY: 0.06 },
      { x: 24, z: 22, len: 6.0, rotY: -0.06 },
      { x: -22, z: -4, len: 5.5, rotY: 1.5 },
      { x: 22, z: -4, len: 5.5, rotY: 1.5 }
    ],
    barbedWires: [
      { x: -24, z: 24, len: 8, rotY: 0 },
      { x: 24, z: 24, len: 8, rotY: 0 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_4', x: 10, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [
      { id: 'en_mg_4a', x: -16, y: 0.35, z: -48, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_4b', x: 16, y: 0.35, z: -48, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      {
        id: 'ammo_4_base',
        kind: 'ammo_crate',
        x: -5,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_4_base',
        kind: 'medic_crate',
        x: 5,
        y: -1.05,
        z: 30.8,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      },
      {
        id: 'ammo_4_plaza',
        kind: 'ammo_crate',
        x: -2,
        y: 0,
        z: -10,
        label: '[F] Caixa de Munição na Praça',
        radius: 2.4,
        active: true
      },
      {
        id: 'med_4_plaza',
        kind: 'medic_crate',
        x: 3,
        y: 0,
        z: -10,
        label: '[F] Suprimento Médico da Praça',
        radius: 2.4,
        active: true
      }
    ],
    allyCount: 9,
    phases: [
      {
        id: 'op4_p1',
        type: 'reach_zone',
        objectiveText: 'AVANCE PELO VILAREJO ATÉ A PRAÇA CENTRAL',
        objectiveSubtext: 'Limpe as primeiras casas e alcance a praça (Z -10)',
        objectiveTarget: { x: 0, z: -10 },
        targetZone: { x: 0, z: -10, radius: 9.0 },
        enemiesToSpawn: 105,
        enemyRoles: ['rifleman', 'assault', 'flamethrower', 'assault'],
        troopCarsToSpawn: [
          {
            x: -58,
            z: -74,
            dropX: -44,
            dropZ: -4,
            passengers: 6,
            roles: ['assault', 'flamethrower', 'rifleman']
          },
          {
            x: 58,
            z: -74,
            dropX: 44,
            dropZ: -6,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 11,
        radioOpening:
          'Entrem nas casas! Esquadrões com lança-chamas e carros de reforço fechando as ruas!'
      },
      {
        id: 'op4_p2',
        type: 'destroy_tanks',
        objectiveText: 'DESTRUA OS BLINDADOS NA AVENIDA DO VILAREJO',
        objectiveSubtext: 'Use os telhados e janelas para emboscar os 2 tanques inimigos',
        objectiveTarget: { x: 0, z: -26 },
        enemiesToSpawn: 130,
        enemyRoles: ['assault', 'flamethrower', 'grenadier', 'rifleman'],
        tanksToSpawn: [
          {
            x: -4,
            z: -68,
            heavy: true,
            waypoints: [
              { x: -3, z: -26 },
              { x: -2, z: -4 },
              { x: 0, z: 12 }
            ]
          },
          {
            x: 22,
            z: -68,
            heavy: false,
            waypoints: [
              { x: 22, z: -24 },
              { x: 22, z: 2 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -78,
            dropX: -42,
            dropZ: -22,
            passengers: 6,
            roles: ['flamethrower', 'assault']
          },
          {
            x: 56,
            z: -78,
            dropX: 42,
            dropZ: -20,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 9,
        radioOpening: 'BLINDADOS NA RUA PRINCIPAL! Peguem a Bazuca [3] e atirem das janelas!'
      },
      {
        id: 'op4_p3',
        type: 'clear_trench',
        objectiveText: 'CONQUISTE O CASARÃO NORTE DO VILAREJO',
        objectiveSubtext: 'Neutralize o oficial, lança-chamas e remanescentes ao norte (Z -40)',
        objectiveTarget: { x: 0, z: -40 },
        enemiesToSpawn: 115,
        enemyRoles: ['assault', 'flamethrower', 'officer', 'grenadier'],
        troopCarsToSpawn: [
          {
            x: 58,
            z: -78,
            dropX: 42,
            dropZ: -34,
            passengers: 6,
            roles: ['assault', 'flamethrower']
          }
        ],
        artilleryRate: 10,
        radioOpening: 'Última linha de resistência no casarão norte! Avancem e limpem o setor!'
      }
    ]
  },

  // OPERAÇÃO V — FLORESTA DEVASTADA
  {
    id: 4,
    code: 'OP-05',
    title: 'Floresta Devastada',
    subtitle: 'Bosque Carbonizado • Morteiros e Caças Rasantes',
    briefingSummary:
      'Entre troncos carbonizados, cabanas de madeira e postos avançados de observação, o inimigo ajustou baterias de morteiro sobre sua posição e enviou caças em voos rasantes. Mude de abrigo constantemente quando o morteiro zerar sua mira e avance até a linha norte.',
    objectivesSummary: [
      'Atravessar o bosque sob fogo de morteiro guiado e cabanas emboscadas',
      'Sobreviver às passagens de caças rasantes e comboios motorizados',
      'Tomar o posto avançado inimigo ao norte da clareira'
    ],
    threatsSummary: [
      'Baterias de morteiro ajustando disparos consecutivos sobre quem fica parado',
      'Caças rasantes (2 vagas) varrendo áreas abertas fora de cabanas e abrigos',
      'Árvores destrutíveis que caem sob explosões e comboios de carros de reforço'
    ],
    fieldTip:
      'Quando o alerta de morteiro soar, corra 12+ metros ou entre numa cabana/posto entrável! Árvores param balas leves, mas caem com explosivos.',
    environment: {
      skyTop: 0x262925,
      skyHorizon: 0x675b49,
      fogColor: 0x474238,
      fogDensity: 0.013,
      ambientColor: 0x918d80,
      ambientIntensity: 1.1,
      sunColor: 0xffc688,
      sunIntensity: 1.6,
      sunPosition: [-42, 28, -44],
      isNight: false,
      hasRain: false,
      hasFlak: true,
      hasFlares: true,
      hasSearchlights: false
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    trenches: [
      ...makeMainAllyTrench(),
      {
        id: 'forest_enemy_line',
        x1: -26,
        z1: -48,
        x2: 26,
        z2: -48,
        width: 2.5,
        depth: 1.0,
        parapetSide: 'south',
        hasSandbags: true,
        duckboards: true,
        faction: 'enemy'
      }
    ],
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.4, y1: -1.05, y2: 0 },
      { id: 'ramp_en_f', x1: 0, z1: -48, x2: 0, z2: -44, width: 2.4, y1: -1.0, y2: 0 }
    ],
    initialCraters: [
      ...makeExtendedCraters(),
      { x: -10, z: -20, radius: 3.1, depth: 1.05 },
      { x: 12, z: -26, radius: 3.0, depth: 1.0 }
    ],
    ruins: [
      { x: -8, z: 8, w: 3.8, h: 1.5, d: 0.75, rotY: 0.2 },
      { x: 10, z: -12, w: 4.0, h: 1.55, d: 0.75, rotY: -0.18 },
      { x: -4, z: -34, w: 4.2, h: 1.55, d: 0.8, rotY: 0.1 }
    ],
    buildings: [
      { x: -24, z: 12, w: 5.4, h: 3.1, d: 4.4, rotY: 0.14, enterable: true, kind: 'shed' },
      { x: 24, z: 10, w: 5.2, h: 3.0, d: 4.2, rotY: -0.12, enterable: true, kind: 'outpost' },
      { x: -18, z: -10, w: 5.6, h: 3.1, d: 4.5, rotY: 0.1, enterable: true, kind: 'shed' },
      { x: 22, z: -18, w: 5.4, h: 3.1, d: 4.4, rotY: -0.14, enterable: true, kind: 'shed' },
      { x: -24, z: -34, w: 5.2, h: 3.0, d: 4.2, rotY: 0.08, enterable: true, kind: 'outpost' },
      { x: 16, z: -38, w: 5.6, h: 3.1, d: 4.4, rotY: -0.08, enterable: true, kind: 'outpost' }
    ],
    trees: [
      { x: -34, z: 18, height: 4.8 },
      { x: -16, z: 19, height: 4.4 },
      { x: 12, z: 19, height: 4.5 },
      { x: 34, z: 17, height: 4.9 },
      { x: -32, z: 4, height: 4.7 },
      { x: -14, z: 3, height: 4.3 },
      { x: 4, z: 10, height: 4.2 },
      { x: 16, z: 2, height: 4.6 },
      { x: 34, z: 0, height: 4.8 },
      { x: -36, z: -8, height: 5.0 },
      { x: -6, z: -5, height: 4.4 },
      { x: 8, z: -4, height: 4.5 },
      { x: 36, z: -10, height: 4.9 },
      { x: -28, z: -20, height: 4.6 },
      { x: -8, z: -22, height: 4.3 },
      { x: 6, z: -24, height: 4.7 },
      { x: 32, z: -24, height: 4.8 },
      { x: -38, z: -32, height: 5.1 },
      { x: -14, z: -36, height: 4.4 },
      { x: 8, z: -36, height: 4.5 },
      { x: 34, z: -36, height: 4.9 },
      { x: -34, z: -56, height: 4.8 },
      { x: -18, z: -60, height: 4.6 },
      { x: 0, z: -62, height: 5.0 },
      { x: 18, z: -60, height: 4.7 },
      { x: 36, z: -56, height: 4.8 },
      { x: -44, z: -4, height: 4.7 },
      { x: 44, z: -6, height: 4.7 }
    ],
    fences: [
      { x: -30, z: 21, len: 6.0, rotY: 0.1 },
      { x: 30, z: 21, len: 6.0, rotY: -0.1 }
    ],
    barbedWires: [
      { x: -16, z: -42, len: 10, rotY: 0.04 },
      { x: 16, z: -42, len: 10, rotY: -0.04 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_5', x: -8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [
      { id: 'en_mg_5a', x: -18, y: 0.35, z: -49, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_5b', x: 18, y: 0.35, z: -49, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      {
        id: 'ammo_5',
        kind: 'ammo_crate',
        x: -4,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_5',
        kind: 'medic_crate',
        x: 4,
        y: -1.05,
        z: 30.8,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      },
      {
        id: 'ammo_5_mid',
        kind: 'ammo_crate',
        x: -18,
        y: 0,
        z: -10,
        label: '[F] Munição na Cabana Oeste',
        radius: 2.4,
        active: true
      }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op5_p1',
        type: 'survive_wave',
        objectiveText: 'SOBREVIVA AO MORTEIRO E CAÇAS RASANTES',
        objectiveSubtext: 'Mova-se quando o morteiro zerar e use as cabanas contra os caças',
        objectiveTarget: { x: 0, z: -8 },
        enemiesToSpawn: 105,
        enemyRoles: ['rifleman', 'assault', 'grenadier'],
        mortarZeroing: true,
        strafingWaves: 2,
        troopCarsToSpawn: [
          {
            x: -56,
            z: -74,
            dropX: -40,
            dropZ: -8,
            passengers: 6,
            roles: ['assault', 'rifleman']
          },
          {
            x: 56,
            z: -74,
            dropX: 40,
            dropZ: -10,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 9,
        radioOpening:
          'Morteiros inimigos zerando coordenadas e caças rasantes no céu! Não fiquem imóveis!'
      },
      {
        id: 'op5_p2',
        type: 'reach_zone',
        objectiveText: 'AVANCE PELAS CABANAS ATÉ A CLAREIRA CENTRAL',
        objectiveSubtext: 'Rompa a linha do bosque sob ataques rasantes (Z -22)',
        objectiveTarget: { x: 0, z: -22 },
        targetZone: { x: 0, z: -22, radius: 10.0 },
        enemiesToSpawn: 115,
        enemyRoles: ['assault', 'flamethrower', 'rifleman', 'grenadier'],
        mortarZeroing: true,
        strafingWaves: 2,
        troopCarsToSpawn: [
          {
            x: -58,
            z: -76,
            dropX: -42,
            dropZ: -24,
            passengers: 6,
            roles: ['assault', 'flamethrower']
          },
          {
            x: 58,
            z: -76,
            dropX: 42,
            dropZ: -22,
            passengers: 6,
            roles: ['assault', 'rifleman']
          }
        ],
        artilleryRate: 8,
        radioOpening: 'Avancem de cabana em cabana! Caças fazendo segunda passagem pela floresta!'
      },
      {
        id: 'op5_p3',
        type: 'clear_trench',
        objectiveText: 'TOME A TRINCHEIRA NORTE DO BOSQUE',
        objectiveSubtext: 'Destrua o tanque de apoio e limpe a guarnição em Z -48',
        objectiveTarget: { x: 0, z: -48 },
        enemiesToSpawn: 130,
        enemyRoles: ['assault', 'grenadier', 'officer', 'flamethrower'],
        tanksToSpawn: [
          {
            x: 2,
            z: -68,
            heavy: false,
            waypoints: [
              { x: 2, z: -38 },
              { x: -4, z: -18 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: 56,
            z: -78,
            dropX: 40,
            dropZ: -38,
            passengers: 6,
            roles: ['assault', 'grenadier']
          }
        ],
        artilleryRate: 10,
        radioOpening: 'Último esforço! Invadam a trincheira inimiga no extremo norte do bosque!'
      }
    ]
  },

  // OPERAÇÃO VI — OFENSIVA FINAL
  {
    id: 5,
    code: 'OP-06',
    title: 'Ofensiva Final',
    subtitle: 'Setor Ômega (Noite) • Rompimento Blindado e Bunker Principal',
    briefingSummary:
      'O assalto decisivo começa agora. Apoie o nosso Tanque Aliado para romper a Terra de Ninguém sob holofotes noturnos, avance pelas casas fortificadas contra comboios de reforço, tome a linha inimiga e plante a carga explosiva no Bunker Principal em Z -58.',
    objectivesSummary: [
      'Romper a Terra de Ninguém em conjunto com o Tanque Aliado',
      'Tomar a trincheira fortificada inimiga e destruir suas defesas blindadas',
      'Plantar a carga de demolição no Bunker Principal (Z -58) e recuar!'
    ],
    threatsSummary: [
      'Casamatas de metralhadora e holofotes varrendo o campo noturno',
      'Blindados pesados inimigos e infantaria com lança-chamas na linha final',
      'Carros de reforço tentando flanquear o avanço do tanque aliado'
    ],
    fieldTip:
      'Use [F] perto do Tanque Aliado para embarcar ou lute a pé atrás de sua blindagem! Silencie as casamatas com a Bazuca [3] antes de correr até o Bunker.',
    environment: {
      skyTop: 0x0b1019,
      skyHorizon: 0x262936,
      fogColor: 0x181c26,
      fogDensity: 0.011,
      ambientColor: 0x62708a,
      ambientIntensity: 1.0,
      sunColor: 0xa2bbe0,
      sunIntensity: 1.15,
      sunPosition: [-26, 40, 18],
      isNight: true,
      hasRain: false,
      hasFlak: true,
      hasFlares: true,
      hasSearchlights: true
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    allyTankSpawn: { x: -8, z: 24 },
    trenches: [
      ...makeMainAllyTrench(),
      {
        id: 'mid_staging_trench',
        x1: -14,
        z1: -6,
        x2: 14,
        z2: -6,
        width: 2.4,
        depth: 0.95,
        parapetSide: 'north',
        hasSandbags: true,
        duckboards: false,
        faction: 'ally'
      },
      {
        id: 'enemy_bastion_trench',
        x1: -34,
        z1: -44,
        x2: 34,
        z2: -44,
        width: 2.6,
        depth: 1.05,
        parapetSide: 'south',
        hasSandbags: true,
        duckboards: true,
        faction: 'enemy'
      }
    ],
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26, width: 2.6, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 18, z1: 30.8, x2: 18, z2: 26.8, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_mid', x1: 0, z1: -6, x2: 0, z2: -10, width: 2.4, y1: -0.95, y2: 0 },
      { id: 'ramp_en_s', x1: 0, z1: -44, x2: 0, z2: -40, width: 2.6, y1: -1.05, y2: 0 },
      { id: 'ramp_en_n', x1: 0, z1: -44, x2: 0, z2: -48, width: 2.6, y1: -1.05, y2: 0 }
    ],
    initialCraters: [
      { x: 8, z: 18, radius: 2.9, depth: 1.0 },
      { x: -20, z: 14, radius: 3.1, depth: 1.1 },
      { x: 18, z: 6, radius: 3.0, depth: 1.05 },
      { x: -16, z: 2, radius: 2.9, depth: 1.0 },
      { x: -24, z: -18, radius: 3.2, depth: 1.1 },
      { x: 6, z: -20, radius: 3.3, depth: 1.15 },
      { x: 24, z: -24, radius: 3.0, depth: 1.05 },
      { x: -10, z: -34, radius: 3.2, depth: 1.1 },
      { x: 14, z: -36, radius: 3.1, depth: 1.05 },
      { x: -34, z: -26, radius: 2.8, depth: 0.95 },
      { x: 34, z: -26, radius: 2.8, depth: 0.95 }
    ],
    ruins: [
      { x: 10, z: 10, w: 4.0, h: 1.5, d: 0.75, rotY: -0.14 },
      { x: -12, z: -18, w: 4.2, h: 1.6, d: 0.75, rotY: 0.12 },
      { x: 12, z: -28, w: 4.2, h: 1.6, d: 0.75, rotY: -0.1 }
    ],
    buildings: [
      { x: -26, z: 10, w: 5.6, h: 3.2, d: 4.6, rotY: 0.12, enterable: true, kind: 'house' },
      { x: 26, z: 8, w: 5.6, h: 3.2, d: 4.6, rotY: -0.12, enterable: true, kind: 'outpost' },
      { x: -22, z: -12, w: 5.8, h: 3.3, d: 4.6, rotY: 0.08, enterable: true, kind: 'house' },
      { x: 22, z: -14, w: 5.4, h: 3.1, d: 4.4, rotY: -0.1, enterable: true, kind: 'shed' },
      { x: -28, z: -32, w: 5.4, h: 3.1, d: 4.4, rotY: 0.06, enterable: true, kind: 'outpost' },
      { x: 28, z: -32, w: 5.6, h: 3.2, d: 4.5, rotY: -0.06, enterable: true, kind: 'outpost' }
    ],
    trees: [
      { x: -40, z: 14, height: 4.7 },
      { x: -42, z: -14, height: 4.8 },
      { x: -42, z: -40, height: 4.9 },
      { x: 40, z: 14, height: 4.6 },
      { x: 42, z: -14, height: 4.8 },
      { x: 42, z: -40, height: 4.9 }
    ],
    fences: [
      { x: -32, z: 22, len: 6.5, rotY: 0.08 },
      { x: 32, z: 22, len: 6.5, rotY: -0.08 }
    ],
    barbedWires: [
      { x: -16, z: -38, len: 10, rotY: 0 },
      { x: 16, z: -38, len: 10, rotY: 0 }
    ],
    bunkers: [
      { id: 'bunker_mg_w', kind: 'bunker_mg', x: -20, z: -52, w: 4.8, h: 2.5, d: 3.8, hp: 160 },
      { id: 'bunker_mg_e', kind: 'bunker_mg', x: 20, z: -52, w: 4.8, h: 2.5, d: 3.8, hp: 160 },
      { id: 'bunker_main', kind: 'bunker_main', x: 0, z: -58, w: 9.6, h: 3.8, d: 6.8, hp: 9999 }
    ],
    allyEmplacements: [],
    enemyEmplacements: [
      { id: 'en_mg_6w', x: -20, y: 1.2, z: -50, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_6e', x: 20, y: 1.2, z: -50, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      {
        id: 'ammo_6',
        kind: 'ammo_crate',
        x: -4,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_6',
        kind: 'medic_crate',
        x: 4,
        y: -1.05,
        z: 30.8,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      },
      {
        id: 'ammo_6_mid',
        kind: 'ammo_crate',
        x: 0,
        y: -0.95,
        z: -6.0,
        label: '[F] Suprimento Avançado (Munição)',
        radius: 2.5,
        active: true
      },
      {
        id: 'bunker_charge_pt',
        kind: 'bunker_charge',
        x: 0,
        y: 0,
        z: -54.0,
        label: '[F] Plantar Carga de Demolição no Bunker',
        radius: 3.4,
        active: false
      }
    ],
    allyCount: 9,
    phases: [
      {
        id: 'op6_p1',
        type: 'tank_assault',
        objectiveText: 'ROMPA O SETOR COM O TANQUE ALIADO',
        objectiveSubtext: 'Acompanhe o blindado aliado até o posto avançado (Z -16)',
        objectiveTarget: { x: 0, z: -16 },
        targetZone: { x: 0, z: -16, radius: 11.0 },
        enemiesToSpawn: 120,
        enemyRoles: ['rifleman', 'assault', 'grenadier'],
        tanksToSpawn: [
          {
            x: 10,
            z: -48,
            heavy: false,
            waypoints: [
              { x: 8, z: -24 },
              { x: 4, z: -8 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -76,
            dropX: -40,
            dropZ: -12,
            passengers: 6,
            roles: ['assault', 'grenadier']
          },
          {
            x: 56,
            z: -76,
            dropX: 40,
            dropZ: -10,
            passengers: 6,
            roles: ['assault', 'rifleman']
          }
        ],
        strafingWaves: 1,
        artilleryRate: 9,
        radioOpening:
          'Tanque Aliado avançando à frente! Rompam a Terra de Ninguém e protejam os flancos!'
      },
      {
        id: 'op6_p2',
        type: 'clear_trench',
        objectiveText: 'TOME A TRINCHEIRA INIMIGA E SILENCIE O BASTIÃO',
        objectiveSubtext: 'Destrua o Tanque Pesado e limpe a guarnição em Z -44',
        objectiveTarget: { x: 0, z: -44 },
        enemiesToSpawn: 155,
        enemyRoles: ['assault', 'grenadier', 'flamethrower', 'officer'],
        tanksToSpawn: [
          {
            x: 8,
            z: -50,
            heavy: true,
            waypoints: [
              { x: -10, z: -48 },
              { x: 10, z: -48 }
            ]
          }
        ],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -78,
            dropX: -42,
            dropZ: -36,
            passengers: 6,
            roles: ['assault', 'flamethrower']
          }
        ],
        artilleryRate: 10,
        radioOpening:
          'Invasão total! Tomem a trincheira fortificada e abatam o tanque de comando!'
      },
      {
        id: 'op6_p3',
        type: 'plant_charge',
        objectiveText: 'PLANTE A CARGA NA ENTRADA DO BUNKER PRINCIPAL',
        objectiveSubtext: 'Aproxime-se da porta do Bunker Principal (Z -54) e segure [F]',
        objectiveTarget: { x: 0, z: -54.0 },
        radioOpening: 'Caminho limpo até o Bunker Principal! Plante a carga de demolição na porta!'
      },
      {
        id: 'op6_p4',
        type: 'detonate_wait',
        objectiveText: 'RECUE PARA LONGE DO BUNKER — DETONAÇÃO EM 8s!',
        objectiveSubtext: 'Afaste-se pelo menos 18m do Bunker antes que ele vá pelos ares',
        objectiveTarget: { x: 0, z: -32 },
        durationSeconds: 8,
        radioOpening: 'CARGA ARMADA! CORRA PARA A TRINCHEIRA, VAI EXPLODIR!'
      }
    ]
  },

  // MODO SOBREVIVÊNCIA — RESISTÊNCIA INFINITA
  {
    id: 99,
    code: 'OP-S',
    title: 'Modo Sobrevivência',
    subtitle: 'Vilarejo Central • Vagas Infinitas',
    briefingSummary:
      'Defenda o vilarejo central e sua trincheira contra ondas intermináveis de infantaria, blindados e carros de reforço. Utilize as 6 construções entráveis, o Tanque Aliado de apoio e os depósitos de munição e curativos para resistir o máximo de vagas possível.',
    objectivesSummary: [
      'Sobreviver ao maior número possível de vagas crescentes',
      'Defender as posições entre a trincheira aliada e as casas do vilarejo',
      'Gerenciar munição, curativos e o apoio do Tanque Aliado'
    ],
    threatsSummary: [
      'Vagas progressivamente mais intensas com granadeiros, oficiais e lança-chamas',
      'Tanques pesados e carros de tropas atacando pelos flancos',
      'Barragens de artilharia e passagens aéreas em vagas avançadas'
    ],
    fieldTip:
      'Alterne entre as janelas das 6 casas e a trincheira principal. Reabasteça nas caixas entre as vagas e use o Tanque Aliado [F] nos momentos críticos.',
    isSurvival: true,
    environment: {
      skyTop: 0x332d2b,
      skyHorizon: 0x825a41,
      fogColor: 0x57483d,
      fogDensity: 0.0115,
      ambientColor: 0xa09184,
      ambientIntensity: 1.15,
      sunColor: 0xffbe82,
      sunIntensity: 1.75,
      sunPosition: [44, 28, -48],
      isNight: false,
      hasRain: false,
      hasFlak: true,
      hasFlares: true,
      hasSearchlights: false
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    allyTankSpawn: { x: 10, z: 25 },
    trenches: makeMainAllyTrench(),
    dugouts: makeStandardDugouts(),
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26, width: 2.5, y1: -1.05, y2: 0 },
      { id: 'ramp_w', x1: -20, z1: 31, x2: -20, z2: 27.2, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 20, z1: 31, x2: 20, z2: 27.2, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeExtendedCraters(),
    ruins: [
      { x: -10, z: 16, w: 3.8, h: 1.5, d: 0.75, rotY: 0.12 },
      { x: 12, z: 15, w: 3.8, h: 1.5, d: 0.75, rotY: -0.14 },
      { x: 0, z: -26, w: 4.6, h: 1.6, d: 0.8, rotY: 0.04 }
    ],
    buildings: [
      { x: -18, z: 12, w: 5.8, h: 3.3, d: 4.8, rotY: 0, enterable: true, kind: 'house' },
      { x: 18, z: 12, w: 5.8, h: 3.3, d: 4.8, rotY: 0, enterable: true, kind: 'house' },
      { x: -30, z: -4, w: 5.4, h: 3.1, d: 4.4, rotY: 0.08, enterable: true, kind: 'shed' },
      { x: 30, z: -4, w: 5.4, h: 3.1, d: 4.4, rotY: -0.08, enterable: true, kind: 'shed' },
      { x: -14, z: -18, w: 6.0, h: 3.3, d: 4.8, rotY: 0, enterable: true, kind: 'outpost' },
      { x: 14, z: -18, w: 6.0, h: 3.3, d: 4.8, rotY: 0, enterable: true, kind: 'house' }
    ] as BuildingSpec[],
    trees: [
      { x: -40, z: 16, height: 4.7 },
      { x: -42, z: -12, height: 4.8 },
      { x: -40, z: -42, height: 4.6 },
      { x: 40, z: 16, height: 4.6 },
      { x: 42, z: -12, height: 4.9 },
      { x: 40, z: -42, height: 4.7 }
    ],
    fences: [
      { x: -28, z: 21, len: 6.0, rotY: 0.08 },
      { x: 28, z: 21, len: 6.0, rotY: -0.08 }
    ],
    barbedWires: [
      { x: -22, z: 22, len: 8, rotY: 0.05 },
      { x: -2, z: 21, len: 8, rotY: 0 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_s', x: -8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [],
    interactables: [
      {
        id: 'ammo_s_trench',
        kind: 'ammo_crate',
        x: -4,
        y: -1.05,
        z: 30.8,
        label: '[F] Reabastecer Munição e Foguetes',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_s_trench',
        kind: 'medic_crate',
        x: 4,
        y: -1.05,
        z: 30.8,
        label: '[F] Caixa Médica (+Curativos)',
        radius: 2.5,
        active: true
      },
      {
        id: 'mg_s',
        kind: 'mg_mount',
        x: -8,
        y: -1.05,
        z: 29.6,
        label: '[F] Assumir Metralhadora Pesada',
        radius: 2.2,
        active: true
      },
      {
        id: 'ammo_s_village',
        kind: 'ammo_crate',
        x: -2,
        y: 0,
        z: -2,
        label: '[F] Depósito de Munição do Vilarejo',
        radius: 2.5,
        active: true
      },
      {
        id: 'med_s_village',
        kind: 'medic_crate',
        x: 2,
        y: 0,
        z: -2,
        label: '[F] Suprimento Médico do Vilarejo',
        radius: 2.5,
        active: true
      }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'surv_loop',
        type: 'survival_endless',
        objectiveText: 'SOBREVIVA ÀS VAGAS INFINITAS',
        objectiveSubtext: 'Defenda o vilarejo e a trincheira contra vagas contínuas de ataque',
        objectiveTarget: { x: 0, z: -8 },
        enemiesToSpawn: 80,
        enemyRoles: ['rifleman', 'assault', 'grenadier', 'flamethrower', 'officer'],
        troopCarsToSpawn: [
          {
            x: -56,
            z: -74,
            dropX: -40,
            dropZ: -10,
            passengers: 6,
            roles: ['assault', 'grenadier']
          },
          {
            x: 56,
            z: -74,
            dropX: 40,
            dropZ: -10,
            passengers: 6,
            roles: ['assault', 'flamethrower']
          }
        ],
        artilleryRate: 11,
        radioOpening:
          'Modo Sobrevivência iniciado! Mantenham o vilarejo central e resistam a cada vaga!'
      }
    ]
  }
];

export function getMissionConfig(id: MissionId): MissionConfig {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}
