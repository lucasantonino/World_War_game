import {
  DifficultyLevel,
  GameScreen,
  GameSettings,
  HUDState,
  MissionConfig,
  MissionEndSummary,
  MissionId,
  PlayerLoadout,
  PrimaryWeaponId,
  SecondaryWeaponId,
  SurvivalRecord,
  TouchControlMode,
  WeaponId
} from '../types';
import { DIFFICULTY_CONFIGS } from '../engine/DifficultyConfig';
import { WEAPON_STATS } from '../entities/PlayerController';
import { MISSIONS } from '../world/MissionData';

export interface UICallbacks {
  onSelectMission: (id: MissionId) => void;
  onStartMissionBriefing: () => void;
  onEnterBattle: () => void;
  onResumeBattle: () => void;
  onRestartMission: () => void;
  onRetryCheckpoint: () => void;
  onReturnToMenu: () => void;
  onNextMission: () => void;
  onSettingsChanged: (settings: GameSettings) => void;
  onLoadoutChanged?: (loadout: PlayerLoadout) => void;
  onTouchMove: (x: number, y: number, sprinting: boolean) => void;
  onTouchLook: (dx: number, dy: number) => void;
  onTouchFire: (firing: boolean) => void;
  onTouchAdsToggle: () => void;
  onTouchKeyPress: (code: string) => void;
  onTouchKeyHold: (code: string, held: boolean) => void;
  onTouchSelectWeapon: (id: WeaponId) => void;
  onTouchCycleWeapon: () => void;
  onTouchPause: () => void;
  onTouchMelee?: () => void;
  onTouchBinoculars?: () => void;
}

const GORE_ACK_STORAGE_KEY = 'tdn_gore_ack_v1';
const SURVIVAL_STORAGE_KEY = 'tdn_survival_best_v1';

const COVER_LABELS: Record<HUDState['coverState'], string> = {
  dugout: 'ABRIGO SEGURO',
  sheltered: 'EM COBERTURA',
  peeking: 'ESPIANDO',
  exposed: 'EXPOSTO!'
};

const SHORT_WEAPON_NAMES: Record<WeaponId, string> = {
  rifle: 'Fuzil',
  smg: 'SMG',
  shotgun: 'Escopeta',
  sniper: 'Sniper',
  lmg: 'MG-38',
  pistol: 'Pistola',
  bazooka: 'Bazuca',
  grenade: 'Granada'
};

const PRIMARY_OPTIONS: Array<{ id: PrimaryWeaponId; label: string; unlockHint: string }> = [
  { id: 'rifle', label: 'Fuzil M-42', unlockHint: 'Padrão' },
  { id: 'smg', label: 'SMG-44', unlockHint: 'Padrão' },
  { id: 'shotgun', label: 'Escopeta M-97', unlockHint: 'OP-01 / Saque' },
  { id: 'sniper', label: 'Sniper M-40', unlockHint: 'OP-02 / Saque' },
  { id: 'lmg', label: 'MG-38 Leve', unlockHint: 'OP-03 / Saque' }
];

const SECONDARY_OPTIONS: Array<{ id: SecondaryWeaponId; label: string; unlockHint: string }> = [
  { id: 'pistol', label: 'Pistola M-1911', unlockHint: 'Padrão' },
  { id: 'smg', label: 'SMG-44', unlockHint: 'Padrão' },
  { id: 'rifle', label: 'Fuzil M-42', unlockHint: 'OP-01 / Saque' }
];

export class UIManager {
  public onTouchSmoke: (() => void) | null = null;
  public onTouchMelee: (() => void) | null = null;
  public onTouchBinoculars: (() => void) | null = null;

  private root: HTMLElement;
  private callbacks: UICallbacks;

  private selectedMissionId: MissionId = 0;
  private completedMissions = new Set<MissionId>();
  private unlockedWeapons = new Set<WeaponId>(['rifle', 'smg', 'pistol', 'bazooka', 'grenade']);
  private loadout: PlayerLoadout = { primary: 'rifle', secondary: 'pistol' };
  private survivalRecord: SurvivalRecord = { bestWave: 0, bestKills: 0, bestTimeSec: 0 };
  private settings: GameSettings;

  // Screen containers
  private menuEl!: HTMLElement;
  private briefingEl!: HTMLElement;
  private pauseEl!: HTMLElement;
  private endEl!: HTMLElement;
  private hudEl!: HTMLElement;

  // Dynamic HUD element refs
  private vigSuppression!: HTMLElement;
  private vigBlood!: HTMLElement;
  private vigDust!: HTMLElement;
  private damageArcsEl!: HTMLElement;
  private compassStrip!: HTMLElement;
  private compassObjMarker!: HTMLElement;
  private objPhaseEl!: HTMLElement;
  private objMainEl!: HTMLElement;
  private objSubEl!: HTMLElement;
  private swarmCountEl!: HTMLElement;
  private checkpointToastEl!: HTMLElement;
  private airRaidEl!: HTMLElement;
  private mortarWarnEl!: HTMLElement;
  private radioEl!: HTMLElement;
  private reticleEl!: HTMLElement;
  private reticleTop!: HTMLElement;
  private reticleBottom!: HTMLElement;
  private reticleLeft!: HTMLElement;
  private reticleRight!: HTMLElement;
  private hitmarkerEl!: HTMLElement;
  private interactEl!: HTMLElement;
  private actionWrapEl!: HTMLElement;
  private actionLabelEl!: HTMLElement;
  private actionFillEl!: HTMLElement;
  private grenadeWarnEl!: HTMLElement;
  private sniperScopeEl!: HTMLElement;
  private binocularsEl!: HTMLElement;
  private binoTelemetryEl!: HTMLElement;
  private tankHudEl!: HTMLElement;
  private tankHpTextEl!: HTMLElement;
  private tankHpFillEl!: HTMLElement;
  private tankCannonStatusEl!: HTMLElement;
  private coverPillEl!: HTMLElement;
  private coverTextEl!: HTMLElement;
  private postureTextEl!: HTMLElement;
  private peekBarEl!: HTMLElement;
  private peekLabelEl!: HTMLElement;
  private peekFillEl!: HTMLElement;
  private hpNumEl!: HTMLElement;
  private bleedTagEl!: HTMLElement;
  private hpFillEl!: HTMLElement;
  private bandagesEl!: HTMLElement;
  private regenTagEl!: HTMLElement;
  private weaponNameEl!: HTMLElement;
  private ammoReadoutEl!: HTMLElement;
  private extraAmmoEl!: HTMLElement;
  private slotEls: HTMLElement[] = [];
  private controlsToastEl!: HTMLElement;
  private touchControlsEl!: HTMLElement;
  private touchBtnInteract!: HTMLElement;
  private touchBtnAds!: HTMLElement;
  private touchBtnSmoke!: HTMLElement;
  private touchBtnBino!: HTMLElement;
  private goreWarningBannerEl!: HTMLElement;
  private orientationWarnEl!: HTMLElement;
  private dismissedPortraitWarning = false;
  private resetActiveTouchInputs: (() => void) | null = null;

  // Menu & Pause / End refs
  private diffBtns: HTMLButtonElement[] = [];
  private diffDescEl!: HTMLElement;
  private pauseDiffSelect!: HTMLSelectElement;
  private pauseTouchSelect!: HTMLSelectElement;
  private endRetryBtn!: HTMLButtonElement;
  private endCheckpointBtn!: HTMLButtonElement;
  private opsHeadingCountEl!: HTMLElement;

  constructor(
    root: HTMLElement,
    initialSettings: GameSettings,
    completed: Set<MissionId>,
    callbacks: UICallbacks
  ) {
    this.root = root;
    this.settings = { ...initialSettings };
    this.completedMissions = completed;
    this.callbacks = callbacks;
    this.survivalRecord = this.loadSurvivalRecord();

    this.buildDOM();
    this.buildCompassTicks();
    this.setScreen('menu');
  }

  public setCompletedMissions(completed: Set<MissionId>): void {
    this.completedMissions = completed;
    this.renderOperationsList();
  }

  public setSelectedMission(id: MissionId): void {
    this.selectedMissionId = id;
    this.renderOperationsList();
  }

  public setArsenalState(unlocked: Set<WeaponId>, loadout: PlayerLoadout): void {
    this.unlockedWeapons = new Set(unlocked);
    this.loadout = { ...loadout };
    this.renderLoadoutSelectors();
  }

  public setSurvivalRecord(record: SurvivalRecord): void {
    this.survivalRecord = { ...record };
    this.renderOperationsList();
  }

