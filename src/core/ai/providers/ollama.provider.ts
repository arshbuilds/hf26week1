import {
  AIAdventurePrompt,
  AIGenerationResult,
  AIProvider,
  AIProviderType,
} from '../../domain/ai.types';
import { buildSystemPrompt, buildUserPrompt } from '../prompt-builder';
import { extractJSONFromAIOutput } from '../json-extractor';

export class OllamaOpenModelProvider implements AIProvider {
  readonly providerType: AIProviderType = 'ollama';
  readonly modelName: string;
  private endpointUrl: string;

  constructor(
    modelName: string = 'llama3.2:1b',
    endpointUrl: string = 'http://localhost:11434'
  ) {
    this.modelName = modelName;
    this.endpointUrl = endpointUrl;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpointUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateAdventure(
    prompt: AIAdventurePrompt
  ): Promise<AIGenerationResult> {
    const startTime = performance.now();
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(prompt);

    const payload = {
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      format: 'json',
      options: {
        temperature: 0.7,
      },
    };

    const response = await fetch(`${this.endpointUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama request failed with HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.message?.content || '';

    const parsed = extractJSONFromAIOutput(content);
    parsed.modelUsed = `ollama:${this.modelName}`;
    parsed.latencyMs = Math.round(performance.now() - startTime);

    return parsed;
  }
}
