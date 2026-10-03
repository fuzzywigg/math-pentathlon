import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  BOARD_SIZE,
  type PentEmInState,
  type BoardCell,
} from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

const isBoard3dEnabled = vi.fn(() => false);
const loadPentEmInBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/pent-em-in/board-3d-loader', () => ({
  loadPentEmInBoard3DModule: () => loadPentEmInBoard3DModule(),
}));

/** Near-full board where one X placement traps the opponent. */
function almostTrappedState(): PentEmInState {
  let state = createInitialState();
  // Fill the board with a checker of tiny “occupied” cells via direct mutation
  // so only a few empties remain; then leave a 5-cell X pocket for player1.
  const board: BoardCell[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row]![col] = {
        row,
        col,
        occupied: true,
        owner: 'player2',
        pieceId: 'fill',
      };
    }
  }
  // Clear X-shaped pocket for anchor (1,1): cells (1,2)(2,1)(2,2)(2,3)(3,2)
  const pocket = [
    { row: 1, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 3, col: 2 },
  ];
  for (const c of pocket) {
    board[c.row]![c.col] = {
      row: c.row,
      col: c.col,
      occupied: false,
      owner: null,
      pieceId: null,
    };
  }
  // After X fills the pocket, the board is full → opponent can't move.

  state = {
    ...state,
    board,
    phase: 'placePiece',
    selectedPiece: 'X',
    selectedRotation: 0,
    selectedFlipped: false,
    player1Pieces: {
      available: ['X'],
      placed: [],
    },
    player2Pieces: {
      available: ['I5', 'X'],
      placed: [],
    },
  };
  return state;
}

describe("mp3d Pent'Em In board view selection", () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadPentEmInBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    try {
      const { destroyGame } =
        await import('../../src/games/pent-em-in/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/pent-em-in/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadPentEmInBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('.pent-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view and destroyGame unmounts', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'pent-em-in');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createPentEmInBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      const a11y = document.createElement('div');
      a11y.className = 'pent-a11y-grid';
      container.appendChild(a11y);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadPentEmInBoard3DModule.mockResolvedValue({
      createPentEmInBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/pent-em-in/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadPentEmInBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createPentEmInBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(board.querySelector('canvas[data-mp3d="pent-em-in"]')).not.toBeNull();
    expect(board.querySelector('.pent-board')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL create failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadPentEmInBoard3DModule.mockResolvedValue({
      createPentEmInBoard3D: async () => {
        throw new Error('WebGLRenderer failed — test');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/pent-em-in/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('.pent-board')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('scripted endgame vs AI through controller with 3D mocked reaches game over', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    let capturedClick: ((cell: { row: number; col: number }) => void) | undefined;
    const update = vi.fn();
    const unmount = vi.fn();
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'pent-em-in');

    loadPentEmInBoard3DModule.mockResolvedValue({
      createPentEmInBoard3D: async (
        container: HTMLElement,
        onClick?: (cell: { row: number; col: number }) => void
      ) => {
        capturedClick = onClick;
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update,
          unmount,
          cellToClientPoint: () => ({ x: 10, y: 10 }),
        };
      },
    });

    const {
      initGame,
      whenBoard3dReady,
      newGameVsAI,
      __setStateForTests,
      getCurrentState,
    } = await import('../../src/games/pent-em-in/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();
    newGameVsAI('easy');

    // Inject near-end state: placing X at (1,1) should trap player2.
    __setStateForTests(almostTrappedState());
    expect(capturedClick).toBeTypeOf('function');
    capturedClick!({ row: 1, col: 1 });

    const after = getCurrentState();
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player1');
    expect(status.querySelector('.pent-winner-banner')).not.toBeNull();
    expect(update).toHaveBeenCalled();

    // Sanity: placePiece path used real rules (no invented win)
    const verify = placePiece(
      almostTrappedState(),
      'X',
      { row: 1, col: 1 },
      0,
      false
    );
    expect(verify.winner).toBe('player1');
  });
});
