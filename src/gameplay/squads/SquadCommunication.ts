import { EventBus } from '../../core/EventBus';
import { clamp, RadioChannel, RadioMessage } from '../../core/types';
import { SimulationWorld } from '../../simulation/SimulationWorld';

const DEGRADED_THRESHOLD = 0.45;

function applyRadioStatic(text: string): string {
  const words = text.split(' ');
  if (words.length <= 3) {
    return `[chiado] ${text} ...ksshh`;
  }
  const mid = Math.floor(words.length / 2);
  words[mid] = '...[chiado]...';
  return words.join(' ');
}

export class SquadCommunication {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;
  private messageCounter = 1;

  constructor(world: SimulationWorld, bus: EventBus) {
    this.world = world;
    this.bus = bus;
  }

  public computeSignalQuality(
    radioOperatorAlive: boolean,
    stormIntensity: number,
    distanceFromHQ: number
  ): number {
    const base = radioOperatorAlive ? 1.0 : 0.48;
    const stormPenalty = clamp(stormIntensity, 0, 1) * 0.42;
    const distancePenalty = clamp(Math.max(0, distanceFromHQ) / 600, 0, 0.34);

    return Math.round(clamp(base - stormPenalty - distancePenalty, 0.1, 1.0) * 1000) / 1000;
  }

  public sendContextualMessage(
    channel: RadioChannel,
    sender: string,
    text: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    const nominalDistance = channel === 'command' ? 180 : channel === 'operational' ? 240 : 45;
    const quality = this.computeSignalQuality(radioOperatorAlive, stormIntensity, nominalDistance);
    const degraded = quality < DEGRADED_THRESHOLD;

    const message: RadioMessage = {
      id: `radio_${this.messageCounter++}`,
      channel,
      sender,
      text: degraded ? applyRadioStatic(text) : text,
      timestamp: timestampSec,
      degraded
    };

    this.world.pushRadioMessage(message);
    this.bus.emit('radio.message.sent', message);
    return message;
  }

  public reportContact(
    sender: string,
    sectorName: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    return this.sendContextualMessage(
      'squad',
      sender,
      `Contato inimigo avistado em ${sectorName}! Procurar cobertura e sustentar fogo!`,
      timestampSec,
      radioOperatorAlive,
      stormIntensity
    );
  }

  public reportFlankOrder(
    sender: string,
    targetLabel: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    return this.sendContextualMessage(
      'squad',
      sender,
      `Iniciando manobra de flanqueamento sobre ${targetLabel}. Metralhador, cubra o avanço!`,
      timestampSec,
      radioOperatorAlive,
      stormIntensity
    );
  }

  public reportWounded(
    sender: string,
    soldierCallsign: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    return this.sendContextualMessage(
      'emergency',
      sender,
      `Homem ferido! ${soldierCallsign} precisa de atendimento médico imediato!`,
      timestampSec,
      radioOperatorAlive,
      stormIntensity
    );
  }

  public reportAntiTankNeed(
    sender: string,
    vehicleDesc: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    return this.sendContextualMessage(
      'emergency',
      sender,
      `Blindado inimigo (${vehicleDesc}) na linha de frente! Especialista antitanque, engajar alvo!`,
      timestampSec,
      radioOperatorAlive,
      stormIntensity
    );
  }

  public reportReinforcements(
    sender: string,
    sectorName: string,
    timestampSec: number,
    radioOperatorAlive = true,
    stormIntensity = 0
  ): RadioMessage {
    return this.sendContextualMessage(
      'command',
      sender,
      `Atenção pelotão, reforços em deslocamento para ${sectorName}. Mantenham a posição.`,
      timestampSec,
      radioOperatorAlive,
      stormIntensity
    );
  }
}
