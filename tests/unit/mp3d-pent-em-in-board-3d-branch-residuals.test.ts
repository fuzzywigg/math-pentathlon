/**
 * q-mp-609 — Close `pent-em-in-board-3d` branch gaps (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1012` @ `780db960`):
 *   File **664** LOC; focused `*pent-em*board*` lifecycle coverage
 *   **83.5%** lines / **46.5%** branches. Uncovered clusters ~547,571–594,638.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#1035`/`583` UI-cov r56 pent-em-in games-layer — leave **contained**
 *   `#838`/`330` layout-reads — leave **contained**
 *   `mp3d-pent-em-in-board-3d-lifecycle` / `mp3d-ui-cov-r15` — prior happy
 *     path + some residuals; this suite owns focused-glob branch arms those
 *     leave thin under `tests/unit/*pent-em*board*`.
 *
 * Constraints: tests only; zero `src/` edits; stub AI; rules.ts for state
 * setup only; no AI move-choice / timing / scoring / legal-move outcome
 * asserts; placement path = chrome only; no copy / aria / label text pins;
 * Hex Hard 450ms; no network; no ratchet JSON; no visual-baseline updates.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece, selectPiece } from '../../src/games/pent-em-in/rules';
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

describe('q-mp-609 pent-em-in-board-3d — update tile / ghost / win branch arms', () => {
  it('covers valid/last/focus mats, ghost preview chrome, and both win mats', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onHover = vi.fn();
    const board = await createPentEmInBoard3D(host, undefined, onHover);
    stubCanvasLayout(board.canvas);

    const base = createInitialState();

    // placePiece + selectedPiece → validAnchors + ghost via previewPosition
    board.update(
      {
        ...base,
        phase: 'placePiece',
        selectedPiece: 'X',
        selectedRotation: 0,
        selectedFlipped: false,
        previewPosition: { row: 4, col: 4 },
      },
      undefined,
      onHover
    );
    expect(
      host.querySelector('.pent-a11y-grid [data-row="4"][data-col="4"]')
    ).toBeTruthy();

    // Edge preview exercises ghost cell OOB continue arms (chrome only).
    board.update({
      ...base,
      phase: 'placePiece',
      selectedPiece: 'F',
      selectedRotation: 0,
      selectedFlipped: false,
      previewPosition: { row: 9, col: 9 },
    });
    expect(host.querySelector('canvas[data-mp3d="pent-em-in"]')).toBeTruthy();

    // focusedCell fallback when previewPosition is null (a11y focus → hover).
    board.update(
      {
        ...base,
        phase: 'placePiece',
        selectedPiece: 'X',
        selectedRotation: 0,
        selectedFlipped: false,
        previewPosition: null,
      },
      undefined,
      onHover
    );
    const focusBtn = host.querySelector(
      '.pent-a11y-grid [data-row="2"][data-col="3"]'
    ) as HTMLButtonElement;
    expect(focusBtn).toBeTruthy();
    focusBtn.focus();
    expect(onHover).toHaveBeenCalled();
    board.update(
      {
        ...base,
        phase: 'placePiece',
        selectedPiece: 'X',
        selectedRotation: 0,
        selectedFlipped: false,
        previewPosition: null,
      },
      undefined,
      onHover
    );

    const xCells = [
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 2 },
    ];
    const iCells = [
      { row: 5, col: 0 },
      { row: 5, col: 1 },
      { row: 5, col: 2 },
      { row: 5, col: 3 },
      { row: 5, col: 4 },
    ];

    // lastCells + player1 win mats
    board.update({
      ...base,
      phase: 'gameOver',
      winner: 'player1',
      placedPieces: [
        {
          id: 'p1-X-0',
          shapeId: 'X',
          player: 'player1',
          position: { row: 2, col: 2 },
          rotation: 0,
          flipped: false,
          cells: xCells,
        },
      ],
      moveHistory: [
        {
          player: 'player1',
          shapeId: 'X',
          position: { row: 2, col: 2 },
          rotation: 0,
          flipped: false,
          moveNumber: 1,
        },
      ],
    });
    expect(
      host.querySelector('.pent-a11y-grid [data-row="2"][data-col="2"]')
    ).toBeTruthy();

    // player2 win mats + ownerLabel Red arm via occupied a11y cells
    board.update({
      ...base,
      phase: 'gameOver',
      winner: 'player2',
      placedPieces: [
        {
          id: 'p2-I5-0',
          shapeId: 'I5',
          player: 'player2',
          position: { row: 5, col: 0 },
          rotation: 0,
          flipped: false,
          cells: iCells,
        },
      ],
      moveHistory: [
        {
          player: 'player2',
          shapeId: 'I5',
          position: { row: 5, col: 0 },
          rotation: 0,
          flipped: false,
          moveNumber: 1,
        },
      ],
    });
    expect(
      host.querySelector('.pent-a11y-grid [data-row="5"][data-col="2"]')
    ).toBeTruthy();

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
  });

  it('uses rules setup for placed-piece chrome without legal-move asserts', async () => {
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

    let state = createInitialState();
    state = selectPiece(state, 'X');
    state = placePiece(state, 'X', { row: 4, col: 4 }, 0, false);
    board.update(state);

    // Chrome only — grid cells + host class, not placement legality.
    expect(host.classList.contains('pent-board-3d-host')).toBe(true);
    expect(
      host.querySelectorAll('.pent-a11y-grid [data-row][data-col]').length
    ).toBe(100);

    board.unmount();
  });
});

describe('q-mp-609 pent-em-in-board-3d — pointer / a11y / dispose branch arms', () => {
  it('pointer hit / miss / leave / non-primary touch + a11y activate chrome', async () => {
    const leaf = { userData: {}, parent: null as unknown };
    const parent = {
      userData: { row: 3, col: 4 },
      parent: null,
    };
    leaf.parent = parent;
    const three = installThreeMock({
      hitQueue: [
        [{ object: leaf }],
        [{ object: leaf }],
        [],
        [{ object: { userData: { row: 1, col: 1 } } }],
        [],
      ],
    });
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
    board.update(createInitialState(), onCell, onHover);

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );
    expect(onHover).toHaveBeenCalled();

    // Non-primary touch is ignored.
    onHover.mockClear();
    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'touch',
        clientX: 200,
        clientY: 200,
        isPrimary: false,
      })
    );
    expect(onHover).not.toHaveBeenCalled();

    board.canvas.dispatchEvent(new Event('pointerleave'));

    dispatchTap(board.canvas);
    expect(onCell).toHaveBeenCalledWith({ row: 3, col: 4 });

    // Empty ray hit — quiet.
    onCell.mockClear();
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    // Zero-size canvas → pickCell null (clientToNdc soft miss).
    // Invalidate cached CSS rect via layout binder, then re-measure zeros.
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
    onCell.mockClear();
    dispatchTap(board.canvas);
    expect(onCell).not.toHaveBeenCalled();

    const btn = host.querySelector(
      '.pent-a11y-grid [data-row="0"][data-col="0"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(onCell).toHaveBeenCalledWith({ row: 0, col: 0 });

    board.unmount();
  });

  it('update after unmount / context-lost after dispose stay quiet', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onHover = vi.fn();
    const board = await createPentEmInBoard3D(host, undefined, onHover);
    stubCanvasLayout(board.canvas);

    const canvas = board.canvas;
    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();

    expect(() =>
      board.update(createInitialState(), undefined, onHover)
    ).not.toThrow();
    onHover.mockClear();
    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 10,
        clientY: 10,
        isPrimary: true,
      })
    );
    expect(onHover).not.toHaveBeenCalled();

    canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
    expect(host.querySelector('canvas')).toBeNull();

    // Second unmount idempotent; window helper already cleared.
    expect(window.__mp3dPentEmIn).toBeUndefined();
    board.unmount();
    expect(host.classList.contains('board-3d-host')).toBe(false);
  });

  it('unmount tolerates cleared window helper and detached a11y node', async () => {
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
    board.update(createInitialState());

    delete window.__mp3dPentEmIn;
    const a11y = host.querySelector('.pent-a11y-grid');
    a11y?.parentElement?.removeChild(a11y);

    board.unmount();
    expect(host.querySelector('canvas')).toBeNull();
    expect(host.classList.contains('pent-board-3d-host')).toBe(false);
  });
});

describe('q-mp-609 pent-em-in-board-3d — WebGL mount soft-fail branch arms', () => {
  it('falls through to canvas getContext when renderer.getContext is missing', async () => {
    const three = installThreeMock();
    const canvasGet = vi.fn((type: string) => (type === 'webgl' ? {} : null));
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
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPentEmInBoard3D(host);
    expect(canvasGet).toHaveBeenCalled();
    expect(host.querySelector('canvas[data-mp3d="pent-em-in"]')).toBeTruthy();
    board.unmount();
  });

  it('uses experimental-webgl when webgl context is null', async () => {
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
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const board = await createPentEmInBoard3D(host);
    expect(canvasGet).toHaveBeenCalledWith('experimental-webgl');
    expect(host.querySelector('canvas[data-mp3d="pent-em-in"]')).toBeTruthy();
    board.unmount();
  });

  it('wraps non-Error constructor throw for 2D fallback messaging', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      constructor() {
        throw 'gpu-string-fail';
      }
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    await expect(
      createPentEmInBoard3D(document.createElement('div'))
    ).rejects.toThrow(/WebGLRenderer failed/);
  });

  it('player2 non-win body mat + quiet hover/tap without handlers', async () => {
    const three = installThreeMock({
      hitQueue: [[{ object: { userData: { row: 0, col: 0 } } }]],
    });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    // Mount with no click/hover handlers — soft-fail arms stay quiet.
    const board = await createPentEmInBoard3D(host);
    stubCanvasLayout(board.canvas);

    board.update({
      ...createInitialState(),
      phase: 'selectPiece',
      placedPieces: [
        {
          id: 'p2-X-0',
          shapeId: 'X',
          player: 'player2',
          position: { row: 2, col: 2 },
          rotation: 0,
          flipped: false,
          cells: [
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
          ],
        },
      ],
    });
    expect(
      host.querySelector('.pent-a11y-grid [data-row="2"][data-col="2"]')
    ).toBeTruthy();

    board.canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 200,
        isPrimary: true,
      })
    );
    board.canvas.dispatchEvent(new Event('pointerleave'));
    expect(() => dispatchTap(board.canvas)).not.toThrow();

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
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const host = document.createElement('div');
    Object.defineProperty(host, 'clientWidth', { get: () => 0 });
    Object.defineProperty(host, 'clientHeight', { get: () => 0 });
    document.body.appendChild(host);

    const board = await createPentEmInBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="pent-em-in"]')).toBeTruthy();
    // Soft floor: Math.max(0||400, 120) → 400 for both axes.
    expect(setSize).toHaveBeenCalledWith(400, 400, false);
    board.unmount();
  });
});
