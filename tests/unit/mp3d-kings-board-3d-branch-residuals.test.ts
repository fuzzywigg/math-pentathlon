/**
 * q-mp-608 — Close `kings-quadraphages-board-3d` branch gaps (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1012` @ `780db960`):
 *   File **520** LOC
 *   Spec glob `tests/unit/*kings*board*` baseline:
 *     **79.84%** lines / **48.76%** branches / **80.95%** functions
 *   After this suite (same glob):
 *     **98.02%** lines / **93.38%** branches / **95.23%** functions
 *   Backlog clusters ~462 / 509–510 closed; residual uncovered stmts
 *   91,95,317,364,494 are defensive arms (OOB / disposed / sparse
 *   boardRow) unreachable via the public update loop without src edits.
 *   Prior soft-fail residual ticket on this board-3d host: **0**
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#834`/`331` kings board-3d layout-reads — leave **contained**
 *   `#969`/`502` kings UI cov r47 — leave **contained**
 *   `mp3d-kings-board-3d-lifecycle` / `mp3d-ui-cov-r15-kings-residuals` —
 *     prior happy-path + characterization; this suite owns residual
 *     branch arms the spec glob still misses (r15 is outside `*kings*board*`)
 *
 * Constraints: tests only; ZERO `src/`; stub AI; use game-state only for
 * setup; no asserts on AI choice / timing / scoring / legal-move outcomes
 * or rules; no copy/aria/label text pins (element presence, class/attribute
 * chrome, render-call counts only); no void/nullish ceiling writes; no
 * visual-baseline updates; no network; no ratchet JSON.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
  selectKing,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

vi.mock('../../src/games/kings-quadraphages/ai', () => ({
  getAIMove: vi.fn(() => null),
  getBestMove: vi.fn(() => null),
  getRandomMove: vi.fn(() => null),
  evaluatePosition: vi.fn(() => 0),
  isAITurn: vi.fn(() => false),
}));

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '';
  installCanvas2dStub();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete (window as Window & { __mp3dKingsQuadraphages?: unknown })
    .__mp3dKingsQuadraphages;
});

async function mountBoard(
  three: ReturnType<typeof installThreeMock>,
  onCellClick?: (row: number, col: number) => void
) {
  vi.doMock('../../src/ui/three/load-three', () => ({
    loadThree: async () => three,
  }));
  const { createKingsQuadraphagesBoard3D } =
    await import('../../src/ui/three/kings-quadraphages-board-3d');
  const host = document.createElement('div');
  host.className = 'kings-host-probe';
  document.body.appendChild(host);
  const board = await createKingsQuadraphagesBoard3D(host, onCellClick);
  stubCanvasLayout(board.canvas);
  return { board, host };
}

/** Setup-only state walk — no legal-move / phase outcome asserts. */
function walkKingThenPlace(): GameState {
  let state = createInitialGameState();
  state = selectKing(state);
  state = moveKing(state, { row: 1, col: 4 });
  state = placeQuadraphage(state, { row: 2, col: 2 });
  return state;
}

// =============================================================================
// 1. WebGL mount soft-fail / getContext fallback branches
// =============================================================================

