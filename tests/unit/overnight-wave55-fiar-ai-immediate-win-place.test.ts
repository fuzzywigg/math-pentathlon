/**
 * Wave 55 leftover after #249/#250 — FIAR AI immediate win place + center bias. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 fiar — AI immediate win place', () => {
  it('easy AI places the cell that completes unblocked 4-in-a-row', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    for (const id of ['c1r2', 'c2r2', 'c3r2']) {
      const n = state.board.nodes.get(id)!;
      state.board.nodes.set(id, { ...n, chip: 'player1', chipKind: 'plain' });
    }
    const ready = {
      ...state,
      chipsPlaced: { player1: 3, player2: 0 },
      currentPlayer: 'player1' as const,
    };
    const move = getAIMove(ready, 'player1', 'easy');
    expect(move?.type).toBe('place');
    // Completing either open end wins
    expect(['c4r2', 'c0r3', 'c5r2', 'c6r2', 'c7r2']).toContain(move?.nodeId);
    const next = applyAIMove(ready, move!);
    expect(next.winner).toBe('player1');
  });

  it('opening easy place prefers a near-center node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move?.type).toBe('place');
    // Heuristic ranks spaces near the yellow diamond (c4r3)
    expect(move?.nodeId).toMatch(/^c[2-6]r[1-5]$/);
  });
});
