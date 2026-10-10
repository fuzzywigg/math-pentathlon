/**
 * q-mp-595 / UI coverage round 59 — calla board-ui + controller residuals.
 * Characterization: element presence + class chrome only.
 * No player-facing copy / aria-label / label text pins.
 * No AI move-choice, timing, scoring, or legal-move outcome asserts.
 * Stub AI. Use types/rules only for state setup. Hex Hard 450ms untouched.
 * Zero src product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/calla/types';
import type { CallaGameState } from '../../src/games/calla/types';
import { renderBoard, renderStatus } from '../../src/games/calla/board-ui';
import * as callaRules from '../../src/games/calla/rules';
import * as callaAi from '../../src/games/calla/ai';
import { callaTutorial } from '../../src/games/calla/tutorial';

installDomHooks({
  fakeTimers: true,
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/calla/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function mountBoardStatus(): {
  board: HTMLElement;
  status: HTMLElement;
  app: HTMLElement;
} {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  return { board, status, app };
}

describe('q-mp-595 ui-cov-r59 calla board-ui residuals', () => {
  it('empty history omits last-move; every pit has a hit target', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);

    expect(el.querySelector('.calla-last-move')).toBeNull();
    expect(el.querySelectorAll('.calla-pit').length).toBe(10);
    expect(el.querySelectorAll('.calla-pit-hit').length).toBe(10);
    expect(el.querySelector('.calla-board')).toBeTruthy();
  });

  it('winner class beats thinking flag; p2 score active class', () => {
    const base = createInitialState();
    const p1Win: CallaGameState = {
      ...base,
      phase: 'gameOver',
      winner: 'player1',
      player1Calla: 18,
      player2Calla: 12,
    };
    const thinkingWin = document.createElement('div');
    renderStatus(p1Win, thinkingWin, 'human-vs-ai', true);
    expect(thinkingWin.querySelector('.status-winner')).toBeTruthy();
    expect(thinkingWin.querySelector('.status-ai-thinking')).toBeNull();

    const tie: CallaGameState = {
      ...p1Win,
      winner: 'tie',
      player1Calla: 15,
      player2Calla: 15,
    };
    const tieEl = document.createElement('div');
    renderStatus(tie, tieEl, 'human-vs-human', true);
    expect(tieEl.querySelector('.status-winner')).toBeTruthy();
    expect(tieEl.querySelector('.status-ai-thinking')).toBeNull();

    const p2Turn: CallaGameState = {
      ...base,
      currentPlayer: 'player2',
    };
    const seatEl = document.createElement('div');
    renderStatus(p2Turn, seatEl, 'human-vs-human');
    expect(
      seatEl.querySelector('.calla-score-p2')?.classList.contains('active')
    ).toBe(true);
    expect(
      seatEl.querySelector('.calla-score-p1')?.classList.contains('active')
    ).toBe(false);
  });

  it('non-activate key leaves onPit idle; Enter still fires once', () => {
    const onPit = vi.fn();
    const el = document.createElement('div');
    renderBoard(createInitialState(), el, onPit);

    const valid = el.querySelector('.calla-pit-valid') as SVGGElement | null;
    expect(valid).toBeTruthy();

    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    );
    expect(onPit).not.toHaveBeenCalled();

    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onPit).toHaveBeenCalledTimes(1);
  });

  it('tutorial skeleton keeps id/name/step ids without copy pins', () => {
    expect(callaTutorial.id).toBe('calla-basics');
    expect(typeof callaTutorial.name).toBe('string');
    expect(callaTutorial.name.length).toBeGreaterThan(0);
    const stepIds = callaTutorial.steps.map((s) => s.id);
    expect(stepIds).toEqual([
      'welcome',
      'goal',
      'board-intro',
      'pits-explained',
      'how-to-move',
      'your-calla',
      'free-turn',
      'capture',
      'strategy-tip',
      'complete',
    ]);
    const withHighlight = callaTutorial.steps.filter(
      (s) => typeof s.highlightSelector === 'string'
    );
    expect(withHighlight.length).toBeGreaterThan(0);
    for (const step of withHighlight) {
      expect(step.highlightSelector!.startsWith('.')).toBe(true);
    }
  });
});

describe('q-mp-595 ui-cov-r59 calla controller residuals', () => {
  it('HvAI free-turn stay on P1 skips AI consult; stub AI', async () => {
    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    const aiSpy = vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 0 });
    vi.spyOn(callaRules, 'makeMove').mockImplementation((state) => ({
      ...state,
      currentPlayer: 'player1',
      phase: 'selectPit',
      winner: null,
      moveHistory: [
        ...state.moveHistory,
        {
          player: 'player1',
          pitIndex: 2,
          cubesDistributed: 3,
          captured: 0,
          gotFreeTurn: true,
          moveNumber: state.moveHistory.length + 1,
        },
      ],
    }));
    vi.spyOn(callaRules, 'isGameOver').mockReturnValue(false);

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('medium');

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().currentPlayer).toBe('player1');
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    expect(board.querySelector('.calla-pit-valid')).toBeTruthy();
    expect(aiSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(800);
    expect(aiSpy).not.toHaveBeenCalled();
    destroyGame();
  });

  it('AI thinking disarms valid pit chrome; stub AI', async () => {
    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 0 });
    vi.spyOn(callaRules, 'makeMove').mockImplementation((state) => ({
      ...state,
      currentPlayer: 'player2',
      phase: 'selectPit',
      winner: null,
      moveHistory: [
        ...state.moveHistory,
        {
          player: 'player1',
          pitIndex: 0,
          cubesDistributed: 3,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: state.moveHistory.length + 1,
        },
      ],
    }));
    vi.spyOn(callaRules, 'isGameOver').mockReturnValue(false);

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('easy');

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(board.querySelector('.calla-pit-valid')).toBeNull();
    // Do not advance AI timer — characterization is thinking-chrome only.
    destroyGame();
  });

  it('destroy mid-think invalidates pending AI generation; stub AI', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/calla/game-controller');

    const aiSpy = vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 0 });
    vi.spyOn(callaRules, 'makeMove').mockImplementation((state) => ({
      ...state,
      currentPlayer: 'player2',
      phase: 'selectPit',
      winner: null,
      moveHistory: [
        ...state.moveHistory,
        {
          player: 'player1',
          pitIndex: 0,
          cubesDistributed: 3,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: state.moveHistory.length + 1,
        },
      ],
    }));
    vi.spyOn(callaRules, 'isGameOver').mockReturnValue(false);

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('medium');

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    destroyGame();
    expect(board.childNodes.length).toBe(0);
    expect(status.childNodes.length).toBe(0);

    aiSpy.mockClear();
    vi.advanceTimersByTime(800);
    expect(aiSpy).not.toHaveBeenCalled();
  });

  it('opponent chrome toggles AI ↔ human on #app', async () => {
    const { initGame, newGameVsAI, newGameVsHuman, destroyGame } =
      await import('../../src/games/calla/game-controller');

    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 0 });

    const { board, status, app } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('easy');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    newGameVsHuman();
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);

    newGameVsAI('hard');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    destroyGame();
  });
});
