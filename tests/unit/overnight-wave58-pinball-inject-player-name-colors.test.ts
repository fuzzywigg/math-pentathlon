/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — player name colors', () => {
  it('includes exact player1/player2 name color leftovers', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain(
      '.pinball-player-score.player1 .pinball-player-name { color: #1565c0; }'
    );
    expect(css).toContain(
      '.pinball-player-score.player2 .pinball-player-name { color: #c62828; }'
    );
  });
});
