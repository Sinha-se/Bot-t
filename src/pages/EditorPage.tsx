import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import { VideoPlayer } from '../components/editor/VideoPlayer';
import { Timeline } from '../components/editor/Timeline';
import { ToolRail, EditorDrawerTab } from '../components/editor/ToolRail';
import { Inspector } from '../components/editor/Inspector';
import { AIAssistant } from '../components/editor/AIAssistant';
import { MediaDrawer } from '../components/editor/MediaDrawer';
import { GraphicsDrawer } from '../components/editor/GraphicsDrawer';
import { CaptionsDrawer } from '../components/editor/CaptionsDrawer';
import { CommandPalette } from '../components/common/CommandPalette';

export const EditorPage: React.FC = () => {
  const { project, issues, selectedItemId } = useProject();

  const [activeDrawerTab, setActiveDrawerTab] = useState<EditorDrawerTab>(null);
  const [rightTab, setRightTab] = useState<'inspector' | 'assistant' | 'review'>('inspector');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const activeIssues = issues.filter((i) => !i.resolved);
  const blockerCount = activeIssues.filter((i) => i.level === 'blocker').length;

  return (
    <div className="h-screen w-screen bg-app-bg text-text-primary flex flex-col overflow-hidden select-none">
      <DemoBanner />
      <Header inEditor={true} onOpenShortcuts={() => setShowShortcuts(true)} />

      {/* Main Studio Workspace: ToolRail + (Drawer) + Center (Video & Timeline) + Right Dock */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Tool Rail (56-64px) */}
        <ToolRail activeTab={activeDrawerTab} setActiveTab={setActiveDrawerTab} />

        {/* Dynamic Tool Drawer (Media, Graphics, Captions, etc.) */}
        {activeDrawerTab === 'media' && (
          <MediaDrawer onClose={() => setActiveDrawerTab(null)} />
        )}
        {activeDrawerTab === 'graphics' && (
          <GraphicsDrawer onClose={() => setActiveDrawerTab(null)} />
        )}
        {activeDrawerTab === 'captions' && (
          <CaptionsDrawer onClose={() => setActiveDrawerTab(null)} />
        )}

        {/* Center Editing Canvas: Player on Top, Timeline at Bottom */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <VideoPlayer />
          <Timeline />
        </div>

        {/* Right Dock Panel (Inspector / AI Assistant / Review) */}
        {rightPanelOpen ? (
          <aside className="w-80 bg-app-panel border-l border-app-border flex flex-col shrink-0 overflow-hidden z-20">
            {/* Right Tabs Header */}
            <div className="h-10 bg-app-elevated/70 border-b border-app-border px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRightTab('inspector')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    rightTab === 'inspector'
                      ? 'bg-app-panel text-accent border border-app-border'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Inspector</span>
                </button>

                <button
                  onClick={() => setRightTab('assistant')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    rightTab === 'assistant'
                      ? 'bg-app-panel text-accent border border-app-border'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Agent</span>
                </button>

                <button
                  onClick={() => setRightTab('review')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                    rightTab === 'review'
                      ? 'bg-app-panel text-accent border border-app-border'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-status-warning" />
                  <span>Review ({activeIssues.length})</span>
                </button>
              </div>

              <button
                onClick={() => setRightPanelOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                title="Collapse Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {rightTab === 'inspector' && (
                <Inspector onOpenReplaceModal={() => setShowReplaceModal(true)} />
              )}
              {rightTab === 'assistant' && <AIAssistant />}
              {rightTab === 'review' && (
                <div className="p-4 space-y-3 overflow-y-auto h-full text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">Review Checkpoints</span>
                    <span className="text-[10px] font-mono text-status-warning">
                      {blockerCount > 0 ? `${blockerCount} Blocker(s)` : 'Non-blocking'}
                    </span>
                  </div>
                  {activeIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 bg-app-elevated border border-app-border rounded-editor space-y-1.5"
                    >
                      <div className="font-semibold text-text-primary text-[11px] flex items-center gap-1.5">
                        <AlertTriangle
                          className={`w-3.5 h-3.5 ${
                            issue.level === 'blocker' ? 'text-status-error' : 'text-status-warning'
                          }`}
                        />
                        <span>{issue.title}</span>
                      </div>
                      <p className="text-[11px] text-text-muted">{issue.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="w-6 bg-app-panel border-l border-app-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors hover:bg-app-hover"
            title="Expand Inspector Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Media Replacement Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-app-panel border border-app-border rounded-dialog max-w-2xl w-full h-[600px] shadow-2xl flex flex-col overflow-hidden">
            <MediaDrawer
              isReplacing={true}
              onClose={() => setShowReplaceModal(false)}
            />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Command Palette */}
      <CommandPalette isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};
