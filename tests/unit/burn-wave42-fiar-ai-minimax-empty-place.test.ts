/**
 * Wave 42 — FIAR minimax placement empty-nodes leaf via forged full board.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — minimax empty place leaf', () => {
  it('returns null when placement board has no empty nodes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const nodes = new Map(state.board.nodes);
    let i = 0;
    for (const [id, node] of nodes) {
      nodes.set(id, {
        ...node,
        chip: i++ % 2 === 0 ? 'player1' : 'player2',
      });
    }
    const full = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'placement' as const,
      chipsPlaced: { player1: 3, player2: 3 },
      currentPlayer: 'player1' as const,
    };
    expect(getAIMove(full, 'player1', 'easy')).toBeNull();
  });
});
