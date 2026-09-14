/**
 * Wave 60 leftover after #282 — Contig media die font-size 32. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject media die font-size 32', () => {
  it('pins media die font-size leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?font-size:\s*32px/);
  });
});
