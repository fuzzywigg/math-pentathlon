/**
 * Wave 41 — Fraction Pinball submitAnswer / nextChallenge / startGame.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  type ConversionChallenge,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

const CHALLENGE: ConversionChallenge = {
  id: 'c-1',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '1'],
  correctAnswer: '0.5',
};

function answering(
  overrides: Partial<FractionPinballState> = {}
): FractionPinballState {
  return {
    ...createInitialState(),
    currentChallenge: CHALLENGE,
    phase: 'answering',
    ...overrides,
  };
}

describe('Wave 41 Pinball — submit / next / start', () => {
  it('startGame loads answering challenge', () => {
    let i = 0;
    const seq = [0.1, 0.3, 0.5, 0.7, 0.2, 0.4, 0.6, 0.8];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });
    const started = startGame(createInitialState());
    expect(started.phase).toBe('answering');
    expect(started.currentChallenge).not.toBeNull();
    expect(started.currentChallenge!.answerChoices).toContain(
      started.currentChallenge!.correctAnswer
    );
  });

  it('submitAnswer correct adds score; wrong drains a ball', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const correct = submitAnswer(answering(), '0.5');
    expect(correct.isCorrect).toBe(true);
    expect(correct.phase).toBe('showResult');
    expect(correct.player1Stats.correctAnswers).toBe(1);
    expect(correct.player1Stats.score).toBeGreaterThan(0);

    const wrong = submitAnswer(answering(), '0.25');
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.player1Stats.wrongAnswers).toBe(1);
    expect(wrong.player1Stats.ballsRemaining).toBe(
      answering().player1Stats.ballsRemaining - 1
    );
  });

  it('nextChallenge advances seat; maxRounds settles winner', () => {
    let i = 0;
    const seq = [0.15, 0.35, 0.55, 0.75, 0.25, 0.45, 0.65, 0.85];
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });

    let state = answering({
      phase: 'showResult',
      roundNumber: 1,
      maxRounds: 4,
      player1Stats: {
        score: 20,
        correctAnswers: 1,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
    });
    state = nextChallenge(state);
    expect(state.phase).toBe('answering');
    expect(state.currentPlayer).toBe('player2');
    expect(state.roundNumber).toBe(2);
    expect(state.selectedAnswer).toBeNull();

    const over = nextChallenge({
      ...state,
      phase: 'showResult',
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 90 },
      player2Stats: { ...state.player2Stats, score: 10 },
    });
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player1');
    expect(over.currentChallenge).toBeNull();
  });

  it('submitAnswer identity outside answering', () => {
    const idle = createInitialState();
    expect(submitAnswer(idle, '0.5')).toBe(idle);
  });
});
