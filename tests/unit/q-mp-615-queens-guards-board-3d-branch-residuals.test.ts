/**
 * q-mp-615 — Close `queens-guards-board-3d` branch gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `780db960`):
 *   `queens-guards-board-3d.ts` **817** LOC (matches backlog)
 *   Lifecycle coverage **77.09%** lines / **63.38%** branches
 *     (backlog headline **77.1%** / **63.4%**)
 *   Overlay void residual **4** (do **not** clear void here).
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#995`/`546` UI r52 + `#852`/`359` queens AI harness — leave **contained**
 *   `mp3d-queens-guards-board-3d-lifecycle` / `mp3d-queens-guards-board-select`
 *     — prior mount / wood / context-lost / controller select; this suite owns
 *     residual branch arms those leave thin (wood 2d fill, pick/tap, a11y
 *     focus chrome, selected/history/winner tile arms, dispose soft paths).
 *
 * Constraints: tests only; zero `src/` edits; no void ceiling write; queens
 * AI stubbed (flaky); rules.ts for state setup only — no asserts on AI move
 * choice, timing, scoring, legal-move outcomes or rules; no copy/aria/label
 * text pins (element presence, class/attribute chrome, render-call counts);
 * no visual-baseline; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeMove, selectPiece } from '../../src/games/queens-guards/rules';
import {
  cellKey,
  createInitialState,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';

const BOARD_3D_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/three/queens-guards-board-3d.ts'
  ),
  'utf8'
);

/** Flaky queens-guards AI — never exercise real search from this suite. */
vi.mock('../../src/games/queens-guards/ai', () => ({
  getAIMove: () => null,
  applyAIMove: (state: QueensGuardsState) => state,
}));

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
  delete (window as Window & { __mp3dQueensGuards?: unknown })
    .__mp3dQueensGuards;
});

async function mountBoard(
  three: ReturnType<typeof installThreeMock>,
  onClick?: (coord: { ring: number; position: number }) => void
) {
  vi.doMock('../../src/ui/three/load-three', () => ({
    loadThree: async () => three,
  }));
  const { createQueensGuardsBoard3D } =
    await import('../../src/ui/three/queens-guards-board-3d');
  const host = document.createElement('div');
  Object.defineProperty(host, 'clientWidth', { get: () => 400 });
  Object.defineProperty(host, 'clientHeight', { get: () => 400 });
  document.body.appendChild(host);
  const board = await createQueensGuardsBoard3D(host, onClick);
  stubCanvasLayout(board.canvas);
  // Mount resize may have cached a 0×0 jsdom rect before the stub — remeasure.
  window.dispatchEvent(new Event('resize'));
  return { host, board };
}

/** Opening select → move via rules.ts (setup only; no outcome asserts). */
function openingMovedState(): QueensGuardsState {
  let state = createInitialState();
  const from = { ring: 5, position: 7 };
  state = selectPiece(state, from);
  if (!state.selectedPiece) {
    return state;
  }
  // Prefer a quiet adjacent empty — board UI only needs history length > 0.
  const to = { ring: 4, position: 5 };
  return makeMove(state, from, to);
}

// =============================================================================
// 1. Source keep-sites (void overlay + branch-gap contracts)
// =============================================================================

