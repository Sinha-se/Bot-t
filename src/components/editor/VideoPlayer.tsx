import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { renderCanvasFrame } from '../../services/videoRenderer';

export const VideoPlayer: React.FC = () => {
  const {
    project,
    setProject,
    timelineItems,
    assets,
    selectedItemId,
    currentFrame,
    setCurrentFrame,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
  } = useProject();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showSafeAreas, setShowSafeAreas] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const fps = project.fpsNumerator || 30;

  // Aspect ratio resolution
  let canvasWidth = 1920;
  let canvasHeight = 1080;
  if (project.aspectRatio === '9:16') {
    canvasWidth = 1080;
    canvasHeight = 1920;
  } else if (project.aspectRatio === '1:1') {
    canvasWidth = 1080;
    canvasHeight = 1080;
  } else if (project.aspectRatio === '4:5') {
    canvasWidth = 1080;
    canvasHeight = 1350;
  }

  // Draw current frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCanvasFrame(
      ctx,
      canvasWidth,
      canvasHeight,
      currentFrame,
      fps,
      timelineItems,
      assets,
      selectedItemId
    );

    // Optional safe-area overlay guides
    if (showSafeAreas) {
      ctx.save();
      // Action Safe (90%)
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(canvasWidth * 0.05, canvasHeight * 0.05, canvasWidth * 0.9, canvasHeight * 0.9);

      // Title Safe (80%)
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvasWidth * 0.1, canvasHeight * 0.1, canvasWidth * 0.8, canvasHeight * 0.8);

      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2 - 15, canvasHeight / 2);
      ctx.lineTo(canvasWidth / 2 + 15, canvasHeight / 2);
      ctx.moveTo(canvasWidth / 2, canvasHeight / 2 - 15);
      ctx.lineTo(canvasWidth / 2, canvasHeight / 2 + 15);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
      ctx.restore();
    }
  }, [currentFrame, fps, timelineItems, assets, selectedItemId, canvasWidth, canvasHeight, showSafeAreas]);

  // Format timecode: 00:01:24:12
  const formatTimecode = (frame: number) => {
    const totalSeconds = Math.floor(frame / fps);
    const frames = frame % fps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  };

  const maxFrames = Math.max(...timelineItems.map((i) => i.startFrame + i.durationFrames), 2700);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-[#080A0E] border-b border-app-border relative flex-1 min-h-[340px] select-none"
    >
      {/* Top overlay toolbar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-app-panel/90 backdrop-blur-md border border-app-border rounded-editor px-2.5 py-1 text-xs font-mono text-text-primary shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="tabular-nums font-semibold tracking-wider">
              {formatTimecode(currentFrame)}
            </span>
            <span className="text-text-muted text-[10px]">/ {formatTimecode(maxFrames)}</span>
          </div>

          <div className="bg-app-panel/90 backdrop-blur-md border border-app-border rounded-editor px-2 py-1 text-[11px] font-mono text-text-muted shadow-lg">
            Frame <span className="text-text-primary tabular-nums">{currentFrame}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Aspect ratio quick selector */}
          <select
            value={project.aspectRatio}
            onChange={(e) => setProject((p) => ({ ...p, aspectRatio: e.target.value as any }))}
            className="bg-app-panel/90 backdrop-blur-md border border-app-border rounded-editor px-2 py-1 text-xs text-text-secondary focus:outline-none focus:border-accent shadow-lg"
          >
            <option value="16:9">16:9 Landscape</option>
            <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
            <option value="1:1">1:1 Square</option>
            <option value="4:5">4:5 Social</option>
          </select>

          {/* Safe areas toggle */}
          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`p-1.5 rounded-editor border backdrop-blur-md shadow-lg transition-colors ${
              showSafeAreas
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-app-panel/90 border-app-border text-text-muted hover:text-text-primary'
            }`}
            title="Toggle Safe Area Guides (Action 90% / Title 80%)"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-editor bg-app-panel/90 border border-app-border text-text-muted hover:text-text-primary backdrop-blur-md shadow-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Video Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
        <div
          className="relative shadow-2xl rounded-sm overflow-hidden flex items-center justify-center border border-app-border/40"
          style={{
            aspectRatio: project.aspectRatio === '9:16' ? '9/16' : project.aspectRatio === '1:1' ? '1/1' : project.aspectRatio === '4:5' ? '4/5' : '16/9',
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full object-contain cursor-crosshair"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        </div>
      </div>

      {/* Transport Controls Bar */}
      <div className="h-11 bg-app-panel border-t border-app-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentFrame(0)}
            className="p-1.5 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Jump to Beginning (Home)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
            className="p-1.5 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Step Back 1 Frame (←)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center shadow-md shadow-accent/20 transition-transform active:scale-95"
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentFrame(Math.min(maxFrames, currentFrame + 1))}
            className="p-1.5 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Step Forward 1 Frame (→)"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentFrame(maxFrames)}
            className="p-1.5 rounded hover:bg-app-hover text-text-muted hover:text-text-primary transition-colors"
            title="Jump to End (End)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Speed:</span>
          <div className="flex items-center bg-app-elevated rounded border border-app-border p-0.5">
            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackSpeed(rate)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  playbackSpeed === rate
                    ? 'bg-accent text-white font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Master Audio Status */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Volume2 className="w-3.5 h-3.5 text-track-narration" />
          <span className="text-[11px] font-mono">48kHz Master</span>
        </div>
      </div>
    </div>
  );
};
