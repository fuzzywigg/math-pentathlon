/**
 * Wave 42 — Queens & Guards createBoard / createInitialState leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createInitialState,
  CONFIG,
  cellsInRing,
  cellKey,
} from '../../src/games/queens-guards/types';

describe('Wave 42 queens — createBoard / createInitialState', () => {
  it('NUM_RINGS is 6 and total cell count sums rings 0..5', () => {
    expect(CONFIG.NUM_RINGS).toBe(6);
    const board = createBoard();
    let expected = 0;
    for (let ring = 0; ring < CONFIG.NUM_RINGS; ring++) {
      expected += cellsInRing(ring);
    }
    expect(board.size).toBe(expected);
    expect(board.size).toBe(91);
  });

  it('both queens start on the outer ring', () => {
    const board = createBoard();
    const outer = CONFIG.NUM_RINGS - 1;
    const queens: { ring: number; player: string }[] = [];
    for (const cell of board.values()) {
      if (cell.piece?.type === 'queen') {
        queens.push({ ring: cell.ring, player: cell.piece.player });
      }
    }
    expect(queens).toHaveLength(2);
    expect(queens.every((q) => q.ring === outer)).toBe(true);
    expect(queens.map((q) => q.player).sort()).toEqual(['player1', 'player2']);
  });

  it('each player has six guards on the outer ring', () => {
    const board = createBoard();
    const outer = CONFIG.NUM_RINGS - 1;
    for (const player of ['player1', 'player2'] as const) {
      let guards = 0;
      for (const cell of board.values()) {
        if (
          cell.ring === outer &&
          cell.piece?.player === player &&
          cell.piece.type === 'guard'
        ) {
          guards++;
        }
      }
      expect(guards).toBe(CONFIG.GUARDS_PER_PLAYER);
    }
  });

  it('createInitialState wires board, player1 seat, empty captures/history', () => {
    const state = createInitialState();
    expect(state.cells.size).toBe(91);
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedPiece).toBeNull();
    expect(state.capturedPieces).toEqual([]);
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.cells.get(cellKey(outerPos(), 7))?.piece?.type).toBe('queen');
  });
});

function outerPos(): number {
  return CONFIG.NUM_RINGS - 1;
}
