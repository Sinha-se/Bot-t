import React, { useState } from 'react';
import {
  LayoutTemplate,
  Type,
  Subtitles,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { GRAPHICS_TEMPLATES } from '../data/templates';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';

export const TemplatesPage: React.FC = () => {
  const [filterCat, setFilterCat] = useState<'all' | 'title' | 'lower_third' | 'quote' | 'chapter' | 'statistic'>('all');

  const filtered = GRAPHICS_TEMPLATES.filter((tmpl) => {
    if (filterCat !== 'all' && tmpl.category !== filterCat) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Graphics & Titles Library
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Production-ready typography cards, lower thirds, chapter divisions, and quote overlays.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-app-border pb-3 text-xs">
            {(['all', 'title', 'lower_third', 'quote', 'chapter', 'statistic'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-editor capitalize font-medium transition-colors ${
                  filterCat === cat
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-app-panel border border-app-border text-text-secondary hover:text-text-primary hover:bg-app-hover'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-app-panel border border-app-border rounded-dialog p-5 space-y-4 hover:border-accent/50 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent uppercase">
                      {tmpl.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">
                      {(tmpl.defaultDurationFrames / 30).toFixed(1)}s Duration
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary">{tmpl.name}</h3>

                  {/* Visual Preview Box */}
                  <div className="h-28 bg-[#080B10] border border-app-border rounded-editor p-4 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
                    <div className="text-xs font-semibold text-amber-200 italic line-clamp-2">
                      “{tmpl.previewText}”
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                    <span>Aspects: {tmpl.supportedAspectRatios.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-app-border text-[11px] text-text-muted flex justify-between items-center">
                  <span>Fully editable copy</span>
                  <span className="text-accent font-semibold">Ready to Use</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
