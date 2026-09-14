/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum valid hover CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject valid hover', () => {
  it('valid cell light/hover greens leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-cell-valid');
    expect(css).toContain('#81c784');
    expect(css).toContain('.sd-cell-valid:hover');
    expect(css).toContain('#4caf50');
  });
});
