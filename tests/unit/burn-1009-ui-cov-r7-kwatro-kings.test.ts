/**
 * q-mp-149 / UI coverage round 7 — kwatro-sinko + kings-quadraphages
 * destroy/remount + 3D fail/context-lost residuals.
 * Characterization only: no copy / AI choice / timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import * as featureFlags from '../../src/core/feature-flags';
import * as kwatroLoader from '../../src/games/kwatro-sinko/board-3d-loader';
import * as kingsLoader from '../../src/games/kings-quadraphages/board-3d-loader';

installDomHooks({
  fakeTimers: true,
  styleIds: ['kwa-styles', 'kings-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/kwatro-sinko/game-controller',
    '../../src/games/kings-quadraphages/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('q-mp-149 ui-cov-r7 kwatro-sinko destroy/remount', () => {
  it('3D loader reject → 2D fallback; destroy mid-load is idempotent', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );

    const { initGame, destroyGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(root.querySelector('.kwa-game-area, .kwa-board')).toBeTruthy();

    destroyGame();
    expect(() => destroyGame()).not.toThrow();

    // Remount into same host after destroy nulled active refs.
    initGame(root, false);
    expect(root.querySelector('.kwa-game-area, .kwa-board')).toBeTruthy();
    destroyGame();
  });

  it('fake 3D mount → destroy unmounts; remount + context-lost is safe', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kwatroLoader, 'loadKwatroSinkoBoard3DModule').mockResolvedValue({
      createKwatroSinkoBoard3D: async () => ({ update, unmount }),
    } as never);

    const { initGame, newGameVsAI, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = mountRoot();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    initGame(root, true, 'easy');
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    destroyGame();
    expect(unmount).toHaveBeenCalled();

    // Remount, fire context-lost (nulls board3d without unmount), then destroy.
    initGame(root, false);
    await whenBoard3dReady();
    const host = root.querySelector('.kwa-board-3d-slot, .kwa-board');
    expect(host).toBeTruthy();
    host!.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    (
      root.querySelector('.kwa-btn-secondary') as HTMLButtonElement | null
    )?.click();
    newGameVsAI(root, 'medium');
    destroyGame();
  });

  it('tutorial exit (not complete) leaves controller remountable', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountRoot();
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
    initGame(root, false);
    expect(root.childElementCount).toBeGreaterThan(0);
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 kings-quadraphages destroy/remount', () => {
  it('3D loader reject + destroy/remount + reduced-motion invalid click', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kingsLoader, 'loadKingsQuadraphagesBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: /prefers-reduced-motion:\s*reduce/.test(query),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      getGameState,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    const history = mountRoot();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);

    initGame(board, status, history, newBtn);
    await vi.advanceTimersByTimeAsync(0);
    newGameVsHuman();
    expect(getGameState()).toBeTruthy();

    // Occupied / invalid cell — reduced motion skips animation class path.
    const cell = board.querySelector(
      '.cell[data-row][data-col]'
    ) as HTMLElement | null;
    cell?.click();

    newGameVsAI('easy', true);
    destroyGame();
    expect(() => destroyGame()).not.toThrow();

    initGame(board, status, history, newBtn);
    newGameVsHuman();
    expect(board.querySelector('.cell')).toBeTruthy();
    destroyGame();
  });

  it('fake 3D destroy unmounts; AI-first seat then destroy mid-think', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(kingsLoader, 'loadKingsQuadraphagesBoard3DModule').mockResolvedValue(
      {
        createKingsQuadraphagesBoard3D: async () => ({ update, unmount }),
      } as never
    );

    const { initGame, newGameVsAI, newGameVsHuman, destroyGame } = await import(
      '../../src/games/kings-quadraphages/game-controller'
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
    destroyGame();
    expect(unmount).toHaveBeenCalled();

    // Remount; AI plays first → arms think delay; destroy mid-flight (no timing assert).
    initGame(board, status);
    await Promise.resolve();
    await Promise.resolve();
    newGameVsAI('easy', false);
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    destroyGame();
    await vi.advanceTimersByTimeAsync(2000);
  });

  it('tutorial exit arm + newGame button game-over class structural', async () => {
    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/kings-quadraphages/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    const newBtn = document.createElement('button');
    document.body.appendChild(newBtn);

    initGame(board, status, undefined, newBtn);
    newGameVsHuman();
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    // Button host remains wired (class may or may not be active).
    expect(newBtn.isConnected).toBe(true);
    destroyGame();
  });
});
