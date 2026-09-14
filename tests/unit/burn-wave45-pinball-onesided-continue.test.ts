/**
 * Wave 45 TOKENMAXX — Pinball nextChallenge continues with one-sided drain. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 45 pinball — one-sided continue', () => {
  it('continues when only one player has zero balls and rounds remain', () => {
    const live = startGame(createInitialState());
    const mid = {
      ...live,
      phase: 'showResult' as const,
      player1Stats: { ...live.player1Stats, ballsRemaining: 0 },
      player2Stats: { ...live.player2Stats, ballsRemaining: 3 },
      roundNumber: 2,
    };
    const next = nextChallenge(mid);
    expect(next.phase).toBe('answering');
    expect(next.currentPlayer).toBe('player2');
    expect(next.roundNumber).toBe(3);
    expect(next.currentChallenge).not.toBeNull();
  });
});
