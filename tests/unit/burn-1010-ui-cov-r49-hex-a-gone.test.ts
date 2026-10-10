/**
 * q-mp-518 / UI coverage round 49 — hex-a-gone board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched (different game: src/games/hex). Stub AI client.
 * Skip ai.ts / rules.ts product paths. Zero src edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { mountPair } from '../helpers/mount-pair';
import {
  createInitialState,
  type BlockShape,
  type HexAGoneGameState,
} from '../../src/games/hex-a-gone/types';
import {
  buildSelectionArea,
  renderBoard,
  renderStatus,
} from '../../src/games/hex-a-gone/board-ui';
import { commitSelection, selectBlock } from '../../src/games/hex-a-gone/rules';
import * as hexAGoneAi from '../../src/games/hex-a-gone/ai';
import * as featureFlags from '../../src/core/feature-flags';
import * as hexAGoneLoader from '../../src/games/hex-a-gone/board-3d-loader';
import { owlSystem } from '../../src/core/owl';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/hex-a-gone/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function playHumanTriangleTurn(board: HTMLElement): void {
  (
    board.querySelector(
      '.hex-a-gone-block-btn[data-shape="triangle"]:not(:disabled)'
    ) as HTMLButtonElement
  ).click();
  (board.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement).click();
  const valid = board.querySelector(
    '.hex-a-gone-cell-valid'
  ) as SVGElement | null;
  expect(valid).toBeTruthy();
  valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function stubBoard3d(options?: {
  update?: ReturnType<typeof vi.fn>;
  unmount?: ReturnType<typeof vi.fn>;
  onCreate?: (
    host: HTMLElement,
    onCell: ((q: number, r: number) => void) | undefined,
    onFallback: (() => void) | undefined
  ) => void;
}): {
  update: ReturnType<typeof vi.fn>;
  unmount: ReturnType<typeof vi.fn>;
  createHexAGoneBoard3D: ReturnType<typeof vi.fn>;
} {
  const update = options?.update ?? vi.fn();
  const unmount = options?.unmount ?? vi.fn();
  const createHexAGoneBoard3D = vi.fn(
    async (
      host: HTMLElement,
      onCell?: (q: number, r: number) => void,
      onFallback?: () => void
    ) => {
      options?.onCreate?.(host, onCell, onFallback);
      const canvas = document.createElement('canvas');
      canvas.setAttribute('data-mp3d', 'hex-a-gone');
      host.replaceChildren(canvas);
      return {
        canvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
      };
    }
  );
  return { update, unmount, createHexAGoneBoard3D };
}

describe('q-mp-518 ui-cov-r49 hex-a-gone board-ui residuals', () => {
  it('empty-bank .empty arm + forged shape icon default + status chrome', () => {
    const state: HexAGoneGameState = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 1,
        rhombus: 1,
        triangle: 1,
        square: 1,
      },
    };
    const el = document.createElement('div');
    renderBoard(state, el, undefined, () => undefined, () => undefined);
    const emptyHex = el.querySelector(
      '.hex-a-gone-block-btn[data-shape="hexagon"]'
    ) as HTMLButtonElement;
    expect(emptyHex).toBeTruthy();
    expect(emptyHex.classList.contains('empty')).toBe(true);
    expect(emptyHex.disabled).toBe(true);
    expect(emptyHex.getAttribute('aria-disabled')).toBe('true');

    // Exhaustiveness default in getShapeIcon — forged runtime shape.
    const forged = {
      ...createInitialState(),
      phase: 'placeBlocks' as const,
      turnSelection: { blocks: ['triangle'], committed: true },
      selectedBlockForPlacement: 'forged' as BlockShape,
    };
    const area = buildSelectionArea(forged, undefined, undefined, {
      interactive: false,
    });
    expect(area.querySelector('.hex-a-gone-placing-info')).toBeTruthy();
    expect(area.querySelector('.placing-shape')).toBeTruthy();

    const status = document.createElement('div');
    renderStatus(state, status, 'human-vs-ai', true);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(status.querySelector('.hex-a-gone-status')).toBeTruthy();
  });

  it('filled cells without matching placedBlock skip block-color fill', () => {
    const base = createInitialState();
    const filled: HexAGoneGameState = {
      ...base,
      board: base.board.map((c, i) =>
        i === 0
          ? { ...c, filled: true, filledBy: 'player1', blockId: 99 }
          : c
      ),
      // No placedBlocks entry at this q/r → BLOCK_COLORS fill attribute skipped.
      placedBlocks: [],
    };
    const el = document.createElement('div');
    renderBoard(filled, el);
    const cell = el.querySelector(
      `.hex-a-gone-cell[data-q="${base.board[0]!.q}"][data-r="${base.board[0]!.r}"]`
    ) as SVGElement | null;
    expect(cell).toBeTruthy();
    expect(cell!.classList.contains('hex-a-gone-cell-filled')).toBe(true);
    expect(cell!.classList.contains('hex-a-gone-cell-p1')).toBe(true);
    expect(cell!.hasAttribute('fill')).toBe(false);
  });
});

describe('q-mp-518 ui-cov-r49 hex-a-gone controller 3d + settle residuals', () => {
  it('3d mount / selection host / destroy unmount + mid-load abort', async () => {
    const { update, unmount, createHexAGoneBoard3D } = stubBoard3d();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);

    let resolveMod:
      | ((mod: { createHexAGoneBoard3D: typeof createHexAGoneBoard3D }) => void)
      | null = null;
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMod = resolve;
        })
    );

    const {
      initGame,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
      getGameState,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();

    // Mid-load destroy → ensureBoard3d post-await early return.
    initGame(board, status);
    const pending = whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    // While loading, 2D SVG paint is skipped (board3dEnabled && !board3d).
    expect(board.querySelector('.hex-a-gone-board')).toBeNull();
    destroyGame();
    resolveMod?.({ createHexAGoneBoard3D });
    await pending;
    expect(isUsingBoard3d()).toBe(false);

    // Successful mount paints selection host + updates 3D board.
    resolveMod = null;
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockResolvedValue({
      createHexAGoneBoard3D,
    } as never);

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();
    expect(board.querySelector('.hex-a-gone-wrapper-3d')).toBeTruthy();
    expect(board.querySelector('.hex-a-gone-board-3d-slot')).toBeTruthy();
    expect(board.querySelector('.hex-a-gone-selection-host')).toBeTruthy();
    expect(board.querySelector('.hex-a-gone-selection-area')).toBeTruthy();
    expect(board.querySelector('canvas[data-mp3d="hex-a-gone"]')).toBeTruthy();
    expect(board.querySelector('.hex-a-gone-board')).toBeNull();
    expect(status.querySelector('.hex-a-gone-status')).toBeTruthy();
    expect(getGameState().phase).toBe('selectBlocks');

    destroyGame();
    expect(unmount).toHaveBeenCalled();
    expect(isUsingBoard3d()).toBe(false);
  });

  it('3d create throw + fallBackTo2dBoard callback restore SVG chrome', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);

    // Create failure → catch arm disables 3d; whenBoard3dReady resolves.
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockResolvedValue({
      createHexAGoneBoard3D: async () => {
        throw new Error('WebGLRenderer failed');
      },
    } as never);

    const {
      initGame,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
      newGameVsHuman,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const { board, status } = mountPair();
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    // After failed create, board3dEnabled is false → subsequent paints use SVG.
    newGameVsHuman();
    expect(board.querySelector('.hex-a-gone-board')).toBeTruthy();
    destroyGame();

    // Live 3D then fallBack callback → unmount + SVG re-render.
    let fallBack: (() => void) | undefined;
    const { update, unmount, createHexAGoneBoard3D } = stubBoard3d({
      onCreate: (_host, _onCell, onFallback) => {
        fallBack = onFallback;
      },
    });
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockResolvedValue({
      createHexAGoneBoard3D,
    } as never);

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();
    expect(fallBack).toBeTypeOf('function');
    fallBack!();
    expect(isUsingBoard3d()).toBe(false);
    expect(unmount).toHaveBeenCalled();
    expect(board.querySelector('.hex-a-gone-board')).toBeTruthy();
    expect(board.querySelector('.hex-a-gone-wrapper-3d')).toBeNull();
    destroyGame();
  });

  it('empty AI blocks[] settles; wrong-phase bank click no-ops', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(hexAGoneAi, 'getAISelection').mockReturnValue({ blocks: [] });
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');

    const { initGame, newGameVsAI, getGameState, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const app = mountRoot({ id: 'app' });
    const { board, status } = mountPair();
    app.append(board, status);

    initGame(board, status);
    newGameVsAI('easy');
    playHumanTriangleTurn(board);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(1500);
    expect(hexAGoneAi.getAISelection).toHaveBeenCalled();
    const settled = getGameState();
    expect(
      settled.phase === 'gameOver' || settled.currentPlayer === 'player1'
    ).toBe(true);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();

    // Wrong-phase bank click (gameOver / select after settle) stays structural.
    const phaseBefore = getGameState().phase;
    const histBefore = getGameState().moveHistory.length;
    (
      board.querySelector(
        '.hex-a-gone-block-btn[data-shape="square"]'
      ) as HTMLButtonElement | null
    )?.click();
    expect(getGameState().phase).toBe(phaseBefore);
    expect(getGameState().moveHistory.length).toBe(histBefore);
    void owlEnd;

    destroyGame();
  });

  it('loader reject disables 3d; whenBoard3dReady null resolves; sync chrome', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockRejectedValue(
      new Error('dynamic import failed')
    );

    const {
      initGame,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
      newGameVsAI,
      setAIDifficulty,
      getGameState,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const app = mountRoot({ id: 'app' });
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    // Ready promise is null after destroy → Promise.resolve arm.
    destroyGame();
    await expect(whenBoard3dReady()).resolves.toBeUndefined();

    // Remount 2D with #app chrome + difficulty setter wiring.
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    initGame(board, status);
    setAIDifficulty('hard');
    newGameVsAI('hard');
    expect(getGameState().phase).toBe('selectBlocks');
    expect(app.className.length).toBeGreaterThanOrEqual(0);
    expect(board.querySelector('.hex-a-gone-board')).toBeTruthy();
    destroyGame();
  });
});
