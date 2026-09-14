/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball final-score border vars.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — final border vars', () => {
  it('final-score p1 border uses player1 var leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain(
      '.pinball-final-score.player1 { border-top: 4px solid var(--color-player1, #2196F3); }'
    );
  });
});