describe('q-mp-608 kings-board-3d — WebGL mount branch residuals', () => {
  it('throws when getContext returns null (dispose + wrap)', async () => {
    const three = installThreeMock();
    const dispose = vi.fn();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = dispose;
      forceContextLoss = vi.fn();
      getContext = vi.fn(() => null);
    } as never;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    await expect(createKingsQuadraphagesBoard3D(host)).rejects.toThrow(
      /WebGLRenderer failed/
    );
    expect(dispose).toHaveBeenCalled();
    expect(host.querySelector('canvas')).toBeNull();
  });

  it('wraps non-Error constructor throw for 2D fallback', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      constructor() {
        throw 'gpu-string-fail';
      }
    } as never;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    await expect(
      createKingsQuadraphagesBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed.*unknown/);
  });

  it('falls through to canvas getContext when renderer.getContext is missing', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn((type: string) =>
      type === 'webgl' || type === 'experimental-webgl' ? {} : null
    );
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
    const { board, host } = await mountBoard(three);
    expect(canvasGet).toHaveBeenCalled();
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    expect(host.classList.contains('board-3d-host')).toBe(true);
    expect(host.classList.contains('kings-board-3d-host')).toBe(true);
    board.unmount();
  });

  it('falls through to experimental-webgl when webgl getContext is null', async () => {
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
      constructor() {
        this.domElement.getContext = canvasGet as never;
      }
    } as unknown as typeof three.WebGLRenderer;
    const { board, host } = await mountBoard(three);
    expect(canvasGet).toHaveBeenCalledWith('webgl');
    expect(canvasGet).toHaveBeenCalledWith('experimental-webgl');
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });
});

// =============================================================================
// 2. Move-target / paint / piece-sync branch residuals
// =============================================================================

describe('q-mp-608 kings-board-3d — move-target / paint / sync branches', () => {
  it('update covers selected / valid-move / place / last mats + piece sync', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);

    let state = createInitialGameState();
    state = selectKing(state);
    board.update(state);

    state = moveKing(state, { row: 1, col: 4 });
    board.update(state);

    state = placeQuadraphage(state, { row: 2, col: 2 });
    board.update(state);
    // Reuse arm: same piece kinds on second paint.
    board.update(state);

    // Player2 select → adjacent move target mat branch.
    state = selectKing(state);
    board.update(state);

    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    expect(board.canvas.classList.contains('board-3d-canvas')).toBe(true);
    board.unmount();
    expect(host.classList.contains('board-3d-host')).toBe(false);
    expect(host.classList.contains('kings-board-3d-host')).toBe(false);
  });

  it('player2 king + quadraphage sync reuse and material arms', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);

    let state = walkKingThenPlace();
    // P2 turn after placeQuadraphage → endTurn.
    state = selectKing(state);
    board.update(state);
    state = moveKing(state, { row: 9, col: 4 });
    board.update(state);
    state = placeQuadraphage(state, { row: 8, col: 2 });
    board.update(state);
    board.update(state);

    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('sparse board row hits update continue without throwing', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);

    const base = createInitialGameState();
    const holeBoard = [...base.board];
    // update() continues when board[row-1] is missing (cells still 1–9).
    holeBoard[3] = undefined as unknown as (typeof holeBoard)[number];
    const state: GameState = {
      ...base,
      board: holeBoard,
      selectedKingPosition: { row: 1, col: 5 },
      turnPhase: 'moveKing',
    };
    expect(() => board.update(state)).not.toThrow();
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('moveHistory sparse last entry skips last-move mat without throwing', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);
    const base = createInitialGameState();
    const hist = [] as GameState['moveHistory'];
    hist.length = 1; // length > 0 but [0] undefined
    const state: GameState = { ...base, moveHistory: hist };
    expect(() => board.update(state)).not.toThrow();
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('visibilitychange while mounted schedules paint without throwing', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);
    board.update(createInitialGameState());

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    expect(() =>
      document.dispatchEvent(new Event('visibilitychange'))
    ).not.toThrow();
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });
});

// =============================================================================
// 3. Pointer / dispose / canvas-reparent branch residuals
// =============================================================================

