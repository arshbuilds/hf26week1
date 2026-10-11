import {
  AIAdventurePrompt,
  AIGenerationResult,
  AIProvider,
  AIProviderType,
} from '../../domain/ai.types';
import { buildSystemPrompt, buildUserPrompt } from '../prompt-builder';
import { extractJSONFromAIOutput } from '../json-extractor';

export class HuggingFaceOpenInferenceProvider implements AIProvider {
  readonly providerType: AIProviderType = 'huggingface';
  readonly modelName: string;
  private apiToken?: string;

  constructor(
    modelName: string = 'Qwen/Qwen2.5-72B-Instruct',
    apiToken?: string
  ) {
    this.modelName = modelName;
    this.apiToken = apiToken;
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiToken && this.apiToken.trim().length > 0);
  }

  async generateAdventure(
    prompt: AIAdventurePrompt
  ): Promise<AIGenerationResult> {
    const startTime = performance.now();
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(prompt);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${this.modelName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n`,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `HuggingFace Inference failed with HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    let generatedText = '';
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || '';
    } else if (typeof data === 'object' && data !== null) {
      generatedText = (data as { generated_text?: string }).generated_text || '';
    }

    const parsed = extractJSONFromAIOutput(generatedText);
    parsed.modelUsed = `hf:${this.modelName}`;
    parsed.latencyMs = Math.round(performance.now() - startTime);

    return parsed;
  }
}
