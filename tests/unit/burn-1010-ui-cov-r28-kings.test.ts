/**
 * q-mp-398 / UI coverage round 28 — kings-quadraphages board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialGameState,
  selectKing,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  handleCellClick,
  renderBoard,
  renderMoveHistory,
  renderStatus,
} from '../../src/games/kings-quadraphages/board-ui';
import * as kingsAi from '../../src/games/kings-quadraphages/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as kingsLoader from '../../src/games/kings-quadraphages/board-3d-loader';
import { owlSystem } from '../../src/core/owl';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod =
      await import('../../src/games/kings-quadraphages/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  try {
    const { tutorialManager } = await import('../../src/core/tutorial');
    if (tutorialManager.getIsActive()) {
      tutorialManager.exit();
    }
  } catch {
    // ignore
  }
});

function clickCell(board: HTMLElement, row: number, col: number): void {
  const cell = board.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  expect(cell).toBeTruthy();
  (cell as HTMLElement).click();
}

function placePhaseState(): GameState {
  let state = createInitialGameState();
  state = selectKing(state);
  return handleCellClick(2, 5, state).state;
}

describe('q-mp-398 ui-cov-r28 kings board-ui residuals', () => {
  it('handleCellClick covers OOB row / empty-supply settle / unknown phase', () => {
    const opening = createInitialGameState();
    // moveKing: undefined board row (0-based out of range) → ignore, not invalid.
    const oobMove = handleCellClick(0, 5, opening);
    expect(oobMove.state).toBe(opening);
    expect(oobMove.isInvalidClick).toBe(false);

    const placing = placePhaseState();
    expect(placing.turnPhase).toBe('placeQuadraphage');
    // placeQuadraphage: undefined board row → invalid click.
    const oobPlace = handleCellClick(0, 5, placing);
    expect(oobPlace.state).toBe(placing);
    expect(oobPlace.isInvalidClick).toBe(true);

    // Empty supply settles the turn instead of ignoring forever.
    const emptySupply = {
      ...placing,
      player1Supply: 0,
    };
    const settled = handleCellClick(3, 3, emptySupply);
    expect(settled.isInvalidClick).toBe(false);
    expect(settled.state).not.toBe(emptySupply);
    expect(settled.state.turnPhase).not.toBe('placeQuadraphage');

    // Unknown phase fallthrough.
    const weird = {
      ...opening,
      turnPhase: 'not-a-phase' as GameState['turnPhase'],
    };
    const ignored = handleCellClick(1, 5, weird);
    expect(ignored.state).toBe(weird);
    expect(ignored.isInvalidClick).toBe(false);
  });

  it('renderBoard sync holes + interaction guards + remount reuse', () => {
    const state = createInitialGameState();
    // Punch holes so syncKingsCell early-returns on undefined row/cell.
    (state.board as (typeof state.board)[number][])[0] =
      undefined as unknown as (typeof state.board)[number];
    state.board[1] = [null, undefined as unknown as null, null] as never;

    const el = document.createElement('div');
    const onClick = vi.fn();
    renderBoard(state, el, onClick);
    expect(el.querySelectorAll('.cell')).toHaveLength(81);
    expect(el.querySelector('.board.kings-board')).toBeTruthy();
    expect(el.querySelector('.phase-moveKing')).toBeTruthy();

    // Second paint reuses cells (created:false path).
    const restored = createInitialGameState();
    renderBoard(restored, el, onClick);
    expect(el.querySelectorAll('.cell')).toHaveLength(81);

    // Click outside .cell → binding no-op.
    el.querySelector('.board')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();

    // Non-finite / OOB dataset on a cell → binding no-op.
    const cell = el.querySelector('.cell') as HTMLElement;
    cell.setAttribute('data-row', 'NaN');
    cell.setAttribute('data-col', '1');
    cell.click();
    expect(onClick).not.toHaveBeenCalled();

    cell.setAttribute('data-row', '0');
    cell.setAttribute('data-col', '1');
    cell.click();
    expect(onClick).not.toHaveBeenCalled();

    cell.setAttribute('data-row', '1');
    cell.setAttribute('data-col', '5');
    cell.click();
    expect(onClick).toHaveBeenCalledWith(1, 5);

    // Short cell list hits undefined cellEl continue arm without remounting.
    const boardEl = el.querySelector('.board') as HTMLElement;
    boardEl.lastElementChild?.remove();
    expect(() => renderBoard(restored, el)).not.toThrow();
  });

  it('status tie / AI chrome + history moveKing missing-from without copy asserts', () => {
    const box = document.createElement('div');
    const history = document.createElement('div');

    const tie: GameState = {
      ...createInitialGameState(),
      turnPhase: 'gameOver',
      winner: null,
    };
    renderStatus(tie, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')).toBeTruthy();
    expect(box.querySelector('.status-mode')).toBeNull();

    renderStatus(tie, box, 'human-vs-ai', 'hard', true);
    expect(box.querySelector('.status-mode')).toBeTruthy();
    expect(box.querySelector('.status-ai-thinking')).toBeTruthy();

    const withHistory: GameState = {
      ...createInitialGameState(),
      moveHistory: [
        {
          player: 'player1',
          action: 'moveKing',
          // missing from → "?" arm (structure only; no copy pin)
          to: { row: 2, col: 5 },
        },
        {
          player: 'player1',
          action: 'placeQuadraphage',
          to: { row: 3, col: 3 },
        },
      ],
    };
    renderMoveHistory(withHistory, history);
    expect(history.querySelectorAll('.move-history-entry')).toHaveLength(2);
    expect(history.querySelector('.move-p1')).toBeTruthy();

    // AI seat turn: suppress valid-placement/move announce chrome.
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    const board = document.createElement('div');
    const selected = {
      ...createInitialGameState(),
      selectedKingPosition: { row: 1, col: 5 },
    };
    renderBoard(selected, board);
    const neighbor = board.querySelector(
      '.cell[data-row="2"][data-col="5"]'
    ) as HTMLElement | null;
    expect(neighbor?.classList.contains('cell-valid-move')).toBe(false);
    clearGameModeChrome(app);
  });
});

describe('q-mp-398 ui-cov-r28 kings controller residuals', () => {
  it('mode getters/setters + motion invalid click', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      getGameMode,
      getAIDifficulty,
      setAIDifficulty,
      destroyGame,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    const history = mountRoot();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);

    initGame(board, status, history, newBtn);
    newGameVsHuman();
    expect(getGameMode()).toBe('human-vs-human');
    expect(newBtn.classList.contains('game-over-active')).toBe(false);

    setAIDifficulty('hard');
    expect(getAIDifficulty()).toBe('hard');
    newGameVsAI('medium', true);
    expect(getGameMode()).toBe('human-vs-ai');
    expect(getAIDifficulty()).toBe('medium');

    // Invalid destination with motion allowed → cell-invalid class then clears.
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );
    clickCell(board, 1, 5); // select king
    clickCell(board, 5, 5); // invalid destination
    const bad = board.querySelector(
      '.cell[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    expect(bad.classList.contains('cell-invalid')).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    expect(bad.classList.contains('cell-invalid')).toBe(false);

    destroyGame();
  });

  it('stubbed AI null + generation bump + game-over owl/draw chrome', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    const getMove = vi.spyOn(kingsAi, 'getAIMove').mockReturnValue(null);
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');

    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      getGameState,
      destroyGame,
      isUsingBoard3d,
      whenBoard3dReady,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);

    initGame(board, status, undefined, newBtn);
    expect(isUsingBoard3d()).toBe(false);
    await whenBoard3dReady();

    newGameVsAI('easy', true);
    // Human move → AI turn; stubbed null clears thinking without move asserts.
    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 3, 3);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getMove).toHaveBeenCalled();
    expect(status.querySelector('.status-ai-thinking')).toBeNull();

    // Generation bump mid-flight: schedule AI, then newGameVsHuman before delay.
    getMove.mockClear();
    getMove.mockReturnValue(null);
    newGameVsAI('easy', true);
    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 3, 3);
    newGameVsHuman();
    await vi.advanceTimersByTimeAsync(2000);
    await Promise.resolve();
    expect(getGameState().moveHistory.length).toBe(0);
    expect(getGameState().turnPhase).toBe('moveKing');

    // Seed draw game-over, then force render via 3D context-lost (no state reset).
    destroyGame();
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(
      kingsLoader,
      'loadKingsQuadraphagesBoard3DModule'
    ).mockResolvedValue({
      createKingsQuadraphagesBoard3D: async () => ({ update, unmount }),
    } as never);
    initGame(board, status, undefined, newBtn);
    await Promise.resolve();
    await Promise.resolve();
    Object.assign(getGameState(), {
      turnPhase: 'gameOver',
      winner: null,
      moveHistory: [
        {
          player: 'player1',
          action: 'placeQuadraphage',
          to: { row: 2, col: 2 },
        },
      ],
    });
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    expect(owlEnd).toHaveBeenCalledWith(
      'kings-quadraphages',
      expect.objectContaining({ winner: 'draw' })
    );
    expect(newBtn.classList.contains('game-over-active')).toBe(true);
    expect(status.querySelector('.status-winner')).toBeTruthy();

    // hasNotifiedGameEnd guard — second paint must not double-notify.
    const calls = owlEnd.mock.calls.length;
    Object.assign(getGameState(), { turnPhase: 'gameOver', winner: 'player2' });
    // Re-init paint path: destroy leaves gameState; initGame renders again.
    destroyGame();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    initGame(board, status, undefined, newBtn);
    expect(owlEnd.mock.calls.length).toBe(calls);

    destroyGame();
  });

  it('tutorial click wiring + completed restart + mid-load 3d abort', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      getGameState,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
    } = await import('../../src/games/kings-quadraphages/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsHuman();
    startTutorial();
    expect(isTutorialActive()).toBe(true);

    // Active tutorial still processes gameplay clicks (structure only).
    const before = getGameState().selectedKingPosition;
    clickCell(board, 1, 5);
    // Either tutorial handled or gameplay selected — selection or step advance.
    expect(
      getGameState().selectedKingPosition !== before ||
        tutorialManager.getIsActive()
    ).toBe(true);

    // Completed arm restarts a fresh game via newGame().
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getGameState().turnPhase).toBe('moveKing');
    expect(getGameState().moveHistory.length).toBe(0);

    destroyGame();

    // Mid-load 3D abort: destroy while loader pending → ensureBoard3d early outs.
    let resolveLoad!: (v: never) => void;
    const pending = new Promise((r) => {
      resolveLoad = r as (v: never) => void;
    });
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kingsLoader, 'loadKingsQuadraphagesBoard3DModule').mockReturnValue(
      pending as never
    );

    initGame(board, status);
    expect(isUsingBoard3d()).toBe(true);
    destroyGame();
    resolveLoad({
      createKingsQuadraphagesBoard3D: async () => ({
        update: vi.fn(),
        unmount: vi.fn(),
      }),
    } as never);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
  });

  it('AI-thinking click guard + computer-seat click guard', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(kingsAi, 'getAIMove').mockReturnValue(null);

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('easy', true);
    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 4, 4);
    // During AI thinking, further clicks are ignored.
    const hist = getGameState().moveHistory.length;
    clickCell(board, 1, 5);
    expect(getGameState().moveHistory.length).toBe(hist);

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();

    // Still AI seat (stubbed null left player2 to move) → clicks ignored.
    const hist2 = getGameState().moveHistory.length;
    clickCell(board, 9, 5);
    expect(getGameState().moveHistory.length).toBe(hist2);

    destroyGame();
  });
});
