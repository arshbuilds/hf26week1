import { useState, useEffect, useRef, useCallback } from 'react';
import { Adventure } from '../../core/domain/adventure.types';
import {
  adventureReducer,
  INITIAL_RUNTIME_STATE,
  AudioCueService,
  DriftCompensatedTimer,
} from '../../core/runtime';
import { RuntimeState } from '../../core/domain/runtime.types';
import { LocalStorageRepository } from '../../infrastructure/persistence/local-storage-repository';

export function useAdventureRuntime() {
  const [state, setState] = useState<RuntimeState>(() => {
    const saved = LocalStorageRepository.loadSession();
    return saved || INITIAL_RUNTIME_STATE;
  });

  const audioServiceRef = useRef<AudioCueService>(new AudioCueService());
  const timerRef = useRef<DriftCompensatedTimer | null>(null);

  // Auto-save session on state changes
  useEffect(() => {
    LocalStorageRepository.saveSession(state);
  }, [state]);

  // Initialize timer service
  useEffect(() => {
    timerRef.current = new DriftCompensatedTimer(() => {
      setState((prev) => adventureReducer(prev, { type: 'TICK_SECOND' }));
    });

    return () => {
      timerRef.current?.stop();
    };
  }, []);

  // Sync timer with active status
  useEffect(() => {
    if (state.status === 'active') {
      timerRef.current?.resume();
    } else {
      timerRef.current?.pause();
    }
  }, [state.status]);

  // Audio/Haptic Cues for Pacing Thresholds
  useEffect(() => {
    if (state.status === 'active' && state.adventure) {
      const currentMission = state.adventure.missions[state.currentMissionIndex];
      const totalSec = currentMission ? currentMission.allocatedMinutes * 60 : 600;
      const halfSec = Math.floor(totalSec / 2);

      if (state.secondsRemainingInMission === halfSec) {
        audioServiceRef.current.playHalfTimeCue();
      } else if (state.secondsRemainingInMission === 60) {
        audioServiceRef.current.playOneMinuteWarning();
      }
    } else if (state.status === 'intermission' || state.status === 'completed') {
      audioServiceRef.current.playStageCompleteCue();
    }
  }, [state.secondsRemainingInMission, state.status, state.currentMissionIndex, state.adventure]);

  // Sync mute state
  useEffect(() => {
    audioServiceRef.current.setMuted(Boolean(state.isMuted));
  }, [state.isMuted]);

  // Action Dispatchers
  const loadAdventure = useCallback((adventure: Adventure) => {
    setState((prev) => adventureReducer(prev, { type: 'LOAD_ADVENTURE', adventure }));
  }, []);

  const startAdventure = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'START_ADVENTURE' }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'PAUSE' }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'RESUME' }));
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'active') {
        return adventureReducer(prev, { type: 'PAUSE' });
      } else if (prev.status === 'paused') {
        return adventureReducer(prev, { type: 'RESUME' });
      }
      return prev;
    });
  }, []);

  const completeCurrentMission = useCallback((notes?: string, photoUrl?: string) => {
    setState((prev) =>
      adventureReducer(prev, { type: 'COMPLETE_CURRENT_MISSION', notes, photoUrl })
    );
  }, []);

  const skipCurrentMission = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'SKIP_CURRENT_MISSION' }));
  }, []);

  const extendTime = useCallback((additionalMinutes: number) => {
    setState((prev) =>
      adventureReducer(prev, {
        type: 'EXTEND_TIME',
        additionalSeconds: additionalMinutes * 60,
      })
    );
  }, []);

  const proceedFromIntermission = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'PROCEED_FROM_INTERMISSION' }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'RESET' }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => adventureReducer(prev, { type: 'TOGGLE_MUTE' }));
  }, []);

  return {
    state,
    loadAdventure,
    startAdventure,
    pause,
    resume,
    togglePause,
    completeCurrentMission,
    skipCurrentMission,
    extendTime,
    proceedFromIntermission,
    reset,
    toggleMute,
  };
}
