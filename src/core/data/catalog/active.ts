import { Mission } from '../../domain/mission.types';

export const ACTIVE_MISSIONS: Mission[] = [
  {
    id: 'active_warmup_silent_relay',
    title: 'The Silent Cadence',
    brief: 'Walk 150 paces in single file with synchronized footsteps without a single vocal sound.',
    instructions: [
      'Line up heel-to-toe in a single-file expedition snake.',
      'Calibrate stepping cadence so every left foot strikes the dirt simultaneously.',
      'Cover 150 paces without breaking rhythm or speaking.',
    ],
    cooperativeHook:
      'Any out-of-sync footstep or laugh requires the team to freeze for 5 seconds before resuming.',
    vibes: ['active'],
    arcPhase: 'warmup',
    intensity: 'standard',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 12,
    durationBounds: {
      minMinutes: 5,
      defaultMinutes: 7,
      maxMinutes: 10,
    },
    suggestedRoles: [
      { id: 'cadence_leader', title: 'Pace Setter', duty: 'Walks at the head of the column setting rhythmic tempo.' },
      { id: 'rear_anchor', title: 'Rear Guard', duty: 'Signals cadence alignment to the team.' },
    ],
    verificationType: 'action',
    tags: ['movement', 'synchrony', 'focus'],
  },
  {
    id: 'active_explore_terrain_traversal',
    title: 'The Lava Ridge Traverse',
    brief: 'Navigate across a designated 60-foot zone stepping only on rocks, roots, or curb edges.',
    instructions: [
      'Identify a 60-foot natural or urban strip (a tree-lined path or cobblestone sector).',
      'Cross from start line to finish without any player’s shoe contacting flat dirt or grass.',
      'Help teammates balance by offering hands or linking elbows.',
    ],
    cooperativeHook:
      'Players must stay in linked physical contact (holding hands or wrists) in pairs throughout the entire traverse.',
    vibes: ['active', 'explorer'],
    arcPhase: 'exploration',
    intensity: 'high_energy',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 15,
    },
    suggestedRoles: [
      { id: 'anchor', title: 'Balance Anchor', duty: 'Provides stable footing for partners to lean on.' },
      { id: 'scout_step', title: 'Pathfinder', duty: 'Identifies the sturdiest roots and boulders ahead.' },
    ],
    verificationType: 'action',
    tags: ['balance', 'agility', 'parkour'],
  },
  {
    id: 'active_climax_human_monument',
    title: 'The Collaborative Monolith',
    brief: 'Form a complex balanced group physical sculpture where the total number of ground contact points is minimal.',
    instructions: [
      'Assemble in an open clearing.',
      'Devise an interconnected human statue where at least 2 players have both feet elevated off the ground.',
      'Hold the structure steady for a full 10-second count while breathing together.',
    ],
    cooperativeHook:
      'The entire group’s limbs must interlock; the ground touch points must be less than half of total participants.',
    vibes: ['active', 'creative'],
    arcPhase: 'climax',
    intensity: 'high_energy',
    environments: ['outdoor', 'park'],
    minParticipants: 3,
    maxParticipants: 10,
    durationBounds: {
      minMinutes: 10,
      defaultMinutes: 14,
      maxMinutes: 18,
    },
    suggestedRoles: [
      { id: 'foundation', title: 'Foundation Pillars', duty: 'Form the sturdy ground support base.' },
      { id: 'counterbalance', title: 'Counterbalance', duty: 'Positions weight gracefully to maintain equilibrium.' },
    ],
    verificationType: 'photo',
    tags: ['strength', 'balance', 'sculpture'],
  },
  {
    id: 'active_epilogue_vitality_cool_down',
    title: 'The Resonance Circle',
    brief: 'Synchronize group breathing and heart rates while listening to the wind.',
    instructions: [
      'Form a standing circle with feet shoulder-width apart, arms resting lightly on adjacent shoulders.',
      'Inhale deeply for 4 seconds, hold for 4 seconds, exhale for 6 seconds.',
      'Repeat 8 times together until collective respiration is completely unified.',
    ],
    cooperativeHook:
      'Breathing cycles must be silent and guided purely by the gentle rhythmic shoulder press of the group.',
    vibes: ['active', 'social'],
    arcPhase: 'epilogue',
    intensity: 'chill',
    environments: ['any', 'outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 12,
    durationBounds: {
      minMinutes: 4,
      defaultMinutes: 5,
      maxMinutes: 8,
    },
    suggestedRoles: [
      { id: 'tempo_guide', title: 'Resonance Keeper', duty: 'Sets the deep breath cadence.' },
    ],
    verificationType: 'honor',
    tags: ['mindfulness', 'cooldown', 'breathing'],
  },
];
