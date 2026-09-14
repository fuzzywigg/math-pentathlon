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
    nodes.set('0-0', { ...nodes.get('0-0')!, chip: 'player1' });
    nodes.set('4-4', { ...nodes.get('4-4')!, chip: 'player2' });
    const movement = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      currentPlayer: 'player1' as const,
    };
    const move = getAIMove(movement, 'player1', 'medium');
    expect(move?.type).toBe('move');
    expect(move!.from).toBe('0-0');
    expect(typeof move!.to).toBe('string');
  });
});
