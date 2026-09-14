/**
 * Wave 60 leftover after #282 — Contig media cell-value 12px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject media cell-value 12', () => {
  it('pins media font-size leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?font-size:\s*12px/);
  });
});
