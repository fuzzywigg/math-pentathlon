/**
 * q-mp-270 / UI coverage round 15 — Queens + Kwatro board-3d residual arms.
 * Characterization only; no AI choice, timing, or copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import {
  cellKey,
  createInitialState as createQueensState,
} from '../../src/games/queens-guards/types';
import { createInitialState as createKwatroState } from '../../src/games/kwatro-sinko/rules';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-270 ui-cov-r15 queens residuals', () => {
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

  it('empty raycast nearest-hex pickCoord still activates', async () => {
    const three = installThreeMock({ hitQueue: [] });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createQueensGuardsBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);
    board.update(createQueensState(), onCell);

    // No-op Vector3.project → world (0,0) maps to canvas center (throne).
    dispatchTap(board.canvas, 200, 200);
    expect(onCell).toHaveBeenCalledWith({ ring: 0, position: 0 });
    board.unmount();
  });

  it('tile mats: legal moves, last capture, winner throne, a11y focusin, OOB client point', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createQueensGuardsBoard3D(host);
    stubCanvasLayout(board.canvas);

    const base = createQueensState();
    const cells = new Map(base.cells);
    cells.set(cellKey(0, 0), {
      ring: 0,
      position: 0,
      piece: { id: 'p1-queen', player: 'player1', type: 'queen' },
    });
    cells.set(cellKey(1, 0), {
      ring: 1,
      position: 0,
      piece: { id: 'p1-guard-0', player: 'player1', type: 'guard' },
    });

    board.update({
      ...base,
      cells,
      selectedPiece: cellKey(5, 7),
      moveHistory: [
        {
          player: 'player1',
          from: { ring: 5, position: 1 },
          to: { ring: 4, position: 1 },
          pieceType: 'guard',
          wasCapture: true,
          moveNumber: 1,
        },
      ],
      winner: 'player1',
    });

    const btn = host.querySelector(
      '.qg-a11y-grid [data-cell-key="5-7"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(board.cellToClientPoint(-1, 0)).toBeNull();
    expect(board.cellToClientPoint(0, 0)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    board.unmount();
  });
});

describe('q-mp-270 ui-cov-r15 kwatro residuals', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete (window as Window & { __mp3dKwatroSinko?: unknown })
      .__mp3dKwatroSinko;
  });

  it('canvas tap prefers chip handler over node when chip is present', async () => {
    const hitQueue = [[{ object: { userData: { nodeId: 'n0-0' } } }]];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onNode = vi.fn();
    const onChip = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode, onChip);
    stubCanvasLayout(board.canvas);
    board.update(createKwatroState(), onNode, onChip);

    dispatchTap(board.canvas);
    expect(onChip).toHaveBeenCalledWith('p1-0');
    expect(onNode).not.toHaveBeenCalled();
    board.unmount();
  });

  it('empty raycast uses nearest-node pick fallback', async () => {
    const three = installThreeMock({ hitQueue: [] });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onNode = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode);
    stubCanvasLayout(board.canvas);
    board.update(createKwatroState(), onNode);

    // Use projected client point so the no-op Vector3.project y-offset
    // still lands inside maxDist. With a no-op project, z is unused so
    // same-col nodes collapse — first row-major winner is n0-2.
    const pt = board.nodeToClientPoint('n2-2');
    expect(pt).toBeTruthy();
    dispatchTap(board.canvas, pt!.x, pt!.y);
    expect(onNode).toHaveBeenCalledWith('n0-2');
    board.unmount();
  });

  it('winning pads + chip scale; reduced-motion skips emphasize; bad nodeToClientPoint', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(board.canvas);

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));

    const state = createKwatroState();
    board.update({
      ...state,
      selectedChip: 'p1-0',
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: {
        nodes: ['n0-0', 'n0-1', 'n0-2', 'n0-3'],
        chips: [],
        expression: 'align',
        result: 4,
      },
    });

    expect(board.nodeToClientPoint('not-a-node')).toBeNull();
    expect(board.nodeToClientPoint('n2-2')).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    // Motion allowed → emphasize scale path.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    board.update({
      ...state,
      selectedChip: 'p1-0',
      winningAlignment: {
        nodes: ['n0-0', 'n0-1', 'n0-2', 'n0-3'],
        chips: [],
        expression: 'align',
        result: 4,
      },
    });

    board.unmount();
  });
});
