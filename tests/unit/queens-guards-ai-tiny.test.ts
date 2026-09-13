import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  BoardCoord,
  cellKey,
  CONFIG,
} from '../../src/games/queens-guards/types';
import { getValidMoves, hasValidMoves } from '../../src/games/queens-guards/rules';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Craft a sparse board: only one player1 guard with a known adjacent empty cell.
 * Keeps easy search cheap vs a full Agon opening.
 */
function tinyGuardState() {
  const state = createInitialState();
  const cells = new Map(state.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  // Place a single guard on ring 2 and leave neighbors empty
  const from: BoardCoord = { ring: 2, position: 0 };
  cells.set(cellKey(from.ring, from.position), {
    ...cells.get(cellKey(from.ring, from.position))!,
    piece: { type: 'guard', player: 'player1' },
  });
  // Opponent queen parked far away so the game isn't immediately over
  const opp: BoardCoord = { ring: CONFIG.NUM_RINGS - 1, position: 0 };
  cells.set(cellKey(opp.ring, opp.position), {
    ...cells.get(cellKey(opp.ring, opp.position))!,
    piece: { type: 'queen', player: 'player2' },
  });
  return {
    ...state,
    cells,
    currentPlayer: 'player1' as const,
    selectedPiece: null,
  };
}

describe('Queens & Guards AI — tiny-board search', () => {
  it('tiny board still has at least one legal move for player1', () => {
    const state = tinyGuardState();
    expect(hasValidMoves(state, 'player1')).toBe(true);
    const from: BoardCoord = { ring: 2, position: 0 };
    expect(getValidMoves(state, from).length).toBeGreaterThan(0);
  });

  it('getAIMove easy returns a legal from→to on a tiny board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = tinyGuardState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const legal = getValidMoves(state, move!.from);
    expect(
      legal.some(
        (t) => t.ring === move!.to.ring && t.position === move!.to.position
      )
    ).toBe(true);
  });

  it('applyAIMove on the tiny-board AI choice flips the seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = tinyGuardState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const next = applyAIMove(state, move!);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(1);
  });
});
