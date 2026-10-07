/**
 * Playability polish — Fraction Pinball and Calla.
 * Touch / reduced-motion CSS, AI-seat input lock, aria honesty, soft-lock recovery.
 * Fab-a-Diffy left to draft PR #402 (worker / deadline) — do not touch here.
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
    }
    // AI / non-interactive seat: pits stay labeled but are not tab stops.
    const firstPit = el.querySelector('.calla-pit');
    expect(firstPit?.getAttribute('aria-label')).toBeTruthy();
    expect(firstPit?.getAttribute('role')).toBeNull();
    expect(firstPit?.getAttribute('tabindex')).toBeNull();
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

describe('Fraction Pinball playability polish', () => {
  it('disables choice buttons while computer answers', () => {
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
      expect(btn.getAttribute('aria-label')).toMatch(/^Answer /);
    }
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

    vi.advanceTimersByTime(650);
    // Soft-lock recovery submitted an answer (result or next challenge)
    expect(['showResult', 'answering', 'gameOver']).toContain(
      getPinballState().phase
    );
    expect(getPinballState().phase).not.toBe('answering');
  });

  it('injects reduced-motion and ≥44px choice targets', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')?.textContent || '';
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/\.pinball-choice-btn[\s\S]*min-height:\s*4[4-9]px/);
  });
});
