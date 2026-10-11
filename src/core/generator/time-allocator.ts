import { Mission } from '../domain/mission.types';

/**
 * Elastic Time Allocator:
 * Proportions the target minutes across selected missions within each mission's
 * duration bounds [minMinutes, maxMinutes], ensuring that:
 *
 * sum(allocatedMinutes) === targetMinutes (exact zero-drift constraint).
 */
export function allocateTime(
  missions: Mission[],
  targetMinutes: number
): number[] {
  if (missions.length === 0) {
    return [];
  }

  // 1. Calculate sum of default durations
  const sumDefaults = missions.reduce(
    (sum, m) => sum + m.durationBounds.defaultMinutes,
    0
  );

  // 2. Proportionally scale default minutes
  const scaleRatio = targetMinutes / sumDefaults;
  const allocations: number[] = missions.map((m) => {
    const raw = Math.round(m.durationBounds.defaultMinutes * scaleRatio);
    // Clamp to [minMinutes, maxMinutes]
    return Math.max(
      m.durationBounds.minMinutes,
      Math.min(m.durationBounds.maxMinutes, raw)
    );
  });

  // 3. Resolve any rounding or clamping difference
  let currentSum = allocations.reduce((a, b) => a + b, 0);
  let delta = targetMinutes - currentSum;
  let iterations = 0;
  const maxIterations = 500;

  // If we need more minutes (delta > 0), expand missions that have room below maxMinutes
  while (delta > 0 && iterations++ < maxIterations) {
    let expanded = false;
    for (let i = 0; i < allocations.length; i++) {
      if (delta <= 0) break;
      if (allocations[i] < missions[i].durationBounds.maxMinutes) {
        allocations[i] += 1;
        delta -= 1;
        expanded = true;
      }
    }
    // If all are at maxMinutes but delta still > 0, expand the climax or longest mission
    if (!expanded && delta > 0) {
      allocations[allocations.length - 1] += delta;
      delta = 0;
    }
  }

  // If we need fewer minutes (delta < 0), shrink missions that have room above minMinutes
  while (delta < 0 && iterations++ < maxIterations) {
    let shrunk = false;
    for (let i = 0; i < allocations.length; i++) {
      if (delta >= 0) break;
      if (allocations[i] > missions[i].durationBounds.minMinutes) {
        allocations[i] -= 1;
        delta += 1;
        shrunk = true;
      }
    }
    // If all are at minMinutes but delta still < 0, shrink down to minimum 1 min
    if (!shrunk && delta < 0) {
      for (let i = 0; i < allocations.length; i++) {
        if (delta >= 0) break;
        if (allocations[i] > 1) {
          allocations[i] -= 1;
          delta += 1;
        }
      }
    }
  }

  return allocations;
}
