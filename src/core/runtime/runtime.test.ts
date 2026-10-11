import { describe, it, expect } from 'vitest';
import {
  adventureReducer,
  INITIAL_RUNTIME_STATE,
  AudioCueService,
} from './index';
import { Adventure } from '../domain/adventure.types';
import { ALL_MISSIONS } from '../data/catalog';

describe('Adventure Runtime Engine', () => {
  const sampleAdventure: Adventure = {
    id: 'test_adv_1',
    title: 'Park Quest',
    tagline: 'Explore together.',
    totalEstimatedMinutes: 25,
    createdAt: new Date().toISOString(),
    config: {
      totalMinutes: 25,
      participantCount: 3,
      vibe: 'creative',
      intensity: 'chill',
      environment: 'park',
    },
    missions: [
      {
        mission: ALL_MISSIONS[0],
        allocatedMinutes: 10,
        sequenceIndex: 0,
        phase: 'warmup',
        assignedRoles: [],
      },
      {
        mission: ALL_MISSIONS[1],
        allocatedMinutes: 15,
        sequenceIndex: 1,
        phase: 'climax',
        assignedRoles: [],
      },
    ],
  };

  describe('Adventure State Reducer', () => {
    it('should initialize and load an adventure into briefing status', () => {
      const state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });

      expect(state.status).toBe('briefing');
      expect(state.adventure).toEqual(sampleAdventure);
      expect(state.currentMissionIndex).toBe(0);
      expect(state.secondsRemainingInMission).toBe(600); // 10 min * 60
      expect(state.totalSecondsElapsed).toBe(0);
    });

    it('should start the adventure into active status', () => {
      const loaded = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });

      const started = adventureReducer(loaded, { type: 'START_ADVENTURE' });
      expect(started.status).toBe('active');
      expect(started.secondsRemainingInMission).toBe(600);
    });

    it('should tick seconds down and update total elapsed time', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      state = adventureReducer(state, { type: 'TICK_SECOND' });
      expect(state.secondsRemainingInMission).toBe(599);
      expect(state.totalSecondsElapsed).toBe(1);

      state = adventureReducer(state, { type: 'TICK_SECOND' });
      expect(state.secondsRemainingInMission).toBe(598);
      expect(state.totalSecondsElapsed).toBe(2);
    });

    it('should pause and resume the active timer', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      // Pause
      state = adventureReducer(state, { type: 'PAUSE' });
      expect(state.status).toBe('paused');

      // Ticking while paused should do nothing
      state = adventureReducer(state, { type: 'TICK_SECOND' });
      expect(state.secondsRemainingInMission).toBe(600);
      expect(state.totalSecondsElapsed).toBe(0);

      // Resume
      state = adventureReducer(state, { type: 'RESUME' });
      expect(state.status).toBe('active');

      state = adventureReducer(state, { type: 'TICK_SECOND' });
      expect(state.secondsRemainingInMission).toBe(599);
      expect(state.totalSecondsElapsed).toBe(1);
    });

    it('should extend time when requested', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      state = adventureReducer(state, {
        type: 'EXTEND_TIME',
        additionalSeconds: 120, // +2 min
      });
      expect(state.secondsRemainingInMission).toBe(720);
    });

    it('should transition to intermission and then next mission upon manual completion', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      // Simulate 60 seconds of progress
      for (let i = 0; i < 60; i++) {
        state = adventureReducer(state, { type: 'TICK_SECOND' });
      }

      // Complete mission 1 early
      state = adventureReducer(state, {
        type: 'COMPLETE_CURRENT_MISSION',
        notes: 'We finished building early!',
      });

      expect(state.status).toBe('intermission');
      expect(state.completedMissions).toHaveLength(1);
      expect(state.completedMissions[0].missionId).toBe(ALL_MISSIONS[0].id);
      expect(state.completedMissions[0].actualSecondsTaken).toBe(60);
      expect(state.completedMissions[0].notes).toBe('We finished building early!');

      // Proceed to next mission
      state = adventureReducer(state, { type: 'PROCEED_FROM_INTERMISSION' });
      expect(state.status).toBe('active');
      expect(state.currentMissionIndex).toBe(1);
      expect(state.secondsRemainingInMission).toBe(900); // 15 min * 60
    });

    it('should transition to completed after final mission is done', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      // Complete mission 1
      state = adventureReducer(state, { type: 'COMPLETE_CURRENT_MISSION' });
      state = adventureReducer(state, { type: 'PROCEED_FROM_INTERMISSION' });

      // Complete mission 2 (final)
      state = adventureReducer(state, { type: 'COMPLETE_CURRENT_MISSION' });
      expect(state.status).toBe('completed');
      expect(state.completedMissions).toHaveLength(2);
    });

    it('should record skipped missions properly', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      state = adventureReducer(state, { type: 'SKIP_CURRENT_MISSION' });
      expect(state.status).toBe('intermission');
      expect(state.completedMissions[0].skipped).toBe(true);
    });

    it('should auto-transition when secondsRemainingInMission reaches 0', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'START_ADVENTURE' });

      // Force 1 second remaining
      state = { ...state, secondsRemainingInMission: 1 };

      state = adventureReducer(state, { type: 'TICK_SECOND' });
      expect(state.status).toBe('intermission');
      expect(state.completedMissions).toHaveLength(1);
      expect(state.completedMissions[0].actualSecondsTaken).toBe(600);
    });

    it('should reset state cleanly', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, {
        type: 'LOAD_ADVENTURE',
        adventure: sampleAdventure,
      });
      state = adventureReducer(state, { type: 'RESET' });
      expect(state.status).toBe('idle');
      expect(state.adventure).toBeNull();
    });

    it('should toggle audio mute', () => {
      let state = adventureReducer(INITIAL_RUNTIME_STATE, { type: 'TOGGLE_MUTE' });
      expect(state.isMuted).toBe(true);
      state = adventureReducer(state, { type: 'TOGGLE_MUTE' });
      expect(state.isMuted).toBe(false);
    });
  });

  describe('AudioCueService', () => {
    it('should safely execute cue methods without throwing in test environment', () => {
      const audio = new AudioCueService();
      expect(() => audio.playHalfTimeCue()).not.toThrow();
      expect(() => audio.playOneMinuteWarning()).not.toThrow();
      expect(() => audio.playStageCompleteCue()).not.toThrow();

      audio.setMuted(true);
      expect(() => audio.playHalfTimeCue()).not.toThrow();
    });
  });
});
