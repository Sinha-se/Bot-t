import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Mic,
  Palette,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { THEMES } from '../data/themes';
import { analyzeAudioFile, DecodedAudioInfo } from '../services/audioSynthesizer';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { VideoType, AspectRatio, Pacing } from '../types';

export const NewProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { setProject, addJob } = useProject();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Brief
  const [title, setTitle] = useState('Urban Rhythm: Morning Inflow');
  const [prompt, setPrompt] = useState(
    'Create a calm, cinematic documentary explainer about how transit networks and markets activate at dawn. Use restrained typography and authentic atmosphere.'
  );
  const [videoType, setVideoType] = useState<VideoType>('documentary');
  const [audience, setAudience] = useState('Documentary & civic essay audience');
  const [tone, setTone] = useState('Quiet, observational, reflective');
  const [pacing, setPacing] = useState<Pacing>('calm');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Step 2: Audio
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioInfo, setAudioInfo] = useState<DecodedAudioInfo>({
    durationSeconds: 89.8,
    sampleRate: 48000,
    numberOfChannels: 2,
    waveformPeaks: Array.from({ length: 60 }, (_, i) => Math.abs(Math.sin(i * 0.25)) * 0.8 + 0.15),
  });
  const [isDecoding, setIsDecoding] = useState(false);
  const [transcriptionEngine, setTranscriptionEngine] = useState('whisper_local_lightweight');

  // Step 3: Style
  const [selectedThemeId, setSelectedThemeId] = useState('theme_minimal_doc');

  // Step 4: Source Policy
  const [policyPreset, setPolicyPreset] = useState<'strict_commercial' | 'licensed_and_pd' | 'research_and_review'>('strict_commercial');
  const [allowIllustrative, setAllowIllustrative] = useState(true);
  const [requireSourceLabels, setRequireSourceLabels] = useState(true);
  const [sensitiveReview, setSensitiveReview] = useState(true);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setIsDecoding(true);
      try {
        const decoded = await analyzeAudioFile(file);
        setAudioInfo(decoded);
      } catch (err) {
        console.warn('Could not decode audio with Web Audio API, using fallback estimation', err);
      } finally {
        setIsDecoding(false);
      }
    }
  };

  const handleFinishAndStart = () => {
    const newProjectId = `proj_${Date.now()}`;
    setProject((prev) => ({
      ...prev,
      id: newProjectId,
      title,
      brief: prompt,
      videoType,
      audience,
      tone,
      visualPacing: pacing,
      aspectRatio,
      themeId: selectedThemeId,
      status: 'transcribing',
    }));

    // Register job
    addJob({
      id: `job_${Date.now()}`,
      projectId: newProjectId,
      type: 'transcription',
      status: 'running',
      currentStage: 'Ingesting and aligning uploaded audio master',
      attempts: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    navigate(`/app/projects/${newProjectId}/generation`);
  };

  const selectedTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
        {/* Stepper Navigation */}
        <div className="flex items-center justify-between border-b border-app-border pb-4 select-none">
          {[
            { num: 1, label: 'Creative Brief', icon: FileText },
            { num: 2, label: 'Narration Audio', icon: Mic },
            { num: 3, label: 'Visual Style', icon: Palette },
            { num: 4, label: 'Source Policy', icon: ShieldCheck },
            { num: 5, label: 'Review & Start', icon: CheckCircle2 },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-accent'
                    : isCompleted
                    ? 'text-status-success'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono border ${
                    isActive
                      ? 'bg-accent/20 border-accent text-accent'
                      : isCompleted
                      ? 'bg-status-success/20 border-status-success text-status-success'
                      : 'border-app-border bg-app-elevated text-text-muted'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Creative Brief */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-text-primary">1. Describe Your Video</h2>
              <p className="text-xs text-text-secondary mt-1">
                Set creative parameters for how the AI planning agent interprets your narration.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-text-muted block mb-1 font-medium">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-text-muted block mb-1 font-medium">
                  Creative Brief & Visual Intent
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-2.5 text-xs text-text-primary focus:outline-none resize-none"
                  placeholder="e.g. Create a cinematic documentary-style explainer from my narration..."
                />
              </div>

              {/* Video Type Chips */}
              <div>
                <label className="text-text-muted block mb-1.5 font-medium">Genre / Format</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'documentary',
                    'news_explainer',
                    'educational',
                    'technology',
                    'history',
                    'business',
                    'social_short',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVideoType(type as VideoType)}
                      className={`px-3 py-1.5 rounded-editor capitalize transition-colors ${
                        videoType === type
                          ? 'bg-accent text-white font-semibold'
                          : 'bg-app-panel border border-app-border text-text-secondary hover:text-text-primary hover:bg-app-hover'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-text-muted block mb-1 font-medium">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-2 text-xs text-text-primary focus:outline-none"
                  >
                    <option value="16:9">16:9 Landscape (YouTube/Web)</option>
                    <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
                    <option value="1:1">1:1 Square (Feed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-text-muted block mb-1 font-medium">Visual Pacing</label>
                  <select
                    value={pacing}
                    onChange={(e) => setPacing(e.target.value as Pacing)}
                    className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-2 text-xs text-text-primary focus:outline-none"
                  >
                    <option value="calm">Calm & Observational</option>
                    <option value="contemplative">Contemplative (Longer takes)</option>
                    <option value="moderate">Moderate Explainer</option>
                    <option value="dynamic">Dynamic & Snappy</option>
                  </select>
                </div>

                <div>
                  <label className="text-text-muted block mb-1 font-medium">Tone</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-app-panel border border-app-border focus:border-accent rounded p-2 text-xs text-text-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <span>Continue to Audio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Narration Upload */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-text-primary">2. Upload Your Narration</h2>
              <p className="text-xs text-text-secondary mt-1">
                Your uploaded voice recording governs timing. It is never replaced with synthetic speech.
              </p>
            </div>

            {/* Audio Authority Notice */}
            <div className="p-3 rounded bg-track-narration/15 border border-track-narration/30 text-xs text-teal-200 flex items-start gap-2.5">
              <Mic className="w-4 h-4 text-track-narration shrink-0 mt-0.5" />
              <span>
                <strong>Audio-First Rule:</strong> Spoken words determine scene boundaries and durations. Framecraft preserves your original audio master verbatim.
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-app-border hover:border-accent/60 rounded-dialog p-8 text-center bg-app-panel/50 space-y-3 relative group transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-full bg-app-elevated border border-app-border mx-auto flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="font-semibold text-text-primary text-sm block">
                  {audioFile ? audioFile.name : 'Drag & drop English narration (WAV, MP3, M4A, AAC)'}
                </span>
                <span className="text-xs text-text-muted mt-1 block">
                  {audioFile
                    ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Decoded via Web Audio API`
                    : 'Or click to select an audio file from your computer (Up to 100MB)'}
                </span>
              </div>
            </div>

            {/* Audio Technical Details & Waveform */}
            <div className="bg-app-panel border border-app-border rounded-dialog p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-success" />
                  Narration Master Ready
                </span>
                <span className="font-mono text-text-muted">
                  {audioInfo.durationSeconds.toFixed(1)}s • {audioInfo.sampleRate}Hz • {audioInfo.numberOfChannels} Channels
                </span>
              </div>

              {/* Waveform graphic */}
              <div className="h-16 bg-[#080B10] border border-app-border/80 rounded-editor flex items-center px-3 gap-1 overflow-hidden">
                {audioInfo.waveformPeaks.map((peak, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${peak * 100}%` }}
                    className="w-1.5 bg-track-narration/75 rounded-full transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-text-secondary text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <span>Continue to Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Visual Style */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-text-primary">3. Select Visual Theme</h2>
              <p className="text-xs text-text-secondary mt-1">
                Themes determine typographic hierarchy, caption presentation, color palettes, and motion intensity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-4 rounded-dialog border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-app-elevated border-accent ring-1 ring-accent shadow-lg'
                        : 'bg-app-panel border-app-border hover:border-app-border/80 hover:bg-app-hover/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-text-primary">{theme.name}</h3>
                      <div className="flex gap-1.5">
                        <span
                          style={{ backgroundColor: theme.primaryColor }}
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                        />
                        <span
                          style={{ backgroundColor: theme.accentColor }}
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">
                      {theme.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                      <span>Font: {theme.fontHeading}</span>
                      <span>•</span>
                      <span>Captions: {theme.captionPreset}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-text-secondary text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <span>Continue to Sources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Source Policy */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-text-primary">4. Source & Rights Policy</h2>
              <p className="text-xs text-text-secondary mt-1">
                Establish rights constraints for footage discovery. Unknown rights will not be marked as cleared.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'strict_commercial',
                  title: 'Strict Commercial',
                  desc: 'Only Pexels/Unsplash commercial terms. No uncleared web scrapings permitted.',
                },
                {
                  id: 'licensed_and_pd',
                  title: 'Licensed & Public Domain',
                  desc: 'Commercial stock + verified institution archives with Creative Commons licenses.',
                },
                {
                  id: 'research_and_review',
                  title: 'Research & Review',
                  desc: 'Permits web references for ideation. Blocks export until commercial clearance is proven.',
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPolicyPreset(p.id as any)}
                  className={`p-3 rounded-dialog text-left border transition-all ${
                    policyPreset === p.id
                      ? 'bg-app-elevated border-accent ring-1 ring-accent'
                      : 'bg-app-panel border-app-border hover:bg-app-hover'
                  }`}
                >
                  <div className="font-semibold text-xs text-text-primary mb-1">{p.title}</div>
                  <p className="text-[11px] text-text-muted leading-relaxed">{p.desc}</p>
                </button>
              ))}
            </div>

            {/* Guardrail toggles */}
            <div className="bg-app-panel border border-app-border rounded-dialog p-4 space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-text-primary block">Allow Illustrative Footage</span>
                  <span className="text-[11px] text-text-muted">
                    When footage of the exact historic event is unavailable, use contextually appropriate stock.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowIllustrative}
                  onChange={(e) => setAllowIllustrative(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-app-border pt-3">
                <div>
                  <span className="font-medium text-text-primary block">Mandatory On-Screen Source Labels</span>
                  <span className="text-[11px] text-text-muted">
                    Display creator attribution credits in the lower corner of video frames.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireSourceLabels}
                  onChange={(e) => setRequireSourceLabels(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-app-border pt-3">
                <div>
                  <span className="font-medium text-text-primary block">Sensitive Content Preflight Review</span>
                  <span className="text-[11px] text-text-muted">
                    Flag proper nouns and geographic locations that require human editorial confirmation.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={sensitiveReview}
                  onChange={(e) => setSensitiveReview(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-text-secondary text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-5 py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Start */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-text-primary">5. Preflight Summary</h2>
              <p className="text-xs text-text-secondary mt-1">
                Review your production setup before launching the AI planning and alignment agents.
              </p>
            </div>

            <div className="bg-app-panel border border-app-border rounded-dialog divide-y divide-app-border text-xs">
              <div className="p-4 flex justify-between">
                <span className="text-text-muted">Project Title:</span>
                <span className="font-semibold text-text-primary">{title}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-text-muted">Master Audio Duration:</span>
                <span className="font-mono text-track-narration font-semibold">
                  {audioInfo.durationSeconds.toFixed(1)} seconds (Preserved)
                </span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-text-muted">Video Format:</span>
                <span className="font-mono text-text-primary">{aspectRatio} • 30 fps • 1080p</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-text-muted">Theme Selection:</span>
                <span className="text-accent font-semibold">{selectedTheme.name}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-text-muted">Source Policy:</span>
                <span className="font-mono text-status-success uppercase font-semibold">
                  {policyPreset.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-text-secondary text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinishAndStart}
                className="px-6 py-3 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Transcribe and Plan First Cut</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
