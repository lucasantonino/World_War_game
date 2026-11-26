import type {
  BattlefieldEvent,
  BattlefieldSector,
  RadioMessage,
  SoldierProfile,
  SquadUnit,
  Vec3,
} from '../core/types.ts';

/**
 * Estado autoritativo em memória das entidades militares, setores, eventos e reservas.
 */
export class SimulationWorld {
  public readonly sectors: BattlefieldSector[] = [];
  public readonly squads = new Map<string, SquadUnit>();
  public readonly soldiers = new Map<string, SoldierProfile>();
  public readonly events: BattlefieldEvent[] = [];
  public readonly radioLog: RadioMessage[] = [];
  public reserves: Record<'ally' | 'enemy', number> = { ally: 24, enemy: 40 };
  public seed = 1944;

  public clear(): void {
    this.sectors.length = 0;
    this.squads.clear();
    this.soldiers.clear();
    this.events.length = 0;
    this.radioLog.length = 0;
    this.reserves = { ally: 24, enemy: 40 };
  }

  public addSector(sector: BattlefieldSector): void {
    const existingIdx = this.sectors.findIndex((s) => s.id === sector.id);
    if (existingIdx >= 0) {
      this.sectors[existingIdx] = sector;
    } else {
      this.sectors.push(sector);
    }
  }

  public addSquad(squad: SquadUnit): void {
    this.squads.set(squad.id, squad);
  }

  public addSoldier(soldier: SoldierProfile): void {
    this.soldiers.set(soldier.id, soldier);
    const squad = this.squads.get(soldier.squadId);
    if (squad && !squad.memberIds.includes(soldier.id)) {
      squad.memberIds.push(soldier.id);
    }
  }

  public getSquadMembers(squadId: string): SoldierProfile[] {
    const members: SoldierProfile[] = [];
    for (const soldier of this.soldiers.values()) {
      if (soldier.squadId === squadId) {
        members.push(soldier);
      }
    }
    return members;
  }

  public getPlayerSquad(): SquadUnit | undefined {
    for (const squad of this.squads.values()) {
      if (squad.isPlayerSquad) {
        return squad;
      }
    }
    return undefined;
  }

  public getSectorAt(pos: Vec3): BattlefieldSector | null {
    let closest: BattlefieldSector | null = null;
    let closestDistSq = Infinity;

    for (const sector of this.sectors) {
      const dx = pos.x - sector.center.x;
      const dz = pos.z - sector.center.z;
      const distSq = dx * dx + dz * dz;
      const radiusSq = sector.radius * sector.radius;
      if (distSq <= radiusSq && distSq < closestDistSq) {
        closest = sector;
        closestDistSq = distSq;
      }
    }

    return closest;
  }

  public getSectorsSnapshot(): BattlefieldSector[] {
    return this.sectors.map((sector) => ({
      ...sector,
      activeSquads: [...sector.activeSquads],
      center: { ...sector.center },
    }));
  }

  public pushRadioMessage(msg: RadioMessage): void {
    this.radioLog.push(msg);
    if (this.radioLog.length > 100) {
      this.radioLog.shift();
    }
  }
}
