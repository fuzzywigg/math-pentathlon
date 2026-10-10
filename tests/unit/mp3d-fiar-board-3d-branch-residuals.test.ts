/**
 * q-mp-611 — Close `fiar-board-3d` branch gaps (tests-only).
 * Characterization of residual arms after lifecycle-only coverage.
 * No AI choice / timing / scoring / legal-move outcome asserts;
 * no copy / aria / label text pins; ZERO `src/` edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState } from '../../src/games/fiar/types';
import type { FiarGameState } from '../../src/games/fiar/types';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

vi.mock('../../src/games/fiar/ai', () => ({
  findBestMove: vi.fn(() => null),
  findBestMoveWithMeta: vi.fn(() => ({ move: null, truncated: false })),
  chooseAIMove: vi.fn(() => null),
}));

function withChip(
  state: FiarGameState,
  nodeId: string,
  chip: 'player1' | 'player2',
  chipKind: 'plain' | 'marked' = 'plain'
): FiarGameState {
  const node = state.board.nodes.get(nodeId);
  if (!node) {
    return state;
  }
  const nodes = new Map(state.board.nodes);
  nodes.set(nodeId, { ...node, chip, chipKind });
  return { ...state, board: { ...state.board, nodes } };
}

describe('q-mp-611 fiar-board-3d branch residuals', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dFiar?: unknown }).__mp3dFiar;
  });

  it('WebGL getContext fallback + non-Error mount failure arms', async () => {
    const three = installThreeMock();
    // Prefer canvas webgl / experimental-webgl when renderer.getContext is absent.
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      constructor() {
        this.domElement.getContext = vi.fn((type: string) => {
          if (type === 'webgl') {
            return null;
          }
          if (type === 'experimental-webgl') {
            return {};
          }
          return null;
        }) as never;
      }
    } as typeof three.WebGLRenderer;

    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createFiarBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="fiar"]')).toBeTruthy();
    board.unmount();

    // Non-Error throw → catch stringifies as "unknown"
    vi.resetModules();
    const threeFail = installThreeMock();
    threeFail.WebGLRenderer = class {
      constructor() {
        throw Object.assign(Object.create(null), { reason: 'boom' });
      }
    } as typeof threeFail.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => threeFail,
    }));
    const mod = await import('../../src/ui/three/fiar-board-3d');
    await expect(
      mod.createFiarBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed/);
  });

  it('pointer pick: hit / parent walk / miss / zero-rect / no-handler / disposed', async () => {
    const parent = {
      userData: { nodeId: 'c3r3', kind: 'space' },
      parent: null as unknown,
    };
    const child = { userData: {}, parent };
    const orphan = { userData: { kind: 'diamond' }, parent: null };
    const hitQueue = [
      [{ object: child }],
      [{ object: orphan }],
      [
        {
          object: { userData: { nodeId: 'c4r3', kind: 'chip' }, parent: null },
        },
      ],
      [{ object: child }],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onNode = vi.fn();
    const board = await createFiarBoard3D(host, onNode);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState(), onNode);

    dispatchTap(board.canvas);
    expect(onNode).toHaveBeenCalledWith('c3r3');

    onNode.mockClear();
    dispatchTap(board.canvas);
    // orphan hit has no nodeId up the parent chain
    expect(onNode).not.toHaveBeenCalled();

    onNode.mockClear();
    dispatchTap(board.canvas);
    expect(onNode).toHaveBeenCalledWith('c4r3');

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
    window.dispatchEvent(new Event('resize'));
    onNode.mockClear();
    dispatchTap(board.canvas);
    expect(onNode).not.toHaveBeenCalled();

    stubCanvasLayout(board.canvas);
    window.dispatchEvent(new Event('resize'));
    // Drop click handler → pickFromEvent early return
    board.update(createInitialState());
    onNode.mockClear();
    dispatchTap(board.canvas);
    expect(onNode).not.toHaveBeenCalled();

    board.unmount();
    dispatchTap(board.canvas);
    expect(onNode).not.toHaveBeenCalled();
  });

  it('update arms: pads / chips / dots / winning emphasize / a11y tab stop', async () => {
    vi.doMock('../../src/ui/reduced-motion', () => ({
      prefersReducedMotion: () => false,
    }));
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onNode = vi.fn();
    const board = await createFiarBoard3D(host, onNode);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    state = withChip(state, 'c3r3', 'player1', 'marked');
    state = withChip(state, 'c5r3', 'player2', 'plain');
    // Bad id exercises parseNodeId continue arms on nodes + edges.
    const nodes = new Map(state.board.nodes);
    nodes.set('bad-id', {
      id: 'bad-id',
      x: 0,
      y: 0,
      chip: null,
      chipKind: null,
    });
    const edges = [
      ...state.board.edges,
      { from: 'bad-id', to: 'c3r3', crossesYellowCenter: false },
      { from: 'c3r3', to: 'also-bad', crossesYellowCenter: false },
    ];
    state = {
      ...state,
      board: { ...state.board, nodes, edges },
      phase: 'movement',
      selectedNode: 'c3r3',
      winningPath: ['c3r3', 'c5r3'],
      winner: 'player1',
    };
    board.update(state, onNode);
    expect(
      host.querySelector('.fiar-a11y-grid [data-node-id="c3r3"]')
    ).toBeTruthy();
    expect(
      host.querySelector('.fiar-a11y-grid [data-node-id="c5r3"]')
    ).toBeTruthy();
    expect(
      host.querySelector('.fiar-a11y-grid [data-node-id="bad-id"]')
    ).toBeTruthy();

    // Chip material reuse + demark (remove marked dot).
    state = withChip(state, 'c3r3', 'player2', 'plain');
    board.update(state, onNode);

    // Missing mesh target after pads already built.
    state.board.nodes.delete('c5r3');
    board.update(state, onNode);

    // Placement hover pad arm (empty spaces).
    board.update(createInitialState(), onNode);

    // gameOver: no placement/selectable/valid → force first tab stop.
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    board.update(over, onNode);
    expect(host.querySelector('.fiar-a11y-grid [tabindex="0"]')).toBeTruthy();

    const a11yBtn = host.querySelector(
      '.fiar-a11y-grid [data-node-id="c3r3"]'
    ) as HTMLButtonElement | null;
    expect(a11yBtn).toBeTruthy();
    a11yBtn!.click();
    expect(onNode).toHaveBeenCalled();

    expect(board.nodeToClientPoint('not-a-node')).toBeNull();
    expect(board.nodeToClientPoint('c3r3')).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );

    // Visibility paint + resize while mounted.
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('resize'));

    const lost = vi.fn();
    host.addEventListener('mp3d-context-lost', lost);
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
    expect(lost).toHaveBeenCalledTimes(1);
    // Second lost after dispose is quiet.
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
    expect(lost).toHaveBeenCalledTimes(1);

    board.update(createInitialState(), onNode);
    window.dispatchEvent(new Event('resize'));
    board.unmount();
    board.unmount();
  });

  it('host clientWidth/Height soft floor + double-unmount chrome', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    Object.defineProperty(host, 'clientWidth', {
      configurable: true,
      get: () => 0,
    });
    Object.defineProperty(host, 'clientHeight', {
      configurable: true,
      get: () => 0,
    });
    document.body.appendChild(host);
    const board = await createFiarBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());
    window.dispatchEvent(new Event('resize'));
    expect(host.classList.contains('fiar-board-3d-host')).toBe(true);
    expect(host.querySelector('canvas[data-mp3d="fiar"]')).toBeTruthy();
    expect(host.querySelector('.fiar-a11y-grid')).toBeTruthy();
    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.querySelector('.fiar-a11y-grid')).toBeNull();
    expect(host.classList.contains('board-3d-host')).toBe(false);
    expect(host.classList.contains('fiar-board-3d-host')).toBe(false);
  });
});
