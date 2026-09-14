/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla store-active seat filters.
 * Soft store-active class elsewhere; lock P1/P2 drop-shadow leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style store-active seats', () => {
  it('pins P1/P2 store-active stroke + seat drop-shadow leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 8px rgba(66, 165, 245, 0.4))');
    expect(css).toContain('drop-shadow(0 0 8px rgba(239, 83, 80, 0.4))');
    expect(css).toMatch(
      /\.calla-store-p1\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke:\s*#42a5f5/
    );
    expect(css).toMatch(
      /\.calla-store-p2\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke:\s*#ef5350/
    );
  });
});
