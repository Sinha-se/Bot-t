import { GraphicsTemplate } from '../types';

export const GRAPHICS_TEMPLATES: GraphicsTemplate[] = [
  // Titles
  {
    id: 'tmpl_title_cinematic',
    name: 'Cinematic Opening Title',
    category: 'title',
    previewText: 'BEFORE THE CITY WAKES',
    defaultDurationFrames: 120, // 4 sec at 30fps
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_title_chapter',
    name: 'Chapter Card',
    category: 'chapter',
    previewText: 'PART 01 // THE FIRST LIGHT',
    defaultDurationFrames: 90,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_title_section_divider',
    name: 'Section Divider',
    category: 'title',
    previewText: 'THE LOGISTICS OF DAWN',
    defaultDurationFrames: 75,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_title_end_card',
    name: 'Closing Credits Card',
    category: 'title',
    previewText: 'FRAMECRAFT PRODUCTIONS',
    defaultDurationFrames: 150,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },

  // Lower Thirds
  {
    id: 'tmpl_lt_minimal_doc',
    name: 'Minimal Documentary Lower Third',
    category: 'lower_third',
    previewText: 'Central Railway Station • 04:45 AM',
    defaultDurationFrames: 120,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_lt_speaker_id',
    name: 'Speaker Identification',
    category: 'lower_third',
    previewText: 'Dr. Anita Roy | Urban Logistics Researcher',
    defaultDurationFrames: 150,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_lt_location_date',
    name: 'Location & Timestamp Badge',
    category: 'lower_third',
    previewText: 'Old Delhi Market • November 2024',
    defaultDurationFrames: 120,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_lt_source_credit',
    name: 'Source Attribution Credit',
    category: 'source_credit',
    previewText: 'Archival Collection: National Film Archive',
    defaultDurationFrames: 150,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_lt_two_line_editorial',
    name: 'Two-Line Editorial Banner',
    category: 'lower_third',
    previewText: 'TRANSIT CORRIDOR • Early Morning Inflow',
    defaultDurationFrames: 120,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },

  // Quotes & Callouts
  {
    id: 'tmpl_quote_cinematic',
    name: 'Narrative Quote Card',
    category: 'quote',
    previewText: '“Up close, it is a sequence of small decisions.”',
    defaultDurationFrames: 150,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
  {
    id: 'tmpl_statistic_callout',
    name: 'Data & Metric Callout',
    category: 'statistic',
    previewText: '4.2M Commuters • Before 06:00 AM',
    defaultDurationFrames: 120,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:5'],
  },
];
