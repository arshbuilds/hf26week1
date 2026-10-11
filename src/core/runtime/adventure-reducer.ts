import {
  RuntimeAction,
  RuntimeState,
} from '../domain/runtime.types';

export const INITIAL_RUNTIME_STATE: RuntimeState = {
  status: 'idle',
  adventure: null,
  currentMissionIndex: 0,
  secondsRemainingInMission: 0,
  totalSecondsElapsed: 0,
  completedMissions: [],
  isMuted: false,
};

export function adventureReducer(
  state: RuntimeState,
  action: RuntimeAction
): RuntimeState {
  switch (action.type) {
    case 'LOAD_ADVENTURE': {
      const firstMission = action.adventure.missions[0];
      const initialSeconds = firstMission ? firstMission.allocatedMinutes * 60 : 0;
      return {
        ...INITIAL_RUNTIME_STATE,
        adventure: action.adventure,
        status: 'briefing',
        currentMissionIndex: 0,
        secondsRemainingInMission: initialSeconds,
        isMuted: state.isMuted,
      };
    }

    case 'START_ADVENTURE': {
      if (!state.adventure || state.adventure.missions.length === 0) {
        return state;
      }
      const firstMission = state.adventure.missions[0];
      return {
        ...state,
        status: 'active',
        currentMissionIndex: 0,
        secondsRemainingInMission: firstMission.allocatedMinutes * 60,
      };
    }

    case 'TICK_SECOND': {
      if (state.status !== 'active' || !state.adventure) {
        return state;
      }

      const nextRemaining = state.secondsRemainingInMission - 1;
      const nextTotalElapsed = state.totalSecondsElapsed + 1;

      // When mission countdown reaches 0, auto-transition to intermission or complete
      if (nextRemaining <= 0) {
        const currentMission = state.adventure.missions[state.currentMissionIndex];
        const record = {
          missionId: currentMission.mission.id,
          actualSecondsTaken: currentMission.allocatedMinutes * 60,
          completedAt: new Date().toISOString(),
          skipped: false,
        };

        const isLastMission =
          state.currentMissionIndex >= state.adventure.missions.length - 1;

        return {
          ...state,
          status: isLastMission ? 'completed' : 'intermission',
          secondsRemainingInMission: 0,
          totalSecondsElapsed: nextTotalElapsed,
          completedMissions: [...state.completedMissions, record],
        };
      }

      return {
        ...state,
        secondsRemainingInMission: nextRemaining,
        totalSecondsElapsed: nextTotalElapsed,
      };
    }

    case 'PAUSE': {
      if (state.status !== 'active') return state;
      return {
        ...state,
        status: 'paused',
      };
    }

    case 'RESUME': {
      if (state.status !== 'paused') return state;
      return {
        ...state,
        status: 'active',
      };
    }

    case 'COMPLETE_CURRENT_MISSION': {
      if (!state.adventure || (state.status !== 'active' && state.status !== 'paused')) {
        return state;
      }

      const currentMission = state.adventure.missions[state.currentMissionIndex];
      const allocatedSec = currentMission.allocatedMinutes * 60;
      const takenSec = Math.max(1, allocatedSec - state.secondsRemainingInMission);

      const record = {
        missionId: currentMission.mission.id,
        actualSecondsTaken: takenSec,
        completedAt: new Date().toISOString(),
        skipped: false,
        photoUrl: action.photoUrl,
        notes: action.notes,
      };

      const isLastMission =
        state.currentMissionIndex >= state.adventure.missions.length - 1;

      return {
        ...state,
        status: isLastMission ? 'completed' : 'intermission',
        secondsRemainingInMission: 0,
        completedMissions: [...state.completedMissions, record],
      };
    }

    case 'SKIP_CURRENT_MISSION': {
      if (!state.adventure || (state.status !== 'active' && state.status !== 'paused')) {
        return state;
      }

      const currentMission = state.adventure.missions[state.currentMissionIndex];
      const record = {
        missionId: currentMission.mission.id,
        actualSecondsTaken: 0,
        completedAt: new Date().toISOString(),
        skipped: true,
      };

      const isLastMission =
        state.currentMissionIndex >= state.adventure.missions.length - 1;

      return {
        ...state,
        status: isLastMission ? 'completed' : 'intermission',
        secondsRemainingInMission: 0,
        completedMissions: [...state.completedMissions, record],
      };
    }

    case 'EXTEND_TIME': {
      if (state.status !== 'active' && state.status !== 'paused') {
        return state;
      }
      return {
        ...state,
        secondsRemainingInMission:
          state.secondsRemainingInMission + action.additionalSeconds,
      };
    }

    case 'PROCEED_FROM_INTERMISSION': {
      if (state.status !== 'intermission' || !state.adventure) {
        return state;
      }

      const nextIndex = state.currentMissionIndex + 1;
      if (nextIndex >= state.adventure.missions.length) {
        return {
          ...state,
          status: 'completed',
        };
      }

      const nextMission = state.adventure.missions[nextIndex];
      return {
        ...state,
        status: 'active',
        currentMissionIndex: nextIndex,
        secondsRemainingInMission: nextMission.allocatedMinutes * 60,
      };
    }

    case 'RESET': {
      return {
        ...INITIAL_RUNTIME_STATE,
        isMuted: state.isMuted,
      };
    }

    case 'TOGGLE_MUTE': {
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    }

    default:
      return state;
  }
}
