/**
 * Wave 21 — existing-game DOM bridges for core attribute / fraction / polyomino libs.
 * Fab pool (fraction-bar), Par hand (attributes), Juggle board (polyomino), Hex board remount.
 * Distinct from #121 seat-handoff/history-DOM and #120 status-ui remounts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  calculateResult,
  getPossibleResults,
  getOperationSymbol,
} from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
  renderOperationSelector,
} from '../../src/games/fab-a-diffy/board-ui';

import {
  createInitialState as createPar,
  selectBlock,
  getValidPlacements,
  placeBlock,
} from '../../src/games/par-55/rules';
import {
  renderHand,
  renderScores,
  renderMoveHistory,
  injectPar55Styles,
} from '../../src/games/par-55/board-ui';

import {
  createInitialState as createJuggle,
  doRollDice,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  renderBoard as renderJuggleBoard,
  renderDice,
  injectJuggleStyles,
} from '../../src/games/juggle/board-ui';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { makeMove as hexMove } from '../../src/games/hex/rules';
import { renderBoard as renderHexBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#par55-styles, #juggle-styles, style[id]')
    .forEach((el) => {
      if (
        el.id === 'par55-styles' ||
        el.id === 'juggle-styles' ||
        el.id.includes('par') ||
        el.id.includes('juggle')
      ) {
        el.remove();
      }
    });
  vi.restoreAllMocks();
});

describe('Wave 21 game-bridge — Fab fraction pool / ops / answers', () => {
  it('pool remount paints SVG bars and selection click path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    let state = createFab();
    const clicks: string[] = [];
    const pool = renderFractionBarPool(state, (id) => clicks.push(id));
    expect(pool.classList.contains('fab-bar-pool')).toBe(true);
    expect(pool.querySelectorAll('.fab-bar-wrapper').length).toBeGreaterThan(5);
    expect(pool.querySelectorAll('svg.fraction-bar').length).toBeGreaterThan(0);

    const first = pool.querySelector('.fab-bar-wrapper') as HTMLElement;
    first.click();
    expect(clicks).toHaveLength(1);
    state = selectBar1(state, clicks[0]);
    const remount = renderFractionBarPool(state, () => undefined);
    expect(remount.querySelector('.fab-bar-selected')).toBeTruthy();
  });

  it('getPossibleResults + operation selector + answer board remount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.11);
    let state = createFab();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThan(1);
    state = selectBar1(state, bars[0].id);
    state = selectBar2(state, bars[1].id);
    const possibles = getPossibleResults(bars[0], bars[1]);
    expect(possibles.length).toBeGreaterThan(0);
    for (const p of possibles) {
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(p.operation);
      expect(p.result.denominator).toBeGreaterThan(0);
      expect(Number.isFinite(p.result.numerator)).toBe(true);
      expect(getOperationSymbol(p.operation).length).toBeGreaterThan(0);
    }
    // Spot-check: at least one operation matches live calculateResult abs equality
    const add = calculateResult(bars[0].fraction, bars[1].fraction, 'add');
    expect(add).not.toBeNull();
    const listedAdd = possibles.find((p) => p.operation === 'add');
    if (listedAdd && add) {
      expect(Math.abs(listedAdd.result.numerator)).toBe(Math.abs(add.numerator));
      expect(listedAdd.result.denominator).toBe(add.denominator);
    }

    const ops = renderOperationSelector(state, () => undefined);
    expect(ops.querySelectorAll('.fab-op-btn').length).toBeGreaterThan(0);

    state = selectOperation(state, possibles[0].operation);
    const answers = renderAnswerBoard(state, () => undefined);
    expect(answers.classList.contains('fab-answer-board')).toBe(true);
  });
});

describe('Wave 21 game-bridge — Par hand / scores / history after place', () => {
  it('hand a11y + place updates scores/history DOM', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createPar();
    const hand = renderHand(state, 'player1', () => undefined);
    expect(hand.classList.contains('par55-hand')).toBe(true);
    expect(hand.querySelectorAll('.par55-hand-block').length).toBe(
      state.hands.player1.length
    );
    expect(
      hand.querySelector('.par55-hand-block')?.getAttribute('aria-label')
    ).toBeTruthy();

    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    state = placeBlock(state, placements[0]);

    const scores = renderScores(state);
    expect(scores.textContent).toMatch(/\d/);
    const history = renderMoveHistory(state);
    expect(
      history.querySelectorAll('.par55-history-move').length
    ).toBeGreaterThan(0);

    injectPar55Styles();
    injectPar55Styles();
    expect(document.getElementById('par55-styles')).toBeTruthy();
  });
});

describe('Wave 21 game-bridge — Juggle polyomino board / dice / shapes', () => {
  it('roll→die→shape paints board cells with data-row/col', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = createJuggle();
    state = doRollDice(state);
    const dice = renderDice(
      state.currentDice,
      () => undefined,
      () => undefined,
      false,
      state.phase
    );
    expect(dice.querySelectorAll('.juggle-die').length).toBe(2);

    state = selectDie(state, 0);
    // Shape selector uses canvas previews — skip when jsdom has no canvas.
    // Die selection still advances category / phase for polyomino placement chrome.
    expect(state.selectedCategory).toBeTruthy();
    expect(['selectingShape', 'placing']).toContain(state.phase);

    const board = renderJuggleBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(board.classList.contains('juggle-board')).toBe(true);
    expect(board.querySelectorAll('.juggle-cell').length).toBeGreaterThan(10);
    expect(
      board.querySelector('.juggle-cell')?.getAttribute('data-row')
    ).toBeTruthy();

    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();
  });
});

describe('Wave 21 game-bridge — Hex board remount after legal place', () => {
  it('renderBoard paints hex cells and survives remount after makeMove', () => {
    let state = createHex(5);
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexBoard(state, container);
    expect(
      container.querySelectorAll('[data-row], .hex-cell, polygon, hexagon')
        .length
    ).toBeGreaterThan(5);

    const pos = { row: 2, col: 2 };
    expect(state.board[pos.row][pos.col]).toBeNull();
    state = hexMove(state, pos);
    expect(state.board[pos.row][pos.col]).toBe('player1');
    renderHexBoard(state, container);
    expect(
      container.querySelectorAll('[data-row], .hex-cell, polygon, hexagon')
        .length
    ).toBeGreaterThan(5);
  });
});
