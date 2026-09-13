import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
  type ConversionChallenge,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import {
  formatDecimal,
  formatFraction,
  startGame,
  checkAnswer,
  submitAnswer,
  generateChallenge,
  hitRandomTarget,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe('Fraction Pinball – generateChallenge / hitRandomTarget / nextChallenge', () => {
  function mockRandomSequence(...values: number[]) {
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = values[i % values.length];
      i++;
      return v;
    });
  }

  it('generateChallenge(0) is fractionToDecimal; (1) is decimalToFraction', () => {
    mockRandomSequence(0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.15);
    const even = generateChallenge(0);
    expect(even.type).toBe('fractionToDecimal');
    expect(even.answerChoices).toHaveLength(4);
    expect(even.answerChoices).toContain(even.correctAnswer);

    const odd = generateChallenge(1);
    expect(odd.type).toBe('decimalToFraction');
    expect(odd.answerChoices).toHaveLength(4);
    expect(odd.answerChoices).toContain(odd.correctAnswer);
  });

  it('hitRandomTarget with mocked random returns a TARGET_POINTS value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const { target, points } = hitRandomTarget(state.targets);
    expect(TARGET_POINTS).toContain(points);
    expect(target.value).toBe(points);
  });

  it('nextChallenge advances player/round; gameOver at maxRounds with winner by score', () => {
    mockRandomSequence(0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.25);
    let state: FractionPinballState = {
      ...createInitialState(),
      phase: 'showResult',
      roundNumber: 1,
      maxRounds: 3,
      player1Stats: {
        score: 50,
        correctAnswers: 1,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
      player2Stats: {
        score: 10,
        correctAnswers: 0,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
    };

    state = nextChallenge(state);
    expect(state.phase).toBe('answering');
    expect(state.currentPlayer).toBe('player2');
    expect(state.roundNumber).toBe(2);
    expect(state.currentChallenge).not.toBeNull();

    // Already at maxRounds → nextChallenge ends the game
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 80 },
      player2Stats: { ...state.player2Stats, score: 20 },
    };
    const over = nextChallenge(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player1');
    expect(over.currentChallenge).toBeNull();
  });

  it('nextChallenge ends game when both players have zero balls', () => {
    const state: FractionPinballState = {
      ...createInitialState(),
      phase: 'showResult',
      roundNumber: 2,
      maxRounds: 10,
      player1Stats: {
        score: 30,
        correctAnswers: 1,
        wrongAnswers: 5,
        ballsRemaining: 0,
      },
      player2Stats: {
        score: 40,
        correctAnswers: 2,
        wrongAnswers: 5,
        ballsRemaining: 0,
      },
    };
    const over = nextChallenge(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player2');
  });

  it('correct submitAnswer increases score via existing hitRandomTarget logic', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const challenge: ConversionChallenge = {
      id: 'c-score',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const answering: FractionPinballState = {
      ...createInitialState(),
      currentChallenge: challenge,
      phase: 'answering',
    };
    const before = answering.player1Stats.score;
    const next = submitAnswer(answering, '0.5');
    expect(next.player1Stats.score).toBeGreaterThan(before);
  });
});
