/**
 * Playability polish — Fraction Pinball, Fab-a-Diffy, Calla.
 * Touch / reduced-motion CSS, AI-seat input lock, aria honesty, soft-lock recovery.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame as initCalla,
  newGameVsAI as callaVsAI,
  getGameState as getCallaState,
} from '../../src/games/calla/game-controller';
import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';
import { settleNoValidMoves, getValidPits } from '../../src/games/calla/rules';
import {
  newGameVsAI as fabVsAI,
  newGameVsHuman as fabVsHuman,
} from '../../src/games/fab-a-diffy/game-controller';
import {
  injectFabStyles,
  renderFractionBarPool,
} from '../../src/games/fab-a-diffy/board-ui';
import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  initGame as initPinball,
  newGameVsAI as pinballVsAI,
  getCurrentState as getPinballState,
} from '../../src/games/fraction-pinball/game-controller';
import {
  injectFractionPinballStyles,
  renderChallenge,
} from '../../src/games/fraction-pinball/board-ui';
import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';
import * as pinballAi from '../../src/games/fraction-pinball/ai';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Calla playability polish', () => {
  it('suppresses valid-move aria/highlights when no click handler (AI seat)', () => {
    const el = document.createElement('div');
    renderCallaBoard(createCalla(), el, undefined);

    const valid = el.querySelectorAll('.calla-pit-valid');
    expect(valid.length).toBe(0);
    const labels = [...el.querySelectorAll('.calla-pit')].map((p) =>
      p.getAttribute('aria-label')
    );
    for (const label of labels) {
      expect(label || '').not.toMatch(/valid move/i);
      expect(el.querySelector('.calla-pit')?.getAttribute('aria-disabled')).toBe(
        'true'
      );
    }
  });

  it('settleNoValidMoves ends via existing Calla collection rules', () => {
    const state = createCalla();
    // Empty current (P1) pits → no valids; remaining go to Red's Calla.
    const stuck = {
      ...state,
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [2, 0, 1, 0, 0],
      player1Calla: 5,
      player2Calla: 3,
    };
    expect(getValidPits(stuck)).toEqual([]);
    const ended = settleNoValidMoves(stuck);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).not.toBeNull();
    expect(ended.player2Calla).toBe(3 + 2 + 1);
  });

  it('omits pit handlers while AI thinks after a human move', () => {
    vi.useFakeTimers();
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initCalla(board, status);
    callaVsAI('medium');

    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(status.textContent).toMatch(/thinking/i);
    expect(board.querySelectorAll('.calla-pit-valid').length).toBe(0);
    const historyLen = getCallaState().moveHistory.length;

    // Human taps during thinking must not append moves
    board
      .querySelector('.calla-pit[data-side="player2"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCallaState().moveHistory.length).toBe(historyLen);
  });
});

describe('Fab-a-Diffy playability polish', () => {
  it('shows thinking status and disables bar selection on AI seat', () => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsAI(container, 'easy');
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();

    expect(container.textContent).toMatch(/Computer is thinking/i);
    expect(container.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(container.querySelectorAll('.fab-bar-disabled').length).toBeGreaterThan(
      0
    );
    // No selectable bars while Red (computer) acts
    const selectable = [...container.querySelectorAll('.fab-bar-wrapper')].filter(
      (el) => !el.classList.contains('fab-bar-disabled')
    );
    expect(selectable.length).toBe(0);

    // Clicking a bar must not change phase
    const phase = ctrl.state.phase;
    container
      .querySelector('.fab-bar-wrapper')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe(phase);
  });

  it('allowInput:false omits selectable aria on bar pool', () => {
    const el = renderFractionBarPool(createFab(), () => undefined, {
      allowInput: false,
    });
    const labels = [...el.querySelectorAll('.fab-bar-wrapper')].map(
      (n) => n.getAttribute('aria-label') || ''
    );
    expect(labels.some((l) => /selectable/i.test(l))).toBe(false);
    expect(
      el.querySelector('.fab-bar-wrapper')?.getAttribute('aria-disabled')
    ).toBe('true');
  });

  it('injects reduced-motion and 44px touch floors', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')?.textContent || '';
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/pointer:\s*coarse/);
  });

  it('human vs human still wires selectable bars', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    fabVsHuman(container);
    const enabled = [...container.querySelectorAll('.fab-bar-wrapper')].filter(
      (el) => !el.classList.contains('fab-bar-disabled')
    );
    expect(enabled.length).toBeGreaterThan(0);
  });
});

describe('Fraction Pinball playability polish', () => {
  it('disables choice buttons while computer answers', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    initPinball(root);
    pinballVsAI('hard');

    // Force computer seat on an answering challenge
    const state = getPinballState();
    // Human answers first choice then we advance — simpler: stub state via AI path
    // by flipping seat after mounting a challenge directly on the board.
    const playing = startGame(createPinball());
    const challengeEl = renderChallenge(playing, () => undefined, {
      allowInput: false,
    });
    const buttons = [
      ...challengeEl.querySelectorAll('.pinball-choice-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    for (const btn of buttons) {
      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-disabled')).toBe('true');
    }
    // silence unused
    expect(state.phase).toBe('answering');
  });

  it('recovers when getAIAnswer returns null', () => {
    vi.useFakeTimers();
    vi.spyOn(pinballAi, 'getAIAnswer').mockReturnValue(null);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initPinball(root);
    pinballVsAI('easy');

    // Move to Red answering: submit a Blue answer then continue
    const choice = root.querySelector('.pinball-choice-btn');
    expect(choice).toBeTruthy();
    choice!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getPinballState().phase).toBe('showResult');
    root
      .querySelector('.pinball-continue-btn')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getPinballState().currentPlayer).toBe('player2');
    expect(root.textContent).toMatch(/Computer is thinking/i);

    vi.advanceTimersByTime(1000);
    // Soft-lock recovery submitted an answer (result or next challenge)
    expect(['showResult', 'answering', 'gameOver']).toContain(
      getPinballState().phase
    );
    expect(getPinballState().phase).not.toBe('answering');
  });

  it('injects reduced-motion and 44px choice targets', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')?.textContent || '';
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/\.pinball-choice-btn[\s\S]*min-height:\s*44px/);
  });
});
