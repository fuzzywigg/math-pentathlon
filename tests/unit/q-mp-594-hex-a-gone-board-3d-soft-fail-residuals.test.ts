/**
 * q-mp-594 — Characterize `hex-a-gone-board-3d` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `ed034b44`):
 *   `hex-a-gone-board-3d.ts` **654** LOC (matches backlog)
 *   Dedicated `*soft-fail*` residual files before this suite: **0**
 *   Overlay void residual **5** (shorthand arrow void returns at
 *     `:243` paint render, `:380` onVisible, `:397` layout resize,
 *     `:635`/`:636` mats/shapeMats dispose forEach) — owned by
 *     `q-mp-579` HOLD-CHECK clear; do **not** write the void ceiling here.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#998`/`535`/`#1009`/`554` board-3d inventory docs — leave **contained**
 *   `q-mp-579` void clear — serialize; this suite only pins keep-sites
 *   `mp3d-hex-a-gone-board-3d-lifecycle` / `mp3d-ui-cov-r15` — prior happy
 *     path + context-lost quiet-after-unmount; this suite owns residual
 *     soft-fail arms those leave thin (constructor wrap, getContext
 *     fallback, dispose idempotence, tap miss / no-handler, host size
 *     soft floor, optional onWebglLost, axialToWorld export)
 *
 * Constraints: tests only; zero `src/` edits; no void ceiling write; no
 * AI / rules / scoring / legal-move / player-facing copy or aria/label
 * string pins; Hex Hard 450ms; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  commitSelection,
  placeBlock,
  selectBlock,
} from '../../src/games/hex-a-gone/rules';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';

const BOARD_3D_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/three/hex-a-gone-board-3d.ts'
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

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '';
  installCanvas2dStub();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone;
});

// =============================================================================
// 1. Source soft-fail keep-sites (void overlay + mount soft contracts)
// =============================================================================

describe('q-mp-594 hex-a-gone-board-3d — source soft-fail keep-sites', () => {
  it('re-measures tip LOC + five void shorthand keep-sites (owned by 579)', () => {
    const loc = BOARD_3D_SRC.split('\n').length - 1;
    expect(loc).toBe(654);

    // paintBoard3dAndMarkReady render + disposed gates (void shorthand)
    expect(BOARD_3D_SRC).toMatch(
      /paintBoard3dAndMarkReady\(\s*canvas,\s*\(\)\s*=>\s*renderer\.render\(scene,\s*camera\),\s*\(\)\s*=>\s*disposed\s*\)/
    );
    // bindPageVisibility onVisible → paint()
    expect(BOARD_3D_SRC).toMatch(
      /bindPageVisibility\(\{\s*onVisible:\s*\(\)\s*=>\s*paint\(\),\s*\}\)/
    );
    // bindBoard3dLayout resize callback
    expect(BOARD_3D_SRC).toMatch(
      /bindBoard3dLayout\(container,\s*\(\)\s*=>\s*resize\(\)\)/
    );
    // unmount mats / shapeMats dispose forEach void shorthand ×2
    expect(BOARD_3D_SRC).toMatch(
      /Object\.values\(mats\)\.forEach\(\(m\)\s*=>\s*m\.dispose\(\)\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /Object\.values\(shapeMats\)\.forEach\(\(m\)\s*=>\s*m\.dispose\(\)\)/
    );
  });

  it('keeps WebGL soft-fail throw + optional onWebglLost contracts', () => {
    expect(BOARD_3D_SRC).toMatch(
      /throw new Error\('WebGL context unavailable'\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /WebGLRenderer failed — Hex-a-Gone 3D board cannot mount/
    );
    expect(BOARD_3D_SRC).toMatch(/onWebglLost\?\.\(\)/);
    // Context-lost must not mark disposed (unmount owns teardown).
    expect(BOARD_3D_SRC).toMatch(
      /Do not mark disposed here — unmount\(\) must run/
    );
    expect(BOARD_3D_SRC).toMatch(/forceContextLoss\?\.\(\)/);
  });

  it('keeps host-size soft floor + lazy canvas CSS seed contracts', () => {
    expect(BOARD_3D_SRC).toMatch(
      /Math\.max\(container\.clientWidth \|\| 480,\s*120\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /Math\.max\(container\.clientHeight \|\| 480,\s*120\)/
    );
    expect(BOARD_3D_SRC).toMatch(/canvasCssRect \?\? measureCanvasCssRect\(\)/);
  });
});

// =============================================================================
// 2. Mount / WebGL soft-fail residuals
// =============================================================================

describe('q-mp-594 hex-a-gone-board-3d — WebGL mount soft-fail residuals', () => {
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
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    await expect(
      createHexAGoneBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed.*boom-gpu/);
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
      // no getContext — source falls through to domElement.getContext
      constructor() {
        this.domElement.getContext = canvasGet as never;
      }
    } as unknown as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createHexAGoneBoard3D(host);
    expect(canvasGet).toHaveBeenCalled();
    expect(host.querySelector('canvas[data-mp3d="hex-a-gone"]')).toBeTruthy();
    board.unmount();
  });

  it('context-lost without onWebglLost stays quiet and leaves canvas mounted', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createHexAGoneBoard3D(host);
    stubCanvasLayout(board.canvas);

    expect(() => {
      board.canvas.dispatchEvent(
        new Event('webglcontextlost', { cancelable: true, bubbles: true })
      );
    }).not.toThrow();
    expect(host.querySelector('canvas[data-mp3d="hex-a-gone"]')).toBeTruthy();
    board.unmount();
  });
});

// =============================================================================
// 3. Dispose / update / pick soft-fail residuals
// =============================================================================

describe('q-mp-594 hex-a-gone-board-3d — dispose / pick soft-fail residuals', () => {
  it('update after unmount is a no-op; second unmount is idempotent', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createHexAGoneBoard3D(host);
    stubCanvasLayout(board.canvas);

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(
      (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone
    ).toBeUndefined();

    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    state = placeBlock(state, 0, 0);
    expect(() => board.update(state)).not.toThrow();
    expect(host.querySelector('.hex-a-gone-a11y-grid')).toBeNull();

    expect(() => board.unmount()).not.toThrow();
    expect(host.classList.contains('board-3d-host')).toBe(false);
  });

  it('tap with no click handler / empty ray hits stays quiet', async () => {
    const three = installThreeMock({ hitQueue: [[], []] });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    // No onCellClick — soft-fail residual is silent tap.
    const board = await createHexAGoneBoard3D(host);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    board.update(state);

    expect(() => dispatchTap(board.canvas)).not.toThrow();

    const onClick = vi.fn();
    board.update(state, onClick);
    dispatchTap(board.canvas);
    expect(onClick).not.toHaveBeenCalled();

    board.unmount();
  });

  it('nested hit walks parents for cell userData; miss returns no click', async () => {
    const leaf = { userData: {}, parent: null as unknown };
    const parent = {
      userData: { q: 1, r: -1 },
      parent: null,
    };
    leaf.parent = parent;
    const three = installThreeMock({
      hitQueue: [[{ object: leaf }], []],
    });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onClick = vi.fn();
    const board = await createHexAGoneBoard3D(host, onClick);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    board.update(state, onClick);

    dispatchTap(board.canvas);
    expect(onClick).toHaveBeenCalledWith(1, -1);

    onClick.mockClear();
    dispatchTap(board.canvas);
    expect(onClick).not.toHaveBeenCalled();

    board.unmount();
  });

  it('host clientWidth/Height soft floor feeds resize without throwing', async () => {
    const setSize = vi.fn();
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = setSize;
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      getContext = vi.fn(() => ({}));
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    Object.defineProperty(host, 'clientWidth', { get: () => 0 });
    Object.defineProperty(host, 'clientHeight', { get: () => 0 });
    document.body.appendChild(host);

    const board = await createHexAGoneBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="hex-a-gone"]')).toBeTruthy();
    // Soft floor: Math.max(0||480, 120) → 480 for both axes.
    expect(setSize).toHaveBeenCalledWith(480, 480, false);
    board.unmount();
  });
});

// =============================================================================
// 4. Pure export soft contract (no DOM / no copy pins)
// =============================================================================

describe('q-mp-594 hex-a-gone-board-3d — axialToWorld soft contract', () => {
  it('maps origin and a known axial offset without throwing', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { axialToWorld } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    expect(axialToWorld(0, 0)).toEqual({ x: 0, z: 0 });
    const one = axialToWorld(1, 0);
    expect(one.x).toBeCloseTo(0.95 * 1.5, 5);
    expect(one.z).toBeCloseTo(0.95 * (Math.sqrt(3) / 2), 5);
  });
});
