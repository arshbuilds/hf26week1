import { Adventure } from './adventure.types';

export type AdventureStatus =
  | 'idle'
  | 'briefing'
  | 'active'
  | 'paused'
  | 'intermission'
  | 'completed';

export interface CompletedMissionRecord {
  missionId: string;
  actualSecondsTaken: number;
  completedAt: string;
  skipped: boolean;
  photoUrl?: string;
  notes?: string;
}

export interface RuntimeState {
  status: AdventureStatus;
  adventure: Adventure | null;
  currentMissionIndex: number;
  secondsRemainingInMission: number;
  totalSecondsElapsed: number;
  completedMissions: CompletedMissionRecord[];
  isMuted?: boolean;
}

export type RuntimeAction =
  | { type: 'LOAD_ADVENTURE'; adventure: Adventure }
  | { type: 'START_ADVENTURE' }
  | { type: 'TICK_SECOND' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE_CURRENT_MISSION'; photoUrl?: string; notes?: string }
  | { type: 'SKIP_CURRENT_MISSION' }
  | { type: 'EXTEND_TIME'; additionalSeconds: number }
  | { type: 'PROCEED_FROM_INTERMISSION' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_MUTE' };
