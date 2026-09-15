/**
 * Wave 67 leftover after tip/#316 — Contig focus outline-offset chrome.
 * Soft pass hover existed; lock focus-visible outline-offset 2px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style focus outline offset', () => {
  it('pins contig roll/pass focus-visible outline-offset 2px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
    expect(css).toMatch(
      /\.contig-pass-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
  });
});
