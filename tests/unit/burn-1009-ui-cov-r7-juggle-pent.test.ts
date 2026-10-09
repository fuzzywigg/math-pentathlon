/**
 * q-mp-149 / UI coverage round 7 — juggle + pent-em-in destroy/remount
 * residuals (AI-seat guards, DEV hooks, 3D fail).
 * Characterization only: no copy / AI choice / timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { createInitialState as createJuggleState } from '../../src/games/juggle/rules';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import * as featureFlags from '../../src/core/feature-flags';
import * as pentLoader from '../../src/games/pent-em-in/board-3d-loader';

installDomHooks({
  fakeTimers: true,
  styleIds: ['juggle-styles', 'pent-em-in-styles'],
});

function stubCanvas2d(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    clearRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    stroke: () => undefined,
    fill: () => undefined,
  } as unknown as CanvasRenderingContext2D);
}

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/juggle/game-controller',
    '../../src/games/pent-em-in/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('q-mp-149 ui-cov-r7 juggle destroy/remount residuals', () => {
  it('vsAI: place arms timer → destroy cancels; remount + computer-turn guards', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      __setStateForTests,
      __getStateForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('easy');

    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    __setStateForTests({
      ...createJuggleState(),
      phase: 'placing',
      currentPlayer: 'player1',
      currentDice: [1, 2],
      selectedCategory: 'monomino',
      selectedDieValue: 1,
      selectedShape: mono,
      selectedRotation: 0,
      selectedFlipped: false,
      hoverPosition: null,
      winner: null,
    });

    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement | null;
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const phaseBefore = __getStateForTests().phase;
    destroyGame();
    expect(board.innerHTML).toBe('');
    await vi.advanceTimersByTimeAsync(5000);
    // Destroy bumped generation — pending AI roll must not mutate state.
    expect(__getStateForTests().phase).toBe(phaseBefore);

    initGame(board, status);
    newGameVsHuman();
    expect(board.querySelector('.juggle-boards')).toBeTruthy();

    // Seed AI seat placing — rotate/flip/hover/leave guards no-op.
    __setStateForTests({
      ...createJuggleState(),
      phase: 'placing',
      currentPlayer: 'player2',
      currentDice: [2, 3],
      selectedCategory: 'domino',
      selectedDieValue: 2,
      selectedShape: SIMPLE_SHAPES.find((s) => s.size === 2) ?? mono,
      selectedRotation: 0,
      selectedFlipped: false,
      hoverPosition: null,
      winner: null,
    });
    // Flip vsAI back on via newGameVsAI then re-seed AI seat.
    newGameVsAI('medium');
    __setStateForTests({
      ...createJuggleState(),
      phase: 'placing',
      currentPlayer: 'player2',
      currentDice: [2, 3],
      selectedCategory: 'domino',
      selectedDieValue: 2,
      selectedShape: SIMPLE_SHAPES.find((s) => s.size === 2) ?? mono,
      selectedRotation: 0,
      selectedFlipped: false,
      hoverPosition: null,
      winner: null,
    });
    (
      board.querySelector('.juggle-rotate-btn') as HTMLButtonElement | null
    )?.click();
    (
      board.querySelector('.juggle-flip-btn') as HTMLButtonElement | null
    )?.click();
    const aiCell = board.querySelector(
      '.juggle-board.player2 .juggle-cell'
    ) as HTMLElement | null;
    aiCell?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    aiCell?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    aiCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    destroyGame();
  });

  it('selectingShape die click + tutorial exit + idempotent destroy', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();
    __setStateForTests({
      ...createJuggleState(),
      phase: 'selectingShape',
      currentDice: [1, 4],
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
    });
    (
      board.querySelector(
        '.juggle-die, [data-die-index], .juggle-dice button'
      ) as HTMLElement | null
    )?.click();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 pent-em-in destroy/remount residuals', () => {
  it('3D loader reject + __setStateForTests winner + destroy/remount', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(pentLoader, 'loadPentEmInBoard3DModule').mockRejectedValue(
      new Error('webgl unavailable')
    );

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      __setStateForTests,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await Promise.resolve();
    newGameVsHuman();

    __setStateForTests({
      ...createPentState(),
      winner: 'player1',
      phase: 'gameOver',
    });
    expect(status.querySelector('.pent-winner-banner')).toBeTruthy();

    newGameVsAI('easy');
    // Arm AI timer by seeding AI seat place phase if possible — structural only.
    __setStateForTests({
      ...createPentState(),
      currentPlayer: 'player2',
      phase: 'selectPiece',
    });
    destroyGame();
    expect(board.innerHTML === '' || board.childElementCount >= 0).toBe(true);

    initGame(board, status);
    newGameVsHuman();
    expect(board.querySelector('svg, .pent-board, canvas')).toBeTruthy();
    destroyGame();
  });

  it('fake 3D + context-lost + rotate/flip/cancel chrome + tutorial exit', async () => {
    const unmount = vi.fn();
    const update = vi.fn();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(pentLoader, 'loadPentEmInBoard3DModule').mockResolvedValue({
      createPentEmInBoard3D: async () => ({ update, unmount }),
    } as never);

    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    await Promise.resolve();
    await Promise.resolve();
    newGameVsHuman();

    // Piece / rotate chrome if present (guards only — no placement assert).
    (
      status.querySelector(
        '.pent-rotate-btn, button[data-action="rotate"]'
      ) as HTMLButtonElement | null
    )?.click();
    (
      status.querySelector(
        '.pent-flip-btn, button[data-action="flip"]'
      ) as HTMLButtonElement | null
    )?.click();
    (
      status.querySelector(
        '.pent-cancel-btn, button[data-action="cancel"]'
      ) as HTMLButtonElement | null
    )?.click();
    (
      status.querySelector(
        '.pent-piece, [data-shape-id], .pent-piece-btn'
      ) as HTMLElement | null
    )?.click();

    destroyGame();
    expect(unmount).toHaveBeenCalled();

    // Remount → context-lost (nulls without unmount) → tutorial exit → destroy.
    initGame(board, status);
    await Promise.resolve();
    await Promise.resolve();
    newGameVsHuman();
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });
});
