import { EventBus } from '../../core/EventBus';
import {
  SoldierProfile,
  SquadCommand,
  SquadCommandType,
  SquadState,
  SquadUnit,
  Vec3
} from '../../core/types';
import { SimulationWorld } from '../../simulation/SimulationWorld';

export type SoldierPriorityLevel =
  | 'survive'
  | 'engage_near'
  | 'execute_order'
  | 'protect_ally'
  | 'reorganize';

const COMMAND_LABELS_PT_BR: Record<SquadCommandType, string> = {
  advance: 'Avançar',
  hold: 'Manter Posição',
  flank: 'Flanquear',
  regroup: 'Reagrupar',
  focus_target: 'Focar Alvo',
  attack_vehicle: 'Atacar Blindado',
  cover_entry: 'Cobrir Entrada',
  defend_position: 'Defender Posição',
  rescue_wounded: 'Resgatar Ferido',
  request_ammo: 'Solicitar Munição'
};

function commandToSquadState(type: SquadCommandType): SquadState {
  switch (type) {
    case 'advance':
    case 'flank':
      return 'moving';
    case 'hold':
    case 'defend_position':
    case 'cover_entry':
      return 'defending';
    case 'focus_target':
    case 'attack_vehicle':
      return 'engaging';
    case 'regroup':
    case 'rescue_wounded':
    case 'request_ammo':
      return 'reorganizing';
  }
}

export class SquadCommandSystem {
  private readonly world: SimulationWorld;
  private readonly bus: EventBus;

  constructor(world: SimulationWorld, bus: EventBus) {
    this.world = world;
    this.bus = bus;
  }

  public issueCommand(
    squadId: string,
    type: SquadCommandType,
    targetPosition?: Vec3,
    targetEntityId?: string,
    nowSec = 0
  ): SquadCommand | null {
    const squad = this.world.squads.get(squadId);
    if (!squad) {
      return null;
    }

    const members = this.world.getSquadMembers(squadId);
    const hasAliveMembers = members.some((m) => m.alive && m.state !== 'dead');
    if (!hasAliveMembers) {
      return null;
    }

    const command: SquadCommand = {
      squadId,
      type,
      targetPosition: targetPosition ? { ...targetPosition } : undefined,
      targetEntityId,
      issuedAt: nowSec
    };

    squad.activeCommand = command;
    if (targetPosition) {
      squad.targetPosition = { ...targetPosition };
    }
    if (squad.state !== 'retreating' && squad.state !== 'disabled') {
      squad.state = commandToSquadState(type);
    }

    this.bus.emit('squad.command.issued', command);
    return command;
  }

  public evaluateSoldierPriority(
    soldier: SoldierProfile,
    squad: SquadUnit,
    underHeavyFire: boolean,
    nearestThreatDist: number
  ): SoldierPriorityLevel {
    // 1. Sobrevivência imediata
    if (
      !soldier.alive ||
      soldier.state === 'dead' ||
      soldier.state === 'incapacitated' ||
      soldier.woundLevel === 'severe' ||
      soldier.woundLevel === 'incapacitated' ||
      soldier.suppression >= 65 ||
      soldier.health <= 30 ||
      squad.state === 'retreating' ||
      (underHeavyFire && (soldier.suppression >= 40 || soldier.health < 65))
    ) {
      return 'survive';
    }

    // 2. Resposta a ameaças próximas
    if (nearestThreatDist <= 18) {
      return 'engage_near';
    }

    // 3. Cumprimento da ordem recebida
    if (squad.activeCommand !== null) {
      return 'execute_order';
    }

    // 4. Proteção dos companheiros
    if (
      soldier.role === 'medic' ||
      squad.state === 'suppressed' ||
      squad.morale < 55 ||
      nearestThreatDist <= 40
    ) {
      return 'protect_ally';
    }

    // 5. Reorganização do grupo
    return 'reorganize';
  }

  public getCommandLabelPtBr(type: SquadCommandType): string {
    return COMMAND_LABELS_PT_BR[type];
  }
}
