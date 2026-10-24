export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type VideoType =
  | 'documentary'
  | 'news_explainer'
  | 'educational'
  | 'technology'
  | 'history'
  | 'business'
  | 'social_short';

export type Pacing = 'contemplative' | 'calm' | 'moderate' | 'dynamic' | 'rapid';

export type ProjectStatus =
  | 'draft'
  | 'uploading'
  | 'transcribing'
  | 'needs_transcript_review'
  | 'planning_visuals'
  | 'awaiting_plan_approval'
  | 'finding_media'
  | 'building_first_cut'
  | 'ready_to_edit'
  | 'needs_review'
  | 'rendering'
  | 'export_ready'
  | 'failed'
  | 'canceled';

export interface Project {
  id: string;
  workspaceId: string;
  title: string;
  brief: string;
  audience: string;
  tone: string;
  visualPacing: Pacing;
  videoType: VideoType;
  language: string;
  status: ProjectStatus;
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  fpsNumerator: number;
  fpsDenominator: number;
  narrationAssetIds: string[];
  themeId: string;
  brandKitId?: string;
  sourcePolicyId: string;
  timelineRevisionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
  confidence?: number;
}

export interface TranscriptSegment {
  id: string;
  projectId: string;
  startMs: number;
  endMs: number;
  text: string;
  speakerId: string;
  confidence?: number;
  reviewed: boolean;
  locked: boolean;
  words?: WordTimestamp[];
  flaggedProperName?: string;
  pronunciationNotes?: string;
}

export type PreferredMediaType = 'video' | 'image' | 'motion_graphic';
export type AuthenticityRequirement = 'actual_event' | 'illustrative' | 'flexible';
export type SceneStatus = 'planned' | 'approved' | 'acquired' | 'flagged';

export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  startFrame: number;
  durationFrames: number;
  transcriptSegmentIds: string[];
  narrativePurpose: string;
  visualIntent: string;
  searchQueries: string[];
  entityConstraints?: string;
  preferredMediaType: PreferredMediaType;
  authenticityRequirement: AuthenticityRequirement;
  selectedAssetIds: string[];
  status: SceneStatus;
  reviewIssueIds: string[];
  locked: boolean;
  onScreenText?: string;
  graphicSuggestion?: string;
}

export type AssetProvider =
  | 'pexels'
  | 'unsplash'
  | 'giphy'
  | 'archive'
  | 'web_reference'
  | 'user_upload';

export type AssetMediaType = 'video' | 'image' | 'audio';

export type AcquisitionStatus =
  | 'preview_only'
  | 'import_permitted'
  | 'requires_review'
  | 'reference_only'
  | 'acquired'
  | 'failed';

export interface Asset {
  id: string;
  projectId: string;
  provider: AssetProvider;
  providerAssetId: string;
  mediaType: AssetMediaType;
  title: string;
  sourcePageUrl: string;
  previewUrl: string;
  acquiredObjectKey?: string;
  creatorName: string;
  creatorUrl?: string;
  width: number;
  height: number;
  durationMs?: number;
  mimeType: string;
  checksum?: string;
  rightsRecordId: string;
  acquisitionStatus: AcquisitionStatus;
  authenticity: 'actual_event' | 'illustrative' | 'unknown';
  metadata: Record<string, any>;
  createdAt: string;
}

export type RightsClassification =
  | 'public_domain'
  | 'creative_commons'
  | 'editorial_license'
  | 'commercial_license'
  | 'fair_use_reference'
  | 'uncleared_unknown';

export interface RightsRecord {
  id: string;
  assetId: string;
  classification: RightsClassification;
  previewAllowed: boolean;
  importAllowed: boolean;
  transformationAllowed: boolean;
  exportAllowed: boolean;
  commercialUseAllowed: boolean | 'unknown';
  attributionRequired: boolean;
  attributionText: string;
  licenseUrl?: string;
  evidenceUrl?: string;
  evidenceNotes?: string;
  userAttestation?: {
    attestedBy: string;
    attestedAt: string;
    reason: string;
  };
  reviewedAt?: string;
  reviewedBy?: string;
  policyVersion: string;
}

export type TrackType =
  | 'titles'
  | 'captions'
  | 'footage'
  | 'overlays'
  | 'narration'
  | 'music'
  | 'sfx';

export interface TimelineTrack {
  id: string;
  projectId: string;
  type: TrackType;
  name: string;
  order: number;
  muted: boolean;
  hidden: boolean;
  locked: boolean;
}

export type TimelineItemType =
  | 'video'
  | 'image'
  | 'text'
  | 'title'
  | 'lower_third'
  | 'quote'
  | 'caption'
  | 'audio';

