import { describe, it, expect } from 'vitest';
import { ALL_MISSIONS, getMissionsByVibe, getMissionsByPhase, getMissionById } from './catalog';
import { validateMission } from '../domain/validator';
import { AdventureVibe, ArcPhase } from '../domain/mission.types';
import { NARRATIVE_TEMPLATES } from './templates/narrative-templates';

describe('Seed Mission Catalog Integrity', () => {
  it('should contain a rich base pool of at least 20 missions', () => {
    expect(ALL_MISSIONS.length).toBeGreaterThanOrEqual(20);
  });

  it('should have globally unique mission IDs across the entire catalog', () => {
    const ids = ALL_MISSIONS.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should pass strict validateMission() checks on 100% of seed missions', () => {
    ALL_MISSIONS.forEach((mission) => {
      const validation = validateMission(mission);
      if (!validation.valid) {
        console.error(`Failed mission: ${mission.id}`, validation.errors);
      }
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  it('should guarantee that every mission has a substantive cooperative hook', () => {
    ALL_MISSIONS.forEach((mission) => {
      expect(mission.cooperativeHook).toBeDefined();
      expect(mission.cooperativeHook.length).toBeGreaterThanOrEqual(15);
    });
  });

  const ALL_VIBES: AdventureVibe[] = [
    'creative',
    'explorer',
    'detective',
    'active',
    'social',
  ];

  ALL_VIBES.forEach((vibe) => {
    describe(`Vibe coverage: ${vibe}`, () => {
      it(`should have missions across all 4 arc phases for ${vibe}`, () => {
        const missions = getMissionsByVibe(vibe);
        const phases = new Set(missions.map((m) => m.arcPhase));

        const requiredPhases: ArcPhase[] = [
          'warmup',
          'exploration',
          'climax',
          'epilogue',
        ];

        requiredPhases.forEach((phase) => {
          expect(
            phases.has(phase),
            `Vibe "${vibe}" is missing missions for phase "${phase}"`
          ).toBe(true);
        });
      });

      it(`should have narrative template configured for ${vibe}`, () => {
        const template = NARRATIVE_TEMPLATES[vibe];
        expect(template).toBeDefined();
        expect(template.titles.length).toBeGreaterThan(0);
        expect(template.taglines.length).toBeGreaterThan(0);
        expect(template.arcSummary.length).toBeGreaterThan(10);
      });
    });
  });

  it('should successfully query missions by phase', () => {
    const warmups = getMissionsByPhase('warmup');
    const climaxes = getMissionsByPhase('climax');
    expect(warmups.length).toBeGreaterThan(0);
    expect(climaxes.length).toBeGreaterThan(0);
  });

  it('should successfully find a mission by its unique ID', () => {
    const target = ALL_MISSIONS[0];
    const found = getMissionById(target.id);
    expect(found).toEqual(target);
  });
});
