/**
 * Wave 54 leftover after #240 — Pinball game-over final names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — gameover names', () => {
  it('labels final seats Blue / Red', () => {
    const el = renderGameOver({ ...createInitialState(), winner: null });
    expect(
      el.querySelector('.pinball-final-score.player1 .pinball-final-name')
        ?.textContent
    ).toBe('Blue');
    expect(
      el.querySelector('.pinball-final-score.player2 .pinball-final-name')
        ?.textContent
    ).toBe('Red');
  });
});
