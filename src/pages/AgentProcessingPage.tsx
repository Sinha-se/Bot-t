import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Film,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';

export const AgentProcessingPage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, setProject } = useProject();

  const stages = [
    { id: 1, name: 'Validate Audio Master', desc: '48kHz stereo WAV checked for clipping and duration' },
    { id: 2, name: 'Transcribe Spoken Narration', desc: 'Whisper English model extraction' },
    { id: 3, name: 'Time-Align Word Tokens', desc: 'Integer millisecond speech boundaries' },
    { id: 4, name: 'Segment Conceptual Scenes', desc: '12 distinct visual narrative units' },
    { id: 5, name: 'Synthesize Visual Direction', desc: 'Pacing mapped to Minimal Documentary style' },
    { id: 6, name: 'Query Permitted Media Providers', desc: 'Pexels and Unsplash rights-compliant queries' },
    { id: 7, name: 'Rights & Provenance Verification', desc: 'Commercial eligibility and license evaluation' },
    { id: 8, name: 'Acquire High-Resolution Media', desc: 'Downloading image and video assets' },
    { id: 9, name: 'Generate Motion Graphics & Titles', desc: 'Rendering opening cards and lower thirds' },
    { id: 10, name: 'Assemble Multitrack Timeline', desc: 'Aligning 7 tracks with locked audio authority' },
    { id: 11, name: 'Run Preflight Integrity Checks', desc: 'Scanning for black frames and rights flags' },
    { id: 12, name: 'Prepare Studio Preview', desc: 'Caching composite canvas layers' },
  ];

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsDone(true);
          setProject((p) => ({ ...p, status: 'ready_to_edit' }));
          return prev;
        }
      });
    }, 450); // fast dynamic progression

    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.round(((currentStageIdx + (isDone ? 1 : 0)) / stages.length) * 100);

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8 flex flex-col justify-center">
        {/* Agent Activity Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary">
            {isDone ? 'Your First Cut is Ready to Edit' : 'Building Your First Cut'}
          </h1>
          <p className="text-xs text-text-secondary max-w-lg mx-auto">
            {isDone
              ? 'Narration aligned, 12 scenes populated with rights-cleared media, and broadcast graphics placed on timeline.'
              : 'The agent is orchestrating transcription, scene planning, media rights gating, and timeline assembly.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">
              Stage {currentStageIdx + 1} of {stages.length}: {stages[currentStageIdx].name}
            </span>
            <span className="font-mono text-accent font-bold">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-app-elevated rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-accent to-[#38BDF8] transition-all duration-300"
            />
          </div>

          <p className="text-[11px] text-text-muted">
            {stages[currentStageIdx].desc}
          </p>
        </div>

        {/* Transparent Activity Stream */}
        <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-text-muted tracking-wider">
            Operational Log
          </h3>

          <div className="max-h-56 overflow-y-auto space-y-2 text-xs">
            {stages.slice(0, currentStageIdx + 1).map((s, idx) => {
              const isCurrent = idx === currentStageIdx && !isDone;
              return (
                <div
                  key={s.id}
                  className={`flex items-start gap-3 p-2 rounded transition-colors ${
                    isCurrent
                      ? 'bg-accent/15 border border-accent/30 text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-text-primary block">{s.name}</span>
                    <span className="text-[11px] text-text-muted">{s.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => navigate('/app')}
            className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-secondary"
          >
            Cancel Job
          </button>

          <button
            onClick={() => navigate(`/app/projects/${project.id}/editor`)}
            disabled={!isDone}
            className="px-6 py-3 rounded-editor bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Film className="w-4 h-4" />
            <span>Open Multitrack Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
