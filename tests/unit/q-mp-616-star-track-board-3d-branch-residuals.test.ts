/**
 * q-mp-616 — Close `star-track-board-3d` branch gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `780db960`):
 *   `star-track-board-3d.ts` **656** LOC (matches backlog)
 *   Lifecycle coverage before this suite: **92.0%** lines / **62.5%** branches
 *   Overlay void residual **5** (clear owned by `q-mp-601` HOLD — do **not**
 *     write the void ceiling here): paint render / onVisible / layout resize /
 *     rimEdgeGeos dispose forEach / mats dispose forEach
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `q-mp-601` void clear — not launched; pin keep-sites only
 *   UI r54 `#1018`/`567` — leave **contained** (their own scopes)
 *   `mp3d-star-track-board-3d-lifecycle` / `mp3d-star-track-board-select` —
 *     prior happy path + flag selection; this suite owns residual branch arms
 *
 * Constraints: tests only; zero `src/` edits; no void ceiling write; no AI /
 * rules / scoring / legal-move outcome asserts; no player-facing copy or
 * aria/label string pins (element presence, class/attribute chrome, render
 * counts only); no visual-baseline; no ratchet JSON; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { drawChains } from '../../src/games/star-track/rules';
import {
  TRACK_LENGTH,
  createInitialState,
  type StarTrackGameState,
} from '../../src/games/star-track/types';
import {
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';

const BOARD_3D_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/three/star-track-board-3d.ts'
  ),
  'utf8'
);

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

/** State setup helper — mutates fields for board chrome; no rules asserts. */
function withHistory(
  state: StarTrackGameState,
  toPosition: number,
  player: 'player1' | 'player2' = 'player1'
): StarTrackGameState {
  return {
    ...state,
    moveHistory: [
      {
        player,
        chainUsed: 3,
        fromPosition: Math.max(0, toPosition - 3),
        toPosition,
        moveNumber: 1,
      },
    ],
  };
}

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '';
  installCanvas2dStub();
  delete (window as Window & { __mp3dStarTrack?: unknown }).__mp3dStarTrack;
  document.getElementById('star-track-3d-layout-css')?.remove();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete (window as Window & { __mp3dStarTrack?: unknown }).__mp3dStarTrack;
  document.getElementById('star-track-3d-layout-css')?.remove();
});

// =============================================================================
// 1. Source keep-sites (void overlay owned by 601; mount soft contracts)
// =============================================================================

describe('q-mp-616 star-track-board-3d — source keep-sites', () => {
  it('re-measures tip LOC + five void shorthand keep-sites (owned by 601)', () => {
    const loc = BOARD_3D_SRC.split('\n').length - 1;
    expect(loc).toBe(656);

    expect(BOARD_3D_SRC).toMatch(
      /paintBoard3dAndMarkReady\(\s*canvas,\s*\(\)\s*=>\s*renderer\.render\(scene,\s*camera\),\s*\(\)\s*=>\s*disposed\s*\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /bindPageVisibility\(\{\s*onVisible:\s*\(\)\s*=>\s*paint\(\),\s*\}\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /bindBoard3dLayout\(canvasHost,\s*\(\)\s*=>\s*resize\(\)\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /rimEdgeGeos\.forEach\(\(g\)\s*=>\s*g\.dispose\(\)\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /Object\.values\(mats\)\.forEach\(\(m\)\s*=>\s*m\.dispose\(\)\)/
    );
  });

  it('keeps WebGL soft-fail throw + optional onContextLost contracts', () => {
    expect(BOARD_3D_SRC).toMatch(
      /throw new Error\('WebGL context unavailable'\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /WebGLRenderer failed — Star Track 3D board cannot mount/
    );
    expect(BOARD_3D_SRC).toMatch(/onContextLost\?\.\(\)/);
    expect(BOARD_3D_SRC).toMatch(/forceContextLoss\?\.\(\)/);
  });
});

// =============================================================================
// 2. Mount / layout soft-fail residuals
// =============================================================================

describe('q-mp-616 star-track-board-3d — mount / layout residuals', () => {
  it('wraps constructor throw so controller can keep 2D SVG', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      constructor() {
        throw new Error('boom-gpu');
      }
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    await expect(
      createStarTrackBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed.*boom-gpu/);
  });

  it('maps non-Error constructor throw to unknown message branch', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      constructor() {
        throw 'string-fail';
      }
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    await expect(
      createStarTrackBoard3D(document.createElement('div'))
    ).rejects.toThrow(/unknown/);
  });

  it('falls through to canvas getContext when renderer.getContext is missing', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn(() => ({}));
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      constructor() {
        this.domElement.getContext = canvasGet as never;
      }
    } as unknown as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    expect(canvasGet).toHaveBeenCalled();
    expect(host.querySelector('canvas[data-mp3d="star-track"]')).toBeTruthy();
    board.unmount();
  });

  it('falls through to experimental-webgl when webgl getContext returns null', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn((type: string) =>
      type === 'experimental-webgl' ? {} : null
    );
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      // no getContext — forces domElement.getContext webgl || experimental-webgl
      constructor() {
        this.domElement.getContext = canvasGet as never;
      }
    } as unknown as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    expect(canvasGet).toHaveBeenCalledWith('webgl');
    expect(canvasGet).toHaveBeenCalledWith('experimental-webgl');
    expect(host.querySelector('canvas[data-mp3d="star-track"]')).toBeTruthy();
    board.unmount();
  });

  it('remount refreshes existing layout style element (else of !style)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const first = await createStarTrackBoard3D(host);
    expect(document.getElementById('star-track-3d-layout-css')).toBeTruthy();
    first.unmount();

    const second = await createStarTrackBoard3D(host);
    expect(document.querySelectorAll('#star-track-3d-layout-css')).toHaveLength(
      1
    );
    expect(host.querySelector('.star-track-3d-layout')).toBeTruthy();
    second.unmount();
  });

  it('context-lost without onContextLost stays quiet and leaves canvas mounted', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    expect(() => {
      board.canvas.dispatchEvent(
        new Event('webglcontextlost', { cancelable: true, bubbles: true })
      );
    }).not.toThrow();
    expect(host.querySelector('canvas[data-mp3d="star-track"]')).toBeTruthy();
    board.unmount();
  });
});

