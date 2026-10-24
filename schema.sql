-- =============================================================================
-- FRAMECRAFT AUDIO-FIRST AI VIDEO EDITING STUDIO
-- Canonical Normalized Relational Data Schema (PostgreSQL)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workspaces & Users
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'editor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Themes & Brand Kits
CREATE TABLE themes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    font_heading VARCHAR(100) NOT NULL,
    font_body VARCHAR(100) NOT NULL,
    primary_color VARCHAR(30) NOT NULL,
    secondary_color VARCHAR(30) NOT NULL,
    accent_color VARCHAR(30) NOT NULL,
    background_color VARCHAR(30) NOT NULL,
    caption_preset VARCHAR(50) NOT NULL,
    lower_third_style VARCHAR(50) NOT NULL,
    title_style VARCHAR(50) NOT NULL,
    transition_default VARCHAR(50) DEFAULT 'cross_dissolve',
    motion_intensity VARCHAR(50) DEFAULT 'subtle'
);

CREATE TABLE brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(30) NOT NULL,
    secondary_color VARCHAR(30) NOT NULL,
    accent_color VARCHAR(30) NOT NULL,
    font_heading VARCHAR(100) NOT NULL,
    font_body VARCHAR(100) NOT NULL,
    caption_preset VARCHAR(50) NOT NULL,
    default_lower_third VARCHAR(100) NOT NULL,
    title_style VARCHAR(100) NOT NULL,
    source_label_style VARCHAR(50) DEFAULT 'bottom_left_subtle',
    default_transition VARCHAR(50) DEFAULT 'cross_dissolve',
    motion_intensity VARCHAR(50) DEFAULT 'subtle',
    default_source_policy VARCHAR(50) DEFAULT 'strict_commercial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Source Policies
CREATE TABLE source_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    preset VARCHAR(50) NOT NULL, -- 'strict_commercial', 'licensed_and_pd', 'research_and_review'
    allowed_providers TEXT[] NOT NULL,
    allow_illustrative_footage BOOLEAN DEFAULT TRUE,
    prefer_actual_event BOOLEAN DEFAULT FALSE,
    require_source_labels BOOLEAN DEFAULT TRUE,
    exclude_identifiable_people BOOLEAN DEFAULT FALSE,
    enable_sensitive_review BOOLEAN DEFAULT TRUE,
    allowed_domains TEXT[] DEFAULT '{}',
    blocked_domains TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projects (Master Entity)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    brief TEXT NOT NULL,
    audience VARCHAR(255),
    tone VARCHAR(100),
    visual_pacing VARCHAR(50) DEFAULT 'calm',
    video_type VARCHAR(50) NOT NULL,
    language VARCHAR(20) DEFAULT 'en-US',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    aspect_ratio VARCHAR(20) DEFAULT '16:9',
    width INTEGER NOT NULL DEFAULT 1920,
    height INTEGER NOT NULL DEFAULT 1080,
    fps_numerator INTEGER NOT NULL DEFAULT 30,
    fps_denominator INTEGER NOT NULL DEFAULT 1,
    narration_asset_ids TEXT[] DEFAULT '{}',
    theme_id VARCHAR(100) REFERENCES themes(id),
    brand_kit_id UUID REFERENCES brand_kits(id),
    source_policy_id UUID REFERENCES source_policies(id),
    timeline_revision_id VARCHAR(100) NOT NULL DEFAULT 'rev_1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Rights Records & Media Assets
CREATE TABLE rights_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id VARCHAR(100) NOT NULL,
    classification VARCHAR(50) NOT NULL, -- 'public_domain', 'creative_commons', 'editorial_license', 'commercial_license', 'fair_use_reference', 'uncleared_unknown'
    preview_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    import_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    transformation_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    export_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    commercial_use_allowed VARCHAR(20) NOT NULL DEFAULT 'unknown', -- 'true', 'false', 'unknown'
    attribution_required BOOLEAN NOT NULL DEFAULT TRUE,
    attribution_text TEXT NOT NULL,
    license_url TEXT,
    evidence_url TEXT,
    evidence_notes TEXT,
    policy_version VARCHAR(50) NOT NULL,
    user_attestation_by VARCHAR(100),
    user_attestation_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(100)
);

