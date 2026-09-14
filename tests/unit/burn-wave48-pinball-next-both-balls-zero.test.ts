/**
 * Wave 48 — Pinball nextChallenge both balls 0 ends. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 48 pinball — both balls over', () => {
  it('ends with higher score winner when both balls 0', () => {
    const s = {
      ...createInitialState(),
      phase: 'showResult' as const,
      player1Stats: { score: 40, correctAnswers: 2, wrongAnswers: 5, ballsRemaining: 0 },
      player2Stats: { score: 20, correctAnswers: 1, wrongAnswers: 5, ballsRemaining: 0 },
    };
    const next = nextChallenge(s);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
