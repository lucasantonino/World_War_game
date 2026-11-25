import { Crater, MissionConfig, MissionId, TrenchSegment } from '../types';

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
      z2: 40,
      width: 2.1,
      depth: 1.05,
      parapetSide: 'none',
      hasSandbags: false,
      duckboards: true,
      faction: 'ally'
    }
  ];
}

function makeStandardCraters(): Crater[] {
  return [
    { x: -18, z: 18, radius: 2.6, depth: 0.9 },
    { x: -5, z: 16, radius: 2.9, depth: 1.0 },
    { x: 10, z: 17, radius: 2.5, depth: 0.85 },
    { x: 24, z: 14, radius: 3.1, depth: 1.05 },
    { x: -24, z: 6, radius: 3.2, depth: 1.1 },
    { x: -9, z: 4, radius: 2.8, depth: 0.95 },
    { x: 5, z: 3, radius: 3.3, depth: 1.15 },
    { x: 19, z: 1, radius: 2.7, depth: 0.9 },
    { x: -15, z: -8, radius: 3.0, depth: 1.05 },
    { x: 0, z: -10, radius: 3.4, depth: 1.2 },
    { x: 14, z: -12, radius: 2.9, depth: 1.0 },
    { x: -27, z: -16, radius: 2.7, depth: 0.9 }
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
      'A neblina da madrugada mal se dissipou e batedores confirmam infantaria inimiga cruzando a Terra de Ninguém. Mantenha a cabeça abaixo do parapeito sob fogo cruzado, reaja nas brechas e prepare o lançador antitanque para a vanguarda blindada.',
    objectivesSummary: [
      'Conter a primeira vaga de infantaria e ninhos de metralhadora',
      'Sobreviver à barragem de artilharia e granadeiros na trincheira',
      'Destruir o tanque leve de escolta e repelir o assalto final'
    ],
    threatsSummary: [
      'Fogo de supressão e atiradores inimigos — ficar exposto é morte rápida',
      'Granadeiros inimigos lançando explosivos para dentro da trincheira',
      'Tanque Leve rompendo arame farpado na fase final'
    ],
    fieldTip:
      'Use [C] para se abaixar completamente dentro da trincheira. Espie com [Q]/[E] ou [Botão Direito] para mirar com precisão. Se sangrar, segure [H] na cobertura.',
    environment: {
      skyTop: 0x3b3532,
      skyHorizon: 0x8e5d3b,
      fogColor: 0x5c4c3f,
      fogDensity: 0.0155,
      ambientColor: 0xa09184,
      ambientIntensity: 1.15,
      sunColor: 0xffb878,
      sunIntensity: 1.85,
      sunPosition: [38, 22, -45],
      isNight: false,
      hasRain: false,
      hasFlak: false,
      hasFlares: true,
      hasSearchlights: false
    },
    playerSpawn: { x: -2, z: 30, yaw: 0 },
    trenches: makeMainAllyTrench(),
    dugouts: [
      { id: 'dug_west', x: -16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' },
      { id: 'dug_east', x: 16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' }
    ],
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 22, z1: 31.2, x2: 22, z2: 27.6, width: 2.0, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeStandardCraters(),
    ruins: [
      { x: -14, z: 12, w: 3.6, h: 1.45, d: 0.7, rotY: 0.15 },
      { x: 13, z: 9, w: 4.2, h: 1.6, d: 0.75, rotY: -0.2 },
      { x: -3, z: -4, w: 4.8, h: 1.5, d: 0.8, rotY: 0.08 }
    ],
    barbedWires: [
      { x: -18, z: 23, len: 10, rotY: 0.08 },
      { x: -2, z: 22, len: 9, rotY: -0.05 },
      { x: 16, z: 23, len: 11, rotY: -0.08 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_1', x: 8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [{ id: 'en_mg_1', x: -18, y: 0.35, z: -26, yaw: Math.PI, faction: 'enemy' }],
    interactables: [
      { id: 'ammo_1', kind: 'ammo_crate', x: -6, y: -1.05, z: 30.8, label: '[F] Reabastecer Munição e Foguetes', radius: 2.4, active: true },
      { id: 'med_1', kind: 'medic_crate', x: 5, y: -1.05, z: 31.1, label: '[F] Caixa Médica (+Curativos)', radius: 2.4, active: true },
      { id: 'mg_1', kind: 'mg_mount', x: 8, y: -1.05, z: 29.6, label: '[F] Assumir Metralhadora Pesada', radius: 2.2, active: true }
    ],
    allyCount: 7,
    phases: [
      {
        id: 'op1_p1',
        type: 'survive_wave',
        objectiveText: 'SEGURE A TRINCHEIRA — PRIMEIRA VAGA',
        objectiveSubtext: 'Elimine as vagas de vanguarda inimiga que avançam pela neblina',
        objectiveTarget: { x: 0, z: -12 },
        enemiesToSpawn: 95,
        enemyRoles: ['rifleman', 'rifleman', 'assault'],
        artilleryRate: 12,
        radioOpening: 'Posto 2 na escuta! Vultos incontáveis na Terra de Ninguém! Abaixo do parapeito!'
      },
      {
        id: 'op1_p2',
        type: 'survive_wave',
        objectiveText: 'CONTER O ASSALTO E GRANADEIROS',
        objectiveSubtext: 'Atenção às granadas lançadas para dentro da vala',
        objectiveTarget: { x: -4, z: -8 },
        enemiesToSpawn: 130,
        enemyRoles: ['rifleman', 'assault', 'grenadier', 'rifleman'],
        artilleryRate: 5.5,
        radioOpening: 'Artilharia inimiga ajustando mira! Cuidado com os granadeiros nos flancos!'
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
            z: -36,
            heavy: false,
            waypoints: [
              { x: 4, z: -12 },
              { x: 2, z: 8 },
              { x: 6, z: 22 }
            ]
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
      'Sob chuva fria e lama espessa, uma ponta de lança blindada avança em formação cerrada para esmagar nossas defesas. Use as trincheiras e muros em ruínas para flanquear os tanques com a Bazuca AT-43 enquanto a infantaria tenta cercar você.',
    objectivesSummary: [
      'Interceptar a primeira ponta blindada na Terra de Ninguém',
      'Destruir todos os 3 Tanques Pesados antes que rompam a retaguarda',
      'Neutralizar a escolta remanescente de infantaria'
    ],
    threatsSummary: [
      'Canhões de 75mm que destroem sacos de areia e causam surdez/tinnitus',
      'Metralhadoras coaxiais varrendo qualquer soldado em pé por mais de 1 segundo',
      'Infantaria de assalto aproveitando a sombra dos blindados para invadir a vala'
    ],
    fieldTip:
      'Tiros de fuzil e SMG ricocheteiam na blindagem. Acerte a traseira vermelha ou as laterais com a Bazuca [3] e recarregue na cobertura!',
    environment: {
      skyTop: 0x2b3033,
      skyHorizon: 0x5c6366,
      fogColor: 0x454b4d,
      fogDensity: 0.0145,
      ambientColor: 0x92999b,
      ambientIntensity: 1.1,
      sunColor: 0xcfd6d8,
      sunIntensity: 1.55,
      sunPosition: [-28, 34, -22],
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
    dugouts: [
      { id: 'dug_west', x: -16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' },
      { id: 'dug_east', x: 16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' }
    ],
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_w', x1: -22, z1: 31.2, x2: -22, z2: 27.5, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeStandardCraters(),
    ruins: [
      { x: -16, z: 16, w: 4.4, h: 1.7, d: 0.8, rotY: 0.25 },
      { x: 15, z: 15, w: 4.6, h: 1.7, d: 0.8, rotY: -0.2 },
      { x: 0, z: 1, w: 5.0, h: 1.65, d: 0.85, rotY: 0.05 },
      { x: -20, z: -6, w: 3.8, h: 1.5, d: 0.75, rotY: -0.15 },
      { x: 20, z: -8, w: 3.8, h: 1.5, d: 0.75, rotY: 0.18 }
    ],
    barbedWires: [
      { x: -24, z: 22, len: 8, rotY: 0.05 },
      { x: 24, z: 22, len: 8, rotY: -0.05 }
    ],
    bunkers: [],
    allyEmplacements: [],
    enemyEmplacements: [
      { id: 'en_mg_2a', x: -24, y: 0.35, z: -28, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_2b', x: 24, y: 0.35, z: -28, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      { id: 'ammo_2w', kind: 'ammo_crate', x: -12, y: -1.05, z: 30.8, label: '[F] Reabastecer Munição e Foguetes', radius: 2.6, active: true },
      { id: 'ammo_2e', kind: 'ammo_crate', x: 12, y: -1.05, z: 30.8, label: '[F] Reabastecer Munição e Foguetes', radius: 2.6, active: true },
      { id: 'med_2', kind: 'medic_crate', x: 0, y: -1.05, z: 32.8, label: '[F] Caixa Médica (+Curativos)', radius: 2.5, active: true }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op2_p1',
        type: 'destroy_tanks',
        objectiveText: 'DESTRUA O TANQUE DE VANGUARDA',
        objectiveSubtext: 'Acerte os flancos ou retaguarda com a Bazuca [3]',
        objectiveTarget: { x: -8, z: 2 },
        enemiesToSpawn: 100,
        enemyRoles: ['rifleman', 'assault', 'grenadier'],
        tanksToSpawn: [
          {
            x: -10,
            z: -38,
            heavy: true,
            waypoints: [
              { x: -10, z: -8 },
              { x: -8, z: 12 },
              { x: -6, z: 24 }
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
        objectiveTarget: { x: 8, z: -2 },
        enemiesToSpawn: 140,
        enemyRoles: ['assault', 'rifleman', 'grenadier', 'assault'],
        tanksToSpawn: [
          {
            x: -16,
            z: -42,
            heavy: true,
            waypoints: [
              { x: -15, z: -10 },
              { x: -12, z: 14 }
            ]
          },
          {
            x: 16,
            z: -42,
            heavy: true,
            waypoints: [
              { x: 14, z: -8 },
              { x: 10, z: 16 }
            ]
          }
        ],
        artilleryRate: 7,
        radioOpening: 'DOIS TANQUES PESADOS AVANÇANDO PELOS FLANCOS! Não deixe que cheguem à borda!'
      },
      {
        id: 'op2_p3',
        type: 'survive_wave',
        objectiveText: 'LIQUIDE A INFANTARIA DE ASSALTO',
        objectiveSubtext: 'Sem cobertura blindada, eles vêm em massa sobre a trincheira',
        objectiveTarget: { x: 0, z: 5 },
        enemiesToSpawn: 120,
        enemyRoles: ['assault', 'grenadier', 'assault'],
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
      'Esquadrões de bombardeiros pesados foram detectados no radar. Sempre que a sirene soar, corra imediatamente para os Abrigos Subterrâneos (Dugouts) na parede traseira da trincheira — e saia logo após as bombas para impedir que a infantaria invada pelos vãos destruídos.',
    objectivesSummary: [
      'Sobreviver às vagas de bombardeio aéreo dentro dos Abrigos',
      'Repelir as tropas de choque e blindados após cada bombardeio',
      'Ativar o Rádio de Campo e resistir 25s pelo contra-ataque'
    ],
    threatsSummary: [
      'Tapete de bombas aéreas — mortal fora do teto reforçado dos Abrigos',
      'Bombardeio abre novas crateras e destrói seus sacos de areia de proteção',
      'Inimigos avançam imediatamente aproveitando a fumaça pós-explosão'
    ],
    fieldTip:
      'Procure as placas [ABRIGO] e a luz âmbar dentro da trincheira traseira quando a sirene tocar. Somente o teto de toras salva de uma bomba direta.',
    environment: {
      skyTop: 0x321c1c,
      skyHorizon: 0x9b3e2b,
      fogColor: 0x522e28,
      fogDensity: 0.0135,
      ambientColor: 0xa28179,
      ambientIntensity: 1.05,
      sunColor: 0xff8357,
      sunIntensity: 1.75,
      sunPosition: [44, 18, -32],
      isNight: false,
      hasRain: false,
      hasFlak: true,
      hasFlares: false,
      hasSearchlights: false
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    trenches: makeMainAllyTrench(),
    dugouts: [
      { id: 'dug_west', x: -16, z: 35.5, width: 5.2, depth: 4.4, floorY: -1.05, ceilingY: 0.55, openSide: 'north' },
      { id: 'dug_east', x: 16, z: 35.5, width: 5.2, depth: 4.4, floorY: -1.05, ceilingY: 0.55, openSide: 'north' }
    ],
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26.2, width: 2.2, y1: -1.05, y2: 0 }
    ],
    initialCraters: makeStandardCraters(),
    ruins: [
      { x: -12, z: 8, w: 3.8, h: 1.5, d: 0.75, rotY: 0.1 },
      { x: 12, z: 10, w: 3.8, h: 1.5, d: 0.75, rotY: -0.15 }
    ],
    barbedWires: [
      { x: -16, z: 23, len: 10, rotY: 0 },
      { x: 16, z: 23, len: 10, rotY: 0 }
    ],
    bunkers: [],
    allyEmplacements: [{ id: 'ally_mg_3', x: -8, y: 0.35, z: 28.9, yaw: 0, faction: 'ally' }],
    enemyEmplacements: [{ id: 'en_mg_3', x: 18, y: 0.35, z: -26, yaw: Math.PI, faction: 'enemy' }],
    interactables: [
      { id: 'ammo_3', kind: 'ammo_crate', x: -3, y: -1.05, z: 31, label: '[F] Reabastecer Munição e Foguetes', radius: 2.5, active: true },
      { id: 'med_3', kind: 'medic_crate', x: 4, y: -1.05, z: 31, label: '[F] Caixa Médica (+Curativos)', radius: 2.5, active: true },
      { id: 'mg_3', kind: 'mg_mount', x: -8, y: -1.05, z: 29.6, label: '[F] Assumir Metralhadora Pesada', radius: 2.2, active: true },
      { id: 'radio_3', kind: 'radio', x: 0, y: -1.05, z: 38.5, label: '[F] Chamar Contra-Ataque pelo Rádio', radius: 2.5, active: false }
    ],
    allyCount: 7,
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
        objectiveSubtext: 'Sobreviva às bombas no abrigo e destrua o tanque + assalto seguinte',
        objectiveTarget: { x: 16, z: 35 },
        bomberWaves: 2,
        enemiesToSpawn: 130,
        enemyRoles: ['assault', 'grenadier', 'rifleman'],
        tanksToSpawn: [
          {
            x: 0,
            z: -38,
            heavy: false,
            waypoints: [
              { x: 0, z: -10 },
              { x: 2, z: 14 }
            ]
          }
        ],
        radioOpening: 'Mais bombardeiros a caminho! Depois deles vem blindado aproveitando as crateras!'
      },
      {
        id: 'op3_p3',
        type: 'activate_radio',
        objectiveText: 'ATIVE O RÁDIO DE CAMPO NA VALA TRASEIRA',
        objectiveSubtext: 'Desça pela trincheira central até (Z +38) e pressione [F]',
        objectiveTarget: { x: 0, z: 38.5 },
        radioOpening: 'Nossas defesas estão em ruínas! Vá até o rádio na sapata traseira e peça apoio!'
      },
      {
        id: 'op3_p4',
        type: 'hold_timer',
        objectiveText: 'RESISTA ATÉ O APOIO CHEGAR (25s)',
        objectiveSubtext: 'Segure a linha contra a maré desesperada de assalto inimigo',
        objectiveTarget: { x: 0, z: 18 },
        durationSeconds: 25,
        enemiesToSpawn: 150,
        enemyRoles: ['assault', 'assault', 'grenadier', 'rifleman'],
        artilleryRate: 5,
        radioOpening: 'Sinal confirmado! 25 segundos para nossa artilharia varrer o setor! Aguentem firme!'
      }
    ]
  },

  // OPERAÇÃO IV — ASSALTO AO BASTIÃO
  {
    id: 3,
    code: 'OP-04',
    title: 'Assalto ao Bastião',
    subtitle: 'Setor Ômega (Noite) • Invadir o Bunker Principal',
    briefingSummary:
      'É hora de cruzar a Terra de Ninguém sob a escuridão rasgada por sinalizadores e holofotes. Rasteje de cratera em cratera, use granadas e Bazuca para silenciar as casamatas de metralhadora, tome a trincheira inimiga e plante a carga explosiva no Bunker Principal.',
    objectivesSummary: [
      'Atravessar a Terra de Ninguém usando as crateras como cobertura',
      'Tomar a trincheira avançada e destruir as casamatas + tanque de comando',
      'Plantar a carga explosiva na porta do Bunker Principal e recuar!'
    ],
    threatsSummary: [
      'Duas casamatas de metralhadora varrendo todo terreno plano sem cobertura',
      'Holofotes e sinalizadores que expõem avanços descuidados',
      'Tanque de Comando guardando o pátio do Bastião'
    ],
    fieldTip:
      'Nunca corra em linha reta pelo terreno plano! Mova-se de cratera em cratera agachado, espere a pausa das metralhadoras e destrua as casamatas com a Bazuca [3].',
    environment: {
      skyTop: 0x0b1019,
      skyHorizon: 0x262936,
      fogColor: 0x181c26,
      fogDensity: 0.014,
      ambientColor: 0x5c6982,
      ambientIntensity: 0.95,
      sunColor: 0x9cb4db,
      sunIntensity: 1.05,
      sunPosition: [-20, 36, 15],
      isNight: true,
      hasRain: false,
      hasFlak: false,
      hasFlares: true,
      hasSearchlights: true
    },
    playerSpawn: { x: 0, z: 30, yaw: 0 },
    trenches: [
      ...makeMainAllyTrench(),
      {
        id: 'mid_crater_trench',
        x1: -10,
        z1: 2,
        x2: 10,
        z2: 0,
        width: 2.3,
        depth: 0.95,
        parapetSide: 'north',
        hasSandbags: true,
        duckboards: false,
        faction: 'ally'
      },
      {
        id: 'enemy_front_trench',
        x1: -28,
        z1: -25,
        x2: 28,
        z2: -25,
        width: 2.6,
        depth: 1.0,
        parapetSide: 'south',
        hasSandbags: true,
        duckboards: true,
        faction: 'enemy'
      }
    ],
    dugouts: [
      { id: 'dug_west', x: -16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' },
      { id: 'dug_east', x: 16, z: 35.5, width: 5.0, depth: 4.2, floorY: -1.05, ceilingY: 0.55, openSide: 'north' }
    ],
    ramps: [
      { id: 'ramp_c', x1: 0, z1: 30, x2: 0, z2: 26, width: 2.6, y1: -1.05, y2: 0 },
      { id: 'ramp_e', x1: 16, z1: 30.5, x2: 16, z2: 26.5, width: 2.2, y1: -1.05, y2: 0 },
      { id: 'ramp_en_c', x1: 0, z1: -25, x2: 0, z2: -21, width: 2.4, y1: -1.0, y2: 0 },
      { id: 'ramp_en_b', x1: 0, z1: -25, x2: 0, z2: -29, width: 2.4, y1: -1.0, y2: 0 }
    ],
    initialCraters: [
      ...makeStandardCraters(),
      { x: -7, z: 20, radius: 3.1, depth: 1.15 },
      { x: 6, z: 14, radius: 3.2, depth: 1.15 },
      { x: -12, z: -3, radius: 3.3, depth: 1.2 },
      { x: 11, z: -13, radius: 3.2, depth: 1.15 },
      { x: -4, z: -17, radius: 3.0, depth: 1.1 }
    ],
    ruins: [
      { x: -8, z: 10, w: 4.0, h: 1.5, d: 0.75, rotY: 0.1 },
      { x: 9, z: -6, w: 4.2, h: 1.6, d: 0.75, rotY: -0.14 }
    ],
    barbedWires: [
      { x: -14, z: -19, len: 10, rotY: 0 },
      { x: 14, z: -19, len: 10, rotY: 0 }
    ],
    bunkers: [
      { id: 'bunker_mg_w', kind: 'bunker_mg', x: -16, z: -31, w: 4.6, h: 2.4, d: 3.8, hp: 140 },
      { id: 'bunker_mg_e', kind: 'bunker_mg', x: 16, z: -31, w: 4.6, h: 2.4, d: 3.8, hp: 140 },
      { id: 'bunker_main', kind: 'bunker_main', x: 0, z: -37, w: 9.0, h: 3.6, d: 6.5, hp: 9999 }
    ],
    allyEmplacements: [],
    enemyEmplacements: [
      { id: 'en_mg_w', x: -16, y: 1.15, z: -29, yaw: Math.PI, faction: 'enemy' },
      { id: 'en_mg_e', x: 16, y: 1.15, z: -29, yaw: Math.PI, faction: 'enemy' }
    ],
    interactables: [
      { id: 'ammo_4', kind: 'ammo_crate', x: -4, y: -1.05, z: 30.8, label: '[F] Reabastecer Munição e Foguetes', radius: 2.5, active: true },
      { id: 'med_4', kind: 'medic_crate', x: 4, y: -1.05, z: 30.8, label: '[F] Caixa Médica (+Curativos)', radius: 2.5, active: true },
      { id: 'ammo_4_mid', kind: 'ammo_crate', x: 0, y: -0.95, z: 1.0, label: '[F] Suprimento Avançado (Munição)', radius: 2.4, active: true },
      { id: 'bunker_charge_pt', kind: 'bunker_charge', x: 0, y: 0, z: -33.2, label: '[F] Plantar Carga de Demolição no Bunker', radius: 3.2, active: false }
    ],
    allyCount: 8,
    phases: [
      {
        id: 'op4_p1',
        type: 'reach_zone',
        objectiveText: 'CRUZE A TERRA DE NINGUÉM DE CRATERA EM CRATERA',
        objectiveSubtext: 'Chegue ao posto avançado no centro do campo (Z 0)',
        objectiveTarget: { x: 0, z: 1 },
        targetZone: { x: 0, z: 1, radius: 7.5 },
        enemiesToSpawn: 110,
        enemyRoles: ['rifleman', 'assault'],
        artilleryRate: 8,
        radioOpening: 'Sinalizadores no alto! Use as crateras e a vala central — não fique em terreno plano!'
      },
      {
        id: 'op4_p2',
        type: 'clear_trench',
        objectiveText: 'TOME A TRINCHEIRA INIMIGA E SILENCIE O BASTIÃO',
        objectiveSubtext: 'Destrua o Tanque de Comando e neutralize a guarnição inimiga',
        objectiveTarget: { x: 0, z: -25 },
        enemiesToSpawn: 150,
        enemyRoles: ['assault', 'grenadier', 'rifleman', 'officer'],
        tanksToSpawn: [
          {
            x: 8,
            z: -32,
            heavy: true,
            waypoints: [
              { x: -8, z: -29 },
              { x: 10, z: -29 }
            ]
          }
        ],
        artilleryRate: 10,
        radioOpening: 'Invasão! Tomem a trincheira deles e abatam aquele tanque de comando!'
      },
      {
        id: 'op4_p3',
        type: 'plant_charge',
        objectiveText: 'PLANTE A CARGA NA ENTRADA DO BUNKER PRINCIPAL',
        objectiveSubtext: 'Aproxime-se do grande bunker de concreto (Z -33) e segure [F]',
        objectiveTarget: { x: 0, z: -33.2 },
        radioOpening: 'Caminho limpo até o Bunker! Plante a carga de demolição na porta!'
      },
      {
        id: 'op4_p4',
        type: 'detonate_wait',
        objectiveText: 'RECUE PARA A TRINCHEIRA — DETONAÇÃO EM 8s!',
        objectiveSubtext: 'Afaste-se pelo menos 18m do Bunker antes que ele vá pelos ares',
        objectiveTarget: { x: 0, z: -15 },
        durationSeconds: 8,
        radioOpening: 'CARGA ARMADA! CORRA PARA TRÁS, VAI EXPLODIR!'
      }
    ]
  }
];

export function getMissionConfig(id: MissionId): MissionConfig {
  return MISSIONS[id] ?? MISSIONS[0];
}
