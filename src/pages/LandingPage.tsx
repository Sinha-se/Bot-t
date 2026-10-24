import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Mic,
  Sliders,
  ShieldCheck,
  Subtitles,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Play,
  FileText,
  Clock,
  Compass,
} from 'lucide-react';
import { DemoBanner } from '../components/common/DemoBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col selection:bg-accent/30 selection:text-white">
      <DemoBanner />

      {/* Navigation Header */}
      <header className="h-16 border-b border-app-border/80 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#6366F1] flex items-center justify-center shadow-lg shadow-accent/20">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Framecraft</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <a href="#workflow" className="hover:text-text-primary transition-colors">
            Workflow
          </a>
          <a href="#capabilities" className="hover:text-text-primary transition-colors">
            Capabilities
          </a>
          <Link to="/app/templates" className="hover:text-text-primary transition-colors">
            Templates
          </Link>
          <Link to="/demo" className="hover:text-accent font-medium transition-colors">
            Try Interactive Demo
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/sign-in"
            className="text-xs text-text-secondary hover:text-text-primary px-3 py-2 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/app/projects/new"
            className="px-4 py-2 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md shadow-accent/20 transition-all hover:scale-[1.02]"
          >
            Start a Project
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audio-First AI Video Production Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-tight max-w-4xl mx-auto">
            Your narration.{' '}
            <span className="bg-gradient-to-r from-accent via-[#B7AEFF] to-[#38BDF8] bg-clip-text text-transparent">
              A complete first cut.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Upload your audio, describe the video, and let an AI editing agent assemble relevant footage, captions, titles, and motion graphics into a timeline you control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/app/projects/new"
              className="w-full sm:w-auto px-6 py-3 rounded-editor bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Create a Video</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/demo"
              className="w-full sm:w-auto px-6 py-3 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-text-primary text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-accent" />
              <span>Explore the Demo (“Before the City Wakes”)</span>
            </Link>
          </div>
        </section>

        {/* Product Studio Mockup / Interactive Preview */}
        <section className="px-6 max-w-6xl mx-auto pb-24">
          <div className="rounded-dialog border border-app-border bg-app-panel shadow-2xl overflow-hidden p-2">
            <div className="h-9 bg-app-elevated/80 border-b border-app-border px-4 flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success/80" />
                <span className="ml-2 font-mono text-[11px] text-text-secondary">
                  framecraft_studio // Before the City Wakes (16:9 • 30fps)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-status-success">100% Locked Narration</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-2 bg-[#090B0F]">
              {/* Left scene list */}
              <div className="col-span-3 bg-app-panel rounded border border-app-border p-3 space-y-2 hidden lg:block">
                <div className="text-[11px] font-mono text-text-muted uppercase">Scene Deck (12)</div>
                <div className="p-2 rounded bg-app-elevated border border-accent/40 text-[11px] space-y-1">
                  <div className="font-semibold text-text-primary">01. Dawn City Horizon</div>
                  <div className="text-[10px] text-text-muted">“Before sunrise, the city...”</div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-track-footage/20 text-blue-300">Pexels Free</span>
                </div>
                <div className="p-2 rounded bg-app-elevated border border-app-border text-[11px] space-y-1">
                  <div className="font-semibold text-text-primary">02. Platform Edge</div>
                  <div className="text-[10px] text-text-muted">“A railway platform fills...”</div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-track-images/20 text-indigo-300">Unsplash Stock</span>
                </div>
              </div>

              {/* Center Canvas Preview */}
              <div className="col-span-12 lg:col-span-9 bg-[#040608] rounded border border-app-border flex flex-col justify-between overflow-hidden relative min-h-[360px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
                    alt="City Dawn Preview"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  <div className="absolute text-center space-y-2 px-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-black/60 px-2 py-0.5 rounded border border-accent/30">
                      Minimal Documentary Theme
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                      BEFORE THE CITY WAKES
                    </h2>
                    <p className="text-xs text-amber-200 bg-black/75 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-amber-300/20">
                      Before sunrise, the city is already preparing to move.
                    </p>
                  </div>
                </div>

                {/* Bottom timeline preview bars */}
                <div className="relative z-10 p-3 bg-app-panel/90 backdrop-blur-md border-t border-app-border flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span className="text-track-narration font-semibold">Track 4: Uploaded Narration (00:00 - 01:29)</span>
                    <span className="text-accent">Playhead: 00:00:04:15</span>
                  </div>
                  {/* Waveform dummy bar */}
                  <div className="h-6 bg-track-narration/20 border border-track-narration/40 rounded flex items-center px-2 gap-1 overflow-hidden">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div
                        key={i}
                        style={{ height: `${Math.sin(i * 0.3) * 60 + 35}%` }}
                        className="w-1.5 bg-track-narration/80 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-20 border-t border-app-border bg-app-panel/40 px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase text-accent tracking-wider font-semibold">
                How It Works
              </span>
              <h2 className="text-3xl font-bold text-text-primary">
                Four Steps From Raw Audio to Polished Video
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Upload Narration',
                  desc: 'Your recorded voice controls timing and ideas. Spoken sentences are never hallucinated or replaced.',
                  icon: Mic,
                },
                {
                  step: '02',
                  title: 'Review Transcript & Plan',
                  desc: 'Approve scene boundaries, search queries, factual constraints, and graphic callouts before assembly.',
                  icon: FileText,
                },
                {
                  step: '03',
                  title: 'Refine the Timeline',
                  desc: 'Every clip, lower third, caption, transition, and audio level is directly editable in a real multitrack studio.',
                  icon: Sliders,
                },
                {
                  step: '04',
                  title: 'Export Confidently',
                  desc: 'Preflight checks block uncleared media. Download real 1080p video, SRT/VTT subtitles, and attribution reports.',
                  icon: ShieldCheck,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-dialog bg-app-panel border border-app-border space-y-3 relative group hover:border-accent/50 transition-colors"
                  >
                    <span className="text-2xl font-black font-mono text-accent/40 group-hover:text-accent transition-colors">
                      {item.step}
                    </span>
                    <h3 className="font-semibold text-base text-text-primary">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className="py-20 border-t border-app-border px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase text-accent tracking-wider font-semibold">
                Purpose-Built
              </span>
              <h2 className="text-3xl font-bold text-text-primary">
                Professional Editing Boundaries
              </h2>
              <p className="text-sm text-text-secondary max-w-xl mx-auto">
                Built for documentary creators, investigative explainers, and educational teams who need precision, not toy generators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-dialog bg-app-panel border border-app-border space-y-3">
                <CheckCircle2 className="w-5 h-5 text-track-narration" />
                <h3 className="font-semibold text-sm text-text-primary">Audio-First Authority</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your audio master anchors the project. Narration is locked by default so visual edits never accidentally drift out of sync.
                </p>
              </div>

              <div className="p-5 rounded-dialog bg-app-panel border border-app-border space-y-3">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-sm text-text-primary">Truthful Rights Gates</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Discovery does not equal permission. Uncleared web scrapings remain labeled as research references and cannot be exported as commercial video.
                </p>
              </div>

              <div className="p-5 rounded-dialog bg-app-panel border border-app-border space-y-3">
                <CheckCircle2 className="w-5 h-5 text-track-titles" />
                <h3 className="font-semibold text-sm text-text-primary">Broadcast Typography</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Editable lower thirds, quote cards, chapter headings, and dynamic caption highlighting stay synchronized with the timeline.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-app-border py-8 px-6 bg-app-panel text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <Film className="w-4 h-4 text-accent" />
            <span className="font-semibold">Framecraft Studio</span>
            <span>— The Audio-First Video Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/demo" className="hover:text-text-primary transition-colors">
              Interactive Demo
            </Link>
            <Link to="/app/settings" className="hover:text-text-primary transition-colors">
              Capability Matrix
            </Link>
            <span className="text-text-muted">Patna, Bihar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
