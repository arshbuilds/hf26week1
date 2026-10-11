import {
  AIAdventurePrompt,
  AIGenerationResult,
  AIProvider,
  AIProviderType,
} from '../domain/ai.types';
import { Adventure, AdventureConfig, ScheduledMission } from '../domain/adventure.types';
import { Mission, ArcPhase } from '../domain/mission.types';
import { ALL_MISSIONS } from '../data/catalog';
import { DeterministicFallbackProvider } from './providers/deterministic-fallback.provider';
import { InBrowserOpenWeightProvider } from './providers/in-browser-open-weight.provider';
import { OllamaOpenModelProvider } from './providers/ollama.provider';
import { HuggingFaceOpenInferenceProvider } from './providers/huggingface.provider';
import { allocateTime } from '../generator/time-allocator';
import { assignRoles } from '../generator/role-assigner';
import { determineArcBlueprint } from '../generator/arc-sequencer';
import { validateAdventure } from '../domain/validator';

export interface OrchestratorOptions {
  preferredProvider?: AIProviderType;
  ollamaEndpoint?: string;
  ollamaModel?: string;
  hfApiToken?: string;
  hfModel?: string;
}

export class AIOrchestrator {
  private fallbackProvider: DeterministicFallbackProvider;
  private inBrowserProvider: InBrowserOpenWeightProvider;
  private ollamaProvider: OllamaOpenModelProvider;
  private hfProvider: HuggingFaceOpenInferenceProvider;

  constructor(options: OrchestratorOptions = {}) {
    this.fallbackProvider = new DeterministicFallbackProvider();
    this.inBrowserProvider = new InBrowserOpenWeightProvider();
    this.ollamaProvider = new OllamaOpenModelProvider(
      options.ollamaModel,
      options.ollamaEndpoint
    );
    this.hfProvider = new HuggingFaceOpenInferenceProvider(
      options.hfModel,
      options.hfApiToken
    );
  }

  getProvider(type: AIProviderType): AIProvider {
    switch (type) {
      case 'ollama':
        return this.ollamaProvider;
      case 'huggingface':
        return this.hfProvider;
      case 'in-browser-open-weight':
        return this.inBrowserProvider;
      case 'deterministic-fallback':
      default:
        return this.fallbackProvider;
    }
  }

  async synthesizeAdventure(
    config: AdventureConfig,
    userLocationContext?: string,
    preferredProvider: AIProviderType = 'in-browser-open-weight'
  ): Promise<Adventure> {
    const prompt: AIAdventurePrompt = {
      config,
      candidateMissions: ALL_MISSIONS.filter((m) => m.vibes.includes(config.vibe)),
      userLocationContext,
    };

    let result: AIGenerationResult;
    let providerUsed = preferredProvider;

    try {
      const provider = this.getProvider(preferredProvider);
      const isAvail = await provider.isAvailable();

      if (isAvail) {
        result = await provider.generateAdventure(prompt);
      } else {
        // Fallback to deterministic engine
        providerUsed = 'deterministic-fallback';
        result = await this.fallbackProvider.generateAdventure(prompt);
      }
    } catch {
      // Automatic fallback recovery on error
      providerUsed = 'deterministic-fallback';
      result = await this.fallbackProvider.generateAdventure(prompt);
    }

    // Convert AI synthesized missions into verified ScheduledMission instances
    return this.assembleAdventureFromAIResult(config, result, providerUsed);
  }

  private assembleAdventureFromAIResult(
    config: AdventureConfig,
    aiResult: AIGenerationResult,
    providerType: AIProviderType
  ): Adventure {
    const arcBlueprint = determineArcBlueprint(config.totalMinutes);

    // Map AI missions to domain Mission objects
    const domainMissions: Mission[] = aiResult.missions.map((aim, index) => {
      const phase: ArcPhase =
        index < arcBlueprint.length ? arcBlueprint[index] : 'exploration';
      const duration = aim.suggestedMinutes || 10;

      return {
        id: `ai_gen_${index + 1}_${Date.now()}`,
        title: aim.title,
        brief: aim.brief,
        instructions: aim.instructions,
        cooperativeHook: aim.cooperativeHook,
        vibes: [config.vibe],
        arcPhase: phase,
        intensity: config.intensity,
        environments: [config.environment],
        minParticipants: 1,
        maxParticipants: Math.max(config.participantCount, 8),
        durationBounds: {
          minMinutes: Math.max(3, Math.round(duration * 0.6)),
          defaultMinutes: duration,
          maxMinutes: Math.round(duration * 1.5),
        },
        suggestedRoles: aim.roles,
        verificationType: aim.verificationType || 'action',
        tags: ['ai_generated', 'touch_grass', config.vibe],
      };
    });

    // Run our elastic continuous time allocator to guarantee 0-drift total minutes
    const allocatedMinutes = allocateTime(domainMissions, config.totalMinutes);

    const scheduledMissions: ScheduledMission[] = domainMissions.map((m, idx) => ({
      mission: m,
      allocatedMinutes: allocatedMinutes[idx],
      sequenceIndex: idx,
      phase: arcBlueprint[idx] || 'exploration',
      assignedRoles: assignRoles(m, config.participantCount),
      customAIHook: m.cooperativeHook,
    }));

    const adventure: Adventure = {
      id: `ai_adv_${Date.now()}`,
      title: aiResult.adventureTitle,
      tagline: aiResult.adventureTagline,
      config: {
        ...config,
        useAI: true,
      },
      missions: scheduledMissions,
      totalEstimatedMinutes: config.totalMinutes,
      createdAt: new Date().toISOString(),
      generatedByAI: true,
      aiModel: `${providerType}:${aiResult.modelUsed}`,
    };

    const validation = validateAdventure(adventure);
    if (!validation.valid) {
      throw new Error(
        `Failed to validate AI-generated adventure: ${validation.errors.join(', ')}`
      );
    }

    return adventure;
  }
}
