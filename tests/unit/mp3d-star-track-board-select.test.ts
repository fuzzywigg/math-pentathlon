import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const isBoard3dEnabled = vi.fn(() => false);
const loadStarTrackBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/star-track/board-3d-loader', () => ({
  loadStarTrackBoard3DModule: () => loadStarTrackBoard3DModule(),
}));

describe('mp3d Star Track board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadStarTrackBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/star-track/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/star-track/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadStarTrackBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('.star-track-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'star-track');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createStarTrackBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        spaceToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadStarTrackBoard3DModule.mockResolvedValue({
      createStarTrackBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/star-track/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadStarTrackBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createStarTrackBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(
      board.querySelector('canvas[data-mp3d="star-track"]')
    ).not.toBeNull();
    expect(board.querySelector('.star-track-board')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL mount failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadStarTrackBoard3DModule.mockResolvedValue({
      createStarTrackBoard3D: async () => {
        throw new Error('WebGLRenderer failed — Star Track 3D board cannot mount');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/star-track/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.star-track-board')).not.toBeNull();
    expect(board.querySelector('.star-track-draw-btn')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });
});
