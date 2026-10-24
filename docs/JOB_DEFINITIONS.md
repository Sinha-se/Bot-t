# Background Job Definitions & Lifecycle

Long-running video production operations are executed through durable jobs with idempotent stages.

## Job Schema
```typescript
interface Job {
  id: string;
  projectId: string;
  type: 'transcription' | 'scene_planning' | 'media_search' | 'media_acquisition' | 'assembly' | 'render';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'canceled';
  currentStage: string;
  progress?: number; // 0 to 100
  attempts: number;
  inputRevisionId?: string;
  outputArtifactIds?: string[];
  errorCode?: string;
  errorMessage?: string;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Lifecycle States
1. `queued`: Job received, validated against project permissions, waiting for worker capacity.
2. `running`: Worker allocated. Emits progressive heartbeat and stdout/stderr log events.
3. `completed`: Output artifacts verified, checksummed, and revision pointer updated.
4. `failed`: Error code recorded. Retries backed off exponentially (max 3 attempts).
5. `canceled`: Gracefully terminated. Preserves already acquired intermediate assets.

## Job Types

### 1. `transcription`
- **Worker:** Python Whisper-compatible worker or lightweight local fallback.
- **Stages:**
  1. Validate audio integrity (clipping, sample rate 44.1k/48k).
  2. Neural acoustic forward pass.
  3. Word-level dynamic time warping alignment.
  4. Segment boundary extraction.
- **Outputs:** Array of `TranscriptSegment` records with integer millisecond timestamps.

### 2. `scene_planning`
- **Worker:** Structured LLM JSON agent.
- **Stages:**
  1. Intake creative brief and transcript.
  2. Compute visual cadence from pacing parameter (`calm`, `moderate`, `dynamic`).
  3. Synthesize `visualIntent` and 3–5 targeted stock search queries per scene.
  4. Flag factual specificity constraints (e.g. named locations).
- **Outputs:** Normalized array of `Scene` records.

### 3. `media_search` & `media_acquisition`
- **Worker:** Asynchronous API search workers.
- **Stages:**
  1. Concurrently query enabled providers (Pexels, Unsplash, Archives).
  2. Evaluate rights eligibility gates (commercial use, attribution requirements).
  3. Ingest candidate thumbnails and metadata.
  4. Download permitted high-resolution media into project object storage.

### 4. `assembly`
- **Worker:** Multitrack timeline composition worker.
- **Stages:**
  1. Assign footage to `track_footage` and `track_overlays`.
  2. Lock master narration on `track_narration` to prevent accidental desync.
  3. Generate broadcast lower thirds and title cards according to selected theme.
  4. Construct caption track from reviewed transcript word timings.

### 5. `render`
- **Worker:** In-browser Canvas + MediaRecorder pipeline (or distributed FFmpeg worker).
- **Stages:**
  1. `preparing`: Cache visual frames, initialize Web Audio stream.
  2. `rendering`: Composite frame-by-frame on 2D Canvas at specified fps and resolution.
  3. `encoding`: Stream canvas output and audio into video container encoder (VP9/H.264).
  4. `packaging`: Generate companion `.srt`, `.vtt`, `.md` attribution reports, and `.json` archive.
  5. `completed`: Serve authorized download blob.
