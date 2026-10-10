/**
 * q-mp-471 / UI coverage round 42 — calla board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Stub AI. Hex Hard 450ms untouched. Zero src product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/calla/types';
import type { CallaGameState } from '../../src/games/calla/types';
import * as callaBoardUi from '../../src/games/calla/board-ui';
import { renderBoard, renderStatus } from '../../src/games/calla/board-ui';
import * as callaRules from '../../src/games/calla/rules';
import * as callaAi from '../../src/games/calla/ai';
import { owlSystem } from '../../src/core/owl';

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

function sparsePits(filled: number[]): number[] {
  const pits = [...filled];
  // Hole at index 1 → createPit loop continue arm (undefined stones).
  delete (pits as Array<number | undefined>)[1];
  return pits;
}

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

describe('q-mp-471 ui-cov-r42 calla board-ui residuals', () => {
  it('p1 sparse hole + last-sown + keyboard activate; locked aria-disabled', () => {
    const onPit = vi.fn();
    const base = createInitialState();
    const p1Turn: CallaGameState = {
      ...base,
      currentPlayer: 'player1',
      // Index 4 = 7 cubes → createPit skips .calla-cubes (only 1..6 draw dots).
      player1Pits: sparsePits([4, 4, 1, 0, 7]),
      player2Pits: [2, 2, 2, 2, 2],
      lastSownPit: { side: 'player1', index: 2 },
      moveHistory: [
        {
          player: 'player2',
          pitIndex: 1,
          cubesDistributed: 2,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: 1,
        },
      ],
    };

    const el = document.createElement('div');
    renderBoard(p1Turn, el, onPit);

    expect(el.querySelectorAll('.calla-pit').length).toBeLessThan(10);
    expect(
      el.querySelector('.calla-pit-last[data-side="player1"]')
    ).toBeTruthy();
    expect(el.querySelector('.calla-last-move')).toBeTruthy();
    expect(el.querySelector('#arrowhead-p1')).toBeTruthy();
    expect(el.querySelector('#arrowhead-p2')).toBeTruthy();
    expect(el.querySelector('.calla-store-active')).toBeTruthy();

    const oneCube = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="2"]'
    );
    expect(oneCube?.getAttribute('role')).toBe('button');
    expect(oneCube?.hasAttribute('aria-label')).toBe(true);
    expect(
      el.querySelector(
        '.calla-pit[data-side="player1"][data-pit-index="4"] .calla-cubes'
      )
    ).toBeNull();

    const valid = el.querySelector(
      '.calla-pit-valid[data-side="player1"]'
    ) as SVGGElement | null;
    expect(valid).toBeTruthy();
    expect(valid!.getAttribute('aria-disabled')).toBeNull();
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onPit).toHaveBeenCalledTimes(1);
    const pitArg = onPit.mock.calls[0]?.[0] as number;
    expect(Number.isInteger(pitArg)).toBe(true);
    expect(pitArg).toBeGreaterThanOrEqual(0);
    expect(pitArg).toBeLessThan(5);

    // Space activation (a11y bindCellActivateKeys).
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true })
    );
    expect(onPit.mock.calls.length).toBeGreaterThanOrEqual(2);

    const lockedPit = el.querySelector(
      '.calla-pit[data-side="player2"]'
    ) as SVGGElement | null;
    expect(lockedPit?.getAttribute('aria-disabled')).toBe('true');

    const locked = document.createElement('div');
    renderBoard(p1Turn, locked);
    expect(locked.querySelector('.calla-pit-valid')).toBeNull();
  });

  it('status chrome: hvH phase / thinking / winners without copy pins', () => {
    const playing = createInitialState();
    const phaseEl = document.createElement('div');
    renderStatus(playing, phaseEl, 'human-vs-human');
    expect(phaseEl.querySelector('.status-turn')).toBeTruthy();
    expect(phaseEl.querySelector('.status-ai-thinking')).toBeNull();
    expect(phaseEl.querySelector('.status-winner')).toBeNull();
    expect(
      phaseEl.querySelector('.calla-score-p1')?.classList.contains('active')
    ).toBe(true);

    const thinking = document.createElement('div');
    renderStatus(playing, thinking, 'human-vs-ai', true);
    expect(thinking.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(thinking.querySelector('.status-winner')).toBeNull();

    const p1Win: CallaGameState = {
      ...playing,
      phase: 'gameOver',
      winner: 'player1',
      player1Calla: 18,
      player2Calla: 12,
    };
    const p2Win: CallaGameState = {
      ...p1Win,
      winner: 'player2',
      currentPlayer: 'player2',
      player1Calla: 12,
      player2Calla: 18,
    };
    const tie: CallaGameState = {
      ...p1Win,
      winner: 'tie',
      player1Calla: 15,
      player2Calla: 15,
    };

    for (const [state, mode] of [
      [p1Win, 'human-vs-human'],
      [p2Win, 'human-vs-ai'],
      [tie, 'human-vs-human'],
    ] as const) {
      const el = document.createElement('div');
      renderStatus(state, el, mode);
      expect(el.querySelector('.status-winner')).toBeTruthy();
      expect(el.querySelector('.calla-scores')).toBeTruthy();
    }

    const hvai = document.createElement('div');
    const hvh = document.createElement('div');
    renderStatus(p1Win, hvai, 'human-vs-ai');
    renderStatus(p1Win, hvh, 'human-vs-human');
    expect(hvai.querySelector('.calla-scores')?.textContent).not.toBe(
      hvh.querySelector('.calla-scores')?.textContent
    );
  });
});

describe('q-mp-471 ui-cov-r42 calla controller residuals', () => {
  it('isGameOver click gate after handlers attach (stub makeMove unused)', async () => {
    const { initGame, newGameVsHuman, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsHuman();

    const valid = board.querySelector('.calla-pit-valid');
    expect(valid).toBeTruthy();
    const before = getGameState().moveHistory.length;

    vi.spyOn(callaRules, 'isGameOver').mockReturnValue(true);
    const makeSpy = vi.spyOn(callaRules, 'makeMove');
    valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(makeSpy).not.toHaveBeenCalled();
    expect(getGameState().moveHistory.length).toBe(before);
    destroyGame();
  });

  it('isAIThinking click gate via captured handler; stub AI', async () => {
    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    let captured: ((pit: number) => void) | undefined;
    const realRender = callaBoardUi.renderBoard;
    vi.spyOn(callaBoardUi, 'renderBoard').mockImplementation(
      (state, el, onPit) => {
        if (typeof onPit === 'function') {
          captured = onPit;
        }
        realRender(state, el, onPit);
      }
    );
    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 0 });

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('easy');

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(typeof captured).toBe('function');

    const during = getGameState().moveHistory.length;
    captured?.(0);
    expect(getGameState().moveHistory.length).toBe(during);

    vi.advanceTimersByTime(800);
    expect(getGameState().moveHistory.length).toBeGreaterThan(during);
    destroyGame();
  });

  it('triggerAITurn wrong-seat guard on free-turn re-entry; stub AI', async () => {
    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    // Opening P1 pit0 → AI pit2 free-turn (same structural fixture as r19).
    const aiSpy = vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 2 });
    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('medium');

    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().currentPlayer).toBe('player2');

    vi.advanceTimersByTime(800);
    expect(aiSpy).toHaveBeenCalledTimes(1);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().moveHistory[1]?.gotFreeTurn).toBe(true);

    const afterFree = getGameState().moveHistory.length;
    // Before chained triggerAITurn: force wrong seat so entry guard returns.
    getGameState().currentPlayer = 'player1';
    aiSpy.mockClear();
    vi.advanceTimersByTime(800);

    expect(aiSpy).not.toHaveBeenCalled();
    expect(getGameState().moveHistory.length).toBe(afterFree);
    destroyGame();
  });

  it('owl non-tie end notify + destroy then reset null-container render', async () => {
    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      resetGame,
      getGameState,
      destroyGame,
    } = await import('../../src/games/calla/game-controller');

    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status, app } = mountBoardStatus();
    initGame(board, status);
    newGameVsHuman();

    vi.spyOn(callaRules, 'makeMove').mockImplementation((state) => ({
      ...state,
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 20,
      player2Calla: 10,
      phase: 'gameOver',
      winner: 'player1',
      moveHistory: [
        {
          player: 'player1',
          pitIndex: 0,
          cubesDistributed: 3,
          captured: 0,
          gotFreeTurn: false,
          moveNumber: 1,
        },
      ],
    }));

    board
      .querySelector('.calla-pit-valid')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().winner).toBe('player1');
    expect(onEnd).toHaveBeenCalledWith(
      'calla',
      expect.objectContaining({ winner: 'player1', moveCount: 1 })
    );
    expect(status.querySelector('.status-winner')).toBeTruthy();

    // Null-container render arms: destroy clears mounts, reset still paints.
    destroyGame();
    expect(board.childNodes.length).toBe(0);
    expect(status.childNodes.length).toBe(0);

    vi.mocked(callaRules.makeMove).mockRestore();
    newGameVsAI('easy');
    resetGame();
    // Containers stay null after destroy — chrome nodes stay empty.
    expect(board.childNodes.length).toBe(0);
    expect(status.childNodes.length).toBe(0);
    expect(app.id).toBe('app');
  });

  it('tutorial exit unsubscribes without practice restart; hint stays null', async () => {
    const {
      initGame,
      startTutorial,
      getCurrentHint,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/calla/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(getCurrentHint()).toBeNull();
    expect(board.querySelector('.calla-board')).toBeTruthy();

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.calla-board')).toBeTruthy();
    destroyGame();
  });
});