export interface TimelineItem {
  id: string;
  trackId: string;
  assetId?: string;
  type: TimelineItemType;
  name: string;
  startFrame: number;
  durationFrames: number;
  sourceInMs: number;
  sourceOutMs: number;
  playbackRate: number;
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  crop: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  opacity: number;
  effects: {
    brightness: number; // -1 to 1 (0 default)
    contrast: number;   // 0 to 2 (1 default)
    saturation: number; // 0 to 2 (1 default)
    vignette: number;   // 0 to 1 (0 default)
    blur: number;       // 0 to 10px
  };
  audio: {
    gain: number;       // 0 to 2 (1 default)
    fadeInMs: number;
    fadeOutMs: number;
  };
  textContent?: string;
  subtitleText?: string;
  graphicTemplateId?: string;
  captionStyle?: string;
  provenance?: string;
  sourceLabel?: string;
  manuallyModified: boolean;
  locked: boolean;
}

export type JobType =
  | 'transcription'
  | 'scene_planning'
  | 'media_search'
  | 'media_acquisition'
  | 'assembly'
  | 'render';

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'canceled';

export interface Job {
  id: string;
  projectId: string;
  type: JobType;
  status: JobStatus;
  currentStage: string;
  progress?: number;
  attempts: number;
  inputRevisionId?: string;
  outputArtifactIds?: string[];
  errorCode?: string;
  errorMessage?: string;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExportSettings {
  fileName: string;
  container: 'mp4' | 'webm';
  videoCodec: 'h264' | 'vp9';
  resolution: '1080p' | '720p' | '4k';
  width: number;
  height: number;
  frameRate: 30 | 24 | 60;
  qualityBitrate: 'high' | 'standard' | 'low';
  audioCodec: 'aac' | 'opus';
  audioSampleRate: 48000 | 44100;
  captionMode: 'burn_in' | 'sidecar' | 'both' | 'none';
  exportRange: 'entire_timeline' | 'in_out_range';
}

export interface PreflightResult {
  readyToExport: boolean;
  blockers: string[];
  warnings: string[];
  rightsClearedCount: number;
  rightsPendingCount: number;
  unverifiedAssets: string[];
}

export interface ExportRecord {
  id: string;
  projectId: string;
  timelineRevisionId: string;
  status: 'queued' | 'preparing' | 'rendering' | 'encoding' | 'packaging' | 'completed' | 'failed';
  settings: ExportSettings;
  preflightResults: PreflightResult;
  outputUrl?: string;
  outputBlob?: Blob;
  outputFileSize?: number;
  durationSeconds?: number;
  supportingArtifacts?: {
    srt?: string;
    vtt?: string;
    transcriptTxt?: string;
    attributionReportMd?: string;
    attributionReportCsv?: string;
    projectJson?: string;
  };
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export type IssueLevel = 'blocker' | 'warning' | 'info';
export type IssueCategory =
  | 'media_availability'
  | 'rights_attribution'
  | 'factual_matching'
  | 'timeline_integrity'
  | 'caption_quality'
  | 'audio_analysis'
  | 'render_compatibility';

export interface ReviewIssue {
  id: string;
  projectId: string;
  sceneId?: string;
  assetId?: string;
  timelineItemId?: string;
  level: IssueLevel;
  category: IssueCategory;
  title: string;
  description: string;
  evidenceOrReason: string;
  suggestedFix: string;
  timeRange?: {
    startMs: number;
    endMs: number;
  };
  resolved: boolean;
  resolutionNote?: string;
}

export interface AssistantEditProposal {
  id: string;
  userRequest: string;
  affectedSceneIds: string[];
  affectedTimelineItemIds: string[];
  proposedOperations: string[];
  narrationImpact: 'none' | 'audio_preserved_caption_adjusted' | 'trimmed';
  sourceRightsImpact: string;
  additionalJobsRequired: boolean;
  status: 'pending' | 'applied' | 'rejected';
  timestamp: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  captionPreset: string;
  lowerThirdStyle: string;
  titleStyle: string;
  transitionDefault: 'cut' | 'cross_dissolve' | 'fade_black';
  motionIntensity: 'subtle' | 'moderate' | 'dramatic';
}

export interface BrandKit {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  captionPreset: string;
  defaultLowerThird: string;
  titleStyle: string;
  sourceLabelStyle: string;
  defaultTransition: string;
  motionIntensity: 'subtle' | 'moderate' | 'dramatic';
  defaultSourcePolicy: 'strict_commercial' | 'licensed_and_pd' | 'research_and_review';
}

export interface SourcePolicy {
  id: string;
  name: string;
  preset: 'strict_commercial' | 'licensed_and_pd' | 'research_and_review';
  allowedProviders: AssetProvider[];
  allowIllustrativeFootage: boolean;
  preferActualEvent: boolean;
  requireSourceLabels: boolean;
  excludeIdentifiablePeople: boolean;
  enableSensitiveReview: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
}

export interface GraphicsTemplate {
  id: string;
  name: string;
  category: 'title' | 'lower_third' | 'quote' | 'chapter' | 'statistic' | 'source_credit';
  previewText: string;
  defaultDurationFrames: number;
  supportedAspectRatios: AspectRatio[];
  themeId?: string;
}
