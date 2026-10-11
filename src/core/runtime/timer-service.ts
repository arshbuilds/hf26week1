export type TimerCallback = (elapsedSeconds: number) => void;

export class DriftCompensatedTimer {
  private timerId: number | null = null;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private accumulatedMs: number = 0;
  private onTick: TimerCallback;

  constructor(onTick: TimerCallback) {
    this.onTick = onTick;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = Date.now();
    this.accumulatedMs = 0;

    this.scheduleNextTick();
  }

  pause(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  resume(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = Date.now();
    this.scheduleNextTick();
  }

  stop(): void {
    this.pause();
    this.accumulatedMs = 0;
  }

  getRunning(): boolean {
    return this.isRunning;
  }

  private scheduleNextTick(): void {
    if (!this.isRunning) return;

    // Use a precise 250ms check loop to compensate for mobile throttle drift
    this.timerId = window.setTimeout(() => {
      if (!this.isRunning) return;

      const now = Date.now();
      const delta = now - this.lastTimestamp;
      this.lastTimestamp = now;
      this.accumulatedMs += delta;

      // Trigger one tick per elapsed 1000ms
      while (this.accumulatedMs >= 1000) {
        this.accumulatedMs -= 1000;
        this.onTick(1);
      }

      this.scheduleNextTick();
    }, 250);
  }
}
