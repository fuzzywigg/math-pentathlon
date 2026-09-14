/**
 * Wave 41 — Fraction Pinball settle tie + single-seat zero balls continues.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  nextChallenge,
  submitAnswer,
  generateChallenge,
  startGame,
} from '../../src/games/fraction-pinball/rules';
import { getAIAnswer } from '../../src/games/fraction-pinball/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 pinball — tie / single drain', () => {
  it('nextChallenge at maxRounds with equal scores → draw', () => {
    const state = {
      ...createInitialState(),
      roundNumber: 10,
      maxRounds: 10,
      player1Stats: { ...createInitialState().player1Stats, score: 7 },
      player2Stats: { ...createInitialState().player2Stats, score: 7 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('only one seat at 0 balls still advances when under maxRounds', () => {
    const base = startGame(createInitialState());
    const state = {
      ...base,
      roundNumber: 2,
      maxRounds: 10,
      player1Stats: { ...base.player1Stats, ballsRemaining: 0, score: 1 },
      player2Stats: { ...base.player2Stats, ballsRemaining: 3, score: 2 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('answering');
    expect(next.roundNumber).toBe(3);
    expect(next.currentChallenge).not.toBeNull();
  });

  it('submitAnswer identity when answering but challenge null', () => {
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: null,
    };
    expect(submitAnswer(state, '1/2')).toBe(state);
  });

  it('generateChallenge parity: even fractionToDecimal, odd decimalToFraction', () => {
    expect(generateChallenge(2).type).toBe('fractionToDecimal');
    expect(generateChallenge(3).type).toBe('decimalToFraction');
  });

  it('getAIAnswer miss branch returns listed wrong choice', () => {
    const challenge = generateChallenge(1);
    const state = {
      ...createInitialState(),
      phase: 'answering' as const,
      currentChallenge: challenge,
      currentPlayer: 'player1' as const,
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const ans = getAIAnswer(state, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(challenge.answerChoices).toContain(ans!);
  });
});
