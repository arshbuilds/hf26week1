import { RuntimeState } from '../../core/domain/runtime.types';

const STORAGE_KEY = 'adventure_generator_session_v1';

export class LocalStorageRepository {
  private static getStorage(): Storage | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return null;
  }

  static saveSession(state: RuntimeState): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      if (state.status === 'idle') {
        storage.removeItem(STORAGE_KEY);
      } else {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Storage quota or privacy sandbox fallback
    }
  }

  static loadSession(): RuntimeState | null {
    const storage = this.getStorage();
    if (!storage) return null;

    try {
      const data = storage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as RuntimeState;
      if (parsed && parsed.status && parsed.status !== 'idle') {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
