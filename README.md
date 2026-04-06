# Memory Master

A retro pixel-art memory training game with 8 challenge types, adaptive difficulty, daily challenges, and persistent progress tracking.

## Challenges

| Challenge | Category | Description |
|-----------|----------|-------------|
| Observation Chamber | Observation | Memorize a scene of objects, answer questions about details |
| Link Chain | Association | Remember and reconstruct a word chain in order |
| Number Shape | Numerical | Memorize and recall digit sequences |
| Palace Builder | Spatial | Place items in rooms using the Method of Loci |
| Face Vault | Social | Match procedurally generated pixel faces to names |
| Card Recall | Sequential | Memorize and reconstruct a playing card sequence |
| Story Recall | Narrative | Read a story, answer detail questions |
| Date Keeper | Sequential | Memorize historical event dates |

## Features

- **Daily Challenges** -- 3 per day (weakness / balance / challenge slots) with streak tracking
- **Adaptive Difficulty** -- 10 levels per category, auto-adjusts based on recent performance
- **19 Achievements** across bronze, silver, gold, and diamond tiers
- **8 Titles** from Novice to Living Legend
- **Statistics** -- score history chart, streak calendar, category levels, best performances
- **8-bit Sound** -- synthesized via Web Audio API, adjustable volume
- **Persistent Save** -- localStorage with JSON export/import backup

## Tech Stack

- React 19 + TypeScript
- Zustand (state management + localStorage persistence)
- Vite (build tool)
- Tailwind CSS 4 (pixel-art theme)
- Framer Motion (animations)
- Recharts (statistics charts)

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
  challenges/     8 challenge modules, each self-contained
  components/     React components (dashboard, stats, settings, UI library)
  engine/         Core logic (difficulty, achievements, scoring, daily picker)
  state/          Zustand store + persistence utilities
  data/           Static data (achievements, titles, word banks, events)
  types/          TypeScript definitions
  hooks/          useTimer, useSound
  sound/          Web Audio synthesizer
```
