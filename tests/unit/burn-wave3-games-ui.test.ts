import { describe, it, expect, afterEach } from 'vitest';

import { createInitialState as createHexState } from '../../src/games/hex/types';
import { renderBoard as renderHexBoard } from '../../src/games/hex/board-ui';

import { createInitialState as createCallaState } from '../../src/games/calla/types';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';

import { createInitialState as createHexAGoneState } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderHexAGoneBoard } from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createPrimeGoldState } from '../../src/games/prime-gold/rules';
import {
  renderBoard as renderPrimeGoldBoard,
  renderDice as renderPrimeGoldDice,
} from '../../src/games/prime-gold/board-ui';

import { createInitialState as createRemainderState } from '../../src/games/remainder-islands/types';
import { renderBoard as renderRemainderBoard } from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createJuggleState } from '../../src/games/juggle/rules';
import {
  renderBoard as renderJuggleBoard,
  renderDice as renderJuggleDice,
} from '../../src/games/juggle/board-ui';

import { createInitialState as createRamrodState } from '../../src/games/ramrod/rules';
import { renderBoard as renderRamrodBoard } from '../../src/games/ramrod/board-ui';

import {
  createInitialState as createFracFactState,
} from '../../src/games/frac-fact/types';
import { startGame as startFracFact } from '../../src/games/frac-fact/rules';
import {
  renderProblem,
  renderAnswerChoices,
} from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Burn Wave 3 — board UI smoke', () => {
  it('hex: renderBoard mounts .hex-board', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexBoard(createHexState(5), container, () => undefined);
    expect(container.querySelector('.hex-board')).toBeTruthy();
    expect(container.querySelectorAll('.hex-cell-empty').length).toBeGreaterThan(
      0
    );
  });

  it('calla: renderBoard mounts .calla-board and valid pits', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaBoard(createCallaState(), container, () => undefined);
    expect(container.querySelector('.calla-board')).toBeTruthy();
    expect(container.querySelectorAll('.calla-pit-valid').length).toBeGreaterThan(
      0
    );
  });

  it('hex-a-gone: board + bank block buttons', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexAGoneBoard(
      createHexAGoneState(),
      container,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(container.querySelector('.hex-a-gone-board')).toBeTruthy();
    expect(
      container.querySelectorAll('.hex-a-gone-block-btn').length
    ).toBeGreaterThan(0);
  });

  it('prime-gold: board + roll CTA', () => {
    const state = createPrimeGoldState();
    const board = renderPrimeGoldBoard(state, () => undefined);
    document.body.appendChild(board);
    expect(board.querySelector('.pg-board')).toBeTruthy();

    const dice = renderPrimeGoldDice(state, () => undefined);
    document.body.appendChild(dice);
    expect(dice.querySelector('.pg-roll-btn')).toBeTruthy();
  });

  it('remainder-islands: SVG board with islands', () => {
    const svg = renderRemainderBoard(
      createRemainderState(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(svg);
    expect(svg.classList.contains('remainder-board')).toBe(true);
    expect(svg.querySelectorAll('.island').length).toBeGreaterThan(0);
  });

  it('juggle: board + roll button', () => {
    const state = createJuggleState();
    const board = renderJuggleBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(board);
    expect(board.classList.contains('juggle-board')).toBe(true);

    const dice = renderJuggleDice(
      null,
      () => undefined,
      () => undefined,
      true,
      state.phase
    );
    document.body.appendChild(dice);
    expect(dice.querySelector('.juggle-roll-btn')).toBeTruthy();
  });

  it('ramrod: renderBoard mounts .ramrod-board', () => {
    const board = renderRamrodBoard(createRamrodState(), () => undefined);
    document.body.appendChild(board);
    expect(board.classList.contains('ramrod-board')).toBe(true);
    expect(board.querySelectorAll('.ramrod-box').length).toBeGreaterThan(0);
  });

  it('frac-fact: startGame then problem + choice buttons', () => {
    const started = startFracFact(createFracFactState());
    const problem = renderProblem(started);
    const choices = renderAnswerChoices(started, () => undefined);
    document.body.appendChild(problem);
    document.body.appendChild(choices);

    expect(problem.classList.contains('frac-problem')).toBe(true);
    expect(choices.querySelectorAll('.frac-choice-btn').length).toBeGreaterThan(
      0
    );
  });
});
