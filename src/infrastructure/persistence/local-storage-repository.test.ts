import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageRepository } from './local-storage-repository';
import { INITIAL_RUNTIME_STATE } from '../../core/runtime';
import { RuntimeState } from '../../core/domain/runtime.types';

describe('LocalStorageRepository', () => {
  let storageMap: Record<string, string> = {};

  beforeEach(() => {
    storageMap = {};
    const mockStorage: Storage = {
      getItem: (key: string) => storageMap[key] || null,
      setItem: (key: string, value: string) => {
        storageMap[key] = value;
      },
      removeItem: (key: string) => {
        delete storageMap[key];
      },
      clear: () => {
        storageMap = {};
      },
      length: 0,
      key: () => null,
    };

    (globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage;
  });

  it('should save and reload an active session state', () => {
    const activeState: RuntimeState = {
      ...INITIAL_RUNTIME_STATE,
      status: 'active',
      currentMissionIndex: 1,
      secondsRemainingInMission: 340,
      totalSecondsElapsed: 260,
    };

    LocalStorageRepository.saveSession(activeState);
    const loaded = LocalStorageRepository.loadSession();

    expect(loaded).toBeDefined();
    expect(loaded?.status).toBe('active');
    expect(loaded?.currentMissionIndex).toBe(1);
    expect(loaded?.secondsRemainingInMission).toBe(340);
  });

  it('should clear stored session when state returns to idle', () => {
    const activeState: RuntimeState = {
      ...INITIAL_RUNTIME_STATE,
      status: 'active',
    };
    LocalStorageRepository.saveSession(activeState);

    // Save idle state
    LocalStorageRepository.saveSession(INITIAL_RUNTIME_STATE);
    const loaded = LocalStorageRepository.loadSession();

    expect(loaded).toBeNull();
  });

  it('should explicitly clear stored session upon clearSession()', () => {
    const activeState: RuntimeState = {
      ...INITIAL_RUNTIME_STATE,
      status: 'briefing',
    };
    LocalStorageRepository.saveSession(activeState);
    LocalStorageRepository.clearSession();

    expect(LocalStorageRepository.loadSession()).toBeNull();
  });
});
