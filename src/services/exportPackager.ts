import {
  Project,
  TranscriptSegment,
  TimelineTrack,
  TimelineItem,
  Asset,
  RightsRecord,
} from '../types';

export function formatTimecodeSRT(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

export function formatTimecodeVTT(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

export function generateSRT(segments: TranscriptSegment[]): string {
  return segments
    .map((seg, idx) => {
      const index = idx + 1;
      const start = formatTimecodeSRT(seg.startMs);
      const end = formatTimecodeSRT(seg.endMs);
      return `${index}\n${start} --> ${end}\n${seg.text}\n`;
    })
    .join('\n');
}

export function generateVTT(segments: TranscriptSegment[]): string {
  const header = 'WEBVTT - Exported by Framecraft Audio-First Studio\n\n';
  const body = segments
    .map((seg, idx) => {
      const index = idx + 1;
      const start = formatTimecodeVTT(seg.startMs);
      const end = formatTimecodeVTT(seg.endMs);
      return `${index}\n${start} --> ${end}\n${seg.text}\n`;
    })
    .join('\n');
  return header + body;
}

export function generatePlainTranscript(segments: TranscriptSegment[], project: Project): string {
  const header = `FRAMECRAFT PRODUCTION TRANSCRIPT\nProject: ${project.title}\nLanguage: ${project.language}\nGenerated: ${new Date().toISOString()}\n----------------------------------------\n\n`;
  const body = segments
    .map((seg) => {
      const startSec = (seg.startMs / 1000).toFixed(1);
      const endSec = (seg.endMs / 1000).toFixed(1);
      return `[${startSec}s - ${endSec}s] ${seg.speakerId}: ${seg.text}`;
    })
    .join('\n\n');
  return header + body;
}

export function generateAttributionReportMarkdown(
  project: Project,
  timelineItems: TimelineItem[],
  assets: Asset[],
  rights: Record<string, RightsRecord>
): string {
  const date = new Date().toISOString().split('T')[0];
  let md = `# Source Provenance & Rights Attribution Report\n\n`;
  md += `**Project:** ${project.title}  \n`;
  md += `**Project ID:** \`${project.id}\`  \n`;
  md += `**Report Generated:** ${date}  \n`;
  md += `**Timeline Revision:** \`${project.timelineRevisionId}\`  \n\n`;

  md += `### Legal Compliance Statement\n`;
  md += `This document lists all media assets placed on the project timeline, their verified source provider, license classification, and mandatory credit requirements.\n\n`;

  md += `| Asset Name | Provider | Creator | Rights Classification | Commercial Use | Mandatory Attribution | Verification State |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  timelineItems.forEach((item) => {
    if (!item.assetId) return;
    const asset = assets.find((a) => a.id === item.assetId);
    if (!asset) return;
    const right = rights[asset.rightsRecordId] || {
      classification: 'uncleared_unknown',
      commercialUseAllowed: 'unknown',
      attributionText: 'None recorded',
      exportAllowed: false,
    };

    const commStatus =
      right.commercialUseAllowed === true
        ? 'Cleared'
        : right.commercialUseAllowed === false
        ? 'RESTRICTED'
        : 'UNKNOWN';

    const verifyState = right.exportAllowed ? 'Cleared for Export' : 'ACTION REQUIRED (Blocked)';

    md += `| **${asset.title}** | ${asset.provider.toUpperCase()} | ${asset.creatorName} | \`${right.classification}\` | ${commStatus} | ${right.attributionText} | **${verifyState}** |\n`;
  });

  md += `\n\n---\n*Report generated automatically by Framecraft Studio.*`;
  return md;
}

export function generateAttributionReportCsv(
  project: Project,
  timelineItems: TimelineItem[],
  assets: Asset[],
  rights: Record<string, RightsRecord>
): string {
  const headers = [
    'Asset ID',
    'Asset Title',
    'Provider',
    'Creator',
    'Rights Classification',
    'Commercial Use Allowed',
    'Export Allowed',
    'Mandatory Attribution Text',
    'Source URL',
  ];

  const rows = timelineItems
    .filter((item) => !!item.assetId)
    .map((item) => {
      const asset = assets.find((a) => a.id === item.assetId);
      if (!asset) return null;
      const right = rights[asset.rightsRecordId] || {
        classification: 'uncleared_unknown',
        commercialUseAllowed: 'unknown',
        exportAllowed: false,
        attributionText: 'Unverified',
      };
      return [
        `"${asset.id}"`,
        `"${asset.title.replace(/"/g, '""')}"`,
        `"${asset.provider}"`,
        `"${asset.creatorName.replace(/"/g, '""')}"`,
        `"${right.classification}"`,
        `"${right.commercialUseAllowed}"`,
        `"${right.exportAllowed}"`,
        `"${right.attributionText.replace(/"/g, '""')}"`,
        `"${asset.sourcePageUrl}"`,
      ].join(',');
    })
    .filter(Boolean);

  return [headers.join(','), ...rows].join('\n');
}

export function downloadFile(content: string | Blob, filename: string, mimeType = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
