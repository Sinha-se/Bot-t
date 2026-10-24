import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Film,
  Play,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Activity,
  Layers,
  Sparkles,
  Search,
  Sliders,
  FolderOpen,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';
import { CommandPalette } from '../components/common/CommandPalette';
import { THEMES } from '../data/themes';

export const DashboardPage: React.FC = () => {
  const { project, jobs, issues, switchProject, brandKits } = useProject();
  const [search, setSearch] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const navigate = useNavigate();

  const activeIssues = issues.filter((i) => !i.resolved);
  const blockerCount = activeIssues.filter((i) => i.level === 'blocker').length;
  const warningCount = activeIssues.filter((i) => i.level === 'warning').length;

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header onOpenShortcuts={() => setShowPalette(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-7xl mx-auto w-full">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Production Studio
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Active audio-first video projects and timeline builds
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="bg-app-panel border border-app-border focus:border-accent rounded-editor pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none w-48 sm:w-64"
                />
              </div>

              <Link
                to="/app/projects/new"
                className="px-4 py-2 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Video</span>
              </Link>
            </div>
          </div>

          {/* Section 1: Continue Editing Hero Card */}
          <section className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-text-muted tracking-wider">
              Continue Editing
            </h2>
            <div className="bg-gradient-to-r from-app-panel via-app-elevated to-app-panel border border-app-border rounded-dialog p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-32 h-20 rounded-editor bg-[#090D14] border border-app-border relative overflow-hidden shrink-0 group">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80"
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent uppercase">
                      {project.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">
                      {project.aspectRatio} • 30fps
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{project.title}</h3>
                  <p className="text-xs text-text-secondary line-clamp-1 max-w-xl">
                    {project.brief}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <Link
                  to={`/app/projects/${project.id}/review`}
                  className={`px-3 py-2 rounded-editor border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    blockerCount > 0
                      ? 'bg-status-error/10 border-status-error/30 text-status-error hover:bg-status-error/20'
                      : 'bg-app-elevated border-app-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {blockerCount > 0 ? `${blockerCount} Blocker` : 'Review Issues'}
                  </span>
                </Link>

                <Link
                  to={`/app/projects/${project.id}/editor`}
                  className="px-5 py-2 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  <span>Open Editor</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 2: Recent Projects Grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-text-muted tracking-wider">
                Recent Projects
              </h2>
              <span className="text-xs text-text-muted">1 Active Studio Project</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Before the City Wakes */}
              <div className="bg-app-panel border border-app-border rounded-dialog overflow-hidden group hover:border-accent/50 transition-all shadow-md flex flex-col">
                <div className="h-40 bg-[#090D14] relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80"
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/75 text-white uppercase backdrop-blur-sm">
                      {project.aspectRatio}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/80 text-white backdrop-blur-sm">
                      Ready to Edit
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                    01:30
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                      Calm, observational documentary explainer of an Indian city waking up. 12 scenes time-aligned with uploaded narration.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-app-border text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated today</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app/projects/${project.id}/transcript`}
                        className="text-text-secondary hover:text-text-primary"
                        title="Transcript"
                      >
                        Transcript
                      </Link>
                      <span className="text-app-border">•</span>
                      <Link
                        to={`/app/projects/${project.id}/editor`}
                        className="text-accent font-semibold hover:underline"
                      >
                        Editor →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Blank Creation Card */}
              <Link
                to="/app/projects/new"
                className="bg-app-panel/50 border border-dashed border-app-border hover:border-accent/60 rounded-dialog p-6 flex flex-col items-center justify-center text-center space-y-3 group transition-colors min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-app-elevated border border-app-border group-hover:border-accent flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-text-primary">New Video from Audio</h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-[200px]">
                    Upload an English narration file and generate a visual first cut.
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Section 3: Active Processing Jobs & Reusable Brand Kits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Jobs card */}
            <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-sm text-text-primary">Studio Processing Jobs</h3>
                </div>
                <Link to="/app/jobs" className="text-xs text-accent hover:underline">
                  View all logs →
                </Link>
              </div>

              <div className="space-y-2">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-2.5 rounded bg-app-elevated border border-app-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-text-primary capitalize">
                        {job.type.replace('_', ' ')}
                      </div>
                      <div className="text-[11px] text-text-muted truncate max-w-[260px]">
                        {job.currentStage}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-status-success">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{job.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Kits summary */}
            <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-track-narration" />
                  <h3 className="font-semibold text-sm text-text-primary">Saved Brand Kits</h3>
                </div>
                <Link to="/app/brand-kits" className="text-xs text-accent hover:underline">
                  Manage kits →
                </Link>
              </div>

              <div className="space-y-2">
                {brandKits.slice(0, 2).map((bk) => (
                  <div
                    key={bk.id}
                    className="p-2.5 rounded bg-app-elevated border border-app-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-text-primary">{bk.name}</div>
                      <div className="text-[11px] text-text-muted">
                        Fonts: {bk.fontHeading} • Transition: {bk.defaultTransition}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <span
                        style={{ backgroundColor: bk.primaryColor }}
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                      />
                      <span
                        style={{ backgroundColor: bk.secondaryColor }}
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                      />
                      <span
                        style={{ backgroundColor: bk.accentColor }}
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} />
    </div>
  );
};
