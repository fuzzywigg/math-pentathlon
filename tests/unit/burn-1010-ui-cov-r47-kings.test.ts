/**
 * q-mp-502 / UI coverage round 47 — kings-quadraphages board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Stub AI. Hex Hard 450ms untouched. Zero src product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import * as kingsBoardUi from '../../src/games/kings-quadraphages/board-ui';
import {
  handleCellClick,
  renderBoard,
  renderStatus,
} from '../../src/games/kings-quadraphages/board-ui';
import * as kingsAi from '../../src/games/kings-quadraphages/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as kingsLoader from '../../src/games/kings-quadraphages/board-3d-loader';
import { owlSystem } from '../../src/core/owl';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
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

function mountBoardStatus(): {
  board: HTMLElement;
  status: HTMLElement;
  history: HTMLElement;
  app: HTMLElement;
} {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  const history = mountRoot();
  return { board, status, history, app };
}

/** Fixed stub moves (0-based). Structure only — not an AI quality assert. */
const STUB_AI_MOVE_P2: kingsAi.AIMove = {
  // P2 king opens at (8,4) → step north to (7,4); place mid-board empty.
  kingMove: { row: 7, col: 4 },
  quadraphagePlacement: { row: 4, col: 4 },
};
const STUB_AI_MOVE_P1: kingsAi.AIMove = {
  // P1 king opens at (0,4) → step south to (1,4); place empty cell.
  kingMove: { row: 1, col: 4 },
  quadraphagePlacement: { row: 2, col: 2 },
};

