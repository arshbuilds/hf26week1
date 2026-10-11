import { CREATIVE_MISSIONS } from './creative';
import { EXPLORER_MISSIONS } from './explorer';
import { DETECTIVE_MISSIONS } from './detective';
import { ACTIVE_MISSIONS } from './active';
import { SOCIAL_MISSIONS } from './social';
import { AdventureVibe, ArcPhase, Mission } from '../../domain/mission.types';

export const ALL_MISSIONS: Mission[] = [
  ...CREATIVE_MISSIONS,
  ...EXPLORER_MISSIONS,
  ...DETECTIVE_MISSIONS,
  ...ACTIVE_MISSIONS,
  ...SOCIAL_MISSIONS,
];

export function getMissionsByVibe(vibe: AdventureVibe): Mission[] {
  return ALL_MISSIONS.filter((m) => m.vibes.includes(vibe));
}

export function getMissionsByPhase(phase: ArcPhase): Mission[] {
  return ALL_MISSIONS.filter((m) => m.arcPhase === phase);
}

export function getMissionById(id: string): Mission | undefined {
  return ALL_MISSIONS.find((m) => m.id === id);
}
