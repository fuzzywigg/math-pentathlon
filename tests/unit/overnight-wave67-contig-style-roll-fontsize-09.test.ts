/**
 * Wave 67 leftover after tip/#324 — Contig roll font-size 0.9rem chrome.
 * Soft weight 600 / pad existed; lock font-size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style roll fontsize 0.9', () => {
  it('pins contig-roll-btn font-size 0.9rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn\s*\{[\s\S]*?font-size:\s*0\.9rem/
    );
  });
});
