import { AdventureVibe } from '../../domain/mission.types';

export interface NarrativeTemplate {
  titles: string[];
  taglines: string[];
  arcSummary: string;
}

export const NARRATIVE_TEMPLATES: Record<AdventureVibe, NarrativeTemplate> = {
  creative: {
    titles: [
      'The Woodland Atelier',
      'Ephemeral Tapestries',
      'The Living Palette Quest',
      'Artisans of the Open Sky',
    ],
    taglines: [
      'Co-create transient art and legends with the materials nature left behind.',
      'Transform the natural world into a collaborative gallery.',
      'Blend hands, shadows, and fallen foliage into team masterworks.',
    ],
    arcSummary:
      'Calibrate sensory awareness, gather organic components, build an ephemeral centerpiece, and recount your team legend.',
  },
  explorer: {
    titles: [
      'The Uncharted Meridian',
      'Expedition Beyond the Pavement',
      'The Solar Pathfinder',
      'The Wayfarer’s Compass',
    ],
    taglines: [
      'Leave behind screens and navigate the landscape through pure sensory observation.',
      'Chart hidden corners, micro-biomes, and natural summits together.',
      'Rediscover the terrain beneath your feet without digital maps.',
    ],
    arcSummary:
      'Align with analog navigation, scout micro-biomes, reach high ground, and map acoustic landscapes.',
  },
  detective: {
    titles: [
      'The Whispering Grove Files',
      'The Trail Anomaly Syndicate',
      'Cipher of the Canopy',
      'The Open-Air Inquest',
    ],
    taglines: [
      'Piece together subtle environmental mysteries and real-world micro-forensics.',
      'Notice every unusual detail that ordinary passersby completely ignore.',
      'Transform your local park into an unsolved collaborative mystery.',
    ],
    arcSummary:
      'Spot environmental anomalies, decipher secret bark glyphs, reconstruct timelines, and officially seal the case.',
  },
  active: {
    titles: [
      'The Kinetic Odyssey',
      'Vanguard of the Ridge',
      'The Synchronized Trek',
      'The Living Monolith Trial',
    ],
    taglines: [
      'Move, balance, climb, and synchronize as one unified cooperative unit.',
      'Test collective agility and physical harmony against outdoor terrain.',
      'Feel your pulse, touch the dirt, and conquer collaborative movement trials.',
    ],
    arcSummary:
      'Synchronize expedition cadence, traverse challenging roots and curbs, sculpt human monuments, and cool down in resonance.',
  },
  social: {
    titles: [
      'The Fellowship of the Trail',
      'The Real-World Resonance',
      'The Wonder Exchange',
      'Society of the Sunlit Walk',
    ],
    taglines: [
      'Deepen friendships, laugh out loud, and create authentic outdoor memories.',
      'Get off phones and engage in warm, playful multiplayer connection.',
      'Exchange perspectives, make unanimous decisions, and toast to real life.',
    ],
    arcSummary:
      'Adopt alter-egos, share overlooked wonders, make unanimous directional decisions, and conclude with a victorious toast.',
  },
};
