export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private lowpass: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private windGain: GainNode | null = null;
  private tinnitusOsc: OscillatorNode | null = null;
  private tinnitusGain: GainNode | null = null;
  private tankDroneOsc: OscillatorNode | null = null;
  private tankDroneGain: GainNode | null = null;

  private masterVolume = 0.75;
  private heartbeatCooldown = 0;
  private distantArtilleryCooldown = 3.5;

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.lowpass = this.ctx.createBiquadFilter();
      this.lowpass.type = 'lowpass';
      this.lowpass.frequency.value = 18000;
      this.lowpass.Q.value = 0.7;
      this.lowpass.connect(this.masterGain);

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 1.0;
      this.sfxBus.connect(this.lowpass);

      this.noiseBuffer = this.createNoiseBuffer(2.5);
      this.setupAmbience();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.04);
    }
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.04 * white) / 1.04;
      data[i] = white * 0.55 + lastOut * 1.45;
    }
    return buf;
  }

  private setupAmbience(): void {
    if (!this.ctx || !this.noiseBuffer || !this.sfxBus || !this.masterGain) return;

    // Continuous cold battlefield wind
    const windSrc = this.ctx.createBufferSource();
    windSrc.buffer = this.noiseBuffer;
    windSrc.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 260;
    windFilter.Q.value = 1.6;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.07;

    windSrc.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.sfxBus);
    windSrc.start();

    // Tinnitus ring (bypasses lowpass filter)
    this.tinnitusOsc = this.ctx.createOscillator();
    this.tinnitusOsc.type = 'sine';
    this.tinnitusOsc.frequency.value = 3750;
    this.tinnitusGain = this.ctx.createGain();
    this.tinnitusGain.gain.value = 0;
    this.tinnitusOsc.connect(this.tinnitusGain);
    this.tinnitusGain.connect(this.masterGain);
    this.tinnitusOsc.start();

    // Tank rumble drone
    this.tankDroneOsc = this.ctx.createOscillator();
    this.tankDroneOsc.type = 'sawtooth';
    this.tankDroneOsc.frequency.value = 46;
    const tankFilter = this.ctx.createBiquadFilter();
    tankFilter.type = 'lowpass';
    tankFilter.frequency.value = 135;
    this.tankDroneGain = this.ctx.createGain();
    this.tankDroneGain.gain.value = 0;
    this.tankDroneOsc.connect(tankFilter);
    tankFilter.connect(this.tankDroneGain);
    this.tankDroneGain.connect(this.sfxBus);
    this.tankDroneOsc.start();
  }

  public updateState(
    dt: number,
    suppression: number,
    tinnitus: number,
    hp: number,
    bleeding: boolean,
    nearestTankDist: number,
    isPlaying: boolean
  ): void {
    if (!this.ctx || !this.lowpass || !this.tinnitusGain || !this.tankDroneGain || !this.windGain) {
      return;
    }
    const now = this.ctx.currentTime;

    if (!isPlaying) {
      this.tinnitusGain.gain.setTargetAtTime(0, now, 0.08);
      this.tankDroneGain.gain.setTargetAtTime(0, now, 0.08);
      this.lowpass.frequency.setTargetAtTime(16000, now, 0.1);
      this.windGain.gain.setTargetAtTime(0.035, now, 0.2);
      return;
    }

    this.windGain.gain.setTargetAtTime(0.065, now, 0.2);

    // Acoustic muffling under tinnitus / heavy suppression
    const muffle = Math.max(tinnitus, suppression * 0.72);
    const targetCutoff = 18000 * Math.pow(0.03, muffle);
    this.lowpass.frequency.setTargetAtTime(Math.max(460, targetCutoff), now, 0.08);

    // Ear ringing
    this.tinnitusGain.gain.setTargetAtTime(tinnitus * 0.095, now, 0.05);

    // Tank rumble proximity
    const tankProx = nearestTankDist < 42 ? Math.pow(1 - nearestTankDist / 42, 1.5) : 0;
    this.tankDroneGain.gain.setTargetAtTime(tankProx * 0.14, now, 0.12);

    // Heartbeat when critically injured, bleeding or pinned down
    this.heartbeatCooldown -= dt;
    const stress = Math.max(suppression, bleeding ? 0.65 : 0, hp < 35 ? (35 - hp) / 35 : 0);
    if (stress > 0.45 && this.heartbeatCooldown <= 0) {
      this.playHeartbeat(0.12 + stress * 0.16);
      this.heartbeatCooldown = Math.max(0.46, 0.92 - stress * 0.42);
    }

    // Distant horizon rumbles
    this.distantArtilleryCooldown -= dt;
    if (this.distantArtilleryCooldown <= 0) {
      this.playDistantThunder();
      this.distantArtilleryCooldown = 4 + Math.random() * 6;
    }
  }

  private getDestNode(pan: number): AudioNode {
    if (!this.ctx || !this.sfxBus) throw new Error('Audio not ready');
    if (Math.abs(pan) < 0.02 || !this.ctx.createStereoPanner) return this.sfxBus;
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    panner.connect(this.sfxBus);
    return panner;
  }

  private playHeartbeat(gainVal: number): void {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const pulse = (offset: number, amp: number) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(64, t + offset);
      osc.frequency.exponentialRampToValueAtTime(36, t + offset + 0.12);
      g.gain.setValueAtTime(0.001, t + offset);
      g.gain.linearRampToValueAtTime(amp, t + offset + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.16);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(t + offset);
      osc.stop(t + offset + 0.18);
    };
    pulse(0, gainVal);
    pulse(0.18, gainVal * 0.72);
  }

  private playDistantThunder(): void {
    if (!this.ctx || !this.noiseBuffer || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 140;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.06, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    const pan = this.getDestNode((Math.random() - 0.5) * 1.4);
    src.connect(filter);
    filter.connect(g);
    g.connect(pan);
    src.start(t);
    src.stop(t + 1.5);
  }

  public playGunshot(
    type: 'rifle' | 'smg' | 'mg' | 'bazooka' | 'tankCannon',
    distance = 0,
    pan = 0
  ): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const atten = distance <= 2 ? 1 : Math.max(0.04, 1 / (1 + distance * 0.075));
    if (atten < 0.05) return;

    const t = this.ctx.currentTime;
    const dest = this.getDestNode(pan);

    if (type === 'tankCannon') {
      this.playExplosion(Math.max(4, distance), 0.75, pan);
      return;
    }

    if (type === 'bazooka') {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(520, t);
      filter.frequency.exponentialRampToValueAtTime(1600, t + 0.35);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.45 * atten, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      src.connect(filter);
      filter.connect(g);
      g.connect(dest);
      src.start(t);
      src.stop(t + 0.58);
      return;
    }

    // Punchy body oscillator
    const osc = this.ctx.createOscillator();
    const og = this.ctx.createGain();
    osc.type = 'triangle';
    const startFreq = type === 'rifle' ? 210 : type === 'mg' ? 160 : 240;
    const dur = type === 'rifle' ? 0.14 : type === 'mg' ? 0.12 : 0.08;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + dur);
    og.gain.setValueAtTime((type === 'rifle' ? 0.42 : 0.28) * atten, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(og);
    og.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);

    // Crack noise burst
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = Math.max(420, (type === 'smg' ? 1900 : 1450) - distance * 14);
    filter.Q.value = 0.7;
    const ng = this.ctx.createGain();
    const peak = (type === 'rifle' ? 0.58 : type === 'mg' ? 0.48 : 0.38) * atten;
    const tail = type === 'rifle' ? 0.26 : type === 'mg' ? 0.2 : 0.11;
    ng.gain.setValueAtTime(peak, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + tail);
    src.connect(filter);
    filter.connect(ng);
    ng.connect(dest);
    src.start(t);
    src.stop(t + tail + 0.02);
  }

  public playGarandPing(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2420, t);
    osc.frequency.exponentialRampToValueAtTime(2360, t + 0.45);
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  public playBulletWhiz(pan = 0): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const t = this.ctx.currentTime;
    const dest = this.getDestNode(pan);

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2900 + Math.random() * 800, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.085);
    g.gain.setValueAtTime(0.095, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playExplosion(distance: number, scale = 1.0, pan = 0): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const atten = Math.max(0.08, Math.min(1.0, (1 / (1 + distance * 0.045)) * scale));
    const t = this.ctx.currentTime;
    const dest = this.getDestNode(pan);

    // Sub-bass shockwave
    const sub = this.ctx.createOscillator();
    const sg = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(92, t);
    sub.frequency.exponentialRampToValueAtTime(28, t + 0.65);
    sg.gain.setValueAtTime(0.75 * atten, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.72);
    sub.connect(sg);
    sg.connect(dest);
    sub.start(t);
    sub.stop(t + 0.75);

    // Blast roar
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1600, t);
    lp.frequency.exponentialRampToValueAtTime(140, t + 1.35);
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.82 * atten, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 1.45);
    src.connect(lp);
    lp.connect(ng);
    ng.connect(dest);
    src.start(t);
    src.stop(t + 1.5);
  }

  public playAirRaidSiren(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(760, t + 1.7);
    osc.frequency.linearRampToValueAtTime(360, t + 3.4);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1100;

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.4);
    g.gain.setValueAtTime(0.15, t + 2.6);
    g.gain.exponentialRampToValueAtTime(0.001, t + 3.5);

    osc.connect(lp);
    lp.connect(g);
    g.connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + 3.6);
  }

  public playBomberPass(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(-0.85, t);
      panner.pan.linearRampToValueAtTime(0.85, t + 4.8);
      panner.connect(this.sfxBus);
    }
    const target = panner ?? this.sfxBus;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.16, t + 1.8);
    g.gain.exponentialRampToValueAtTime(0.001, t + 5.0);
    g.connect(target);

    for (const freq of [58, 87, 116]) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 260;
      osc.connect(lp);
      lp.connect(g);
      osc.start(t);
      osc.stop(t + 5.1);
    }
  }

  public playBombWhistle(pan = 0): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.getDestNode(pan);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1180, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 1.25);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.25);
    g.gain.linearRampToValueAtTime(0.15, t + 1.15);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.28);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.3);
  }

  public playRicochet(pan = 0): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.getDestNode(pan);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200 + Math.random() * 700, t);
    osc.frequency.exponentialRampToValueAtTime(980, t + 0.18);
    g.gain.setValueAtTime(0.14, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playHeadshotPing(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1650, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playFootstep(onWood: boolean): void {
    if (!this.ctx || !this.noiseBuffer || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = onWood ? 420 : 230;
    filter.Q.value = 1.4;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(onWood ? 0.11 : 0.085, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus);
    src.start(t);
    src.stop(t + 0.09);
  }

  public playGrenadeBounce(distance = 4): void {
    if (!this.ctx || !this.sfxBus) return;
    const atten = Math.max(0.05, 1 / (1 + distance * 0.15));
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.06);
    g.gain.setValueAtTime(0.12 * atten, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  public playReload(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    for (const [offset, freq] of [
      [0, 380],
      [0.24, 520]
    ]) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + offset);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t + offset + 0.05);
      g.gain.setValueAtTime(0.08, t + offset);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.055);
      osc.connect(g);
      g.connect(this.sfxBus);
      osc.start(t + offset);
      osc.stop(t + offset + 0.06);
    }
  }

  public playRadioStatic(): void {
    if (!this.ctx || !this.noiseBuffer || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1850;
    filter.Q.value = 2.4;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus);
    src.start(t);
    src.stop(t + 0.15);
  }

  public playUiClick(): void {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(640, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.045);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.055);
  }
}
