/**
 * Wave 59 Contig/SD residual — Sum horizontal domino 44px span. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — horizontal span', () => {
  it('pins .sd-domino-horizontal width 44px', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-domino-horizontal');
    expect(css).toContain('width: 44px');
  });
});
