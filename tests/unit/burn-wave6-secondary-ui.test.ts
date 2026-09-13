import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderDice,
  renderScores as renderRemainderScores,
  renderDivisionPreview,
  renderGameOver as renderRemainderGameOver,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderScores as renderFracScores,
  renderGameOver as renderFracGameOver,
  renderResult as renderFracResult,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import {
  createInitialState as createPinball,
  INITIAL_BALLS,
  MAX_ROUNDS,
  getPlayerStats,
} from '../../src/games/fraction-pinball/types';
import {
  renderScores as renderPinballScores,
  renderGameOver as renderPinballGameOver,
  renderResult as renderPinballResult,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Remainder Islands secondary UI', () => {
  it('renders dice, scores, division preview, and game-over shell', () => {
    const base = createRemainder();
    const island = base.islands[0];
    const state = {
      ...base,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      selectedIsland: island.id,
      validIslands: [island.id],
      phase: 'selectIsland' as const,
    };
    const dice = renderDice(state.currentRoll);
    const scores = renderRemainderScores(state);
    const preview = renderDivisionPreview(state);
    const over = renderRemainderGameOver({
      ...state,
      phase: 'gameOver',
      winner: 'player1',
    });
    document.body.append(dice, scores, preview, over);

    expect(dice.classList.contains('remainder-dice')).toBe(true);
    expect(scores.classList.contains('remainder-scores')).toBe(true);
    expect(preview.classList.contains('remainder-preview')).toBe(true);
    expect(over.classList.contains('remainder-game-over')).toBe(true);
    expect(remainderName('player1').length).toBeGreaterThan(0);
  });

  it('renderDice handles null roll', () => {
    const empty = renderDice(null);
    document.body.appendChild(empty);
    expect(empty.classList.contains('remainder-dice')).toBe(true);
    expect(empty.querySelector('.dice-placeholder')).toBeTruthy();
  });
});

describe('Frac Fact secondary UI', () => {
  it('renders scores and game-over for forced gameOver phase', () => {
    const state = {
      ...createFrac('easy'),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const scores = renderFracScores(state);
    const over = renderFracGameOver(state);
    document.body.append(scores, over);
    expect(scores.classList.contains('frac-scores')).toBe(true);
    expect(over.classList.contains('frac-game-over')).toBe(true);
    expect(fracName('player2').length).toBeGreaterThan(0);
  });

  it('renderResult mounts when showingResult with a problem', () => {
    const withProblem = {
      ...createFrac('easy'),
      phase: 'showingResult' as const,
      currentProblem: {
        id: 'p1',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'add' as const,
        correctAnswer: { numerator: 5, denominator: 6 },
        answerChoices: [
          { numerator: 5, denominator: 6 },
          { numerator: 2, denominator: 5 },
        ],
      },
      selectedAnswer: { numerator: 5, denominator: 6 },
      isCorrect: true,
    };
    const result = renderFracResult(withProblem, () => undefined);
    document.body.appendChild(result);
    expect(result.classList.contains('frac-result')).toBe(true);
  });
});

describe('Fraction Pinball secondary UI + types constants', () => {
  it('exposes INITIAL_BALLS / MAX_ROUNDS and getPlayerStats', () => {
    const state = createPinball();
    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBe(10);
    expect(getPlayerStats(state, 'player1').ballsRemaining).toBe(INITIAL_BALLS);
    expect(getPlayerStats(state, 'player2').score).toBe(0);
  });

  it('renders scores, result, and game-over shells', () => {
    const state = createPinball();
    const scores = renderPinballScores(state);
    const over = renderPinballGameOver({
      ...state,
      phase: 'gameOver',
      winner: 'player2',
    });
    document.body.append(scores, over);
    expect(scores.classList.contains('pinball-scores')).toBe(true);
    expect(over.classList.contains('pinball-game-over')).toBe(true);
    expect(pinballName('player1').length).toBeGreaterThan(0);

    const withChallenge = {
      ...state,
      phase: 'showResult' as const,
      currentChallenge: {
        id: 'c1',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25'],
        correctAnswer: '0.5',
      },
      selectedAnswer: '0.5',
      isCorrect: true,
    };
    const result = renderPinballResult(withChallenge, () => undefined);
    document.body.appendChild(result);
    expect(result.classList.contains('pinball-result')).toBe(true);
  });
});

describe('Contig expression selector UI', () => {
  it('renders expression options or pass after a roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createContig();
    state = doRollDice(state);
    const el = renderExpressionSelector(
      state,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(el);
    expect(el.classList.contains('contig-expressions')).toBe(true);
    expect(
      el.querySelector(
        '.contig-expr-option, .contig-pass-btn, .contig-no-moves'
      )
    ).toBeTruthy();
  });
});
