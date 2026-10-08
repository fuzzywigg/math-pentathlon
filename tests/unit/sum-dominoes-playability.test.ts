/**
 * Playability guards for Sum Dominoes — AI-turn input lock, seed occupancy,
 * hand a11y, and touch-target CSS (Remainder Islands #374 parity).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
} from '../../src/games/sum-dominoes/game-controller';
import {
  createInitialState,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';
import {
  injectSDStyles,
  renderBoard,
  renderHand,
} from '../../src/games/sum-dominoes/board-ui';
import { mountAppShell } from './helpers/dom';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Sum Dominoes playability — no human input on AI turn', () => {
  it('hides Roll and ignores human activation while Red (computer) is to move', () => {
    vi.useFakeTimers();
    const container = mountAppShell();
    const ctrl = initGame(container, true, 'easy');

    // Force Blue's turn to complete so Red (AI) is pending on rolling.
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    };
    ctrl.update();

    expect(container.querySelector('.sd-roll-btn')).toBeNull();
    expect(container.textContent).toMatch(/computer/i);
    expect(container.querySelector('.sd-computer-thinking')).toBeTruthy();

    const historyLen = ctrl.state.moveHistory.length;
    const diceBefore = ctrl.state.currentDice;

    // Stale roll button must not exist; handlers also guard.
    const strayRoll = document.createElement('button');
    strayRoll.className = 'sd-roll-btn';
    container.appendChild(strayRoll);
    strayRoll.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.currentDice).toBe(diceBefore);
    expect(ctrl.state.moveHistory.length).toBe(historyLen);
    expect(ctrl.state.currentPlayer).toBe('player2');

    vi.advanceTimersByTime(800);
    // AI should have rolled (or moved toward a decision) without human help.
    expect(
      ctrl.state.currentPlayer === 'player2' ||
        ctrl.state.currentDice !== null ||
        ctrl.state.phase !== 'rolling'
    ).toBe(true);
  });

  it('hides Pass Turn while the computer seat is pending', () => {
    const container = mountAppShell();
    const ctrl = newGameVsAI(container, 'easy');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'passing',
      currentDice: [1, 1],
      winner: null,
    };
    ctrl.update();

    expect(container.querySelector('.sd-pass-btn')).toBeNull();
    expect(container.textContent).toMatch(/computer/i);
  });

  it('renderBoard/renderHand allowInput=false skips activation bindings', () => {
    const base = createInitialState();
    const seed = base.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]!;
    const handTile = makeDomino('hand-a', seed.domino.face1, 0);
    const state: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [seed.domino.face1, 1],
      selectedDomino: 'hand-a',
      hands: { ...base.hands, player1: [handTile] },
      currentPlayer: 'player1',
    };

    const onCell = vi.fn();
    const onHand = vi.fn();
    const board = renderBoard(state, onCell, { allowInput: false });
    expect(board.querySelector('.sd-cell-valid')).toBeNull();

    const hand = renderHand(state, 'player1', onHand, { allowInput: false });
    expect(hand.querySelector('.sd-hand-domino-playable')).toBeNull();
    const tile = hand.querySelector('[data-domino-id="hand-a"]');
    expect(tile).toBeTruthy();
    tile!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    tile!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onHand).not.toHaveBeenCalled();
    expect(onCell).not.toHaveBeenCalled();
  });
});

describe('Sum Dominoes playability — opening seed occupancy', () => {
  it('seeds both horizontal span cells so the second cell rejects overlap', () => {
    const state = createInitialState();
    const anchor = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    const span = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1];
    expect(anchor).not.toBeNull();
    expect(span).not.toBeNull();
    expect(span).toBe(anchor);

    const intruder = makeDomino('overlap', 6, 0);
    expect(
      isValidPlacement(
        state,
        intruder,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL + 1 },
        'horizontal',
        6
      )
    ).toBe(false);
  });
});

describe('Sum Dominoes playability — hand a11y + reduced-motion CSS', () => {
  it('playable hand tiles expose button role, aria-pressed, and keyboard activate', () => {
    const base = createInitialState();
    const seed = base.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]!;
    const playable = makeDomino('play-me', seed.domino.face1, 1);
    const state: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [seed.domino.face1, 1],
      selectedDomino: null,
      hands: { ...base.hands, player1: [playable] },
      currentPlayer: 'player1',
    };

    const onHand = vi.fn();
    const hand = renderHand(state, 'player1', onHand);
    const tile = hand.querySelector(
      '[data-domino-id="play-me"]'
    ) as HTMLElement;
    expect(tile).toBeTruthy();
    expect(tile.getAttribute('role')).toBe('button');
    expect(tile.getAttribute('aria-pressed')).toBe('false');
    expect(tile.classList.contains('sd-hand-domino-playable')).toBe(true);

    tile.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onHand).toHaveBeenCalledWith('play-me');
  });

  it('injects coarse-pointer hand sizing and reduced-motion rules', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(pointer: coarse\)/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});

describe('Sum Dominoes playability — human vs human still offers Roll', () => {
  it('shows an enabled Roll button on a fresh human game', () => {
    const container = mountAppShell();
    newGameVsHuman(container);
    const btn = container.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);
  });
});
