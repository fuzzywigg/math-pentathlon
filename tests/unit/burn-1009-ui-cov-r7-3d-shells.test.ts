/**
 * q-mp-149 / UI coverage round 7 — hex-a-gone / fiar / star-track / prime-gold
 * 3D fail + destroy/remount shells.
 * Characterization only: no copy / AI choice / timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import * as featureFlags from '../../src/core/feature-flags';
import * as hexAGoneLoader from '../../src/games/hex-a-gone/board-3d-loader';
import * as fiarLoader from '../../src/games/fiar/board-3d-loader';
import * as starTrackLoader from '../../src/games/star-track/board-3d-loader';
import * as primeGoldLoader from '../../src/games/prime-gold/board-3d-loader';
import * as fiarAi from '../../src/games/fiar/ai-client';

installDomHooks({
  fakeTimers: true,
  styleIds: [
    'hex-a-gone-styles',
    'fiar-styles',
    'star-track-styles',
    'prime-gold-styles',
  ],
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/hex-a-gone/game-controller',
    '../../src/games/fiar/game-controller',
    '../../src/games/star-track/game-controller',
    '../../src/games/prime-gold/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('q-mp-149 ui-cov-r7 hex-a-gone destroy/remount', () => {
  it('3D loader reject → 2D; destroy mid vsAI; remount', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/hex-a-gone/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await Promise.resolve();
    newGameVsHuman();
    expect(board.querySelector('svg, .hex-a-gone-wrapper')).toBeTruthy();

    // Select a bank block if present (structural).
    (
      board.querySelector(
        '.hex-a-gone-block, [data-shape], .hag-block'
      ) as HTMLElement | null
    )?.click();
    (
      board.querySelector(
        '.hex-a-gone-confirm, button.confirm'
      ) as HTMLButtonElement | null
    )?.click();

    newGameVsAI('easy');
    destroyGame();
    expect(() => destroyGame()).not.toThrow();

    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('fake 3D mount + fallback callback + destroy', async () => {
    const unmount = vi.fn();
    let fallback: (() => void) | undefined;
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(hexAGoneLoader, 'loadHexAGoneBoard3DModule').mockResolvedValue({
      createHexAGoneBoard3D: async (
        _host: HTMLElement,
        _click: unknown,
        onFallback: () => void
      ) => {
        fallback = onFallback;
        return { update: vi.fn(), unmount };
      },
    } as never);

    const { initGame, newGameVsHuman, destroyGame } = await import(
      '../../src/games/hex-a-gone/game-controller'
    );
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    await Promise.resolve();
    await Promise.resolve();
    newGameVsHuman();
    fallback?.();
    expect(board.querySelector('svg, .hex-a-gone-wrapper')).toBeTruthy();
    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });
});

describe('q-mp-149 ui-cov-r7 fiar destroy/remount', () => {
  it('3D reject + destroy during mocked AI think generation bump', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(fiarLoader, 'loadFiarBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );
    // Never resolve — destroy bumps generation so the await path is abandoned.
    vi.spyOn(fiarAi, 'getAIMoveAsync').mockImplementation(
      () => new Promise(() => undefined)
    );

    const { initGame, newGameVsAI, destroyGame, whenBoard3dReady } =
      await import('../../src/games/fiar/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await whenBoard3dReady();
    newGameVsAI('easy');

    // Human places if a node is clickable so AI seat can arm.
    const node = board.querySelector(
      '[data-node], .fiar-node, circle'
    ) as Element | null;
    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(100);

    destroyGame();
    await Promise.resolve();
    expect(() => destroyGame()).not.toThrow();
  });

  it('fake 3D + context-lost listener path + remount', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(fiarLoader, 'loadFiarBoard3DModule').mockResolvedValue({
      createFiarBoard3D: async () => ({ update, unmount }),
    } as never);

    const { initGame, newGameVsHuman, destroyGame, whenBoard3dReady } =
      await import('../../src/games/fiar/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await whenBoard3dReady();
    newGameVsHuman();
    destroyGame();
    expect(unmount).toHaveBeenCalled();

    initGame(board, status);
    await whenBoard3dReady();
    newGameVsHuman();
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    expect(status.querySelector('.fiar-chip-kind-picker, .fiar-status')).toBeTruthy();
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 star-track destroy/remount', () => {
  it('3D reject + draw/select guards + destroy/remount', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/star-track/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await Promise.resolve();
    newGameVsHuman();

    (
      board.querySelector(
        '.star-track-draw-btn, button'
      ) as HTMLButtonElement | null
    )?.click();
    (
      board.querySelector(
        '.star-track-choices button, [data-chain-index]'
      ) as HTMLElement | null
    )?.click();

    newGameVsAI('easy');
    destroyGame();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('fake 3D + fallback → 2D + destroy', async () => {
    const unmount = vi.fn();
    let fallback: (() => void) | undefined;
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(starTrackLoader, 'loadStarTrackBoard3DModule').mockResolvedValue({
      createStarTrackBoard3D: async (
        _host: HTMLElement,
        onFallback: () => void
      ) => {
        fallback = onFallback;
        return { update: vi.fn(), unmount };
      },
    } as never);

    const { initGame, destroyGame } = await import(
      '../../src/games/star-track/game-controller'
    );
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    await Promise.resolve();
    await Promise.resolve();
    fallback?.();
    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });
});

describe('q-mp-149 ui-cov-r7 prime-gold destroy/remount', () => {
  it('3D reject + DEV test hook cleared on destroy + remount', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      getGameState,
      whenBoard3dReady,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/prime-gold/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root, false);
    await whenBoard3dReady();
    newGameVsHuman(root);
    expect(getGameState()).toBeTruthy();

    // DEV hook is set during init in DEV; destroy deletes it.
    newGameVsAI(root, 'easy');
    destroyGame();
    expect(
      (window as Window & { __mpPrimeGoldTest?: unknown }).__mpPrimeGoldTest
    ).toBeUndefined();

    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('fake 3D + context-lost + destroy', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: async () => ({ update, unmount }),
    } as never);

    const { initGame, destroyGame, whenBoard3dReady } = await import(
      '../../src/games/prime-gold/game-controller'
    );
    const root = mountAppShell();
    initGame(root, false);
    await whenBoard3dReady();
    destroyGame();
    expect(unmount).toHaveBeenCalled();

    initGame(root, false);
    await whenBoard3dReady();
    const host = root.querySelector('.pg-board-host') ?? root;
    host.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    destroyGame();
  });
});