describe('q-mp-615 queens-guards-board-3d — source keep-sites', () => {
  it('re-measures tip LOC + four void shorthand keep-sites', () => {
    const loc = BOARD_3D_SRC.split('\n').length - 1;
    expect(loc).toBe(817);

    expect(BOARD_3D_SRC).toMatch(
      /paintBoard3dAndMarkReady\(\s*canvas,\s*\(\)\s*=>\s*renderer\.render\(scene,\s*camera\),\s*\(\)\s*=>\s*disposed\s*\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /bindPageVisibility\(\{\s*onVisible:\s*\(\)\s*=>\s*paint\(\),\s*\}\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /bindBoard3dLayout\(container,\s*\(\)\s*=>\s*resize\(\)\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /Object\.values\(mats\)\.forEach\(\(m\)\s*=>\s*m\.dispose\(\)\)/
    );
  });

  it('keeps WebGL soft-fail + optional forceContextLoss contracts', () => {
    expect(BOARD_3D_SRC).toMatch(
      /throw new Error\('WebGL context unavailable'\)/
    );
    expect(BOARD_3D_SRC).toMatch(
      /WebGLRenderer failed — Queens & Guards 3D board cannot mount/
    );
    expect(BOARD_3D_SRC).toMatch(/forceContextLoss\?\.\(\)/);
    expect(BOARD_3D_SRC).toMatch(/tearDown\?\.\(\)/);
  });
});

// =============================================================================
// 2. Mount / wood / WebGL residual branches
// =============================================================================

describe('q-mp-615 queens-guards-board-3d — mount residual branches', () => {
  it('wood grain 2d fill path runs when canvas getContext returns 2d', async () => {
    const three = installThreeMock();
    const { host, board } = await mountBoard(three);
    expect(
      host.querySelector('canvas[data-mp3d="queens-guards"]')
    ).toBeTruthy();
    // CanvasTexture constructed after stroke loop (not early-return empty map).
    expect(
      three.__createdMats.some((m) => {
        const opts = m.opts as { map?: unknown } | undefined;
        return Boolean(opts?.map);
      })
    ).toBe(true);
    board.unmount();
  });

  it('wraps constructor throw (Error + non-Error) for 2D fallback', async () => {
    const threeErr = installThreeMock();
    threeErr.WebGLRenderer = class {
      constructor() {
        throw new Error('boom-gpu');
      }
    } as typeof threeErr.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeErr,
    }));
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    await expect(
      createQueensGuardsBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed.*boom-gpu/);

    vi.resetModules();
    const threeNon = installThreeMock();
    threeNon.WebGLRenderer = class {
      constructor() {
        // non-Error throw → "unknown" message arm
        throw 'gpu-string-fail';
      }
    } as typeof threeNon.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeNon,
    }));
    const mod = await import('../../src/ui/three/queens-guards-board-3d');
    await expect(
      mod.createQueensGuardsBoard3D(document.createElement('div'))
    ).rejects.toThrow(/unknown/);
  });

  it('falls through to canvas getContext when renderer.getContext missing', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn((type: string) => {
      if (type === '2d') {
        return {
          fillStyle: '',
          strokeStyle: '',
          lineWidth: 1,
          fillRect: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          stroke: vi.fn(),
        };
      }
      return {};
    });
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
    const { host, board } = await mountBoard(three);
    expect(canvasGet).toHaveBeenCalled();
    expect(
      host.querySelector('canvas[data-mp3d="queens-guards"]')
    ).toBeTruthy();
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
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    Object.defineProperty(host, 'clientWidth', { get: () => 0 });
    Object.defineProperty(host, 'clientHeight', { get: () => 0 });
    document.body.appendChild(host);
    const board = await createQueensGuardsBoard3D(host);
    expect(
      host.querySelector('canvas[data-mp3d="queens-guards"]')
    ).toBeTruthy();
    expect(setSize).toHaveBeenCalledWith(480, 480, false);
    board.unmount();
  });
});

// =============================================================================
// 3. Pick / pointer / visibility / a11y chrome residual branches
// =============================================================================

