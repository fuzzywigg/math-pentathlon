/**
 * Wave 58 Contig/SD residual — Contig media-query die shrink tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — media die shrink', () => {
  it('pins 50px / 32px die tokens inside max-width 600px', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('width: 50px');
    expect(css).toContain('height: 50px');
    expect(css).toContain('font-size: 32px');
  });
});
