/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball seat name colors.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — player name colors', () => {
  it('p1 name #1565c0 and p2 name #c62828 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain(
      '.pinball-player-score.player1 .pinball-player-name { color: #1565c0; }'
    );
    expect(css).toContain('#c62828');
  });
});
