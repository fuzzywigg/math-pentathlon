/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes AI null gates leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/sum-dominoes/rules';
import { getAIMove, isAITurn } from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight sum-dominoes — AI null gates', () => {
  it('null without dice / wrong seat / gameOver; isAITurn matrix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = createInitialState();
    expect(getAIMove(s, 'player1', 'hard')).toBeNull(); // still rolling, no dice
    expect(isAITurn(s, 'player1')).toBe(true);
    expect(isAITurn(s, null)).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1')).toBe(false);
    const rolled = doRollDice(s);
    if (rolled.phase === 'placing' && rolled.currentDice) {
      expect(getAIMove(rolled, 'player2', 'medium')).toBeNull();
      const move = getAIMove(rolled, 'player1', 'easy');
      if (move) {
        expect(rolled.hands.player1.some((d) => d.id === move.dominoId)).toBe(true);
      }
    }
  }, 15_000);
});
