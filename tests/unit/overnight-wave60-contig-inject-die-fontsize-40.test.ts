/**
 * Wave 60 leftover after #282 — Contig die font-size 40px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject die font-size 40', () => {
  it('pins base die font-size leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?font-size:\s*40px/);
  });
});
