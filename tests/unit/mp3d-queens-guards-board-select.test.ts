import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';
import { getValidMoves, makeMove, selectPiece } from '../../src/games/queens-guards/rules';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';

const isBoard3dEnabled = vi.fn(() => false);
const loadQueensGuardsBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/queens-guards/board-3d-loader', () => ({
  loadQueensGuardsBoard3DModule: () => loadQueensGuardsBoard3DModule(),
}));

describe('mp3d Queens & Guards board view selection', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadQueensGuardsBoard3DModule.mockReset();
    document.body.innerHTML = '';
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      const { destroyGame } =
        await import('../../src/games/queens-guards/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
  });

  it('flag OFF never imports the 3D module (and thus never loads three)', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(loadQueensGuardsBoard3DModule).not.toHaveBeenCalled();
    expect(board.querySelector('svg')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('flag ON selects the 3D view', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'queens-guards');
    const unmount = vi.fn(() => {
      fakeCanvas.remove();
    });
    const update = vi.fn();
    const createQueensGuardsBoard3D = vi.fn(async (container: HTMLElement) => {
      container.replaceChildren(fakeCanvas);
      return {
        canvas: fakeCanvas,
        update,
        unmount,
        cellToClientPoint: () => ({ x: 0, y: 0 }),
      };
    });
    loadQueensGuardsBoard3DModule.mockResolvedValue({
      createQueensGuardsBoard3D,
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady, destroyGame } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(true);
    expect(loadQueensGuardsBoard3DModule).toHaveBeenCalledTimes(1);
    expect(createQueensGuardsBoard3D).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(
      board.querySelector('canvas[data-mp3d="queens-guards"]')
    ).not.toBeNull();
    expect(board.querySelector('svg')).toBeNull();

    destroyGame();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('WebGL failure falls back to playable 2D board', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    loadQueensGuardsBoard3DModule.mockResolvedValue({
      createQueensGuardsBoard3D: async () => {
        throw new Error('WebGLRenderer failed — Queens & Guards');
      },
    });

    const { initGame, isUsingBoard3d, whenBoard3dReady } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    initGame(board, status);
    await whenBoard3dReady();

    expect(isUsingBoard3d()).toBe(false);
    expect(board.querySelector('svg')).not.toBeNull();
    expect(board.querySelector('canvas[data-mp3d]')).toBeNull();
  });

  it('scripted game vs AI through controller with 3D mocked (every difficulty)', async () => {
    const difficulties = ['easy', 'medium', 'hard'] as const;

    for (const difficulty of difficulties) {
      vi.resetModules();
      isBoard3dEnabled.mockReturnValue(true);

      // Fast deterministic AI so hard/medium do not explode the unit suite.
      vi.doMock('../../src/games/queens-guards/ai', async () => {
        const actual = await vi.importActual<
          typeof import('../../src/games/queens-guards/ai')
        >('../../src/games/queens-guards/ai');
        return {
          ...actual,
          getAIMove: (state: QueensGuardsState, player: 'player1' | 'player2') => {
            const keys = [...state.cells.keys()];
            for (const key of keys) {
              const cell = state.cells.get(key)!;
              if (cell.piece?.player !== player) continue;
              const from = { ring: cell.ring, position: cell.position };
              const moves = getValidMoves(state, from);
              if (moves.length > 0) {
                return {
                  from,
                  to: moves[0]!,
                  score: 0,
                };
              }
            }
            return null;
          },
        };
      });

      const update = vi.fn();
      const unmount = vi.fn();
      const fakeCanvas = document.createElement('canvas');
      fakeCanvas.setAttribute('data-mp3d', 'queens-guards');
      let clickHandler: ((c: BoardCoord) => void) | undefined;

      loadQueensGuardsBoard3DModule.mockResolvedValue({
        createQueensGuardsBoard3D: async (
          container: HTMLElement,
          onClick?: (c: BoardCoord) => void
        ) => {
          clickHandler = onClick;
          container.replaceChildren(fakeCanvas);
          return {
            canvas: fakeCanvas,
            update: (
              state: QueensGuardsState,
              next?: (c: BoardCoord) => void
            ) => {
              clickHandler = next;
              update(state, next);
            },
            unmount,
            cellToClientPoint: () => ({ x: 0, y: 0 }),
          };
        },
      });

      const {
        initGame,
        whenBoard3dReady,
        newGameVsAI,
        destroyGame,
        getGameState,
        isUsingBoard3d,
      } = await import('../../src/games/queens-guards/game-controller');

      const board = document.createElement('div');
      const status = document.createElement('div');
      document.body.append(board, status);

      initGame(board, status);
      await whenBoard3dReady();
      expect(isUsingBoard3d()).toBe(true);

      newGameVsAI(difficulty);
      expect(update).toHaveBeenCalled();

      // Drive human (player1) moves via the 3D click path until game ends or budget.
      let guard = 0;
      while (!getGameState().winner && guard < 80) {
        guard++;
        const state = getGameState();
        if (state.currentPlayer !== 'player1') {
          await vi.advanceTimersByTimeAsync(600);
          continue;
        }

        let played = false;
        const keys = [...state.cells.keys()];
        for (const key of keys) {
          const cell = state.cells.get(key)!;
          if (cell.piece?.player !== 'player1') continue;
          const from = { ring: cell.ring, position: cell.position };
          const selected = selectPiece(state, from);
          const moves = getValidMoves(selected, from);
          if (moves.length === 0) continue;

          clickHandler?.(from);
          clickHandler?.(moves[0]!);
          played = true;
          break;
        }
        if (!played) break;

        await vi.advanceTimersByTimeAsync(600);
      }

      expect(update.mock.calls.length).toBeGreaterThan(2);
      expect(
        board.querySelector('canvas[data-mp3d="queens-guards"]')
      ).not.toBeNull();
      // At least one full human+AI exchange completed
      expect(getGameState().moveHistory.length).toBeGreaterThan(0);

      destroyGame();
      expect(unmount).toHaveBeenCalled();
      board.remove();
      status.remove();
    }
  });
});

describe('mp3d Queens & Guards engine move path (3D click parity)', () => {
  it('select → legal move updates state the same way the 3D handler will', () => {
    let state = createInitialState();
    const queenKey = cellKey(5, 7);
    const from = { ring: 5, position: 7 };
    expect(state.cells.get(queenKey)?.piece?.type).toBe('queen');

    state = selectPiece(state, from);
    const moves = getValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);

    const to = moves[0]!;
    state = makeMove(state, from, to);
    expect(state.cells.get(queenKey)?.piece).toBeNull();
    expect(state.cells.get(cellKey(to.ring, to.position))?.piece?.type).toBe(
      'queen'
    );
  });

  it('AI easy returns a legal opening move (parity with 3D click path)', () => {
    const state = createInitialState();
    const p2State = { ...state, currentPlayer: 'player2' as const };
    const move = getAIMove(p2State, 'player2', 'easy');
    expect(move).not.toBeNull();
    const next = applyAIMove(p2State, move!);
    expect(next.moveHistory.length).toBe(p2State.moveHistory.length + 1);
  });
});
