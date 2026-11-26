import { describe, expect, it } from 'vitest';
import { EventBus } from '../../src/core/EventBus';
import type { GameEvent } from '../../src/core/types';
import { VehicleDamageSystem } from '../../src/gameplay/vehicles/VehicleDamage';

describe('VehicleDamageSystem', () => {
  it('imobiliza o chassi ao destruir as esteiras (tracks) mantendo a torre operacional', () => {
    const bus = new EventBus();
    const vehicleDamage = new VehicleDamageSystem(bus);
    const tank = vehicleDamage.createTankState(false);

    const events: GameEvent[] = [];
    bus.on('vehicle.subsystem.damaged', (e) => events.push(e));
    bus.on('vehicle.disabled', (e) => events.push(e));

    expect(vehicleDamage.canMove(tank)).toBe(true);
    expect(vehicleDamage.canRotateTurret(tank)).toBe(true);

    // Aplica disparos de canhão/explosão diretamente nas esteiras
    for (let i = 0; i < 3 && tank.tracksHp > 0; i++) {
      vehicleDamage.applyHit('tank-1', 'enemy', tank, {
        sourceId: 'at-1',
        targetId: 'tank-1',
        damageType: 'shell',
        baseDamage: 120,
        impactPosition: { x: 0, y: 0.4, z: 0 },
        hitZone: 'tracks',
        distance: 40,
        material: 'steel_heavy',
      });
    }

    expect(tank.tracksHp).toBe(0);
    expect(tank.hullHp).toBeGreaterThan(0);
    expect(tank.turretHp).toBeGreaterThan(0);
    expect(tank.state).toBe('disabled');
    expect(vehicleDamage.canMove(tank)).toBe(false);
    expect(vehicleDamage.canRotateTurret(tank)).toBe(true);
    expect(vehicleDamage.getTurretSpeedMult(tank)).toBe(1);

    expect(events.some((e) => e.type === 'vehicle.subsystem.damaged' && e.payload.subsystem === 'tracks')).toBe(true);
    expect(events).toContainEqual({
      type: 'vehicle.disabled',
      payload: { vehicleId: 'tank-1', faction: 'enemy' },
    });
  });

  it('reduz velocidade da torre ao danificar turret e impede rotação ao zerar turretHp', () => {
    const bus = new EventBus();
    const vehicleDamage = new VehicleDamageSystem(bus);
    const tank = vehicleDamage.createTankState(false);
    const subsystemEvents: Array<Extract<GameEvent, { type: 'vehicle.subsystem.damaged' }>> = [];
    bus.on('vehicle.subsystem.damaged', (e) => subsystemEvents.push(e));

    expect(vehicleDamage.getTurretSpeedMult(tank)).toBe(1);

    // baseDamage: 70 em turret resulta em finalDamage < 45 -> subsistema 'turret'
    vehicleDamage.applyHit('tank-2', 'enemy', tank, {
      sourceId: 'at-1',
      targetId: 'tank-2',
      damageType: 'shell',
      baseDamage: 70,
      impactPosition: { x: 0, y: 2, z: 0 },
      hitZone: 'turret',
      distance: 35,
      material: 'steel_heavy',
    });

    expect(tank.turretHp).toBeLessThan(160);
    expect(tank.turretHp).toBeGreaterThan(0);
    const damagedSpeed = vehicleDamage.getTurretSpeedMult(tank);
    expect(damagedSpeed).toBeLessThan(1);
    expect(damagedSpeed).toBeGreaterThan(0.35);
    expect(subsystemEvents.some((e) => e.payload.subsystem === 'turret')).toBe(true);

    // Mais acertos até destruir a torre
    for (let i = 0; i < 6 && tank.turretHp > 0; i++) {
      vehicleDamage.applyHit('tank-2', 'enemy', tank, {
        sourceId: 'at-1',
        targetId: 'tank-2',
        damageType: 'shell',
        baseDamage: 70,
        impactPosition: { x: 0, y: 2, z: 0 },
        hitZone: 'turret',
        distance: 35,
        material: 'steel_heavy',
      });
    }

    expect(tank.turretHp).toBe(0);
    expect(vehicleDamage.canRotateTurret(tank)).toBe(false);
    expect(vehicleDamage.getTurretSpeedMult(tank)).toBe(0);
  });

  it('muda estado para destroyed quando hullHp <= 0 e emite eventos no EventBus', () => {
    const bus = new EventBus();
    const vehicleDamage = new VehicleDamageSystem(bus);
    const tank = vehicleDamage.createTankState(false);
    const disabledEvents: Array<Extract<GameEvent, { type: 'vehicle.disabled' }>> = [];
    const subsystemEvents: Array<Extract<GameEvent, { type: 'vehicle.subsystem.damaged' }>> = [];
    bus.on('vehicle.disabled', (e) => disabledEvents.push(e));
    bus.on('vehicle.subsystem.damaged', (e) => subsystemEvents.push(e));

    // Aplica tiros pesados até destruir o casco
    for (let i = 0; i < 6 && tank.hullHp > 0; i++) {
      vehicleDamage.applyHit('tank-3', 'enemy', tank, {
        sourceId: 'tank-ally',
        targetId: 'tank-3',
        damageType: 'shell',
        baseDamage: 160,
        impactPosition: { x: 0, y: 1.2, z: -2 },
        hitZone: 'armor_rear',
        distance: 30,
        material: 'steel_heavy',
      });
    }

    expect(tank.hullHp).toBe(0);
    expect(tank.state).toBe('destroyed');
    expect(vehicleDamage.canMove(tank)).toBe(false);
    expect(vehicleDamage.canRotateTurret(tank)).toBe(false);
    expect(vehicleDamage.getTurretSpeedMult(tank)).toBe(0);

    expect(subsystemEvents.length).toBeGreaterThan(0);
    expect(disabledEvents.length).toBeGreaterThanOrEqual(1);
    expect(disabledEvents[0].payload).toEqual({
      vehicleId: 'tank-3',
      faction: 'enemy',
    });
  });
});
