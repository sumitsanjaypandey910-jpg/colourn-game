// Kids sound synthesizer using Web Audio API

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Melodic notes for color selection (C major pentatonic scale)
  playColorPick(index: number = 0) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = pentatonic[index % pentatonic.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // Audio autoplay restrictions or errors silently ignored
    }
  }

  // Juicy "bloop/pop" sound for fill bucket
  playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch {}
  }

  // Twinkling sparkle sound for sparkle brush or stickers
  playSparkle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + i * 0.05);
        osc.stop(this.ctx!.currentTime + i * 0.05 + 0.22);
      });
    } catch {}
  }

  // Cute boing/stamp sound for stickers
  playStickerStamp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // Soft woosh sound when erasing or clearing
  playSwoosh() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // Celebratory fanfare chime (Tada!)
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [
        { f: 523.25, d: 0.1 },  // C5
        { f: 659.25, d: 0.1 },  // E5
        { f: 783.99, d: 0.1 },  // G5
        { f: 1046.50, d: 0.4 }, // C6
      ];

      let t = this.ctx.currentTime;
      notes.forEach((n, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = idx === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d + 0.05);

        t += (idx === 2 ? 0.15 : 0.09);
      });
    } catch {}
  }
}

export class BackgroundMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private volume: number = 0.45; // 0 to 1
  private stepDuration: number = 0.27; // 110 BPM eighth notes

  private melodyNotes: (number | null)[] = [
    // Bar 1 (C)
    523.25, 659.25, 783.99, 659.25,
    // Bar 2 (F)
    880.00, 1046.50, 880.00, 698.46,
    // Bar 3 (G)
    987.77, 1174.66, 987.77, 783.99,
    // Bar 4 (C)
    1046.50, 783.99, 659.25, 523.25,
    // Bar 5 (Am)
    880.00, 659.25, 880.00, 1046.50,
    // Bar 6 (Dm/F)
    698.46, 880.00, 1174.66, 880.00,
    // Bar 7 (G7)
    783.99, 698.46, 587.33, 493.88,
    // Bar 8 (C resolution)
    523.25, 659.25, 783.99, 1046.50,
  ];

  private bassNotes: (number | null)[] = [
    // Bar 1
    130.81, null, 196.00, null,
    // Bar 2
    174.61, null, 130.81, null,
    // Bar 3
    196.00, null, 146.83, null,
    // Bar 4
    130.81, null, 164.81, null,
    // Bar 5
    220.00, null, 164.81, null,
    // Bar 6
    146.83, null, 174.61, null,
    // Bar 7
    196.00, null, 246.94, null,
    // Bar 8
    130.81, null, 196.00, null,
  ];

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isPlaying ? this.volume : 0, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public start() {
    if (this.isPlaying) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.scheduler();
    this.timerId = window.setInterval(() => this.scheduler(), 35);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  private scheduler() {
    if (!this.ctx || !this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + 0.25) {
      this.playStep(this.currentStep, this.nextNoteTime);
      this.nextNoteTime += this.stepDuration;
      this.currentStep = (this.currentStep + 1) % 32;
    }
  }

  private playStep(step: number, time: number) {
    const melodyFreq = this.melodyNotes[step];
    if (melodyFreq) {
      this.playNote(time, melodyFreq, 0.24, false);
    }

    const bassFreq = this.bassNotes[step];
    if (bassFreq) {
      this.playNote(time, bassFreq, 0.36, true);
    }
  }

  private playNote(time: number, freq: number, duration: number, isBass: boolean) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (isBass) {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      } else {
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, time);
        filter.frequency.exponentialRampToValueAtTime(700, time + duration);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.13, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      }

      osc.frequency.setValueAtTime(freq, time);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch {}
  }
}

export const sounds = new SoundEffects();
export const music = new BackgroundMusicPlayer();

