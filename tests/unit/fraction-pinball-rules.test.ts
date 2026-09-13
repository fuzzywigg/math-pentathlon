import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type ConversionChallenge,
} from '../../src/games/fraction-pinball/types';
import {
  formatDecimal,
  formatFraction,
  startGame,
  checkAnswer,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

describe('Fraction Pinball – format helpers', () => {
  it('formatDecimal strips trailing zeros', () => {
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(1)).toBe('1');
    expect(formatDecimal(0.25)).toBe('0.25');
  });

  it('formatFraction uses slash notation unless whole', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
  });
});

describe('Fraction Pinball – startGame / checkAnswer / submitAnswer', () => {
  it('startGame loads the first challenge in answering phase', () => {
    const started = startGame(createInitialState());
    expect(started.phase).toBe('answering');
    expect(started.currentChallenge).not.toBeNull();
    expect(started.currentChallenge!.answerChoices.length).toBe(4);
    expect(started.currentChallenge!.answerChoices).toContain(
      started.currentChallenge!.correctAnswer
    );
  });

  it('checkAnswer matches the injected correct string', () => {
    const challenge: ConversionChallenge = {
      id: 'c-1',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    expect(checkAnswer(challenge, '0.5')).toBe(true);
    expect(checkAnswer(challenge, '0.25')).toBe(false);
  });

  it('submitAnswer with injected challenge updates score or balls', () => {
    const challenge: ConversionChallenge = {
      id: 'c-inj',
      type: 'decimalToFraction',
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['1/4', '1/2', '1/3', '2/5'],
      correctAnswer: '1/4',
    };

    const answering = {
      ...createInitialState(),
      currentChallenge: challenge,
      phase: 'answering' as const,
    };

    const correct = submitAnswer(answering, '1/4');
    expect(correct.phase).toBe('showResult');
    expect(correct.isCorrect).toBe(true);
    expect(correct.selectedAnswer).toBe('1/4');
    expect(correct.player1Stats.correctAnswers).toBe(1);
    expect(correct.player1Stats.score).toBeGreaterThan(0);

    const wrong = submitAnswer(answering, '1/2');
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.player1Stats.wrongAnswers).toBe(1);
    expect(wrong.player1Stats.ballsRemaining).toBe(
      answering.player1Stats.ballsRemaining - 1
    );
  });

  it('submitAnswer is a no-op outside answering phase', () => {
    const state = createInitialState();
    expect(submitAnswer(state, '0.5')).toBe(state);
  });
});
