import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const AIAssistant: React.FC = () => {
  const {
    proposals,
    applyProposal,
    rejectProposal,
    project,
    setCurrentTimeMs,
  } = useProject();

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingProposals = proposals.filter((p) => p.status === 'pending');

  const handleCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Create intelligent contextual proposal based on user query
      setIsProcessing(false);
      setInputQuery('');
    }, 600);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 text-xs text-text-secondary select-none overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles className="w-3 h-3" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">AI Editorial Assistant</h3>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          Proposes reversible timeline operations. Master narration is protected against desynchronization.
        </p>
      </div>

      {/* Safeguard badge */}
      <div className="p-2.5 rounded bg-app-elevated border border-app-border flex items-start gap-2 text-[11px]">
        <Lock className="w-3.5 h-3.5 text-track-narration shrink-0 mt-0.5" />
        <span className="text-text-muted">
          <strong className="text-text-primary font-medium">Narration Guard:</strong> Spoken audio and time alignment are preserved unless explicitly rewritten by the user.
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono text-text-muted tracking-wider">
          Suggested Actions
        </span>
        <div className="space-y-1">
          <button
            onClick={() => applyProposal('prop_replace_restricted_news')}
            className="w-full text-left p-2 rounded bg-app-elevated/70 hover:bg-app-hover border border-app-border text-[11px] text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group"
          >
            <span>Fix Scene 8 restricted web reference</span>
            <ArrowRight className="w-3 h-3 text-accent group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => applyProposal('prop_apply_subtle_grain')}
            className="w-full text-left p-2 rounded bg-app-elevated/70 hover:bg-app-hover border border-app-border text-[11px] text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group"
          >
            <span>Harmonize color & vignette across all scenes</span>
            <ArrowRight className="w-3 h-3 text-accent group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Proposed Edit Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono text-text-muted tracking-wider">
            Proposed Changes ({pendingProposals.length})
          </span>
        </div>

        {pendingProposals.length === 0 ? (
          <div className="p-4 rounded border border-dashed border-app-border text-center text-text-muted text-[11px]">
            No pending edit proposals. All current AI suggestions have been reviewed.
          </div>
        ) : (
          pendingProposals.map((prop) => (
            <div
              key={prop.id}
              className="p-3 rounded-editor bg-app-elevated border border-accent/30 space-y-2.5 shadow-md"
            >
              <div className="font-semibold text-text-primary text-[12px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{prop.userRequest}</span>
              </div>

              {/* Proposed Operations list */}
              <div className="p-2 rounded bg-app-panel/90 space-y-1 text-[11px]">
                <span className="text-[10px] font-mono text-text-muted uppercase block">
                  Operations ({prop.proposedOperations.length})
                </span>
                {prop.proposedOperations.map((op, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-text-secondary">
                    <span className="text-accent font-bold">•</span>
                    <span>{op}</span>
                  </div>
                ))}
              </div>

              {/* Impact analysis */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-status-success">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Narration Impact: {prop.narrationImpact === 'none' ? 'None (Audio preserved)' : prop.narrationImpact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-accent" />
                  <span>Rights: {prop.sourceRightsImpact}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-app-border">
                <button
                  onClick={() => rejectProposal(prop.id)}
                  className="px-2.5 py-1 rounded hover:bg-app-hover text-text-muted hover:text-text-primary text-[11px] font-medium transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    setCurrentTimeMs(50000); // Seek to scene
                    applyProposal(prop.id);
                  }}
                  className="px-3 py-1 rounded bg-accent hover:bg-accent-hover text-white text-[11px] font-semibold shadow-sm transition-all hover:scale-105"
                >
                  Apply to Timeline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Natural language prompt box */}
      <div className="mt-auto pt-3 border-t border-app-border">
        <form onSubmit={handleCustomPrompt} className="relative">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Instruct the assistant (e.g. 'Add lower third')..."
            className="w-full bg-app-elevated border border-app-border focus:border-accent rounded-editor pl-3 pr-8 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-accent hover:text-accent-active disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
