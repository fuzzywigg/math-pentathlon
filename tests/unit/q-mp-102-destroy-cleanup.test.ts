/**
 * q-mp-102 — juggle / fab-a-diffy / sum-dominoes destroyGame were empty stubs.
 * Mount → destroy must clear AI timers, empty mounts, and stay safe on remount.
 * Orthogonal to q-mp-030 (hex / fraction-pinball).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { disposeFabAiWorker } from '../../src/games/fab-a-diffy/ai-client';
import {
  createInitialState as createJuggleState,
  selectDie,
} from '../../src/games/juggle/rules';

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    clearRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('q-mp-102 juggle destroyGame remount safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
    stubCanvas();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('mount → destroy clears timers + mounts; remount stays safe', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const mod = await import('../../src/games/juggle/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    mod.initGame(board, status);
    mod.newGameVsAI('easy');

    // Arm AI think-delay: human places a monomino → scheduleAI(roll, 500).
    const placing = selectDie(
      {
        ...createJuggleState(),
        currentDice: [1, 3],
        phase: 'selectingShape',
      },
      0
    );
    expect(placing.phase).toBe('placing');
    mod.__setStateForTests(placing);

    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement | null;
    expect(cell).toBeTruthy();
    cell!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    expect(board.innerHTML.length).toBeGreaterThan(0);

    const shellCleanup = vi.fn();
    const routeCleanup = () => {
      try {
        mod.destroyGame();
      } finally {
        shellCleanup();
      }
    };
    routeCleanup();

    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');

    const phaseBefore = mod.__getStateForTests().phase;
    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(mod.__getStateForTests().phase).toBe(phaseBefore);

    // Remount into the same hosts must succeed after destroy nulled refs.
    mod.initGame(board, status);
    mod.newGameVsHuman();
    expect(board.innerHTML.length).toBeGreaterThan(0);
    mod.destroyGame();
    expect(board.innerHTML).toBe('');

    clearTimeoutSpy.mockRestore();
  });
});

describe('q-mp-102 fab-a-diffy destroyGame remount safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    disposeFabAiWorker();
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('mount → destroy clears timers + mount; remount stays safe', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const mod = await import('../../src/games/fab-a-diffy/game-controller');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const controller = mod.initGame(host, true, 'easy');
    expect(host.innerHTML.length).toBeGreaterThan(0);

    // Player1 opens; force AI seat so updateUI arms the think-delay timer.
    controller.state = { ...controller.state, currentPlayer: 'player2' };
    controller.update();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    const shellCleanup = vi.fn();
    const routeCleanup = () => {
      try {
        mod.destroyGame();
      } finally {
        shellCleanup();
      }
    };
    routeCleanup();

    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(host.innerHTML).toBe('');

    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(host.innerHTML).toBe('');

    // Remount
    mod.initGame(host, false);
    expect(host.innerHTML.length).toBeGreaterThan(0);
    mod.destroyGame();
    expect(host.innerHTML).toBe('');

    clearTimeoutSpy.mockRestore();
  });
});

describe('q-mp-102 sum-dominoes destroyGame remount safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('mount → destroy clears timers + mount; remount stays safe', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const mod = await import('../../src/games/sum-dominoes/game-controller');
    const host = document.createElement('div');
    document.body.appendChild(host);

    const controller = mod.initGame(host, true, 'easy');
    expect(host.innerHTML.length).toBeGreaterThan(0);

    controller.state = { ...controller.state, currentPlayer: 'player2' };
    controller.update();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    const shellCleanup = vi.fn();
    const routeCleanup = () => {
      try {
        mod.destroyGame();
      } finally {
        shellCleanup();
      }
    };
    routeCleanup();

    expect(shellCleanup).toHaveBeenCalledOnce();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(host.innerHTML).toBe('');

    expect(() => vi.advanceTimersByTime(20_000)).not.toThrow();
    expect(host.innerHTML).toBe('');

    mod.initGame(host, false);
    expect(host.innerHTML.length).toBeGreaterThan(0);
    mod.destroyGame();
    expect(host.innerHTML).toBe('');

    clearTimeoutSpy.mockRestore();
  });
});
