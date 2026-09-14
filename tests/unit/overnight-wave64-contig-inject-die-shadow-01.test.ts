/**
 * Wave 64 leftover after tip/#303 — Contig die shadow rgba 0.1.
 * Board shadow 0.15 covered elsewhere; deepen die 0.1. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject die shadow 01', () => {
  it('pins die box-shadow rgba(0,0,0,0.1) leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-die\s*\{[\s\S]*?box-shadow:\s*0 4px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
