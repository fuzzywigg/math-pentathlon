/**
 * Wave 55 leftover after #249/#250 — FIAR AI immediate win place + center bias. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 fiar — AI immediate win place', () => {
  it('easy AI places the cell that completes unblocked 4-in-a-row', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    for (const id of ['1-0', '1-1', '1-2']) {
      const n = state.board.nodes.get(id)!;
      state.board.nodes.set(id, { ...n, chip: 'player1' });
    }
    const ready = {
      ...state,
      chipsPlaced: { player1: 3, player2: 0 },
      currentPlayer: 'player1' as const,
    };
    const move = getAIMove(ready, 'player1', 'easy');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBe('1-3');
  });

  it('opening easy place prefers the center node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move?.nodeId).toBe('2-2');
  });
});
