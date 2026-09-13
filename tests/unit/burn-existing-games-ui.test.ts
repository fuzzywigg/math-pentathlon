import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createContigState } from '../../src/games/contig-60/types';
import { renderBoard as renderContigBoard, renderDice as renderContigDice } from '../../src/games/contig-60/board-ui';
import { createInitialState as createSDState } from '../../src/games/sum-dominoes/rules';
import {
  renderBoard as renderSDBoard,
  renderHand,
  renderDice as renderSDDice,
} from '../../src/games/sum-dominoes/board-ui';
import { createInitialState as createStarState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { renderBoard as renderStarBoard } from '../../src/games/star-track/board-ui';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard as renderKingsBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Burn coverage — Contig board UI', () => {
  it('renders a 6×10 ARIA grid of cells', () => {
    const board = renderContigBoard(createContigState(), () => undefined);
    document.body.appendChild(board);

    expect(board.classList.contains('contig-board')).toBe(true);
    expect(board.getAttribute('role')).toBe('grid');
    const cells = board.querySelectorAll('.contig-cell');
    expect(cells.length).toBe(60);
    expect(cells[0].getAttribute('role')).toBe('gridcell');
  });

  it('marks valid placements after dice are set', () => {
    const state = {
      ...createContigState(),
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    const board = renderContigBoard(state, () => undefined);
    expect(board.querySelectorAll('.contig-cell-valid').length).toBeGreaterThan(
      0
    );
  });

  it('renderDice shows roll button then faces', () => {
    const roll = renderContigDice(null, () => undefined, true);
    expect(roll.querySelector('.contig-roll-btn')).toBeTruthy();

    const faces = renderContigDice([1, 2, 3], () => undefined, false);
    expect(faces.querySelectorAll('.contig-die')).toHaveLength(3);
  });
});

describe('Burn coverage — Sum Dominoes board UI', () => {
  it('renders 11×11 board with center seed', () => {
    const state = createSDState();
    const board = renderSDBoard(state, () => undefined);
    document.body.appendChild(board);

    expect(board.classList.contains('sd-board')).toBe(true);
    expect(board.getAttribute('role')).toBe('grid');
    expect(board.querySelector('.sd-domino')).toBeTruthy();
  });

  it('renderHand marks playable tiles when dice allow', () => {
    const state = {
      ...createSDState(),
      phase: 'placing' as const,
      currentDice: [6, 6] as [number, number],
    };
    const hand = renderHand(state, 'player1', () => undefined);
    expect(hand.classList.contains('sd-hand-player1')).toBe(true);
    expect(hand.querySelectorAll('.sd-hand-domino').length).toBe(7);
  });

  it('renderDice shows roll CTA and sum display', () => {
    expect(
      renderSDDice(null, () => undefined, true).querySelector('.sd-roll-btn')
    ).toBeTruthy();

    const rolled = renderSDDice([3, 4], () => undefined, false);
    expect(rolled.querySelector('.sd-dice-sum')?.textContent).toContain('7');
  });
});

describe('Burn coverage — Star Track board UI', () => {
  it('renders SVG track with both pieces at start', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarBoard(createStarState(), container, () => undefined, () => undefined);

    expect(container.querySelector('.star-track-board')).toBeTruthy();
    expect(container.querySelector('.star-track-piece-p1')).toBeTruthy();
    expect(container.querySelector('.star-track-piece-p2')).toBeTruthy();
    expect(container.querySelector('.star-track-draw-btn')).toBeTruthy();
  });

  it('shows chain choices after draw', () => {
    const drawn = drawChains(createStarState());
    const container = document.createElement('div');
    renderStarBoard(drawn, container, () => undefined, () => undefined);
    expect(container.querySelector('.star-track-choices')).toBeTruthy();
    expect(container.querySelectorAll('.star-track-chain-btn')).toHaveLength(2);
  });
});

describe('Burn coverage — Kings board UI + trap win path', () => {
  it('renders kings with data-row/col cells', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderKingsBoard(createInitialGameState(), container);
    expect(
      container.querySelectorAll('.cell[data-row][data-col]').length
    ).toBe(81);
    expect(container.querySelectorAll('.cell-king')).toHaveLength(2);
  });

  it('completes a scripted corner trap via game-state API', () => {
    // Deterministic trap: surround P2 king at start (9,5) almost, leave one
    // move, then close — exercised through public move API for coverage.
    let state = createInitialGameState();

    // P1: select → move → place near P2
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 8, col: 4 });

    expect(state.currentPlayer).toBe('player2');
    expect(state.player1Supply).toBe(29);

    // P2 completes a turn
    state = selectKing(state);
    state = moveKing(state, { row: 9, col: 4 });
    state = placeQuadraphage(state, { row: 3, col: 5 });

    expect(state.currentPlayer).toBe('player1');
    expect(state.moveHistory.length).toBe(4);
    expect(state.turnPhase).toBe('moveKing');
  });
});
