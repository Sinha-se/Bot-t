import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Palette,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search,
  Type,
  Video,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Sliders,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { Scene } from '../types';

export const StoryboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { project, scenes, updateScene, transcripts, addJob } = useProject();
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');

  const fps = project.fpsNumerator || 30;

  const handleApproveAll = () => {
    scenes.forEach((scene) => {
      updateScene(scene.id, { status: 'approved' });
    });
  };

  const handleBuildFirstCut = () => {
    addJob({
      id: `job_assemble_${Date.now()}`,
      projectId: project.id,
      type: 'assembly',
      status: 'completed',
      currentStage: 'Timeline assembled from approved visual plan',
      attempts: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: [
        'Validated 12 approved scenes against audio master',
        'Acquired licensed stock from Pexels and Unsplash',
        'Placed title cards, captions, and lower thirds on timeline',
      ],
    });

    navigate(`/app/projects/${project.id}/editor`);
  };

  const flaggedCount = scenes.filter((s) => s.status === 'flagged').length;
  const approvedCount = scenes.filter((s) => s.status === 'approved').length;

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      {/* Subheader */}
      <div className="h-10 bg-app-panel border-b border-app-border px-6 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2">
          <Link to={`/app/projects/${project.id}/transcript`} className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Transcript</span>
          </Link>
          <span className="text-app-border">/</span>
          <span className="text-text-primary font-medium">{project.title}</span>
          <span className="text-app-border">/</span>
          <span className="text-accent font-semibold">Visual Storyboard Plan</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveAll}
            className="px-3 py-1 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-primary font-medium transition-colors"
          >
            Approve All ({scenes.length})
          </button>
          <button
            onClick={handleBuildFirstCut}
            className="px-4 py-1.5 rounded-editor bg-accent hover:bg-accent-hover text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-accent/20"
          >
            <span>Acquire Media & Build First Cut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6 overflow-y-auto">
        {/* Storyboard Summary Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-app-panel border border-app-border rounded-dialog">
            <span className="text-xs text-text-muted block">Planned Scenes</span>
            <span className="text-2xl font-bold font-mono text-text-primary mt-1 block">
              {scenes.length}
            </span>
            <span className="text-[11px] text-text-muted">Total Narration: 89.8s</span>
          </div>

          <div className="p-4 bg-app-panel border border-app-border rounded-dialog">
            <span className="text-xs text-text-muted block">Approved Scenes</span>
            <span className="text-2xl font-bold font-mono text-status-success mt-1 block">
              {approvedCount}
            </span>
            <span className="text-[11px] text-text-muted">Ready for assembly</span>
          </div>

          <div className="p-4 bg-app-panel border border-app-border rounded-dialog">
            <span className="text-xs text-text-muted block">Factual / Rights Flags</span>
            <span className="text-2xl font-bold font-mono text-status-warning mt-1 block">
              {flaggedCount}
            </span>
            <span className="text-[11px] text-text-muted">Requires verification</span>
          </div>

          <div className="p-4 bg-app-panel border border-app-border rounded-dialog">
            <span className="text-xs text-text-muted block">Visual Pacing</span>
            <span className="text-base font-semibold capitalize text-accent mt-2 block">
              {project.visualPacing} (~7.4s per shot)
            </span>
          </div>
        </div>

        {/* Scene Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scenes.map((scene) => {
            const seg = transcripts.find((t) => scene.transcriptSegmentIds.includes(t.id));
            const durationSec = (scene.durationFrames / fps).toFixed(1);
            const startSec = (scene.startFrame / fps).toFixed(1);
            const endSec = ((scene.startFrame + scene.durationFrames) / fps).toFixed(1);

            return (
              <div
                key={scene.id}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`bg-app-panel border rounded-dialog p-4 space-y-3 flex flex-col justify-between transition-all ${
                  scene.status === 'flagged'
                    ? 'border-status-warning/50 bg-status-warning/5'
                    : scene.status === 'approved'
                    ? 'border-status-success/30 hover:border-status-success/60'
                    : 'border-app-border hover:border-accent/40'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded">
                        SCENE {scene.sceneNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        {startSec}s - {endSec}s ({durationSec}s)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          scene.authenticityRequirement === 'actual_event'
                            ? 'bg-purple-900/60 text-purple-200 border border-purple-500/30'
                            : 'bg-blue-900/40 text-blue-200 border border-blue-500/30'
                        }`}
                      >
                        {scene.authenticityRequirement}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateScene(scene.id, { locked: !scene.locked });
                        }}
                        className={`p-1 rounded text-text-muted hover:text-text-primary ${
                          scene.locked ? 'text-accent' : ''
                        }`}
                        title={scene.locked ? 'Unlock' : 'Lock'}
                      >
                        {scene.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Transcript quote */}
                  <div className="p-2.5 rounded bg-app-elevated border border-app-border text-xs italic text-text-secondary line-clamp-2">
                    “{seg ? seg.text : 'Spoken narration segment'}”
                  </div>

                  {/* Visual intent description */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider block mb-1">
                      Visual Intent
                    </span>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {scene.visualIntent}
                    </p>
                  </div>

                  {/* Search Queries */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider block mb-1">
                      Search Queries
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {scene.searchQueries.map((q, qIdx) => (
                        <span
                          key={qIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-app-elevated text-text-muted border border-app-border/70"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* On-screen typography */}
                  {scene.onScreenText && (
                    <div className="p-2 rounded bg-app-elevated/60 border border-app-border flex items-center gap-2 text-xs">
                      <Type className="w-3.5 h-3.5 text-track-titles shrink-0" />
                      <span className="text-text-secondary truncate font-medium">
                        {scene.onScreenText}
                      </span>
                    </div>
                  )}

                  {/* Flag warning */}
                  {scene.status === 'flagged' && (
                    <div className="p-2 rounded bg-status-warning/10 border border-status-warning/30 flex items-start gap-2 text-[11px] text-status-warning">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Factual check: verify location metadata before export.</span>
                    </div>
                  )}
                </div>

                {/* Card footer approve checkbox */}
                <div className="pt-3 border-t border-app-border/80 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateScene(scene.id, {
                        status: scene.status === 'approved' ? 'planned' : 'approved',
                      });
                    }}
                    className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
                      scene.status === 'approved'
                        ? 'text-status-success bg-status-success/10'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{scene.status === 'approved' ? 'Plan Approved' : 'Click to Approve'}</span>
                  </button>

                  <span className="text-[11px] font-mono text-text-muted">
                    {scene.preferredMediaType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
