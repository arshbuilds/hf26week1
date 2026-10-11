import {
  AdventureVibe,
  ArcPhase,
  Environment,
  Intensity,
  Mission,
  VerificationType,
} from './mission.types';
import { Adventure, AdventureConfig } from './adventure.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_VIBES: AdventureVibe[] = [
  'creative',
  'explorer',
  'detective',
  'active',
  'social',
];

const VALID_ARC_PHASES: ArcPhase[] = [
  'warmup',
  'exploration',
  'climax',
  'epilogue',
];

const VALID_ENVIRONMENTS: Environment[] = [
  'any',
  'outdoor',
  'indoor',
  'park',
  'urban',
];

const VALID_INTENSITIES: Intensity[] = ['chill', 'standard', 'high_energy'];

const VALID_VERIFICATIONS: VerificationType[] = ['honor', 'photo', 'action'];

export function validateMission(mission: unknown): ValidationResult {
  const errors: string[] = [];

  if (!mission || typeof mission !== 'object') {
    return { valid: false, errors: ['Mission must be a non-null object.'] };
  }

  const m = mission as Partial<Mission>;

  if (!m.id || typeof m.id !== 'string' || m.id.trim().length === 0) {
    errors.push('Mission requires a non-empty string "id".');
  }

  if (!m.title || typeof m.title !== 'string' || m.title.trim().length === 0) {
    errors.push('Mission requires a non-empty string "title".');
  }

  if (!m.brief || typeof m.brief !== 'string' || m.brief.trim().length === 0) {
    errors.push('Mission requires a non-empty string "brief".');
  }

  if (!Array.isArray(m.instructions) || m.instructions.length === 0) {
    errors.push('Mission requires an array of "instructions" with at least one step.');
  } else if (m.instructions.some((step) => typeof step !== 'string' || step.trim().length === 0)) {
    errors.push('All mission instructions must be non-empty strings.');
  }

  if (
    !m.cooperativeHook ||
    typeof m.cooperativeHook !== 'string' ||
    m.cooperativeHook.trim().length < 10
  ) {
    errors.push(
      'Mission requires a "cooperativeHook" (at least 10 chars) describing why/how the team cooperates.'
    );
  }

  if (!m.arcPhase || !VALID_ARC_PHASES.includes(m.arcPhase)) {
    errors.push(`Mission has invalid arcPhase: "${m.arcPhase}". Must be one of: ${VALID_ARC_PHASES.join(', ')}.`);
  }

  if (!m.intensity || !VALID_INTENSITIES.includes(m.intensity)) {
    errors.push(`Mission has invalid intensity: "${m.intensity}". Must be one of: ${VALID_INTENSITIES.join(', ')}.`);
  }

  if (!m.verificationType || !VALID_VERIFICATIONS.includes(m.verificationType)) {
    errors.push(`Mission has invalid verificationType: "${m.verificationType}". Must be one of: ${VALID_VERIFICATIONS.join(', ')}.`);
  }

  if (!Array.isArray(m.vibes) || m.vibes.length === 0) {
    errors.push('Mission requires at least one vibe in "vibes" array.');
  } else {
    for (const v of m.vibes) {
      if (!VALID_VIBES.includes(v)) {
        errors.push(`Invalid vibe "${v}". Must be one of: ${VALID_VIBES.join(', ')}.`);
      }
    }
  }

  if (!Array.isArray(m.environments) || m.environments.length === 0) {
    errors.push('Mission requires at least one environment in "environments" array.');
  } else {
    for (const env of m.environments) {
      if (!VALID_ENVIRONMENTS.includes(env)) {
        errors.push(`Invalid environment "${env}". Must be one of: ${VALID_ENVIRONMENTS.join(', ')}.`);
      }
    }
  }

  if (
    typeof m.minParticipants !== 'number' ||
    typeof m.maxParticipants !== 'number' ||
    m.minParticipants < 1 ||
    m.minParticipants > m.maxParticipants
  ) {
    errors.push(
      `Invalid participant bounds: min (${m.minParticipants}) must be >= 1 and <= max (${m.maxParticipants}).`
    );
  }

  if (!m.durationBounds || typeof m.durationBounds !== 'object') {
    errors.push('Mission requires a "durationBounds" object.');
  } else {
    const { minMinutes, defaultMinutes, maxMinutes } = m.durationBounds;
    if (
      typeof minMinutes !== 'number' ||
      typeof defaultMinutes !== 'number' ||
      typeof maxMinutes !== 'number' ||
      minMinutes < 1 ||
      minMinutes > defaultMinutes ||
      defaultMinutes > maxMinutes
    ) {
      errors.push(
        `Invalid duration bounds: 1 <= min (${minMinutes}) <= default (${defaultMinutes}) <= max (${maxMinutes}) required.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAdventureConfig(config: unknown): ValidationResult {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['AdventureConfig must be a non-null object.'] };
  }

  const c = config as Partial<AdventureConfig>;

  if (typeof c.totalMinutes !== 'number' || c.totalMinutes < 10 || c.totalMinutes > 180) {
    errors.push('totalMinutes must be a number between 10 and 180.');
  }

  if (typeof c.participantCount !== 'number' || c.participantCount < 1 || c.participantCount > 20) {
    errors.push('participantCount must be a number between 1 and 20.');
  }

  if (!c.vibe || !VALID_VIBES.includes(c.vibe)) {
    errors.push(`Invalid vibe: "${c.vibe}". Must be one of: ${VALID_VIBES.join(', ')}.`);
  }

  if (!c.intensity || !VALID_INTENSITIES.includes(c.intensity)) {
    errors.push(`Invalid intensity: "${c.intensity}". Must be one of: ${VALID_INTENSITIES.join(', ')}.`);
  }

  if (!c.environment || !VALID_ENVIRONMENTS.includes(c.environment)) {
    errors.push(`Invalid environment: "${c.environment}". Must be one of: ${VALID_ENVIRONMENTS.join(', ')}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAdventure(adventure: unknown): ValidationResult {
  const errors: string[] = [];

  if (!adventure || typeof adventure !== 'object') {
    return { valid: false, errors: ['Adventure must be a non-null object.'] };
  }

  const a = adventure as Partial<Adventure>;

  if (!a.id || typeof a.id !== 'string') {
    errors.push('Adventure requires an "id".');
  }

  if (!a.title || typeof a.title !== 'string') {
    errors.push('Adventure requires a "title".');
  }

  const configValidation = validateAdventureConfig(a.config);
  if (!configValidation.valid) {
    errors.push(...configValidation.errors.map((e) => `Config error: ${e}`));
  }

  if (!Array.isArray(a.missions) || a.missions.length === 0) {
    errors.push('Adventure must contain at least one scheduled mission.');
  } else {
    let calculatedMinutes = 0;
    a.missions.forEach((sm, index) => {
      if (sm.sequenceIndex !== index) {
        errors.push(`Mission at index ${index} has incorrect sequenceIndex ${sm.sequenceIndex}.`);
      }
      if (typeof sm.allocatedMinutes !== 'number' || sm.allocatedMinutes <= 0) {
        errors.push(`Mission "${sm.mission?.title || index}" has invalid allocatedMinutes.`);
      } else {
        calculatedMinutes += sm.allocatedMinutes;
      }
      const mVal = validateMission(sm.mission);
      if (!mVal.valid) {
        errors.push(...mVal.errors.map((e) => `Mission [${index}] "${sm.mission?.id || 'unknown'}": ${e}`));
      }
    });

    if (
      typeof a.totalEstimatedMinutes === 'number' &&
      Math.abs(calculatedMinutes - a.totalEstimatedMinutes) > 0.1
    ) {
      errors.push(
        `Sum of allocated mission minutes (${calculatedMinutes}) does not equal totalEstimatedMinutes (${a.totalEstimatedMinutes}).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
