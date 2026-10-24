import React, { useState } from 'react';
import {
  Settings,
  Plug,
  Shield,
  Keyboard,
  Database,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';

export const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState<'matrix' | 'integrations' | 'shortcuts' | 'privacy'>('matrix');

  const integrations = [
    {
      name: 'HTML5 Web Audio & Decoder',
      type: 'Audio Engine',
      status: 'Connected (Native Browser)',
      capabilities: 'Real multi-channel decoding, sample rate analysis, waveform peak generation',
      isLive: true,
    },
    {
      name: 'HTML5 2D Canvas Composition Engine',
      type: 'Video Renderer',
      status: 'Connected (Native Browser)',
      capabilities: 'Real-time multi-track compositor, text typography, crop/scale/filter shaders',
      isLive: true,
    },
    {
      name: 'MediaStream & MediaRecorder',
      type: 'Video Exporter',
      status: 'Connected (Native Browser)',
      capabilities: 'In-browser real WebM / MP4 video recording and binary blob packaging',
      isLive: true,
    },
    {
      name: 'OpenAI Whisper Engine',
      type: 'Transcription Worker',
      status: 'Demo Mode (Local Fallback)',
      capabilities: 'Whisper-compatible English model with integer word timestamps',
      isLive: false,
    },
    {
      name: 'Pexels Media API',
      type: 'Stock Provider',
      status: 'Curated Demo Fixture',
      capabilities: 'Commercial license footage & stills discovery with rights records',
      isLive: false,
    },
    {
      name: 'Unsplash Photography API',
      type: 'Still Images',
      status: 'Curated Demo Fixture',
      capabilities: 'Editorial & commercial photo discovery with creator attribution',
      isLive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Studio Configuration & Capability Matrix
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Review truthful system boundaries, integration states, and keyboard controls.
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex gap-2 border-b border-app-border pb-3 text-xs">
            {[
              { id: 'matrix', label: 'Capability Matrix' },
              { id: 'integrations', label: 'Integrations & Services' },
              { id: 'shortcuts', label: 'Keyboard Shortcuts' },
              { id: 'privacy', label: 'Privacy & Storage' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-3 py-1.5 rounded-editor font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-app-panel border border-app-border text-text-secondary hover:text-text-primary hover:bg-app-hover'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: CAPABILITY MATRIX */}
          {tab === 'matrix' && (
            <div className="space-y-6">
              <div className="p-4 rounded-dialog bg-app-panel border border-app-border space-y-2">
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Truthful Implementation Architecture</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Per Section 1.3 and Section 37, this matrix explicitly differentiates between fully implemented native capabilities, demo simulations, and provider-gated features.
                </p>
              </div>

              {/* Table */}
              <div className="bg-app-panel border border-app-border rounded-dialog overflow-x-auto shadow-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-app-elevated/70 border-b border-app-border text-[11px] font-mono text-text-muted">
                      <th className="p-3">Feature Area</th>
                      <th className="p-3">Implementation Status</th>
                      <th className="p-3">Runtime Environment</th>
                      <th className="p-3">Truthful Details & Boundaries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border/40 text-text-secondary">
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Audio Decoding & Waveforms</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">Web Audio API</td>
                      <td className="p-3">Decodes real MP3/WAV/AAC files, extracts 100 waveform peaks, and respects sample rate.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Video Player & Canvas Compositor</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">HTML5 2D Canvas</td>
                      <td className="p-3">Real-time multitrack rendering of footage, titles, lower thirds, quotes, captions, and safe areas.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Multitrack Timeline Editor</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">React State Store</td>
                      <td className="p-3">7 distinct tracks, interactive scrubbing, trimming in/out points, splitting (S), mute/lock/hide, and undo/redo.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Video File Export</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">MediaRecorder API</td>
                      <td className="p-3">Records genuine downloadable WebM/MP4 video files from Canvas stream + Web Audio destination.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Captions & Attribution Exports</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">Browser File Blob</td>
                      <td className="p-3">Generates exact format-compliant .SRT, .VTT, plain transcript .txt, and Attribution .MD/.CSV reports.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">Rights Gate & Export Blockers</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success">
                          Fully Implemented
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">Rights Verification Engine</td>
                      <td className="p-3">Tracks discovery, preview, import, and export permissions. Blocks export if uncleared web assets are present.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-text-primary">AI Transcription Engine</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent">
                          Demo Mode / Local
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">Offline Fallback</td>
                      <td className="p-3">Seeded with sample speech timestamps. External Whisper API requires optional API key configuration.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INTEGRATIONS */}
          {tab === 'integrations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {integrations.map((int, idx) => (
                <div
                  key={idx}
                  className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-primary">{int.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        int.isLive
                          ? 'bg-status-success/20 text-status-success'
                          : 'bg-app-elevated text-text-muted border border-app-border'
                      }`}
                    >
                      {int.status}
                    </span>
                  </div>

                  <div className="text-xs text-text-secondary">
                    <strong className="text-text-primary">Type:</strong> {int.type}
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">{int.capabilities}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {tab === 'shortcuts' && (
            <div className="bg-app-panel border border-app-border rounded-dialog divide-y divide-app-border max-w-2xl">
              {[
                { key: 'Space', desc: 'Play / Pause timeline playback' },
                { key: '← / →', desc: 'Step 1 frame backward / forward' },
                { key: 'Shift + ← / →', desc: 'Step 1 second (30 frames) backward / forward' },
                { key: 'S', desc: 'Split selected clip at current playhead position' },
                { key: 'Backspace / Delete', desc: 'Delete selected timeline item (narration protected)' },
                { key: 'Ctrl/Cmd + Z', desc: 'Undo last timeline edit' },
                { key: 'Ctrl/Cmd + Shift + Z', desc: 'Redo undone timeline edit' },
                { key: 'Ctrl/Cmd + S', desc: 'Force manual save state' },
                { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette & shortcuts reference' },
                { key: '+ / -', desc: 'Zoom in / zoom out timeline ruler' },
                { key: 'Esc', desc: 'Close dialogs, tool drawers, or active selections' },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{s.desc}</span>
                  <kbd className="px-2 py-1 rounded bg-app-elevated text-text-primary font-mono text-[11px] border border-app-border">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {tab === 'privacy' && (
            <div className="bg-app-panel border border-app-border rounded-dialog p-6 space-y-4 max-w-2xl text-xs text-text-secondary">
              <h3 className="font-bold text-sm text-text-primary">Data Sovereignty & Retention</h3>
              <p className="leading-relaxed">
                All video timeline state, custom project briefs, transcripts, and media links are stored locally in browser persistent storage.
                No uploaded narration audio or creative assets are transmitted to external cloud servers without explicit user confirmation.
              </p>

              <div className="pt-4 border-t border-app-border flex items-center justify-between">
                <div>
                  <span className="font-semibold text-text-primary block">Reset Local Studio Cache</span>
                  <span className="text-[11px] text-text-muted">Clears cached timeline revisions and reloads seed demo</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded bg-status-error/15 hover:bg-status-error/25 border border-status-error/40 text-status-error font-medium"
                >
                  Clear Storage
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
