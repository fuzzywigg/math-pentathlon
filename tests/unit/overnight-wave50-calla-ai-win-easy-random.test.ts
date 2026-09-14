/**
 * Overnight HEAVY leftover — Calla AI immediate-win pit and easy teaching random.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove, analyzeMoves } from '../../src/games/calla/ai';
import { getValidPits, makeMove, isGameOver } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight wave50 calla — immediate win / easy random', () => {
  it('returns the pit that empties the side and wins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [2, 0, 0, 0, 0],
      player1Calla: 20,
      player2Calla: 7,
    };
    const move = getAIMove(state, 'player1', 'medium');
    expect(move?.pit).toBe(4);
    const next = makeMove(state, 4);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('player1');
  });

  it('easy teaching path still returns a valid opening pit', () => {
    const s = createInitialState();
    const valids = getValidPits(s);
    for (const r of [0.0, 0.29, 0.5, 0.99] as const) {
      vi.spyOn(Math, 'random').mockReturnValue(r);
      const move = getAIMove(s, 'player1', 'easy');
      expect(move).not.toBeNull();
      expect(valids).toContain(move!.pit);
      vi.restoreAllMocks();
    }
    expect(analyzeMoves(s, 'player1').length).toBe(5);
  });
});
