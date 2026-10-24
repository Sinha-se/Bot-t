import React, { useState } from 'react';
import { Info, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-[#151922] border-b border-app-border/80 px-3 py-1.5 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent uppercase tracking-wider">
            Demo Mode Active
          </span>
          <span className="hidden sm:inline text-text-muted">
            Running offline studio environment. Audio decoding, canvas video playback, and export work locally.
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-accent hover:text-accent-active transition-colors font-medium text-[11px]"
        >
          <Info className="w-3.5 h-3.5" />
          <span>System Truthfulness & Integrations</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-app-panel border border-app-border rounded-dialog max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent" />
              Framecraft Capability & Truthfulness Matrix
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              In accordance with Framecraft's core principles (Section 1.3), we never simulate fake third-party API results or pretend unverified rights are cleared.
            </p>

            <div className="space-y-2.5 text-xs text-text-secondary mb-5">
              <div className="p-2.5 rounded bg-app-elevated border border-app-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary block">Real Audio Decoding & WebAudio Engine:</span>
                  Uploaded narration decodes actual sample rate, channel count, and waveform peaks via HTML5 Web Audio API.
                </div>
              </div>

              <div className="p-2.5 rounded bg-app-elevated border border-app-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary block">Real Video Playback & Canvas Composition:</span>
                  The viewer is a real 2D Canvas engine combining multi-track footage, typography, transitions, and captions at true 30fps.
                </div>
              </div>

              <div className="p-2.5 rounded bg-app-elevated border border-app-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary block">Real Video File Rendering & Downloads:</span>
                  Export encodes real WebM/MP4 video files via MediaRecorder + Canvas captureStream, plus real SRT/VTT/Attribution files.
                </div>
              </div>

              <div className="p-2.5 rounded bg-app-elevated border border-app-border flex items-start gap-2.5">
                <Info className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary block">Source Rights & Unknown Clearance:</span>
                  Web clippings default to <code className="text-status-warning">uncleared_unknown</code> and block export until cleared.
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