describe('q-mp-502 ui-cov-r47 kings board-ui residuals', () => {
  it('unknown piece arm + game-over missing loser king + click without binding', () => {
    const opening = createInitialGameState();
    // Unknown piece type → neither king nor quadraphage glyph arm.
    opening.board[0]![0] = {
      type: 'not-a-piece' as never,
      owner: 'player1',
    };

    const el = document.createElement('div');
    // No onCellClick → binding early-return on click.
    renderBoard(opening, el);
    expect(el.querySelectorAll('.cell')).toHaveLength(81);
    const odd = el.querySelector(
      '.cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    expect(odd.classList.contains('cell-king')).toBe(false);
    expect(odd.classList.contains('cell-quad')).toBe(false);
    odd.click();
    expect(el.querySelector('.board')).toBeTruthy();

    // Game over with winner but loser king removed → no cell-trapped.
    const noLoserKing: GameState = {
      ...createInitialGameState(),
      turnPhase: 'gameOver',
      winner: 'player1',
    };
    // Clear player2 king at (9,5) → 0-based [8][4].
    noLoserKing.board[8]![4] = null;
    renderBoard(noLoserKing, el);
    expect(el.querySelector('.cell-trapped')).toBeNull();
    expect(el.querySelector('.phase-gameOver')).toBeTruthy();
  });

  it('status HvH / HvAI winners without copy-body pins', () => {
    const base = createInitialGameState();
    const p1: GameState = {
      ...base,
      turnPhase: 'gameOver',
      winner: 'player1',
    };
    const p2: GameState = { ...p1, winner: 'player2' };

    for (const [state, mode] of [
      [p1, 'human-vs-human'],
      [p2, 'human-vs-ai'],
      [p1, 'human-vs-ai'],
    ] as const) {
      const box = document.createElement('div');
      renderStatus(state, box, mode, 'easy');
      expect(box.querySelector('.status-winner')).toBeTruthy();
      expect(box.querySelector('.status-supplies')).toBeTruthy();
      if (mode === 'human-vs-ai') {
        expect(box.querySelector('.status-mode')).toBeTruthy();
      } else {
        expect(box.querySelector('.status-mode')).toBeNull();
      }
    }
  });
});

describe('q-mp-502 ui-cov-r47 kings controller residuals', () => {
  it('stubbed AI full move path paints place→settle without choice asserts', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    const getMove = vi
      .spyOn(kingsAi, 'getAIMove')
      .mockReturnValue(STUB_AI_MOVE_P2);

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const { board, status, history } = mountBoardStatus();
    initGame(board, status, history);
    newGameVsAI('easy', true);

    // Human completes a turn → AI seat.
    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 3, 3);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    // Thinking delay then stubbed king move (structure only).
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getMove).toHaveBeenCalled();
    expect(getGameState().turnPhase).toBe('placeQuadraphage');
    expect(getGameState().currentPlayer).toBe('player2');

    // Place delay then stubbed quad → human seat again.
    await vi.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().turnPhase).toBe('moveKing');
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(4);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    expect(
      history.querySelectorAll('.move-history-entry').length
    ).toBeGreaterThan(0);

    destroyGame();
  });

  it('gen-bump during AI place delay + syncModeChrome without #app', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(kingsAi, 'getAIMove').mockReturnValue(STUB_AI_MOVE_P2);

    const { initGame, newGameVsAI, newGameVsHuman, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    // No #app → syncModeChrome early return (line 346).
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();
    expect(getGameState().turnPhase).toBe('moveKing');
    newGameVsAI('medium', true);
    expect(document.getElementById('app')).toBeNull();

    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 4, 4);
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().turnPhase).toBe('placeQuadraphage');

    // Bump generation during place delay → place arm aborted.
    newGameVsHuman();
    await vi.advanceTimersByTimeAsync(2000);
    await Promise.resolve();
    expect(getGameState().moveHistory.length).toBe(0);
    expect(getGameState().turnPhase).toBe('moveKing');
    expect(getGameState().currentPlayer).toBe('player1');

    destroyGame();
  });

  it('reduced-motion skips invalid class; destroy then invalid click null boardContainer', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const { initGame, newGameVsHuman, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsHuman();

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );

    clickCell(board, 1, 5);
    clickCell(board, 5, 5); // invalid destination
    const bad = board.querySelector(
      '.cell[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    expect(bad.classList.contains('cell-invalid')).toBe(false);
    expect(getGameState().selectedKingPosition).toEqual({ row: 1, col: 5 });

    // Destroy clears containers; invalid click still reaches triggerInvalidAnimation.
    destroyGame();
    const hist = getGameState().moveHistory.length;
    // Keep selection in module state; invalid destination → null boardContainer arm.
    Object.assign(getGameState(), {
      selectedKingPosition: { row: 1, col: 5 },
      turnPhase: 'moveKing',
    });
    clickCell(board, 5, 5);
    expect(getGameState().moveHistory.length).toBe(hist);
    expect(getGameState().selectedKingPosition).toEqual({ row: 1, col: 5 });
  });

  it('captured handler ignores clicks while AI thinking (stub AI)', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(kingsAi, 'getAIMove').mockReturnValue(STUB_AI_MOVE_P2);

    let captured: ((row: number, col: number) => void) | undefined;
    const realRender = kingsBoardUi.renderBoard;
    vi.spyOn(kingsBoardUi, 'renderBoard').mockImplementation(
      (state, el, onClick) => {
        if (typeof onClick === 'function') {
          captured = onClick;
        }
        realRender(state, el, onClick);
      }
    );

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('easy', true);
    expect(typeof captured).toBe('function');

    clickCell(board, 1, 5);
    clickCell(board, 2, 5);
    clickCell(board, 3, 3);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    const during = getGameState().moveHistory.length;
    // Direct controller handler (board paint omits onClick while thinking).
    captured?.(1, 5);
    expect(getGameState().moveHistory.length).toBe(during);

    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().moveHistory.length).toBeGreaterThan(during);

    destroyGame();
  });

  it('tutorial handled + requiredAction arms process clicks; exited skips restart', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);

    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      getGameState,
      destroyGame,
    } = await import('../../src/games/kings-quadraphages/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsHuman();
    startTutorial();
    expect(isTutorialActive()).toBe(true);

    // Force handleAction → true (tutorial handled arm).
    const handleSpy = vi
      .spyOn(tutorialManager, 'handleAction')
      .mockReturnValue(true);
    clickCell(board, 1, 5);
    expect(handleSpy).toHaveBeenCalledWith(
      'click-cell',
      expect.objectContaining({ row: 1, col: 5 })
    );
    expect(getGameState().selectedKingPosition).toEqual({ row: 1, col: 5 });

    // requiredAction present but handleAction false → still process gameplay.
    handleSpy.mockReturnValue(false);
    vi.spyOn(tutorialManager, 'getCurrentStep').mockReturnValue({
      id: 'force-required',
      title: 'x',
      content: 'y',
      requiredAction: { type: 'click-cell', row: 9, col: 9 },
    } as never);
    // Deselect then ignore elsewhere is fine; place-phase click after move.
    clickCell(board, 1, 5); // deselect
    clickCell(board, 1, 5); // select again
    clickCell(board, 2, 5); // move
    expect(getGameState().turnPhase).toBe('placeQuadraphage');

    // Exited path unsubscribes without newGame restart.
    handleSpy.mockRestore();
    vi.mocked(tutorialManager.getCurrentStep).mockRestore();
    const histBefore = getGameState().moveHistory.length;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    // Exited must not wipe the in-progress practice board.
    expect(getGameState().moveHistory.length).toBe(histBefore);

    destroyGame();
  });

  it('game-over AI check short-circuits; 3d update path + owl p1 winner', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const update = vi.fn();
    const unmount = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(
      kingsLoader,
      'loadKingsQuadraphagesBoard3DModule'
    ).mockResolvedValue({
      createKingsQuadraphagesBoard3D: async () => ({ update, unmount }),
    } as never);

    const {
      initGame,
      newGameVsAI,
      getGameState,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const { board, status } = mountBoardStatus();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);
    initGame(board, status, undefined, newBtn);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();

    // Seed game-over while AI mode is armed → checkAndTriggerAITurn gameOver return.
    newGameVsAI('easy', true);
    Object.assign(getGameState(), {
      turnPhase: 'gameOver',
      winner: 'player1',
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
      expect.objectContaining({ winner: 'player1' })
    );
    expect(newBtn.classList.contains('game-over-active')).toBe(true);
    expect(status.querySelector('.status-winner')).toBeTruthy();

    destroyGame();
  });

  it('AI-first seat schedules stubbed turn; destroy aborts mid-think', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    const getMove = vi
      .spyOn(kingsAi, 'getAIMove')
      .mockReturnValue(STUB_AI_MOVE_P1);

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    // humanPlaysFirst=false → AI is player1; newGame triggers AI turn.
    newGameVsAI('easy', false);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(getGameState().currentPlayer).toBe('player1');

    destroyGame();
    await vi.advanceTimersByTimeAsync(2000);
    await Promise.resolve();
    // Generation bump / destroy must leave history clean.
    expect(getGameState().moveHistory.length).toBe(0);
    void getMove;

    // Re-init AI-first and let stub finish both delays.
    initGame(board, status);
    newGameVsAI('hard', false);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().turnPhase).toBe('placeQuadraphage');
    expect(getGameState().currentPlayer).toBe('player1');
    await vi.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().turnPhase).toBe('moveKing');
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(2);

    destroyGame();
  });
});
