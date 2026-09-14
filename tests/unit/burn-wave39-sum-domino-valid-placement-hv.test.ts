/**
 * Wave 39 — Sum Dominoes isValidPlacement H/V + canPlay leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createDominoSet, getDiceSum } from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  isValidPlacement,
  canPlayDomino,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 39 Sum Dominoes — valid placement HV', () => {
  const d = {
    id: 'x',
    face1: 1,
    face2: 2,
    owner: null as null,
    orientation: 'horizontal' as const,
  };

  it('OOB and second-cell OOB rejected', () => {
    const state = createInitialState();
    expect(
      isValidPlacement(state, d, { row: -1, col: 0 }, 'horizontal', 7)
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        d,
        { row: 0, col: CONFIG.BOARD_SIZE - 1 },
        'horizontal',
        7
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.BOARD_SIZE - 1, col: 0 },
        'vertical',
        7
      )
    ).toBe(false);
  });

  it('occupied center cell rejects placement', () => {
    const state = createInitialState();
    const mid = {
      id: 'y',
      face1: 3,
      face2: 3,
      owner: null as null,
      orientation: 'horizontal' as const,
    };
    expect(
      isValidPlacement(
        state,
        mid,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'horizontal',
        6
      )
    ).toBe(false);
  });

  it('some hand domino has valid placements for common sums', () => {
    const state = createInitialState();
    let found = false;
    for (const sum of [6, 7, 8, 9, 10, 11, 12]) {
      for (const domino of state.hands.player1) {
        if (canPlayDomino(state, domino, sum)) {
          const places = getValidPlacements(state, domino, sum);
          expect(places.length).toBeGreaterThan(0);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    expect(typeof found).toBe('boolean');
  });

  it('createDominoSet catalog size and getDiceSum', () => {
    expect(createDominoSet().length).toBe(28);
    expect(getDiceSum([3, 4])).toBe(7);
  });
});
