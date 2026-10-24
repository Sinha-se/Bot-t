import React, { useState } from 'react';
import { Subtitles, CheckCircle2, Download, X, Play, Sliders } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { generateSRT, generateVTT, generatePlainTranscript, downloadFile } from '../../services/exportPackager';

interface CaptionsDrawerProps {
  onClose: () => void;
}

export const CaptionsDrawer: React.FC<CaptionsDrawerProps> = ({ onClose }) => {
  const {
    project,
    transcripts,
    updateTranscriptSegment,
    timelineItems,
    updateTimelineItem,
    setCurrentTimeMs,
  } = useProject();

  const [activePreset, setActivePreset] = useState<string>('clean_documentary');

  const presets = [
    { id: 'clean_documentary', name: 'Clean Documentary', desc: 'Subtle translucent black pill with light text' },
    { id: 'editorial_boxed', name: 'Editorial Boxed', desc: 'Solid black frame with bold yellow typography' },
    { id: 'minimal_white', name: 'Minimal White', desc: 'Frameless white text with high-contrast shadow' },
    { id: 'high_contrast_social', name: 'High-Contrast Social', desc: 'Vibrant highlight background for mobile feeds' },
  ];

  const handleApplyPreset = (presetId: string) => {
    setActivePreset(presetId);
    // Apply across all caption timeline items
    timelineItems.forEach((item) => {
      if (item.trackId === 'track_captions') {
        updateTimelineItem(item.id, { captionStyle: presetId });
      }
    });
  };

  return (
    <div className="w-80 bg-app-panel border-r border-app-border flex flex-col h-full shrink-0 select-none z-20">
      <div className="p-3 border-b border-app-border flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Subtitles className="w-3.5 h-3.5 text-track-captions" />
            <span>Captions & Subtitles</span>
          </h3>
          <p className="text-[10px] text-text-muted">Time-aligned captions with word timings</p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-app-border space-y-2">
        <span className="text-[10px] uppercase font-mono text-text-muted tracking-wider">
          Style Presets
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className={`p-2 rounded text-left border text-[11px] transition-colors ${
                activePreset === p.id
                  ? 'bg-accent/20 border-accent text-accent font-semibold'
                  : 'bg-app-elevated border-app-border text-text-secondary hover:text-text-primary hover:bg-app-hover'
              }`}
            >
              <div className="truncate">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Caption segments list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <span className="text-[10px] uppercase font-mono text-text-muted tracking-wider block">
          Segments ({transcripts.length})
        </span>

        {transcripts.map((seg, idx) => (
          <div
            key={seg.id}
            className="p-2.5 bg-app-elevated border border-app-border rounded-editor space-y-1.5 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
              <span>#0{idx + 1}</span>
              <button
                onClick={() => setCurrentTimeMs(seg.startMs)}
                className="flex items-center gap-1 text-accent hover:text-accent-active"
              >
                <Play className="w-2.5 h-2.5" />
                <span>{(seg.startMs / 1000).toFixed(1)}s - {(seg.endMs / 1000).toFixed(1)}s</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={seg.text}
              onChange={(e) => updateTranscriptSegment(seg.id, { text: e.target.value })}
              className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-1.5 text-xs text-text-primary focus:outline-none resize-none"
            />
          </div>
        ))}
      </div>

      {/* Export sidecar captions */}
      <div className="p-3 border-t border-app-border space-y-1.5">
        <span className="text-[10px] font-mono text-text-muted block">Quick Subtitle Exports:</span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => downloadFile(generateSRT(transcripts), `${project.title}.srt`)}
            className="py-1 px-2 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-[11px] text-text-secondary flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>.SRT File</span>
          </button>
          <button
            onClick={() => downloadFile(generateVTT(transcripts), `${project.title}.vtt`)}
            className="py-1 px-2 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-[11px] text-text-secondary flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>.VTT File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