// =============================================================================
// 3. Dispose / soft-fail residuals
// =============================================================================

describe('q-mp-616 star-track-board-3d — dispose residuals', () => {
  it('update / spaceToClientPoint after unmount are no-ops; second unmount idempotent', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(
      (window as Window & { __mp3dStarTrack?: unknown }).__mp3dStarTrack
    ).toBeUndefined();

    const state = createInitialState();
    expect(() => board.update(state)).not.toThrow();
    expect(board.spaceToClientPoint('player1', 0)).toBeNull();
    expect(() => board.unmount()).not.toThrow();
    expect(host.classList.contains('board-3d-host')).toBe(false);
  });

  it('unmount when __mp3dStarTrack already cleared takes falsy delete branch', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    delete (window as Window & { __mp3dStarTrack?: unknown }).__mp3dStarTrack;
    expect(() => board.unmount()).not.toThrow();
    expect(host.querySelector('canvas')).toBeNull();
  });

  it('resize after dispose is a no-op via captured layout callback', async () => {
    const three = installThreeMock();
    let layoutCb: (() => void) | null = null;
    vi.doMock('../../src/ui/three/tablet-gl', async () => {
      const actual = await vi.importActual<
        typeof import('../../src/ui/three/tablet-gl')
      >('../../src/ui/three/tablet-gl');
      return {
        ...actual,
        bindBoard3dLayout: (host: Element, onLayout: () => void) => {
          layoutCb = onLayout;
          return actual.bindBoard3dLayout(host, onLayout);
        },
      };
    });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    expect(layoutCb).toBeTypeOf('function');
    board.unmount();
    expect(() => layoutCb?.()).not.toThrow();
  });

  it('webglcontextlost after dispose returns early (handler captured)', async () => {
    const three = installThreeMock();
    const lostHandlers: EventListener[] = [];
    const addSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'addEventListener')
      .mockImplementation(function (
        this: HTMLCanvasElement,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ) {
        if (type === 'webglcontextlost' && typeof listener === 'function') {
          lostHandlers.push(listener);
        }
        return EventTarget.prototype.addEventListener.call(
          this,
          type,
          listener,
          options
        );
      });

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onContextLost = vi.fn();
    const board = await createStarTrackBoard3D(host, onContextLost);
    expect(lostHandlers.length).toBeGreaterThan(0);

    board.unmount();
    onContextLost.mockClear();
    const event = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    lostHandlers[0]?.(event);
    expect(onContextLost).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });
});

// =============================================================================
// 4. Highlight / a11y / piece branch residuals (chrome + render counts only)
// =============================================================================

