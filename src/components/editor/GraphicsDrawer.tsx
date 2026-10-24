import React from 'react';
import { Type, Plus, X, Layers, Sparkles } from 'lucide-react';
import { GRAPHICS_TEMPLATES } from '../../data/templates';
import { useProject } from '../../context/ProjectContext';
import { TimelineItem } from '../../types';

interface GraphicsDrawerProps {
  onClose: () => void;
}

export const GraphicsDrawer: React.FC<GraphicsDrawerProps> = ({ onClose }) => {
  const { currentFrame, updateTimelineItem, timelineItems, setSelectedItemId } = useProject();

  const handleInsertTemplate = (tmpl: (typeof GRAPHICS_TEMPLATES)[0]) => {
    const newItem: TimelineItem = {
      id: `item_graphic_${Date.now()}`,
      trackId: 'track_titles',
      type: tmpl.category === 'chapter' ? 'title' : (tmpl.category as any),
      name: tmpl.name,
      startFrame: currentFrame,
      durationFrames: tmpl.defaultDurationFrames,
      sourceInMs: 0,
      sourceOutMs: 4000,
      playbackRate: 1.0,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0 },
      crop: { top: 0, bottom: 0, left: 0, right: 0 },
      opacity: 1.0,
      effects: { brightness: 0, contrast: 1, saturation: 1, vignette: 0, blur: 0 },
      audio: { gain: 1, fadeInMs: 0, fadeOutMs: 0 },
      textContent: tmpl.previewText,
      subtitleText: tmpl.category === 'lower_third' ? 'Location & Context' : undefined,
      graphicTemplateId: tmpl.id,
      manuallyModified: true,
      locked: false,
    };

    // Insert into items
    timelineItems.push(newItem);
    setSelectedItemId(newItem.id);
    onClose();
  };

  return (
    <div className="w-80 bg-app-panel border-r border-app-border flex flex-col h-full shrink-0 select-none z-20">
      <div className="p-3 border-b border-app-border flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-track-titles" />
            <span>Graphics & Typography</span>
          </h3>
          <p className="text-[10px] text-text-muted">Broadcast-ready cards & lower thirds</p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {GRAPHICS_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-3 bg-app-elevated border border-app-border rounded-editor space-y-2 hover:border-accent/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-accent/20 text-accent uppercase">
                {tmpl.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                {(tmpl.defaultDurationFrames / 30).toFixed(1)}s
              </span>
            </div>

            <div className="font-semibold text-xs text-text-primary">{tmpl.name}</div>

            {/* Visual style preview */}
            <div className="p-2.5 rounded bg-app-panel border border-app-border/60 text-center">
              <span className="text-xs italic text-amber-200 line-clamp-2">
                “{tmpl.previewText}”
              </span>
            </div>

            <button
              onClick={() => handleInsertTemplate(tmpl)}
              className="w-full py-1.5 px-3 rounded bg-app-panel hover:bg-accent hover:text-white border border-app-border text-text-secondary text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              <span>Insert at Playhead</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
