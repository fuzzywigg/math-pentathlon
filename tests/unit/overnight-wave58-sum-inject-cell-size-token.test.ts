/**
 * Wave 58 Contig/SD residual — Sum inject 22px cell size token. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — inject cell size', () => {
  it('pins .sd-cell width/height 22px', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-cell');
    expect(css).toContain('width: 22px');
    expect(css).toContain('height: 22px');
  });
});
