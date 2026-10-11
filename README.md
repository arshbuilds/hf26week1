# Adventure Generator 🌲

> **Touch Grass**: A web app designed to get groups of friends off their phones and doing creative, collaborative things together in the real world — powered by open-source AI.

Built for the **[Hacktoberfest Open-Source AI Challenge: Week 1 ("Touch Grass")](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)**.

---

## 🌟 The Core Concept

Most phone apps compete for attention, keeping eyes glued to glass. **Adventure Generator does the exact opposite**:
- The screen is the **shortest** part of the experience (30 seconds of setup).
- Once launched, **phones go into pockets**.
- Soft audio chimes and haptic vibrations guide pacing while friends collaborate face-to-face outdoors.

### Example Quest:
**45 Minutes · 4 Friends · Creative Archetype**
1. **Stage 1 (Warmup — 7 min)**: *The Tactile Palette* — Silently collect 4 distinct natural textures and arrange a tactile gradient.
2. **Stage 2 (Exploration — 12 min)**: *The Natural Color Spectrum* — Forage fallen organic colors into a seamless straight-line rainbow.
3. **Stage 3 (Climax — 15 min)**: *Crown of the Wild* — Build an ephemeral balanced sculpture using collected branches and flowers.
4. **Stage 4 (Epilogue — 11 min)**: *The 60-Second Legend* — Recite an origin folklore myth in a circle, contributing one sentence each.

---

## 🤖 Why Open-Source AI Matters Here

The challenge asks: *"Why does open innovation matter for what you built? What did it make possible that a closed API wouldn't?"*

1. **Zero-Signal / Offline on the Trail**:
   When groups are deep in a national park, mountain trail, or city greenway, cellular reception is notoriously unreliable. Closed proprietary APIs (OpenAI, Anthropic) fail completely without constant network pings. By supporting **local in-browser open weights** (via WebGPU / ONNX with models like `SmolLM-360M` and `Qwen2.5-0.5B`), Adventure Generator runs **100% offline with zero internet connection**.
2. **Real-World Privacy**:
   Adventures often involve personal group dynamics, family moments, and exact physical locations. Local open-weight inference keeps personal prompts and debrief logs strictly on the user's device.
3. **Zero Operational Costs & Model Freedom**:
   Community members and student clubs can run unlimited outdoor campaigns without paywalled subscriptions, API keys, or rate limits.

---

## 🏛️ Clean Modular Architecture

Adventure Generator is structured with strict **Separation of Concerns**:

```
UI LAYER
│  ├── SetupScreen (Controls, Vibe Cards, AI Toggles)
│  ├── AdventureBriefing (Itinerary, Narrative Storyline)
│  ├── MissionHUD (Outdoor Countdown, Cooperative Hook, Roles)
│  ├── IntermissionScreen (30-second regroup buffer)
│  └── DebriefScreen (Stats, Group Prompts, Victory)
│
CORE ENGINE (Pure TypeScript, Zero Framework Dependencies)
│  ├── domain/ (Mission, Adventure, ArcPhase, Schema Validators)
│  ├── generator/ (Elastic Time Allocator, PRNG, Arc Sequencer, Role Assigner)
│  ├── ai/ (Open-Source Providers: In-Browser WebGPU, Ollama, HuggingFace, Fallback)
│  ├── runtime/ (Drift-Compensated Timer, State Machine, Audio/Haptic Cues)
│  └── data/ (Seed Mission Catalogs & Narrative Templates)
│
INFRASTRUCTURE
   └── persistence/ (LocalStorage offline session resilience)
```

### Key Engineering Features:
- **Elastic Continuous Time Allocator**: Dynamically solves time budgets so that $\sum \text{allocatedMinutes} \equiv \text{targetMinutes}$ with zero time drift, whether the user enters 23 min or 75 min.
- **Narrative Arc Sequencer**: Automatically structures missions into a dramatic curve (Warmup $\to$ Exploration $\to$ Climax $\to$ Epilogue).
- **Drift-Compensated Timekeeper**: Uses delta timestamp checks to prevent browser throttle drift when phones sleep in pockets.
- **Web Audio & Haptic Feedback**: Lightweight synthesized chimes (half-time, 1-minute warning, stage complete) without external MP3 files.
- **Session Rehydration**: Saves active adventures to `localStorage` so accidental browser refreshes on the trail never lose progress.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation & Run
```bash
# Install dependencies
npm install

# Run the Vitest test suite (71+ tests)
npm test

# Start the local development server
npm run dev
```

Visit `http://localhost:5173` to test the application.

---

## 🧪 Testing Strategy

Run the complete test suite:
```bash
npm test
```
The test suite includes:
- **Domain Invariant Validation**: Ensures 100% of missions satisfy duration bounds, participant limits, and cooperative hooks.
- **200-Iteration Property-Based Fuzz Testing**: Verifies that random durations (15-120m), party sizes (1-10p), vibes, and environments never crash or drift.
- **Runtime State Machine Tests**: Verifies timer ticks, pause/resume, early completions, skips, and stage transitions.

---

## 📄 License & Hacktoberfest

Proudly open source under the MIT License. Contributions are welcomed! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to add your own missions.
