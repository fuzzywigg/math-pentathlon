/**
 * q-mp-323 / UI coverage round 19 — calla board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/calla/types';
import type { CallaGameState } from '../../src/games/calla/types';
import { renderBoard, renderStatus } from '../../src/games/calla/board-ui';
import * as callaRules from '../../src/games/calla/rules';
import * as callaAi from '../../src/games/calla/ai';
import { owlSystem } from '../../src/core/owl';

installDomHooks({
  fakeTimers: true,
});

afterEach(async () => {
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

describe('q-mp-323 ui-cov-r19 calla board-ui residuals', () => {
  it('sparse pit continues + p2 click/keyboard + last-move + cube arms', () => {
    const onPit = vi.fn();
    const base = createInitialState();
    const p2Turn: CallaGameState = {
      ...base,
      currentPlayer: 'player2',
      player1Pits: sparsePits([3, 3, 3, 3, 3]),
      player2Pits: sparsePits([2, 2, 1, 0, 7]),
      lastSownPit: { side: 'player2', index: 0 },
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
    };

    const el = document.createElement('div');
    renderBoard(p2Turn, el, onPit);

    // Sparse holes skip undefined pits — fewer than 10 pit groups.
    expect(el.querySelectorAll('.calla-pit').length).toBeLessThan(10);
    expect(el.querySelector('.calla-last-move')).toBeTruthy();
    expect(
      el.querySelector('.calla-pit-last[data-side="player2"]')
    ).toBeTruthy();

    // 1-cube pit: aria present, no cube-dot group skipped for zero; 7 → no dots.
    const oneCube = el.querySelector(
      '.calla-pit[data-side="player2"][data-pit-index="2"]'
    );
    expect(oneCube?.getAttribute('role')).toBe('button');
    expect(oneCube?.hasAttribute('aria-label')).toBe(true);
    expect(
      el.querySelector(
        '.calla-pit[data-side="player2"][data-pit-index="4"] .calla-cubes'
      )
    ).toBeNull();

    const valid = el.querySelector(
      '.calla-pit-valid[data-side="player2"]'
    ) as SVGGElement | null;
    expect(valid).toBeTruthy();
    expect(valid!.getAttribute('aria-disabled')).toBeNull();
    valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onPit).toHaveBeenCalledTimes(1);
    const pitArg = onPit.mock.calls[0]?.[0] as number;
    expect(Number.isInteger(pitArg)).toBe(true);
    expect(pitArg).toBeGreaterThanOrEqual(0);
    expect(pitArg).toBeLessThan(5);

    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onPit.mock.calls.length).toBeGreaterThanOrEqual(2);

    // Locked input: no valid highlights / no click wiring.
    const locked = document.createElement('div');
    renderBoard(p2Turn, locked);
    expect(locked.querySelector('.calla-pit-valid')).toBeNull();
  });

  it('status winner chrome arms for hvAI seats + score active flip', () => {
    const p1Win: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      player1Calla: 20,
      player2Calla: 10,
    };
    const p2Win: CallaGameState = {
      ...p1Win,
      winner: 'player2',
      player1Calla: 10,
      player2Calla: 20,
      currentPlayer: 'player2',
    };
    const tie: CallaGameState = {
      ...p1Win,
      winner: 'tie',
      player1Calla: 15,
      player2Calla: 15,
    };

    const you = document.createElement('div');
    renderStatus(p1Win, you, 'human-vs-ai');
    expect(you.querySelector('.status-winner')).toBeTruthy();
    expect(you.querySelector('.calla-score-p1')).toBeTruthy();
    expect(you.querySelector('.calla-score-p2')).toBeTruthy();

    const ai = document.createElement('div');
    renderStatus(p2Win, ai, 'human-vs-ai');
    expect(ai.querySelector('.status-winner')).toBeTruthy();
    expect(
      ai.querySelector('.calla-score-p2')?.classList.contains('active')
    ).toBe(true);

    const tieEl = document.createElement('div');
    renderStatus(tie, tieEl, 'human-vs-ai');
    expect(tieEl.querySelector('.status-winner')).toBeTruthy();

    // hvAI vs hvH score chrome differs structurally (label nodes still present).
    const hvh = document.createElement('div');
    renderStatus(p1Win, hvh, 'human-vs-human');
    expect(hvh.querySelector('.status-winner')).toBeTruthy();
    expect(you.querySelector('.calla-scores')?.textContent).not.toBe(
      hvh.querySelector('.calla-scores')?.textContent
    );
  });
});

describe('q-mp-323 ui-cov-r19 calla controller residuals', () => {
  it('destroyGame clears mounts; sync chrome without #app; post-destroy no-op', async () => {
    const { initGame, newGameVsAI, destroyGame, getGameState } =
      await import('../../src/games/calla/game-controller');

    // No #app → syncOpponentChrome early return.
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsAI('easy');
    expect(board.querySelector('.calla-board')).toBeTruthy();
    expect(status.querySelector('.calla-status')).toBeTruthy();
    expect(getGameState().phase).toBe('selectPit');

    destroyGame();
    expect(board.childNodes.length).toBe(0);
    expect(status.childNodes.length).toBe(0);

    // Second destroy: null-container arms (no throw).
    destroyGame();
  });

  it('AI null + empty valids settles; chained free-turn hits gameOver gate', async () => {
    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/calla/game-controller');

    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const board = document.createElement('div');
    const status = document.createElement('div');
    const app = document.createElement('div');
    app.id = 'app';
    document.body.append(app, board, status);

    initGame(board, status);
    newGameVsAI('medium');

    // Human opens (real valids); then stub AI null + empty valids before think fires.
    board
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(1);
    expect(getGameState().currentPlayer).toBe('player2');

    vi.spyOn(callaAi, 'getAIMove').mockReturnValue(null);
    // Controller reads exported getValidPits; same-file calls inside rules.ts do not.
    vi.spyOn(callaRules, 'getValidPits').mockReturnValue([]);
    vi.spyOn(callaRules, 'settleNoValidMoves').mockImplementation((state) => ({
      ...state,
      phase: 'gameOver',
      winner: 'tie',
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 15,
      player2Calla: 15,
    }));

    vi.advanceTimersByTime(800);
    expect(getGameState().phase).toBe('gameOver');
    expect(getGameState().winner).toBe('tie');
    expect(onEnd).toHaveBeenCalledWith(
      'calla',
      expect.objectContaining({ winner: 'draw', moveCount: 1 })
    );
    expect(status.querySelector('.status-winner')).toBeTruthy();
    expect(board.querySelector('.calla-pit-valid')).toBeNull();
    expect(callaRules.settleNoValidMoves).toHaveBeenCalled();

    // Free-turn chain → second triggerAITurn sees gameOver early return.
    destroyGame();
    vi.restoreAllMocks();
    onEnd.mockClear();
    vi.spyOn(owlSystem, 'onGameEnd');

    const board2 = document.createElement('div');
    const status2 = document.createElement('div');
    document.body.append(board2, status2);
    initGame(board2, status2);
    newGameVsAI('medium');

    vi.spyOn(callaAi, 'getAIMove').mockReturnValue({ pit: 2 });
    board2
      .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    vi.advanceTimersByTime(800);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().moveHistory[1]?.gotFreeTurn).toBe(true);

    // Before chained triggerAITurn: force game-over gate (structure only).
    const overSpy = vi.spyOn(callaRules, 'isGameOver').mockReturnValue(true);
    vi.advanceTimersByTime(800);
    // Chained call no-ops; history does not grow from a second AI apply.
    expect(getGameState().moveHistory.length).toBe(2);
    overSpy.mockRestore();

    destroyGame();
  });

  it('setAIDifficulty + getCurrentHint remain wired after vsAI remount', async () => {
    const {
      initGame,
      newGameVsAI,
      setAIDifficulty,
      getCurrentHint,
      destroyGame,
    } = await import('../../src/games/calla/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    initGame(board, status);
    setAIDifficulty('hard');
    newGameVsAI('hard');
    expect(getCurrentHint()).toBeNull();
    expect(board.querySelector('.calla-board')).toBeTruthy();
    destroyGame();
  });
});
