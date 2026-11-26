import { EventBus } from '../core/EventBus';
import {
  CampaignOperationResult,
  CampaignState,
  clamp,
  SoldierProfile
} from '../core/types';
import { SaveManager } from '../infrastructure/SaveManager';

function createEmptyCampaignState(): CampaignState {
  return {
    completedOps: [],
    squadRoster: [],
    ammoBonus: 0,
    artilleryBonus: 0,
    supportLevel: 1,
    history: []
  };
}

function cloneRoster(roster: readonly SoldierProfile[]): SoldierProfile[] {
  return roster.map((soldier) => ({
    ...soldier,
    position: { ...soldier.position }
  }));
}

export class CampaignManager {
  private readonly saveManager: SaveManager;
  private readonly bus?: EventBus;
  private state: CampaignState;

  constructor(saveManager: SaveManager, bus?: EventBus) {
    this.saveManager = saveManager;
    this.bus = bus;
    this.state = this.saveManager.loadCampaignSync() ?? createEmptyCampaignState();
  }

  public getState(): CampaignState {
    return {
      completedOps: [...this.state.completedOps],
      squadRoster: cloneRoster(this.state.squadRoster),
      ammoBonus: this.state.ammoBonus,
      artilleryBonus: this.state.artilleryBonus,
      supportLevel: this.state.supportLevel,
      history: this.state.history.map((h) => ({
        ...h,
        survivingSquadIds: [...h.survivingSquadIds],
        lostSquadIds: [...h.lostSquadIds]
      }))
    };
  }

  public async loadAsync(): Promise<CampaignState> {
    const loaded = await this.saveManager.loadCampaign();
    if (loaded) {
      this.state = loaded;
    }
    return this.getState();
  }

  public getTotalSquadExperience(): number {
    return this.state.squadRoster.reduce((sum, s) => sum + s.experience, 0);
  }

  public recordOperationOutcome(
    result: CampaignOperationResult,
    currentRoster: SoldierProfile[]
  ): CampaignState {
    const survivors = currentRoster.filter((s) => s.alive && s.state !== 'dead');
    const expGain =
      (result.victory ? 25 : 10) +
      result.secondaryObjectivesDone * 12 +
      Math.min(20, result.kills) +
      result.tanksDestroyed * 8;

    const updatedRoster: SoldierProfile[] = survivors.map((soldier) => ({
      ...soldier,
      position: { ...soldier.position },
      health: soldier.maxHealth,
      woundLevel: 'none',
      wounded: false,
      suppression: 0,
      fatigue: 0,
      state: 'idle',
      experience: soldier.experience + expGain
    }));

    if (result.victory && !this.state.completedOps.includes(result.missionId)) {
      this.state.completedOps.push(result.missionId);
    }

    // Consequências narrativas entre operações: secundários, sobreviventes e setores
    // alimentam munição, artilharia e apoio logístico para a operação seguinte.
    const secondaryAmmoReward = result.secondaryObjectivesDone * 25;
    const survivorAmmoReward = survivors.length * 5;
    const sectorArtilleryReward = result.victory ? Math.max(1, result.sectorsCaptured) : 0;
    const secondarySupportBoost = result.secondaryObjectivesDone > 0 ? 1 : 0;

    this.state.ammoBonus = clamp(
      this.state.ammoBonus + secondaryAmmoReward + survivorAmmoReward,
      0,
      400
    );
    this.state.artilleryBonus = clamp(
      this.state.artilleryBonus + sectorArtilleryReward + (result.secondaryObjectivesDone >= 2 ? 1 : 0),
      0,
      10
    );
    this.state.supportLevel = clamp(
      this.state.supportLevel + (result.victory ? 1 : 0) + secondarySupportBoost,
      1,
      10
    );
    this.state.squadRoster = updatedRoster;
    this.state.history.push({
      ...result,
      survivingSquadIds: [...result.survivingSquadIds],
      lostSquadIds: [...result.lostSquadIds]
    });

    this.saveManager.saveCampaignSync(this.state);
    void this.saveManager.saveCampaign(this.state);
    this.bus?.emit('mission.completed', result);

    return this.getState();
  }

  public resetCampaign(): CampaignState {
    this.state = createEmptyCampaignState();
    this.saveManager.saveCampaignSync(this.state);
    void this.saveManager.saveCampaign(this.state);
    return this.getState();
  }
}
