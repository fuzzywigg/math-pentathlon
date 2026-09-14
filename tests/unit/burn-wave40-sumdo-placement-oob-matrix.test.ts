/**
 * Wave 40 — Sum Dominoes placement OOB matrix.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino } from '../../src/games/sum-dominoes/types';

const domino: Domino = {
  id: 'd1',
  face1: 3,
  face2: 4,
  owner: null,
  orientation: 'horizontal',
};

describe('Wave 40 sum-dominoes — placement OOB', () => {
  it('rejects negative and beyond BOARD_SIZE', () => {
    const state = createInitialState();
    const sum = 7;
    expect(
      isValidPlacement(state, domino, { row: -1, col: 0 }, 'horizontal', sum)
    ).toBe(false);
    expect(
      isValidPlacement(state, domino, { row: 0, col: -1 }, 'horizontal', sum)
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        domino,
        { row: CONFIG.BOARD_SIZE, col: 0 },
        'horizontal',
        sum
      )
    ).toBe(false);
  });

  it('rejects horizontal/vertical overflow at edge', () => {
    const state = createInitialState();
    const edge = CONFIG.BOARD_SIZE - 1;
    expect(
      isValidPlacement(
        state,
        domino,
        { row: 0, col: edge },
        'horizontal',
        7
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        domino,
        { row: edge, col: 0 },
        'vertical',
        7
      )
    ).toBe(false);
  });

  it('rejects occupied primary cell', () => {
    const state = createInitialState();
    const board = state.board.map((row) => [...row]);
    board[0][0] = {
      domino: { ...domino, id: 'placed', owner: 'player1', orientation: 'horizontal' },
      position: { row: 0, col: 0 },
      orientation: 'horizontal',
    };
    const occupied = { ...state, board };
    expect(
      isValidPlacement(occupied, domino, { row: 0, col: 0 }, 'horizontal', 7)
    ).toBe(false);
  });
});
