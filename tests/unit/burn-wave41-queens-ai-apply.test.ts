/**
 * Wave 41 — Queens & Guards AI getAIMove / applyAIMove leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  CONFIG,
  type QueensGuardsState,
  type BoardCoord,
  type Piece,
} from '../../src/games/queens-guards/types';
import { makeMove, getValidMoves } from '../../src/games/queens-guards/rules';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';

function sparseBoard(): QueensGuardsState {
  const state = createInitialState();
  const cells = new Map(state.cells);
  for (const [k, c] of cells) {
    cells.set(k, { ...c, piece: null });
  }
  const pieces: Array<{ coord: BoardCoord; piece: Piece }> = [
    {
      coord: { ring: 3, position: 0 },
      piece: { id: 'p1q', player: 'player1', type: 'queen' },
    },
    {
      coord: { ring: 3, position: 2 },
      piece: { id: 'p1g', player: 'player1', type: 'guard' },
    },
    {
      coord: { ring: 4, position: 10 },
      piece: { id: 'p2q', player: 'player2', type: 'queen' },
    },
    {
      coord: { ring: 4, position: 12 },
      piece: { id: 'p2g', player: 'player2', type: 'guard' },
    },
  ];
  for (const { coord, piece } of pieces) {
    const key = cellKey(coord.ring, coord.position);
    cells.set(key, { ...cells.get(key)!, piece });
  }
  return {
    ...state,
    cells,
    currentPlayer: 'player1',
    selectedPiece: null,
    capturedPieces: [],
    winner: null,
    moveHistory: [],
  };
}

describe('Wave 41 Queens — AI apply', () => {
  it('getAIMove returns legal from/to on sparse board (easy)', () => {
    const state = sparseBoard();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const valids = getValidMoves(state, move!.from);
    expect(
      valids.some(
        (m) => m.ring === move!.to.ring && m.position === move!.to.position
      )
    ).toBe(true);
  });

  it('getAIMove null for wrong seat and winner set', () => {
    const state = sparseBoard();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    const won: QueensGuardsState = { ...state, winner: 'player1' };
    expect(getAIMove(won, 'player1', 'easy')).toBeNull();
  });

  it('applyAIMove executes move and advances history', () => {
    const state = sparseBoard();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const next = applyAIMove(state, move!);
    expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
    expect(
      next.cells.get(cellKey(move!.from.ring, move!.from.position))?.piece
    ).toBeNull();
    expect(
      next.cells.get(cellKey(move!.to.ring, move!.to.position))?.piece
    ).toBeTruthy();
  });

  it('getAIMove prefers restore when capturedPieces queued', () => {
    const base = createInitialState();
    const captured: BoardCoord = { ring: 2, position: 0 };
    const cells = new Map(base.cells);
    cells.set(cellKey(2, 0), {
      ring: 2,
      position: 0,
      piece: { id: 'cap', player: 'player2', type: 'guard' },
    });
    const state: QueensGuardsState = {
      ...base,
      cells,
      capturedPieces: [captured],
      currentPlayer: 'player1',
    };
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual(captured);
    expect(move!.to.ring).toBe(CONFIG.NUM_RINGS - 1);
    expect(
      state.cells.get(cellKey(move!.to.ring, move!.to.position))?.piece
    ).toBeNull();
  });

  it('easy AI returns a move on sparse board', () => {
    const state = sparseBoard();
    expect(getAIMove(state, 'player1', 'easy')).not.toBeNull();
  });

  it('applyAIMove matches makeMove for ordinary moves', () => {
    const state = sparseBoard();
    const move = getAIMove(state, 'player1', 'easy')!;
    const viaApply = applyAIMove(state, move);
    const viaMake = makeMove(state, move.from, move.to);
    expect(viaApply.moveHistory).toEqual(viaMake.moveHistory);
    expect(viaApply.currentPlayer).toBe(viaMake.currentPlayer);
  });
});
