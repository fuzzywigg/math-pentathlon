/**
 * q-mp-167 / UI coverage round 8 — update / visibility / wood / star-track arms.
 * Characterization only; no AI choice or timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState as createKwatroState } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import { createInitialState as createStarState } from '../../src/games/star-track/types';
import { createInitialState as createQueensState } from '../../src/games/queens-guards/types';
import { cellKey } from '../../src/games/queens-guards/types';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-167 ui-cov-r8 board update arms', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dKwatroSinko?: unknown }).__mp3dKwatroSinko;
    delete (window as Window & { __mp3dStarTrack?: unknown }).__mp3dStarTrack;
    delete (window as Window & { __mp3dFiar?: unknown }).__mp3dFiar;
  });

  it('Kwatro wood + chip number textures use 2d canvas path', async () => {
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
    board.update(createKwatroState());
    expect(three.__createdMats.some((m) => (m.opts as { map?: unknown })?.map)).toBe(
      true
    );
    // Resize while mounted
    window.dispatchEvent(new Event('resize'));
    // Visibility paint path
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
    board.unmount();
    // Post-dispose no-ops
    board.update(createKwatroState());
    window.dispatchEvent(new Event('resize'));
  });

  it('FIAR update covers selected / valid / marked / winner pad materials', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createFiarBoard3D(host);
    stubCanvasLayout(board.canvas);

    const base = createFiarState();
    const n = base.board.nodes.get('c3r3')!;
    base.board.nodes.set('c3r3', {
      ...n,
      chip: 'player1',
      chipKind: 'marked',
    });
    board.update({
      ...base,
      selectedNode: 'c3r3',
      phase: 'movement',
      winningPath: ['c3r3'],
      winner: 'player1',
    });
    expect(
      host.querySelector('.fiar-a11y-grid [data-node-id="c3r3"]')
    ).toBeTruthy();
    expect(board.nodeToClientPoint('not-a-node')).toBeNull();
    expect(board.nodeToClientPoint('c3r3')).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    board.unmount();
  });

  it('Queens update covers selected piece + captured restore labels', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createQueensGuardsBoard3D(host);
    const base = createQueensState();
    const cells = new Map(base.cells);
    cells.set(cellKey(2, 0), {
      ring: 2,
      position: 0,
      piece: { id: 'p2-g', player: 'player2', type: 'guard' },
    });
    board.update({
      ...base,
      cells,
      currentPlayer: 'player1',
      capturedPieces: [{ ring: 2, position: 0 }],
      selectedPiece: cellKey(2, 0),
      winner: null,
    });
    expect(
      host.querySelector('.qg-a11y-grid [data-cell-key="2-0"]')
    ).toBeTruthy();
    // Double context-lost: first tears down; second is a no-op once disposed.
    const lost = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(lost);
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
  });

  it('Star Track a11y focus/blur + selectChain highlight arms', async () => {
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

    const state = {
      ...createStarState(),
      phase: 'selectChain' as const,
      player1Position: 3,
      player2Position: 2,
      drawnChains: [
        { length: 3 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ],
      moveHistory: [
        {
          player: 'player1' as const,
          chainUsed: 3 as const,
          fromPosition: 0,
          toPosition: 3,
          moveNumber: 1,
        },
      ],
    };
    board.update(state, {
      onDrawChains: vi.fn(),
      onSelectChain: vi.fn(),
      gameMode: 'vsHuman',
    });

    const anyBtn = host.querySelector(
      '.star-track-a11y-track [data-player="player1"][data-space="3"]'
    ) as HTMLButtonElement;
    expect(anyBtn).toBeTruthy();
    anyBtn.focus();
    anyBtn.blur();

    board.update({
      ...state,
      winner: 'player1',
      player1Position: 12,
    });
    expect(board.spaceToClientPoint('player1', 12)).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    board.unmount();
    expect(board.spaceToClientPoint('player1', 0)).toBeNull();
  });
});
