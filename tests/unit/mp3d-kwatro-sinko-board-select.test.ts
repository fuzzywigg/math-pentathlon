import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const isBoard3dEnabled = vi.fn(() => false);
const loadKwatroSinkoBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/kwatro-sinko/board-3d-loader', () => ({
  loadKwatroSinkoBoard3DModule: () => loadKwatroSinkoBoard3DModule(),
}));

describe('mp3d Kwatro-Sinko board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadKwatroSinkoBoard3DModule.mockReset();
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      const { destroyGame } =
        await import('../../src/games/kwatro-sinko/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);

    initGame(root, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadKwatroSinkoBoard3DModule).not.toHaveBeenCalled();
    expect(root.querySelector('.kwa-board svg')).not.toBeNull();
    expect(root.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'kwatro-sinko');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createKwatroSinkoBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        nodeToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadKwatroSinkoBoard3DModule.mockResolvedValue({
      createKwatroSinkoBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);

    initGame(root, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadKwatroSinkoBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createKwatroSinkoBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(
      root.querySelector('canvas[data-mp3d="kwatro-sinko"]')
    ).not.toBeNull();
    expect(root.querySelector('.kwa-board svg')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadKwatroSinkoBoard3DModule.mockResolvedValue({
      createKwatroSinkoBoard3D: async () => {
        throw new Error('WebGLRenderer failed — Kwatro-Sinko');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);

    initGame(root, false);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(root.querySelector('.kwa-board svg')).not.toBeNull();
    expect(root.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeNull();
  });

  it('vs-AI still works with 3D view selected', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'kwatro-sinko');
    const update = vi.fn();
    loadKwatroSinkoBoard3DModule.mockResolvedValue({
      createKwatroSinkoBoard3D: async (container: HTMLElement) => {
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update,
          unmount: vi.fn(),
          nodeToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const { newGameVsAI, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');
    await whenBoard3dReady();

    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();
    // Tutorial highlightSelector `.kwa-board` must still match in 3D.
    expect(root.querySelector('.kwa-board')).not.toBeNull();
  });

  it('discards a stale 3D mount that finishes after destroyGame', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    let resolveCreate!: (value: unknown) => void;
    const createGate = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    let signalCreateStarted!: () => void;
    const createStarted = new Promise<void>((resolve) => {
      signalCreateStarted = resolve;
    });
    const unmount = vi.fn();

    loadKwatroSinkoBoard3DModule.mockResolvedValue({
      createKwatroSinkoBoard3D: async (container: HTMLElement) => {
        signalCreateStarted();
        // Pause inside create (after module load) so destroy can race the await.
        await createGate;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('data-mp3d', 'kwatro-sinko');
        container.replaceChildren(canvas);
        return {
          canvas,
          update: vi.fn(),
          unmount: () => {
            unmount();
            canvas.remove();
          },
          nodeToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const { initGame, whenBoard3dReady, destroyGame, isUsingBoard3d } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root, false);
    const pending = whenBoard3dReady();
    await createStarted;
    destroyGame();
    resolveCreate(undefined);
    await pending;

    expect(isUsingBoard3d()).toBe(false);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(root.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeNull();
  });
});
