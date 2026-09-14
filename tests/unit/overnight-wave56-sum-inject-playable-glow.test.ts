/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum playable glow CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject playable glow', () => {
  it('playable hand glow + hover lift leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-hand-domino-playable');
    expect(css).toContain('box-shadow: 0 0 0 2px #4caf50');
    expect(css).toContain('translateY(-2px)');
  });
});
