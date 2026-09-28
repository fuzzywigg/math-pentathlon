import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const isBoard3dEnabled = vi.fn(() => false);
const loadKingsBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/kings-quadraphages/board-3d-loader', () => ({
  loadKingsBoard3DModule: () => loadKingsBoard3DModule(),
}));

describe('mp3d kings board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadKingsBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/kings-quadraphages/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadKingsBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('.board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'kings');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createKingsBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      return { canvas: fakeCanvas, update, unmount };
    });
    loadKingsBoard3DModule.mockResolvedValue({ createKingsBoard3D });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/kings-quadraphages/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadKingsBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createKingsBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(board.querySelector('canvas[data-mp3d="kings"]')).not.toBeNull();
    expect(board.querySelector('.board')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });
});
