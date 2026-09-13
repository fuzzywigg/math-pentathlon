import { describe, it, expect } from 'vitest';
import {
  INITIAL_BANK,
  BLOCK_SIZES,
  createInitialState,
  getOpponent,
  getCellAt,
  isValidPosition,
  getAvailableShapes,
  getShapeCells,
} from '../../src/games/hex-a-gone/types';

describe('Hex-a-Gone – types helpers', () => {
  it('INITIAL_BANK totals and block sizes are positive', () => {
    const total = Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0);
    expect(total).toBe(3 + 6 + 6 + 12 + 6);
    expect(BLOCK_SIZES.hexagon).toBe(6);
    expect(BLOCK_SIZES.triangle).toBe(1);
  });

  it('createInitialState builds a hex board and full bank', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player1');
    expect(state.board.length).toBeGreaterThan(0);
    expect(state.bank).toEqual(INITIAL_BANK);
    expect(state.turnSelection.blocks).toHaveLength(0);
    expect(getOpponent('player1')).toBe('player2');
  });

  it('isValidPosition / getCellAt for center and far cells', () => {
    const state = createInitialState();
    expect(isValidPosition(state, 0, 0)).toBe(true);
    expect(getCellAt(state, 0, 0)?.filled).toBe(false);
    expect(isValidPosition(state, 99, 99)).toBe(false);
    expect(getCellAt(state, 99, 99)).toBeUndefined();
  });

  it('getAvailableShapes excludes selected and zero-bank shapes', () => {
    const state = createInitialState();
    const all = getAvailableShapes(state);
    expect(all).toEqual([
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ]);

    const withSelected = {
      ...state,
      turnSelection: { blocks: ['triangle' as const], committed: false },
    };
    expect(getAvailableShapes(withSelected)).not.toContain('triangle');

    const emptyBank = {
      ...state,
      bank: { ...state.bank, hexagon: 0 },
    };
    expect(getAvailableShapes(emptyBank)).not.toContain('hexagon');
  });

  it('getShapeCells returns anchor-only footprints (current simplified shapes)', () => {
    for (const shape of [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ] as const) {
      expect(getShapeCells(shape, 1, -2, 0)).toEqual([{ q: 1, r: -2 }]);
    }
  });
});
