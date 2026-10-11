import { Mission } from '../domain/mission.types';
import { AdventureConfig } from '../domain/adventure.types';

export function filterMissions(
  pool: Mission[],
  config: AdventureConfig
): Mission[] {
  // 1. Filter by participant bounds
  let matches = pool.filter(
    (m) =>
      config.participantCount >= m.minParticipants &&
      config.participantCount <= m.maxParticipants
  );

  // 2. Filter by environment compatibility
  matches = matches.filter((m) => {
    if (config.environment === 'any') return true;
    return (
      m.environments.includes('any') ||
      m.environments.includes(config.environment)
    );
  });

  // 3. Filter by primary vibe
  const vibeMatches = matches.filter((m) => m.vibes.includes(config.vibe));

  // If vibeMatches has enough missions, use them; otherwise broaden slightly to maintain generation guarantee
  if (vibeMatches.length >= 4) {
    return vibeMatches;
  }

  // Graceful fallback: return matches that fit participants and environment
  return matches.length > 0 ? matches : pool;
}
