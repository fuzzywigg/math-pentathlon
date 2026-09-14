/**
 * Wave 57 leftover after #267 — Sum hand seat border CSS vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — inject hand seat borders', () => {
  it('pins hand player1/player2 CSS var borders', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-hand-player1');
    expect(css).toContain('.sd-hand-player2');
    expect(css).toContain('var(--color-player1, #2196f3)');
    expect(css).toContain('var(--color-player2, #f44336)');
  });
});
