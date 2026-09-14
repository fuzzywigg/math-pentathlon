/**
 * Wave 63 Contig/SD residual after tip #301 — Sum selected !important leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject selected important', () => {
  it('pins !important on selected box-shadow leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?box-shadow:[^;]*!important/
    );
  });
});
