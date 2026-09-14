/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes roll→pass leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice, passTurn } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight sum-dominoes — roll/pass phases', () => {
  it('roll sets dice; pass from passing flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = doRollDice(createInitialState());
    expect(rolled.currentDice).toEqual([1, 1]);
    expect(['placing', 'passing']).toContain(rolled.phase);
    if (rolled.phase === 'passing') {
      const next = passTurn(rolled);
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('rolling');
    }
  });
});
