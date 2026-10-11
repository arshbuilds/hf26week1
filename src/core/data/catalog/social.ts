import { Mission } from '../../domain/mission.types';

export const SOCIAL_MISSIONS: Mission[] = [
  {
    id: 'social_warmup_alter_ego_call',
    title: 'The Secret Society Nicknames',
    brief: 'Bestow nature-inspired field alter-egos upon every member based on their personality.',
    instructions: [
      'Sit or stand in a circle.',
      'Each player is christened with an official adventure moniker (e.g., “Captain Lichen”, “Pinecone Maestro”).',
      'For the remainder of the adventure, players may only address each other by their field monikers.',
    ],
    cooperativeHook:
      'A player cannot name themselves; each title must be nominated by a peer and ratified by group applause.',
    vibes: ['social'],
    arcPhase: 'warmup',
    intensity: 'chill',
    environments: ['any', 'outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 12,
    durationBounds: {
      minMinutes: 4,
      defaultMinutes: 6,
      maxMinutes: 8,
    },
    suggestedRoles: [
      { id: 'herald', title: 'Grand Herald', duty: 'Formally announces each accepted field title.' },
    ],
    verificationType: 'honor',
    tags: ['humor', 'bonding', 'icebreaker'],
  },
  {
    id: 'social_explore_hidden_curiosities',
    title: 'The Wonder Exchange',
    brief: 'Each teammate guides the group to one subtle, beautiful thing they would normally walk past.',
    instructions: [
      'Take turns leading the group for 2 minutes each.',
      'Lead teammates to something easily overlooked: a tiny wildflower in a wall crack, an ironwork detail, or a bird nest.',
      'Explain in 30 seconds why it captured your attention.',
    ],
    cooperativeHook:
      'Every participant must take the leader mantle once; the group must remain completely silent while listening.',
    vibes: ['social', 'explorer'],
    arcPhase: 'exploration',
    intensity: 'chill',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 16,
    },
    suggestedRoles: [
      { id: 'timekeeper', title: 'Gentle Timekeeper', duty: 'Ensures each participant receives equal spotlight time.' },
    ],
    verificationType: 'action',
    tags: ['sharing', 'appreciation', 'walk'],
  },
  {
    id: 'social_climax_unanimous_quest',
    title: 'The Consensus Expedition',
    brief: 'Navigate through 5 intersections making every single turn decision by silent unanimous finger-pointing.',
    instructions: [
      'Approach an upcoming path fork or street intersection.',
      'Count down "3, 2, 1" and everyone points simultaneously in the direction they want to go.',
      'If not 100% unanimous, step back 5 paces and renegotiate before trying again.',
      'Reach a new unexpected location after 5 successful unanimous turns.',
    ],
    cooperativeHook:
      'Turns cannot be made until every player points in the exact same direction on the simultaneous count.',
    vibes: ['social', 'explorer'],
    arcPhase: 'climax',
    intensity: 'standard',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 3,
    maxParticipants: 10,
    durationBounds: {
      minMinutes: 10,
      defaultMinutes: 14,
      maxMinutes: 18,
    },
    suggestedRoles: [
      { id: 'countdown', title: 'Rhythm Caller', duty: 'Calls the 3-2-1 pointing count at each intersection.' },
      { id: 'tally_clerk', title: 'Tally Clerk', duty: 'Counts off the 5 successfully traversed unanimous forks.' },
    ],
    verificationType: 'action',
    tags: ['consensus', 'playful', 'orienteering'],
  },
  {
    id: 'social_epilogue_adventure_toast',
    title: 'The Real-World Victory Toast',
    brief: 'Deliver an epic group toast celebrating the adventure and take a triumphant team portrait.',
    instructions: [
      'Raise water bottles, thermoses, or pinecones into the center of the circle.',
      'Each player shares one unexpected highlight from the adventure.',
      'Clink vessels together with a spirited victory cheer.',
      'Take a final team photo showcasing big smiles and real-world accomplishment.',
    ],
    cooperativeHook:
      'Every single participant must deliver one specific compliment to the person on their right.',
    vibes: ['social', 'creative'],
    arcPhase: 'epilogue',
    intensity: 'chill',
    environments: ['any', 'outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 12,
    durationBounds: {
      minMinutes: 4,
      defaultMinutes: 6,
      maxMinutes: 8,
    },
    suggestedRoles: [
      { id: 'toastmaster', title: 'Toastmaster', duty: 'Initiates the celebration toast.' },
      { id: 'chronicler', title: 'Photographer', duty: 'Frames and snaps the celebratory group photo.' },
    ],
    verificationType: 'photo',
    tags: ['toast', 'celebration', 'memory'],
  },
];
