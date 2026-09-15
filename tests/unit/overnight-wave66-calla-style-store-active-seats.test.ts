/**
 * Wave 66 leftover after tip/#316 — Calla store-active seat strokes.
 * Soft store-active class existed; lock P1/P2 stroke leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style store active seats', () => {
  it('active stores stroke #42a5f5 / #ef5350 by seat', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-store-p1\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke:\s*#42a5f5/s
    );
    expect(css).toMatch(
      /\.calla-store-p2\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke:\s*#ef5350/s
    );
  });
});
