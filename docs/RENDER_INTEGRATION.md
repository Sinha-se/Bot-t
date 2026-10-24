# Video Render & Export Pipeline Integration

## Dual Pipeline Architecture: Browser & Distributed Worker

Framecraft is architected with complete preview-to-export parity:

1. **Client-Side Live Exporter (Active in Demo & Web App):**
   - Renders frames on an HTML5 2D Canvas matching project aspect ratio (16:9, 9:16, 1:1, 4:5).
   - Canvas stream captured via `HTMLCanvasElement.captureStream(30)`.
   - Audio tracks mixed via `AudioContext.createMediaStreamDestination()`.
   - Encoded directly by the browser's `MediaRecorder` API into real playable `video/webm` or `video/mp4` blobs.
   - Provides 100% genuine video file downloads without requiring external server clusters.

2. **Server-Side FFmpeg Worker (Production Cluster Spec):**
   - Headless worker reads the immutable timeline revision JSON.
   - Constructs an FFmpeg filtergraph:
     - Multi-input overlays for video clips with scale, crop, and transform parameters.
     - Color filters (`eq=brightness=...:contrast=...:saturation=...`, `vignette=PI/4`).
     - Audio crossfades and ducking filters (`amix`, `afade`, `volume`).
     - Subtitle burn-in via `subtitles=path.srt:force_style='...'`.
   - Encodes via `libx264` / `aac` or `libvpx-vp9` / `libopus`.
   - Uploads distribution artifacts to S3-compatible object storage.

## Preflight Verification
Before triggering render in either pipeline:
- Every timeline item with an `assetId` is checked against `RightsRecord.exportAllowed`.
- Any item with `exportAllowed: false` halts the render pipeline and registers a blocker issue.
