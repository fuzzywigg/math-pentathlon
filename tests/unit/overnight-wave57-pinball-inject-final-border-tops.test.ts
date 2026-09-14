/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball final-score border tops.
 * Final names/pts/hits covered; border CSS not. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — final border tops', () => {
  it('player1/2 final scores keep seat border-top leftovers', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain(
      '.pinball-final-score.player1 { border-top: 4px solid var(--color-player1, #2196F3); }'
    );
    expect(css).toContain(
      '.pinball-final-score.player2 { border-top: 4px solid var(--color-player2, #e53935); }'
    );
  });
});
