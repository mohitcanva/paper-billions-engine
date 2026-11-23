# Paper Billions Remotion Video Engine 🎬💸

A complete, free, production-ready [Remotion](https://remotion.dev) (TypeScript) video project engineered in the iconic **'Paper Billions'** YouTube explainer style.

Features clean 2D flat-vector SVG components, thick dark outlines, expressive stick-figure bean characters with **continuous full-narration lip sync via `useAudioData`**, pre-built SVG props, a dramatic `BlackTitleCard` component, an animated financial `BarChart`, and an automated timeline synchronization script (`sync_durations.js`).

---

## 🎧 Continuous Narration Architecture

Unlike traditional shot-by-shot editors that stitch fragmented clips, this engine uses a **single continuous narration MP3** (`public/audio/full_voiceover.mp3`):

1. **Global Seamless Playback**: The root `<Video />` component plays `full_voiceover.mp3` continuously across the entire composition timeline, eliminating audio cuts, gaps, or clipping between scenes.
2. **Storyboard Timestamp Routing**: In `public/storyboard.json`, each scene specifies its `start_time` and `end_time` (in seconds).
3. **Offset-Aware Character Lip-Sync**: The `<Character />` component receives `audioSrc` pointing to `full_voiceover.mp3` and `audioOffsetInFrames` matching the scene's start frame. `useAudioData` and `visualizeAudio` automatically sample the exact waveform segment corresponding to the scene in real time!
4. **Automated Synchronization**: Running `node sync_durations.js` automatically measures the exact duration of `full_voiceover.mp3`, sets the total composition duration, and calculates each scene's `durationInFrames = Math.round((end_time - start_time) * fps)`.

---

## 📁 Project Architecture

```
remotion-paper-billions/
├── package.json               # pnpm scripts & dependencies (Remotion, Media-Utils, React 18)
├── tsconfig.json              # TypeScript configuration
├── remotion.config.ts         # Remotion render flags
├── sync_durations.js          # Continuous audio measurement & timeline sync
├── public/
│   ├── audio/
│   │   └── full_voiceover.mp3 # Master continuous narration voiceover track
│   ├── props/                 # Reusable 2D flat-vector SVG assets
│   │   ├── money_bag.svg      # Classic burlap money sack with green '$' badge
│   │   ├── balloon.svg        # Glossy celebratory / inflation balloon with highlight
│   │   └── server.svg         # Enterprise data center tower with blinking LEDs
│   └── storyboard.json        # Single source of truth (start_time, end_time, visual data)
├── src/
│   ├── index.ts               # Remotion entry point
│   ├── Root.tsx               # Composition registry (Full Video + Component Sandbox)
│   ├── Video.tsx              # Main orchestrator mapping storyboard scenes with global audio
│   ├── types.ts               # Full TypeScript type definitions
│   └── components/
│       ├── Character.tsx      # Paper Billions bean character with offset-aware useAudioData lip-sync
│       ├── BlackTitleCard.tsx # Dramatic matte black title card with staggered typography
│       ├── BarChart.tsx       # 2D vector animated bar chart with counting value indicators
│       ├── Props.tsx          # React components for MoneyBag, Balloon, and Server props
│       └── SceneContainer.tsx # Tactile grid environment wrapper for scenes
└── README.md
```

---

## 🚀 Quickstart & Workflow

### 1. Place Your Voiceover
Place your voiceover file in `public/audio/full_voiceover.mp3` (or configure a custom filename in `public/storyboard.json`).

### 2. Configure Scene Timestamps
Open `public/storyboard.json` and set your scene cuts:
```json
{
  "title": "How He Built A Paper Billion Dollar Empire",
  "fps": 30,
  "audioFile": "audio/full_voiceover.mp3",
  "scenes": [
    {
      "id": "scene_1_intro",
      "type": "black_title_card",
      "start_time": 0.0,
      "end_time": 3.5,
      "title": "HOW TO BUILD A BILLION DOLLAR EMPIRE"
    },
    {
      "id": "scene_2_character_money",
      "type": "character_prop",
      "start_time": 3.5,
      "end_time": 7.7,
      "headline": "THE ACCUMULATION PHASE",
      "character": {
        "pose": "holding",
        "prop": "money_bag",
        "expression": "happy",
        "x": 960,
        "y": 620,
        "scale": 2.2
      }
    }
  ]
}
```

### 3. Measure & Synchronize Timeline
```bash
pnpm run sync
# or
node sync_durations.js
```
This automatically measures the length of `full_voiceover.mp3`, sets `totalDurationInSeconds` & `totalDurationInFrames`, calculates each scene's frame count, and outputs a formatted timeline schedule table.

### 4. Preview in Remotion Studio
```bash
pnpm start
# launches Remotion Studio without trying to auto-open desktop browser (--no-open)
```
Open `http://localhost:3000` in your mobile or desktop browser to preview and scrub through frames.

### 5. Render Final Master Video
```bash
pnpm run build
# renders out to out/video.mp4
```
