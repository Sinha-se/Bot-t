import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  loadProjectData,
  saveProjectData,
  initializeStorageIfEmpty,
} from '../services/storageService';
import { DEMO_PROJECT_ID } from '../data/seedData';
import { preloadAssetImages } from '../services/videoRenderer';

interface ProjectContextType {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  transcripts: TranscriptSegment[];
  updateTranscriptSegment: (id: string, updates: Partial<TranscriptSegment>) => void;
  scenes: Scene[];
  updateScene: (id: string, updates: Partial<Scene>) => void;
  tracks: TimelineTrack[];
  toggleTrackMute: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackHidden: (trackId: string) => void;
  timelineItems: TimelineItem[];
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItem: TimelineItem | null;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  splitItemAtPlayhead: () => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  replaceAssetOnItem: (itemId: string, newAssetId: string) => void;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  currentTimeMs: number;
  setCurrentTimeMs: (ms: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  timelineZoom: number;
  setTimelineZoom: React.Dispatch<React.SetStateAction<number>>;
  snappingEnabled: boolean;
  setSnappingEnabled: (enabled: boolean) => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  issues: ReviewIssue[];
  resolveIssue: (issueId: string, resolutionNote?: string) => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  proposals: AssistantEditProposal[];
  applyProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
  assets: Asset[];
  rights: Record<string, RightsRecord>;
  brandKits: BrandKit[];
  switchProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  initializeStorageIfEmpty();

  const [activeProjectId, setActiveProjectId] = useState<string>(DEMO_PROJECT_ID);
  const initialData = loadProjectData(activeProjectId);

  const [project, setProject] = useState<Project>(initialData.project);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>(initialData.transcripts);
  const [scenes, setScenes] = useState<Scene[]>(initialData.scenes);
  const [tracks, setTracks] = useState<TimelineTrack[]>(initialData.tracks);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(initialData.items);
  const [issues, setIssues] = useState<ReviewIssue[]>(initialData.issues);
  const [jobs, setJobs] = useState<Job[]>(initialData.jobs);
  const [proposals, setProposals] = useState<AssistantEditProposal[]>(initialData.proposals);
  const [assets, setAssets] = useState<Asset[]>(initialData.assets);
  const [rights, setRights] = useState<Record<string, RightsRecord>>(initialData.rights);
  const [brandKits, setBrandKits] = useState<BrandKit[]>(initialData.brandKits);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [timelineZoom, setTimelineZoom] = useState<number>(4); // px per frame
  const [snappingEnabled, setSnappingEnabled] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Undo / Redo history
  const historyStack = useRef<TimelineItem[][]>([initialData.items]);
  const historyIndex = useRef<number>(0);

  const fps = project.fpsNumerator || 30;
  const currentTimeMs = Math.round((currentFrame / fps) * 1000);

  // Preload asset images for crisp canvas display
  useEffect(() => {
    preloadAssetImages(assets);
  }, [assets]);

  // Push to history when timeline items mutate
  const pushTimelineState = useCallback((newItems: TimelineItem[]) => {
    const newStack = historyStack.current.slice(0, historyIndex.current + 1);
    newStack.push(newItems);
    if (newStack.length > 50) newStack.shift();
    historyStack.current = newStack;
    historyIndex.current = newStack.length - 1;
    setTimelineItems(newItems);
    setSaveStatus('unsaved');
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      setTimelineItems(historyStack.current[historyIndex.current]);
      setSaveStatus('unsaved');
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current < historyStack.current.length - 1) {
      historyIndex.current += 1;
      setTimelineItems(historyStack.current[historyIndex.current]);
      setSaveStatus('unsaved');
    }
  }, []);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < historyStack.current.length - 1;