describe('q-mp-608 kings-board-3d — pointer / dispose / reparent branches', () => {
  it('pointer parent-walk hit, zero-rect NDC miss, no-handler tap', async () => {
    const parent = {
      userData: { row: 3, col: 4, kind: 'tile' },
      parent: null as unknown,
    };
    const child = { userData: {}, parent };
    const three = installThreeMock({
      hitQueue: [[{ object: child }], [{ object: child }]],
    });
    const onCell = vi.fn();
    const { board, host } = await mountBoard(three, onCell);
    board.update(createInitialGameState(), onCell);

    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalledWith(3, 4);

    onCell.mockClear();
    // Invalidate cached CSS rect, then seed a zero box so clientToNdc misses.
    window.dispatchEvent(new Event('resize'));
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
    dispatchTap(board.canvas, 10, 10);
    expect(onCell).not.toHaveBeenCalled();

    // Clear click handler via update — soft tap stays quiet.
    stubCanvasLayout(board.canvas);
    window.dispatchEvent(new Event('resize'));
    board.update(createInitialGameState());
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('tap with no mount handler stays quiet; empty ray hits no-op', async () => {
    const three = installThreeMock({ hitQueue: [[], []] });
    const { board, host } = await mountBoard(three);
    board.update(createInitialGameState());
    expect(() => dispatchTap(board.canvas)).not.toThrow();
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('disposed resize callback early-returns; update/unmount idempotent', async () => {
    const layoutCbs: Array<() => void> = [];
    vi.doMock('../../src/ui/three/tablet-gl', async () => {
      const actual = await vi.importActual<
        typeof import('../../src/ui/three/tablet-gl')
      >('../../src/ui/three/tablet-gl');
      return {
        ...actual,
        bindBoard3dLayout: (_host: Element, onLayout: () => void) => {
          layoutCbs.push(onLayout);
          return () => undefined;
        },
      };
    });
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createKingsQuadraphagesBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialGameState());
    expect(layoutCbs.length).toBeGreaterThan(0);

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    // Post-dispose layout → resize early return (disposed).
    expect(() => layoutCbs[0]?.()).not.toThrow();
    expect(() => board.update(createInitialGameState())).not.toThrow();
    expect(() => board.unmount()).not.toThrow();
    expect(host.classList.contains('board-3d-host')).toBe(false);
  });

  it('double context-lost: second pass hits disposed guard', async () => {
    const three = installThreeMock();
    const { board, host } = await mountBoard(three);
    const lost = () =>
      new Event('webglcontextlost', { cancelable: true, bubbles: true });
    const first = lost();
    board.canvas.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);
    // Canvas may already be removed; second lost is a no-op disposed arm.
    const second = lost();
    board.canvas.dispatchEvent(second);
    expect(host.querySelector('canvas')).toBeNull();
  });

  it('unmount removes canvas when reparented off the host (509–510)', async () => {
    const three = installThreeMock();
    // Omit forceContextLoss to exercise optional-call arm.
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      getContext = vi.fn(() => ({}));
    } as typeof three.WebGLRenderer;

    const { board, host } = await mountBoard(three);
    board.update(walkKingThenPlace());

    const parking = document.createElement('div');
    document.body.appendChild(parking);
    parking.appendChild(board.canvas);
    expect(board.canvas.parentElement).toBe(parking);
    expect(host.contains(board.canvas)).toBe(false);

    board.unmount();
    expect(parking.contains(board.canvas)).toBe(false);
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('kings-board-3d-host')).toBe(false);
  });

  it('host size soft floor + cellToClientPoint lazy CSS seed', async () => {
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
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const host = document.createElement('div');
    Object.defineProperty(host, 'clientWidth', { get: () => 0 });
    Object.defineProperty(host, 'clientHeight', { get: () => 0 });
    document.body.appendChild(host);

    const board = await createKingsQuadraphagesBoard3D(host);
    expect(
      host.querySelector('canvas[data-mp3d="kings-quadraphages"]')
    ).toBeTruthy();
    // Soft floor: Math.max(0||450, 120) → 450.
    expect(setSize).toHaveBeenCalledWith(450, 450, false);

    stubCanvasLayout(board.canvas);
    const pt = board.cellToClientPoint(1, 5);
    expect(typeof pt.x).toBe('number');
    expect(typeof pt.y).toBe('number');
    board.unmount();
  });
});
