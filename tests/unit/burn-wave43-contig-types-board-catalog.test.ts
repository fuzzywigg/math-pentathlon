/**
 * Wave 43 TOKENMAXX — Contig-60 board/CONFIG catalog leftovers (non-AI). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  BOARD_NUMBERS,
  createBoard,
  createInitialState,
  getOpponent,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';

describe('Wave 43 contig — types/board catalog', () => {
  it('CONFIG and unique 60-cell board', () => {
    expect(CONFIG.GRID_ROWS).toBe(6);
    expect(CONFIG.GRID_COLS).toBe(10);
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBe(3);
    expect(CONFIG.WIN_BY_ALIGNMENT).toBe(5);
    const flat = BOARD_NUMBERS.flat();
    expect(flat).toHaveLength(60);
    expect(new Set(flat).size).toBe(60);
    const { cells, grid } = createBoard();
    expect(cells.size).toBe(60);
    expect(grid).toHaveLength(6);
    expect(grid[0]).toHaveLength(10);
  });

  it('opening state + adjacency corner vs interior', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
    expect(getOpponent('player1')).toBe('player2');
    expect(getAdjacentPositions(0, 0).length).toBe(3);
    expect(getAdjacentPositions(2, 2).length).toBe(8);
  });
});
