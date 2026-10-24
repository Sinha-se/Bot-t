import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Play,
  Pause,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Mic,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { formatTimecodeSRT } from '../services/exportPackager';

export const TranscriptReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    project,
    transcripts,
    updateTranscriptSegment,
    currentTimeMs,
    setCurrentTimeMs,
    isPlaying,
    setIsPlaying,
  } = useProject();

  const [search, setSearch] = useState('');
  const [selectedSegId, setSelectedSegId] = useState<string>(transcripts[0]?.id || '');

  const filteredSegments = transcripts.filter((seg) =>
    seg.text.toLowerCase().includes(search.toLowerCase())
  );

  const activeSegment = transcripts.find((s) => s.id === selectedSegId) || transcripts[0];

  const isSegmentSpeaking = (startMs: number, endMs: number) => {
    return currentTimeMs >= startMs && currentTimeMs <= endMs;
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      {/* Breadcrumb sub-header */}
      <div className="h-10 bg-app-panel border-b border-app-border px-6 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2">
          <Link to="/app" className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>
          <span className="text-app-border">/</span>
          <span className="text-text-primary font-medium">{project.title}</span>
          <span className="text-app-border">/</span>
          <span className="text-accent font-semibold">Transcript Review</span>
        </div>

        <button
          onClick={() => navigate(`/app/projects/${project.id}/storyboard`)}
          className="px-3 py-1 rounded bg-accent hover:bg-accent-hover text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Approve & Create Visual Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Chapters / Segments Outline (240px) */}
        <aside className="w-64 bg-app-panel border-r border-app-border flex flex-col shrink-0 select-none">
          <div className="p-3 border-b border-app-border">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spoken words..."
                className="w-full bg-app-elevated border border-app-border focus:border-accent rounded pl-8 pr-2.5 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSegments.map((seg, idx) => {
              const speaking = isSegmentSpeaking(seg.startMs, seg.endMs);
              const isSelected = seg.id === selectedSegId;
              return (
                <button
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegId(seg.id);
                    setCurrentTimeMs(seg.startMs);
                  }}
                  className={`w-full text-left p-2.5 rounded-editor text-xs transition-colors flex items-start gap-2.5 ${
                    speaking
                      ? 'bg-track-narration/20 border border-track-narration/50 text-teal-200 font-medium'
                      : isSelected
                      ? 'bg-app-elevated border border-accent/40 text-text-primary font-medium'
                      : 'text-text-secondary hover:bg-app-hover hover:text-text-primary'
                  }`}
                >
                  <span className="font-mono text-[10px] text-text-muted mt-0.5">
                    #{(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 truncate">
                    <p className="truncate">{seg.text}</p>
                    <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                      {(seg.startMs / 1000).toFixed(1)}s - {(seg.endMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  {seg.reviewed && <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Column: Timestamped Transcript Editor */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0A0D13]">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span>Timestamped Spoken Narration</span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Click any line to seek master audio. Editing text updates captions and search queries without cutting audio.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-mono">12 Segments • 98.2% Confidence</span>
            </div>
          </div>

          <div className="space-y-3">
            {transcripts.map((seg, idx) => {
              const speaking = isSegmentSpeaking(seg.startMs, seg.endMs);
              return (
                <div
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegId(seg.id);
                    setCurrentTimeMs(seg.startMs);
                  }}
                  className={`p-4 rounded-dialog border transition-all ${
                    speaking
                      ? 'bg-app-panel border-track-narration shadow-lg ring-1 ring-track-narration/50'
                      : seg.id === selectedSegId
                      ? 'bg-app-panel border-accent shadow-md'
                      : 'bg-app-panel/60 border-app-border hover:border-app-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTimeMs(seg.startMs);
                          setIsPlaying(true);
                        }}
                        className="w-6 h-6 rounded-full bg-app-elevated hover:bg-accent hover:text-white border border-app-border flex items-center justify-center text-text-secondary transition-colors"
                        title="Seek & Play"
                      >
                        <Play className="w-3 h-3 ml-0.5" />
                      </button>
                      <span className="font-mono text-xs text-text-primary font-semibold">
                        {(seg.startMs / 1000).toFixed(1)}s → {(seg.endMs / 1000).toFixed(1)}s
                      </span>
                      <span className="text-[11px] text-text-muted">({seg.speakerId})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTranscriptSegment(seg.id, { reviewed: !seg.reviewed });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-colors ${
                          seg.reviewed
                            ? 'bg-status-success/20 border-status-success text-status-success'
                            : 'bg-app-elevated border-app-border text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{seg.reviewed ? 'Reviewed' : 'Mark Reviewed'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTranscriptSegment(seg.id, { locked: !seg.locked });
                        }}
                        className={`p-1 rounded text-text-muted hover:text-text-primary ${
                          seg.locked ? 'text-accent' : ''
                        }`}
                        title={seg.locked ? 'Unlock Segment' : 'Lock Segment'}
                      >
                        {seg.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Editable segment text */}
                  <textarea
                    rows={2}
                    value={seg.text}
                    onChange={(e) => updateTranscriptSegment(seg.id, { text: e.target.value })}
                    className="w-full bg-app-elevated/80 border border-app-border focus:border-accent rounded p-2.5 text-xs text-text-primary focus:outline-none resize-none leading-relaxed"
                  />

                  {/* Word-level tokens with timestamps */}
                  {seg.words && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-app-border/50">
                      {seg.words.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentTimeMs(w.startMs);
                          }}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-app-elevated hover:bg-accent/30 text-text-muted hover:text-text-primary border border-app-border/40 cursor-pointer transition-colors"
                          title={`${(w.startMs / 1000).toFixed(2)}s - ${(w.endMs / 1000).toFixed(2)}s`}
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* Right Column: Audio Diagnostics & Proper Names */}
        <aside className="w-80 bg-app-panel border-l border-app-border p-4 space-y-5 shrink-0 select-none overflow-y-auto">
          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-1">
              Alignment Diagnostics
            </h3>
            <p className="text-[11px] text-text-muted">
              Integrity checks on uploaded audio and word timing accuracy.
            </p>
          </div>

          <div className="p-3 bg-app-elevated border border-app-border rounded-editor space-y-2 text-xs">
            <div className="flex items-center gap-2 text-status-success font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Waveform Aligned</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              No audio clipping or major dropouts detected in the master recording. Spoken pace is 132 words/minute (Ideal for documentary explainer).
            </p>
          </div>

          {/* Proper names review note */}
          <div className="p-3 bg-app-elevated border border-status-warning/40 rounded-editor space-y-2 text-xs">
            <div className="flex items-center gap-2 text-status-warning font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Proper Noun Check</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Segment 4 contains compound phrase “Shopkeepers lift their shutters”. Ensure pronunciation corresponds to municipal visual plan.
            </p>
          </div>

          {/* Audio Player mini widget */}
          <div className="p-3 bg-app-panel border border-app-border rounded-editor space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-track-narration font-semibold">Audio Master</span>
              <span className="text-text-muted">{(currentTimeMs / 1000).toFixed(1)}s / 89.8s</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <div className="h-1.5 flex-1 bg-app-elevated rounded-full overflow-hidden">
                <div
                  style={{ width: `${(currentTimeMs / 89800) * 100}%` }}
                  className="h-full bg-track-narration"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
