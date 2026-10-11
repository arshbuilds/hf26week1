import { AIAdventurePrompt } from '../domain/ai.types';

export function buildSystemPrompt(): string {
  return `You are the Adventure Guide, an AI Dungeon Master for real-world cooperative multiplayer experiences.
Your mission is to get groups of friends off their phones and doing creative, exploratory things together in the physical world.

CRITICAL RULES:
1. Every mission MUST require genuine cooperation (shared goals, split roles, simultaneous actions).
2. Missions must NOT require digital screens, apps, or purchases.
3. Respect nature: leave no trace, do not harm living plants, keep places cleaner than you found them.
4. Output MUST be valid raw JSON matching the specified schema with NO markdown commentary outside the JSON block.`;
}

export function buildUserPrompt(prompt: AIAdventurePrompt): string {
  const { config, candidateMissions, userLocationContext } = prompt;

  const exemplarSummaries = candidateMissions.slice(0, 3).map((m) => ({
    title: m.title,
    brief: m.brief,
    cooperativeHook: m.cooperativeHook,
    verificationType: m.verificationType,
  }));

  return `Generate an original cooperative adventure for:
- Available Time: ${config.totalMinutes} minutes
- Group Size: ${config.participantCount} people
- Adventure Vibe: ${config.vibe}
- Intensity: ${config.intensity}
- Environment: ${config.environment}${
    userLocationContext ? `\n- Specific Location/Terrain: ${userLocationContext}` : ''
  }

Here are 3 example mission styles for reference:
${JSON.stringify(exemplarSummaries, null, 2)}

Respond with a JSON object with this EXACT structure:
{
  "adventureTitle": "Engaging Quest Name",
  "adventureTagline": "Inspiring one-sentence call to adventure",
  "missions": [
    {
      "title": "Mission 1 Title (Warmup)",
      "brief": "Brief 1-sentence summary",
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction",
        "Step 3 instruction"
      ],
      "cooperativeHook": "Specific explanation of how all ${config.participantCount} members must cooperate",
      "roles": [
        { "id": "role1", "title": "Role Title", "duty": "What this player does" }
      ],
      "suggestedMinutes": 10,
      "verificationType": "action"
    }
  ]
}

The number of missions should match the time budget (${
    config.totalMinutes <= 30 ? '3 missions' : config.totalMinutes <= 60 ? '4 missions' : '5 missions'
  }). The sum of suggestedMinutes should approximately equal ${config.totalMinutes}.`;
}
