import { AIGenerationResult, AIGeneratedMission } from '../domain/ai.types';

export function extractJSONFromAIOutput(rawText: string): AIGenerationResult {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('AI returned empty response.');
  }

  // 1. Strip markdown code fences if present
  let cleaned = rawText.trim();
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    cleaned = markdownMatch[1].trim();
  }

  // 2. Find outermost JSON object braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error('No valid JSON object found in AI response.');
  }

  const jsonSubstring = cleaned.substring(firstBrace, lastBrace + 1);

  // 3. Attempt parsing with sanitization
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonSubstring);
  } catch {
    // Attempt removing trailing commas before closing braces/brackets
    const sanitized = jsonSubstring.replace(/,\s*([}\]])/g, '$1');
    try {
      parsed = JSON.parse(sanitized);
    } catch (parseErr) {
      throw new Error(`Failed to parse AI output as JSON: ${(parseErr as Error).message}`);
    }
  }

  // 4. Validate schema
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Parsed AI output is not an object.');
  }

  const obj = parsed as Record<string, unknown>;

  const adventureTitle =
    typeof obj.adventureTitle === 'string' && obj.adventureTitle.trim().length > 0
      ? obj.adventureTitle.trim()
      : 'The Real-World Quest';

  const adventureTagline =
    typeof obj.adventureTagline === 'string' && obj.adventureTagline.trim().length > 0
      ? obj.adventureTagline.trim()
      : 'Connect with your surroundings and collaborate.';

  if (!Array.isArray(obj.missions) || obj.missions.length === 0) {
    throw new Error('AI output must include a non-empty "missions" array.');
  }

  const missions: AIGeneratedMission[] = obj.missions.map((m, index) => {
    if (!m || typeof m !== 'object') {
      throw new Error(`Mission at index ${index} is not an object.`);
    }
    const item = m as Record<string, unknown>;

    const title =
      typeof item.title === 'string' && item.title.trim().length > 0
        ? item.title.trim()
        : `Mission ${index + 1}`;

    const brief =
      typeof item.brief === 'string' && item.brief.trim().length > 0
        ? item.brief.trim()
        : 'Collaborate with your team to complete this outdoor challenge.';

    const instructions = Array.isArray(item.instructions)
      ? item.instructions.filter((i): i is string => typeof i === 'string' && i.trim().length > 0)
      : ['Observe your surroundings.', 'Complete the task as a united group.'];

    const cooperativeHook =
      typeof item.cooperativeHook === 'string' && item.cooperativeHook.trim().length > 0
        ? item.cooperativeHook.trim()
        : 'All teammates must participate simultaneously to achieve success.';

    const suggestedMinutes =
      typeof item.suggestedMinutes === 'number' && item.suggestedMinutes > 0
        ? item.suggestedMinutes
        : 10;

    const verificationType =
      item.verificationType === 'photo' ||
      item.verificationType === 'action' ||
      item.verificationType === 'honor'
        ? item.verificationType
        : 'action';

    const roles = Array.isArray(item.roles)
      ? item.roles.map((r, rIdx) => {
          const roleObj = r as Record<string, unknown>;
          return {
            id: typeof roleObj.id === 'string' ? roleObj.id : `role_${rIdx}`,
            title: typeof roleObj.title === 'string' ? roleObj.title : `Role ${rIdx + 1}`,
            duty:
              typeof roleObj.duty === 'string'
                ? roleObj.duty
                : 'Supports the team in completing the objective.',
          };
        })
      : [];

    return {
      title,
      brief,
      instructions: instructions.length > 0 ? instructions : ['Work together.'],
      cooperativeHook,
      roles,
      suggestedMinutes,
      verificationType,
    };
  });

  return {
    adventureTitle,
    adventureTagline,
    missions,
    modelUsed: 'unknown',
    latencyMs: 0,
  };
}
