/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — final border tops', () => {
  it('includes exact player1/player2 border-top leftovers', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain(
      '.frac-final-score.player1 { border-top: 4px solid var(--color-player1, #2196F3); }'
    );
    expect(css).toContain(
      '.frac-final-score.player2 { border-top: 4px solid var(--color-player2, #e53935); }'
    );
  });
});