  // Auto-save debounce
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        saveProjectData(project.id, {
          project,
          transcripts,
          scenes,
          tracks,
          items: timelineItems,
          issues,
          jobs,
          proposals,
          assets,
          rights,
          brandKits,
        });
        setTimeout(() => setSaveStatus('saved'), 300);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, project, transcripts, scenes, tracks, timelineItems, issues, jobs, proposals, assets, rights, brandKits]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 1000 / (fps * playbackSpeed);
    const maxFrames = Math.max(...timelineItems.map((i) => i.startFrame + i.durationFrames), 2700);

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= maxFrames) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, fps, playbackSpeed, timelineItems]);

  const setCurrentTimeMs = useCallback((ms: number) => {
    setCurrentFrame(Math.round((ms / 1000) * fps));
  }, [fps]);

  const selectedItem = timelineItems.find((i) => i.id === selectedItemId) || null;

  const updateTranscriptSegment = useCallback((id: string, updates: Partial<TranscriptSegment>) => {
    setTranscripts((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, ...updates } : seg))
    );
    setSaveStatus('unsaved');
  }, []);

  const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
    setScenes((prev) =>
      prev.map((scene) => (scene.id === id ? { ...scene, ...updates } : scene))
    );
    setSaveStatus('unsaved');
  }, []);

  const toggleTrackMute = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
    setSaveStatus('unsaved');
  }, []);

  const toggleTrackLock = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
    );
    setSaveStatus('unsaved');
  }, []);

  const toggleTrackHidden = useCallback((trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, hidden: !t.hidden } : t))
    );
    setSaveStatus('unsaved');
  }, []);

  const updateTimelineItem = useCallback((id: string, updates: Partial<TimelineItem>) => {
    const updated = timelineItems.map((item) =>
      item.id === id ? { ...item, ...updates, manuallyModified: true } : item
    );
    pushTimelineState(updated);
  }, [timelineItems, pushTimelineState]);

  const splitItemAtPlayhead = useCallback(() => {
    if (!selectedItemId) return;
    const item = timelineItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    // Check if playhead is within item bounds
    const itemEnd = item.startFrame + item.durationFrames;
    if (currentFrame <= item.startFrame + 5 || currentFrame >= itemEnd - 5) return;

    const firstDuration = currentFrame - item.startFrame;
    const secondDuration = item.durationFrames - firstDuration;

    const firstItem: TimelineItem = {
      ...item,
      durationFrames: firstDuration,
      manuallyModified: true,
    };

    const secondItem: TimelineItem = {
      ...item,
      id: `item_${Date.now()}_split`,
      startFrame: currentFrame,
      durationFrames: secondDuration,
      manuallyModified: true,
    };

    const updated = timelineItems.map((i) => (i.id === item.id ? firstItem : i));
    updated.push(secondItem);
    pushTimelineState(updated);
    setSelectedItemId(secondItem.id);
  }, [selectedItemId, timelineItems, currentFrame, pushTimelineState]);

  const deleteItem = useCallback((id: string) => {
    const item = timelineItems.find((i) => i.id === id);
    if (!item || item.locked) return; // Prevent deleting locked narration
    const updated = timelineItems.filter((i) => i.id !== id);
    pushTimelineState(updated);
    if (selectedItemId === id) setSelectedItemId(null);
  }, [timelineItems, selectedItemId, pushTimelineState]);

  const duplicateItem = useCallback((id: string) => {
    const item = timelineItems.find((i) => i.id === id);
    if (!item) return;
    const duplicate: TimelineItem = {
      ...item,
      id: `item_${Date.now()}_dup`,
      startFrame: item.startFrame + item.durationFrames,
      name: `${item.name} (Copy)`,
      manuallyModified: true,
    };
    pushTimelineState([...timelineItems, duplicate]);
    setSelectedItemId(duplicate.id);
  }, [timelineItems, pushTimelineState]);

  const replaceAssetOnItem = useCallback((itemId: string, newAssetId: string) => {
    const newAsset = assets.find((a) => a.id === newAssetId);
    if (!newAsset) return;

    const updated = timelineItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          assetId: newAsset.id,
          name: newAsset.title,
          sourceLabel: `${newAsset.creatorName} / ${newAsset.provider}`,
          manuallyModified: true,
        };
      }
      return item;
    });
    pushTimelineState(updated);

    // If this replaced item had a review issue, mark it resolved
    setIssues((prev) =>
      prev.map((iss) =>
        iss.timelineItemId === itemId || iss.assetId === itemId
          ? { ...iss, resolved: true, resolutionNote: `Replaced with cleared asset: ${newAsset.title}` }
          : iss
      )
    );
  }, [assets, timelineItems, pushTimelineState]);

  const resolveIssue = useCallback((issueId: string, resolutionNote?: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              resolved: true,
              resolutionNote: resolutionNote || 'User verified and acknowledged source context.',
            }
          : iss
      )
    );
    setSaveStatus('unsaved');
  }, []);

  const addJob = useCallback((job: Job) => {
    setJobs((prev) => [job, ...prev]);
    setSaveStatus('unsaved');
  }, []);

  const applyProposal = useCallback((proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId);
    if (!prop) return;

    if (proposalId === 'prop_replace_restricted_news') {
      replaceAssetOnItem('item_vid_09', 'asset_unsplash_people_hands');
      resolveIssue('issue_rights_web_ref_02', 'Replaced with commercial-cleared Unsplash asset');
    } else if (proposalId === 'prop_apply_subtle_grain') {
      const updated = timelineItems.map((i) =>
        i.trackId === 'track_footage'
          ? {
              ...i,
              effects: { ...i.effects, vignette: 0.12, contrast: 1.05 },
              manuallyModified: true,
            }
          : i
      );
      pushTimelineState(updated);
    }

    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'applied' } : p))
    );
    setSaveStatus('unsaved');
  }, [proposals, replaceAssetOnItem, resolveIssue, timelineItems, pushTimelineState]);

  const rejectProposal = useCallback((proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
    setSaveStatus('unsaved');
  }, []);

  const switchProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    const data = loadProjectData(projectId);
    setProject(data.project);
    setTranscripts(data.transcripts);
    setScenes(data.scenes);
    setTracks(data.tracks);
    setTimelineItems(data.items);
    setIssues(data.issues);
    setJobs(data.jobs);
    setProposals(data.proposals);
    setAssets(data.assets);
    setRights(data.rights);
    setBrandKits(data.brandKits);
    setSelectedItemId(null);
    setCurrentFrame(0);
    setIsPlaying(false);
    historyStack.current = [data.items];
    historyIndex.current = 0;
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        transcripts,
        updateTranscriptSegment,
        scenes,
        updateScene,
        tracks,
        toggleTrackMute,
        toggleTrackLock,
        toggleTrackHidden,
        timelineItems,
        selectedItemId,
        setSelectedItemId,
        selectedItem,
        updateTimelineItem,
        splitItemAtPlayhead,
        deleteItem,
        duplicateItem,
        replaceAssetOnItem,
        currentFrame,
        setCurrentFrame,
        currentTimeMs,
        setCurrentTimeMs,
        isPlaying,
        setIsPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        timelineZoom,
        setTimelineZoom,
        snappingEnabled,
        setSnappingEnabled,
        saveStatus,
        undo,
        redo,
        canUndo,
        canRedo,
        issues,
        resolveIssue,
        jobs,
        addJob,
        proposals,
        applyProposal,
        rejectProposal,
        assets,
        rights,
        brandKits,
        switchProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
