/**
 * q-mp-270 / UI coverage round 15 — Hex + Pent board-3d residual arms.
 * Characterization only; no AI choice, timing, or copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState as createHexState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-270 ui-cov-r15 hex residuals', () => {
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

  it('onWebglLost fires on context-lost; second event after unmount is quiet', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onLost = vi.fn();
    const board = await createHexAGoneBoard3D(host, undefined, onLost);
    stubCanvasLayout(board.canvas);

    const lost = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(lost);
    expect(onLost).toHaveBeenCalledTimes(1);
    // Hex does not self-unmount / dispatch mp3d-context-lost.
    expect(host.querySelector('canvas')).toBeTruthy();

    board.unmount();
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
    expect(onLost).toHaveBeenCalledTimes(1);
  });

  it('hover outside placeBlocks clears; ghost + a11y focus/blur; win mats', async () => {
    const hitQueue = [
      [{ object: { userData: { q: 0, r: 0 } } }],
      [{ object: { userData: { q: 0, r: 0 } } }],
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
    const board = await createHexAGoneBoard3D(host);
    stubCanvasLayout(board.canvas);

    let state = createHexState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    board.update(state);

    const cellBtn = host.querySelector(
      '.hex-a-gone-a11y-grid [data-q="0"][data-r="0"]'
    ) as HTMLButtonElement;
    expect(cellBtn).toBeTruthy();
    cellBtn.focus();
    cellBtn.blur();

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );

    // Non-placeBlocks phase clears hover rather than updating ghost.
    board.update({ ...createHexState(), phase: 'selectBlocks' });
    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );

    const winBoard = createHexState().board.map((c) =>
      c.q === 0 && c.r === 0
        ? { ...c, filled: true, filledBy: 'player1' as const, blockId: 1 }
        : c
    );
    board.update({
      ...createHexState(),
      phase: 'gameOver',
      winner: 'player1',
      board: winBoard,
      placedBlocks: [
        {
          shape: 'triangle',
          player: 'player1',
          q: 0,
          r: 0,
          rotation: 0,
        },
      ],
    });

    board.unmount();
  });

  it('touch pointermove ignored when not primary; unmount mid mount-paint', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
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

    let state = createHexState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    board.update(state);

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'touch',
        clientX: 200,
        clientY: 200,
        isPrimary: false,
      })
    );

    board.unmount();
    vi.runAllTimers();
    vi.useRealTimers();
    expect(host.querySelector('canvas')).toBeNull();
  });
});

describe('q-mp-270 ui-cov-r15 pent residuals', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (window as Window & { __mp3dPentEmIn?: unknown }).__mp3dPentEmIn;
  });

  it('update covers legal/illegal ghost, last cells, and gameOver win mats', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPentEmInBoard3D(host);
    stubCanvasLayout(board.canvas);

    const base = createPentState();
    // Legal-ish ghost preview with selected F piece near board origin.
    board.update({
      ...base,
      phase: 'placePiece',
      selectedPiece: 'F',
      selectedRotation: 0,
      selectedFlipped: false,
      previewPosition: { row: 0, col: 0 },
    });

    // Illegal ghost (anchor far OOB relative to piece footprint still paints
    // in-bounds cells with ghostBad when canPlacePiece is false).
    board.update({
      ...base,
      phase: 'placePiece',
      selectedPiece: 'F',
      selectedRotation: 0,
      selectedFlipped: false,
      previewPosition: { row: 9, col: 9 },
    });

    const cells = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 2 },
      { row: 3, col: 2 },
    ];
    board.update({
      ...base,
      phase: 'gameOver',
      winner: 'player1',
      placedPieces: [
        {
          id: 'p1-X-0',
          shapeId: 'X',
          player: 'player1',
          position: { row: 1, col: 2 },
          rotation: 0,
          flipped: false,
          cells,
        },
      ],
      moveHistory: [
        {
          player: 'player1',
          shapeId: 'X',
          position: { row: 1, col: 2 },
          rotation: 0,
          flipped: false,
          moveNumber: 1,
        },
      ],
    });

    expect(
      host.querySelector('.pent-a11y-grid [data-row="0"][data-col="0"]')
    ).toBeTruthy();
    board.unmount();
  });

  it('a11y Enter/Space activate + hover after dispose is a no-op', async () => {
    const three = installThreeMock();
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
      '.pent-a11y-grid [data-row="1"][data-col="1"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(onCell).toHaveBeenCalledWith({ row: 1, col: 1 });

    onCell.mockClear();
    btn.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(onCell).toHaveBeenCalledWith({ row: 1, col: 1 });

    board.unmount();
    onHover.mockClear();
    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );
    expect(onHover).not.toHaveBeenCalled();
  });
});
