/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla pit-last orange chrome.
 * Soft last-sown class elsewhere; lock #ed8936 stroke/filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style pit-last orange', () => {
  it('pins .calla-pit-last stroke #ed8936 + orange drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-last \.calla-pit-circle\s*\{[^}]*stroke:\s*#ed8936/
    );
    expect(css).toContain('drop-shadow(0 0 6px rgba(237, 137, 54, 0.5))');
  });
});
