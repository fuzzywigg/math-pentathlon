import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  BoardCoord,
  cellKey,
} from '../../src/games/queens-guards/types';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { getAIMove, applyAIMove, AIMove } from '../../src/games/queens-guards/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

/** Craft a legal opening move without running minimax. */
function openingMove(): AIMove {
  const state = createInitialState();
  for (const [, cell] of state.cells) {
    if (!cell.piece || cell.piece.player !== 'player1') continue;
    const from: BoardCoord = { ring: cell.ring, position: cell.position };
    const targets = getValidMoves(state, from);
    if (targets.length > 0) {
      return { from, to: targets[0] };
    }
  }
  throw new Error('no opening move');
}

describe('Queens & Guards AI', () => {
  // No isAITurn export — cover null gates + applyAIMove with a crafted move.
  // Skip getAIMove search on a full opening (minimax ~1s+ even on easy).

  it('getAIMove returns null when there is already a winner', () => {
    const state = { ...createInitialState(), winner: 'player1' as const };
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
  });

  it('getAIMove returns null for the wrong seat (no search)', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
  });

  it('applyAIMove applies a crafted tiny opening move', () => {
    const state = createInitialState();
    const move = openingMove();
    const next = applyAIMove(state, move);
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(
      next.cells.get(cellKey(move.to.ring, move.to.position))?.piece
    ).toBeTruthy();
  });

  it('applyAIMove leaves origin empty after the crafted move', () => {
    const state = createInitialState();
    const move = openingMove();
    const next = applyAIMove(state, move);
    expect(
      next.cells.get(cellKey(move.from.ring, move.from.position))?.piece
    ).toBeNull();
  });

  it('openingMove helper finds an inward or sideways legal step', () => {
    const move = openingMove();
    expect(move.to.ring).toBeLessThanOrEqual(move.from.ring);
  });
});
