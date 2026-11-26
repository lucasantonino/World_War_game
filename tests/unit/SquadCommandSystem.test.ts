import { describe, expect, it } from 'vitest';
import { EventBus } from '../../src/core/EventBus';
import type { GameEvent, SquadCommandType } from '../../src/core/types';
import { SquadCommandSystem } from '../../src/gameplay/squads/SquadCommandSystem';
import { SquadSystem } from '../../src/gameplay/squads/SquadSystem';
import { SimulationWorld } from '../../src/simulation/SimulationWorld';

describe('SquadCommandSystem & SquadSystem', () => {
  it('cria o pelotão padrão do jogador com 7 NPCs e funções táticas distintas', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const squadSystem = new SquadSystem(world, bus);

    const squad = squadSystem.spawnDefaultPlayerSquad({ x: 0, y: 0, z: 50 });
    const members = world.getSquadMembers(squad.id);

    expect(squad.id).toBe('player_squad');
    expect(squad.isPlayerSquad).toBe(true);
    expect(squad.faction).toBe('ally');
    expect(squad.memberIds).toHaveLength(7);
    expect(members).toHaveLength(7);
    expect(members.every((m) => m.alive && m.faction === 'ally')).toBe(true);
    expect(members.map((m) => m.role)).toEqual([
      'rifleman',
      'rifleman',
      'mg_gunner',
      'antitank',
      'medic',
      'grenadier',
      'radio',
    ]);
  });

  it('emite as 4 ordens principais (advance, hold, flank, regroup) via EventBus e atualiza estado', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const squadSystem = new SquadSystem(world, bus);
    const commandSystem = new SquadCommandSystem(world, bus);

    const squad = squadSystem.spawnDefaultPlayerSquad({ x: 0, y: 0, z: 60 });
    const emitted: Array<Extract<GameEvent, { type: 'squad.command.issued' }>> = [];
    bus.on('squad.command.issued', (evt) => emitted.push(evt));

    const commands: Array<{ type: SquadCommandType; expectedState: string; target: { x: number; y: number; z: number } }> = [
      { type: 'advance', expectedState: 'moving', target: { x: 0, y: 0, z: 20 } },
      { type: 'hold', expectedState: 'defending', target: { x: 5, y: 0, z: 20 } },
      { type: 'flank', expectedState: 'moving', target: { x: -25, y: 0, z: 10 } },
      { type: 'regroup', expectedState: 'reorganizing', target: { x: 0, y: 0, z: 45 } },
    ];

    commands.forEach((entry, index) => {
      const issued = commandSystem.issueCommand(
        squad.id,
        entry.type,
        entry.target,
        undefined,
        index + 1
      );
      expect(issued).not.toBeNull();
      expect(issued?.type).toBe(entry.type);
      expect(squad.activeCommand?.type).toBe(entry.type);
      expect(squad.state).toBe(entry.expectedState);
      expect(squad.targetPosition).toEqual(entry.target);
    });

    expect(emitted).toHaveLength(4);
    expect(emitted.map((e) => e.payload.type)).toEqual([
      'advance',
      'hold',
      'flank',
      'regroup',
    ]);

    expect(commandSystem.issueCommand('non-existent', 'hold')).toBeNull();
  });

  it('respeita a hierarquia de prioridades onde sobrevivência sob fogo pesado supera avanço cego', () => {
    const world = new SimulationWorld();
    const bus = new EventBus();
    const squadSystem = new SquadSystem(world, bus);
    const commandSystem = new SquadCommandSystem(world, bus);

    const squad = squadSystem.spawnDefaultPlayerSquad({ x: 0, y: 0, z: 40 });
    commandSystem.issueCommand(squad.id, 'advance', { x: 0, y: 0, z: 0 }, undefined, 1);

    const rifleman = world.getSquadMembers(squad.id)[0];

    // 1. Ordem ativa com ameaça distante e sem fogo pesado -> execute_order
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, false, 45)).toBe(
      'execute_order'
    );

    // 2. Ameaça muito próxima (<= 18m) sem crise de sobrevivência -> engage_near supera execute_order
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, false, 12)).toBe(
      'engage_near'
    );

    // 3. Sobrevivência sob fogo pesado com supressão elevada (>= 40) supera advance e engage_near
    rifleman.suppression = 45;
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, true, 12)).toBe('survive');
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, true, 50)).toBe('survive');

    // 4. Saúde crítica ou ferimento grave também força survive
    rifleman.suppression = 0;
    rifleman.health = 28;
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, false, 60)).toBe('survive');

    // 5. Sem ordem ativa: médico / moral baixa -> protect_ally; situação calma -> reorganize
    rifleman.health = 100;
    squad.activeCommand = null;
    squad.morale = 40;
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, false, 80)).toBe(
      'protect_ally'
    );

    squad.morale = 90;
    expect(commandSystem.evaluateSoldierPriority(rifleman, squad, false, 80)).toBe(
      'reorganize'
    );
  });
});
