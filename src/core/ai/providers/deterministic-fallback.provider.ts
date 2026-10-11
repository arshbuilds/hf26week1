import {
  AIAdventurePrompt,
  AIGenerationResult,
  AIProvider,
  AIProviderType,
} from '../../domain/ai.types';
import { generateAdventure } from '../../generator/adventure-assembler';

export class DeterministicFallbackProvider implements AIProvider {
  readonly providerType: AIProviderType = 'deterministic-fallback';
  readonly modelName: string = 'rule-based-adventure-engine';

  async isAvailable(): Promise<boolean> {
    return true; // Always available on any device with zero network/GPU requirements
  }

  async generateAdventure(
    prompt: AIAdventurePrompt
  ): Promise<AIGenerationResult> {
    const startTime = performance.now();

    // Use our deterministic generator engine to synthesize the adventure
    const adventure = generateAdventure(prompt.config, prompt.candidateMissions);

    const generatedMissions = adventure.missions.map((sm) => ({
      title: sm.mission.title,
      brief: sm.mission.brief,
      instructions: sm.mission.instructions,
      cooperativeHook: sm.mission.cooperativeHook,
      roles: sm.mission.suggestedRoles || [],
      suggestedMinutes: sm.allocatedMinutes,
      verificationType: sm.mission.verificationType,
    }));

    // If user provided custom location context, append a location-aware flavor tagline
    let tagline = adventure.tagline;
    if (prompt.userLocationContext) {
      tagline = `${tagline} Custom tailored for: ${prompt.userLocationContext}.`;
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      adventureTitle: adventure.title,
      adventureTagline: tagline,
      missions: generatedMissions,
      modelUsed: this.modelName,
      latencyMs,
    };
  }
}
