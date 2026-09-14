/**
 * Wave 63 Contig/SD residual after tip #301 — Contig die 3px border leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject die border 3px', () => {
  it('pins 3px orange border and shadow rgba leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?border:\s*3px solid #f57c00/);
    expect(css).toMatch(
      /\.contig-die\s*\{[\s\S]*?box-shadow:\s*0 4px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
