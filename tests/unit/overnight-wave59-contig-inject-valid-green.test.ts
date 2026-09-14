/**
 * Wave 59 Contig/SD residual — Contig inject valid green token. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — inject valid green', () => {
  it('pins #4caf50 valid move token', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-valid');
    expect(css).toContain('#4caf50');
  });
});
