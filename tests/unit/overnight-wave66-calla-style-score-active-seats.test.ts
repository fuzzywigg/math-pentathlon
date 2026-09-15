/**
 * Wave 66 leftover after tip/#316 — Calla score-active seat gradients.
 * Soft .active class existed; lock P1/P2 gradient leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style score active seats', () => {
  it('active P1/P2 scores use blue/red gradients', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)');
    expect(css).toContain('linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)');
    expect(css).toMatch(/\.calla-score\.active\s*\{[^}]*transform:\s*scale\(1\.02\)/s);
  });
});
