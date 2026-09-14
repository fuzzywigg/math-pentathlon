/**
 * Wave 40 — Sum Dominoes placement OOB / phase / select rejects.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  doRollDice,
  selectDomino,
  placeDomino,
  isValidPlacement,
  canPlayDomino,
  passTurn,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import type { Domino } from '../../src/games/sum-dominoes/types';

describe('Wave 40 sum-dominoes — placement OOB rejects', () => {
  it('doRollDice / selectDomino identity outside phase', () => {
    const state = createInitialState();
    const placing = {
      ...state,
      phase: 'placing' as const,
      currentDice: [3, 4] as [number, number],
    };
    expect(doRollDice(placing)).toBe(placing);
    expect(selectDomino(state, 'x')).toBe(state);
  });

  it('isValidPlacement false for OOB and edge overflow', () => {
    const state = createInitialState();
    const domino: Domino = {
      id: 'd',
      face1: 1,
      face2: 2,
      orientation: 'horizontal',
    };
    expect(
      isValidPlacement(state, domino, { row: -1, col: 0 }, 'horizontal', 7)
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        domino,
        { row: 0, col: CONFIG.BOARD_SIZE - 1 },
        'horizontal',
        7
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        domino,
        { row: CONFIG.BOARD_SIZE - 1, col: 0 },
        'vertical',
        7
      )
    ).toBe(false);
  });

  it('selectDomino rejects unplayable / ghost; placeDomino needs selection', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [2, 3] as [number, number],
    };
    expect(selectDomino(state, '__ghost__')).toBe(state);
    expect(placeDomino(state, { row: 0, col: 0 }, 'horizontal')).toBe(state);

    const hand = state.hands.player1;
    if (hand.length > 0) {
      const sum = 5;
      const playable = hand.find((d) => canPlayDomino(state, d, sum));
      if (!playable) {
        expect(selectDomino(state, hand[0].id)).toBe(state);
      }
    }
  });

  it('passTurn identity outside passing / gameOver', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
    const over = { ...state, phase: 'gameOver' as const };
    expect(passTurn(over)).toBe(over);
  });
});
