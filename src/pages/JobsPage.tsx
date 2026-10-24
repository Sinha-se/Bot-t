import React from 'react';
import { Activity, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';

export const JobsPage: React.FC = () => {
  const { jobs } = useProject();

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Studio Background Jobs
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Transparent operational logs for transcription, scene alignment, and video export tasks.
            </p>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text-primary capitalize">
                      {job.type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-text-muted">({job.id})</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-status-success/20 text-status-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{job.status}</span>
                  </span>
                </div>

                <div className="text-xs text-text-secondary">
                  <strong className="text-text-primary">Stage:</strong> {job.currentStage}
                </div>

                {job.logs && job.logs.length > 0 && (
                  <div className="bg-[#090C12] border border-app-border rounded-editor p-3 font-mono text-[11px] text-text-muted space-y-1">
                    {job.logs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-relaxed">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-text-muted pt-2 border-t border-app-border">
                  <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
                  <span>Attempts: {job.attempts}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
