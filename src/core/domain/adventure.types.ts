import {
  AdventureVibe,
  ArcPhase,
  Environment,
  Intensity,
  Mission,
  MissionRole,
} from './mission.types';

export interface AdventureConfig {
  totalMinutes: number; // e.g. 15 to 120
  participantCount: number; // e.g. 1 to 12
  vibe: AdventureVibe;
  intensity: Intensity;
  environment: Environment;
  useAI?: boolean;
  seed?: string;
}

export interface AssignedRole {
  role: MissionRole;
  participantNumber: number;
}

export interface ScheduledMission {
  mission: Mission;
  allocatedMinutes: number;
  sequenceIndex: number;
  phase: ArcPhase;
  assignedRoles: AssignedRole[];
  customAIHook?: string;
}

export interface Adventure {
  id: string;
  title: string;
  tagline: string;
  config: AdventureConfig;
  missions: ScheduledMission[];
  totalEstimatedMinutes: number;
  createdAt: string;
  generatedByAI?: boolean;
  aiModel?: string;
}
