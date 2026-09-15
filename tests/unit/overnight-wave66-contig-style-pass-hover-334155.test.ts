/**
 * Wave 66 leftover after tip/#316 — Contig pass hover #334155 chrome.
 * Soft pass-btn class wiring existed; lock hover fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style pass hover 334155', () => {
  it('pins contig-pass-btn:hover background #334155', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-pass-btn:hover\s*\{[\s\S]*?background-color:\s*#334155/
    );
  });
});
