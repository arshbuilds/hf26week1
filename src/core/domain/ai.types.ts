import { AdventureConfig } from './adventure.types';
import { Mission, MissionRole, VerificationType } from './mission.types';

export type AIProviderType =
  | 'in-browser-open-weight'
  | 'ollama'
  | 'huggingface'
  | 'deterministic-fallback';

export interface AIProviderConfig {
  modelName: string;
  providerType: AIProviderType;
  endpointUrl?: string;
  temperature?: number;
}

export interface AIAdventurePrompt {
  config: AdventureConfig;
  candidateMissions: Mission[];
  userLocationContext?: string; // e.g. "Community Park", "City Center", "Forest Trail"
}

export interface AIGeneratedMission {
  title: string;
  brief: string;
  instructions: string[];
  cooperativeHook: string;
  roles: MissionRole[];
  suggestedMinutes: number;
  verificationType: VerificationType;
}

export interface AIGenerationResult {
  adventureTitle: string;
  adventureTagline: string;
  missions: AIGeneratedMission[];
  modelUsed: string;
  latencyMs: number;
}

export interface AIProvider {
  readonly providerType: AIProviderType;
  readonly modelName: string;
  isAvailable(): Promise<boolean>;
  generateAdventure(prompt: AIAdventurePrompt): Promise<AIGenerationResult>;
}
