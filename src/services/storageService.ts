import {
  Project,
  TranscriptSegment,
  Scene,
  TimelineTrack,
  TimelineItem,
  ReviewIssue,
  AssistantEditProposal,
  Job,
  Asset,
  RightsRecord,
  BrandKit,
} from '../types';
import {
  DEMO_PROJECT,
  DEMO_TRANSCRIPT_SEGMENTS,
  DEMO_SCENES,
  DEMO_TRACKS,
  DEMO_TIMELINE_ITEMS,
  DEMO_REVIEW_ISSUES,
  DEMO_JOBS,
  DEMO_PROPOSALS,
} from '../data/seedData';
import { STOCK_ASSETS, STOCK_RIGHTS_RECORDS } from '../data/stockLibrary';
import { INITIAL_BRAND_KITS } from '../data/brandKits';

const STORAGE_KEYS = {
  PROJECTS: 'framecraft_projects_v1',
  ACTIVE_PROJECT_ID: 'framecraft_active_project_id_v1',
  TRANSCRIPTS: 'framecraft_transcripts_v1',
  SCENES: 'framecraft_scenes_v1',
  TRACKS: 'framecraft_tracks_v1',
  ITEMS: 'framecraft_items_v1',
  ISSUES: 'framecraft_issues_v1',
  JOBS: 'framecraft_jobs_v1',
  PROPOSALS: 'framecraft_proposals_v1',
  ASSETS: 'framecraft_assets_v1',
  RIGHTS: 'framecraft_rights_v1',
  BRAND_KITS: 'framecraft_brand_kits_v1',
};

export function initializeStorageIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([DEMO_PROJECT]));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, DEMO_PROJECT.id);
    localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(DEMO_TRANSCRIPT_SEGMENTS));
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(DEMO_SCENES));
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(DEMO_TRACKS));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(DEMO_TIMELINE_ITEMS));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(DEMO_REVIEW_ISSUES));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(DEMO_JOBS));
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(DEMO_PROPOSALS));
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(STOCK_ASSETS));
    localStorage.setItem(STORAGE_KEYS.RIGHTS, JSON.stringify(STOCK_RIGHTS_RECORDS));
    localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(INITIAL_BRAND_KITS));
  }
}

export function loadProjects(): Project[] {
  initializeStorageIfEmpty();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  } catch {
    return [DEMO_PROJECT];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function loadProjectData(projectId: string) {
  initializeStorageIfEmpty();
  const allProjects = loadProjects();
  const project = allProjects.find((p) => p.id === projectId) || DEMO_PROJECT;

  const transcripts: TranscriptSegment[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS) || '[]'
  ).filter((t: TranscriptSegment) => t.projectId === projectId);

  const scenes: Scene[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.SCENES) || '[]'
  ).filter((s: Scene) => s.projectId === projectId);

  const tracks: TimelineTrack[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRACKS) || '[]'
  ).filter((tr: TimelineTrack) => tr.projectId === projectId);

  const items: TimelineItem[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]'
  );

  const issues: ReviewIssue[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ISSUES) || '[]'
  ).filter((iss: ReviewIssue) => iss.projectId === projectId);

  const jobs: Job[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.JOBS) || '[]'
  ).filter((j: Job) => j.projectId === projectId);

  const proposals: AssistantEditProposal[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.PROPOSALS) || '[]'
  );

  const assets: Asset[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ASSETS) || '[]'
  );

  const rights: Record<string, RightsRecord> = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.RIGHTS) || '{}'
  );

  const brandKits: BrandKit[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.BRAND_KITS) || '[]'
  );

  return {
    project,
    transcripts: transcripts.length > 0 ? transcripts : DEMO_TRANSCRIPT_SEGMENTS,
    scenes: scenes.length > 0 ? scenes : DEMO_SCENES,
    tracks: tracks.length > 0 ? tracks : DEMO_TRACKS,
    items: items.length > 0 ? items : DEMO_TIMELINE_ITEMS,
    issues: issues.length > 0 ? issues : DEMO_REVIEW_ISSUES,
    jobs: jobs.length > 0 ? jobs : DEMO_JOBS,
    proposals: proposals.length > 0 ? proposals : DEMO_PROPOSALS,
    assets: assets.length > 0 ? assets : STOCK_ASSETS,
    rights: Object.keys(rights).length > 0 ? rights : STOCK_RIGHTS_RECORDS,
    brandKits: brandKits.length > 0 ? brandKits : INITIAL_BRAND_KITS,
  };
}

export function saveProjectData(
  projectId: string,
  data: {
    project?: Project;
    transcripts?: TranscriptSegment[];
    scenes?: Scene[];
    tracks?: TimelineTrack[];
    items?: TimelineItem[];
    issues?: ReviewIssue[];
    jobs?: Job[];
    proposals?: AssistantEditProposal[];
    assets?: Asset[];
    rights?: Record<string, RightsRecord>;
    brandKits?: BrandKit[];
  }
) {
  if (data.project) {
    const projects = loadProjects();
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx >= 0) projects[idx] = data.project;
    else projects.push(data.project);
    saveProjects(projects);
  }
  if (data.transcripts) {
    localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(data.transcripts));
  }
  if (data.scenes) {
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(data.scenes));
  }
  if (data.tracks) {
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(data.tracks));
  }
  if (data.items) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(data.items));
  }
  if (data.issues) {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(data.issues));
  }
  if (data.jobs) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(data.jobs));
  }
  if (data.proposals) {
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(data.proposals));
  }
  if (data.assets) {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(data.assets));
  }
  if (data.rights) {
    localStorage.setItem(STORAGE_KEYS.RIGHTS, JSON.stringify(data.rights));
  }
  if (data.brandKits) {
    localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(data.brandKits));
  }
}
