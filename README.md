# Paper Billions Remotion Video Engine 🎬💸

A complete, free, production-ready [Remotion](https://remotion.dev) (TypeScript) video project engineered in the iconic **'Paper Billions'** YouTube explainer style.

Features clean 2D flat-vector SVG components, thick dark outlines, expressive stick-figure bean characters with **automatic mouth movement synced to real audio volume via `useAudioData`**, pre-built SVG props, a dramatic `BlackTitleCard` component, an animated financial `BarChart`, and an automated duration synchronization script (`sync_durations.js`).

---

## 📁 Project Architecture

```
remotion-paper-billions/
├── package.json               # pnpm scripts & dependencies (Remotion, Media-Utils, React 18)
├── tsconfig.json              # TypeScript configuration
├── remotion.config.ts         # Remotion render flags
├── sync_durations.js          # Node.js duration measurement & storyboard sync
├── public/
│   ├── audio/                 # Voiceover & SFX audio files (.mp3, .wav)
│   │   ├── scene1_intro.mp3
│   │   ├── scene2_growth.mp3
│   │   ├── scene3_server_crash.mp3
│   │   └── scene4_outro.mp3
│   ├── props/                 # Reusable 2D flat-vector SVG assets
│   │   ├── money_bag.svg      # Classic burlap money sack with green '$' badge
│   │   ├── balloon.svg        # Glossy celebratory / inflation balloon with highlight
│   │   └── server.svg         # Enterprise data center tower with blinking LEDs
│   └── storyboard.json        # Single source of truth for scenes, timings & visual data
├── src/
│   ├── index.ts               # Remotion entry point
│   ├── Root.tsx               # Composition registry (Full Video + Component Sandbox)
│   ├── Video.tsx              # Main orchestrator mapping storyboard.json to Remotion Series
│   ├── types.ts               # Full TypeScript type definitions
│   └── components/
│       ├── Character.tsx      # Paper Billions bean character with useAudioData mouth sync
│       ├── BlackTitleCard.tsx # Dramatic matte black title card with staggered typography
│       ├── BarChart.tsx       # 2D vector animated bar chart with counting value indicators
│       ├── Props.tsx          # React components for MoneyBag, Balloon, and Server props
│       └── SceneContainer.tsx # Tactile grid environment wrapper for scenes
└── README.md
```

---

## 🚀 Quickstart & Workflow

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Measure & Synchronize Audio Durations
Whenever you add or replace audio files in `public/audio/`, run the sync script:
```bash
pnpm run sync
# or
node sync_durations.js
```
This automatically:
- Inspects every audio file referenced in `public/storyboard.json` using `ffprobe` / `ffmpeg`.
- Calculates the exact `durationInSeconds` and corresponding `durationInFrames` for your target FPS.
- Updates `public/storyboard.json` with the exact totals.
- Displays a clean visual summary table in your terminal.

### 3. Preview in Remotion Studio
```bash
pnpm start
# or
pnpm exec remotion preview
```
Open your browser to the local URL (typically `http://localhost:3000`) to scrub through frames, inspect animations, and test audio playback.

### 4. Render Final Master Video
```bash
pnpm run build
# renders out to out/video.mp4
```

---

## 🎨 Component Catalog

### 1. `Character` (`src/components/Character.tsx`)
- **Visuals**: Thick dark outlines (`strokeWidth: 5.5`), clean circular head, bean-shaped torso, red necktie, and stick arms/legs.
- **Lip-Sync**: Uses `useAudioData` and `visualizeAudio` from `@remotion/media-utils` to calculate volume frames and scale mouth width/height dynamically in real-time.
- **Poses**: `'idle'`, `'holding'`, `'pointing_right'`, `'pointing_left'`, `'explaining'`, `'excited'`, `'shrug'`.
- **Props**: Integrates with `'money_bag'`, `'balloon'`, and `'server'`.
- **Expressions**: `'happy'`, `'excited'`, `'surprised'`, `'neutral'`.

```tsx
<Character
  pose="holding"
  prop="money_bag"
  expression="happy"
  x={960}
  y={620}
  scale={2.2}
  audioSrc={staticFile("audio/scene2_growth.mp3")}
/>
```

### 2. `BlackTitleCard` (`src/components/BlackTitleCard.tsx`)
- **Visuals**: Deep black `#080808` canvas with subtle radial gold glow and subtle tactical coordinate grid.
- **Animation**: Staggered spring entrance for each word, automatic accent color highlighting for monetary figures, and smooth kicker badge entrance.

```tsx
<BlackTitleCard
  title="HOW TO BUILD A BILLION DOLLAR EMPIRE"
  subtitle="The untold story of viral 2D flat-vector storytelling"
  kicker="EPISODE 01 // CASE STUDY"
  accentColor="#FACC15"
/>
```

### 3. `BarChart` (`src/components/BarChart.tsx`)
- **Visuals**: Tactile white card with thick dark border, Y-axis currency scale, and X-axis category labels.
- **Animation**: Staggered spring column reveals with real-time numeric value counters and an optional `★ SURGE` badge on the winning bar.

```tsx
<BarChart
  title="ANNUAL REVENUE (MILLIONS USD)"
  currency="$"
  unit="M"
  highlightIndex={3}
  bars={[
    { label: "2021", value: 1.8, color: "#94A3B8" },
    { label: "2022", value: 6.5, color: "#64748B" },
    { label: "2023", value: 24.2, color: "#38BDF8" },
    { label: "2024", value: 68.5, color: "#10B981" },
  ]}
/>
```

### 4. Flat-Vector SVG Props (`src/components/Props.tsx`)
- **`MoneyBagProp`**: Burlap money sack with tied rope neck and green `$` badge.
- **`BalloonProp`**: Glossy celebration / economic inflation balloon with gentle floating sway.
- **`ServerProp`**: Enterprise rack unit with blinking multi-color LED indicators.

---

## 📜 Storyboard-Driven Workflow (`public/storyboard.json`)
The composition dynamically builds the video from `public/storyboard.json`. You can add as many scenes as you like:

```json
{
  "id": "scene_custom",
  "type": "character_prop",
  "headline": "SCALING UP",
  "subtext": "Exponential growth begins",
  "audioFile": "audio/your_audio.mp3",
  "durationInSeconds": 4.5,
  "durationInFrames": 135,
  "character": {
    "pose": "excited",
    "prop": "balloon",
    "expression": "excited",
    "x": 960,
    "y": 620,
    "scale": 2.0
  }
}
```
Run `pnpm run sync` to automatically measure new audio files and update frame counts!
