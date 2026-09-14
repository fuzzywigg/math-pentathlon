/**
 * Overnight HEAVY leftover — Calla AI null when animating / wrong seat as P2.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove, isAITurn, analyzeMoves } from '../../src/games/calla/ai';

describe('Overnight wave50 calla — AI animating/empty leftovers', () => {
  it('animating phase yields no valids, empty analyze, null move', () => {
    const anim = { ...createInitialState(), phase: 'animating' as const };
    expect(analyzeMoves(anim, 'player1')).toEqual([]);
    expect(getAIMove(anim, 'player1', 'hard')).toBeNull();
    expect(isAITurn(anim, 'player1', 'human-vs-ai')).toBe(true);
  });

  it('winner-set selectPit still gates getAIMove via isGameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'selectPit' as const,
      winner: 'player2' as const,
    };
    expect(getAIMove(over, 'player1', 'easy')).toBeNull();
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
