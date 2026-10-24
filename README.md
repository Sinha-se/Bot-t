# Framecraft — Audio-First AI Video Editing Studio

> **“Upload your narration. Describe the video. Review the visual plan. Let the agent assemble a first cut. Refine it in a professional editor. Export confidently.”**

Framecraft is a professional web application designed for documentary creators, educational channels, and news explainers. It turns an uploaded English narration audio file and natural language creative brief into a time-aligned transcript, an AI-generated visual storyboard, rights-gated stock footage selections, and a fully editable multitrack video timeline.

---

## 1. Core Principles

1. **Audio-First Authority:** The user’s recorded narration is the master timing clock. Spoken words are never rewritten or silently replaced with synthetic speech.
2. **Editable Automation:** The AI creates a first cut, not a flattened video. Every clip, title, lower third, caption, transition, and volume envelope remains directly editable.
3. **Truthful Functionality:** Clear distinction between native capabilities, demo simulation, and unconfigured external integrations.
4. **Source-Aware Rights Gates:** Finding media is not permission to export it. Uncleared web clippings default to `uncleared_unknown` and block export until replaced with licensed stock.
5. **Reversible AI Agent:** AI editing suggestions are presented as structured proposal cards detailing affected scenes, operations, and narration safety. Full undo/redo history.

---

## 2. Seed Demo Project: “Before the City Wakes”

Framecraft comes preloaded with a rich observational documentary demo:
- **Format:** 16:9 Landscape • 1920 × 1080 • 30 fps • ~90 seconds.
- **Narration Master:** 12 time-aligned spoken segments (e.g. *“Before sunrise, the city is already preparing to move...”*).
- **Visual Plan:** 12 structured scenes with search queries, media intent, and authenticity constraints.
- **Multitrack Timeline:** 7 distinct tracks (Titles, Captions, Primary Footage, Overlays, Narration [Locked], Music, SFX).
- **Legitimate Review States:** Includes a location-specific archival check, an unverified web reference blocking export, an aspect ratio warning, and an unreviewed transcript flag.

Launch it instantly by navigating to `/demo`.

---

## 3. Technology Stack

- **Frontend & App Shell:** TypeScript, React 18, Vite 8, Tailwind CSS, Lucide Icons, React Router 7.
- **Audio Analysis Engine:** HTML5 Web Audio API (real multi-channel decoding, sample rate measurement, 100-peak waveform generation).
- **Video Player & Compositor:** HTML5 2D Canvas (real-time rendering of clips, titles, quotes, lower thirds, captions, safe-area guides).
- **Real Video Exporter:** HTML5 Canvas `captureStream(30)` + Web Audio `AudioDestination` + `MediaRecorder` API (generates real, downloadable `.webm` / `.mp4` video files).
- **Package Artifacts:** Generates downloadable `.srt`, `.vtt`, plain `.txt` transcripts, `.md`/`.csv` source attribution reports, and `.json` timeline project archives.

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install Dependencies
```bash
npm install
```

### Run Unit Tests
```bash
npm test
```
Runs 9 comprehensive unit tests covering:
- Millisecond-to-SRT and WebVTT timecode conversions
- Frame calculations at 30 fps
- Source rights policy evaluation and export clearance gating
- Subtitle and plain transcript document generation

### Development Server
```bash
npm run dev
```
Starts the studio server on `http://0.0.0.0:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 5. Information Architecture & Key Routes

### Public
- `/` — Public Start Page with hero, interactive mockup, workflow explanation, and capabilities.
- `/sign-in` & `/sign-up` — Studio authentication and profile initialization.
- `/demo` — Instant 1-click launch of the demo project.

### Workspace
- `/app` / `/app/projects` — Studio Dashboard with continue editing hero, recent projects, and active job counters.
- `/app/projects/new` — 5-Step New Project Wizard (Brief → Audio Upload & Waveform → Style Theme → Source Policy → Preflight).
- `/app/projects/:id/transcript` — Timestamped transcript editor with click-to-seek playback, word tokens, and proper name checks.
- `/app/projects/:id/storyboard` — Scene cards deck with visual intent, search queries, and approval checks.
- `/app/projects/:id/generation` — Transparent agent workspace showing 12 processing stages.
- `/app/projects/:id/editor` — Full Multitrack Editor centerpiece (Video Player, Timeline, Tool Rail, Inspector, AI Assistant).
- `/app/projects/:id/review` — Dedicated Preflight Quality & Source Review with export blockers and attribution report table.
- `/app/projects/:id/export` — Export configuration (container, resolution, frame rate, caption mode).
- `/app/projects/:id/exports/:id` — Live render progress bar and export success screen with real video downloads.
- `/app/media` — Rights-aware media library (Pexels, Unsplash, Archives, Web references).
- `/app/templates` — Broadcast titles, lower thirds, quotes, and motion graphics library.
- `/app/brand-kits` — Reusable typography, color palettes, and transition presets.
- `/app/jobs` — Background job log stream.
- `/app/settings` — System Capability Matrix, Integration statuses, Privacy, and Keyboard shortcuts reference.

---

## 6. Keyboard Shortcuts
- `Space` — Play / Pause timeline playback
- `←` / `→` — Step 1 frame backward / forward
- `Shift` + `←` / `→` — Step 1 second (30 frames)
- `S` — Split selected clip at playhead
- `Backspace` / `Delete` — Delete selected timeline clip
- `Ctrl/Cmd + Z` — Undo timeline edit
- `Ctrl/Cmd + Shift + Z` — Redo timeline edit
- `Ctrl/Cmd + K` — Open Command Palette & Shortcuts reference
- `+` / `-` — Zoom in / out timeline ruler
