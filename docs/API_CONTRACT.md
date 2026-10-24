# Framecraft REST & Server Action API Contract

## 1. Project Management
- `POST /api/projects`
  - Input: `{ title, brief, videoType, aspectRatio, visualPacing, themeId, sourcePolicyId }`
  - Output: `Project` record with initial status `draft` and revision `rev_1`.
- `GET /api/projects`
  - Output: Array of projects with thumbnail, duration, status, and active issue counts.
- `GET /api/projects/:id`
  - Output: Complete project manifest including tracks, timeline items, scenes, and transcript segments.
- `PATCH /api/projects/:id`
  - Input: Partial project fields (e.g. `title`, `aspectRatio`, `themeId`).
- `DELETE /api/projects/:id`
  - Confirmation required. Soft archives or cascades dependent items.

## 2. Audio & Narration Ingest
- `POST /api/projects/:id/audio/upload`
  - Content-Type: `multipart/form-data`
  - Validates: MIME type (`audio/wav`, `audio/mpeg`, `audio/mp4`, `audio/aac`), sample rate, audio channels.
  - Returns: Asset record with `mediaType: "audio"`, waveform peak array, and duration in integer milliseconds.
- `POST /api/projects/:id/transcription/start`
  - Input: `{ language: "en-US", engine: "whisper-v3", mode: "word_aligned" }`
  - Creates durable background job `job_type: "transcription"`.

## 3. Transcript Review & Realignment
- `GET /api/projects/:id/transcripts`
  - Output: Array of `TranscriptSegment` objects with `startMs`, `endMs`, text, confidence, and timestamped words.
- `PATCH /api/projects/:id/transcripts/:segmentId`
  - Input: `{ text?: string, reviewed?: boolean, locked?: boolean, flaggedProperName?: string }`
  - Safety Guarantee: Text edits update captions and query generation; spoken audio master is preserved verbatim.

## 4. Visual Scene Planning
- `POST /api/projects/:id/scenes/generate`
  - Input: `{ brief, themeId, pacing }`
  - Output: Structured array of `Scene` items with start/duration frames, visual intent, and search queries.
- `PATCH /api/projects/:id/scenes/:sceneId`
  - Input: `{ visualIntent?: string, searchQueries?: string[], status?: 'approved' | 'flagged' }`

## 5. Media Discovery & Rights Gating
- `GET /api/media/search`
  - Query params: `q`, `provider`, `aspectRatio`, `authenticity` (`actual_event` vs `illustrative`), `commercialOnly`.
  - Output: Array of `Asset` items each paired with a non-null `RightsRecord`.
- `POST /api/projects/:id/timeline/items/:itemId/replace-asset`
  - Input: `{ newAssetId: string }`
  - Behavior: Preserves exact timeline duration and track position. Automatically updates source attribution label.

## 6. Preflight & Export Engine
- `GET /api/projects/:id/review/preflight`
  - Output: `{ readyToExport: boolean, blockers: string[], warnings: string[], clearedCount: number }`.
- `POST /api/projects/:id/exports`
  - Input: `ExportSettings` (container, resolution, frameRate, captionMode).
  - Pre-validation: Rejects with 422 if any asset has `exportAllowed: false`.
  - Output: `ExportRecord` with initial status `queued`.
