/**
 * Wave 66 leftover after tip/#316 — Contig roll disabled opacity chrome.
 * Soft roll hover lift covered elsewhere; lock disabled leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style roll disabled opacity', () => {
  it('pins contig-roll-btn:disabled opacity 0.5 + not-allowed', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn:disabled\s*\{[\s\S]*?opacity:\s*0\.5/
    );
    expect(css).toMatch(
      /\.contig-roll-btn:disabled\s*\{[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
