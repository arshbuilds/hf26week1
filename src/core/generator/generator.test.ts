import { describe, it, expect } from 'vitest';
import {
  SeededPRNG,
  filterMissions,
  determineArcBlueprint,
  allocateTime,
  assignRoles,
  generateAdventure,
} from './index';
import { ALL_MISSIONS } from '../data/catalog';
import { AdventureConfig } from '../domain/adventure.types';
import { AdventureVibe, Environment } from '../domain/mission.types';

describe('Adventure Generator Engine', () => {
  describe('SeededPRNG', () => {
    it('should generate deterministic output for the same seed', () => {
      const rng1 = new SeededPRNG('trail_seed_42');
      const rng2 = new SeededPRNG('trail_seed_42');

      const values1 = [rng1.next(), rng1.next(), rng1.nextInt(1, 100)];
      const values2 = [rng2.next(), rng2.next(), rng2.nextInt(1, 100)];

      expect(values1).toEqual(values2);
    });

    it('should generate different outputs for different seeds', () => {
      const rng1 = new SeededPRNG('alpha');
      const rng2 = new SeededPRNG('beta');

      expect(rng1.next()).not.toEqual(rng2.next());
    });
  });

  describe('Mission Filter', () => {
    it('should filter candidate missions by participant count and vibe', () => {
      const config: AdventureConfig = {
        totalMinutes: 45,
        participantCount: 4,
        vibe: 'creative',
        intensity: 'chill',
        environment: 'park',
      };
      const filtered = filterMissions(ALL_MISSIONS, config);
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((m) => {
        expect(m.minParticipants).toBeLessThanOrEqual(4);
        expect(m.maxParticipants).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('Arc Sequencer & Blueprints', () => {
    it('should produce 3 stages for short adventures (<= 30 min)', () => {
      expect(determineArcBlueprint(15)).toEqual(['warmup', 'exploration', 'climax']);
      expect(determineArcBlueprint(30)).toEqual(['warmup', 'exploration', 'climax']);
    });

    it('should produce 4 stages for standard adventures (31 - 60 min)', () => {
      expect(determineArcBlueprint(45)).toEqual(['warmup', 'exploration', 'climax', 'epilogue']);
      expect(determineArcBlueprint(60)).toEqual(['warmup', 'exploration', 'climax', 'epilogue']);
    });

    it('should produce 5 stages for extended adventures (> 60 min)', () => {
      expect(determineArcBlueprint(75)).toEqual(['warmup', 'exploration', 'exploration', 'climax', 'epilogue']);
      expect(determineArcBlueprint(120)).toEqual(['warmup', 'exploration', 'exploration', 'climax', 'epilogue']);
    });
  });

  describe('Elastic Time Allocator Invariants', () => {
    const testCases = [15, 23, 30, 45, 60, 75, 90, 115];

    testCases.forEach((targetMinutes) => {
      it(`should guarantee zero time-drift for ${targetMinutes} minutes`, () => {
        const sampleMissions = ALL_MISSIONS.slice(0, 4);
        const allocations = allocateTime(sampleMissions, targetMinutes);

        expect(allocations).toHaveLength(sampleMissions.length);
        const total = allocations.reduce((sum, m) => sum + m, 0);
        expect(total).toBe(targetMinutes);

        // Every allocated time must be a positive integer
        allocations.forEach((time) => {
          expect(time).toBeGreaterThan(0);
          expect(Number.isInteger(time)).toBe(true);
        });
      });
    });
  });

  describe('Role Assigner', () => {
    it('should assign roles to all participants in the party', () => {
      const sampleMission = ALL_MISSIONS[0];
      const participantCount = 4;
      const assignments = assignRoles(sampleMission, participantCount);

      expect(assignments).toHaveLength(participantCount);
      expect(assignments.map((a) => a.participantNumber)).toEqual([1, 2, 3, 4]);
      assignments.forEach((a) => {
        expect(a.role.title).toBeDefined();
        expect(a.role.duty).toBeDefined();
      });
    });
  });

  describe('Full Adventure Pipeline Assembly', () => {
    it('should assemble a complete, valid Adventure from config', () => {
      const config: AdventureConfig = {
        totalMinutes: 45,
        participantCount: 4,
        vibe: 'creative',
        intensity: 'chill',
        environment: 'park',
        seed: 'fixed_test_seed',
      };

      const adventure = generateAdventure(config);

      expect(adventure.id).toBeDefined();
      expect(adventure.title).toBeDefined();
      expect(adventure.tagline).toBeDefined();
      expect(adventure.missions.length).toBe(4);
      expect(adventure.totalEstimatedMinutes).toBe(45);

      const sumMinutes = adventure.missions.reduce((s, m) => s + m.allocatedMinutes, 0);
      expect(sumMinutes).toBe(45);
    });

    it('should produce identical adventures when provided with the same seed', () => {
      const config: AdventureConfig = {
        totalMinutes: 60,
        participantCount: 3,
        vibe: 'explorer',
        intensity: 'standard',
        environment: 'outdoor',
        seed: 'identical_quest_123',
      };

      const adv1 = generateAdventure(config);
      const adv2 = generateAdventure(config);

      expect(adv1.title).toBe(adv2.title);
      expect(adv1.missions.map((m) => m.mission.id)).toEqual(
        adv2.missions.map((m) => m.mission.id)
      );
      expect(adv1.missions.map((m) => m.allocatedMinutes)).toEqual(
        adv2.missions.map((m) => m.allocatedMinutes)
      );
    });
  });

  describe('Property-Based Fuzz Testing (200 Iterations)', () => {
    const vibes: AdventureVibe[] = ['creative', 'explorer', 'detective', 'active', 'social'];
    const environments: Environment[] = ['any', 'outdoor', 'park', 'urban'];

    it('should never crash and always satisfy time invariants for random configurations', () => {
      const rng = new SeededPRNG('fuzz_master_seed');

      for (let i = 0; i < 200; i++) {
        const totalMinutes = rng.nextInt(15, 120);
        const participantCount = rng.nextInt(1, 10);
        const vibe = rng.pick(vibes);
        const environment = rng.pick(environments);

        const config: AdventureConfig = {
          totalMinutes,
          participantCount,
          vibe,
          intensity: 'standard',
          environment,
          seed: `fuzz_${i}`,
        };

        const adventure = generateAdventure(config);

        // Invariant 1: Total allocated minutes matches requested minutes exactly
        const totalAllocated = adventure.missions.reduce(
          (sum, m) => sum + m.allocatedMinutes,
          0
        );
        expect(totalAllocated).toBe(totalMinutes);

        // Invariant 2: Mission sequence is contiguous 0..N-1
        adventure.missions.forEach((sm, idx) => {
          expect(sm.sequenceIndex).toBe(idx);
          expect(sm.assignedRoles.length).toBe(participantCount);
        });
      }
    });
  });
});
