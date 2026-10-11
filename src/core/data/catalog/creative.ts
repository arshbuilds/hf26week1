import { Mission } from '../../domain/mission.types';

export const CREATIVE_MISSIONS: Mission[] = [
  {
    id: 'creative_warmup_texture_palette',
    title: 'The Tactile Palette',
    brief: 'Collect 4 natural items with completely distinct physical textures without speaking.',
    instructions: [
      'Disperse silently into the immediate area for 3 minutes.',
      'Each player must locate one fallen natural object (rough, silky, prickly, spongy).',
      'Regroup and arrange the items in a tactile gradient from smoothest to roughest.',
    ],
    cooperativeHook:
      'Players cannot speak during collection; the gradient must be agreed upon by consensus nod.',
    vibes: ['creative', 'explorer'],
    arcPhase: 'warmup',
    intensity: 'chill',
    environments: ['outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 10,
    durationBounds: {
      minMinutes: 5,
      defaultMinutes: 7,
      maxMinutes: 10,
    },
    suggestedRoles: [
      { id: 'curator', title: 'Curator', duty: 'Organizes the final texture lineup.' },
      { id: 'scout', title: 'Forager', duty: 'Finds the most unusual sensory textures.' },
    ],
    verificationType: 'action',
    tags: ['sensory', 'nature', 'silence'],
  },
  {
    id: 'creative_explore_chroma_hunt',
    title: 'The Natural Color Spectrum',
    brief: 'Assemble a living rainbow of fallen organic items in a straight line.',
    instructions: [
      'Scout the surrounding park for naturally occurring colors (deep brown, amber, olive, scarlet, charcoal).',
      'Bring all items back to a designated flat rock, bench, or patch of grass.',
      'Collaborate to order them into a seamless rainbow spectrum.',
    ],
    cooperativeHook:
      'Each team member is exclusively assigned 1-2 color families and cannot bring back colors outside their assignment.',
    vibes: ['creative'],
    arcPhase: 'exploration',
    intensity: 'standard',
    environments: ['outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 15,
    },
    suggestedRoles: [
      { id: 'color_director', title: 'Color Director', duty: 'Assigns color families and judges the spectrum transitions.' },
      { id: 'runner', title: 'Spectrum Runner', duty: 'Searches the perimeter for difficult colors like violet and bright yellow.' },
    ],
    verificationType: 'photo',
    tags: ['color', 'art', 'gathering'],
  },
  {
    id: 'creative_climax_ephemeral_sculpture',
    title: 'Crown of the Wild',
    brief: 'Design and build a collaborative ephemeral nature sculpture or crown.',
    instructions: [
      'Select a focal natural podium (a tree stump, flat boulder, or grassy circle).',
      'Combine collected twigs, blossoms, stones, and pine needles into a standalone artwork.',
      'The sculpture must stand balanced for at least 30 seconds without human support.',
    ],
    cooperativeHook:
      'Every team member must place at least 3 keystones simultaneously while keeping the structure balanced.',
    vibes: ['creative'],
    arcPhase: 'climax',
    intensity: 'chill',
    environments: ['outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 10,
      defaultMinutes: 15,
      maxMinutes: 20,
    },
    suggestedRoles: [
      { id: 'architect', title: 'Lead Architect', duty: 'Directs the structural foundation and weight distribution.' },
      { id: 'artisan', title: 'Decorator', duty: 'Adorns the sculpture with delicate leaves and flora.' },
    ],
    verificationType: 'photo',
    tags: ['sculpture', 'craft', 'balance'],
  },
  {
    id: 'creative_climax_shadow_theater',
    title: 'The Living Shadow Canvas',
    brief: 'Use team bodies, tree branches, and afternoon sunlight to project a mythological creature shadow.',
    instructions: [
      'Find a sunlit wall, pavement stretch, or flat lawn.',
      'Coordinate your collective silhouettes to project a single mythical creature shadow.',
      'Capture the collective silhouette before the sun shifts.',
    ],
    cooperativeHook:
      'All team members must physically connect (hands or feet) to form one continuous mythical silhouette.',
    vibes: ['creative', 'social'],
    arcPhase: 'climax',
    intensity: 'standard',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 3,
    maxParticipants: 10,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 16,
    },
    suggestedRoles: [
      { id: 'puppeteer', title: 'Silhouette Director', duty: 'Views from behind the camera to guide limb positions.' },
      { id: 'anchor', title: 'Shadow Anchor', duty: 'Forms the central trunk/torso of the creature.' },
    ],
    verificationType: 'photo',
    tags: ['shadow', 'photography', 'coordination'],
  },
  {
    id: 'creative_epilogue_folklore_chronicle',
    title: 'The 60-Second Legend',
    brief: 'Invent and recite an ancient origin myth explaining your day’s creative creation.',
    instructions: [
      'Gather in a circle around the creation or discovery you made.',
      'Take turns contributing exactly one sentence each to tell an epic folklore tale.',
      'End with a unanimous ceremonial bow to the landscape.',
    ],
    cooperativeHook:
      'Stories are told in a circle where each person can only say one sentence, building on the previous sentence.',
    vibes: ['creative', 'social'],
    arcPhase: 'epilogue',
    intensity: 'chill',
    environments: ['any', 'outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 12,
    durationBounds: {
      minMinutes: 5,
      defaultMinutes: 6,
      maxMinutes: 10,
    },
    suggestedRoles: [
      { id: 'bard', title: 'First Bard', duty: 'Speaks the opening invocation sentence.' },
      { id: 'sage', title: 'Last Sage', duty: 'Delivers the moral conclusion sentence.' },
    ],
    verificationType: 'honor',
    tags: ['storytelling', 'reflection', 'folklore'],
  },
];
