/**
 * Wave 40 — Sum Dominoes isValidPlacement OOB / occupied matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 40 sum-dominoes — isValidPlacement OOB matrix', () => {
  it('negative row/col is false for both orientations', () => {
    const state = createInitialState();
    const domino = state.hands.player1[0];
    expect(
      isValidPlacement(state, domino, { row: -1, col: 0 }, 'horizontal', 7)
    ).toBe(false);
    expect(
      isValidPlacement(state, domino, { row: 0, col: -1 }, 'horizontal', 7)
    ).toBe(false);
    expect(
      isValidPlacement(state, domino, { row: -1, col: -1 }, 'vertical', 7)
    ).toBe(false);
  });

  it('vertical placement overflowing board edge is false', () => {
    const state = createInitialState();
    const domino = state.hands.player1[0];
    const edgeRow = CONFIG.BOARD_SIZE - 1;
    expect(
      isValidPlacement(
        state,
        domino,
        { row: edgeRow, col: 0 },
        'vertical',
        7
      )
    ).toBe(false);
  });

  it('horizontal placement overflowing board edge is false', () => {
    const state = createInitialState();
    const domino = state.hands.player1[0];
    const edgeCol = CONFIG.BOARD_SIZE - 1;
    expect(
      isValidPlacement(
        state,
        domino,
        { row: 0, col: edgeCol },
        'horizontal',
        7
      )
    ).toBe(false);
  });

  it('occupied cell is false', () => {
    const state = createInitialState();
    const domino = state.hands.player1[0];
    // Center starts occupied with the starter tile
    expect(
      isValidPlacement(
        state,
        domino,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'horizontal',
        7
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        domino,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'vertical',
        7
      )
    ).toBe(false);
  });
});
