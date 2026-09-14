/**
 * Wave 42 — Pinball nextChallenge settle winner / balls exhaust. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, MAX_ROUNDS } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
  generateChallenge,
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — settle winner', () => {
  it('maxRounds settle prefers higher score', () => {
    let s = startGame({ ...createInitialState(), maxRounds: 1 });
    s = submitAnswer(s, s.currentChallenge!.correctAnswer);
    s = {
      ...s,
      player1Stats: { ...s.player1Stats, score: 50 },
      player2Stats: { ...s.player2Stats, score: 10 },
    };
    s = nextChallenge(s);
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBe('player1');
  });

  it('both balls zero ends even mid-rounds', () => {
    let s = startGame(createInitialState());
    s = submitAnswer(s, s.currentChallenge!.correctAnswer);
    s = {
      ...s,
      player1Stats: { ...s.player1Stats, ballsRemaining: 0 },
      player2Stats: { ...s.player2Stats, ballsRemaining: 0 },
      roundNumber: 2,
      maxRounds: MAX_ROUNDS,
    };
    s = nextChallenge(s);
    expect(s.phase).toBe('gameOver');
  });

  it('generate alternates types; format helpers', () => {
    const a = generateChallenge(1);
    const b = generateChallenge(2);
    expect(a.type).toBe('decimalToFraction');
    expect(b.type).toBe('fractionToDecimal');
    expect(formatDecimal(0.5)).toMatch(/0\.5|\.5/);
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
  });
});
