import { Adventure, AdventureConfig, ScheduledMission } from '../domain/adventure.types';
import { Mission } from '../domain/mission.types';
import { ALL_MISSIONS } from '../data/catalog';
import { NARRATIVE_TEMPLATES } from '../data/templates/narrative-templates';
import { SeededPRNG } from './random';
import { filterMissions } from './mission-filter';
import { determineArcBlueprint, selectMissionsForArc } from './arc-sequencer';
import { allocateTime } from './time-allocator';
import { assignRoles } from './role-assigner';
import { validateAdventure } from '../domain/validator';

export function generateAdventure(
  config: AdventureConfig,
  missionPool: Mission[] = ALL_MISSIONS
): Adventure {
  // 1. Initialize deterministic PRNG with seed or random
  const seed = config.seed || Math.random().toString(36).substring(2, 9);
  const rng = new SeededPRNG(seed);

  // 2. Filter matching candidates based on group size, environment, and vibe
  const candidatePool = filterMissions(missionPool, config);

  // 3. Determine dynamic narrative arc blueprint based on total time
  const arcBlueprint = determineArcBlueprint(config.totalMinutes);

  // 4. Select candidate missions for each stage in the blueprint
  const selectedMissions = selectMissionsForArc(candidatePool, arcBlueprint, rng);

  // 5. Elastically allocate minutes across the selected missions
  const allocatedMinutes = allocateTime(selectedMissions, config.totalMinutes);

  // 6. Assemble ScheduledMissions with role assignments
  const scheduledMissions: ScheduledMission[] = selectedMissions.map(
    (mission, index) => ({
      mission,
      allocatedMinutes: allocatedMinutes[index],
      sequenceIndex: index,
      phase: arcBlueprint[index],
      assignedRoles: assignRoles(mission, config.participantCount),
    })
  );

  // 7. Pick narrative thematic title & tagline
  const template = NARRATIVE_TEMPLATES[config.vibe];
  const title = rng.pick(template.titles);
  const tagline = rng.pick(template.taglines);

  const adventure: Adventure = {
    id: `adv_${seed}_${Date.now()}`,
    title,
    tagline,
    config: {
      ...config,
      seed,
    },
    missions: scheduledMissions,
    totalEstimatedMinutes: config.totalMinutes,
    createdAt: new Date().toISOString(),
    generatedByAI: false,
  };

  // 8. Validate structural and mathematical integrity
  const validation = validateAdventure(adventure);
  if (!validation.valid) {
    throw new Error(
      `Failed to assemble valid adventure: ${validation.errors.join(', ')}`
    );
  }

  return adventure;
}
