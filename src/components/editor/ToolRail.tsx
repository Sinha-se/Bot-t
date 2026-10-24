import React from 'react';
import {
  FolderOpen,
  FileText,
  LayoutGrid,
  Type,
  Subtitles,
  Sliders,
  Sparkles,
  Volume2,
  Palette,
  ShieldCheck,
} from 'lucide-react';

export type EditorDrawerTab =
  | 'media'
  | 'transcript'
  | 'scenes'
  | 'graphics'
  | 'captions'
  | 'effects'
  | 'audio'
  | 'themes'
  | 'sources'
  | null;

interface ToolRailProps {
  activeTab: EditorDrawerTab;
  setActiveTab: (tab: EditorDrawerTab) => void;
}

export const ToolRail: React.FC<ToolRailProps> = ({ activeTab, setActiveTab }) => {
  const tools = [
    { id: 'media', label: 'Media', icon: FolderOpen },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'scenes', label: 'Scenes', icon: LayoutGrid },
    { id: 'graphics', label: 'Titles & Text', icon: Type },
    { id: 'captions', label: 'Captions', icon: Subtitles },
    { id: 'effects', label: 'Color & Effects', icon: Sliders },
    { id: 'audio', label: 'Audio Levels', icon: Volume2 },
    { id: 'themes', label: 'Visual Theme', icon: Palette },
    { id: 'sources', label: 'Sources & Rights', icon: ShieldCheck },
  ] as const;

  return (
    <aside className="w-16 bg-app-panel border-r border-app-border flex flex-col items-center py-3 space-y-1.5 shrink-0 select-none z-20">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(isActive ? null : (t.id as EditorDrawerTab))}
            className={`w-12 h-12 rounded-editor flex flex-col items-center justify-center gap-1 transition-all group relative ${
              isActive
                ? 'bg-app-elevated text-accent border border-accent/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-app-hover'
            }`}
            title={t.label}
          >
            <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-[9px] font-medium tracking-tight text-center truncate w-full px-1">
              {t.label.split(' ')[0]}
            </span>

            {/* Active Indicator dot */}
            {isActive && (
              <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-accent rounded-r" />
            )}
          </button>
        );
      })}
    </aside>
  );
};