  public showBriefing(config: MissionConfig): void {
    this.selectedMissionId = config.id;
    const titleEl = this.briefingEl.querySelector('#brief-title')!;
    const subEl = this.briefingEl.querySelector('#brief-sub')!;
    const bodyEl = this.briefingEl.querySelector('#brief-body')!;
    const objsEl = this.briefingEl.querySelector('#brief-objs')!;
    const threatsEl = this.briefingEl.querySelector('#brief-threats')!;
    const tipEl = this.briefingEl.querySelector('#brief-tip')!;

    titleEl.textContent = `${config.code} — ${config.title}`;
    subEl.textContent = config.subtitle;
    bodyEl.textContent = config.briefingSummary;
    objsEl.innerHTML = config.objectivesSummary.map((o) => `<li>• ${o}</li>`).join('');
    threatsEl.innerHTML = config.threatsSummary.map((t) => `<li>• ${t}</li>`).join('');
    tipEl.textContent = `DICA DE CAMPO: ${config.fieldTip}`;

    this.setScreen('briefing');
  }

  public showMissionEnd(summary: MissionEndSummary): void {
    const titleEl = this.endEl.querySelector('#end-title')!;
    const subEl = this.endEl.querySelector('#end-sub')!;
    const causeBox = this.endEl.querySelector('#end-cause-box') as HTMLElement;
    const causeEl = this.endEl.querySelector('#end-cause')!;
    const adviceEl = this.endEl.querySelector('#end-advice')!;
    const nextBtn = this.endEl.querySelector('#btn-end-next') as HTMLButtonElement;

    if (summary.victory) {
      titleEl.textContent = 'OBJETIVO CONCLUÍDO';
      titleEl.setAttribute('style', 'color: #93cc87');
      subEl.textContent = `${summary.missionTitle} — Linha assegurada`;
      causeBox.classList.add('hidden');
      nextBtn.classList.toggle('hidden', summary.missionId >= 5 || summary.missionId === 99);
      this.endCheckpointBtn.classList.add('hidden');
      this.endRetryBtn.className = 'btn-secondary';
    } else {
      titleEl.textContent = summary.missionId === 99 ? 'FIM DA RESISTÊNCIA' : 'BAIXA EM COMBATE';
      titleEl.setAttribute('style', 'color: #ef5343');
      subEl.textContent = `${summary.missionTitle} — Você caiu no campo de batalha`;
      causeBox.classList.remove('hidden');
      causeEl.textContent = summary.causeOfDeath;
      adviceEl.textContent = summary.tacticalAdvice;
      nextBtn.classList.add('hidden');

      if (summary.canRetryCheckpoint) {
        this.endCheckpointBtn.textContent = `Voltar ao Checkpoint (${summary.checkpointPhaseLabel ?? 'Fase'})`;
        this.endCheckpointBtn.classList.remove('hidden');
        this.endRetryBtn.className = 'btn-secondary';
      } else {
        this.endCheckpointBtn.classList.add('hidden');
        this.endRetryBtn.className = 'btn-primary';
      }
    }

    const mins = Math.floor(summary.durationSeconds / 60);
    const secs = Math.floor(summary.durationSeconds % 60);
    const acc =
      summary.shotsFired > 0
        ? Math.min(100, Math.round((summary.shotsHit / summary.shotsFired) * 100))
        : 0;

    this.endEl.querySelector('#stat-time')!.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    this.endEl.querySelector('#stat-kills')!.textContent = String(summary.kills);
    this.endEl.querySelector('#stat-tanks')!.textContent = String(summary.tanksDestroyed);
    this.endEl.querySelector('#stat-acc')!.textContent = `${acc}%`;

    this.setScreen(summary.victory ? 'victory' : 'kia');
  }

  public setScreen(screen: GameScreen): void {
    this.menuEl.classList.toggle('hidden', screen !== 'menu');
    this.briefingEl.classList.toggle('hidden', screen !== 'briefing');
    this.pauseEl.classList.toggle('hidden', screen !== 'paused');
    this.endEl.classList.toggle('hidden', screen !== 'kia' && screen !== 'victory');
    this.hudEl.classList.toggle('hidden', screen !== 'playing');
    if (screen !== 'playing') {
      this.resetActiveTouchInputs?.();
    }
  }

