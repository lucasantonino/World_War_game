import type { EventBus } from '../core/EventBus.ts';
import type {
  BattlefieldEvent,
  BattlefieldEventCategory,
  RadioChannel,
  RadioMessage,
} from '../core/types.ts';
import { createSeededRng } from './BattlefieldState.ts';
import type { SimulationWorld } from './SimulationWorld.ts';

interface EventTemplate {
  key: string;
  category: BattlefieldEventCategory;
  channel: RadioChannel;
  sender: string;
  title: (sectorName: string) => string;
  description: (sectorName: string) => string;
}

const EVENT_TEMPLATES: readonly EventTemplate[] = [
  {
    key: 'combat-counterattack',
    category: 'combat',
    channel: 'command',
    sender: 'Comando de Setor',
    title: (s) => `Contra-ataque inimigo em ${s}`,
    description: (s) =>
      `Patrulhas hostis avançam com apoio de metralhadoras sobre ${s}. Mantenha a linha de tiro.`,
  },
  {
    key: 'combat-flank-probe',
    category: 'combat',
    channel: 'squad',
    sender: 'Observador Avançado',
    title: (s) => `Movimentação no flanco de ${s}`,
    description: (s) =>
      `Infiltração detectada nas imediações de ${s}. Pelotões devem cobrir os acessos laterais.`,
  },
  {
    key: 'logistics-ammo-convoy',
    category: 'logistics',
    channel: 'operational',
    sender: 'Intendência 2º Escalão',
    title: (s) => `Comboio de munição para ${s}`,
    description: (s) =>
      `Suprimentos de cartuchos e granadas despachados para a retaguarda de ${s}.`,
  },
  {
    key: 'logistics-supply-shortage',
    category: 'logistics',
    channel: 'operational',
    sender: 'Logística de Frente',
    title: (s) => `Escassez de suprimentos em ${s}`,
    description: (s) =>
      `Rota de abastecimento sob pressão em ${s}. Economize munição até a chegada do comboio.`,
  },
  {
    key: 'emergency-medevac',
    category: 'emergency',
    channel: 'emergency',
    sender: 'Posto Médico Avançado',
    title: (s) => `Solicitação de evacuação em ${s}`,
    description: (s) =>
      `Pelotão sob fogo intenso em ${s} reporta feridos graves e pede cobertura imediata.`,
  },
  {
    key: 'emergency-artillery-barrage',
    category: 'emergency',
    channel: 'emergency',
    sender: 'Bateria de Apoio',
    title: (s) => `Barragem de artilharia próxima a ${s}`,
    description: (s) =>
      `Impactos pesados registrados ao redor de ${s}. Abrigue o pelotão imediatamente.`,
  },
  {
    key: 'environment-fog',
    category: 'environment',
    channel: 'operational',
    sender: 'Reconhecimento Aéreo',
    title: (s) => `Neblina densa sobre ${s}`,
    description: (s) =>
      `Visibilidade reduzida na zona de ${s}, favorecendo aproximação tática e flanqueamento.`,
  },
  {
    key: 'environment-rain-mud',
    category: 'environment',
    channel: 'command',
    sender: 'Estado-Maior',
    title: (s) => `Chuva e lamaçal em ${s}`,
    description: (s) =>
      `Terreno encharcado em ${s} reduz a mobilidade dos blindados e exige avanço cauteloso.`,
  },
];

/**
 * Gera eventos dinâmicos do campo de batalha em 4 categorias (combate, logística, emergência e ambiente)
 * com controle anti-repetição e transmissão contextual via rádio.
 */
export class BattlefieldEventSystem {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private readonly rng: () => number;
  private readonly templateCooldowns = new Map<string, number>();
  private lastTriggeredAt = -Infinity;
  private minIntervalSec = 18;
  private eventSeq = 0;

  constructor(world: SimulationWorld, bus: EventBus, seed?: number) {
    this.world = world;
    this.bus = bus;
    this.rng = createSeededRng((seed ?? world.seed) + 101);
  }

  public setMinIntervalSec(seconds: number): void {
    this.minIntervalSec = Math.max(1, seconds);
  }

  public update(dt: number, elapsedSec: number): BattlefieldEvent | null {
    if (dt <= 0 || this.world.sectors.length === 0) {
      return null;
    }

    if (elapsedSec - this.lastTriggeredAt < this.minIntervalSec) {
      return null;
    }

    const preferredCategory = this.pickContextualCategory();
    const candidates = EVENT_TEMPLATES.filter((tpl) => {
      const lastUsed = this.templateCooldowns.get(tpl.key) ?? -Infinity;
      return elapsedSec - lastUsed >= 45;
    });

    const pool =
      candidates.filter((tpl) => tpl.category === preferredCategory).length > 0
        ? candidates.filter((tpl) => tpl.category === preferredCategory)
        : candidates.length > 0
          ? candidates
          : Array.from(EVENT_TEMPLATES);

    const chosen = pool[Math.floor(this.rng() * pool.length)];
    const targetSector = this.pickTargetSector(chosen.category);
    if (!targetSector) return null;

    this.eventSeq += 1;
    this.lastTriggeredAt = elapsedSec;
    this.templateCooldowns.set(chosen.key, elapsedSec);

    const evt: BattlefieldEvent = {
      id: `evt-${this.eventSeq}`,
      category: chosen.category,
      title: chosen.title(targetSector.name),
      description: chosen.description(targetSector.name),
      sectorId: targetSector.id,
      triggeredAt: elapsedSec,
      channel: chosen.channel,
    };

    this.world.events.push(evt);
    if (this.world.events.length > 100) {
      this.world.events.shift();
    }
    this.bus.emit('battlefield.event.triggered', evt);

    const radioMsg: RadioMessage = {
      id: `radio-evt-${this.eventSeq}`,
      channel: chosen.channel,
      sender: chosen.sender,
      text: `${evt.title}: ${evt.description}`,
      timestamp: elapsedSec,
      degraded: chosen.category === 'environment' || chosen.category === 'emergency',
    };

    this.world.pushRadioMessage(radioMsg);
    this.bus.emit('radio.message.sent', radioMsg);

    return evt;
  }

  private pickContextualCategory(): BattlefieldEventCategory {
    const contested = this.world.sectors.filter((s) => s.contested);
    if (this.world.reserves.ally <= 8) {
      return 'logistics';
    }
    if (contested.length > 0 && this.rng() < 0.55) {
      return this.rng() < 0.35 ? 'emergency' : 'combat';
    }

    const roll = this.rng();
    if (roll < 0.35) return 'combat';
    if (roll < 0.6) return 'logistics';
    if (roll < 0.8) return 'emergency';
    return 'environment';
  }

  private pickTargetSector(category: BattlefieldEventCategory) {
    const sectors = this.world.sectors;
    if (sectors.length === 0) return null;

    if (category === 'combat' || category === 'emergency') {
      const contested = sectors.filter((s) => s.contested);
      if (contested.length > 0) {
        return contested[Math.floor(this.rng() * contested.length)];
      }
    }

    if (category === 'logistics') {
      const allied = sectors.filter((s) => s.owner === 'ally');
      if (allied.length > 0) {
        return allied[Math.floor(this.rng() * allied.length)];
      }
    }

    return sectors[Math.floor(this.rng() * sectors.length)];
  }
}
