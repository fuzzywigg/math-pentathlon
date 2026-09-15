/**
 * Wave 66 leftover after tip/#316 — Calla last-pit orange stroke.
 * Soft last-move chrome existed; lock #ed8936 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style pit last stroke', () => {
  it('last pit circle strokes #ed8936 width 3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-last \.calla-pit-circle\s*\{[^}]*stroke:\s*#ed8936/s
    );
    expect(css).toMatch(
      /\.calla-pit-last \.calla-pit-circle\s*\{[^}]*stroke-width:\s*3/s
    );
  });
});