  public updateHUD(state: HUDState): void {
    // 1. Suppression, Blood & Dust vignettes
    this.vigSuppression.style.opacity = String(Math.min(0.92, state.suppression * 0.88));
    const lowHpFactor = state.hp < 45 ? (45 - state.hp) / 45 : 0;
    const bloodOpacity = state.bleeding
      ? Math.max(lowHpFactor, 0.35 + Math.sin(performance.now() * 0.008) * 0.16)
      : lowHpFactor * 0.72;
    this.vigBlood.style.opacity = String(Math.min(0.88, bloodOpacity));
    this.vigDust.style.opacity = String(Math.min(0.8, state.tinnitus * 0.75));

    // 2. Directional damage arcs
    this.damageArcsEl.innerHTML = state.damageIndicators
      .map((d) => {
        const deg = (d.angleRad * 180) / Math.PI;
        const opacity = Math.max(0, 1 - d.age / 1.35) * d.intensity;
        return `<div class="damage-arc" style="transform: rotate(${deg.toFixed(1)}deg); opacity: ${opacity.toFixed(2)}"></div>`;
      })
      .join('');

    // 3. Horizontal Compass (center = 170px, scale = 180px per PI rad)
    const pxPerRad = 175 / (Math.PI * 0.5);
    const yawDeg = ((-state.compassYaw * 180) / Math.PI + 360) % 360;
    const yawRad = (yawDeg * Math.PI) / 180;
    const stripCenterOffset = 170 - yawRad * pxPerRad;
    this.compassStrip.style.transform = `translateX(${stripCenterOffset.toFixed(1)}px)`;

    if (state.objectiveBearing !== null) {
      let diff = state.objectiveBearing - yawRad;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const mx = 170 + Math.max(-158, Math.min(158, diff * pxPerRad));
      this.compassObjMarker.style.left = `${mx.toFixed(1)}px`;
      this.compassObjMarker.classList.remove('hidden');
    } else {
      this.compassObjMarker.classList.add('hidden');
    }

    // 4. Objective, Phase Badge, Checkpoint Toast & Alerts
    const totalPhases = Math.max(1, state.totalPhases);
    const diffLabel = DIFFICULTY_CONFIGS[state.difficulty].label.toUpperCase();
    this.objPhaseEl.textContent = state.isSurvival
      ? `SOBREVIVÊNCIA • VAGA ${state.survivalWave} • ${diffLabel}`
      : `FASE ${state.phaseIndex + 1}/${totalPhases} • ${diffLabel}`;
    this.objMainEl.textContent = state.objectiveText;
    const distTag =
      state.objectiveDistance !== null ? ` • ${Math.round(state.objectiveDistance)}m` : '';
    this.objSubEl.textContent = `${state.objectiveSubtext}${distTag}`;

    if (state.remainingWaveEnemies > 0 || state.livingEnemies > 0) {
      this.swarmCountEl.textContent = `INIMIGOS NO SETOR: ${state.livingEnemies} • VAGA RESTANTE: ${state.remainingWaveEnemies}`;
      this.swarmCountEl.classList.remove('hidden');
    } else {
      this.swarmCountEl.textContent = '';
      this.swarmCountEl.classList.add('hidden');
    }

    if (state.checkpointToast) {
      this.checkpointToastEl.textContent = state.checkpointToast;
      this.checkpointToastEl.classList.remove('hidden');
    } else {
      this.checkpointToastEl.classList.add('hidden');
    }

    if (state.airRaidAlert) {
      this.airRaidEl.textContent = state.airRaidAlert;
      this.airRaidEl.classList.remove('hidden');
    } else {
      this.airRaidEl.classList.add('hidden');
    }

    if (state.mortarWarning) {
      this.mortarWarnEl.textContent = state.mortarWarning;
      this.mortarWarnEl.classList.remove('hidden');
    } else {
      this.mortarWarnEl.classList.add('hidden');
    }

    if (state.radioCaption) {
      this.radioEl.textContent = `RÁDIO ALIADO: "${state.radioCaption}"`;
      this.radioEl.classList.remove('hidden');
    } else {
      this.radioEl.classList.add('hidden');
    }

    // 5. Special Optical & Vehicle Overlays
    const showSniperScope = state.sniperScopeActive && !state.binocularsActive && !state.inAllyTank;
    const showBinoculars = state.binocularsActive && !state.inAllyTank;
    const showTankHud = state.inAllyTank;

    this.sniperScopeEl.classList.toggle('hidden', !showSniperScope);
    this.binocularsEl.classList.toggle('hidden', !showBinoculars);
    this.tankHudEl.classList.toggle('hidden', !showTankHud);

    if (showBinoculars) {
      this.binoTelemetryEl.textContent = state.artilleryCallReady
        ? 'ARTILHARIA ALIADA: PRONTA • [LMB] CHAMAR SALVA DE OBUSES'
        : `ARTILHARIA ALIADA: RECARREGANDO (${Math.ceil(state.artilleryCallCooldown)}s)`;
      this.binoTelemetryEl.classList.toggle('ready', state.artilleryCallReady);
    }

    if (showTankHud) {
      const tankPct =
        state.allyTankMaxHp > 0
          ? Math.max(0, Math.min(100, Math.round((state.allyTankHp / state.allyTankMaxHp) * 100)))
          : 0;
      this.tankHpTextEl.textContent = `${Math.max(0, Math.ceil(state.allyTankHp))} / ${state.allyTankMaxHp}`;
      this.tankHpFillEl.style.width = `${tankPct}%`;
      this.tankHpFillEl.classList.toggle('low', tankPct < 35);
      this.tankCannonStatusEl.textContent =
        state.allyTankShellCooldown <= 0.05
          ? 'CANHÃO 75mm: PRONTO'
          : `CANHÃO 75mm: ${state.allyTankShellCooldown.toFixed(1)}s`;
      this.tankCannonStatusEl.classList.toggle('ready', state.allyTankShellCooldown <= 0.05);
    }

    // 6. Reticle & Hitmarker
    const hideReticle =
      showSniperScope ||
      showBinoculars ||
      showTankHud ||
      (state.adsFactor > 0.45 && state.weaponId !== 'bazooka');
    this.reticleEl.classList.toggle('hidden', hideReticle);
    const gap = Math.round(state.spreadPx);
    this.reticleTop.style.top = `${-7 - gap}px`;
    this.reticleBottom.style.top = `${4 + gap}px`;
    this.reticleLeft.style.left = `${-7 - gap}px`;
    this.reticleRight.style.left = `${4 + gap}px`;

    this.hitmarkerEl.style.opacity = state.hitMarkerTimer > 0 ? '0.95' : '0';
    this.hitmarkerEl.classList.toggle('crit', state.hitMarkerCrit);

    // 7. Contextual prompt, action bar & grenade warning
    if (state.interactPrompt) {
      this.interactEl.textContent = state.interactPrompt;
      this.interactEl.classList.remove('hidden');
    } else {
      this.interactEl.classList.add('hidden');
    }

    if (state.actionProgress > 0 && state.actionLabel) {
      this.actionWrapEl.classList.remove('hidden');
      this.actionLabelEl.textContent = state.actionLabel;
      this.actionFillEl.style.width = `${Math.round(state.actionProgress * 100)}%`;
    } else if (state.reloadingProgress > 0) {
      this.actionWrapEl.classList.remove('hidden');
      this.actionLabelEl.textContent = 'RECARREGANDO...';
      this.actionFillEl.style.width = `${Math.round(state.reloadingProgress * 100)}%`;
    } else if (state.cookingGrenadeProgress > 0) {
      this.actionWrapEl.classList.remove('hidden');
      this.actionLabelEl.textContent = 'PAVIO DA GRANADA...';
      this.actionFillEl.style.width = `${Math.round(state.cookingGrenadeProgress * 100)}%`;
    } else {
      this.actionWrapEl.classList.add('hidden');
    }

    if (state.grenadeWarning) {
      this.grenadeWarnEl.textContent = `GRANADA PRÓXIMA (${state.grenadeWarning.distance.toFixed(1)}m)`;
      this.grenadeWarnEl.classList.remove('hidden');
    } else {
      this.grenadeWarnEl.classList.add('hidden');
    }

    // 8. Cover, Peek Danger & Vitals
    if (state.inAllyTank) {
      this.coverPillEl.className = 'cover-pill tank-armored';
      this.coverTextEl.textContent = 'BLINDADO ALIADO';
      this.postureTextEl.textContent = 'EMBARCADO';
    } else if (state.inSmokeScreen) {
      this.coverPillEl.className = 'cover-pill smoke-hidden';
      this.coverTextEl.textContent = 'OCULTO NA FUMAÇA';
      this.postureTextEl.textContent = state.mgMounted
        ? 'METRALHADORA'
        : state.isCrouching
          ? 'AGACHADO'
          : state.isSprinting
            ? 'CORRENDO'
            : 'EM PÉ';
    } else {
      this.coverPillEl.className = `cover-pill ${state.coverState}`;
      this.coverTextEl.textContent = COVER_LABELS[state.coverState];
      this.postureTextEl.textContent = state.mgMounted
        ? 'METRALHADORA'
        : state.isCrouching
          ? 'AGACHADO'
          : state.isSprinting
            ? 'CORRENDO'
            : 'EM PÉ';
    }

    if (state.peekDanger > 0.12 && !state.inAllyTank) {
      const peekPct = Math.min(100, Math.round(state.peekDanger * 100));
      const isCritical = peekPct > 65;
      this.peekBarEl.classList.remove('hidden');
      this.peekBarEl.classList.toggle('danger', isCritical);
      this.peekLabelEl.textContent = `MIRA INIMIGA: ${peekPct}%`;
      this.peekFillEl.style.width = `${peekPct}%`;
      this.peekFillEl.classList.toggle('danger', isCritical);
    } else {
      this.peekBarEl.classList.add('hidden');
    }

    const hpInt = Math.max(0, Math.ceil(state.hp));
    this.hpNumEl.textContent = `${hpInt}`;
    this.hpFillEl.style.width = `${hpInt}%`;
    this.hpFillEl.classList.toggle('low', hpInt < 38 || state.bleeding);
    this.bleedTagEl.textContent = state.bleeding ? 'SANGRANDO — SEGURE [H]' : '';
    this.bandagesEl.textContent = `CURATIVOS [H]: ${state.bandages}`;
    this.regenTagEl.textContent = state.isRegenerating ? '+REGEN' : '';

    // 9. Weapon & Ammo
    if (state.inAllyTank) {
      this.weaponNameEl.textContent = 'Canhão 75mm & Coaxial';
      this.ammoReadoutEl.innerHTML =
        state.allyTankShellCooldown <= 0.05
          ? `PRONTO <span class="ammo-reserve">75mm</span>`
          : `${state.allyTankShellCooldown.toFixed(1)}s <span class="ammo-reserve">RECARGA</span>`;
    } else if (state.mgMounted) {
      this.weaponNameEl.textContent = 'Metralhadora Pesada M-19';
      const heatPct = Math.round(state.mgHeat * 100);
      this.ammoReadoutEl.innerHTML = state.mgOverheated
        ? `<span style="color:#ef5343;font-size:1.15rem">SUPERAQUECIDA</span>`
        : `${heatPct}% <span class="ammo-reserve">CALOR</span>`;
    } else if (state.binocularsActive) {
      this.weaponNameEl.textContent = 'Binóculo Tático';
      this.ammoReadoutEl.innerHTML = state.artilleryCallReady
        ? `PRONTA <span class="ammo-reserve">SALVA</span>`
        : `${Math.ceil(state.artilleryCallCooldown)}s <span class="ammo-reserve">ARTILHARIA</span>`;
    } else {
      this.weaponNameEl.textContent = WEAPON_STATS[state.weaponId].name;
      if (state.weaponId === 'grenade') {
        this.ammoReadoutEl.innerHTML = `${state.grenades} <span class="ammo-reserve">UNID.</span>`;
      } else {
        this.ammoReadoutEl.innerHTML = `${state.ammoInMag} <span class="ammo-reserve">/ ${state.ammoReserve}</span>`;
      }
    }

    const artText = state.artilleryCallReady
      ? 'PRONTA'
      : `${Math.ceil(state.artilleryCallCooldown)}s`;
    this.extraAmmoEl.textContent = `GRANADAS [G]: ${state.grenades} • FUMAÇA [X]: ${state.smokeGrenades} • FOGUETES: ${state.rockets} • ART. [B]: ${artText}`;

    const slotWeapons: WeaponId[] = [
      state.primaryWeaponId,
      state.secondaryWeaponId,
      'bazooka',
      'grenade'
    ];
    this.slotEls.forEach((el, idx) => {
      const wId = slotWeapons[idx];
      el.dataset.slot = wId;
      el.textContent = `[${idx + 1}] ${SHORT_WEAPON_NAMES[wId]}`;
      el.classList.toggle(
        'active',
        !state.mgMounted && !state.inAllyTank && !state.binocularsActive && state.weaponId === wId
      );
    });

    this.controlsToastEl.classList.toggle('hidden', state.touchActive || !state.showControlsHint);
    this.touchControlsEl.classList.toggle('hidden', !state.touchActive);
    this.touchBtnInteract.classList.toggle('highlight', Boolean(state.interactPrompt));
    this.touchBtnAds.classList.toggle('active', state.adsFactor > 0.4);
    this.touchBtnSmoke.classList.toggle('empty', state.smokeGrenades <= 0);
    this.touchBtnBino.classList.toggle('active', state.binocularsActive);

    const showPortraitWarning =
      state.touchActive && window.innerHeight > window.innerWidth && !this.dismissedPortraitWarning;
    this.orientationWarnEl.classList.toggle('hidden', !showPortraitWarning);
  }

