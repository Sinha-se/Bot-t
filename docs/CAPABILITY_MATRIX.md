# Framecraft System Capability Matrix & Technical Truthfulness

In compliance with Framecraft non-negotiable principles (Section 1.3), this matrix truthfully outlines what is fully implemented, what runs in demo mode, and what requires external credentials or distributed workers.

## 1. Feature Capability Status

| Capability / Workflow Area | Status | Runtime Engine | Notes & Boundaries |
| :--- | :--- | :--- | :--- |
| **Audio-First Upload & Decoding** | **Fully Implemented** | HTML5 Web Audio API | Decodes real sample rate, channel count, duration, and extracts 100 waveform peaks. |
| **Spoken Narration Authority** | **Fully Implemented** | Client State & AudioContext | Narration track locked by default. Spoken words are never hallucinated or replaced. |
| **Timestamped Transcript Review** | **Fully Implemented** | Interactive Editor | Click-to-seek, edit text, mark proper names, toggle review status, lock segments. |
| **Storyboard & Visual Planning** | **Fully Implemented** | Scene Planner | 12 structured scenes, visual intent descriptions, search queries, factual flags. |
| **Multitrack Timeline Editor** | **Fully Implemented** | HTML5 2D Canvas + React | 7 tracks (Footage, Titles, Captions, Narration, Music, SFX), trim handles, split (S), duplicate, delete. |
| **Broadcast Typography & Lower Thirds** | **Fully Implemented** | Canvas Compositor | Opening titles, chapter cards, quotes, lower thirds with customizable copy and fonts. |
| **Captions & Word-by-Word Timing** | **Fully Implemented** | Canvas Compositor | 4 presets (Clean Doc, Editorial Boxed, Minimal White, Social). Generates .SRT and .VTT. |
| **Rights & Provenance Gating** | **Fully Implemented** | Rights Verification Engine | Tracks discovery, preview, import, export permissions. Blocks export if uncleared assets exist. |
| **Video File Rendering** | **Fully Implemented** | MediaRecorder + Canvas captureStream | Renders actual playable .webm / .mp4 video files downloaded directly to user machine. |
| **Companion Package Artifacts** | **Fully Implemented** | Browser File Blob Packager | Generates downloadable .SRT, .VTT, plain .TXT transcript, .MD/.CSV attribution reports, .JSON project. |
| **Reversible AI Editing Agent** | **Fully Implemented** | Structured Proposal Cards | Proposed edit cards show affected scenes, operations, narration impact. Undo/redo stack. |
| **Brand Kits & Design Systems** | **Fully Implemented** | Brand Kit Manager | Color swatches, heading/body font pairings, default caption & lower third styles. |
| **External Whisper Transcription API** | **Demo Mode / Local** | Local Fallback / Mock Engine | Seeded with realistic speech timestamps. External Whisper API requires OpenAI credentials. |
| **Live Pexels / Unsplash API Ingest** | **Demo Mode / Local** | Curated Seed Library | Uses high-resolution royalty-free stock with verified metadata; external live queries require API keys. |
| **Distributed FFmpeg Cloud Cluster** | **Requires External Worker** | Remote FFmpeg Worker | Documented in `docs/RENDER_INTEGRATION.md` for multi-node batch rendering. |

---

## 2. Technical Specifications & Limitations

### Supported Media Formats
- **Narration Audio:** `.wav`, `.mp3`, `.m4a`, `.aac`, `.ogg`.
- **Visual Stills & Footage:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.mp4`, `.webm`.
- **Export Containers:** `.mp4` (H.264/AAC), `.webm` (VP9/Opus).
- **Subtitles & Text:** `.srt` (SubRip), `.vtt` (WebVTT), `.txt` (Plain Transcript).

### Supported Visual Effects & Transforms
- Scale (50% to 200%)
- Crop (Top, Bottom, Left, Right)
- Brightness (-50% to +50%)
- Contrast (50% to 150%)
- Saturation (0% to 200%)
- Edge Vignette (0% to 80%)
- Safe-area overlay guides (Action Safe 90%, Title Safe 80%)

### Rights & Provenance Categories
1. `commercial_license`: Cleared for commercial video export (Pexels, Unsplash).
2. `editorial_license`: Requires documented editorial clearance note.
3. `public_domain`: Unrestricted historical use.
4. `uncleared_unknown`: Research reference only. **Strictly blocks video export until replaced.**

### Data Sovereignty & Storage
- All project data, timeline revisions, and transcripts persist in local browser storage (`localStorage`).
- No creative assets or narration audio are sent to external third parties without user knowledge.
- Users can clear cached storage at any time via Settings -> Privacy -> Reset Local Studio Cache.
