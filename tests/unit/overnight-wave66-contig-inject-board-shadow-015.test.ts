/**
 * Wave 66 leftover after tip/#316 — Contig board box-shadow 0.15.
 * Soft board flex/gap/pad existed; lock rgba(0,0,0,0.15) leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject board shadow 0.15', () => {
  it('pins board box-shadow rgba(0,0,0,0.15) leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-board\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.15\)/
    );
  });
});