  private loadSurvivalRecord(): SurvivalRecord {
    try {
      const raw = localStorage.getItem(SURVIVAL_STORAGE_KEY);
      if (!raw) return { bestWave: 0, bestKills: 0, bestTimeSec: 0 };
      const parsed = JSON.parse(raw) as Partial<SurvivalRecord>;
      return {
        bestWave: typeof parsed.bestWave === 'number' ? parsed.bestWave : 0,
        bestKills: typeof parsed.bestKills === 'number' ? parsed.bestKills : 0,
        bestTimeSec: typeof parsed.bestTimeSec === 'number' ? parsed.bestTimeSec : 0
      };
    } catch {
      return { bestWave: 0, bestKills: 0, bestTimeSec: 0 };
    }
  }

  private isGoreAcknowledged(): boolean {
    try {
      return localStorage.getItem(GORE_ACK_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private buildDOM(): void {
    const goreAcked = this.isGoreAcknowledged();

    this.root.innerHTML = `
      <!-- EXPLICIT GORE / CONTENT WARNING BANNER (FIRST LAUNCH) -->
      <div id="gore-warning-banner" class="gore-warning-overlay ${goreAcked ? 'hidden' : ''}" role="dialog" aria-modal="true" aria-labelledby="gore-warn-title">
        <div class="gore-warning-card">
          <div class="gore-warn-badge">CLASSIFICAÇÃO +18 • CONTEÚDO VISCERAL</div>
          <h2 id="gore-warn-title">AVISO DE CONTEÚDO EXPLÍCITO</h2>
          <p class="gore-warn-body">
            <strong>TERRA DE NINGUÉM</strong> retrata a brutalidade realista dos combates em trincheiras.
            Este jogo contém <strong>sangue explícito, desmembramento, ferimentos graves e violência visceral de guerra</strong>
            (sem opção para desativar esses efeitos).
          </p>
          <p class="gore-warn-sub">
            Recomendado apenas para jogadores maiores de 18 anos. Ao prosseguir, você confirma estar ciente do conteúdo apresentado.
          </p>
          <div class="gore-warn-actions">
            <button id="btn-gore-ack" type="button" class="btn-primary">CIENTE — CONTINUAR</button>
          </div>
        </div>
      </div>

      <!-- MAIN MENU / HQ -->
      <div id="screen-menu" class="screen-overlay">
        <div class="hq-layout">
          <div class="brand-block">
            <h1>TERRA DE<br />NINGUÉM</h1>
            <p class="brand-subtitle">
              Sobreviva ao inferno das trincheiras. Cada metro exposto atrai fogo cruzado, canhões de tanque e bombardeios aéreos. Use a lama, as crateras e os abrigos para permanecer vivo.
            </p>
            <div class="survival-rules">
              <div class="survival-rule-row"><span class="rule-tag">COBERTURA</span><span>Abaixe-se com <b>[C]</b> abaixo do parapeito e espie com <b>[Q/E]</b> ou <b>[Botão Direito]</b>.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">TÁTICA</span><span><b>[V]</b> Baioneta corpo a corpo • <b>[B]</b> Binóculo para chamar barragem de artilharia.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">ANTITANQUE</span><span>Use <b>Bazuca [3]</b> nos flancos ou embarque em blindados aliados com <b>[F]</b>.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">HEMORRAGIA</span><span>Ferimentos graves sangram até a morte. Segure <b>[H]</b> protegido para estancar.</span></div>
            </div>

            <div class="loadout-panel">
              <div class="loadout-row">
                <span class="loadout-label">PRIMÁRIA [1]</span>
                <div id="loadout-primary-list" class="loadout-chips"></div>
              </div>
              <div class="loadout-row">
                <span class="loadout-label">SECUNDÁRIA [2]</span>
                <div id="loadout-secondary-list" class="loadout-chips"></div>
              </div>
            </div>

            <div class="difficulty-selector" role="group" aria-label="Selecionar dificuldade">
              ${(['recruit', 'veteran', 'infernal'] as DifficultyLevel[])
                .map(
                  (id) => `
                  <button type="button" class="diff-btn ${this.settings.difficulty === id ? 'active' : ''}" data-diff="${id}">
                    ${DIFFICULTY_CONFIGS[id].label}
                  </button>`
                )
                .join('')}
            </div>
            <div id="menu-diff-desc" class="diff-desc">${DIFFICULTY_CONFIGS[this.settings.difficulty].description}</div>
            <div class="cta-row">
              <button id="btn-start-campaign" class="btn-primary">Iniciar Operação</button>
              <button id="btn-open-settings-menu" class="btn-secondary">Configurações</button>
            </div>
          </div>

          <div class="operations-panel">
            <div class="panel-heading">
              <span>Teatro de Operações</span>
              <span id="ops-heading-count" style="font-family:var(--font-mono);font-size:0.74rem;color:var(--text-secondary)">OPERAÇÕES + SOBREVIVÊNCIA</span>
            </div>
            <div id="ops-list" class="ops-list"></div>
          </div>
        </div>
      </div>

      <!-- BRIEFING -->
      <div id="screen-briefing" class="screen-overlay centered hidden">
        <div class="dossier-card">
          <h2 id="brief-title">OP-01</h2>
          <div id="brief-sub" class="dossier-sub">Setor</div>
          <p id="brief-body" class="dossier-body"></p>
          <div class="dossier-grid">
            <div class="dossier-box">
              <h3>Objetivos da Missão</h3>
              <ul id="brief-objs"></ul>
            </div>
            <div class="dossier-box">
              <h3>Ameaças Confirmadas</h3>
              <ul id="brief-threats"></ul>
            </div>
          </div>
          <div id="brief-tip" class="dossier-tip"></div>
          <div class="cta-row" style="justify-content:space-between">
            <button id="btn-brief-back" class="btn-secondary">Voltar ao QG</button>
            <button id="btn-enter-battle" class="btn-primary">Entrar na Trincheira</button>
          </div>
        </div>
      </div>

      <!-- PAUSE / SETTINGS -->
      <div id="screen-pause" class="screen-overlay centered hidden">
        <div class="modal-card">
          <h2>Pausa Tática</h2>
          <div class="settings-grid">
            <div class="setting-row">
              <label for="set-sens">Sensibilidade do Mouse</label>
              <input id="set-sens" type="range" min="0.3" max="2.5" step="0.1" value="${this.settings.mouseSensitivity}" />
            </div>
            <div class="setting-row">
              <label for="set-vol">Volume Geral</label>
              <input id="set-vol" type="range" min="0" max="1" step="0.05" value="${this.settings.masterVolume}" />
            </div>
            <div class="setting-row">
              <label for="set-qual">Qualidade Gráfica</label>
              <select id="set-qual">
                <option value="low" ${this.settings.quality === 'low' ? 'selected' : ''}>Baixa (Sem Sombras)</option>
                <option value="medium" ${this.settings.quality === 'medium' ? 'selected' : ''}>Média (Recomendada)</option>
                <option value="high" ${this.settings.quality === 'high' ? 'selected' : ''}>Alta</option>
              </select>
            </div>
            <div class="setting-row">
              <label for="set-diff">Dificuldade</label>
              <select id="set-diff">
                <option value="recruit" ${this.settings.difficulty === 'recruit' ? 'selected' : ''}>Recruta</option>
                <option value="veteran" ${this.settings.difficulty === 'veteran' ? 'selected' : ''}>Veterano</option>
                <option value="infernal" ${this.settings.difficulty === 'infernal' ? 'selected' : ''}>Infernal</option>
              </select>
            </div>
            <div class="setting-row">
              <label for="set-touch">Controles Touch (Celular)</label>
              <select id="set-touch">
                <option value="auto" ${this.settings.touchControls === 'auto' ? 'selected' : ''}>Automático</option>
                <option value="on" ${this.settings.touchControls === 'on' ? 'selected' : ''}>Ativado</option>
                <option value="off" ${this.settings.touchControls === 'off' ? 'selected' : ''}>Desativado</option>
              </select>
            </div>
          </div>
          <div class="controls-grid">
            <div class="control-pair"><span>Mover / Correr</span><span><kbd>WASD</kbd> <kbd>Shift</kbd></span></div>
            <div class="control-pair"><span>Agachar / Escalar</span><span><kbd>C</kbd> <kbd>Espaço</kbd></span></div>
            <div class="control-pair"><span>Espiar Esq / Dir</span><span><kbd>Q</kbd> <kbd>E</kbd></span></div>
            <div class="control-pair"><span>Atirar / Mirar</span><span><kbd>LMB</kbd> <kbd>RMB</kbd></span></div>
            <div class="control-pair"><span>Armas / Recarregar</span><span><kbd>1-5</kbd> <kbd>R</kbd></span></div>
            <div class="control-pair"><span>Baioneta / Binóculo</span><span><kbd>V</kbd> <kbd>B</kbd></span></div>
            <div class="control-pair"><span>Frag / Fumaça</span><span><kbd>G</kbd> <kbd>X</kbd></span></div>
            <div class="control-pair"><span>Curativo / Interagir</span><span><kbd>H</kbd> <kbd>F</kbd></span></div>
          </div>
          <div class="cta-row" style="justify-content:space-between">
            <div style="display:flex;gap:10px">
              <button id="btn-pause-menu" class="btn-secondary">Quartel-General</button>
              <button id="btn-pause-restart" class="btn-secondary">Reiniciar</button>
            </div>
            <button id="btn-pause-resume" class="btn-primary">Voltar ao Combate</button>
          </div>
        </div>
      </div>

      <!-- MISSION END (KIA / VICTORY) -->
      <div id="screen-end" class="screen-overlay centered hidden">
        <div class="modal-card">
          <h2 id="end-title">BAIXA EM COMBATE</h2>
          <div id="end-sub" class="dossier-sub">Relatório</div>
          <div id="end-cause-box" class="dossier-tip" style="border-color:rgba(239,83,67,0.45);background:rgba(168,36,28,0.14)">
            <div style="font-weight:600;margin-bottom:4px">CAUSA DA BAIXA: <span id="end-cause"></span></div>
            <div id="end-advice" style="color:var(--text-secondary);font-size:0.84rem"></div>
          </div>
          <div class="stats-strip tabular">
            <div class="stat-cell"><div class="stat-label">Tempo</div><div id="stat-time" class="stat-value">0:00</div></div>
            <div class="stat-cell"><div class="stat-label">Abates</div><div id="stat-kills" class="stat-value">0</div></div>
            <div class="stat-cell"><div class="stat-label">Blindados</div><div id="stat-tanks" class="stat-value">0</div></div>
            <div class="stat-cell"><div class="stat-label">Precisão</div><div id="stat-acc" class="stat-value">0%</div></div>
          </div>
          <div class="cta-row" style="justify-content:space-between">
            <button id="btn-end-menu" class="btn-secondary">Voltar ao QG</button>
            <div style="display:flex;gap:10px">
              <button id="btn-end-retry" class="btn-secondary">Tentar Novamente</button>
              <button id="btn-end-checkpoint" class="btn-primary hidden">Voltar ao Checkpoint</button>
              <button id="btn-end-next" class="btn-primary hidden">Próxima Operação</button>
            </div>
          </div>
        </div>
      </div>

      <!-- IN-GAME HUD -->
      <div id="hud-root" class="hud-root hidden">
        <div id="vig-sup" class="vignette-suppression"></div>
        <div id="vig-blood" class="vignette-blood"></div>
        <div id="vig-dust" class="vignette-dust"></div>
        <div id="damage-arcs" class="damage-arcs-layer"></div>

        <!-- SNIPER SCOPE OVERLAY -->
        <div id="sniper-scope-overlay" class="sniper-scope-overlay hidden">
          <div class="scope-cross-h"></div>
          <div class="scope-cross-v"></div>
          <div class="scope-center-dot"></div>
          <div class="scope-ring"></div>
        </div>

        <!-- BINOCULARS OVERLAY -->
        <div id="binoculars-overlay" class="binoculars-overlay hidden">
          <div class="bino-lenses">
            <div class="bino-reticle-h"></div>
            <div class="bino-reticle-v"></div>
            <div class="bino-center-cross"></div>
          </div>
          <div id="bino-telemetry" class="bino-telemetry ready">ARTILHARIA ALIADA: PRONTA • [LMB] CHAMAR SALVA</div>
        </div>

        <!-- TANK HUD OVERLAY -->
        <div id="tank-hud-overlay" class="tank-hud-overlay hidden">
          <div class="tank-slit-frame"></div>
          <div class="tank-crosshair"></div>
          <div class="tank-status-panel tabular">
            <div class="tank-status-row">
              <span>BLINDAGEM DO TANQUE ALIADO</span>
              <span id="tank-hp-text">500 / 500</span>
            </div>
            <div class="tank-hp-track"><div id="tank-hp-fill" class="tank-hp-fill" style="width:100%"></div></div>
            <div id="tank-cannon-status" class="tank-cannon-status ready">CANHÃO 75mm: PRONTO</div>
            <div class="tank-controls-hint">[WASD] Dirigir • [LMB] Canhão 75mm • [RMB/Espaço] Coaxial • [F] Desembarcar</div>
          </div>
        </div>

        <div id="controls-toast" class="controls-toast">
          [WASD] Mover • [C] Agachar • [Q/E] Espiar • [V] Baioneta • [B] Binóculo<br />
          [1-5] Armas • [G] Frag • [X] Fumaça • [H] Curativo • [F] Interagir
        </div>

        <div class="hud-top">
          <div class="compass-bar">
            <div id="compass-strip" class="compass-strip"></div>
            <div id="compass-obj" class="compass-obj-marker"></div>
            <div class="compass-needle"></div>
          </div>
          <div class="objective-banner">
            <div id="hud-obj-phase" class="objective-phase-meta">FASE 1/1 • VETERANO</div>
            <div id="hud-obj-main" class="objective-main">OBJETIVO</div>
            <div id="hud-obj-sub" class="objective-sub">...</div>
            <div id="hud-swarm-count" class="objective-swarm-meta hidden"></div>
          </div>
          <div id="hud-checkpoint-toast" class="checkpoint-toast hidden"></div>
          <div id="hud-air-raid" class="air-raid-banner hidden">ALERTA AÉREO</div>
          <div id="hud-mortar-warning" class="mortar-warning hidden">MORTEIRO CALIBRADO — MOVA-SE!</div>
        </div>

        <div id="hud-radio" class="radio-caption hidden"></div>

        <div id="hud-reticle" class="reticle">
          <div id="ret-t" class="reticle-tick reticle-top"></div>
          <div id="ret-b" class="reticle-tick reticle-bottom"></div>
          <div id="ret-l" class="reticle-tick reticle-left"></div>
          <div id="ret-r" class="reticle-tick reticle-right"></div>
        </div>
        <div id="hud-hitmarker" class="hitmarker"></div>

        <div id="hud-grenade-warn" class="grenade-warning hidden"></div>
        <div id="hud-action-wrap" class="action-progress-wrap hidden">
          <div id="hud-action-label" class="action-progress-label">...</div>
          <div class="action-progress-track"><div id="hud-action-fill" class="action-progress-fill"></div></div>
        </div>
        <div id="hud-interact" class="interact-prompt hidden"></div>

        <div class="hud-bottom-left">
          <div id="hud-cover-pill" class="cover-pill sheltered">
            <span class="cover-dot"></span>
            <span id="hud-cover-text" class="cover-text">EM COBERTURA</span>
            <span id="hud-posture-text" class="posture-sub">EM PÉ</span>
          </div>
          <div id="hud-peek-bar" class="peek-danger-box hidden">
            <div class="peek-danger-header">
              <span id="hud-peek-label">MIRA INIMIGA: 0%</span>
            </div>
            <div class="peek-danger-track"><div id="hud-peek-fill" class="peek-danger-fill" style="width:0%"></div></div>
          </div>
          <div class="vitals-box tabular">
            <div class="vitals-row">
              <span id="hud-hp-num" class="hp-num">100</span>
              <span id="hud-bleed-tag" class="bleed-tag"></span>
            </div>
            <div class="hp-track"><div id="hud-hp-fill" class="hp-fill" style="width:100%"></div></div>
            <div class="bandage-row">
              <span id="hud-bandages">CURATIVOS [H]: 3</span>
              <span id="hud-regen-tag" class="regen-tag"></span>
            </div>
          </div>
        </div>

        <div class="hud-bottom-right tabular">
          <div class="weapon-panel">
            <div id="hud-weapon-name" class="weapon-name">Fuzil M-42</div>
            <div id="hud-ammo-readout" class="ammo-readout">8 <span class="ammo-reserve">/ 56</span></div>
            <div id="hud-extra-ammo" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary);margin-top:4px">
              GRANADAS [G]: 3 • FUMAÇA [X]: 2 • FOGUETES: 5
            </div>
          </div>
          <div class="weapon-slots">
            <div class="slot-chip active" data-slot="rifle">[1] Fuzil</div>
            <div class="slot-chip" data-slot="pistol">[2] Pistola</div>
            <div class="slot-chip" data-slot="bazooka">[3] Bazuca</div>
            <div class="slot-chip" data-slot="grenade">[4] Granada</div>
          </div>
        </div>

        <!-- MOBILE TOUCH CONTROLS -->
        <div id="touch-controls" class="touch-controls hidden">
          <div id="touch-look-zone" class="touch-look-zone"></div>

          <button id="touch-btn-pause" type="button" class="touch-btn">PAUSA</button>

          <div id="touch-joy-zone" class="touch-joy-zone">
            <div class="touch-joy-base">
              <div id="touch-joy-knob" class="touch-joy-knob"></div>
            </div>
          </div>

          <div class="touch-cluster-left">
            <button id="touch-btn-crouch" type="button" class="touch-btn">AGACHAR</button>
            <button id="touch-btn-jump" type="button" class="touch-btn">ESCALAR</button>
            <button id="touch-btn-heal" type="button" class="touch-btn">CURATIVO</button>
            <button id="touch-btn-interact" type="button" class="touch-btn">INTERAGIR</button>
            <button id="touch-btn-bino" type="button" class="touch-btn">BINÓCULO</button>
            <button id="touch-btn-melee" type="button" class="touch-btn">BAIONETA</button>
          </div>

          <div class="touch-cluster-right">
            <button id="touch-btn-ads" type="button" class="touch-btn">MIRAR</button>
            <button id="touch-btn-reload" type="button" class="touch-btn">RECARREGAR</button>
            <button id="touch-btn-weapon" type="button" class="touch-btn">ARMA</button>
            <button id="touch-btn-grenade" type="button" class="touch-btn">GRANADA</button>
            <button id="touch-btn-smoke" type="button" class="touch-btn">FUMAÇA</button>
            <button id="touch-btn-fire" type="button" class="touch-btn fire">ATIRAR</button>
          </div>
        </div>

        <div id="orientation-warning" class="orientation-warning hidden">
          <div class="orientation-card">
            <div class="orientation-title">GIRE O APARELHO PARA A HORIZONTAL</div>
            <div class="orientation-sub">Modo paisagem recomendado para controle com os dois polegares.</div>
            <button id="btn-dismiss-portrait" type="button" class="btn-secondary">Continuar mesmo assim</button>
          </div>
        </div>
      </div>
    `;

    this.menuEl = this.root.querySelector('#screen-menu')!;
    this.briefingEl = this.root.querySelector('#screen-briefing')!;
    this.pauseEl = this.root.querySelector('#screen-pause')!;
    this.endEl = this.root.querySelector('#screen-end')!;
    this.hudEl = this.root.querySelector('#hud-root')!;

    this.vigSuppression = this.root.querySelector('#vig-sup')!;
    this.vigBlood = this.root.querySelector('#vig-blood')!;
    this.vigDust = this.root.querySelector('#vig-dust')!;
    this.damageArcsEl = this.root.querySelector('#damage-arcs')!;
    this.compassStrip = this.root.querySelector('#compass-strip')!;
    this.compassObjMarker = this.root.querySelector('#compass-obj')!;
    this.objPhaseEl = this.root.querySelector('#hud-obj-phase')!;
    this.objMainEl = this.root.querySelector('#hud-obj-main')!;
    this.objSubEl = this.root.querySelector('#hud-obj-sub')!;
    this.swarmCountEl = this.root.querySelector('#hud-swarm-count')!;
    this.checkpointToastEl = this.root.querySelector('#hud-checkpoint-toast')!;
    this.airRaidEl = this.root.querySelector('#hud-air-raid')!;
    this.mortarWarnEl = this.root.querySelector('#hud-mortar-warning')!;
    this.radioEl = this.root.querySelector('#hud-radio')!;
    this.reticleEl = this.root.querySelector('#hud-reticle')!;
    this.reticleTop = this.root.querySelector('#ret-t')!;
    this.reticleBottom = this.root.querySelector('#ret-b')!;
    this.reticleLeft = this.root.querySelector('#ret-l')!;
    this.reticleRight = this.root.querySelector('#ret-r')!;
    this.hitmarkerEl = this.root.querySelector('#hud-hitmarker')!;
    this.interactEl = this.root.querySelector('#hud-interact')!;
    this.actionWrapEl = this.root.querySelector('#hud-action-wrap')!;
    this.actionLabelEl = this.root.querySelector('#hud-action-label')!;
    this.actionFillEl = this.root.querySelector('#hud-action-fill')!;
    this.grenadeWarnEl = this.root.querySelector('#hud-grenade-warn')!;
    this.sniperScopeEl = this.root.querySelector('#sniper-scope-overlay')!;
    this.binocularsEl = this.root.querySelector('#binoculars-overlay')!;
    this.binoTelemetryEl = this.root.querySelector('#bino-telemetry')!;
    this.tankHudEl = this.root.querySelector('#tank-hud-overlay')!;
    this.tankHpTextEl = this.root.querySelector('#tank-hp-text')!;
    this.tankHpFillEl = this.root.querySelector('#tank-hp-fill')!;
    this.tankCannonStatusEl = this.root.querySelector('#tank-cannon-status')!;
    this.coverPillEl = this.root.querySelector('#hud-cover-pill')!;
    this.coverTextEl = this.root.querySelector('#hud-cover-text')!;
    this.postureTextEl = this.root.querySelector('#hud-posture-text')!;
    this.peekBarEl = this.root.querySelector('#hud-peek-bar')!;
    this.peekLabelEl = this.root.querySelector('#hud-peek-label')!;
    this.peekFillEl = this.root.querySelector('#hud-peek-fill')!;
    this.hpNumEl = this.root.querySelector('#hud-hp-num')!;
    this.bleedTagEl = this.root.querySelector('#hud-bleed-tag')!;
    this.hpFillEl = this.root.querySelector('#hud-hp-fill')!;
    this.bandagesEl = this.root.querySelector('#hud-bandages')!;
    this.regenTagEl = this.root.querySelector('#hud-regen-tag')!;
    this.weaponNameEl = this.root.querySelector('#hud-weapon-name')!;
    this.ammoReadoutEl = this.root.querySelector('#hud-ammo-readout')!;
    this.extraAmmoEl = this.root.querySelector('#hud-extra-ammo')!;
    this.slotEls = Array.from(this.root.querySelectorAll('.slot-chip'));
    this.controlsToastEl = this.root.querySelector('#controls-toast')!;
    this.touchControlsEl = this.root.querySelector('#touch-controls')!;
    this.touchBtnInteract = this.root.querySelector('#touch-btn-interact')!;
    this.touchBtnAds = this.root.querySelector('#touch-btn-ads')!;
    this.touchBtnSmoke = this.root.querySelector('#touch-btn-smoke')!;
    this.touchBtnBino = this.root.querySelector('#touch-btn-bino')!;
    this.goreWarningBannerEl = this.root.querySelector('#gore-warning-banner')!;
    this.orientationWarnEl = this.root.querySelector('#orientation-warning')!;
    this.opsHeadingCountEl = this.root.querySelector('#ops-heading-count')!;

    this.diffBtns = Array.from(this.root.querySelectorAll('.diff-btn')) as HTMLButtonElement[];
    this.diffDescEl = this.root.querySelector('#menu-diff-desc')!;
    this.pauseDiffSelect = this.root.querySelector('#set-diff') as HTMLSelectElement;
    this.pauseTouchSelect = this.root.querySelector('#set-touch') as HTMLSelectElement;
    this.pauseTouchSelect.value = this.settings.touchControls;
    this.endRetryBtn = this.root.querySelector('#btn-end-retry') as HTMLButtonElement;
    this.endCheckpointBtn = this.root.querySelector('#btn-end-checkpoint') as HTMLButtonElement;

    this.renderLoadoutSelectors();
    this.renderOperationsList();
    this.bindButtonEvents();
    this.bindTouchControls();
  }

  private isWeaponAvailableForSelectedMission(id: WeaponId): boolean {
    if (this.unlockedWeapons.has(id)) return true;
    if (this.selectedMissionId === 99) return true;
    if (id === 'shotgun' && this.selectedMissionId >= 1) return true;
    if (id === 'sniper' && this.selectedMissionId >= 2) return true;
    if (id === 'lmg' && this.selectedMissionId >= 3) return true;
    return false;
  }

  private renderLoadoutSelectors(): void {
    const primList = this.root.querySelector('#loadout-primary-list');
    const secList = this.root.querySelector('#loadout-secondary-list');
    if (!primList || !secList) return;

    primList.innerHTML = PRIMARY_OPTIONS.map((opt) => {
      const unlocked = this.isWeaponAvailableForSelectedMission(opt.id);
      const selected = this.loadout.primary === opt.id;
      return `
        <button
          type="button"
          class="loadout-chip ${selected ? 'active' : ''} ${unlocked ? '' : 'locked'}"
          data-primary="${opt.id}"
          ${unlocked ? '' : 'disabled'}
          title="${unlocked ? opt.label : `Desbloqueia em ${opt.unlockHint}`}"
        >
          <span>${opt.label}</span>
          ${unlocked ? '' : `<small class="lock-hint">${opt.unlockHint}</small>`}
        </button>
      `;
    }).join('');

    secList.innerHTML = SECONDARY_OPTIONS.map((opt) => {
      const unlocked = this.isWeaponAvailableForSelectedMission(opt.id);
      const selected = this.loadout.secondary === opt.id;
      return `
        <button
          type="button"
          class="loadout-chip ${selected ? 'active' : ''} ${unlocked ? '' : 'locked'}"
          data-secondary="${opt.id}"
          ${unlocked ? '' : 'disabled'}
          title="${unlocked ? opt.label : `Desbloqueia em ${opt.unlockHint}`}"
        >
          <span>${opt.label}</span>
          ${unlocked ? '' : `<small class="lock-hint">${opt.unlockHint}</small>`}
        </button>
      `;
    }).join('');

    primList.querySelectorAll('[data-primary]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.primary as PrimaryWeaponId;
        if (!id || !this.isWeaponAvailableForSelectedMission(id)) return;
        this.loadout = { ...this.loadout, primary: id };
        this.renderLoadoutSelectors();
        this.callbacks.onLoadoutChanged?.(this.loadout);
      });
    });

    secList.querySelectorAll('[data-secondary]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.secondary as SecondaryWeaponId;
        if (!id || !this.isWeaponAvailableForSelectedMission(id)) return;
        this.loadout = { ...this.loadout, secondary: id };
        this.renderLoadoutSelectors();
        this.callbacks.onLoadoutChanged?.(this.loadout);
      });
    });
  }

  private renderOperationsList(): void {
    const listEl = this.root.querySelector('#ops-list')!;
    const campaignMissions = MISSIONS.filter((m) => m.id !== 99 && !m.isSurvival);
    const survivalMission = MISSIONS.find((m) => m.id === 99 || m.isSurvival);

    if (this.opsHeadingCountEl) {
      this.opsHeadingCountEl.textContent = `${campaignMissions.length} OPERAÇÕES + SOBREVIVÊNCIA`;
    }

    const campaignHtml = campaignMissions
      .map((m) => {
        const done = this.completedMissions.has(m.id);
        const selected = this.selectedMissionId === m.id;
        return `
        <button class="op-item mission-card ${selected ? 'selected' : ''}" data-op="${m.id}">
          <div class="op-top">
            <span class="op-title">${m.code} — ${m.title}</span>
            <span class="op-badge ${done ? 'done' : ''}">${done ? 'CONCLUÍDA' : 'DISPONÍVEL'}</span>
          </div>
          <div class="op-desc">${m.subtitle}</div>
        </button>
      `;
      })
      .join('');

    const rec = this.survivalRecord;
    const mins = Math.floor(rec.bestTimeSec / 60);
    const secs = Math.floor(rec.bestTimeSec % 60);
    const recordText = `Recorde Local: Vaga ${rec.bestWave} • Baixas: ${rec.bestKills} • Tempo: ${mins}:${secs.toString().padStart(2, '0')}`;
    const survSelected = this.selectedMissionId === 99;
    const survTitle = survivalMission
      ? `${survivalMission.code} — ${survivalMission.title}`
      : 'MODO SOBREVIVÊNCIA — TERRA ARRASADA';

    const survivalHtml = `
      <button class="op-item mission-card survival-card ${survSelected ? 'selected' : ''}" data-op="99">
        <div class="op-top">
          <span class="op-title">${survTitle}</span>
          <span class="op-badge survival-badge">INFINITO</span>
        </div>
        <div class="op-desc">${recordText}</div>
      </button>
    `;

    listEl.innerHTML = campaignHtml + survivalHtml;

    listEl.querySelectorAll('.op-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number((btn as HTMLElement).dataset.op) as MissionId;
        this.selectedMissionId = id;
        this.callbacks.onSelectMission(id);
        this.renderOperationsList();
        this.renderLoadoutSelectors();
      });
    });
  }

  private buildCompassTicks(): void {
    const labels: Array<[number, string, boolean]> = [
      [0, 'N', true],
      [45, 'NE', false],
      [90, 'L', true],
      [135, 'SE', false],
      [180, 'S', true],
      [225, 'SO', false],
      [270, 'O', true],
      [315, 'NO', false]
    ];
    const pxPerRad = 175 / (Math.PI * 0.5);
    const items: string[] = [];
    for (const offsetDeg of [-360, 0, 360]) {
      for (const [deg, lbl, card] of labels) {
        const rad = ((deg + offsetDeg) * Math.PI) / 180;
        const x = rad * pxPerRad;
        items.push(
          `<span class="compass-tick ${card ? 'cardinal' : ''}" style="left:${x.toFixed(1)}px">${lbl}</span>`
        );
      }
    }
    this.compassStrip.innerHTML = items.join('');
  }

  private syncDifficultyUI(diff: DifficultyLevel): void {
    for (const btn of this.diffBtns) {
      btn.classList.toggle('active', btn.dataset.diff === diff);
    }
    this.diffDescEl.textContent = DIFFICULTY_CONFIGS[diff].description;
    this.pauseDiffSelect.value = diff;
  }

  private bindButtonEvents(): void {
    this.root.querySelector('#btn-gore-ack')!.addEventListener('click', () => {
      try {
        localStorage.setItem(GORE_ACK_STORAGE_KEY, '1');
      } catch {
        // ignore storage error
      }
      this.goreWarningBannerEl.classList.add('hidden');
    });
    this.root.querySelector('#btn-start-campaign')!.addEventListener('click', () => {
      this.callbacks.onStartMissionBriefing();
    });
    this.root.querySelector('#btn-open-settings-menu')!.addEventListener('click', () => {
      this.setScreen('paused');
    });
    this.root.querySelector('#btn-brief-back')!.addEventListener('click', () => {
      this.setScreen('menu');
    });
    this.root.querySelector('#btn-enter-battle')!.addEventListener('click', () => {
      this.callbacks.onEnterBattle();
    });
    this.root.querySelector('#btn-pause-resume')!.addEventListener('click', () => {
      this.callbacks.onResumeBattle();
    });
    this.root.querySelector('#btn-pause-restart')!.addEventListener('click', () => {
      this.callbacks.onRestartMission();
    });
    this.root.querySelector('#btn-pause-menu')!.addEventListener('click', () => {
      this.callbacks.onReturnToMenu();
    });
    this.root.querySelector('#btn-end-menu')!.addEventListener('click', () => {
      this.callbacks.onReturnToMenu();
    });
    this.endRetryBtn.addEventListener('click', () => {
      this.callbacks.onRestartMission();
    });
    this.endCheckpointBtn.addEventListener('click', () => {
      this.callbacks.onRetryCheckpoint();
    });
    this.root.querySelector('#btn-end-next')!.addEventListener('click', () => {
      this.callbacks.onNextMission();
    });

    for (const btn of this.diffBtns) {
      btn.addEventListener('click', () => {
        const diff = btn.dataset.diff as DifficultyLevel;
        if (!diff || !(diff in DIFFICULTY_CONFIGS)) return;
        this.settings = { ...this.settings, difficulty: diff };
        this.syncDifficultyUI(diff);
        this.callbacks.onSettingsChanged(this.settings);
      });
    }

    const sensInput = this.root.querySelector('#set-sens') as HTMLInputElement;
    const volInput = this.root.querySelector('#set-vol') as HTMLInputElement;
    const qualSelect = this.root.querySelector('#set-qual') as HTMLSelectElement;

    const emitSettings = () => {
      const diff = this.pauseDiffSelect.value as DifficultyLevel;
      const touchVal = this.pauseTouchSelect.value as TouchControlMode;
      const touchControls: TouchControlMode =
        touchVal === 'on' || touchVal === 'off' || touchVal === 'auto' ? touchVal : 'auto';
      this.settings = {
        mouseSensitivity: parseFloat(sensInput.value),
        masterVolume: parseFloat(volInput.value),
        quality: qualSelect.value as GameSettings['quality'],
        difficulty: diff in DIFFICULTY_CONFIGS ? diff : 'veteran',
        touchControls
      };
      this.syncDifficultyUI(this.settings.difficulty);
      this.callbacks.onSettingsChanged(this.settings);
    };

    sensInput.addEventListener('input', emitSettings);
    volInput.addEventListener('input', emitSettings);
    qualSelect.addEventListener('change', emitSettings);
    this.pauseDiffSelect.addEventListener('change', emitSettings);
    this.pauseTouchSelect.addEventListener('change', emitSettings);

    this.root.querySelector('#btn-dismiss-portrait')!.addEventListener('click', () => {
      this.dismissedPortraitWarning = true;
      this.orientationWarnEl.classList.add('hidden');
    });

    for (const slotEl of this.slotEls) {
      slotEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const slot = slotEl.dataset.slot as WeaponId | undefined;
        if (slot) {
          this.callbacks.onTouchSelectWeapon(slot);
        }
      });
    }
  }

  private bindTouchControls(): void {
    const joyZone = this.root.querySelector('#touch-joy-zone') as HTMLElement;
    const joyBase = joyZone.querySelector('.touch-joy-base') as HTMLElement;
    const joyKnob = this.root.querySelector('#touch-joy-knob') as HTMLElement;
    const lookZone = this.root.querySelector('#touch-look-zone') as HTMLElement;
    const fireBtn = this.root.querySelector('#touch-btn-fire') as HTMLElement;
    const pauseBtn = this.root.querySelector('#touch-btn-pause') as HTMLElement;

    let joyPointerId: number | null = null;
    let lookPointerId: number | null = null;
    let lastLookX = 0;
    let lastLookY = 0;
    let firePointerId: number | null = null;
    let lastFireX = 0;
    let lastFireY = 0;

    const heldButtons = new Map<number, { el: HTMLElement; onRelease: () => void }>();

    const updateJoystick = (clientX: number, clientY: number) => {
      const rect = joyBase.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;
      const maxRadius = Math.max(36, rect.width * 0.44);

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      let nx = dx;
      let ny = dy;
      if (dist > maxRadius && dist > 0) {
        nx = (dx / dist) * maxRadius;
        ny = (dy / dist) * maxRadius;
      }

      joyKnob.style.transform = `translate(calc(-50% + ${nx.toFixed(1)}px), calc(-50% + ${ny.toFixed(1)}px))`;

      const ratio = dist / maxRadius;
      if (ratio < 0.14) {
        this.callbacks.onTouchMove(0, 0, false);
        return;
      }

      const moveX = nx / maxRadius;
      const moveY = -ny / maxRadius;
      const sprinting = moveY > 0.78 && ratio > 0.85;
      this.callbacks.onTouchMove(moveX, moveY, sprinting);
    };

    const resetJoystick = () => {
      joyPointerId = null;
      joyKnob.style.transform = 'translate(-50%, -50%)';
      this.callbacks.onTouchMove(0, 0, false);
    };

    const resetAll = () => {
      if (joyPointerId !== null) {
        resetJoystick();
      }
      lookPointerId = null;
      if (firePointerId !== null) {
        firePointerId = null;
        fireBtn.classList.remove('active');
        this.callbacks.onTouchFire(false);
      }
      for (const [, entry] of heldButtons) {
        entry.el.classList.remove('active');
        entry.onRelease();
      }
      heldButtons.clear();
    };

    this.resetActiveTouchInputs = resetAll;

    this.touchControlsEl.addEventListener('contextmenu', (e) => e.preventDefault());

    joyZone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (joyPointerId !== null) return;
      joyPointerId = e.pointerId;
      updateJoystick(e.clientX, e.clientY);
    });

    lookZone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (lookPointerId !== null) return;
      lookPointerId = e.pointerId;
      lastLookX = e.clientX;
      lastLookY = e.clientY;
    });

    fireBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (firePointerId !== null) return;
      firePointerId = e.pointerId;
      lastFireX = e.clientX;
      lastFireY = e.clientY;
      fireBtn.classList.add('active');
      this.callbacks.onTouchFire(true);
    });

    const bindTapButton = (selector: string, onTap: () => void) => {
      const btn = this.root.querySelector(selector) as HTMLElement;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add('active');
        onTap();
        window.setTimeout(() => btn.classList.remove('active'), 110);
      });
    };

    const bindHoldButton = (selector: string, code: string) => {
      const btn = this.root.querySelector(selector) as HTMLElement;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (heldButtons.has(e.pointerId)) return;
        btn.classList.add('active');
        this.callbacks.onTouchKeyHold(code, true);
        heldButtons.set(e.pointerId, {
          el: btn,
          onRelease: () => this.callbacks.onTouchKeyHold(code, false)
        });
      });
    };

    bindTapButton('#touch-btn-crouch', () => this.callbacks.onTouchKeyPress('KeyC'));
    bindHoldButton('#touch-btn-jump', 'Space');
    bindHoldButton('#touch-btn-heal', 'KeyH');
    bindTapButton('#touch-btn-interact', () => this.callbacks.onTouchKeyPress('KeyF'));
    bindTapButton('#touch-btn-bino', () => {
      if (this.onTouchBinoculars) this.onTouchBinoculars();
      else if (this.callbacks.onTouchBinoculars) this.callbacks.onTouchBinoculars();
      else this.callbacks.onTouchKeyPress('KeyB');
    });
    bindTapButton('#touch-btn-melee', () => {
      if (this.onTouchMelee) this.onTouchMelee();
      else if (this.callbacks.onTouchMelee) this.callbacks.onTouchMelee();
      else this.callbacks.onTouchKeyPress('KeyV');
    });

    this.touchBtnAds.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.callbacks.onTouchAdsToggle();
    });

    bindTapButton('#touch-btn-reload', () => this.callbacks.onTouchKeyPress('KeyR'));
    bindHoldButton('#touch-btn-grenade', 'KeyG');
    bindTapButton('#touch-btn-smoke', () => this.onTouchSmoke?.());
    bindTapButton('#touch-btn-weapon', () => this.callbacks.onTouchCycleWeapon());

    pauseBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetAll();
      this.callbacks.onTouchPause();
    });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerId === joyPointerId) {
        updateJoystick(e.clientX, e.clientY);
      }
      if (e.pointerId === lookPointerId) {
        const dx = e.clientX - lastLookX;
        const dy = e.clientY - lastLookY;
        lastLookX = e.clientX;
        lastLookY = e.clientY;
        this.callbacks.onTouchLook(dx, dy);
      }
      if (e.pointerId === firePointerId) {
        const dx = e.clientX - lastFireX;
        const dy = e.clientY - lastFireY;
        lastFireX = e.clientX;
        lastFireY = e.clientY;
        this.callbacks.onTouchLook(dx, dy);
      }
    });

    const handlePointerEnd = (e: PointerEvent) => {
      if (e.pointerId === joyPointerId) {
        resetJoystick();
      }
      if (e.pointerId === lookPointerId) {
        lookPointerId = null;
      }
      if (e.pointerId === firePointerId) {
        firePointerId = null;
        fireBtn.classList.remove('active');
        this.callbacks.onTouchFire(false);
      }
      const held = heldButtons.get(e.pointerId);
      if (held) {
        held.el.classList.remove('active');
        held.onRelease();
        heldButtons.delete(e.pointerId);
      }
    };

    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    window.addEventListener('blur', resetAll);
  }
}
