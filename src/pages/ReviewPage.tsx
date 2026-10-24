import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Header } from '../components/common/Header';
import { DemoBanner } from '../components/common/DemoBanner';
import {
  generateAttributionReportMarkdown,
  generateAttributionReportCsv,
  downloadFile,
} from '../services/exportPackager';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    project,
    issues,
    resolveIssue,
    assets,
    rights,
    timelineItems,
    setCurrentTimeMs,
  } = useProject();

  const [filterLevel, setFilterLevel] = useState<'all' | 'blocker' | 'warning' | 'info'>('all');

  const filteredIssues = issues.filter((iss) => {
    if (filterLevel !== 'all' && iss.level !== filterLevel) return false;
    return true;
  });

  const activeIssues = issues.filter((i) => !i.resolved);
  const blockerCount = activeIssues.filter((i) => i.level === 'blocker').length;
  const warningCount = activeIssues.filter((i) => i.level === 'warning').length;

  const handleExportAttributionReport = () => {
    const md = generateAttributionReportMarkdown(project, timelineItems, assets, rights);
    downloadFile(md, `${project.title}_attribution_report.md`, 'text/markdown');
  };

  const handleExportAttributionCsv = () => {
    const csv = generateAttributionReportCsv(project, timelineItems, assets, rights);
    downloadFile(csv, `${project.title}_attribution_report.csv`, 'text/csv');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col">
      <DemoBanner />
      <Header />

      {/* Subheader */}
      <div className="h-10 bg-app-panel border-b border-app-border px-6 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-2">
          <Link to={`/app/projects/${project.id}/editor`} className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Editor</span>
          </Link>
          <span className="text-app-border">/</span>
          <span className="text-text-primary font-medium">{project.title}</span>
          <span className="text-app-border">/</span>
          <span className="text-accent font-semibold">Quality & Source Review</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAttributionReport}
            className="px-3 py-1 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Attribution Report (.MD)</span>
          </button>

          <Link
            to={`/app/projects/${project.id}/export`}
            className={`px-4 py-1.5 rounded-editor font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              blockerCount > 0
                ? 'bg-status-error/30 text-white cursor-not-allowed opacity-60'
                : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
            }`}
          >
            <span>Proceed to Export</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8 overflow-y-auto">
        {/* Review Status Banner */}
        <div
          className={`p-5 rounded-dialog border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            blockerCount > 0
              ? 'bg-status-error/10 border-status-error/30 text-status-error'
              : warningCount > 0
              ? 'bg-status-warning/10 border-status-warning/30 text-status-warning'
              : 'bg-status-success/10 border-status-success/30 text-status-success'
          }`}
        >
          <div className="flex items-center gap-3">
            {blockerCount > 0 ? (
              <ShieldAlert className="w-6 h-6 shrink-0" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-6 h-6 shrink-0" />
            ) : (
              <ShieldCheck className="w-6 h-6 shrink-0" />
            )}
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {blockerCount > 0
                  ? `${blockerCount} Export Blocker Detected`
                  : warningCount > 0
                  ? `${warningCount} Quality Warning(s) Need Review`
                  : 'All Preflight Checks Passed'}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {blockerCount > 0
                  ? 'Assets with uncleared web licenses cannot be rendered into distribution files.'
                  : 'Timeline integrity, caption safe zones, and rights evidence are cleared.'}
              </p>
            </div>
          </div>

          {blockerCount > 0 && (
            <span className="px-3 py-1 rounded bg-status-error/20 text-status-error font-mono text-xs font-bold shrink-0">
              Export Locked
            </span>
          )}
        </div>

        {/* Section 1: Issues List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-text-muted tracking-wider">
              Quality & Rights Findings ({issues.length})
            </h3>

            {/* Filter buttons */}
            <div className="flex gap-1 text-xs">
              {(['all', 'blocker', 'warning', 'info'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    filterLevel === lvl
                      ? 'bg-accent text-white'
                      : 'bg-app-panel text-text-muted hover:text-text-primary border border-app-border'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const asset = assets.find((a) => a.id === issue.assetId);

              return (
                <div
                  key={issue.id}
                  className={`p-4 rounded-dialog border bg-app-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    issue.resolved
                      ? 'opacity-60 border-app-border bg-app-panel/40'
                      : issue.level === 'blocker'
                      ? 'border-status-error/40'
                      : 'border-status-warning/40'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          issue.level === 'blocker'
                            ? 'bg-status-error/20 text-status-error'
                            : issue.level === 'warning'
                            ? 'bg-status-warning/20 text-status-warning'
                            : 'bg-status-info/20 text-status-info'
                        }`}
                      >
                        {issue.level}
                      </span>
                      <span className="font-semibold text-sm text-text-primary">
                        {issue.title}
                      </span>
                      {issue.timeRange && (
                        <span className="text-[11px] font-mono text-text-muted">
                          @ {(issue.timeRange.startMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="text-[11px] text-text-muted">
                      <strong className="text-text-primary">Suggested Fix:</strong> {issue.suggestedFix}
                    </div>

                    {issue.resolved && issue.resolutionNote && (
                      <div className="text-[11px] text-status-success flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved: {issue.resolutionNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {issue.timeRange && (
                      <button
                        onClick={() => {
                          setCurrentTimeMs(issue.timeRange!.startMs);
                          navigate(`/app/projects/${project.id}/editor`);
                        }}
                        className="px-3 py-1.5 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        <span>Jump to Clip</span>
                      </button>
                    )}

                    {!issue.resolved && (
                      <button
                        onClick={() => resolveIssue(issue.id)}
                        className="px-3 py-1.5 rounded bg-status-success/20 hover:bg-status-success/30 border border-status-success/40 text-status-success text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Issue</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Full Source Provenance Report Table */}
        <section className="space-y-4 pt-4 border-t border-app-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-accent" />
                <span>Source Provenance & Attribution Report</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Table of all media clips placed on the timeline with their verified rights classifications.
              </p>
            </div>

            <button
              onClick={handleExportAttributionCsv}
              className="px-3 py-1.5 rounded bg-app-elevated hover:bg-app-hover border border-app-border text-xs text-text-primary font-medium flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-app-panel border border-app-border rounded-dialog overflow-x-auto shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-app-elevated/70 border-b border-app-border text-[11px] font-mono text-text-muted">
                  <th className="p-3">Asset Title</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Creator</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Commercial Use</th>
                  <th className="p-3">Export Eligibility</th>
                  <th className="p-3">Mandatory Attribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-text-secondary">
                {timelineItems
                  .filter((item) => !!item.assetId)
                  .map((item) => {
                    const asset = assets.find((a) => a.id === item.assetId);
                    if (!asset) return null;
                    const right = rights[asset.rightsRecordId];
                    const isExportAllowed = right?.exportAllowed;

                    return (
                      <tr key={item.id} className="hover:bg-app-hover/40 transition-colors">
                        <td className="p-3 font-semibold text-text-primary max-w-[200px] truncate">
                          {asset.title}
                        </td>
                        <td className="p-3 uppercase font-mono text-[11px]">{asset.provider}</td>
                        <td className="p-3">{asset.creatorName}</td>
                        <td className="p-3 font-mono text-[10px] text-accent">
                          {right?.classification || 'uncleared'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-semibold ${
                              right?.commercialUseAllowed === true
                                ? 'text-status-success'
                                : right?.commercialUseAllowed === false
                                ? 'text-status-error'
                                : 'text-status-warning'
                            }`}
                          >
                            {right?.commercialUseAllowed === true
                              ? 'Cleared'
                              : right?.commercialUseAllowed === false
                              ? 'Restricted'
                              : 'Unknown'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isExportAllowed
                                ? 'bg-status-success/20 text-status-success'
                                : 'bg-status-error/20 text-status-error'
                            }`}
                          >
                            {isExportAllowed ? 'Cleared' : 'Blocked'}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-text-muted italic max-w-[240px] truncate">
                          {right?.attributionText}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
