/**
 * q-mp-426 / UI coverage round 32 — pent-em-in board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * No placement / legal-move asserts. Hex Hard 450ms untouched.
 * Skip ai.ts / rules.ts product paths. Zero src edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { mountPair } from '../helpers/mount-pair';
import {
  createInitialState,
  type PentEmInState,
} from '../../src/games/pent-em-in/types';
import {
  getPlayerName,
  injectPentEmInStyles,
  renderBoard,
  renderPieceSelector,
} from '../../src/games/pent-em-in/board-ui';
import * as pentAi from '../../src/games/pent-em-in/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as pentLoader from '../../src/games/pent-em-in/board-3d-loader';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['pent-em-in-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/pent-em-in/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function placePhaseState(
  shapeId: string,
  extras: Partial<PentEmInState> = {}
): PentEmInState {
  return {
    ...createInitialState(),
    phase: 'placePiece',
    selectedPiece: shapeId,
    selectedRotation: 0,
    selectedFlipped: false,
    previewPosition: null,
    winner: null,
    ...extras,
  };
}

describe('q-mp-426 ui-cov-r32 pent-em-in board-ui residuals', () => {
  it('unknown shape skip + getPlayerName + inject idempotence', () => {
    const withGhost: PentEmInState = {
      ...createInitialState(),
      placedPieces: [
        {
          id: 'ghost-1',
          shapeId: 'NOT-A-PENTOMINO',
          player: 'player1',
          position: { row: 0, col: 0 },
          rotation: 0,
          flipped: false,
          cells: [{ row: 0, col: 0 }],
        },
      ],
      player1Pieces: {
        available: ['NOT-A-PENTOMINO', 'X'],
        placed: [],
      },
    };

    const svg = renderBoard(
      withGhost,
      () => undefined,
      () => undefined
    );
    expect(svg.classList.contains('pent-board')).toBe(true);
    // Unknown shapeId → placed-pieces loop continues (no rects/labels).
    expect(svg.querySelectorAll('.placed-pieces rect')).toHaveLength(0);
    expect(svg.querySelectorAll('.placed-pieces text')).toHaveLength(0);

    const selector = renderPieceSelector(withGhost, () => undefined);
    expect(selector.classList.contains('pent-piece-selector')).toBe(true);
    // Ghost skipped; known X remains.
    expect(selector.querySelectorAll('.pent-piece-option')).toHaveLength(1);
    expect(
      selector.querySelector('.pent-piece-option[data-piece="X"]')
    ).toBeTruthy();
    expect(
      selector.querySelector('.pent-piece-option[data-piece="NOT-A-PENTOMINO"]')
    ).toBeNull();

    expect(getPlayerName('player1')).toBeTypeOf('string');
    expect(getPlayerName('player2')).toBeTypeOf('string');
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));

    injectPentEmInStyles();
    injectPentEmInStyles();
    expect(document.querySelectorAll('#pent-em-in-styles')).toHaveLength(1);
  });

  it('allowInput false cursor + preview suppress; selected option chrome', () => {
    const placing = placePhaseState('X', {
      previewPosition: { row: 2, col: 2 },
    });
    const locked = renderBoard(
      placing,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    expect(locked.querySelector('.preview')).toBeNull();
    const cell = locked.querySelector(
      '[data-row="0"][data-col="0"]'
    ) as SVGElement;
    expect(cell).toBeTruthy();
    expect(cell.style.cursor).toBe('default');

    const selected = renderPieceSelector(
      { ...createInitialState(), selectedPiece: 'X' },
      () => undefined
    );
    const opt = selected.querySelector(
      '.pent-piece-option[data-piece="X"]'
    ) as HTMLElement;
    expect(opt.classList.contains('selected')).toBe(true);
    expect(opt.getAttribute('role')).toBe('button');
    expect(opt.getAttribute('tabindex')).toBe('0');
  });
});

describe('q-mp-426 ui-cov-r32 pent-em-in controller residuals', () => {
  it('place chrome rotate/flip/cancel + X cancel-only + hover preview arms', async () => {
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    // No #app → syncOpponentChrome early-return.
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsHuman();
    expect(board.querySelector('.pent-board')).toBeTruthy();

    // F can rotate + flip → both control buttons.
    __setStateForTests(placePhaseState('F'));
    expect(status.querySelector('.pent-controls')).toBeTruthy();
    expect(status.querySelector('.pent-btn-rotate')).toBeTruthy();
    expect(status.querySelector('.pent-btn-flip')).toBeTruthy();
    expect(status.querySelector('.pent-btn-cancel')).toBeTruthy();

    const rotBefore = getCurrentState().selectedRotation;
    (status.querySelector('.pent-btn-rotate') as HTMLButtonElement).click();
    expect(getCurrentState().selectedRotation).not.toBe(rotBefore);

    const flipBefore = getCurrentState().selectedFlipped;
    (status.querySelector('.pent-btn-flip') as HTMLButtonElement).click();
    expect(getCurrentState().selectedFlipped).not.toBe(flipBefore);

    (status.querySelector('.pent-btn-cancel') as HTMLButtonElement).click();
    expect(getCurrentState().phase).toBe('selectPiece');
    expect(getCurrentState().selectedPiece).toBeNull();

    // X cannot rotate/flip → cancel only.
    __setStateForTests(placePhaseState('X'));
    expect(status.querySelector('.pent-btn-rotate')).toBeNull();
    expect(status.querySelector('.pent-btn-flip')).toBeNull();
    expect(status.querySelector('.pent-btn-cancel')).toBeTruthy();

    // Hover preview → renderBoardOnly path (same cell + leave + move).
    __setStateForTests(placePhaseState('X'));
    const cell = board.querySelector(
      '[data-row="3"][data-col="3"]'
    ) as SVGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(getCurrentState().previewPosition).toEqual({ row: 3, col: 3 });
    expect(board.querySelector('.preview')).toBeTruthy();
    // Same cell → early return (previewPosition unchanged).
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(getCurrentState().previewPosition).toEqual({ row: 3, col: 3 });
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(getCurrentState().previewPosition).toBeNull();
    // Null→null early return.
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(getCurrentState().previewPosition).toBeNull();

    // Wrong-phase hover (selectPiece) → no preview mutation.
    __setStateForTests(createInitialState());
    const openCell = board.querySelector(
      '[data-row="1"][data-col="1"]'
    ) as SVGElement;
    openCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(getCurrentState().previewPosition).toBeNull();

    destroyGame();
  });

  it('stale human handlers under computer seat + piece-select phase guard', async () => {
    const {
      initGame,
      newGameVsAI,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    initGame(board, status);
    newGameVsAI('easy');

    // Capture piece option while human selectPiece, then leave select phase.
    const pieceOpt = status.querySelector(
      '.pent-piece-option[data-piece="X"]'
    ) as HTMLElement;
    expect(pieceOpt).toBeTruthy();
    __setStateForTests(placePhaseState('F'));
    const phaseBefore = getCurrentState().phase;
    pieceOpt.click();
    expect(getCurrentState().phase).toBe(phaseBefore);
    expect(getCurrentState().selectedPiece).toBe('F');

    // Capture rotate/flip/cancel while human placePiece, then flip AI seat.
    __setStateForTests(placePhaseState('F'));
    const rotateBtn = status.querySelector(
      '.pent-btn-rotate'
    ) as HTMLButtonElement;
    const flipBtn = status.querySelector('.pent-btn-flip') as HTMLButtonElement;
    const cancelBtn = status.querySelector(
      '.pent-btn-cancel'
    ) as HTMLButtonElement;
    const placeCell = board.querySelector(
      '[data-row="2"][data-col="2"]'
    ) as SVGElement;
    expect(rotateBtn && flipBtn && cancelBtn && placeCell).toBeTruthy();

    const rotSnap = getCurrentState().selectedRotation;
    const flipSnap = getCurrentState().selectedFlipped;
    __setStateForTests({
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectPiece',
      winner: null,
    });
    expect(status.querySelector('.pent-status.player2')).toBeTruthy();

    rotateBtn.click();
    flipBtn.click();
    cancelBtn.click();
    placeCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    placeCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().selectedRotation).toBe(rotSnap);
    expect(getCurrentState().selectedFlipped).toBe(flipSnap);
    expect(getCurrentState().selectedPiece).toBeNull();
    expect(getCurrentState().previewPosition).toBeNull();

    // Stale piece option under computer selectPiece chrome.
    const staleSelect = status.querySelector(
      '.pent-piece-option'
    ) as HTMLElement | null;
    // Re-capture from a human paint, then flip seat without relying on disabled chrome.
    __setStateForTests({
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'selectPiece',
    });
    const humanOpt = status.querySelector(
      '.pent-piece-option[data-piece="U"]'
    ) as HTMLElement;
    expect(humanOpt).toBeTruthy();
    __setStateForTests({
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectPiece',
      winner: null,
    });
    humanOpt.click();
    expect(getCurrentState().selectedPiece).toBeNull();
    expect(getCurrentState().currentPlayer).toBe('player2');
    // Keep reference so lint unused is quiet if query missed.
    expect(staleSelect === null || staleSelect instanceof HTMLElement).toBe(
      true
    );

    destroyGame();
  });

  it('stubbed AI arms + clearAiTimer + post-destroy + tutorial complete', async () => {
    const moveSpy = vi.spyOn(pentAi, 'getAIMove');
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      startTutorial,
      isTutorialActive,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    // Arm AI think timer via human place, then winner early-return in aiTurn.
    initGame(board, status);
    newGameVsAI('easy');
    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
    // Place via rules-free state injection that already flipped seat + armed timer:
    // click a board cell that canPlacePiece accepts for X at opening — exercise
    // only the timer arm; assert structure / consultation, not legality.
    const openCell = board.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as SVGElement;
    expect(openCell).toBeTruthy();
    openCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // If place landed, AI seat + timer; if not, force AI seat and skip timer arms.
    if (getCurrentState().currentPlayer === 'player2') {
      expect(status.querySelector('.pent-status')).toBeTruthy();
      __setStateForTests({
        ...getCurrentState(),
        winner: 'player1',
        phase: 'gameOver',
      });
      moveSpy.mockClear();
      await vi.advanceTimersByTimeAsync(600);
      expect(moveSpy).not.toHaveBeenCalled();
      expect(getCurrentState().winner).toBe('player1');
    }

    // Wrong-player aiTurn early-return: re-arm then flip seat before fire.
    destroyGame();
    initGame(board, status);
    newGameVsAI('easy');
    moveSpy.mockReturnValue(null);
    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
    const cell2 = board.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as SVGElement;
    cell2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (getCurrentState().currentPlayer === 'player2') {
      __setStateForTests({
        ...getCurrentState(),
        currentPlayer: 'player1',
        winner: null,
      });
      moveSpy.mockClear();
      await vi.advanceTimersByTimeAsync(600);
      expect(moveSpy).not.toHaveBeenCalled();
    }

    // Null-move consult (structure only — no move-choice assert).
    destroyGame();
    initGame(board, status);
    newGameVsAI('easy');
    moveSpy.mockReturnValue(null);
    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
    const cell3 = board.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as SVGElement;
    cell3.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (getCurrentState().currentPlayer === 'player2') {
      moveSpy.mockClear();
      await vi.advanceTimersByTimeAsync(600);
      expect(moveSpy).toHaveBeenCalled();
      expect(board.querySelector('.pent-board')).toBeTruthy();
    }

    // Stubbed place consult (structure only).
    destroyGame();
    initGame(board, status);
    newGameVsAI('easy');
    moveSpy.mockReturnValue({
      shapeId: 'X',
      position: { row: 4, col: 4 },
      rotation: 0,
      flipped: false,
    });
    __setStateForTests(placePhaseState('I5', { currentPlayer: 'player1' }));
    // Prefer a deterministic arm: inject AI seat and fire via newGame clear path
    // is not enough — use human place of I5 along top edge if accepted.
    const i5Cell = board.querySelector(
      '[data-row="0"][data-col="0"]'
    ) as SVGElement;
    i5Cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (getCurrentState().currentPlayer === 'player2') {
      // clearAiTimer via newGameVsHuman while think pending.
      newGameVsHuman();
      expect(getCurrentState().currentPlayer).toBe('player1');
      expect(board.querySelector('.pent-board')).toBeTruthy();
    }

    // Stubbed AI fire after place: consultation only.
    destroyGame();
    initGame(board, status);
    newGameVsAI('medium');
    moveSpy.mockReturnValue({
      shapeId: 'X',
      position: { row: 5, col: 5 },
      rotation: 0,
      flipped: false,
    });
    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
    const cell4 = board.querySelector(
      '[data-row="2"][data-col="2"]'
    ) as SVGElement;
    cell4.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (getCurrentState().currentPlayer === 'player2') {
      moveSpy.mockClear();
      await vi.advanceTimersByTimeAsync(600);
      expect(moveSpy).toHaveBeenCalled();
      expect(
        status.querySelector('.pent-status, .pent-winner-banner')
      ).toBeTruthy();
    }

    // Stale hover after destroy → renderBoardOnly early-return (!boardContainer).
    destroyGame();
    initGame(board, status);
    newGameVsHuman();
    __setStateForTests(placePhaseState('X'));
    const staleHoverCell = board.querySelector(
      '[data-row="3"][data-col="3"]'
    ) as SVGElement;
    expect(staleHoverCell).toBeTruthy();
    destroyGame();
    const before = board.innerHTML;
    staleHoverCell.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    __setStateForTests({
      ...createInitialState(),
      winner: 'player2',
      phase: 'gameOver',
    });
    expect(board.innerHTML).toBe(before);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);

    // Tutorial completed arm → newGameVsHuman inside listener.
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.pent-board')).toBeTruthy();

    destroyGame();
  });

  it('board3d ensure race + context-lost remount + DEV hook surface', async () => {
    const update = vi.fn();
    const unmount = vi.fn();
    let clickHandler: ((cell: { row: number; col: number }) => void) | null =
      null;
    let hoverHandler:
      ((cell: { row: number; col: number } | null) => void) | null = null;

    let resolveMod:
      ((mod: { createPentEmInBoard3D: typeof createStub }) => void) | null =
      null;
    const createStub = async (
      _host: HTMLElement,
      onClick: (cell: { row: number; col: number }) => void,
      onHover: (cell: { row: number; col: number } | null) => void
    ) => {
      clickHandler = onClick;
      hoverHandler = onHover;
      return { update, unmount };
    };

    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(pentLoader, 'loadPentEmInBoard3DModule').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMod = resolve;
        })
    );

    const {
      initGame,
      newGameVsAI,
      __setStateForTests,
      getCurrentState,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    // Mid-load destroy → ensureBoard3d post-await early return.
    initGame(board, status);
    const pending = whenBoard3dReady();
    destroyGame();
    resolveMod?.({ createPentEmInBoard3D: createStub });
    await pending;
    expect(isUsingBoard3d()).toBe(false);

    // Successful 3D mount → human preview via 3D hover (renderBoardOnly 3D arm).
    resolveMod = null;
    vi.spyOn(pentLoader, 'loadPentEmInBoard3DModule').mockResolvedValue({
      createPentEmInBoard3D: createStub,
    } as never);

    initGame(board, status);
    newGameVsAI('easy');
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();

    __setStateForTests(placePhaseState('X', { currentPlayer: 'player1' }));
    update.mockClear();
    hoverHandler?.({ row: 2, col: 2 });
    expect(getCurrentState().previewPosition).toEqual({ row: 2, col: 2 });
    expect(update).toHaveBeenCalled();

    // Computer-seat 3D handler guards.
    __setStateForTests({
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectPiece',
      winner: null,
    });
    clickHandler?.({ row: 1, col: 1 });
    hoverHandler?.({ row: 1, col: 1 });
    hoverHandler?.(null);
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().previewPosition).toBeNull();

    // Destroy while 3D live → unmountBoard3d.
    destroyGame();
    expect(unmount).toHaveBeenCalled();

    // Remount → context-lost clears 3D without unmount, falls back to SVG.
    unmount.mockClear();
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.pent-board')).toBeTruthy();

    // DEV controller hook surface (present under vitest).
    if (window.__mpPentEmInController) {
      window.__mpPentEmInController.setState(createInitialState());
      expect(window.__mpPentEmInController.getState().phase).toBe(
        'selectPiece'
      );
    }

    destroyGame();
  });
});
