/**
 * Wave 57 leftover after #267 — Contig no-moves inject chrome colors. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject no-moves chrome', () => {
  it('pins #fff3e0 / #e65100 no-moves tokens', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-no-moves');
    expect(css).toContain('#fff3e0');
    expect(css).toContain('#e65100');
  });
});
