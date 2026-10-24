import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoBanner } from '../components/common/DemoBanner';

export const MediaLibraryPage: React.FC = () => {
  const { assets, rights } = useProject();
  const [tab, setTab] = useState<'all' | 'pexels' | 'unsplash' | 'archive' | 'web_reference'>('all');
  const [search, setSearch] = useState('');

  const filtered = assets.filter((asset) => {
    if (tab !== 'all' && asset.provider !== tab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        asset.title.toLowerCase().includes(q) ||
        asset.creatorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                Media & Source Library
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Inspect rights classifications, commercial permissions, and source attribution.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets by title or creator..."
                className="bg-app-panel border border-app-border focus:border-accent rounded-editor pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none w-64"
              />
            </div>
          </div>

          {/* Provider Filter Tabs */}
          <div className="flex gap-2 border-b border-app-border pb-3 text-xs">
            {(['all', 'pexels', 'unsplash', 'archive', 'web_reference'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-editor capitalize font-medium transition-colors ${
                  tab === t
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-app-panel border border-app-border text-text-secondary hover:text-text-primary hover:bg-app-hover'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((asset) => {
              const right = rights[asset.rightsRecordId];
              const isCleared = right?.commercialUseAllowed === true;

              return (
                <div
                  key={asset.id}
                  className="bg-app-panel border border-app-border rounded-dialog overflow-hidden group hover:border-accent/50 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-[#090D14] relative overflow-hidden">
                      <img
                        src={asset.previewUrl}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/75 text-white uppercase backdrop-blur-sm">
                          {asset.provider}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm ${
                            isCleared
                              ? 'bg-status-success/80 text-white'
                              : 'bg-status-warning/80 text-black'
                          }`}
                        >
                          {isCleared ? 'Commercial Cleared' : 'Action Required'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <h3 className="font-semibold text-xs text-text-primary line-clamp-1">
                        {asset.title}
                      </h3>
                      <div className="flex justify-between text-[11px] text-text-muted">
                        <span>By {asset.creatorName}</span>
                        <span className="font-mono">{asset.width}x{asset.height}</span>
                      </div>
                      <div className="text-[10px] font-mono text-accent truncate">
                        {right?.classification}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-app-border bg-app-elevated/40 text-[10px] text-text-muted flex items-center justify-between">
                    <span className="truncate max-w-[180px] italic">
                      {right?.attributionText}
                    </span>
                    <a
                      href={asset.sourcePageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-1 shrink-0 ml-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Source</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
