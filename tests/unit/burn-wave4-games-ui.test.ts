import { describe, it, expect, afterEach } from 'vitest';

import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

import { createInitialState as createPinballState } from '../../src/games/fraction-pinball/types';
import {
  renderChallenge,
  renderPinballBoard,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import {
  renderBoard as renderPentBoard,
  renderPieceSelector,
} from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createQGState } from '../../src/games/queens-guards/types';
import { renderBoard as renderQGBoard } from '../../src/games/queens-guards/board-ui';

import { createInitialState as createFabState } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createStarsState } from '../../src/games/stars-bars/rules';
import {
  renderBoard as renderStarsBoard,
  renderPlayerHand,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwaState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwaBoard } from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createPar55State } from '../../src/games/par-55/rules';
import {
  renderBoard as renderPar55Board,
  renderHand as renderPar55Hand,
} from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Burn Wave 4 — board UI smoke', () => {
  it('fiar: SVG board with interactive node groups', () => {
    const board = renderFiarBoard(createFiarState(), () => undefined);
    document.body.appendChild(board);
    // renderBoard returns bare SVG (container class lives in the shell)
    expect(board.tagName.toLowerCase()).toBe('svg');
    expect(board.querySelectorAll('[data-node-id]').length).toBeGreaterThan(0);
  });

  it('fraction-pinball: challenge + pinball board', () => {
    const challenge = {
      id: 'ui',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '0.2'],
      correctAnswer: '0.25',
    };
    const state = {
      ...createPinballState(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const challengeEl = renderChallenge(state, () => undefined);
    document.body.appendChild(challengeEl);
    expect(challengeEl.classList.contains('pinball-challenge')).toBe(true);
    expect(
      challengeEl.querySelectorAll('.pinball-choice-btn').length
    ).toBeGreaterThan(0);

    const board = renderPinballBoard(state);
    document.body.appendChild(board);
    expect(board.classList.contains('pinball-board')).toBe(true);
  });

  it('pent-em-in: board + piece selector options', () => {
    const state = createPentState();
    const board = renderPentBoard(
      state,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(board);
    expect(board.classList.contains('pent-board')).toBe(true);

    const selector = renderPieceSelector(state, () => undefined);
    document.body.appendChild(selector);
    expect(selector.classList.contains('pent-piece-selector')).toBe(true);
    expect(
      selector.querySelectorAll('.pent-piece-option').length
    ).toBeGreaterThan(0);
  });

  it('queens-guards: SVG cells are clickable', () => {
    const board = renderQGBoard(createQGState(), () => undefined);
    document.body.appendChild(board);
    expect(board.tagName.toLowerCase()).toBe('svg');
    expect(board.querySelectorAll('[data-cell-key]').length).toBeGreaterThan(0);
  });

  it('fab-a-diffy: fraction bar pool + answer board', () => {
    const state = createFabState();
    const pool = renderFractionBarPool(state, () => undefined);
    document.body.appendChild(pool);
    expect(pool.classList.contains('fab-bar-pool')).toBe(true);
    expect(pool.querySelectorAll('.fab-bar-wrapper').length).toBeGreaterThan(0);

    const answers = renderAnswerBoard(state, () => undefined);
    document.body.appendChild(answers);
    expect(answers.classList.contains('fab-answer-board')).toBe(true);
  });

  it('stars-bars: board cells + hand cards', () => {
    const state = createStarsState();
    const board = renderStarsBoard(state, () => undefined);
    document.body.appendChild(board);
    expect(board.classList.contains('stars-board-container')).toBe(true);
    expect(board.querySelectorAll('.stars-cell').length).toBeGreaterThan(0);

    const hand = renderPlayerHand(state, 'player1', () => undefined);
    document.body.appendChild(hand);
    expect(hand.classList.contains('stars-hand-container')).toBe(true);
    expect(hand.querySelectorAll('.stars-card').length).toBeGreaterThan(0);
  });

  it('kwatro-sinko: board mounts .kwa-board with nodes', () => {
    const board = renderKwaBoard(
      createKwaState(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(board);
    expect(board.classList.contains('kwa-board')).toBe(true);
    expect(board.querySelector('.kwa-svg')).toBeTruthy();
  });

  it('par-55: board bases + hand blocks', () => {
    const state = createPar55State();
    const board = renderPar55Board(state, () => undefined);
    document.body.appendChild(board);
    expect(board.classList.contains('par55-board')).toBe(true);
    expect(board.querySelectorAll('[data-base-id]').length).toBeGreaterThan(0);

    const hand = renderPar55Hand(state, 'player1', () => undefined);
    document.body.appendChild(hand);
    expect(hand.classList.contains('par55-hand')).toBe(true);
    expect(hand.querySelectorAll('.par55-hand-block').length).toBeGreaterThan(
      0
    );
  });
});
