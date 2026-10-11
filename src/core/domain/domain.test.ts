import { describe, it, expect } from 'vitest';
import {
  Mission,
  AdventureConfig,
  Adventure,
  validateMission,
  validateAdventureConfig,
  validateAdventure,
} from './index';

describe('Domain Models & Invariant Validation', () => {
  const validMissionSample: Mission = {
    id: 'nature_crown',
    title: 'Crown of the Wild',
    brief: 'Craft an ephemeral floral crown using only fallen natural debris.',
    instructions: [
      'Search the surrounding ground for interesting fallen leaves and blossoms.',
      'Weave together a crown without picking or harming living plants.',
      'Crown one team member as the sovereign of the woodland.',
    ],
    cooperativeHook:
      'Every participant must contribute at least two distinct natural textures to the final crown.',
    vibes: ['creative', 'explorer'],
    arcPhase: 'climax',
    intensity: 'chill',
    environments: ['outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 18,
    },
    suggestedRoles: [
      { id: 'scout', title: 'Scout', duty: 'Discovers the rarest colorful items on the trail.' },
      { id: 'artisan', title: 'Artisan', duty: 'Weaves the crown together with care.' },
    ],
    verificationType: 'photo',
    tags: ['nature', 'craft', 'ephemeral'],
  };

  const validConfigSample: AdventureConfig = {
    totalMinutes: 45,
    participantCount: 4,
    vibe: 'creative',
    intensity: 'chill',
    environment: 'park',
    useAI: false,
  };

  describe('validateMission', () => {
    it('should approve a fully compliant mission definition', () => {
      const result = validateMission(validMissionSample);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject a mission missing a cooperative hook', () => {
      const invalid = { ...validMissionSample, cooperativeHook: '' };
      const result = validateMission(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('cooperativeHook'))).toBe(true);
    });

    it('should reject a mission with inverted duration bounds (min > max)', () => {
      const invalid = {
        ...validMissionSample,
        durationBounds: { minMinutes: 20, defaultMinutes: 15, maxMinutes: 10 },
      };
      const result = validateMission(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('duration bounds'))).toBe(true);
    });

    it('should reject a mission with invalid participant ranges (min > max or min < 1)', () => {
      const invalid = { ...validMissionSample, minParticipants: 5, maxParticipants: 3 };
      const result = validateMission(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('participant bounds'))).toBe(true);
    });

    it('should reject invalid vibe enums', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalid = { ...validMissionSample, vibes: ['invalid_vibe' as any] };
      const result = validateMission(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid vibe'))).toBe(true);
    });

    it('should reject empty instructions', () => {
      const invalid = { ...validMissionSample, instructions: [] };
      const result = validateMission(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('instructions'))).toBe(true);
    });
  });

  describe('validateAdventureConfig', () => {
    it('should approve valid adventure parameters', () => {
      const result = validateAdventureConfig(validConfigSample);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject out-of-range duration (<10 or >180)', () => {
      const tooShort = { ...validConfigSample, totalMinutes: 5 };
      const tooLong = { ...validConfigSample, totalMinutes: 240 };
      expect(validateAdventureConfig(tooShort).valid).toBe(false);
      expect(validateAdventureConfig(tooLong).valid).toBe(false);
    });

    it('should reject invalid participant count (<1)', () => {
      const invalid = { ...validConfigSample, participantCount: 0 };
      expect(validateAdventureConfig(invalid).valid).toBe(false);
    });
  });

  describe('validateAdventure', () => {
    it('should approve an adventure whose mission sequence and time sum match', () => {
      const validAdventure: Adventure = {
        id: 'adv_123',
        title: 'The Woodland Awakening',
        tagline: 'Connect with nature and craft art together.',
        config: validConfigSample,
        totalEstimatedMinutes: 20,
        createdAt: new Date().toISOString(),
        missions: [
          {
            mission: {
              ...validMissionSample,
              id: 'm1',
              arcPhase: 'warmup',
              durationBounds: { minMinutes: 5, defaultMinutes: 8, maxMinutes: 10 },
            },
            allocatedMinutes: 8,
            sequenceIndex: 0,
            phase: 'warmup',
            assignedRoles: [],
          },
          {
            mission: {
              ...validMissionSample,
              id: 'm2',
              arcPhase: 'climax',
              durationBounds: { minMinutes: 8, defaultMinutes: 12, maxMinutes: 15 },
            },
            allocatedMinutes: 12,
            sequenceIndex: 1,
            phase: 'climax',
            assignedRoles: [],
          },
        ],
      };

      const result = validateAdventure(validAdventure);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject an adventure where allocatedMinutes sum does not match totalEstimatedMinutes', () => {
      const mismatchedAdventure: Adventure = {
        id: 'adv_mismatch',
        title: 'Mismatched Time Test',
        tagline: 'Test adventure',
        config: validConfigSample,
        totalEstimatedMinutes: 30, // Claims 30 min, but missions sum to 12
        createdAt: new Date().toISOString(),
        missions: [
          {
            mission: validMissionSample,
            allocatedMinutes: 12,
            sequenceIndex: 0,
            phase: 'climax',
            assignedRoles: [],
          },
        ],
      };

      const result = validateAdventure(mismatchedAdventure);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('does not equal totalEstimatedMinutes'))).toBe(true);
    });
  });
});
