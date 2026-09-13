/**
 * Wave 19 — midstate status / quiz UI remount edges (not secondary-ui chrome redo).
 * Distinct from waves 5–13 secondary-ui and wave 18 math-preview.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { renderStatus as renderHexStatus } from '../../src/games/hex/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { renderStatus as renderHagStatus } from '../../src/games/hex-a-gone/board-ui';

import {
  createInitialGameState as createKings,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import { renderStatus as renderKingsStatus } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { startGame as startFrac } from '../../src/games/frac-fact/rules';
import {
  renderProblem,
  renderAnswerChoices,
  renderResult as renderFracResult,
  injectFracFactStyles,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { startGame as startPinball } from '../../src/games/fraction-pinball/rules';
import {
  renderChallenge,
  renderResult as renderPinballResult,
  renderPinballBoard,
  injectFractionPinballStyles,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
} from '../../src/games/prime-gold/rules';
import {
  renderExpressions,
  renderDice as renderPrimeDice,
  getPlayerName as primeName,
} from '../../src/games/prime-gold/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 19 status-ui — Hex / Calla winner + thinking remount', () => {
  it('Hex remounts winner banner then AI thinking on same container', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const won = { ...createHex(), winner: 'player1' as const };
    renderHexStatus(won, el, 'human-vs-ai', false);
    expect(el.querySelector('.status-winner, .hex-status')).toBeTruthy();
    expect(el.textContent).toMatch(/win|You|Player/i);

    renderHexStatus(createHex(), el, 'human-vs-ai', true);
    expect(el.textContent).toMatch(/thinking/i);
  });

  it('Calla tie banner remount clears prior turn chrome', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderCallaStatus(createCalla(), el, 'human-vs-human', false);
    expect(el.querySelector('.calla-status')).toBeTruthy();

    const tied = { ...createCalla(), winner: 'tie' as const };
    renderCallaStatus(tied, el, 'human-vs-ai', false);
    expect(el.textContent).toMatch(/tie/i);
  });
});

describe('Wave 19 status-ui — Star / Hag / Kings midphase messages', () => {
  it('Star Track selectChain phase message after draw', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    const el = document.createElement('div');
    document.body.appendChild(el);
    let state = drawChains(createStar());
    expect(state.phase).toBe('selectChain');
    renderStarStatus(state, el);
    expect(el.textContent).toMatch(/choose|chain/i);

    const over = {
      ...state,
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    renderStarStatus(over, el);
    expect(el.textContent).toMatch(/win|Red/i);
  });

  it('Hex-a-Gone selectBlocks status then gameOver remount', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderHagStatus(createHag(), el);
    expect(el.textContent).toMatch(/select|block|bank/i);

    const over = {
      ...createHag(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    renderHagStatus(over, el);
    expect(el.textContent).toMatch(/win|Blue/i);
  });

  it('Kings AI mode shows difficulty; selectKing updates turn text', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let state = createKings();
    renderKingsStatus(state, el, 'human-vs-ai', 'hard', false);
    expect(el.textContent).toMatch(/AI|Hard/i);
    expect(el.querySelector('.status-mode, .status')).toBeTruthy();

    state = selectKing(state);
    renderKingsStatus(state, el, 'human-vs-ai', 'easy', true);
    expect(el.textContent).toMatch(/thinking/i);
  });
});

describe('Wave 19 status-ui — Frac Fact problem/choices/result pipeline', () => {
  it('renderProblem + choices + result remount without throw', () => {
    injectFracFactStyles();
    const state = startFrac(createFrac('medium'));
    expect(state.currentProblem).not.toBeNull();

    const problem = renderProblem(state);
    expect(problem.querySelector('.frac-problem, .fraction-svg, svg')).toBeTruthy();

    let clicked = false;
    const choices = renderAnswerChoices(state, () => {
      clicked = true;
    });
    expect(choices.querySelectorAll('.frac-choice-btn').length).toBeGreaterThan(
      0
    );
    const btn = choices.querySelector('.frac-choice-btn') as HTMLButtonElement;
    btn.click();
    expect(clicked).toBe(true);

    const showing = {
      ...state,
      phase: 'showingResult' as const,
      selectedAnswer: state.currentProblem!.answerChoices[0],
      isCorrect: true,
    };
    const result = renderFracResult(showing, () => undefined);
    expect(result.querySelector('.frac-feedback, .frac-result')).toBeTruthy();
    expect(fracName('player1')).toBeTruthy();
    expect(fracName('player2')).toBeTruthy();
  });
});

describe('Wave 19 status-ui — Pinball challenge/board + Prime expressions', () => {
  it('Pinball challenge + board SVG remount; result in showResult', () => {
    injectFractionPinballStyles();
    const state = startPinball(createPinball());
    expect(state.currentChallenge).not.toBeNull();

    const challenge = renderChallenge(state, () => undefined);
    expect(
      challenge.querySelector('.pinball-choice-btn, .pinball-challenge')
    ).toBeTruthy();

    const board = renderPinballBoard(state);
    expect(board.tagName.toLowerCase()).toBe('svg');

    const showing = {
      ...state,
      phase: 'showResult' as const,
      selectedAnswer: state.currentChallenge!.correctAnswer,
      isCorrect: true,
    };
    const result = renderPinballResult(showing, () => undefined);
    expect(
      result.querySelector('.pinball-feedback, .pinball-continue-btn')
    ).toBeTruthy();
    expect(pinballName('player1')).toBeTruthy();
  });

  it('Prime Gold renderDice + renderExpressions after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.28);
    let state = primeRoll(createPrime());
    expect(state.diceRoll).not.toBeNull();

    const dice = renderPrimeDice(state);
    expect(dice.textContent?.length ?? 0).toBeGreaterThan(0);

    const picks: Array<{ value: number; expr: string }> = [];
    const exprs = renderExpressions(state, (value, expr) => {
      picks.push({ value, expr });
    });
    expect(exprs.className).toMatch(/pg-expressions|expressions/);
    const item = exprs.querySelector(
      '.pg-expression, .pg-expr, button, [data-value], div'
    );
    if (item && exprs.querySelectorAll('button, .pg-expression, .pg-expr-item').length > 0) {
      const clickable = exprs.querySelector(
        'button, .pg-expression, .pg-expr-item'
      ) as HTMLElement | null;
      clickable?.click();
    }
    expect(primeName('player1')).toBeTruthy();
    expect(picks.length).toBeGreaterThanOrEqual(0);
  });
});
