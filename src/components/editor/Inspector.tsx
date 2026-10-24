import React from 'react';
import {
  Sliders,
  Type,
  Volume2,
  Crop,
  Move,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Copy,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { THEMES } from '../../data/themes';

interface InspectorProps {
  onOpenReplaceModal?: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({ onOpenReplaceModal }) => {
  const {
    project,
    selectedItem,
    updateTimelineItem,
    deleteItem,
    duplicateItem,
    assets,
    rights,
  } = useProject();

  if (!selectedItem) {
    const currentTheme = THEMES.find((t) => t.id === project.themeId) || THEMES[0];
    return (
      <div className="p-4 space-y-6 text-xs text-text-secondary select-none">
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Project Inspector</h3>
          <p className="text-text-muted text-[11px]">Select any clip on the timeline to edit properties.</p>
        </div>

        <div className="bg-app-elevated/70 border border-app-border rounded-editor p-3 space-y-2.5">
          <div className="flex justify-between">
            <span className="text-text-muted">Aspect Ratio:</span>
            <span className="font-mono text-text-primary">{project.aspectRatio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Frame Rate:</span>
            <span className="font-mono text-text-primary">{project.fpsNumerator} fps</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Visual Theme:</span>
            <span className="text-accent font-medium">{currentTheme.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Audio First:</span>
            <span className="text-track-narration font-medium">Narration Master Locked</span>
          </div>
        </div>

        <div className="p-3 bg-app-panel border border-app-border rounded-editor space-y-2">
          <span className="font-semibold text-text-primary block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Creative Brief
          </span>
          <p className="text-[11px] text-text-muted leading-relaxed line-clamp-4">
            {project.brief}
          </p>
        </div>
      </div>
    );
  }

  const asset = assets.find((a) => a.id === selectedItem.assetId);
  const rightRecord = asset ? rights[asset.rightsRecordId] : null;

  const isTextGraphic = ['title', 'lower_third', 'quote', 'caption'].includes(selectedItem.type);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 text-xs text-text-secondary select-none">
      {/* Clip Header */}
      <div className="border-b border-app-border pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent uppercase tracking-wider">
            {selectedItem.type}
          </span>
          {selectedItem.locked && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted bg-app-elevated px-1.5 py-0.5 rounded border border-app-border">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          )}
        </div>
        <input
          type="text"
          value={selectedItem.name}
          onChange={(e) => updateTimelineItem(selectedItem.id, { name: e.target.value })}
          className="bg-app-elevated border border-app-border focus:border-accent rounded px-2 py-1 text-xs font-semibold text-text-primary w-full focus:outline-none"
        />
      </div>

      {/* Text Content (if Title, Lower Third, Quote, or Caption) */}
      {isTextGraphic && (
        <div className="space-y-2.5 border-b border-app-border pb-4">
          <div className="flex items-center gap-1.5 font-semibold text-text-primary">
            <Type className="w-3.5 h-3.5 text-track-titles" />
            <span>Typography & Copy</span>
          </div>

          <div>
            <label className="text-[10px] text-text-muted block mb-1">Primary Text</label>
            <textarea
              rows={2}
              value={selectedItem.textContent || ''}
              onChange={(e) => updateTimelineItem(selectedItem.id, { textContent: e.target.value })}
              className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-xs text-text-primary focus:outline-none resize-none"
            />
          </div>

          {selectedItem.type === 'lower_third' || selectedItem.type === 'title' ? (
            <div>
              <label className="text-[10px] text-text-muted block mb-1">Subtitle / Credit</label>
              <input
                type="text"
                value={selectedItem.subtitleText || ''}
                onChange={(e) =>
                  updateTimelineItem(selectedItem.id, { subtitleText: e.target.value })
                }
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded px-2 py-1 text-xs text-text-primary focus:outline-none"
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Transform & Scale */}
      <div className="space-y-2.5 border-b border-app-border pb-4">
        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
          <Move className="w-3.5 h-3.5 text-accent" />
          <span>Transform & Framing</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-text-muted block mb-1">Scale</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={selectedItem.transform.scale}
              onChange={(e) =>
                updateTimelineItem(selectedItem.id, {
                  transform: { ...selectedItem.transform, scale: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-accent"
            />
            <span className="text-[10px] font-mono text-text-muted">
              {Math.round(selectedItem.transform.scale * 100)}%
            </span>
          </div>

          <div>
            <label className="text-[10px] text-text-muted block mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedItem.opacity}
              onChange={(e) =>
                updateTimelineItem(selectedItem.id, { opacity: parseFloat(e.target.value) })
              }
              className="w-full accent-accent"
            />
            <span className="text-[10px] font-mono text-text-muted">
              {Math.round(selectedItem.opacity * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Color Adjustments & Effects */}
      <div className="space-y-2.5 border-b border-app-border pb-4">
        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
          <Sliders className="w-3.5 h-3.5 text-track-footage" />
          <span>Color & Atmosphere</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
              <span>Brightness</span>
              <span className="font-mono">{(selectedItem.effects.brightness * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.02"
              value={selectedItem.effects.brightness}
              onChange={(e) =>
                updateTimelineItem(selectedItem.id, {
                  effects: { ...selectedItem.effects, brightness: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
              <span>Contrast</span>
              <span className="font-mono">{(selectedItem.effects.contrast * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.02"
              value={selectedItem.effects.contrast}
              onChange={(e) =>
                updateTimelineItem(selectedItem.id, {
                  effects: { ...selectedItem.effects, contrast: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
              <span>Vignette Edge</span>
              <span className="font-mono">{(selectedItem.effects.vignette * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={selectedItem.effects.vignette}
              onChange={(e) =>
                updateTimelineItem(selectedItem.id, {
                  effects: { ...selectedItem.effects, vignette: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-accent"
            />
          </div>
        </div>
      </div>

      {/* Audio Gain */}
      <div className="space-y-2.5 border-b border-app-border pb-4">
        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
          <Volume2 className="w-3.5 h-3.5 text-track-music" />
          <span>Audio Levels</span>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
            <span>Gain</span>
            <span className="font-mono">{(selectedItem.audio.gain * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={selectedItem.audio.gain}
            onChange={(e) =>
              updateTimelineItem(selectedItem.id, {
                audio: { ...selectedItem.audio, gain: parseFloat(e.target.value) },
              })
            }
            className="w-full accent-track-music"
          />
        </div>
      </div>

      {/* Rights & Provenance */}
      {asset && (
        <div className="space-y-2 border-b border-app-border pb-4">
          <div className="flex items-center gap-1.5 font-semibold text-text-primary">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Source Provenance</span>
          </div>

          <div className="p-2.5 bg-app-elevated border border-app-border rounded space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-text-muted">Provider:</span>
              <span className="font-semibold text-text-primary uppercase">{asset.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Creator:</span>
              <span className="text-text-primary truncate">{asset.creatorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Classification:</span>
              <span className="font-mono text-accent text-[10px]">
                {rightRecord?.classification || 'uncleared'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Commercial Export:</span>
              <span
                className={`font-semibold ${
                  rightRecord?.commercialUseAllowed === true
                    ? 'text-status-success'
                    : rightRecord?.commercialUseAllowed === false
                    ? 'text-status-error'
                    : 'text-status-warning'
                }`}
              >
                {rightRecord?.commercialUseAllowed === true
                  ? 'Cleared'
                  : rightRecord?.commercialUseAllowed === false
                  ? 'Restricted'
                  : 'Action Required'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {onOpenReplaceModal && asset && (
          <button
            onClick={onOpenReplaceModal}
            className="w-full py-2 px-3 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-text-primary font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent" />
            <span>Replace Asset with Cleared Stock</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => duplicateItem(selectedItem.id)}
            className="py-1.5 px-3 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => deleteItem(selectedItem.id)}
            disabled={selectedItem.locked}
            className="py-1.5 px-3 rounded bg-app-elevated hover:bg-status-error/20 border border-app-border hover:border-status-error/40 text-text-secondary hover:text-status-error disabled:opacity-30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
