/**
 * Wave 54 leftover after #240 — Pinball opening ball icons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';
import { seatIcon } from '../../src/ui/player-colors';

describe('Wave 54 pinball — opening balls', () => {
  it('repeats seatIcon INITIAL_BALLS times per seat', () => {
    const el = renderScores(createInitialState());
    const p1 = el.querySelector(
      '.pinball-player-score.player1 .pinball-balls'
    )?.textContent;
    const p2 = el.querySelector(
      '.pinball-player-score.player2 .pinball-balls'
    )?.textContent;
    expect(p1).toBe(seatIcon('player1').repeat(INITIAL_BALLS));
    expect(p2).toBe(seatIcon('player2').repeat(INITIAL_BALLS));
  });
});
