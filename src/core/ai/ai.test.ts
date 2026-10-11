import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  buildUserPrompt,
  extractJSONFromAIOutput,
  DeterministicFallbackProvider,
  InBrowserOpenWeightProvider,
  AIOrchestrator,
} from './index';
import { AdventureConfig } from '../domain/adventure.types';
import { ALL_MISSIONS } from '../data/catalog';

describe('Open-Source AI Layer', () => {
  const sampleConfig: AdventureConfig = {
    totalMinutes: 45,
    participantCount: 4,
    vibe: 'creative',
    intensity: 'chill',
    environment: 'park',
    useAI: true,
  };

  describe('Prompt Builder', () => {
    it('should construct system prompt with Touch Grass cooperative rules', () => {
      const systemPrompt = buildSystemPrompt();
      expect(systemPrompt).toContain('cooperative multiplayer');
      expect(systemPrompt).toContain('CRITICAL RULES');
      expect(systemPrompt).toContain('JSON');
    });

    it('should include location context and constraints in user prompt', () => {
      const userPrompt = buildUserPrompt({
        config: sampleConfig,
        candidateMissions: ALL_MISSIONS.slice(0, 3),
        userLocationContext: 'Misty Pine Forest Trail',
      });

      expect(userPrompt).toContain('45 minutes');
      expect(userPrompt).toContain('4 people');
      expect(userPrompt).toContain('creative');
      expect(userPrompt).toContain('Misty Pine Forest Trail');
    });
  });

  describe('JSON Extractor & Sanitizer', () => {
    it('should parse clean raw JSON', () => {
      const raw = JSON.stringify({
        adventureTitle: 'The Whispering Pines',
        adventureTagline: 'Follow the secret forest signs together.',
        missions: [
          {
            title: 'Gather Pine Cones',
            brief: 'Find 5 large pine cones.',
            instructions: ['Look on the ground.', 'Bring back to base.'],
            cooperativeHook: 'Each player must find one distinct size of cone.',
            suggestedMinutes: 10,
            verificationType: 'action',
          },
        ],
      });

      const extracted = extractJSONFromAIOutput(raw);
      expect(extracted.adventureTitle).toBe('The Whispering Pines');
      expect(extracted.missions).toHaveLength(1);
      expect(extracted.missions[0].title).toBe('Gather Pine Cones');
    });

    it('should strip markdown code fences and conversational filler', () => {
      const wrapped = `Here is the adventure you requested:\n\`\`\`json\n${JSON.stringify({
        adventureTitle: 'Urban Explorers',
        adventureTagline: 'Explore the brick alleys together.',
        missions: [
          {
            title: 'Spot 3 gargoyles',
            brief: 'Search architectural features.',
            instructions: ['Look upward at rooflines.'],
            cooperativeHook: 'Must be spotted by consensus.',
            suggestedMinutes: 12,
            verificationType: 'photo',
          },
        ],
      })}\n\`\`\`\nHope your friends have fun outside!`;

      const extracted = extractJSONFromAIOutput(wrapped);
      expect(extracted.adventureTitle).toBe('Urban Explorers');
      expect(extracted.missions).toHaveLength(1);
    });

    it('should handle and sanitize trailing commas', () => {
      const malformed = `
      {
        "adventureTitle": "Trail Quest",
        "adventureTagline": "Outdoor fun,",
        "missions": [
          {
            "title": "M1",
            "brief": "Brief text",
            "instructions": ["Step 1", "Step 2",],
            "cooperativeHook": "Hook text",
            "suggestedMinutes": 10,
            "verificationType": "action",
          },
        ],
      }`;

      const extracted = extractJSONFromAIOutput(malformed);
      expect(extracted.adventureTitle).toBe('Trail Quest');
      expect(extracted.missions).toHaveLength(1);
    });

    it('should throw an informative error if no JSON object exists', () => {
      expect(() => extractJSONFromAIOutput('I am sorry, I cannot do that.')).toThrow(
        /No valid JSON object found/
      );
    });
  });

  describe('Deterministic Fallback Provider', () => {
    it('should be immediately available and generate valid adventure results', async () => {
      const provider = new DeterministicFallbackProvider();
      expect(await provider.isAvailable()).toBe(true);

      const result = await provider.generateAdventure({
        config: sampleConfig,
        candidateMissions: ALL_MISSIONS,
        userLocationContext: 'City Botanical Garden',
      });

      expect(result.adventureTitle).toBeDefined();
      expect(result.adventureTagline).toContain('City Botanical Garden');
      expect(result.missions.length).toBeGreaterThanOrEqual(3);
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('In-Browser Open-Weight Provider', () => {
    it('should initialize and produce an adventure via local fallback in non-browser runner', async () => {
      const provider = new InBrowserOpenWeightProvider();
      const result = await provider.generateAdventure({
        config: sampleConfig,
        candidateMissions: ALL_MISSIONS,
      });

      expect(result.adventureTitle).toBeDefined();
      expect(result.missions.length).toBeGreaterThan(0);
    });
  });

  describe('AI Orchestrator', () => {
    it('should synthesize a fully validated Adventure entity from config', async () => {
      const orchestrator = new AIOrchestrator();

      const adventure = await orchestrator.synthesizeAdventure(
        sampleConfig,
        'Old Oak Clearing',
        'in-browser-open-weight'
      );

      expect(adventure.id).toBeDefined();
      expect(adventure.title).toBeDefined();
      expect(adventure.missions.length).toBe(4); // 45 min = 4 stages
      expect(adventure.generatedByAI).toBe(true);
      expect(adventure.aiModel).toBeDefined();

      // Invariant: sum of allocated minutes matches requested time exactly
      const totalMinutes = adventure.missions.reduce(
        (sum, m) => sum + m.allocatedMinutes,
        0
      );
      expect(totalMinutes).toBe(45);

      // Invariant: every mission has participant roles
      adventure.missions.forEach((sm) => {
        expect(sm.assignedRoles).toHaveLength(4);
      });
    });
  });
});
