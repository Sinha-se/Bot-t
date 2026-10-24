import React, { useRef, useState, useCallback } from 'react';
import {
  Scissors,
  Trash2,
  Copy,
  Magnet,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Mic,
  Music,
  Video,
  Type,
  Subtitles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { TimelineItem, TimelineTrack } from '../../types';

export const Timeline: React.FC = () => {
  const {
    project,
    tracks,
    toggleTrackMute,
    toggleTrackLock,
    toggleTrackHidden,
    timelineItems,
    selectedItemId,
    setSelectedItemId,
    updateTimelineItem,
    splitItemAtPlayhead,
    deleteItem,
    duplicateItem,
    currentFrame,
    setCurrentFrame,
    timelineZoom,
    setTimelineZoom,
    snappingEnabled,
    setSnappingEnabled,
  } = useProject();

  const fps = project.fpsNumerator || 30;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [draggingTrim, setDraggingTrim] = useState<{
    itemId: string;
    handle: 'left' | 'right';
    initialFrame: number;
    initialMouseX: number;
  } | null>(null);

  // Maximum timeline duration in frames (~90s = 2700 frames)
  const maxFrames = Math.max(
    ...timelineItems.map((i) => i.startFrame + i.durationFrames),
    2700
  );

  const rulerWidthPx = Math.max(1200, maxFrames * timelineZoom);

  // Frame to pixels & pixels to frame
  const frameToPx = useCallback((frame: number) => frame * timelineZoom, [timelineZoom]);
  const pxToFrame = useCallback(
    (px: number) => Math.max(0, Math.min(maxFrames, Math.round(px / timelineZoom))),
    [timelineZoom, maxFrames]
  );

  // Handle click / drag on time ruler
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setCurrentFrame(pxToFrame(clickX));

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX - rect.left;
      setCurrentFrame(pxToFrame(currentX));
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Trim handle dragging
  const handleTrimMouseDown = (
    e: React.MouseEvent,
    item: TimelineItem,
    handle: 'left' | 'right'
  ) => {
    e.stopPropagation();
    if (item.locked) return;

    setDraggingTrim({
      itemId: item.id,
      handle,
      initialFrame: handle === 'left' ? item.startFrame : item.durationFrames,
      initialMouseX: e.clientX,
    });

    const initialStart = item.startFrame;
    const initialDur = item.durationFrames;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaPx = moveEvent.clientX - e.clientX;
      const deltaFrames = Math.round(deltaPx / timelineZoom);

      if (handle === 'left') {
        const newStart = Math.max(0, initialStart + deltaFrames);
        const newDur = Math.max(15, initialDur - (newStart - initialStart));
        updateTimelineItem(item.id, { startFrame: newStart, durationFrames: newDur });
      } else {
        const newDur = Math.max(15, initialDur + deltaFrames);
        updateTimelineItem(item.id, { durationFrames: newDur });
      }
    };

    const handleMouseUp = () => {
      setDraggingTrim(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'narration':
        return <Mic className="w-3.5 h-3.5 text-track-narration" />;
      case 'footage':
        return <Video className="w-3.5 h-3.5 text-track-footage" />;
      case 'overlays':
        return <Layers className="w-3.5 h-3.5 text-track-images" />;
      case 'titles':
        return <Type className="w-3.5 h-3.5 text-track-titles" />;
      case 'captions':
        return <Subtitles className="w-3.5 h-3.5 text-track-captions" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-track-music" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  const getClipBgClass = (trackType: string, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-accent shadow-lg bg-accent/40 border-accent';
    switch (trackType) {
      case 'narration':
        return 'bg-track-narration/25 border-track-narration/60 text-teal-200 hover:bg-track-narration/35';
      case 'footage':
        return 'bg-track-footage/25 border-track-footage/60 text-blue-200 hover:bg-track-footage/35';
      case 'overlays':
        return 'bg-track-images/25 border-track-images/60 text-indigo-200 hover:bg-track-images/35';
      case 'titles':
        return 'bg-track-titles/25 border-track-titles/60 text-purple-200 hover:bg-track-titles/35';
      case 'captions':
        return 'bg-track-captions/25 border-track-captions/60 text-amber-200 hover:bg-track-captions/35';
      case 'music':
        return 'bg-track-music/25 border-track-music/60 text-emerald-200 hover:bg-track-music/35';
      default:
        return 'bg-app-elevated border-app-border text-text-primary hover:bg-app-hover';
    }
  };

  return (
    <div className="bg-app-panel border-t border-app-border flex flex-col h-72 shrink-0 select-none">
      {/* Timeline Controls Header */}
      <div className="h-10 bg-app-elevated/70 border-b border-app-border px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Split */}
          <button
            onClick={splitItemAtPlayhead}
            disabled={!selectedItemId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-app-panel hover:bg-app-hover border border-app-border disabled:opacity-30 disabled:pointer-events-none text-text-secondary hover:text-text-primary transition-colors"
            title="Split selected clip at playhead (S)"
          >
            <Scissors className="w-3.5 h-3.5 text-accent" />
            <span>Split</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() => selectedItemId && duplicateItem(selectedItemId)}
            disabled={!selectedItemId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-app-panel hover:bg-app-hover border border-app-border disabled:opacity-30 disabled:pointer-events-none text-text-secondary hover:text-text-primary transition-colors"
            title="Duplicate selected clip"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => selectedItemId && deleteItem(selectedItemId)}
            disabled={!selectedItemId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-app-panel hover:bg-status-error/20 border border-app-border hover:border-status-error/40 disabled:opacity-30 disabled:pointer-events-none text-text-secondary hover:text-status-error transition-colors"
            title="Delete selected item (Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="h-4 w-px bg-app-border mx-1" />

          {/* Snapping */}
          <button
            onClick={() => setSnappingEnabled(!snappingEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              snappingEnabled
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-app-panel border-app-border text-text-muted hover:text-text-primary'
            }`}
            title="Toggle Snapping to Edges & Playhead"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Snap</span>
          </button>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimelineZoom((z) => Math.max(1, z - 1))}
            className="p-1 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={timelineZoom}
            onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
            className="w-24 accent-accent h-1.5 bg-app-panel rounded"
          />
          <button
            onClick={() => setTimelineZoom((z) => Math.min(10, z + 1))}
            className="p-1 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Track Grid Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers (Fixed) */}
        <div className="w-48 bg-app-panel border-r border-app-border flex flex-col shrink-0 select-none z-20">
          {/* Header spacer matching ruler */}
          <div className="h-7 border-b border-app-border px-3 flex items-center justify-between bg-app-elevated/40 text-[11px] font-mono text-text-muted">
            <span>TRACKS</span>
            <span>LOCK / MUTE</span>
          </div>

          {/* Track rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-app-border/40">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-10 px-3 flex items-center justify-between text-xs hover:bg-app-hover/50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  {getTrackIcon(track.type)}
                  <span className="font-medium text-text-secondary truncate text-[11px]">
                    {track.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleTrackLock(track.id)}
                    className={`p-1 rounded hover:bg-app-hover transition-colors ${
                      track.locked ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                    }`}
                    title={track.locked ? 'Unlock Track' : 'Lock Track'}
                  >
                    {track.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => toggleTrackMute(track.id)}
                    className={`p-1 rounded hover:bg-app-hover transition-colors ${
                      track.muted ? 'text-status-warning' : 'text-text-muted hover:text-text-primary'
                    }`}
                    title={track.muted ? 'Unmute Track' : 'Mute Track'}
                  >
                    {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => toggleTrackHidden(track.id)}
                    className={`p-1 rounded hover:bg-app-hover transition-colors ${
                      track.hidden ? 'text-status-error' : 'text-text-muted hover:text-text-primary'
                    }`}
                    title={track.hidden ? 'Show Track' : 'Hide Track'}
                  >
                    {track.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Body */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#090B0F]"
        >
          <div style={{ width: rulerWidthPx }} className="relative min-h-full">
            {/* Top Time Ruler */}
            <div
              className="h-7 border-b border-app-border bg-app-elevated/40 sticky top-0 z-30 cursor-pointer flex items-end select-none"
              onMouseDown={handleRulerMouseDown}
            >
              {Array.from({ length: Math.ceil(maxFrames / fps) + 1 }).map((_, sec) => {
                const px = frameToPx(sec * fps);
                return (
                  <div
                    key={sec}
                    style={{ left: px }}
                    className="absolute bottom-0 flex flex-col items-start"
                  >
                    <div className="h-2 w-px bg-app-border" />
                    <span className="text-[9px] font-mono text-text-muted -ml-2 mb-0.5 tabular-nums">
                      {Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Vertical Red Playhead Indicator Line */}
            <div
              style={{ left: frameToPx(currentFrame) }}
              className="absolute top-0 bottom-0 w-px bg-accent z-40 pointer-events-none"
            >
              <div className="w-3 h-3 bg-accent rounded-full -ml-[5px] -mt-1 shadow-md shadow-accent/50" />
            </div>

            {/* Track Content Rows */}
            <div className="divide-y divide-app-border/40">
              {tracks.map((track) => {
                const itemsInTrack = timelineItems.filter((i) => i.trackId === track.id);
                return (
                  <div key={track.id} className="h-10 relative bg-app-panel/20">
                    {/* Render clip blocks in this track */}
                    {itemsInTrack.map((item) => {
                      const leftPx = frameToPx(item.startFrame);
                      const widthPx = Math.max(16, frameToPx(item.durationFrames));
                      const isSelected = item.id === selectedItemId;
                      const durationSec = (item.durationFrames / fps).toFixed(1);

                      return (
                        <div
                          key={item.id}
                          style={{ left: leftPx, width: widthPx }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(item.id);
                          }}
                          className={`absolute top-1 bottom-1 rounded border text-[11px] flex items-center justify-between px-2 cursor-pointer transition-all overflow-hidden ${getClipBgClass(
                            track.type,
                            isSelected
                          )}`}
                        >
                          {/* Left trim handle */}
                          {!item.locked && (
                            <div
                              onMouseDown={(e) => handleTrimMouseDown(e, item, 'left')}
                              className="absolute left-0 top-0 bottom-0 w-1.5 hover:w-2 bg-white/20 hover:bg-accent cursor-col-resize z-10 transition-all"
                              title="Trim Clip In-Point"
                            />
                          )}

                          <div className="truncate flex items-center gap-1.5 pr-2">
                            {item.locked && <Lock className="w-2.5 h-2.5 text-text-muted shrink-0" />}
                            <span className="truncate font-medium">{item.name || item.textContent}</span>
                          </div>

                          <span className="text-[9px] font-mono opacity-70 shrink-0">
                            {durationSec}s
                          </span>

                          {/* Right trim handle */}
                          {!item.locked && (
                            <div
                              onMouseDown={(e) => handleTrimMouseDown(e, item, 'right')}
                              className="absolute right-0 top-0 bottom-0 w-1.5 hover:w-2 bg-white/20 hover:bg-accent cursor-col-resize z-10 transition-all"
                              title="Trim Clip Out-Point"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
