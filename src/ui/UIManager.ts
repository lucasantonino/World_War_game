import {
  GameScreen,
  GameSettings,
  HUDState,
  MissionConfig,
  MissionEndSummary,
  MissionId
} from '../types';
import { WEAPON_STATS } from '../entities/PlayerController';
import { MISSIONS } from '../world/MissionData';

export interface UICallbacks {
  onSelectMission: (id: MissionId) => void;
  onStartMissionBriefing: () => void;
  onEnterBattle: () => void;
  onResumeBattle: () => void;
  onRestartMission: () => void;
  onReturnToMenu: () => void;
  onNextMission: () => void;
  onSettingsChanged: (settings: GameSettings) => void;
}

const COVER_LABELS: Record<HUDState['coverState'], string> = {
  dugout: 'ABRIGO SEGURO',
  sheltered: 'EM COBERTURA',
  peeking: 'ESPIANDO',
  exposed: 'EXPOSTO!'
};

export class UIManager {
  private root: HTMLElement;
  private callbacks: UICallbacks;

  private selectedMissionId: MissionId = 0;
  private completedMissions = new Set<MissionId>();
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
  private objMainEl!: HTMLElement;
  private objSubEl!: HTMLElement;
  private airRaidEl!: HTMLElement;
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
  private coverPillEl!: HTMLElement;
  private coverTextEl!: HTMLElement;
  private postureTextEl!: HTMLElement;
  private hpNumEl!: HTMLElement;
  private bleedTagEl!: HTMLElement;
  private hpFillEl!: HTMLElement;
  private bandagesEl!: HTMLElement;
  private weaponNameEl!: HTMLElement;
  private ammoReadoutEl!: HTMLElement;
  private extraAmmoEl!: HTMLElement;
  private slotEls: HTMLElement[] = [];
  private controlsToastEl!: HTMLElement;

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
      nextBtn.classList.toggle('hidden', summary.missionId >= 3);
    } else {
      titleEl.textContent = 'BAIXA EM COMBATE';
      titleEl.setAttribute('style', 'color: #ef5343');
      subEl.textContent = `${summary.missionTitle} — Você caiu no campo de batalha`;
      causeBox.classList.remove('hidden');
      causeEl.textContent = summary.causeOfDeath;
      adviceEl.textContent = summary.tacticalAdvice;
      nextBtn.classList.add('hidden');
    }

    const mins = Math.floor(summary.durationSeconds / 60);
    const secs = Math.floor(summary.durationSeconds % 60);
    const acc =
      summary.shotsFired > 0
        ? Math.round((summary.shotsHit / summary.shotsFired) * 100)
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

    // 4. Objective & Alerts
    this.objMainEl.textContent = state.objectiveText;
    const distTag =
      state.objectiveDistance !== null ? ` • ${Math.round(state.objectiveDistance)}m` : '';
    this.objSubEl.textContent = `${state.objectiveSubtext}${distTag}`;

    if (state.airRaidAlert) {
      this.airRaidEl.textContent = state.airRaidAlert;
      this.airRaidEl.classList.remove('hidden');
    } else {
      this.airRaidEl.classList.add('hidden');
    }

    if (state.radioCaption) {
      this.radioEl.textContent = `RÁDIO ALIADO: "${state.radioCaption}"`;
      this.radioEl.classList.remove('hidden');
    } else {
      this.radioEl.classList.add('hidden');
    }

    // 5. Reticle & Hitmarker
    const hideReticle = state.adsFactor > 0.45 && state.weaponId !== 'bazooka';
    this.reticleEl.classList.toggle('hidden', hideReticle);
    const gap = Math.round(state.spreadPx);
    this.reticleTop.style.top = `${-7 - gap}px`;
    this.reticleBottom.style.top = `${4 + gap}px`;
    this.reticleLeft.style.left = `${-7 - gap}px`;
    this.reticleRight.style.left = `${4 + gap}px`;

    this.hitmarkerEl.style.opacity = state.hitMarkerTimer > 0 ? '0.95' : '0';
    this.hitmarkerEl.classList.toggle('crit', state.hitMarkerCrit);

    // 6. Contextual prompt, action bar & grenade warning
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

    // 7. Cover & Vitals
    this.coverPillEl.className = `cover-pill ${state.coverState}`;
    this.coverTextEl.textContent = COVER_LABELS[state.coverState];
    this.postureTextEl.textContent = state.mgMounted
      ? 'METRALHADORA'
      : state.isCrouching
        ? 'AGACHADO'
        : state.isSprinting
          ? 'CORRENDO'
          : 'EM PÉ';

    const hpInt = Math.max(0, Math.ceil(state.hp));
    this.hpNumEl.textContent = `${hpInt}`;
    this.hpFillEl.style.width = `${hpInt}%`;
    this.hpFillEl.classList.toggle('low', hpInt < 38 || state.bleeding);
    this.bleedTagEl.textContent = state.bleeding ? 'SANGRANDO — SEGURE [H]' : '';
    this.bandagesEl.textContent = `CURATIVOS [H]: ${state.bandages}`;

    // 8. Weapon & Ammo
    if (state.mgMounted) {
      this.weaponNameEl.textContent = 'Metralhadora Pesada M-19';
      const heatPct = Math.round(state.mgHeat * 100);
      this.ammoReadoutEl.innerHTML = state.mgOverheated
        ? `<span style="color:#ef5343;font-size:1.15rem">SUPERAQUECIDA</span>`
        : `${heatPct}% <span class="ammo-reserve">CALOR</span>`;
    } else {
      this.weaponNameEl.textContent = WEAPON_STATS[state.weaponId].name;
      if (state.weaponId === 'grenade') {
        this.ammoReadoutEl.innerHTML = `${state.grenades} <span class="ammo-reserve">UNID.</span>`;
      } else {
        this.ammoReadoutEl.innerHTML = `${state.ammoInMag} <span class="ammo-reserve">/ ${state.ammoReserve}</span>`;
      }
    }
    this.extraAmmoEl.textContent = `GRANADAS [G]: ${state.grenades}  •  FOGUETES: ${state.rockets}`;

    const slotOrder = ['rifle', 'smg', 'bazooka', 'grenade'];
    this.slotEls.forEach((el, idx) => {
      el.classList.toggle('active', !state.mgMounted && state.weaponId === slotOrder[idx]);
    });

    this.controlsToastEl.classList.toggle('hidden', !state.showControlsHint);
  }

  private buildDOM(): void {
    this.root.innerHTML = `
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
              <div class="survival-rule-row"><span class="rule-tag">BOMBARDEIO</span><span>Ao ouvir a sirene, corra para o <b>ABRIGO</b> subterrâneo na parede traseira.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">ANTITANQUE</span><span>Fuzis ricocheteiam em blindados — use a <b>Bazuca [3]</b> nos flancos ou traseira.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">HEMORRAGIA</span><span>Ferimentos graves sangram até a morte. Segure <b>[H]</b> protegido para estancar.</span></div>
            </div>
            <div class="cta-row">
              <button id="btn-start-campaign" class="btn-primary">Iniciar Operação</button>
              <button id="btn-open-settings-menu" class="btn-secondary">Configurações</button>
            </div>
          </div>

          <div class="operations-panel">
            <div class="panel-heading">
              <span>Teatro de Operações</span>
              <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--text-secondary)">4 MISSÕES TÁTICAS</span>
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
          </div>
          <div class="controls-grid">
            <div class="control-pair"><span>Mover / Correr</span><span><kbd>WASD</kbd> <kbd>Shift</kbd></span></div>
            <div class="control-pair"><span>Agachar / Escalar</span><span><kbd>C</kbd> <kbd>Espaço</kbd></span></div>
            <div class="control-pair"><span>Espiar Esq / Dir</span><span><kbd>Q</kbd> <kbd>E</kbd></span></div>
            <div class="control-pair"><span>Atirar / Mirar</span><span><kbd>LMB</kbd> <kbd>RMB</kbd></span></div>
            <div class="control-pair"><span>Armas / Recarregar</span><span><kbd>1-4</kbd> <kbd>R</kbd></span></div>
            <div class="control-pair"><span>Granada / Curativo</span><span><kbd>G</kbd> <kbd>H</kbd></span></div>
            <div class="control-pair"><span>Interagir / Chutar Granada</span><span><kbd>F</kbd></span></div>
            <div class="control-pair"><span>Pausar</span><span><kbd>ESC</kbd></span></div>
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

        <div id="controls-toast" class="controls-toast">
          [WASD] Mover • [C] Agachar • [Q/E] Espiar • [Espaço] Escalar<br />
          [1] Fuzil • [2] SMG • [3] Bazuca • [G] Granada • [H] Curativo • [F] Interagir
        </div>

        <div class="hud-top">
          <div class="compass-bar">
            <div id="compass-strip" class="compass-strip"></div>
            <div id="compass-obj" class="compass-obj-marker"></div>
            <div class="compass-needle"></div>
          </div>
          <div class="objective-banner">
            <div id="hud-obj-main" class="objective-main">OBJETIVO</div>
            <div id="hud-obj-sub" class="objective-sub">...</div>
          </div>
          <div id="hud-air-raid" class="air-raid-banner hidden">ALERTA AÉREO</div>
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
          <div class="vitals-box tabular">
            <div class="vitals-row">
              <span id="hud-hp-num" class="hp-num">100</span>
              <span id="hud-bleed-tag" class="bleed-tag"></span>
            </div>
            <div class="hp-track"><div id="hud-hp-fill" class="hp-fill" style="width:100%"></div></div>
            <div class="bandage-row">
              <span id="hud-bandages">CURATIVOS [H]: 3</span>
            </div>
          </div>
        </div>

        <div class="hud-bottom-right tabular">
          <div class="weapon-panel">
            <div id="hud-weapon-name" class="weapon-name">Fuzil M-42</div>
            <div id="hud-ammo-readout" class="ammo-readout">8 <span class="ammo-reserve">/ 56</span></div>
            <div id="hud-extra-ammo" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary);margin-top:4px">
              GRANADAS [G]: 3 • FOGUETES: 5
            </div>
          </div>
          <div class="weapon-slots">
            <div class="slot-chip active">[1] Fuzil</div>
            <div class="slot-chip">[2] SMG</div>
            <div class="slot-chip">[3] Bazuca</div>
            <div class="slot-chip">[4] Granada</div>
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
    this.objMainEl = this.root.querySelector('#hud-obj-main')!;
    this.objSubEl = this.root.querySelector('#hud-obj-sub')!;
    this.airRaidEl = this.root.querySelector('#hud-air-raid')!;
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
    this.coverPillEl = this.root.querySelector('#hud-cover-pill')!;
    this.coverTextEl = this.root.querySelector('#hud-cover-text')!;
    this.postureTextEl = this.root.querySelector('#hud-posture-text')!;
    this.hpNumEl = this.root.querySelector('#hud-hp-num')!;
    this.bleedTagEl = this.root.querySelector('#hud-bleed-tag')!;
    this.hpFillEl = this.root.querySelector('#hud-hp-fill')!;
    this.bandagesEl = this.root.querySelector('#hud-bandages')!;
    this.weaponNameEl = this.root.querySelector('#hud-weapon-name')!;
    this.ammoReadoutEl = this.root.querySelector('#hud-ammo-readout')!;
    this.extraAmmoEl = this.root.querySelector('#hud-extra-ammo')!;
    this.slotEls = Array.from(this.root.querySelectorAll('.slot-chip'));
    this.controlsToastEl = this.root.querySelector('#controls-toast')!;

    this.renderOperationsList();
    this.bindButtonEvents();
  }

  private renderOperationsList(): void {
    const listEl = this.root.querySelector('#ops-list')!;
    listEl.innerHTML = MISSIONS.map((m) => {
      const done = this.completedMissions.has(m.id);
      const selected = this.selectedMissionId === m.id;
      return `
        <button class="op-item ${selected ? 'selected' : ''}" data-op="${m.id}">
          <div class="op-top">
            <span class="op-title">${m.code} — ${m.title}</span>
            <span class="op-badge ${done ? 'done' : ''}">${done ? 'CONCLUÍDA' : 'DISPONÍVEL'}</span>
          </div>
          <div class="op-desc">${m.subtitle}</div>
        </button>
      `;
    }).join('');

    listEl.querySelectorAll('.op-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number((btn as HTMLElement).dataset.op) as MissionId;
        this.selectedMissionId = id;
        this.callbacks.onSelectMission(id);
        this.renderOperationsList();
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

  private bindButtonEvents(): void {
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
    this.root.querySelector('#btn-end-retry')!.addEventListener('click', () => {
      this.callbacks.onRestartMission();
    });
    this.root.querySelector('#btn-end-next')!.addEventListener('click', () => {
      this.callbacks.onNextMission();
    });

    const sensInput = this.root.querySelector('#set-sens') as HTMLInputElement;
    const volInput = this.root.querySelector('#set-vol') as HTMLInputElement;
    const qualSelect = this.root.querySelector('#set-qual') as HTMLSelectElement;

    const emitSettings = () => {
      this.settings = {
        mouseSensitivity: parseFloat(sensInput.value),
        masterVolume: parseFloat(volInput.value),
        quality: qualSelect.value as GameSettings['quality']
      };
      this.callbacks.onSettingsChanged(this.settings);
    };

    sensInput.addEventListener('input', emitSettings);
    volInput.addEventListener('input', emitSettings);
    qualSelect.addEventListener('change', emitSettings);
  }
}
