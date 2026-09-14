/**
 * Wave 58 leftover after #275 — Contig no-moves p orange inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject no-moves p color', () => {
  it('pins .contig-no-moves p #e65100 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-no-moves p');
    expect(css).toContain('#e65100');
  });
});
