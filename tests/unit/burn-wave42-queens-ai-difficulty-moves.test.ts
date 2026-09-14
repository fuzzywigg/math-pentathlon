/**
 * Wave 42 — Queens & Guards AI getAIMove / applyAIMove leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  getAIMove,
  applyAIMove,
} from '../../src/games/queens-guards/ai';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

afterEach(() => vi.restoreAllMocks());

/** Minimal board — full opening minimax is too slow for unit tests. */
function minimalAIState(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  cells.set(cellKey(5, 0), {
    ...cells.get(cellKey(5, 0))!,
    piece: { id: 'solo-g', player: 'player1', type: 'guard' },
  });
  return { ...base, cells, currentPlayer: 'player1' };
}

describe('Wave 42 queens — AI difficulty and apply', () => {
  it('getAIMove returns null for wrong seat or finished game', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'medium')).toBeNull();
    const won: QueensGuardsState = {
      ...state,
      winner: 'player1',
    };
    expect(getAIMove(won, 'player1', 'hard')).toBeNull();
  });

  it('getAIMove returns null when no legal moves exist', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      if (!cell.piece && cell.ring !== 0) {
        cells.set(key, {
          ...cell,
          piece: { id: `jam-${key}`, player: 'player2', type: 'guard' },
        });
      }
    }
    expect(getAIMove({ ...state, cells }, 'player1', 'easy')).toBeNull();
  });

  it('hard with high random returns a legal move on minimal board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const valids = getValidMoves(state, move!.from);
    expect(
      valids.some(
        (m) => m.ring === move!.to.ring && m.position === move!.to.position
      )
    ).toBe(true);
  });

  it('easy randomness branch can pick among top moves when random < 0.4', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
  });

  it('medium difficulty returns a move with randomness gate at 0.99', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = minimalAIState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.from.ring).toBeGreaterThanOrEqual(0);
  });

  it('applyAIMove executes returned move via makeMove', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = minimalAIState();
    const aiMove = getAIMove(state, 'player1', 'hard');
    expect(aiMove).not.toBeNull();
    const next = applyAIMove(state, aiMove!);
    expect(next).not.toBe(state);
    expect(next.moveHistory.length).toBe(1);
    expect(next.cells.get(cellKey(aiMove!.from.ring, aiMove!.from.position))?.piece).toBeNull();
    expect(
      next.cells.get(cellKey(aiMove!.to.ring, aiMove!.to.position))?.piece
    ).toBeTruthy();
  });

  it('getAIMove prefers restore when capturedPieces pending', () => {
    const state = createInitialState();
    const captured = { ring: 2, position: 0 };
    const cells = new Map(state.cells);
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece: { id: 'cap', player: 'player1', type: 'guard' },
    });
    const withCap = { ...state, cells, capturedPieces: [captured] };
    const move = getAIMove(withCap, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual(captured);
    expect(move!.to.ring).toBe(5);
  });
});
