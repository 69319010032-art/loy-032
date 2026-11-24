/**
 * Procedural Web Audio Ambient Soundscape
 * Synthesizes peaceful river water, night crickets, and serene acoustic Thai chime notes.
 * 100% self-contained, no external mp3 assets needed.
 */

class LoyKrathongAudio {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private chimeTimer: any = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    // 1. Flowing River Water (Filtered Noise + LFO)
    this.createWaterFlow();

    // 2. Night Crickets & River Ambience
    this.createNightCrickets();

    // 3. Gentle Periodic Thai Pentatonic Chimes
    this.startSereneChimes();
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.ctx && !this.isPlaying) {
          this.ctx.suspend();
        }
      }, 1000);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      }
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private createWaterFlow() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink/Brown noise integration
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // Subtle undulating wave LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(this.masterGain);
    noise.start();
  }

  private createNightCrickets() {
    if (!this.ctx || !this.masterGain) return;
    const cricketOsc = this.ctx.createOscillator();
    cricketOsc.type = 'sine';
    cricketOsc.frequency.setValueAtTime(4600, this.ctx.currentTime);

    const ampMod = this.ctx.createOscillator();
    ampMod.frequency.setValueAtTime(14, this.ctx.currentTime);

    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

    ampMod.connect(modGain.gain);

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

    cricketOsc.connect(modGain);
    modGain.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    cricketOsc.start();
    ampMod.start();
  }

  private startSereneChimes() {
    // Pentatonic scale frequencies (C5, D5, E5, G5, A5, C6)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    
    const playNote = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Warm chime envelope
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 4.6);
    };

    // Play a gentle note every 4-7 seconds
    this.chimeTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        playNote();
      }
    }, 4500);
  }
}

export const audioSystem = new LoyKrathongAudio();
