import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  Play,
  Film,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { exportTimelineToVideo } from '../services/videoRenderer';
import {
  generateSRT,
  generateVTT,
  generatePlainTranscript,
  generateAttributionReportMarkdown,
  downloadFile,
} from '../services/exportPackager';
import { ExportSettings } from '../types';

export const RenderProgressPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, timelineItems, assets, rights, transcripts } = useProject();

  const settings: ExportSettings = location.state?.settings || {
    fileName: `${project.title.replace(/\s+/g, '_')}_Master`,
    container: 'mp4',
    videoCodec: 'h264',
    resolution: '1080p',
    width: 1920,
    height: 1080,
    frameRate: 30,
    qualityBitrate: 'high',
    audioCodec: 'aac',
    audioSampleRate: 48000,
    captionMode: 'burn_in',
    exportRange: 'entire_timeline',
  };

  const [currentStage, setCurrentStage] = useState('Queued in local render queue');
  const [progressPercent, setProgressPercent] = useState(0);
  const [isRenderComplete, setIsRenderComplete] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState(0);
  const [renderDurationSec, setRenderDurationSec] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function runExport() {
      try {
        const result = await exportTimelineToVideo(
          project,
          timelineItems,
          assets,
          settings,
          (stage, pct) => {
            if (!isCancelled) {
              setCurrentStage(stage);
              setProgressPercent(pct);
            }
          }
        );

        if (!isCancelled) {
          const url = URL.createObjectURL(result.blob);
          setVideoBlob(result.blob);
          setVideoBlobUrl(url);
          setFileSizeBytes(result.fileSize);
          setRenderDurationSec(result.durationSeconds);
          setIsRenderComplete(true);
        }
      } catch (err) {
        console.error('Render error:', err);
        setCurrentStage('Failed during composite frame rendering');
      }
    }

    runExport();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleDownloadVideo = () => {
    if (videoBlob) {
      downloadFile(videoBlob, `${settings.fileName}.${settings.container}`, videoBlob.type);
    }
  };

  const handleDownloadSrt = () => {
    downloadFile(generateSRT(transcripts), `${settings.fileName}.srt`);
  };

  const handleDownloadAttribution = () => {
    const md = generateAttributionReportMarkdown(project, timelineItems, assets, rights);
    downloadFile(md, `${settings.fileName}_Attribution_Report.md`, 'text/markdown');
  };

  const handleDownloadProjectJson = () => {
    const jsonStr = JSON.stringify(
      {
        project,
        timelineItems,
        transcripts,
        assets,
        rights,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    downloadFile(jsonStr, `${settings.fileName}_project.json`, 'application/json');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8 flex flex-col justify-center">
        {!isRenderComplete ? (
          // In-Progress View
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/20">
              <Film className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Rendering Video Distribution Package
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Composing 7 audio and visual tracks into high-fidelity video stream.
              </p>
            </div>

            <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3 shadow-xl max-w-xl mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">{currentStage}</span>
                <span className="font-mono text-accent font-bold">{progressPercent}%</span>
              </div>

              <div className="h-2 w-full bg-app-elevated rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-accent to-track-narration transition-all duration-150"
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-text-muted">
                <span>{settings.resolution} • {settings.frameRate}fps</span>
                <span>Container: {settings.container.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          // Success View
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-status-success/20 border border-status-success/40 flex items-center justify-center mx-auto text-status-success shadow-lg shadow-status-success/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Your Video is Ready</h1>
              <p className="text-xs text-text-secondary">
                Render completed successfully with full audio-first timecode synchronization.
              </p>
            </div>

            {/* Playable Video Player Preview */}
            <div className="bg-app-panel border border-app-border rounded-dialog overflow-hidden shadow-2xl">
              <div className="aspect-video bg-black flex items-center justify-center max-h-[360px] relative">
                {videoBlobUrl ? (
                  <video
                    src={videoBlobUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-text-muted text-xs">Loading video player...</div>
                )}
              </div>

              {/* Technical Specifications metadata bar */}
              <div className="p-4 bg-app-elevated/70 border-t border-app-border flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-text-primary block text-sm">
                    {settings.fileName}.{settings.container}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB • {renderDurationSec.toFixed(1)}s • {settings.width}x{settings.height} • {settings.frameRate} fps
                  </span>
                </div>

                <button
                  onClick={handleDownloadVideo}
                  className="px-5 py-2.5 rounded-editor bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </button>
              </div>
            </div>

            {/* Supporting Package Downloads */}
            <div className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase text-text-muted tracking-wider">
                Companion Production Artifacts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadSrt}
                  className="p-3 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-semibold text-xs text-text-primary block">
                      Subtitles (.SRT)
                    </span>
                    <span className="text-[10px] text-text-muted">Time-aligned sidecar</span>
                  </div>
                  <Download className="w-4 h-4 text-accent group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleDownloadAttribution}
                  className="p-3 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-semibold text-xs text-text-primary block">
                      Rights Report (.MD)
                    </span>
                    <span className="text-[10px] text-text-muted">Creator credits & licenses</span>
                  </div>
                  <Download className="w-4 h-4 text-accent group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleDownloadProjectJson}
                  className="p-3 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-semibold text-xs text-text-primary block">
                      Project Archive (.JSON)
                    </span>
                    <span className="text-[10px] text-text-muted">Editable timeline schema</span>
                  </div>
                  <Download className="w-4 h-4 text-accent group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to={`/app/projects/${project.id}/editor`}
                className="px-4 py-2 rounded-editor bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-secondary flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Editor</span>
              </Link>

              <Link
                to="/app"
                className="text-xs text-accent hover:underline font-medium"
              >
                Back to Workspace Dashboard →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
