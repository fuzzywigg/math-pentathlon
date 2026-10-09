/**
 * q-mp-270 / UI coverage round 15 — Kings board-3d mount/update/pointer residuals.
 * Characterization only; no AI choice or timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-270 ui-cov-r15 kings residuals', () => {
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

  it('mount throws when WebGL getContext returns null', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
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
      /WebGLRenderer failed — Kings/
    );
  });

  it('update covers selected / valid / place / last mats + king/quad sync reuse', async () => {
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

    let state = createInitialGameState();
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual({ row: 1, col: 5 });
    board.update(state);

    // Adjacent empty square for king move (1-based).
    state = moveKing(state, { row: 1, col: 4 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    board.update(state);

    state = placeQuadraphage(state, { row: 2, col: 2 });
    board.update(state);
    // Second update with same piece kinds hits syncPiece reuse arm.
    board.update(state);

    expect(board.canvas.getAttribute('data-mp3d')).toBe('kings-quadraphages');
    board.unmount();
  });

  it('pointer parent-walk hit, zero-rect NDC miss, and disposed tap no-op', async () => {
    const parent = {
      userData: { row: 3, col: 4, kind: 'tile' },
      parent: null as unknown,
    };
    const child = { userData: {}, parent };
    parent.parent = null;
    const hitQueue = [[{ object: child }]];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createKingsQuadraphagesBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);
    board.update(createInitialGameState(), onCell);

    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalledWith(3, 4);

    onCell.mockClear();
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

    board.unmount();
    stubCanvasLayout(board.canvas);
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();
  });

  it('dispose race: double context-lost + post-dispose resize/update', async () => {
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

    const lost = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(lost);
    // Second unmount path / disposed guard (canvas may already be removed).
    board.unmount();
    board.update(createInitialGameState());
    window.dispatchEvent(new Event('resize'));
    expect(host.querySelector('canvas')).toBeNull();
  });
});
