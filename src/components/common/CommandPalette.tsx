import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Film,
  Play,
  Scissors,
  Download,
  AlertTriangle,
  FolderOpen,
  Palette,
  Settings,
  X,
  Keyboard,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'commands' | 'shortcuts'>('commands');
  const navigate = useNavigate();
  const {
    project,
    isPlaying,
    setIsPlaying,
    splitItemAtPlayhead,
    undo,
    redo,
    setTimelineZoom,
  } = useProject();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      label: isPlaying ? 'Pause Video Playback' : 'Play Video Timeline',
      icon: Play,
      shortcut: 'Space',
      action: () => {
        setIsPlaying(!isPlaying);
        onClose();
      },
    },
    {
      label: 'Split Clip at Playhead',
      icon: Scissors,
      shortcut: 'S',
      action: () => {
        splitItemAtPlayhead();
        onClose();
      },
    },
    {
      label: 'Undo Timeline Edit',
      icon: Film,
      shortcut: 'Ctrl+Z',
      action: () => {
        undo();
        onClose();
      },
    },
    {
      label: 'Redo Timeline Edit',
      icon: Film,
      shortcut: 'Ctrl+Shift+Z',
      action: () => {
        redo();
        onClose();
      },
    },
    {
      label: 'Zoom In Timeline',
      icon: Search,
      shortcut: '+',
      action: () => {
        setTimelineZoom((z) => Math.min(12, z + 2));
        onClose();
      },
    },
    {
      label: 'Zoom Out Timeline',
      icon: Search,
      shortcut: '-',
      action: () => {
        setTimelineZoom((z) => Math.max(1, z - 2));
        onClose();
      },
    },
    {
      label: 'Go to Preflight Quality & Source Review',
      icon: AlertTriangle,
      shortcut: 'G R',
      action: () => {
        navigate(`/app/projects/${project.id}/review`);
        onClose();
      },
    },
    {
      label: 'Go to Export Setup Screen',
      icon: Download,
      shortcut: 'G E',
      action: () => {
        navigate(`/app/projects/${project.id}/export`);
        onClose();
      },
    },
    {
      label: 'Go to Transcript Review',
      icon: Film,
      shortcut: 'G T',
      action: () => {
        navigate(`/app/projects/${project.id}/transcript`);
        onClose();
      },
    },
    {
      label: 'Go to Storyboard & Visual Plan',
      icon: Palette,
      shortcut: 'G S',
      action: () => {
        navigate(`/app/projects/${project.id}/storyboard`);
        onClose();
      },
    },
    {
      label: 'Open Media Library',
      icon: FolderOpen,
      shortcut: 'G M',
      action: () => {
        navigate('/app/media');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const shortcutList = [
    { key: 'Space', desc: 'Play / Pause timeline playback' },
    { key: '← / →', desc: 'Step 1 frame backward / forward' },
    { key: 'Shift + ← / →', desc: 'Step 1 second (30 frames) backward / forward' },
    { key: 'S', desc: 'Split selected clip at current playhead position' },
    { key: 'Backspace / Delete', desc: 'Delete selected timeline item (narration protected)' },
    { key: 'Ctrl/Cmd + Z', desc: 'Undo last timeline edit' },
    { key: 'Ctrl/Cmd + Shift + Z', desc: 'Redo undone timeline edit' },
    { key: 'Ctrl/Cmd + S', desc: 'Force manual save state' },
    { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette & shortcuts reference' },
    { key: '+ / -', desc: 'Zoom in / zoom out timeline ruler' },
    { key: 'Esc', desc: 'Close dialogs, tool drawers, or active selections' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-app-panel border border-app-border rounded-dialog max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Tabs */}
        <div className="p-3 bg-app-elevated/70 border-b border-app-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('commands')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                tab === 'commands'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Command Menu
            </button>
            <button
              onClick={() => setTab('shortcuts')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                tab === 'shortcuts'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Keyboard Shortcuts
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {tab === 'commands' ? (
          <div>
            <div className="p-3 border-b border-app-border flex items-center gap-3">
              <Search className="w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or jump to screen..."
                autoFocus
                className="bg-transparent text-sm text-text-primary placeholder:text-text-muted w-full focus:outline-none"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={idx}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-editor text-xs text-text-secondary hover:text-text-primary hover:bg-app-hover text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                        <span>{cmd.label}</span>
                      </div>
                      <kbd className="px-2 py-0.5 rounded bg-app-elevated text-text-muted font-mono text-[10px] border border-app-border">
                        {cmd.shortcut}
                      </kbd>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-text-muted">
                  No commands match “{query}”
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-app-border">
            {shortcutList.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-text-secondary">{item.desc}</span>
                <kbd className="px-2 py-1 rounded bg-app-elevated text-text-primary font-mono text-[11px] border border-app-border shrink-0 ml-4">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
