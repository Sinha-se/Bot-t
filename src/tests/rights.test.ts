import { describe, it, expect } from 'vitest';
import { STOCK_RIGHTS_RECORDS } from '../data/stockLibrary';

describe('Source Rights Policy & Export Clearance Gates', () => {
  it('strictly blocks export for uncleared web references', () => {
    const webRefRights = STOCK_RIGHTS_RECORDS['rights_web_ref_news_delhi'];
    expect(webRefRights).toBeDefined();
    expect(webRefRights.classification).toBe('uncleared_unknown');
    expect(webRefRights.exportAllowed).toBe(false);
    expect(webRefRights.commercialUseAllowed).toBe('unknown');
  });

  it('permits export for commercial licensed assets with attribution', () => {
    const pexelsRights = STOCK_RIGHTS_RECORDS['rights_pexels_dawn_skyline'];
    expect(pexelsRights).toBeDefined();
    expect(pexelsRights.classification).toBe('commercial_license');
    expect(pexelsRights.exportAllowed).toBe(true);
    expect(pexelsRights.commercialUseAllowed).toBe(true);
    expect(pexelsRights.attributionRequired).toBe(true);
  });

  it('flags restricted archival assets requiring editorial clearance', () => {
    const archiveRights = STOCK_RIGHTS_RECORDS['rights_archive_delhi_1970'];
    expect(archiveRights).toBeDefined();
    expect(archiveRights.classification).toBe('editorial_license');
    expect(archiveRights.exportAllowed).toBe(false);
    expect(archiveRights.commercialUseAllowed).toBe(false);
  });
});
