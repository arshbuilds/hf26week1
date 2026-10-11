import { Mission } from '../../domain/mission.types';

export const DETECTIVE_MISSIONS: Mission[] = [
  {
    id: 'detective_warmup_anomaly_detection',
    title: 'The Glitch in the Grove',
    brief: 'Spot 3 things in your immediate surroundings that feel out of place, unnatural, or strange.',
    instructions: [
      'Survey a 50-foot radius with detective eyes.',
      'Identify 3 anomalies: an unusual tree branch angle, an unexpected color, or an artificial artifact.',
      'Present your findings to the group and debate which is the most intriguing.',
    ],
    cooperativeHook:
      'No player may duplicate another player’s anomaly type; the team must agree unanimously on the strangest find.',
    vibes: ['detective'],
    arcPhase: 'warmup',
    intensity: 'chill',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 5,
      defaultMinutes: 7,
      maxMinutes: 10,
    },
    suggestedRoles: [
      { id: 'lead_inquisitor', title: 'Lead Inquisitor', duty: 'Questions the evidence presented by scouts.' },
      { id: 'perceptive_eye', title: 'Perceptive Eye', duty: 'Examines micro-details.' },
    ],
    verificationType: 'action',
    tags: ['deduction', 'observation', 'mystery'],
  },
  {
    id: 'detective_explore_cipher_trail',
    title: 'The Tree Bark Cipher',
    brief: 'Decipher natural patterns into secret messages across 3 ancient trees or lampposts.',
    instructions: [
      'Locate 3 distinct tree boles or historic lampposts.',
      'Trace natural moss lines, bark furrows, or carving glyphs.',
      'Transcribe the patterns into letters or symbols to compose a team code word.',
    ],
    cooperativeHook:
      'Each player is stationed at a different tree and must communicate their glyphs using hand signals only.',
    vibes: ['detective', 'creative'],
    arcPhase: 'exploration',
    intensity: 'standard',
    environments: ['outdoor', 'park', 'urban'],
    minParticipants: 3,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 8,
      defaultMinutes: 12,
      maxMinutes: 16,
    },
    suggestedRoles: [
      { id: 'signalman', title: 'Signalman', duty: 'Relays glyphs across the clearing with hand signs.' },
      { id: 'cryptographer', title: 'Cryptographer', duty: 'Decodes the relayed signals into words.' },
    ],
    verificationType: 'photo',
    tags: ['cipher', 'symbols', 'secret_codes'],
  },
  {
    id: 'detective_climax_reverse_narrative',
    title: 'The Scene Reconstruction',
    brief: 'Examine ground marks, bent branches, or footprints to deduce what happened here 24 hours ago.',
    instructions: [
      'Locate an intriguing ground perturbation (tire tracks, crushed leaves, bird feathers, dropped pinecones).',
      'Examine the micro-forensics without stepping on the scene.',
      'Construct a dramatic step-by-step hypothesis of the historical incident that took place.',
    ],
    cooperativeHook:
      'Each team member must present evidence from a different physical quadrant and defend their timeline hypothesis.',
    vibes: ['detective'],
    arcPhase: 'climax',
    intensity: 'chill',
    environments: ['outdoor', 'park'],
    minParticipants: 2,
    maxParticipants: 8,
    durationBounds: {
      minMinutes: 10,
      defaultMinutes: 14,
      maxMinutes: 18,
    },
    suggestedRoles: [
      { id: 'forensic_scout', title: 'Forensic Scout', duty: 'Measures footprint stride length and leaf displacement.' },
      { id: 'prosecutor', title: 'Case Storyteller', duty: 'Presents the final timeline hypothesis.' },
    ],
    verificationType: 'photo',
    tags: ['forensics', 'deduction', 'story'],
  },
  {
    id: 'detective_epilogue_case_verdict',
    title: 'The Classified Case File',
    brief: 'Draft a humorous 3-sentence official case closure report and seal it with a group salute.',
    instructions: [
      'Stand around the scene in formal investigator posture.',
      'Summarize the Case Name, the Primary Suspect (animal, wind, or human), and the Verdict.',
      'Take an official team detective mugshot with solemn expressions.',
    ],
    cooperativeHook:
      'All players must agree unanimously on the primary suspect; if even one dissents, deliberation continues.',
    vibes: ['detective', 'social'],
    arcPhase: 'epilogue',
    intensity: 'chill',
    environments: ['any', 'outdoor', 'park', 'urban'],
    minParticipants: 2,
    maxParticipants: 10,
    durationBounds: {
      minMinutes: 4,
      defaultMinutes: 6,
      maxMinutes: 8,
    },
    suggestedRoles: [
      { id: 'chief_inspector', title: 'Chief Inspector', duty: 'Officially announces the case verdict.' },
      { id: 'clerk', title: 'Field Clerk', duty: 'Captures the official solemn team case photo.' },
    ],
    verificationType: 'photo',
    tags: ['case_closed', 'photo', 'humor'],
  },
];
