/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla pit-valid hover chrome.
 * Soft pulse elsewhere; lock hover fill/scale/filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style pit-valid hover', () => {
  it('pins valid:hover fill #6a4a32 scale 1.05 filter leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*fill:\s*#6a4a32/
    );
    expect(css).toMatch(
      /\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*transform:\s*scale\(1\.05\)/
    );
    expect(css).toContain('drop-shadow(0 0 12px rgba(72, 187, 120, 0.7))');
  });
});
