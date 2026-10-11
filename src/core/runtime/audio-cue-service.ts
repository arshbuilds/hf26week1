export class AudioCueService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor(isMuted: boolean = false) {
    this.isMuted = isMuted;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playHalfTimeCue(): void {
    if (this.isMuted) return;
    this.vibrate([150]);

    const ctx = this.initContext();
    if (!ctx) return;

    this.playTone(ctx, 440, 0.25, 'sine');
    setTimeout(() => {
      if (ctx) this.playTone(ctx, 554.37, 0.35, 'sine');
    }, 200);
  }

  playOneMinuteWarning(): void {
    if (this.isMuted) return;
    this.vibrate([100, 100, 150]);

    const ctx = this.initContext();
    if (!ctx) return;

    this.playTone(ctx, 659.25, 0.2, 'triangle');
    setTimeout(() => {
      if (ctx) this.playTone(ctx, 880, 0.3, 'triangle');
    }, 180);
  }

  playStageCompleteCue(): void {
    if (this.isMuted) return;
    this.vibrate([200, 100, 300]);

    const ctx = this.initContext();
    if (!ctx) return;

    // Triumphant major triad: C5 (523.25), E5 (659.25), G5 (783.99)
    this.playTone(ctx, 523.25, 0.2, 'sine');
    setTimeout(() => ctx && this.playTone(ctx, 659.25, 0.2, 'sine'), 150);
    setTimeout(() => ctx && this.playTone(ctx, 783.99, 0.45, 'sine'), 300);
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType
  ): void {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private vibrate(pattern: number[]): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics unsupported
      }
    }
  }
}
