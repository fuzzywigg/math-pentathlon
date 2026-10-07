/**
 * Targeted branch coverage for fraction-pinball/rules.ts — hand-built states.
 * Illegal submit rejection, win/draw settle, turn handoff. Private RNG wrong-
 * answer fill arms documented separately (not forced). Engine unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
  checkAnswer,
  generateChallenge,
  formatDecimal,
  formatFraction,
} from '../../src/games/fraction-pinball/rules';

describe('Fraction-Pinball targeted — illegal rejection + handoff', () => {
  it('submitAnswer rejects missing challenge / wrong phase', () => {
    const bare = createInitialState();
    expect(submitAnswer(bare, '0.5')).toBe(bare);

    const live = startGame(createInitialState());
    const wrongPhase: FractionPinballState = {
      ...live,
      phase: 'showResult',
    };
    expect(submitAnswer(wrongPhase, live.currentChallenge!.correctAnswer)).toBe(
      wrongPhase
    );
  });

  it('wrong answer decrements balls; correct advances to showResult', () => {
    const live = startGame(createInitialState());
    const wrong = submitAnswer(live, '__not-an-answer__');
    expect(wrong.phase).toBe('showResult');
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.player1Stats.ballsRemaining).toBe(
      live.player1Stats.ballsRemaining - 1
    );

    const live2 = startGame(createInitialState());
    const right = submitAnswer(
      live2,
      live2.currentChallenge!.correctAnswer
    );
    expect(right.isCorrect).toBe(true);
    expect(right.player1Stats.correctAnswers).toBe(1);
  });

  it('nextChallenge hands off seat on a continuing round', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    const next = nextChallenge(state);
    expect(next.phase).toBe('answering');
    expect(next.currentPlayer).toBe('player2');
    expect(next.roundNumber).toBe(state.roundNumber + 1);
    expect(next.currentChallenge).not.toBeNull();
  });
});

describe('Fraction-Pinball targeted — win / draw settle', () => {
  it('maxRounds exceeded settles p1 win / p2 win / draw by score', () => {
    const base = startGame(createInitialState());
    const cases: Array<{
      p1: number;
      p2: number;
      winner: 'player1' | 'player2' | null;
    }> = [
      { p1: 40, p2: 10, winner: 'player1' },
      { p1: 5, p2: 50, winner: 'player2' },
      { p1: 20, p2: 20, winner: null },
    ];

    for (const { p1, p2, winner } of cases) {
      const state: FractionPinballState = {
        ...base,
        phase: 'showResult',
        roundNumber: base.maxRounds,
        player1Stats: { ...base.player1Stats, score: p1 },
        player2Stats: { ...base.player2Stats, score: p2 },
      };
      const ended = nextChallenge(state);
      expect(ended.phase).toBe('gameOver');
      expect(ended.winner).toBe(winner);
      expect(ended.currentChallenge).toBeNull();
    }
  });

  it('both seats out of balls ends game even mid-rounds', () => {
    const live = startGame(createInitialState());
    const state: FractionPinballState = {
      ...live,
      phase: 'showResult',
      roundNumber: 2,
      player1Stats: { ...live.player1Stats, ballsRemaining: 0, score: 30 },
      player2Stats: { ...live.player2Stats, ballsRemaining: 0, score: 10 },
    };
    const ended = nextChallenge(state);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });

  it('checkAnswer / generateChallenge / format helpers stay consistent', () => {
    const c = generateChallenge(2);
    expect(checkAnswer(c, c.correctAnswer)).toBe(true);
    expect(checkAnswer(c, '__nope__')).toBe(false);
    expect(c.answerChoices).toContain(c.correctAnswer);
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
  });
});
