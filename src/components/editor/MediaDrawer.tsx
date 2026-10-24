import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  RefreshCw,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Asset } from '../../types';

interface MediaDrawerProps {
  onClose: () => void;
  isReplacing?: boolean;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({ onClose, isReplacing = false }) => {
  const { assets, rights, selectedItemId, replaceAssetOnItem } = useProject();
  const [tab, setTab] = useState<'all' | 'pexels' | 'unsplash' | 'archive' | 'web_reference'>('all');
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter((asset) => {
    if (tab !== 'all' && asset.provider !== tab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = asset.title.toLowerCase().includes(q);
      const matchCreator = asset.creatorName.toLowerCase().includes(q);
      const matchTags = asset.metadata.tags?.some((t: string) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCreator && !matchTags) return false;
    }
    return true;
  });

  const handleSelectAsset = (asset: Asset) => {
    if (selectedItemId) {
      replaceAssetOnItem(selectedItemId, asset.id);
      onClose();
    }
  };

  return (
    <div className="w-80 bg-app-panel border-r border-app-border flex flex-col h-full shrink-0 select-none z-20">
      {/* Header */}
      <div className="p-3 border-b border-app-border flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-text-primary">
            {isReplacing ? 'Replace Selected Asset' : 'Media Discovery'}
          </h3>
          <p className="text-[10px] text-text-muted">
            {isReplacing ? 'Maintains timeline clip duration' : 'Rights-aware footage & stills'}
          </p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-app-border flex gap-1 overflow-x-auto text-[11px]">
        {(['all', 'pexels', 'unsplash', 'archive', 'web_reference'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-1 rounded capitalize shrink-0 font-medium transition-colors ${
              tab === t
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary hover:bg-app-hover'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-app-border">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or tags..."
            className="w-full bg-app-elevated border border-app-border focus:border-accent rounded pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredAssets.map((asset) => {
          const right = rights[asset.rightsRecordId];
          const isCleared = right?.commercialUseAllowed === true;

          return (
            <div
              key={asset.id}
              className="bg-app-elevated border border-app-border rounded-editor overflow-hidden group hover:border-accent/40 transition-all shadow-sm"
            >
              {/* Thumbnail */}
              <div className="h-28 bg-[#090C12] relative overflow-hidden">
                <img
                  src={asset.previewUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/70 text-white uppercase backdrop-blur-sm">
                    {asset.provider}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-sm ${
                      asset.authenticity === 'actual_event'
                        ? 'bg-purple-900/80 text-purple-200'
                        : 'bg-blue-900/80 text-blue-200'
                    }`}
                  >
                    {asset.authenticity}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-sm ${
                      isCleared
                        ? 'bg-status-success/80 text-white'
                        : 'bg-status-warning/80 text-black'
                    }`}
                  >
                    {isCleared ? 'Cleared' : 'Restricted'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5 space-y-1.5">
                <div className="font-medium text-xs text-text-primary line-clamp-1">
                  {asset.title}
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span>By {asset.creatorName}</span>
                  <span className="font-mono">{asset.width}x{asset.height}</span>
                </div>

                {/* Attribution note */}
                <div className="text-[10px] text-text-muted line-clamp-1 italic">
                  {right?.attributionText}
                </div>

                {/* Apply button */}
                <button
                  onClick={() => handleSelectAsset(asset)}
                  className="w-full mt-1 py-1 px-2 rounded bg-app-panel hover:bg-accent hover:text-white border border-app-border text-text-secondary text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isReplacing ? 'Replace Selected Clip' : 'Assign to Selection'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
