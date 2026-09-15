/**
 * Wave 67 leftover after tip/#324 — Contig dice-display flex leftover.
 * Soft gap 1rem existed; lock display flex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject dice-display flex', () => {
  it('pins contig-dice-display display flex leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-dice-display\s*\{[\s\S]*?display:\s*flex/
    );
  });
});