describe('q-mp-615 queens-guards-board-3d — pick / a11y residual branches', () => {
  it('nested ray hit walks parents; empty hits fall back or stay quiet', async () => {
    const leaf = { userData: {}, parent: null as unknown };
    const parent = {
      userData: { ring: 5, position: 7 },
      parent: null,
    };
    leaf.parent = parent;
    const three = installThreeMock({
      hitQueue: [[{ object: leaf }], []],
    });
    const onClick = vi.fn();
    const { board } = await mountBoard(three, onClick);
    board.update(createInitialState(), onClick);

    dispatchTap(board.canvas);
    expect(onClick).toHaveBeenCalledWith({ ring: 5, position: 7 });

    onClick.mockClear();
    // Second tap: empty ray → nearest-hex fallback may still fire for center
    // of canvas; only assert chrome handler was invoked or stayed quiet without throw.
    expect(() => dispatchTap(board.canvas, 200, 200)).not.toThrow();

    board.unmount();
  });

  it('tap with no click handler / disposed board stays quiet', async () => {
    const three = installThreeMock({
      hitQueue: [
        [{ object: { userData: { ring: 1, position: 0 }, parent: null } }],
      ],
    });
    const { board } = await mountBoard(three);
    board.update(createInitialState());
    expect(() => dispatchTap(board.canvas)).not.toThrow();

    const onClick = vi.fn();
    board.update(createInitialState(), onClick);
    board.unmount();
    expect(() => dispatchTap(board.canvas)).not.toThrow();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('zero-size canvas CSS makes pickCoord return null (ndc soft-fail)', async () => {
    const three = installThreeMock({
      hitQueue: [
        [{ object: { userData: { ring: 0, position: 0 }, parent: null } }],
      ],
    });
    const onClick = vi.fn();
    const { board } = await mountBoard(three, onClick);
    vi.spyOn(board.canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    board.update(createInitialState(), onClick);
    // Force rect re-measure on next pick
    dispatchTap(board.canvas, 10, 10);
    expect(onClick).not.toHaveBeenCalled();
    board.unmount();
  });

  it('visibilitychange visible arm paints without throwing', async () => {
    const three = installThreeMock();
    const { board } = await mountBoard(three);
    board.update(createInitialState());
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    expect(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    }).not.toThrow();
    board.unmount();
  });

  it('a11y focusin / button focus / click chrome without label text pins', async () => {
    const three = installThreeMock();
    const onClick = vi.fn();
    const { host, board } = await mountBoard(three, onClick);
    board.update(createInitialState(), onClick);

    const cell = host.querySelector(
      '.qg-a11y-grid [data-cell-key="5-7"]'
    ) as HTMLButtonElement | null;
    expect(cell).toBeTruthy();
    expect(cell?.getAttribute('data-row')).toBe('5');
    expect(cell?.getAttribute('data-col')).toBe('7');
    expect(cell?.getAttribute('role')).toBe('gridcell');

    cell?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    cell?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    cell?.click();
    expect(onClick).toHaveBeenCalledWith({ ring: 5, position: 7 });

    // focusin outside a11y stays quiet
    host.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    board.unmount();
  });

  it('ringPosToWorld center + outer; cellToClientPoint rejects OOB', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { ringPosToWorld, createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    expect(ringPosToWorld(0, 0)).toEqual({ x: 0, z: 0 });
    const outer = ringPosToWorld(1, 0);
    expect(Number.isFinite(outer.x)).toBe(true);
    expect(Number.isFinite(outer.z)).toBe(true);

    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createQueensGuardsBoard3D(host);
    stubCanvasLayout(board.canvas);
    expect(board.cellToClientPoint(-1, 0)).toBeNull();
    expect(board.cellToClientPoint(99, 0)).toBeNull();
    expect(board.cellToClientPoint(1, -1)).toBeNull();
    expect(board.cellToClientPoint(1, 99)).toBeNull();
    expect(board.cellToClientPoint(0, 0)).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      })
    );
    board.unmount();
  });
});

// =============================================================================
// 4. Update / tile / piece / dispose residual branches
// =============================================================================

