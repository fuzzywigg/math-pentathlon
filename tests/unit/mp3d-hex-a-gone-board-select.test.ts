import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';
import { createInitialState } from '../../src/games/hex-a-gone/types';

const isBoard3dEnabled = vi.fn(() => false);
const loadHexAGoneBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/hex-a-gone/board-3d-loader', () => ({
  loadHexAGoneBoard3DModule: () => loadHexAGoneBoard3DModule(),
}));

vi.mock('../../src/games/hex-a-gone/ai', () => ({
  getAISelection: (state: ReturnType<typeof createInitialState>) => {
    const shapes = [
      'triangle',
      'square',
      'rhombus',
      'trapezoid',
      'hexagon',
    ] as const;
    for (const s of shapes) {
      if (state.bank[s] > 0) return { blocks: [s] };
    }
    return null;
  },
  getAIPlacement: (state: ReturnType<typeof createInitialState>) => {
    const empty = state.board.find((c) => !c.filled);
    return empty ? { q: empty.q, r: empty.r } : null;
  },
}));

describe('mp3d Hex-a-Gone board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadHexAGoneBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      const { destroyGame } =
        await import('../../src/games/hex-a-gone/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/hex-a-gone/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadHexAGoneBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('.hex-a-gone-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view and destroyGame unmounts', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'hex-a-gone');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createHexAGoneBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadHexAGoneBoard3DModule.mockResolvedValue({
      createHexAGoneBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/hex-a-gone/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadHexAGoneBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createHexAGoneBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(
      board.querySelector('canvas[data-mp3d="hex-a-gone"]')
    ).not.toBeNull();
    expect(board.querySelector('.hex-a-gone-board')).toBeNull();
    expect(board.querySelector('.hex-a-gone-selection-area')).not.toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL create failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadHexAGoneBoard3DModule.mockResolvedValue({
      createHexAGoneBoard3D: async () => {
        throw new Error('WebGLRenderer failed');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/hex-a-gone/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.hex-a-gone-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('scripted full game vs AI through controller with 3D mocked', async () => {
    vi.useFakeTimers();
    isBoard3dEnabled.mockReturnValue(true);

    let onCellClick: ((q: number, r: number) => void) | undefined;
    const update = vi.fn(
      (_state: unknown, next?: (q: number, r: number) => void) => {
        onCellClick = next;
      }
    );

    loadHexAGoneBoard3DModule.mockResolvedValue({
      createHexAGoneBoard3D: async (
        container: HTMLElement,
        onClick?: (q: number, r: number) => void
      ) => {
        onCellClick = onClick;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('data-mp3d', 'hex-a-gone');
        container.appendChild(canvas);
        return {
          canvas,
          update,
          unmount: vi.fn(),
          cellToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const {
      initGame,
      newGameVsAI,
      whenBoard3dReady,
      getGameState,
      isUsingBoard3d,
      destroyGame,
    } = await import('../../src/games/hex-a-gone/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();
    newGameVsAI('easy');
    expect(isUsingBoard3d()).toBe(true);

    let guard = 0;
    while (!isGameOver(getGameState()) && guard < 200) {
      guard++;
      const state = getGameState();

      if (state.currentPlayer === 'player2') {
        await vi.advanceTimersByTimeAsync(900);
        continue;
      }

      if (state.phase === 'selectBlocks') {
        const pick =
          board.querySelector<HTMLButtonElement>(
            '.hex-a-gone-block-btn[data-shape="triangle"]:not(.empty)'
          ) ||
          board.querySelector<HTMLButtonElement>(
            '.hex-a-gone-block-btn:not(.empty)'
          );
        expect(pick).toBeTruthy();
        pick!.click();
        const confirm = board.querySelector<HTMLButtonElement>(
          '.hex-a-gone-confirm-btn'
        );
        expect(confirm).toBeTruthy();
        confirm!.click();
        continue;
      }

      if (state.phase === 'placeBlocks') {
        const empty = state.board.find((c) => !c.filled);
        expect(empty).toBeTruthy();
        expect(onCellClick).toBeTypeOf('function');
        onCellClick!(empty!.q, empty!.r);
      }
    }

    expect(isGameOver(getGameState())).toBe(true);
    expect(getGameState().winner).toBeTruthy();
    expect(update).toHaveBeenCalled();
    expect(isUsingBoard3d()).toBe(true);
    destroyGame();
  });
});

describe('mp3d Hex-a-Gone engine game-over sanity (no rules change)', () => {
  it('last player to place wins on a filled-out board', () => {
    let engine = createInitialState();
    while (!isGameOver(engine)) {
      const shape = (
        ['triangle', 'square', 'rhombus', 'trapezoid', 'hexagon'] as const
      ).find((s) => engine.bank[s] > 0);
      if (!shape) break;
      engine = selectBlock(engine, shape);
      engine = commitSelection(engine);
      const empty = engine.board.find((c) => !c.filled);
      if (!empty) break;
      engine = placeBlock(engine, empty.q, empty.r);
    }
    expect(isGameOver(engine)).toBe(true);
    expect(engine.winner).toBeTruthy();
  });
});
