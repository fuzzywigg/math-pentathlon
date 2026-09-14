/**
 * Wave 54 leftover after #240 — Pinball score seat names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — score names', () => {
  it('labels seats Blue / Red', () => {
    const el = renderScores(createInitialState());
    expect(
      el.querySelector('.pinball-player-score.player1 .pinball-player-name')
        ?.textContent
    ).toBe('Blue');
    expect(
      el.querySelector('.pinball-player-score.player2 .pinball-player-name')
        ?.textContent
    ).toBe('Red');
  });
});
