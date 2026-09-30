/**
 * Web Audio API synthesizer for high-tech automotive sound effects & cinematic audio
 */
export class IntroAudioEngine {
  private ctx: AudioContext | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmInterval: any = null;

  constructor() {
    // Lazy initialize upon first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.35;
      this.sfxGain.gain.value = 0.6;
      this.bgmGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVoiceAudio(audioSrc: string) {
    this.voiceAudio = new Audio(audioSrc);
    this.voiceAudio.preload = 'auto';
  }

  public playVoiceover(volume = 1.0) {
    if (this.voiceAudio) {
      this.voiceAudio.currentTime = 0;
      this.voiceAudio.volume = Math.max(0, Math.min(1, volume));
      this.voiceAudio.play().catch(() => {});
    }
  }

  public pauseVoiceover() {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
    }
  }

  public seekVoiceover(seconds: number) {
    if (this.voiceAudio) {
      this.voiceAudio.currentTime = Math.max(0, seconds);
    }
  }

  // Cinematic Sub-Bass Impact
  public playSubBassDrop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Turbo Whoosh transition
  public playWhoosh() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.0;

    const now = this.ctx.currentTime;
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3500, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.6);
  }

  // Futuristic car acceleration / RPM rev
  public playEngineRev() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.9);
    osc.frequency.exponentialRampToValueAtTime(140, now + 1.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.9);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.4);
  }

  // High-tech HUD digital beep
  public playHudBeep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.setValueAtTime(2400, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Ambient Cyberpunk Synthwave Beat loop
  public startSynthwaveBgm() {
    this.initContext();
    if (!this.ctx || !this.bgmGain || this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    let step = 0;
    const bassNotes = [55, 55, 65, 55, 49, 49, 73, 65]; // A1, C2, G1, D2 sequence

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || !this.bgmGain || !this.isBgmPlaying) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const note = bassNotes[step % bassNotes.length];
      step++;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.2);
    }, 220); // ~136 BPM sixteenth pulse
  }

  public stopSynthwaveBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public setVolumes(voiceVol: number, sfxVol: number, bgmVol: number) {
    if (this.voiceAudio) {
      this.voiceAudio.volume = Math.max(0, Math.min(1, voiceVol));
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = Math.max(0, Math.min(1, sfxVol));
    }
    if (this.bgmGain) {
      this.bgmGain.gain.value = Math.max(0, Math.min(1, bgmVol));
    }
  }

  public stopAll() {
    this.pauseVoiceover();
    this.stopSynthwaveBgm();
  }
}

export const introAudio = new IntroAudioEngine();
