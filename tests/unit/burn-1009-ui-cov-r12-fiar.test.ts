/**
 * q-mp-249 / UI coverage round 12 — fiar board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  createBoardFromLayout,
  CONFIG,
} from '../../src/games/fiar/types';
import { createYellowCenterTestLayout } from '../../src/games/fiar/layout';
import { renderBoard, getPlayerColor } from '../../src/games/fiar/board-ui';
import * as fiarBoard3dLoader from '../../src/games/fiar/board-3d-loader';
import * as fiarAiClient from '../../src/games/fiar/ai-client';
import * as fiarAi from '../../src/games/fiar/ai';
import { BOARD_3D_STORAGE_KEY } from '../../src/core/feature-flags';
import { MP3D_FALLBACK_ATTR } from '../../src/ui/three/tablet-gl';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['fiar-styles'],
});

async function loadController() {
  return import('../../src/games/fiar/game-controller');
}

function mountBoardStatus(): {
  board: HTMLElement;
  status: HTMLElement;
  app: HTMLElement;
} {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  return { board, status, app };
}

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.useRealTimers();
  // Targeted clears — restoreAllMocks tears down hoisted spies used across its.
  vi.clearAllMocks();
  try {
    const mod = await loadController();
    mod.destroyGame();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  window.history.replaceState(null, '', '/');
  window.location.hash = '';
  localStorage.removeItem(BOARD_3D_STORAGE_KEY);
  document.getElementById('app')?.remove();
});

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, '', '/');
  window.location.hash = '';
  localStorage.removeItem(BOARD_3D_STORAGE_KEY);
});

describe('q-mp-249 ui-cov-r12 fiar board-ui residuals', () => {
  it('skips dangling edges; hyphen synthetic ids set a11y coords', () => {
    const layout = createYellowCenterTestLayout();
    const board = createBoardFromLayout({
      ...layout,
      verified: false,
      nodes: [...layout.nodes, { id: 'x-y', col: 9, row: 9, x: 400, y: 120 }],
      edges: [
        ...layout.edges,
        { from: 'missing-a', to: 'b', crossesYellowCenter: false },
        { from: 'a', to: 'missing-b', crossesYellowCenter: false },
        { from: 'x-y', to: 'a', crossesYellowCenter: false },
      ],
    });
    const state = {
      ...createInitialState({ layout: { ...layout, verified: false } }),
      board,
    };
    const onClick = vi.fn();
    const svg = renderBoard(state, onClick);
    expect(
      svg.querySelector('[data-node-id="x-y"]')?.getAttribute('data-col')
    ).toBe('x-y');
    expect(
      svg.querySelector('[data-node-id="x-y"]')?.getAttribute('data-row')
    ).toBe('0');
    // Hyphen id → coord uses comma form in aria label.
    expect(
      svg
        .querySelector('[data-node-id="x-y"]')
        ?.getAttribute('aria-label')
        ?.includes('x,y')
    ).toBe(true);
    expect(svg.querySelectorAll('line').length).toBe(layout.edges.length + 1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('AI seat turn omits announceTargets chrome (no pointer / click)', () => {
    const { app } = mountBoardStatus();
    app.dataset.opponent = 'ai';
    app.dataset.aiSeat = 'player2';
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'placement' as const,
    };
    const onClick = vi.fn();
    const svg = renderBoard(state, onClick);
    const node = svg.querySelector('[data-node-id="c3r3"]') as SVGGElement;
    expect(node.style.cursor).not.toBe('pointer');
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    // Empty-node hover fill arm is gated by announceTargets — stay on base fill.
    const circle = node.querySelector('circle');
    expect(circle?.getAttribute('fill')).toBe('#dcd0c0');
  });

  it('getPlayerColor follows seat tokens for both seats', () => {
    expect(getPlayerColor('player1')).toBeTruthy();
    expect(getPlayerColor('player2')).toBeTruthy();
    expect(getPlayerColor('player1')).not.toBe(getPlayerColor('player2'));
  });

  it('node hover applies and clears brightness filter', () => {
    const state = createInitialState();
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector('[data-node-id="c3r3"]') as SVGGElement;
    const circle = g.querySelector('circle') as SVGCircleElement;
    g.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(circle.getAttribute('filter')).toBe('brightness(1.1)');
    g.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(circle.hasAttribute('filter')).toBe(false);
  });
});

describe('q-mp-249 ui-cov-r12 fiar controller residuals', () => {
  it('chip-kind picker: depleted plain disabled; click toggles aria-pressed', async () => {
    const { initGame, getCurrentState, selectChipKindForTest, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    initGame(board, status);

    const live = getCurrentState();
    live.chipInventory.player1 = { plain: 0, marked: 2 };
    selectChipKindForTest('marked');

    const plainBtn = status.querySelector(
      '[data-chip-kind="plain"]'
    ) as HTMLButtonElement;
    const markedBtn = status.querySelector(
      '[data-chip-kind="marked"]'
    ) as HTMLButtonElement;
    expect(plainBtn.disabled).toBe(true);
    expect(markedBtn.disabled).toBe(false);
    expect(markedBtn.getAttribute('aria-pressed')).toBe('true');
    expect(plainBtn.getAttribute('aria-pressed')).toBe('false');

    markedBtn.click();
    expect(getCurrentState().selectedChipKind).toBe('marked');

    // Exhaust marked → button disabled after re-render.
    getCurrentState().chipInventory.player1 = { plain: 0, marked: 0 };
    selectChipKindForTest('marked');
    expect(
      (
        status.querySelector(
          '[data-chip-kind="marked"]'
        ) as HTMLButtonElement | null
      )?.disabled
    ).toBe(true);

    // Bogus data-chip-kind must be ignored by the binder.
    plainBtn.setAttribute('data-chip-kind', 'bogus');
    const before = getCurrentState().selectedChipKind;
    plainBtn.disabled = false;
    plainBtn.click();
    expect(getCurrentState().selectedChipKind).toBe(before);

    destroyGame();
  });

  it('starter banner dataset + AI mode notes; destroy clears mounts', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      destroyGame,
      getCurrentState,
    } = await loadController();
    const { board, status, app } = mountBoardStatus();
    initGame(board, status);

    vi.spyOn(Math, 'random').mockReturnValue(0.9); // AI (player2) starts
    newGameVsAI('easy');
    expect(app.dataset.opponent).toBe('ai');
    const banner = status.querySelector(
      '.fiar-starter-banner'
    ) as HTMLElement | null;
    expect(banner?.dataset.starter).toBe('player2');
    expect(getCurrentState().starter).toBe('player2');

    newGameVsHuman();
    expect(app.dataset.opponent).not.toBe('ai');
    expect(status.querySelector('.fiar-starter-banner')?.dataset.starter).toBe(
      'player1'
    );

    destroyGame();
    expect(board.querySelector('svg')).toBeTruthy(); // last paint kept
    // Re-init after destroy must remount cleanly.
    initGame(board, status);
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    expect(status.querySelector('.fiar-chip-kind-picker')).toBeTruthy();
    destroyGame();
  });

  it('winner banner pathNote when winningPathColor differs; click noop after win', async () => {
    const { initGame, getCurrentState, selectChipKindForTest, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    initGame(board, status);

    const live = getCurrentState();
    live.winner = 'player1';
    live.winningPathColor = 'player2';
    live.winningPath = ['c2r1', 'c2r2', 'c2r3', 'c2r4'];
    selectChipKindForTest('plain');

    const banner = status.querySelector('.fiar-winner-banner');
    expect(banner).toBeTruthy();
    // Structure-only: pathNote parenthetical present when colors differ.
    expect(banner?.textContent?.includes('(')).toBe(true);

    const hist = live.moveHistory.length;
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().moveHistory.length).toBe(hist);
    destroyGame();
  });

  it('blocks human taps while AI thinking or on AI seat', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9); // AI starts
    let resolveMove!: (value: fiarAi.AIMove | null) => void;
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMove = resolve;
        })
    );

    initGame(board, status);
    newGameVsAI('easy');

    // Before timer: AI seat — human click must not place.
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().chipsPlaced.player1).toBe(0);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    // Mid-search: thinking guard.
    board
      .querySelector('[data-node-id="c3r3"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().chipsPlaced.player1).toBe(0);

    resolveMove({ type: 'place', nodeId: 'c2r1', chipKind: 'plain' });
    await Promise.resolve();
    await Promise.resolve();
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
    destroyGame();
  });

  it('AI worker throw falls back to sync; gen bump abandons stale reply', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockRejectedValue(
      new Error('worker down')
    );
    const sync = vi.spyOn(fiarAi, 'getAIMove').mockReturnValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    initGame(board, status);
    newGameVsAI('easy');
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(sync).toHaveBeenCalled();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();

    // Stale generation: destroy mid-flight must not apply.
    let resolveLate!: (value: fiarAi.AIMove | null) => void;
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLate = resolve;
        })
    );
    sync.mockClear();
    newGameVsAI('easy');
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    destroyGame();
    resolveLate({ type: 'place', nodeId: 'c6r1', chipKind: 'plain' });
    await Promise.resolve();
    await Promise.resolve();
    // Module state cleared — re-init for isolation.
    initGame(board, status);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    destroyGame();
  });

  it('tutorial complete remounts HvH; board3d fail + mock success/context-lost', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
      getCurrentState,
    } = await loadController();
    const { board, status, app } = mountBoardStatus();

    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(app.dataset.opponent).not.toBe('ai');
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    expect(getCurrentState().phase).toBe('placement');

    // Failure path: flag on, loader rejects → fallback attr + 2D SVG.
    destroyGame();
    window.history.replaceState(null, '', '/?board3d=1');
    const failSpy = vi
      .spyOn(fiarBoard3dLoader, 'loadFiarBoard3DModule')
      .mockRejectedValue(new Error('webgl-unavailable'));
    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(board.getAttribute(MP3D_FALLBACK_ATTR)).toBe('webgl-unavailable');
    expect(board.querySelector('svg')).toBeTruthy();
    failSpy.mockRestore();
    destroyGame();

    // Success path + context-lost → 2D remount.
    window.history.replaceState(null, '', '/?board3d=1');
    const update = vi.fn();
    const unmount = vi.fn();
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'fiar');
    vi.spyOn(fiarBoard3dLoader, 'loadFiarBoard3DModule').mockResolvedValue({
      createFiarBoard3D: async (container: HTMLElement) => {
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update,
          unmount,
          nodeToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    } as unknown as typeof import('../../src/ui/three/fiar-board-3d'));

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(update).toHaveBeenCalled();
    expect(board.querySelector('canvas[data-mp3d="fiar"]')).toBeTruthy();

    board.dispatchEvent(new CustomEvent('mp3d-context-lost'));
    expect(isUsingBoard3d()).toBe(false);
    expect(board.getAttribute(MP3D_FALLBACK_ATTR)).toBe('context-lost');
    expect(board.querySelector('svg')).toBeTruthy();
    // context-lost nulls the handle without calling unmount; destroy still safe.
    destroyGame();
    expect(unmount).not.toHaveBeenCalled();
  });

  it('whenBoard3dReady resolves immediately when 3D flag is off', async () => {
    const { initGame, whenBoard3dReady, isUsingBoard3d, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    window.history.replaceState(null, '', '/');
    initGame(board, status);
    await expect(whenBoard3dReady()).resolves.toBeUndefined();
    expect(isUsingBoard3d()).toBe(false);
    destroyGame();
  });

  it('3D onNodeClick hits AI-seat / thinking guards; destroy unmounts board3d', async () => {
    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      whenBoard3dReady,
      isUsingBoard3d,
      destroyGame,
    } = await loadController();
    const { board, status } = mountBoardStatus();

    window.history.replaceState(null, '', '/?board3d=1');
    let onNodeClick: ((nodeId: string) => void) | undefined;
    const unmount = vi.fn();
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'fiar');
    vi.spyOn(fiarBoard3dLoader, 'loadFiarBoard3DModule').mockResolvedValue({
      createFiarBoard3D: async (
        container: HTMLElement,
        click?: (nodeId: string) => void
      ) => {
        onNodeClick = click;
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update: (_state: unknown, next?: (nodeId: string) => void) => {
            if (next) {
              onNodeClick = next;
            }
          },
          unmount,
          nodeToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    } as unknown as typeof import('../../src/ui/three/fiar-board-3d'));

    vi.spyOn(Math, 'random').mockReturnValue(0.9); // AI starts
    let resolveMove!: (value: fiarAi.AIMove | null) => void;
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMove = resolve;
        })
    );

    initGame(board, status);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    newGameVsAI('easy');

    // AI seat guard via 3D callback (2D SVG omits listeners on AI seat).
    onNodeClick?.('c3r3');
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    onNodeClick?.('c3r3');
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    resolveMove({ type: 'place', nodeId: 'c2r1', chipKind: 'plain' });
    await Promise.resolve();
    await Promise.resolve();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);

    destroyGame();
    expect(unmount).toHaveBeenCalled();
    expect(isUsingBoard3d()).toBe(false);
  });

  it('null worker + null sync re-renders without placing', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue(null);
    vi.spyOn(fiarAi, 'getAIMove').mockReturnValue(null);

    initGame(board, status);
    newGameVsAI('easy');
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    destroyGame();
  });

  it('sync getAIMove throw leaves seat unlocked without applying a move', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockRejectedValue(
      new Error('worker boom')
    );
    vi.spyOn(fiarAi, 'getAIMove').mockImplementation(() => {
      throw new Error('sync boom');
    });

    initGame(board, status);
    newGameVsAI('easy');
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    destroyGame();
  });

  it('AI turn aborts when seat already flipped before worker reply', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();

    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    let resolveMove!: (value: fiarAi.AIMove | null) => void;
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMove = resolve;
        })
    );

    initGame(board, status);
    newGameVsAI('easy');
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();

    // Flip seat before reply → aiTurn early-out after gen check.
    getCurrentState().currentPlayer = 'player1';
    resolveMove({ type: 'place', nodeId: 'c2r1', chipKind: 'plain' });
    await Promise.resolve();
    await Promise.resolve();
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    destroyGame();
  });

  it('board3d load aborted mid-await when destroyGame clears host', async () => {
    const { initGame, whenBoard3dReady, isUsingBoard3d, destroyGame } =
      await loadController();
    const { board, status } = mountBoardStatus();
    window.history.replaceState(null, '', '/?board3d=1');

    let finishLoad!: (mod: unknown) => void;
    vi.spyOn(fiarBoard3dLoader, 'loadFiarBoard3DModule').mockImplementation(
      () =>
        new Promise((resolve) => {
          finishLoad = resolve;
        }) as Promise<typeof import('../../src/ui/three/fiar-board-3d')>
    );

    initGame(board, status);
    const ready = whenBoard3dReady();
    destroyGame();
    finishLoad({
      createFiarBoard3D: async () => {
        throw new Error('should not mount after destroy');
      },
    });
    await ready;
    expect(isUsingBoard3d()).toBe(false);
  });
});
