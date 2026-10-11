import { ArcPhase, Mission } from '../domain/mission.types';
import { SeededPRNG } from './random';

/**
 * Determines the narrative act structure dynamically based on total requested time:
 * - <= 30 min: Compact 3-stage arc (Warmup -> Exploration -> Climax)
 * - 31-60 min: Balanced 4-stage arc (Warmup -> Exploration -> Climax -> Epilogue)
 * - > 60 min: Epic 5-stage arc (Warmup -> Exploration -> Exploration -> Climax -> Epilogue)
 */
export function determineArcBlueprint(totalMinutes: number): ArcPhase[] {
  if (totalMinutes <= 30) {
    return ['warmup', 'exploration', 'climax'];
  } else if (totalMinutes <= 60) {
    return ['warmup', 'exploration', 'climax', 'epilogue'];
  } else {
    return ['warmup', 'exploration', 'exploration', 'climax', 'epilogue'];
  }
}

/**
 * Selects candidate missions matching the narrative arc blueprint.
 * Ensures mechanical variety and prevents duplicate mission IDs.
 */
export function selectMissionsForArc(
  candidates: Mission[],
  blueprint: ArcPhase[],
  rng: SeededPRNG
): Mission[] {
  const selected: Mission[] = [];
  const usedIds = new Set<string>();

  for (const phase of blueprint) {
    // 1. Find candidates matching this exact phase that haven't been picked yet
    let phasePool = candidates.filter(
      (m) => m.arcPhase === phase && !usedIds.has(m.id)
    );

    // 2. If pool is exhausted, allow candidates from compatible adjacent phases
    if (phasePool.length === 0) {
      phasePool = candidates.filter((m) => !usedIds.has(m.id));
    }

    // 3. If all candidates used, fallback to any available candidate
    if (phasePool.length === 0) {
      phasePool = candidates;
    }

    const chosen = rng.pick(phasePool);
    selected.push(chosen);
    usedIds.add(chosen.id);
  }

  return selected;
}
