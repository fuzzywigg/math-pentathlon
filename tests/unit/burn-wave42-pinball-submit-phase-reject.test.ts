/**
 * Wave 42 — Pinball submit/start phase rejects. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — phase reject', () => {
  it('submit outside answering identity', () => {
    const open = createInitialState();
    expect(submitAnswer(open, '0.5')).toBe(open);
    let s = startGame(open);
    s = submitAnswer(s, s.currentChallenge!.correctAnswer);
    expect(submitAnswer(s, 'x')).toBe(s); // showResult
  });

  it('next after correct continues to answering for opponent', () => {
    let s = startGame({ ...createInitialState(), maxRounds: 5 });
    s = submitAnswer(s, s.currentChallenge!.correctAnswer);
    s = nextChallenge(s);
    expect(s.phase).toBe('answering');
    expect(s.currentPlayer).toBe('player2');
    expect(s.roundNumber).toBe(2);
    expect(s.currentChallenge).not.toBeNull();
  });
});