CREATE TABLE assets (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'pexels', 'unsplash', 'giphy', 'archive', 'web_reference', 'user_upload'
    provider_asset_id VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'audio'
    title VARCHAR(255) NOT NULL,
    source_page_url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    acquired_object_key TEXT,
    creator_name VARCHAR(255) NOT NULL,
    creator_url TEXT,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    duration_ms INTEGER,
    mime_type VARCHAR(100) NOT NULL,
    checksum VARCHAR(128),
    rights_record_id UUID REFERENCES rights_records(id),
    acquisition_status VARCHAR(50) NOT NULL, -- 'preview_only', 'import_permitted', 'requires_review', 'reference_only', 'acquired', 'failed'
    authenticity VARCHAR(50) NOT NULL DEFAULT 'illustrative', -- 'actual_event', 'illustrative', 'unknown'
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Transcript Segments (Audio Authority)
CREATE TABLE transcript_segments (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    start_ms INTEGER NOT NULL,
    end_ms INTEGER NOT NULL,
    text TEXT NOT NULL,
    speaker_id VARCHAR(100) NOT NULL,
    confidence NUMERIC(4, 3),
    reviewed BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE,
    words JSONB DEFAULT '[]', -- timestamped word tokens
    flagged_proper_name VARCHAR(255),
    pronunciation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Scenes (Visual Planning)
CREATE TABLE scenes (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    start_frame INTEGER NOT NULL,
    duration_frames INTEGER NOT NULL,
    transcript_segment_ids TEXT[] NOT NULL,
    narrative_purpose TEXT NOT NULL,
    visual_intent TEXT NOT NULL,
    search_queries TEXT[] NOT NULL,
    entity_constraints TEXT,
    preferred_media_type VARCHAR(50) NOT NULL DEFAULT 'video',
    authenticity_requirement VARCHAR(50) NOT NULL DEFAULT 'illustrative',
    selected_asset_ids TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'planned', -- 'planned', 'approved', 'acquired', 'flagged'
    review_issue_ids TEXT[] DEFAULT '{}',
    locked BOOLEAN DEFAULT FALSE,
    on_screen_text TEXT,
    graphic_suggestion TEXT
);

-- 8. Timeline Tracks & Items
CREATE TABLE timeline_tracks (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'titles', 'captions', 'footage', 'overlays', 'narration', 'music', 'sfx'
    name VARCHAR(100) NOT NULL,
    "order" INTEGER NOT NULL,
    muted BOOLEAN DEFAULT FALSE,
    hidden BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE timeline_items (
    id VARCHAR(100) PRIMARY KEY,
    track_id VARCHAR(100) NOT NULL REFERENCES timeline_tracks(id) ON DELETE CASCADE,
    asset_id VARCHAR(100) REFERENCES assets(id),
    type VARCHAR(50) NOT NULL, -- 'video', 'image', 'text', 'title', 'lower_third', 'quote', 'caption', 'audio'
    name VARCHAR(255) NOT NULL,
    start_frame INTEGER NOT NULL,
    duration_frames INTEGER NOT NULL,
    source_in_ms INTEGER DEFAULT 0,
    source_out_ms INTEGER DEFAULT 0,
    playback_rate NUMERIC(3, 2) DEFAULT 1.0,
    transform JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "scale": 1, "rotation": 0}',
    crop JSONB NOT NULL DEFAULT '{"top": 0, "bottom": 0, "left": 0, "right": 0}',
    opacity NUMERIC(3, 2) DEFAULT 1.0,
    effects JSONB NOT NULL DEFAULT '{"brightness": 0, "contrast": 1, "saturation": 1, "vignette": 0, "blur": 0}',
    audio JSONB NOT NULL DEFAULT '{"gain": 1, "fadeInMs": 0, "fadeOutMs": 0}',
    text_content TEXT,
    subtitle_text TEXT,
    graphic_template_id VARCHAR(100),
    caption_style VARCHAR(50),
    provenance TEXT,
    source_label TEXT,
    manually_modified BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE
);

-- 9. Background Jobs & Exports
CREATE TABLE jobs (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'transcription', 'scene_planning', 'media_search', 'media_acquisition', 'assembly', 'render'
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    current_stage TEXT NOT NULL,
    progress NUMERIC(5, 2),
    attempts INTEGER DEFAULT 1,
    input_revision_id VARCHAR(100),
    output_artifact_ids TEXT[],
    error_code VARCHAR(100),
    error_message TEXT,
    logs TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exports (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    timeline_revision_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    settings JSONB NOT NULL,
    preflight_results JSONB NOT NULL,
    output_object_key TEXT,
    output_file_size BIGINT,
    duration_seconds NUMERIC(8, 2),
    supporting_artifacts JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT
);

-- 10. Quality & Rights Review Issues
CREATE TABLE review_issues (
    id VARCHAR(100) PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scene_id VARCHAR(100) REFERENCES scenes(id),
    asset_id VARCHAR(100) REFERENCES assets(id),
    timeline_item_id VARCHAR(100) REFERENCES timeline_items(id),
    level VARCHAR(20) NOT NULL, -- 'blocker', 'warning', 'info'
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_or_reason TEXT NOT NULL,
    suggested_fix TEXT NOT NULL,
    time_range_start_ms INTEGER,
    time_range_end_ms INTEGER,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_note TEXT
);
