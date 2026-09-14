/**
 * Wave 58 leftover after #275 — Contig board box-shadow inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject board shadow', () => {
  it('pins .contig-board box-shadow leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-board');
    expect(css).toContain('0 4px 12px');
  });
});
