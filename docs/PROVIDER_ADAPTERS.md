# Media Provider Adapters & Rights Gates

Finding media is not equivalent to having permission to export it. Every provider adapter maps external assets to a canonical `Asset` and `RightsRecord`.

## Canonical Rights Record Structure
```typescript
interface RightsRecord {
  id: string;
  assetId: string;
  classification:
    | 'public_domain'
    | 'creative_commons'
    | 'editorial_license'
    | 'commercial_license'
    | 'fair_use_reference'
    | 'uncleared_unknown';
  previewAllowed: boolean;
  importAllowed: boolean;
  transformationAllowed: boolean;
  exportAllowed: boolean;
  commercialUseAllowed: boolean | 'unknown';
  attributionRequired: boolean;
  attributionText: string;
  licenseUrl?: string;
  evidenceNotes?: string;
  policyVersion: string;
}
```

## Provider Adapters

### 1. Pexels Adapter (`pexels`)
- **Media Types:** Photos and Video Footage.
- **License Classification:** `commercial_license`.
- **Rights Policy:**
  - `commercialUseAllowed`: `true`.
  - `exportAllowed`: `true`.
  - `attributionRequired`: `true` (Display creator name and Pexels attribution).
  - Transformation permitted (cropping, grading, text overlay).

### 2. Unsplash Adapter (`unsplash`)
- **Media Types:** Still Photography (Does not provide video footage).
- **License Classification:** `commercial_license`.
- **Rights Policy:**
  - `commercialUseAllowed`: `true`.
  - `exportAllowed`: `true`.
  - `attributionRequired`: `true` ("Photo by [Creator] / Unsplash").

### 3. Historical Archives Adapter (`archive`)
- **Media Types:** Archival imagery and public domain newsreels.
- **License Classification:** `editorial_license` or `public_domain`.
- **Rights Policy:**
  - `commercialUseAllowed`: `false` by default unless explicitly tagged PD-US.
  - `exportAllowed`: Blocked or restricted by default.
  - Requires user verification note or editorial release proof before export.

### 4. Web References Adapter (`web_reference`)
- **Media Types:** Discovered web images or link clippings.
- **License Classification:** `uncleared_unknown`.
- **Strict Boundary:**
  - `previewAllowed`: `true` (within editor for research).
  - `importAllowed`: `false` for final video rendering.
  - `exportAllowed`: `false` (BLOCKER).
  - Web clippings cannot silently become exportable. They must be replaced with cleared stock before rendering.
