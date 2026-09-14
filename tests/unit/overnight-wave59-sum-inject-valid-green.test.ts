/**
 * Wave 59 Contig/SD residual — Sum inject valid green token. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — inject valid green', () => {
  it('pins #4caf50 valid token', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-cell-valid');
    expect(css).toContain('#4caf50');
  });
});
