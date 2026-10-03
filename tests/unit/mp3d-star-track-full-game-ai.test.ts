import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const isBoard3dEnabled = vi.fn(() => true);
const loadStarTrackBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/star-track/board-3d-loader', () => ({
  loadStarTrackBoard3DModule: () => loadStarTrackBoard3DModule(),
}));

vi.mock('../../src/core/owl', () => ({
  owlSystem: {
    onGameStart: vi.fn(),
    onGameEnd: vi.fn(),
  },
}));

describe('mp3d Star Track scripted full game vs AI (3D mocked)', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReturnValue(true);
    loadStarTrackBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/star-track/game-controller');
      destroyGame();
    } catch {
      // ignore
    }
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  async function mountWithMocked3d() {
    const update = vi.fn();
    const unmount = vi.fn();
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'star-track');
    const chainHost = document.createElement('div');
    chainHost.className = 'star-track-chain-area';

    loadStarTrackBoard3DModule.mockResolvedValue({
      createStarTrackBoard3D: async (container: HTMLElement) => {
        container.replaceChildren(fakeCanvas, chainHost);
        return {
          canvas: fakeCanvas,
          update: (
            state: unknown,
            callbacks?: {
              onDrawChains?: () => void;
              onSelectChain?: (i: 0 | 1) => void;
            }
          ) => {
            update(state, callbacks);
            // Mirror DOM chain controls so the test can drive the same click path
            chainHost.replaceChildren();
            const phase = (state as { phase: string }).phase;
            if (phase === 'drawChains' && callbacks?.onDrawChains) {
              const btn = document.createElement('button');
              btn.className = 'star-track-draw-btn';
              btn.addEventListener('click', callbacks.onDrawChains);
              chainHost.appendChild(btn);
            } else if (phase === 'selectChain' && callbacks?.onSelectChain) {
              for (const index of [0, 1] as const) {
                const btn = document.createElement('button');
                btn.className = 'star-track-chain-btn';
                btn.setAttribute('data-chain-index', String(index));
                btn.addEventListener('click', () =>
                  callbacks.onSelectChain?.(index)
                );
                chainHost.appendChild(btn);
              }
            }
          },
          unmount,
          spaceToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const mod = await import('../../src/games/star-track/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    mod.initGame(board, status);
    await mod.whenBoard3dReady();
    return { ...mod, board, status, update, unmount, chainHost };
  }

  it.each(['easy', 'medium', 'hard'] as const)(
    'plays a full human-vs-AI game to gameOver on difficulty %s',
    async (difficulty) => {
      const { newGameVsAI, getGameState, board, whenBoard3dReady } =
        await mountWithMocked3d();

      newGameVsAI(difficulty);
      await whenBoard3dReady();

      // Cap turns — Star Track finishes well before this with TRACK_LENGTH=12
      for (let turn = 0; turn < 40; turn++) {
        const state = getGameState();
        if (state.phase === 'gameOver') break;

        const drawBtn = board.querySelector(
          '.star-track-draw-btn'
        ) as HTMLButtonElement | null;
        if (drawBtn) {
          drawBtn.click();
        }

        const chainBtn = board.querySelector(
          '.star-track-chain-btn'
        ) as HTMLButtonElement | null;
        if (chainBtn) {
          chainBtn.click();
        }

        // Flush AI think delays (draw + select)
        await vi.advanceTimersByTimeAsync(2000);
      }

      const end = getGameState();
      expect(end.phase).toBe('gameOver');
      // Winner may be null on rare bucket-exhaustion draw; either is a finished game
      expect(['gameOver']).toContain(end.phase);
      expect(board.querySelector('canvas[data-mp3d="star-track"]')).not.toBeNull();
    }
  );
});
