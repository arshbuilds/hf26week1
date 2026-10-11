# Contributing to Adventure Generator 🌲

Welcome! **Adventure Generator** is an open-source project built for the **Hacktoberfest Open-Source AI Challenge: Week 1 ("Touch Grass")**.

Our mission is simple: **get groups of friends off their phones and doing creative, collaborative things together in the real world.**

---

## 🧭 The Core Design Philosophy

1. **Multiplayer, Not Solo**: Every mission must require genuine cooperation (shared goals, split roles, simultaneous actions).
2. **Minimal Screen Time**: The app is an initial spark and lightweight pocket companion, NOT the experience itself.
3. **Leave No Trace**: Missions must never harm nature, damage property, or require buying commercial products.
4. **Composability**: Missions and models are modular. You can add 50 new missions without touching the generator or UI code.

---

## 🛠️ Quickstart for Developers

```bash
# Clone the repository
git clone https://github.com/arshbuilds/hf26week1.git
cd hf26week1

# Install dependencies
npm install

# Run the test suite (Vitest)
npm test

# Start the local development server
npm run dev
```

---

## 🎯 How to Add a New Mission (Hacktoberfest Friendly!)

Adding a mission is the fastest, cleanest way to contribute.

1. Open the appropriate catalog file in `src/core/data/catalog/`:
   - `creative.ts` (Artistic, crafting, natural components)
   - `explorer.ts` (Orientation, micro-biomes, summits, cairns)
   - `detective.ts` (Environmental clues, anomaly hunting, deductions)
   - `active.ts` (Synchronized movement, balance, obstacle traverses)
   - `social.ts` (Alter-egos, storytelling, group consensus)

2. Add a new `Mission` object matching our strict schema:

```typescript
{
  id: 'your_unique_mission_id',
  title: 'Catchy Quest Title',
  brief: 'A clear, inviting one-sentence description.',
  instructions: [
    'Step 1: Disperse and observe...',
    'Step 2: Collect or position...',
    'Step 3: Complete together...'
  ],
  cooperativeHook: 'Detailed explanation (>= 15 chars) of why and how all teammates MUST cooperate.',
  vibes: ['explorer', 'creative'], // At least one vibe
  arcPhase: 'exploration',          // 'warmup' | 'exploration' | 'climax' | 'epilogue'
  intensity: 'chill',               // 'chill' | 'standard' | 'high_energy'
  environments: ['outdoor', 'park'],// 'any' | 'outdoor' | 'indoor' | 'park' | 'urban'
  minParticipants: 2,
  maxParticipants: 8,
  durationBounds: {
    minMinutes: 8,
    defaultMinutes: 12,
    maxMinutes: 16
  },
  suggestedRoles: [
    { id: 'scout', title: 'Scout', duty: 'Scans the perimeter.' },
    { id: 'anchor', title: 'Anchor', duty: 'Maintains team foundation.' }
  ],
  verificationType: 'photo',        // 'action' | 'photo' | 'honor'
  tags: ['nature', 'teamwork']
}
```

3. Run the automated catalog integrity test:

```bash
npm test
```

Our automated validator (`validateMission()`) will verify that your duration bounds (`1 <= min <= default <= max`), participant bounds, and cooperative hooks are 100% compliant.

---

## 🤖 Adding an Open-Weight AI Model or Provider

Adventure Generator supports open-source AI via a clean provider interface:

1. Implement the `AIProvider` interface in `src/core/ai/providers/`:
   ```typescript
   export interface AIProvider {
     readonly providerType: AIProviderType;
     readonly modelName: string;
     isAvailable(): Promise<boolean>;
     generateAdventure(prompt: AIAdventurePrompt): Promise<AIGenerationResult>;
   }
   ```
2. Register it in `src/core/ai/ai-orchestrator.ts`.
3. Add unit tests in `src/core/ai/ai.test.ts`.

---

## 🧪 Pull Request Checklist

Before opening your PR:
- [ ] `npm test` passes with zero failures.
- [ ] `npm run build` succeeds cleanly (`tsc && vite build`).
- [ ] New missions include an authentic, engaging `cooperativeHook`.
