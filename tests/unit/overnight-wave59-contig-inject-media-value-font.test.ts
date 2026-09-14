/**
 * Wave 59 Contig/SD residual — Contig media cell-value font-size. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — media value font', () => {
  it('pins font-size 12px for .contig-cell-value in media query', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('.contig-cell-value');
    expect(css).toContain('font-size: 12px');
  });
});
