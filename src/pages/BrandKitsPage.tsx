import React, { useState } from 'react';
import {
  Palette,
  Plus,
  CheckCircle2,
  Copy,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';
import { BrandKit } from '../types';

export const BrandKitsPage: React.FC = () => {
  const { brandKits, project, setProject } = useProject();
  const [activeKitId, setActiveKitId] = useState(brandKits[0]?.id || '');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleApplyKit = (kit: BrandKit) => {
    setProject((prev) => ({
      ...prev,
      brandKitId: kit.id,
    }));
    setAppliedNotification(`Applied “${kit.name}” tokens to active project`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Brand Kits & Design Systems
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Maintain typographic and color consistency across video productions.
              </p>
            </div>
          </div>

          {appliedNotification && (
            <div className="p-3 rounded bg-status-success/20 border border-status-success/40 text-xs text-status-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{appliedNotification}</span>
            </div>
          )}

          {/* Kits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-4 hover:border-accent/40 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-text-primary">{kit.name}</h3>
                    {project.brandKitId === kit.id && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent">
                        Active in Project
                      </span>
                    )}
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-text-muted">Palette:</span>
                    <div className="flex gap-1.5">
                      <span
                        style={{ backgroundColor: kit.primaryColor }}
                        className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                        title="Primary Color"
                      />
                      <span
                        style={{ backgroundColor: kit.secondaryColor }}
                        className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                        title="Secondary Color"
                      />
                      <span
                        style={{ backgroundColor: kit.accentColor }}
                        className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                        title="Accent Color"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-app-elevated border border-app-border rounded-editor space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Heading Font:</span>
                      <span className="font-semibold text-text-primary">{kit.fontHeading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Captions:</span>
                      <span className="font-mono text-text-secondary">{kit.captionPreset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Transition:</span>
                      <span className="capitalize text-text-secondary">{kit.defaultTransition}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyKit(kit)}
                  className="w-full py-2 px-3 rounded-editor bg-app-elevated hover:bg-accent hover:text-white border border-app-border text-xs font-semibold text-text-primary transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Kit to Current Video</span>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
