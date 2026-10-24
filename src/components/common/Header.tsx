import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Undo2,
  Redo2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Command,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface HeaderProps {
  inEditor?: boolean;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ inEditor = false, onOpenShortcuts }) => {
  const {
    project,
    setProject,
    saveStatus,
    undo,
    redo,
    canUndo,
    canRedo,
    issues,
  } = useProject();

  const navigate = useNavigate();
  const location = useLocation();

  const activeIssues = issues.filter((i) => !i.resolved);
  const blockerCount = activeIssues.filter((i) => i.level === 'blocker').length;
  const warningCount = activeIssues.filter((i) => i.level === 'warning').length;

  return (
    <header className="h-14 bg-app-panel border-b border-app-border flex items-center justify-between px-4 select-none shrink-0 z-30">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-4">
        <Link to="/app" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#6366F1] flex items-center justify-center shadow-lg shadow-accent/20">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-text-primary group-hover:text-accent transition-colors">
            Framecraft
          </span>
        </Link>

        {inEditor && (
          <>
            <div className="h-4 w-px bg-app-border" />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
                className="bg-transparent hover:bg-app-elevated focus:bg-app-elevated border border-transparent hover:border-app-border focus:border-accent rounded px-2 py-1 text-sm font-medium text-text-primary focus:outline-none transition-colors max-w-[240px] truncate"
                title="Click to rename project"
              />
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-app-elevated text-text-muted border border-app-border font-mono">
                {project.aspectRatio}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center: Save state & Undo/Redo (in editor) */}
      {inEditor ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-status-success/90">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-accent animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-text-muted">Unsaved edits</span>
            )}
          </div>

          <div className="h-4 w-px bg-app-border" />

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-app-hover disabled:opacity-30 disabled:pointer-events-none text-text-secondary hover:text-text-primary transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-app-hover disabled:opacity-30 disabled:pointer-events-none text-text-secondary hover:text-text-primary transition-colors"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <nav className="hidden md:flex items-center gap-1 text-sm text-text-secondary">
          <Link
            to="/app/projects"
            className={`px-3 py-1.5 rounded hover:text-text-primary transition-colors ${
              location.pathname.startsWith('/app/projects') ? 'text-accent font-medium bg-app-elevated' : ''
            }`}
          >
            Projects
          </Link>
          <Link
            to="/app/media"
            className={`px-3 py-1.5 rounded hover:text-text-primary transition-colors ${
              location.pathname === '/app/media' ? 'text-accent font-medium bg-app-elevated' : ''
            }`}
          >
            Media Library
          </Link>
          <Link
            to="/app/templates"
            className={`px-3 py-1.5 rounded hover:text-text-primary transition-colors ${
              location.pathname === '/app/templates' ? 'text-accent font-medium bg-app-elevated' : ''
            }`}
          >
            Templates
          </Link>
          <Link
            to="/app/brand-kits"
            className={`px-3 py-1.5 rounded hover:text-text-primary transition-colors ${
              location.pathname === '/app/brand-kits' ? 'text-accent font-medium bg-app-elevated' : ''
            }`}
          >
            Brand Kits
          </Link>
        </nav>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {inEditor && (
          <>
            <Link
              to={`/app/projects/${project.id}/review`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border transition-colors ${
                blockerCount > 0
                  ? 'bg-status-error/10 border-status-error/30 text-status-error hover:bg-status-error/20'
                  : warningCount > 0
                  ? 'bg-status-warning/10 border-status-warning/30 text-status-warning hover:bg-status-warning/20'
                  : 'bg-app-elevated border-app-border text-text-secondary hover:text-text-primary'
              }`}
              title="Preflight Quality & Source Review"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {blockerCount > 0
                  ? `${blockerCount} Blocker${blockerCount > 1 ? 's' : ''}`
                  : warningCount > 0
                  ? `${warningCount} Warning${warningCount > 1 ? 's' : ''}`
                  : 'All Cleared'}
              </span>
            </Link>

            <Link
              to={`/app/projects/${project.id}/export`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-accent hover:bg-accent-hover text-white text-xs font-medium shadow-md shadow-accent/20 transition-all hover:scale-[1.02]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Video</span>
            </Link>
          </>
        )}

        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-app-hover transition-colors"
            title="Keyboard Shortcuts (Ctrl+K)"
          >
            <Command className="w-4 h-4" />
          </button>
        )}

        <div className="h-4 w-px bg-app-border" />

        <div className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent/80 to-track-narration flex items-center justify-center text-xs font-semibold text-white">
            FC
          </div>
        </div>
      </div>
    </header>
  );
};
