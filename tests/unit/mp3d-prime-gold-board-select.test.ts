import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const isBoard3dEnabled = vi.fn(() => false);
const loadPrimeGoldBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/prime-gold/board-3d-loader', () => ({
  loadPrimeGoldBoard3DModule: () => loadPrimeGoldBoard3DModule(),
}));

describe('mp3d Prime Gold board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadPrimeGoldBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/prime-gold/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/prime-gold/game-controller');

    const board = document.createElement('div');
    document.body.append(board);

    initGame(board, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadPrimeGoldBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('.pg-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'prime-gold');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createPrimeGoldBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      const a11y = document.createElement('div');
      a11y.className = 'pg-a11y-grid';
      container.appendChild(a11y);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
        valueToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadPrimeGoldBoard3DModule.mockResolvedValue({
      createPrimeGoldBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/prime-gold/game-controller');

    const board = document.createElement('div');
    document.body.append(board);

    initGame(board, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadPrimeGoldBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createPrimeGoldBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(
      board.querySelector('canvas[data-mp3d="prime-gold"]')
    ).not.toBeNull();
    expect(board.querySelector('.pg-board')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL mount failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadPrimeGoldBoard3DModule.mockResolvedValue({
      createPrimeGoldBoard3D: async () => {
        throw new Error('WebGLRenderer failed — Prime Gold 3D board cannot mount');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/prime-gold/game-controller');

    const board = document.createElement('div');
    document.body.append(board);

    initGame(board, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.pg-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('webglcontextlost falls back to playable 2D board and preserves game state', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'prime-gold');
    let hostEl: HTMLElement | null = null;
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createPrimeGoldBoard3D = vi.fn(async (container: HTMLElement) => {
      hostEl = container;
      container.replaceChildren(fakeCanvas);
      const a11y = document.createElement('div');
      a11y.className = 'pg-a11y-grid';
      container.appendChild(a11y);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
        valueToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadPrimeGoldBoard3DModule.mockResolvedValue({
      createPrimeGoldBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, getGameState } =
      await import('../../src/games/prime-gold/game-controller');

    const board = document.createElement('div');
    document.body.append(board);

    const controller = initGame(board, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(hostEl).not.toBeNull();

    const before = getGameState()!;
    const center = before.cells.get('3,3')!;
    before.cells.set('3,3', { ...center, owner: 'player1' });
    before.playerChips = { ...before.playerChips, player1: 19 };
    before.phase = 'placing';
    controller.state = before;
    controller.update();

    // Board already tore itself down; notify like the real 3D module.
    unmount();
    hostEl!.dispatchEvent(new CustomEvent('mp3d-context-lost'));

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
    const pgBoard = board.querySelector('.pg-board');
    expect(pgBoard).not.toBeNull();
    expect(
      pgBoard!.querySelector(`.pg-cell.player1[data-value="${center.value}"]`)
    ).not.toBeNull();

    const after = getGameState()!;
    expect(after.cells.get('3,3')?.owner).toBe('player1');
    expect(after.playerChips.player1).toBe(19);
    expect(after.phase).toBe('placing');
    expect(after.currentPlayer).toBe(before.currentPlayer);
  });
});
