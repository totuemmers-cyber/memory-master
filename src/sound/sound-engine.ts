class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'square',
    options?: { attack?: number; decay?: number; detune?: number }
  ): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = frequency;
      if (options?.detune) osc.detune.value = options.detune;

      const now = ctx.currentTime;
      const attack = options?.attack ?? 0.01;
      const decay = options?.decay ?? 0.05;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + attack);
      gain.gain.linearRampToValueAtTime(0, now + duration - decay);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio errors
    }
  }

  playCorrect(): void {
    this.playTone(523, 0.1, 'square');
    setTimeout(() => this.playTone(659, 0.15, 'square'), 100);
  }

  playWrong(): void {
    this.playTone(200, 0.3, 'sawtooth', { detune: -10 });
  }

  playAchievement(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'square'), i * 150);
    });
  }

  playLevelUp(): void {
    const notes = [262, 330, 392, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'square'), i * 100);
    });
  }

  playClick(): void {
    this.playTone(800, 0.05, 'square');
  }

  playTimerWarning(): void {
    this.playTone(880, 0.1, 'square');
  }

  playCountdown(): void {
    this.playTone(440, 0.15, 'square');
  }

  playStart(): void {
    this.playTone(440, 0.1, 'square');
    setTimeout(() => this.playTone(660, 0.1, 'square'), 150);
    setTimeout(() => this.playTone(880, 0.2, 'square'), 300);
  }
}

export const soundEngine = new SoundEngine();
