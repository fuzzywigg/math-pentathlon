import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  getValidMoves,
  moveChip,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';

const isBoard3dEnabled = vi.fn(() => false);
const loadKwatroSinkoBoard3DModule = vi.fn();

vi.mock('../../src/core/feature-flags', () => ({
  isBoard3dEnabled: () => isBoard3dEnabled(),
  BOARD_3D_PARAM: 'board3d',
  BOARD_3D_STORAGE_KEY: 'mp-board3d',
}));

vi.mock('../../src/games/kwatro-sinko/board-3d-loader', () => ({
  loadKwatroSinkoBoard3DModule: () => loadKwatroSinkoBoard3DModule(),
}));

describe('mp3d Kwatro-Sinko AI timer vs 3D mount', () => {
  beforeEach(() => {
    isBoard3dEnabled.mockReset();
    loadKwatroSinkoBoard3DModule.mockReset();
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      const { destroyGame } =
        await import('../../src/games/kwatro-sinko/game-controller');
      destroyGame();
    } catch {
      // module may not be loaded
    }
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('does not schedule a second AI turn when 3D mount finishes after a human move', async () => {
    isBoard3dEnabled.mockReturnValue(true);

    let resolveMount!: (value: unknown) => void;
    const mountGate = new Promise((resolve) => {
      resolveMount = resolve;
    });

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.setAttribute('data-mp3d', 'kwatro-sinko');
    const unmount = vi.fn();
    const update = vi.fn();

    loadKwatroSinkoBoard3DModule.mockResolvedValue({
      createKwatroSinkoBoard3D: async (container: HTMLElement) => {
        await mountGate;
        container.replaceChildren(fakeCanvas);
        return {
          canvas: fakeCanvas,
          update,
          unmount,
          nodeToClientPoint: () => ({ x: 0, y: 0 }),
        };
      },
    });

    const { newGameVsAI, whenBoard3dReady, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    // Human opens with a legal move while 3D is still loading.
    expect(ctrl.state.currentPlayer).toBe('player1');
    let state = selectChip(ctrl.state, 'p1-2');
    const dest = getValidMoves(state, 'p1-2')[0];
    expect(dest).toBeTruthy();
    state = moveChip(state, dest!);
    ctrl.state = state;
    ctrl.update(); // schedules the single AI timer (player2 to move)

    expect(ctrl.state.currentPlayer).toBe('player2');

    // 3D mount completes → ensureBoard3d().then(update) must NOT stack another timer.
    resolveMount(undefined);
    await whenBoard3dReady();
    expect(ctrl.state.currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(800);
    // First (and only) AI timeout should have moved; back to human.
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).not.toBe('gameOver');
    const afterAiMoveCount = ctrl.state.moveHistory.length;
    expect(afterAiMoveCount).toBeGreaterThanOrEqual(2);

    // A stale second timeout must not fire and pass the human's turn.
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBe(afterAiMoveCount);

    destroyGame();
    expect(unmount).toHaveBeenCalled();
  });

  it('makeAIMove no-ops when a stale timer fires on the human turn', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    // Force AI seat while keeping human as currentPlayer (stale-timer scenario).
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'selectingChip',
    };
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';

    // Schedule as if it were AI's turn, then flip seat before the timer fires.
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();
    ctrl.state = { ...ctrl.state, currentPlayer: 'player1' };

    const before = ctrl.state.moveHistory.length;
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBe(before);

    destroyGame();
  });

  it('destroyGame clears a pending AI timer', async () => {
    isBoard3dEnabled.mockReturnValue(false);

    const { newGameVsAI, destroyGame } =
      await import('../../src/games/kwatro-sinko/game-controller');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    let state = selectChip(ctrl.state, 'p1-0');
    const dest = getValidMoves(state, 'p1-0')[0]!;
    state = moveChip(state, dest);
    ctrl.state = state;
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');

    destroyGame();
    await vi.advanceTimersByTimeAsync(800);
    // Controller was destroyed — no AI move should have mutated the orphan state.
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory.length).toBe(1);
  });
});
