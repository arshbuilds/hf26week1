export type ArcPhase = 'warmup' | 'exploration' | 'climax' | 'epilogue';

export type AdventureVibe =
  | 'creative'
  | 'explorer'
  | 'detective'
  | 'active'
  | 'social';

export type Environment =
  | 'any'
  | 'outdoor'
  | 'indoor'
  | 'park'
  | 'urban';

export type Intensity =
  | 'chill'
  | 'standard'
  | 'high_energy';

export type VerificationType =
  | 'honor'
  | 'photo'
  | 'action';

export interface MissionRole {
  id: string;
  title: string;
  duty: string;
}

export interface DurationBounds {
  minMinutes: number;
  defaultMinutes: number;
  maxMinutes: number;
}

export interface Mission {
  id: string;
  title: string;
  brief: string;
  instructions: string[];
  cooperativeHook: string; // Explains why and how the team cooperates
  vibes: AdventureVibe[];
  arcPhase: ArcPhase;
  intensity: Intensity;
  environments: Environment[];
  minParticipants: number;
  maxParticipants: number;
  durationBounds: DurationBounds;
  suggestedRoles?: MissionRole[];
  verificationType: VerificationType;
  tags: string[];
}
