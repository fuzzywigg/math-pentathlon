/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — player name color vars', () => {
  it('includes player1/player2 name color var leftovers', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain(
      '.frac-player-name.player1 { color: var(--color-player1, #1565c0); }'
    );
    expect(css).toContain(
      '.frac-player-name.player2 { color: var(--color-player2, #c62828); }'
    );
  });
});