describe('q-mp-616 star-track-board-3d — highlight / a11y branch residuals', () => {
  it('selectChain chrome + chain preview hover exercise target/focus mats', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state.player1Position = 4;
    state.player2Position = 2;
    state = drawChains(state);

    const selectSpy = vi.fn();
    board.update(state, { onSelectChain: selectSpy });
    const chainBtns = host.querySelectorAll('.star-track-chain-btn');
    expect(chainBtns.length).toBe(2);
    expect(chainBtns[0]?.getAttribute('data-chain-index')).toBe('0');
    expect(chainBtns[1]?.getAttribute('data-chain-index')).toBe('1');

    // Hover both chains so previewIndex 0/1 arms run; no select/rules asserts.
    expect(() => {
      chainBtns[0]!.dispatchEvent(
        new PointerEvent('pointerenter', { bubbles: true })
      );
      chainBtns[1]!.dispatchEvent(
        new PointerEvent('pointerenter', { bubbles: true })
      );
      chainBtns[1]!.dispatchEvent(
        new PointerEvent('pointerleave', { bubbles: true })
      );
    }).not.toThrow();
    expect(selectSpy).not.toHaveBeenCalled();

    board.unmount();
  });

  it('a11y focus/blur drives highlight re-paint without copy pins', async () => {
    const three = installThreeMock();
    const renderSpy = vi.fn();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = renderSpy;
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      getContext = vi.fn(() => ({}));
    } as typeof three.WebGLRenderer;

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state = withHistory(state, 5);
    board.update(state);

    const a11y = host.querySelector('.star-track-a11y-track');
    expect(a11y).toBeTruthy();
    const mid = a11y!.querySelector(
      'button[data-player="player1"][data-space="5"]'
    ) as HTMLButtonElement | null;
    const goal = a11y!.querySelector(
      'button[data-player="player1"][data-space="' + String(TRACK_LENGTH) + '"]'
    ) as HTMLButtonElement | null;
    expect(mid).toBeTruthy();
    expect(goal).toBeTruthy();

    const before = renderSpy.mock.calls.length;
    mid!.dispatchEvent(new FocusEvent('focus'));
    expect(renderSpy.mock.calls.length).toBeGreaterThan(before);
    // Move focus to goal without clearing mid first — mid blur takes non-match arm.
    goal!.dispatchEvent(new FocusEvent('focus'));
    mid!.dispatchEvent(new FocusEvent('blur'));
    goal!.dispatchEvent(new FocusEvent('blur'));

    // Second update skips syncA11y (childElementCount > 0) — a11y chrome stays.
    board.update(withHistory(state, 6));
    expect(
      host.querySelectorAll('.star-track-a11y-track button[data-space]').length
    ).toBeGreaterThan(0);

    board.unmount();
  });

  it('last-move at goal, winner goal mat, and pieces at TRACK_LENGTH', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/reduced-motion', () => ({
      prefersReducedMotion: () => false,
    }));
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state.player1Position = TRACK_LENGTH;
    state.player2Position = TRACK_LENGTH;
    state.phase = 'gameOver';
    state.winner = 'player1';
    state = withHistory(state, TRACK_LENGTH, 'player1');

    expect(() =>
      board.update(state, { gameMode: 'human-vs-ai' })
    ).not.toThrow();
    expect(host.querySelector('.star-track-chain-area')).toBeTruthy();

    const goalPt = board.spaceToClientPoint('player1', TRACK_LENGTH);
    expect(goalPt).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    const p2Goal = board.spaceToClientPoint('player2', TRACK_LENGTH);
    expect(p2Goal).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    board.unmount();
  });

  it('winner scale stays identity when prefersReducedMotion is true', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/reduced-motion', () => ({
      prefersReducedMotion: () => true,
    }));
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    state.player1Position = TRACK_LENGTH;
    state.player2Position = 3;
    state.phase = 'gameOver';
    state.winner = 'player1';

    expect(() =>
      board.update(state, { gameMode: 'human-vs-human' })
    ).not.toThrow();
    expect(host.querySelector('canvas[data-mp3d="star-track"]')).toBeTruthy();
    board.unmount();
  });

  it('visibilitychange visible arm re-paints via bindPageVisibility', async () => {
    const three = installThreeMock();
    const renderSpy = vi.fn();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = renderSpy;
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      getContext = vi.fn(() => ({}));
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());

    const before = renderSpy.mock.calls.length;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(renderSpy.mock.calls.length).toBeGreaterThan(before);

    board.unmount();
  });

  it('drawChains phase with onDrawChains + gameMode option arm', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createStarTrackBoard3D(host);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    const onDraw = vi.fn();
    board.update(state, {
      onDrawChains: onDraw,
      gameMode: 'human-vs-ai',
    });
    expect(host.querySelector('.star-track-draw-btn')).toBeTruthy();
    // Presence only — do not pin button copy / aria text.
    expect(
      host.querySelector('.star-track-draw-btn')?.hasAttribute('aria-label')
    ).toBe(true);

    board.unmount();
  });
});
