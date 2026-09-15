/**
 * Wave 66 leftover after tip/#316 — Calla valid-pit hover scale/fill.
 * Soft pulse existed; lock hover #6a4a32 + scale leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style pit hover scale', () => {
  it('valid hover fills #6a4a32 and scales 1.05', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*fill:\s*#6a4a32/s
    );
    expect(css).toMatch(
      /\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*transform:\s*scale\(1\.05\)/s
    );
  });
});