describe('q-mp-615 queens-guards-board-3d — update / tile residual branches', () => {
  it('selectedPiece (non-restore) + piece reuse + second update chrome', async () => {
    const three = installThreeMock();
    const { host, board } = await mountBoard(three);
    const first = createInitialState();
    board.update(first);

    let selected = selectPiece(first, { ring: 5, position: 7 });
    if (!selected.selectedPiece) {
      selected = { ...first, selectedPiece: cellKey(5, 7) };
    }
    board.update(selected);
    expect(
      host.querySelector('.qg-a11y-grid [data-cell-key="5-7"]')
    ).toBeTruthy();
    // Same piece kind/owner → syncPiece reuse arm (position refresh).
    board.update(selected);
    expect(
      host.querySelector('canvas[data-mp3d="queens-guards"]')
    ).toBeTruthy();
    expect(host.classList.contains('qg-board-3d-host')).toBe(true);
    board.unmount();
  });

  it('moveHistory / capture / winner-throne tile arms via rules + chrome state', async () => {
    const three = installThreeMock();
    const { host, board } = await mountBoard(three);

    const moved = openingMovedState();
    board.update(moved);
    expect(host.querySelector('.qg-a11y-grid')).toBeTruthy();

    // Capture-tile arm: capturedPieces set, no selected (rules restore path).
    const base = createInitialState();
    const cells = new Map(base.cells);
    cells.set(cellKey(2, 0), {
      ring: 2,
      position: 0,
      piece: { id: 'p2-cap', player: 'player2', type: 'guard' },
    });
    const restoring: QueensGuardsState = {
      ...base,
      cells,
      capturedPieces: [{ ring: 2, position: 0 }],
      selectedPiece: null,
      moveHistory: [
        {
          player: 'player1',
          from: { ring: 5, position: 7 },
          to: { ring: 2, position: 0 },
          pieceType: 'queen',
          wasCapture: true,
          moveNumber: 1,
        },
      ],
    };
    board.update(restoring);
    expect(
      host.querySelector('.qg-a11y-grid [data-cell-key="2-0"]')
    ).toBeTruthy();

    // Winner throne chrome: piece on center owned by winner.
    const winCells = new Map(base.cells);
    winCells.set(cellKey(0, 0), {
      ring: 0,
      position: 0,
      piece: { id: 'p1-queen', player: 'player1', type: 'queen' },
    });
    winCells.set(cellKey(1, 0), {
      ring: 1,
      position: 0,
      piece: { id: 'p1-g0', player: 'player1', type: 'guard' },
    });
    board.update({
      ...base,
      cells: winCells,
      winner: 'player1',
      moveHistory: [
        {
          player: 'player1',
          from: { ring: 5, position: 7 },
          to: { ring: 4, position: 5 },
          pieceType: 'queen',
          wasCapture: false,
          moveNumber: 1,
        },
      ],
    });
    expect(
      host.querySelector('.qg-a11y-grid [data-cell-key="0-0"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('update after unmount is no-op; window debug hook soft-delete; context-lost after dispose', async () => {
    const three = installThreeMock();
    const { host, board } = await mountBoard(three);
    board.update(createInitialState());

    delete (window as Window & { __mp3dQueensGuards?: unknown })
      .__mp3dQueensGuards;
    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);

    expect(() => board.update(createInitialState())).not.toThrow();
    expect(host.querySelector('.qg-a11y-grid')).toBeNull();

    // Context-lost after dispose: early return arm (no second tearDown).
    expect(() => {
      board.canvas.dispatchEvent(
        new Event('webglcontextlost', { cancelable: true, bubbles: true })
      );
    }).not.toThrow();
    expect(() => board.unmount()).not.toThrow();
  });

  it('resize after dispose via window resize stays quiet', async () => {
    const three = installThreeMock();
    const { board } = await mountBoard(three);
    board.unmount();
    expect(() => {
      window.dispatchEvent(new Event('resize'));
    }).not.toThrow();
  });

  it('far empty-ray tap misses nearest-hex fallback (null pick)', async () => {
    const three = installThreeMock({ hitQueue: [[]] });
    const onClick = vi.fn();
    const { board } = await mountBoard(three, onClick);
    board.update(createInitialState(), onClick);
    // Corner far outside hex centers at phone-scale maxDist.
    expect(() => dispatchTap(board.canvas, 0, 0)).not.toThrow();
    expect(onClick).not.toHaveBeenCalled();
    board.unmount();
  });

  it('lastWasCapture tile arm when lastTo is not in captured set', async () => {
    const three = installThreeMock();
    const { host, board } = await mountBoard(three);
    const base = createInitialState();
    board.update({
      ...base,
      capturedPieces: [],
      selectedPiece: null,
      moveHistory: [
        {
          player: 'player1',
          from: { ring: 5, position: 7 },
          to: { ring: 4, position: 5 },
          pieceType: 'queen',
          wasCapture: true,
          moveNumber: 1,
        },
      ],
    });
    expect(
      host.querySelector('.qg-a11y-grid [data-cell-key="4-5"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('a11y focus before first update + experimental-webgl fallback arm', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn((type: string) => {
      if (type === '2d') {
        return {
          fillStyle: '',
          strokeStyle: '',
          lineWidth: 1,
          fillRect: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          stroke: vi.fn(),
        };
      }
      if (type === 'webgl') return null;
      if (type === 'experimental-webgl') return {};
      return null;
    });
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

    const { host, board } = await mountBoard(three);
    expect(canvasGet).toHaveBeenCalledWith('experimental-webgl');

    // Focus chrome before any update → paintFocusOnly soft-return (!lastState).
    const orphan = document.createElement('button');
    orphan.setAttribute('data-row', '0');
    orphan.setAttribute('data-col', '0');
    host.querySelector('.qg-a11y-grid')?.appendChild(orphan);
    orphan.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    orphan.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(
      host.querySelector('canvas[data-mp3d="queens-guards"]')
    ).toBeTruthy();
    board.unmount();
  });
});
