/**
 * Wave 57 leftover after #267 — Sum inject hand + vertical CSS.
 * Distinct from wave56 valid-cursor CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — inject hand/vertical CSS', () => {
  beforeEach(() => {
    document.getElementById('sd-styles')?.remove();
  });

  it('embeds hand player borders and .sd-domino-vertical', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand-player1/);
    expect(css).toMatch(/\.sd-hand-player2/);
    expect(css).toMatch(/\.sd-domino-vertical/);
    expect(css).toMatch(/--color-player/);
  });
});
