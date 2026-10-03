/**
 * Wave 42 — FIAR AI medium movement on a sparse mobility board.
 * Tests-only. Keep chip count low so depth-2 stays fast.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — medium movement sparse', () => {
  it('returns move when each side has one mobile chip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const nodes = new Map(state.board.nodes);
    nodes.set('c2r1', { ...nodes.get('c2r1')!, chip: 'player1' });
    nodes.set('c6r5', { ...nodes.get('c6r5')!, chip: 'player2' });
    const movement = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      currentPlayer: 'player1' as const,
    };
    const move = getAIMove(movement, 'player1', 'medium');
    expect(move?.type).toBe('move');
    expect(move!.from).toBe('c2r1');
    expect(typeof move!.to).toBe('string');
  });
});
