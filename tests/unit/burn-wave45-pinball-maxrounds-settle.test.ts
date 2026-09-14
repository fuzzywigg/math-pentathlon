/**
 * Wave 45 TOKENMAXX — Pinball nextChallenge maxRounds settle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 45 pinball — maxRounds settle', () => {
  it('gameOver with score winner when nextRound exceeds max', () => {
    const live = startGame(createInitialState());
    const mid = {
      ...live,
      phase: 'showResult' as const,
      roundNumber: live.maxRounds,
      player1Stats: { ...live.player1Stats, score: 40 },
      player2Stats: { ...live.player2Stats, score: 10 },
    };
    const over = nextChallenge(mid);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player1');
    expect(over.currentChallenge).toBeNull();
  });
});
