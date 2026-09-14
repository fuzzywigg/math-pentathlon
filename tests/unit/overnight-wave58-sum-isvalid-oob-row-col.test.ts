/**
 * Wave 58 Contig/SD residual — Sum isValidPlacement raw OOB row/col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — isValid OOB', () => {
  it('rejects row -1 and row >= BOARD_SIZE', () => {
    const state = createInitialState();
    const d = state.hands.player1[0]!;
    expect(
      isValidPlacement(state, d, { row: -1, col: 5 }, 'horizontal', 7)
    ).toBe(false);
    expect(
      isValidPlacement(state, d, { row: 11, col: 0 }, 'vertical', 7)
    ).toBe(false);
    expect(
      isValidPlacement(state, d, { row: 5, col: 11 }, 'horizontal', 7)
    ).toBe(false);
  });
});
