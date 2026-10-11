---
title: Adventure Generator — Real-World Cooperative Multiplayer Quests Powered by Open-Source AI
published: true
tags: devchallenge, hf26challenge, opensource, webdev
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

Most modern web and mobile apps are engineered to capture attention, maximize screen time, and keep our eyes glued to glass. 

**Adventure Generator** does the exact opposite: **it uses open-source AI to get groups of friends off their phones and doing creative, collaborative things together in the real world.**

A group of friends opens the app, chooses:
- **Available Time** (15 to 90 minutes)
- **Number of People** (2 to 8+ participants)
- **Adventure Archetype (Vibe)** (*Creative*, *Explorer*, *Detective*, *Active*, *Social*)
- **Terrain & Intensity** (Park, Wild Trail, Urban Campus)
- **Optional Local Context** (e.g. *"Autumn oak forest near a creek"*)

Within seconds, the app synthesizes a **timed sequence of cooperative real-world missions**:

### Example Adventure:
**45 Minutes · 4 Friends · Creative Archetype**
1. **Stage 1 (Warmup — 7 min)**: *The Tactile Palette* — Silently collect 4 distinct natural textures and agree on a tactile gradient by consensus nod.
2. **Stage 2 (Exploration — 12 min)**: *The Natural Color Spectrum* — Each person is assigned a color family to forage; together they arrange a straight-line natural rainbow.
3. **Stage 3 (Climax — 15 min)**: *Crown of the Wild* — Build a balanced ephemeral nature sculpture with twigs and blossoms that stands freely for 30 seconds.
4. **Stage 4 (Epilogue — 11 min)**: *The 60-Second Legend* — Gather in a circle and recite an origin myth explaining the sculpture, taking turns contributing one sentence each.

### The Pocket Companion Philosophy
The screen is the **shortest** part of the experience:
- Once an adventure launches, **phones go into pockets**.
- The app uses **Web Audio synth chimes** and **haptic vibration patterns** (Half-time chime, 1-minute warning, Stage victory fanfare) so the team is paced without needing to look at a screen.

---

## Demo

- **Live Web App (Vercel)**: [https://hf26week1.vercel.app](https://hf26week1.vercel.app)
- **Local Preview**: Run locally with `npm run dev` at `http://localhost:5173`.
- **Zero-Install Offline Capability**: Runs in modern mobile browsers with full offline session preservation via `localStorage`.

---

## Code

- **GitHub Repository**: [https://github.com/arshbuilds/hf26week1](https://github.com/arshbuilds/hf26week1)
- Built with **TypeScript**, **React 18**, **Tailwind CSS**, and **Vitest**.
- Clean Architecture separating pure domain logic and algorithmic solvers from UI components.

---

## How I Built It

Adventure Generator is built around a **pluggable Open-Source AI layer** and a **deterministic algorithmic pacing engine**:

### 1. Open-Source AI Providers (`src/core/ai/`)
The system treats the AI as an **outdoor Dungeon Master** through a decoupled `AIProvider` contract:
- **In-Browser Open-Weight Provider**: Designed to run local open-weight SLMs (like `SmolLM-360M` or `Qwen2.5-0.5B`) directly in the browser via WebGPU / ONNX without pinging any remote cloud servers.
- **Local Ollama Open Model Provider**: Connects to self-hosted open-weight models (`llama3.2:1b`, `qwen2.5`, `mistral`) running on `localhost:11434`.
- **Hugging Face Open Inference**: Connects to open weights on the Hugging Face Hub.
- **Deterministic Engine Fallback**: An algorithmic synthesizer ensuring generation always succeeds in sub-5ms on any low-power device.

### 2. The Elastic Continuous Time Allocator (`src/core/generator/time-allocator.ts`)
Instead of hardcoding tasks, missions have elastic duration bounds (`[minMinutes, maxMinutes]`). The allocator dynamically scales task lengths so that:
$$\sum_{i=1}^k \text{allocatedMinutes}_i \equiv \text{userRequestedMinutes}$$
Whether you ask for 23, 45, or 75 minutes, tasks scale proportionally with **zero time drift**.

### 3. Narrative Arc Sequencer & Multiplayer Role Mapping
Adventures follow a dramatic curve based on total duration:
- $\le 30$ min: 3 stages (*Warmup* $\to$ *Exploration* $\to$ *Climax*)
- $31-60$ min: 4 stages (*Warmup* $\to$ *Exploration* $\to$ *Climax* $\to$ *Epilogue*)
- $> 60$ min: 5 stages (*Warmup* $\to$ *Exploration* $\to$ *Exploration* $\to$ *Climax* $\to$ *Epilogue*)

Each mission dynamically maps distinct multiplayer roles (e.g., *Pathfinder*, *Timekeeper*, *Forager*, *Architect*) to specific player numbers ($1 \dots N$).

### 4. Drift-Compensated Timekeeper & Zero-Asset Audio
Mobile browsers aggressively throttle `setInterval` when a phone screen dims in a pocket. Our `TimerService` uses delta timestamp tracking (`Date.now() - expectedStart`) so time remains accurate when phones wake up. The `AudioCueService` synthesizes tones on-the-fly using the Web Audio API without requiring bulky MP3 asset downloads.

---

## Why Does Open Innovation Matter?

In our opinion, **open-source AI is the only architecture that genuinely makes sense for a "Touch Grass" app**:

1. **Zero-Signal / 100% Offline in the Wilderness**:
   When you're hiking a mountain trail, exploring a dense botanical garden, or camping in a national park, cellular signal is frequently zero bars. Closed APIs (OpenAI, Anthropic) fail completely without continuous broadband. By running open-weight models directly on-device via WebGPU or local inference, **friends can generate new adventures deep in nature with zero internet connection**.
2. **Real-World Privacy**:
   Real-world adventures involve exact physical coordinates, family dynamics, and personal memories. Local open-weight inference keeps prompts and debrief logs strictly on the user's phone, not stored on a corporate server.
3. **Zero Cost & Democratized Play**:
   Youth groups, student clubs, and families can play unlimited multiplayer quests without paywalls, per-token billing, or subscriptions.
4. **Community Hacktoberfest Composability**:
   Anyone can add new missions simply by adding a TypeScript object to `src/core/data/catalog/`. Our automated test suite checks their schema and cooperative mechanics instantly.

---

## Prize Categories

- **Open-Source AI Challenge — Week 1 ("Touch Grass")**
- **Best Use of Render** (Hostable on Render as a static web service or containerized AI runtime).

---

## Conclusion

Technology should bring us together, not isolate us behind glowing screens. We hope **Adventure Generator** inspires you to grab your friends, head outside, breathe fresh air, and touch some grass!
