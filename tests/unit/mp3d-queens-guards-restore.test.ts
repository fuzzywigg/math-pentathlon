import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  cellKey,
  CONFIG,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';
import {
  restoreCapturedPiece,
  getRestoreTargets,
} from '../../src/games/queens-guards/rules';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

function capturedState(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  const captured: BoardCoord = { ring: 2, position: 0 };
  cells.set(cellKey(captured.ring, captured.position), {
    ring: captured.ring,
    position: captured.position,
    piece: { id: 'p2-captured-guard', player: 'player2', type: 'guard' },
  });
  return {
    ...base,
    cells,
    currentPlayer: 'player1',
    capturedPieces: [captured],
    selectedPiece: cellKey(captured.ring, captured.position),
    winner: null,
    moveHistory: [],
  };
}

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

describe('Queens & Guards capture restore (official outer-ring relocation)', () => {
  it('getRestoreTargets lists only empty outer-ring cells', () => {
    const state = capturedState();
    const targets = getRestoreTargets(state);
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.every((t) => t.ring === CONFIG.NUM_RINGS - 1)).toBe(true);
    for (const t of targets) {
      expect(state.cells.get(cellKey(t.ring, t.position))?.piece).toBeNull();
    }
  });

  it('restoreCapturedPiece relocates and flips the seat', () => {
    const state = capturedState();
    const target = getRestoreTargets(state)[0]!;
    const next = restoreCapturedPiece(state, { ring: 2, position: 0 }, target);
    expect(next.capturedPieces).toEqual([]);
    expect(next.currentPlayer).toBe('player2');
    expect(
      next.cells.get(cellKey(target.ring, target.position))?.piece?.id
    ).toBe('p2-captured-guard');
    expect(next.cells.get(cellKey(2, 0))?.piece).toBeNull();
  });

  it('2D board paints restore targets green and captured stroke red', () => {
    const state = capturedState();
    const svg = renderBoard(state, () => undefined);
    const capturedHex = svg.querySelector('[data-cell-key="2-0"] path')!;
    expect(capturedHex.getAttribute('stroke')).toBe('#f44336');
    const target = getRestoreTargets(state)[0]!;
    const targetHex = svg.querySelector(
      `[data-cell-key="${cellKey(target.ring, target.position)}"] path`
    )!;
    expect(targetHex.getAttribute('fill')).toBe('#4caf50');
  });

  it('applyAIMove uses restoreCapturedPiece when captures are pending', () => {
    const state = capturedState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual({ ring: 2, position: 0 });
    expect(move!.to.ring).toBe(CONFIG.NUM_RINGS - 1);
    const next = applyAIMove(state, move!);
    expect(next.capturedPieces).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(
      next.cells.get(cellKey(move!.to.ring, move!.to.position))?.piece?.id
    ).toBe('p2-captured-guard');
  });
});

describe('Queens & Guards restore through controller (2D + mocked 3D)', () => {
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

  it('2D: human click restores captured piece to outer ring', async () => {
    isBoard3dEnabled.mockReturnValue(false);
    const { initGame, whenBoard3dReady, getGameState } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    await whenBoard3dReady();

    window.__mp3dQueensGuardsCtrl!.seedCapturedRestore();
    expect(getGameState().capturedPieces).toHaveLength(1);
    expect(status.textContent).toMatch(/outer ring/i);

    const target = getRestoreTargets(getGameState())[0]!;
    const capturedEl = board.querySelector(
      '[data-cell-key="2-0"]'
    ) as SVGGElement;
    const targetEl = board.querySelector(
      `[data-cell-key="${cellKey(target.ring, target.position)}"]`
    ) as SVGGElement;
    capturedEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().capturedPieces).toHaveLength(0);
    expect(
      getGameState().cells.get(cellKey(target.ring, target.position))?.piece?.id
    ).toBe('p2-captured-guard');
    expect(getGameState().currentPlayer).toBe('player2');
  });

  it('2D: restore lockout ignores normal piece clicks', async () => {
    isBoard3dEnabled.mockReturnValue(false);
    const { initGame, whenBoard3dReady, getGameState } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    await whenBoard3dReady();

    window.__mp3dQueensGuardsCtrl!.seedCapturedRestore();
    const queenEl = board.querySelector('[data-cell-key="5-7"]') as SVGGElement;
    queenEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().capturedPieces).toHaveLength(1);
    expect(getGameState().selectedPiece).toBe('2-0');
    expect(getGameState().cells.get(cellKey(5, 7))?.piece?.type).toBe('queen');
  });

  it('AI restore uses restoreCapturedPiece then yields the seat', async () => {
    isBoard3dEnabled.mockReturnValue(false);
    const { initGame, whenBoard3dReady, getGameState, newGameVsAI } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    await whenBoard3dReady();

    newGameVsAI('easy');
    window.__mp3dQueensGuardsCtrl!.seedCapturedRestore({
      currentPlayer: 'player2',
      keepVsAI: true,
    });
    expect(getGameState().capturedPieces).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(600);

    expect(getGameState().capturedPieces).toHaveLength(0);
    expect(getGameState().currentPlayer).toBe('player1');
    const outer = CONFIG.NUM_RINGS - 1;
    let restored = false;
    for (let pos = 0; pos < 30; pos++) {
      if (
        getGameState().cells.get(cellKey(outer, pos))?.piece?.id ===
        'p2-captured-guard'
      ) {
        restored = true;
        break;
      }
    }
    expect(restored).toBe(true);
  });

  it('3D mocked: click path restores captured piece to outer ring', async () => {
    isBoard3dEnabled.mockReturnValue(true);
    let clickHandler: ((c: BoardCoord) => void) | undefined;
    const update = vi.fn();
    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'queens-guards');
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
          unmount: vi.fn(),
          cellToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const { initGame, whenBoard3dReady, getGameState } =
      await import('../../src/games/queens-guards/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    await whenBoard3dReady();

    window.__mp3dQueensGuardsCtrl!.seedCapturedRestore();
    const target = getRestoreTargets(getGameState())[0]!;
    clickHandler?.({ ring: 2, position: 0 });
    clickHandler?.(target);
    expect(getGameState().capturedPieces).toHaveLength(0);
    expect(getGameState().currentPlayer).toBe('player2');
  });
});
