/**
 * q-mp-167 / UI coverage round 8 — a11y activate + pointer/hover arms on
 * coldest board-3d modules. Characterization only; no AI choice/timing.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import { createInitialGameState as createKingsState } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as createQueensState } from '../../src/games/queens-guards/types';
import { createInitialState as createHexState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import { createInitialState as createPrimeState } from '../../src/games/prime-gold/rules';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-167 ui-cov-r8 board a11y + pointer', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dFiar?: unknown }).__mp3dFiar;
    delete (window as Window & { __mp3dHexAGone?: unknown }).__mp3dHexAGone;
    delete (window as Window & { __mp3dQueensGuards?: unknown }).__mp3dQueensGuards;
  });

  it('FIAR a11y click + raycast tap invoke node handler', async () => {
    const hitQueue = [
      [{ object: { userData: { nodeId: 'c3r3', kind: 'space' } } }],
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
    board.update(createFiarState(), onNode);

    const cell = host.querySelector(
      '.fiar-a11y-grid [data-node-id]'
    ) as HTMLButtonElement;
    expect(cell).toBeTruthy();
    cell.click();
    expect(onNode).toHaveBeenCalled();

    onNode.mockClear();
    dispatchTap(board.canvas);
    expect(onNode).toHaveBeenCalledWith('c3r3');

    board.update(createFiarState());
    board.unmount();
    board.unmount();
    board.update(createFiarState(), onNode);
  });

  it('Kings raycast tap invokes cell handler (no a11y grid)', async () => {
    const hitQueue = [
      [{ object: { userData: { row: 1, col: 5, kind: 'tile' } } }],
    ];
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
    board.update(createKingsState(), onCell);
    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalledWith(1, 5);
    board.unmount();
  });

  it('Queens a11y click + wood texture 2d path mounts', async () => {
    const hitQueue = [
      [{ object: { userData: { ring: 5, position: 0, kind: 'tile' } } }],
    ];
    const three = installThreeMock({ hitQueue });
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
    expect(
      three.__createdMats.some((m) => {
        const opts = m.opts as { map?: unknown } | undefined;
        return Boolean(opts?.map);
      })
    ).toBe(true);

    board.update(createQueensState(), onCell);
    const btn = host.querySelector(
      '.qg-a11y-grid [data-cell-key]'
    ) as HTMLButtonElement;
    btn.click();
    expect(onCell).toHaveBeenCalled();

    onCell.mockClear();
    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalled();
    board.unmount();
  });

  it('Hex a11y click + hover pointermove/leave in placeBlocks', async () => {
    const hitQueue = [
      [{ object: { userData: { q: 0, r: 0 } } }],
      [{ object: { userData: { q: 0, r: 0 } } }],
      [{ object: { userData: { q: 1, r: 0 } } }],
      [],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createHexAGoneBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);

    let state = createHexState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    board.update(state, onCell);

    const btn = host.querySelector(
      '.hex-a-gone-a11y-grid [data-q="0"][data-r="0"]'
    ) as HTMLButtonElement;
    btn.click();
    expect(onCell).toHaveBeenCalledWith(0, 0);

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );
    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 210,
        clientY: 210,
        isPrimary: true,
      })
    );
    board.canvas.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));

    onCell.mockClear();
    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalled();
    board.unmount();
  });

  it('Pent a11y click + hover focus + pointermove', async () => {
    const hitQueue = [
      [{ object: { userData: { row: 2, col: 2, kind: 'tile' } } }],
      [{ object: { userData: { row: 2, col: 3, kind: 'tile' } } }],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const onHover = vi.fn();
    const board = await createPentEmInBoard3D(host, onCell, onHover);
    stubCanvasLayout(board.canvas);
    board.update(createPentState(), onCell, onHover);

    const btn = host.querySelector(
      '.pent-a11y-grid [data-row="0"][data-col="0"]'
    ) as HTMLButtonElement;
    btn.click();
    expect(onCell).toHaveBeenCalledWith({ row: 0, col: 0 });
    btn.focus();
    expect(onHover).toHaveBeenCalled();

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );
    board.canvas.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith(null);
    board.unmount();
  });

  it('Prime Gold a11y click on valid placement + focus highlight', async () => {
    const hitQueue = [
      [{ object: { userData: { value: 1, kind: 'tile' } } }],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPrimeGoldBoard3D } =
      await import('../../src/ui/three/prime-gold-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onCell = vi.fn();
    const board = await createPrimeGoldBoard3D(host, onCell);
    stubCanvasLayout(board.canvas);
    const placing = {
      ...createPrimeState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    board.update(placing, onCell);

    const focusable = host.querySelector(
      '.pg-a11y-grid button[tabindex="0"]'
    ) as HTMLButtonElement | null;
    expect(focusable).toBeTruthy();
    focusable!.focus();
    focusable!.click();
    expect(onCell).toHaveBeenCalled();

    onCell.mockClear();
    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalled();
    board.unmount();
  });
});
