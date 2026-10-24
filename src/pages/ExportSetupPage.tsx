import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  FileText,
  Subtitles,
  Layers,
  Settings2,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { ExportSettings } from '../types';

export const ExportSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { project, issues, timelineItems, assets, rights } = useProject();

  const [fileName, setFileName] = useState(`${project.title.replace(/\s+/g, '_')}_Final`);
  const [container, setContainer] = useState<'mp4' | 'webm'>('mp4');
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [frameRate, setFrameRate] = useState<30 | 24 | 60>(30);
  const [qualityBitrate, setQualityBitrate] = useState<'high' | 'standard'>('high');
  const [captionMode, setCaptionMode] = useState<'burn_in' | 'sidecar' | 'both' | 'none'>('burn_in');

  const [includeSrt, setIncludeSrt] = useState(true);
  const [includeAttribution, setIncludeAttribution] = useState(true);
  const [includeProjectJson, setIncludeProjectJson] = useState(true);

  const activeIssues = issues.filter((i) => !i.resolved);
  const blockerCount = activeIssues.filter((i) => i.level === 'blocker').length;
  const warningCount = activeIssues.filter((i) => i.level === 'warning').length;

  const handleStartExport = () => {
    if (blockerCount > 0) return;
    const exportId = `exp_${Date.now()}`;
    navigate(`/app/projects/${project.id}/exports/${exportId}`, {
      state: {
        settings: {
          fileName,
          container,
          videoCodec: container === 'mp4' ? 'h264' : 'vp9',
          resolution,
          width: resolution === '4k' ? 3840 : resolution === '720p' ? 1280 : 1920,
          height: resolution === '4k' ? 2160 : resolution === '720p' ? 720 : 1080,
          frameRate,
          qualityBitrate,
          audioCodec: 'aac',
          audioSampleRate: 48000,
          captionMode,
          exportRange: 'entire_timeline',
        } as ExportSettings,
      },
    });
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      {/* Subheader */}
      <div className="h-10 bg-app-panel border-b border-app-border px-6 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2">
          <Link to={`/app/projects/${project.id}/editor`} className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Editor</span>
          </Link>
          <span className="text-app-border">/</span>
          <span className="text-text-primary font-medium">{project.title}</span>
          <span className="text-app-border">/</span>
          <span className="text-accent font-semibold">Export Setup & Preflight</span>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start overflow-y-auto">
        {/* Left Column: Preview & Project Details (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-app-panel border border-app-border rounded-dialog overflow-hidden shadow-xl">
            <div className="h-48 bg-[#07090E] relative flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
                alt={project.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-3 py-1 rounded-full bg-black/75 border border-white/20 text-xs font-mono text-white">
                  01:29.8 • 1080p
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <h3 className="font-bold text-sm text-text-primary">{project.title}</h3>
              <p className="text-text-muted text-[11px] leading-relaxed line-clamp-2">
                {project.brief}
              </p>

              <div className="pt-2 border-t border-app-border flex justify-between text-text-muted text-[11px] font-mono">
                <span>Timeline Revision: {project.timelineRevisionId}</span>
                <span>30.00 fps</span>
              </div>
            </div>
          </div>

          {/* Preflight Checklist Card */}
          <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase text-text-muted tracking-wider">
              Preflight Check
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Audio Master Sync:</span>
                <span className="text-status-success font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Timeline Gaps / Overlaps:</span>
                <span className="text-status-success font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 0 Gaps
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Media Rights Clearance:</span>
                {blockerCount > 0 ? (
                  <span className="text-status-error font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {blockerCount} Blocker
                  </span>
                ) : (
                  <span className="text-status-success font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> All Cleared
                  </span>
                )}
              </div>
            </div>

            {blockerCount > 0 && (
              <div className="p-2.5 rounded bg-status-error/10 border border-status-error/30 text-[11px] text-status-error space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Export Blocked: Uncleared Media</span>
                </div>
                <p>
                  Scene 8 contains an unverified news reference. Go to Quality Review to replace it with cleared commercial stock.
                </p>
                <Link
                  to={`/app/projects/${project.id}/review`}
                  className="font-bold underline block mt-1"
                >
                  Resolve in Review Workspace →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Export Settings & Artifacts (7 cols) */}
        <div className="md:col-span-7 bg-app-panel border border-app-border rounded-dialog p-6 space-y-6 shadow-xl">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-accent" />
              <span>Export Specifications</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure video container, resolution, captions, and companion package files.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-text-muted block mb-1">Output File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-muted block mb-1">Container</label>
                <select
                  value={container}
                  onChange={(e) => setContainer(e.target.value as any)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none"
                >
                  <option value="mp4">MP4 (H.264 / AAC)</option>
                  <option value="webm">WebM (VP9 / Opus)</option>
                </select>
              </div>

              <div>
                <label className="text-text-muted block mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none"
                >
                  <option value="1080p">1080p Full HD (1920x1080)</option>
                  <option value="720p">720p HD (1280x720)</option>
                  <option value="4k">4K Ultra HD (3840x2160)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-muted block mb-1">Frame Rate</label>
                <select
                  value={frameRate}
                  onChange={(e) => setFrameRate(parseInt(e.target.value) as any)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none font-mono"
                >
                  <option value={30}>30 fps (Standard)</option>
                  <option value={24}>24 fps (Cinematic)</option>
                  <option value={60}>60 fps (High Smoothness)</option>
                </select>
              </div>

              <div>
                <label className="text-text-muted block mb-1">Caption Delivery Mode</label>
                <select
                  value={captionMode}
                  onChange={(e) => setCaptionMode(e.target.value as any)}
                  className="w-full bg-app-elevated border border-app-border focus:border-accent rounded p-2 text-text-primary focus:outline-none"
                >
                  <option value="burn_in">Burn-in on Video Track</option>
                  <option value="sidecar">Sidecar Subtitles (.SRT)</option>
                  <option value="both">Both Burn-in & Sidecar</option>
                  <option value="none">No Captions</option>
                </select>
              </div>
            </div>

            {/* Supporting companion artifacts */}
            <div className="pt-2 border-t border-app-border space-y-2">
              <span className="text-[11px] font-mono uppercase text-text-muted tracking-wider block">
                Companion Package Files
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSrt}
                    onChange={(e) => setIncludeSrt(e.target.checked)}
                    className="accent-accent w-4 h-4"
                  />
                  <span>Time-aligned Subtitle Files (.SRT & .VTT)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAttribution}
                    onChange={(e) => setIncludeAttribution(e.target.checked)}
                    className="accent-accent w-4 h-4"
                  />
                  <span>Legal Source Attribution Report (.MD & .CSV)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeProjectJson}
                    onChange={(e) => setIncludeProjectJson(e.target.checked)}
                    className="accent-accent w-4 h-4"
                  />
                  <span>Editable Framecraft Project Archive (.JSON)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-app-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-text-muted">
              Est. Render Size: ~24.5 MB
            </span>

            <button
              onClick={handleStartExport}
              disabled={blockerCount > 0}
              className="px-6 py-3 rounded-editor bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Start Real Video Render</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
