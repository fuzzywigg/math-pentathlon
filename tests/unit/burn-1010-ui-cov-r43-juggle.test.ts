/**
 * q-mp-481 / UI coverage round 43 — juggle board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Orthogonal to open #777 (r14) / #744 (r10) — residual arms only; leave those
 * drafts open (`contained` per backlog). Zero src edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/juggle/rules';
import * as juggleRules from '../../src/games/juggle/rules';
import {
  renderBoard,
  syncJuggleBoardCells,
} from '../../src/games/juggle/board-ui';
import { CONFIG, SHAPE_POOLS } from '../../src/games/juggle/types';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';
import * as juggleAi from '../../src/games/juggle/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['juggle-styles'],
});

function stubCanvas2d(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

function placingMonoState() {
  const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
  return {
    ...createInitialState(),
    phase: 'placing' as const,
    currentPlayer: 'player1' as const,
    currentDice: [1, 2] as [number, number],
    selectedCategory: 'monomino' as const,
    selectedDieValue: 1,
    selectedShape: mono,
    selectedRotation: 0 as const,
    selectedFlipped: false,
    hoverPosition: null,
    winner: null,
  };
}

afterEach(async () => {
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/juggle/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

describe('q-mp-481 ui-cov-r43 juggle board-ui residuals', () => {
  it('delegated click/keydown/hover ignore non-finite cell coords', () => {
    stubCanvas2d();
    const onClick = vi.fn();
    const onHover = vi.fn();
    const el = renderBoard(
      createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      'player1',
      true,
      placingMonoState(),
      onClick,
      onHover,
      () => undefined
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    expect(cell.style.cursor).toBe('pointer');

    // Strip numeric dataset → Number(...) yields NaN → finite guard false arm.
    delete cell.dataset.row;
    delete cell.dataset.col;
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onHover).not.toHaveBeenCalled();

    // Non-numeric dataset values hit the same finite-guard false arm.
    cell.dataset.row = 'x';
    cell.dataset.col = 'y';
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onHover).not.toHaveBeenCalled();
  });

  it('sync path tolerates boards shell missing a seat board node', () => {
    stubCanvas2d();
    const state = placingMonoState();
    const shell = document.createElement('div');
    shell.className = 'juggle-boards';
    // Only player1 board — controller sync must skip missing p2 without throw.
    const p1 = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    shell.appendChild(p1);
    syncJuggleBoardCells(p1, state.boards.player1, 'player1', true, state);
    expect(shell.querySelector('.juggle-board.player2')).toBeNull();
    expect(shell.querySelector('.juggle-board.player1')).toBeTruthy();
  });
});

describe('q-mp-481 ui-cov-r43 juggle controller residuals', () => {
  it('detached roll/die listeners hit AI-seat + wrong-phase guards', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
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

    // Capture enabled roll listener, then flip to AI rolling — hits fromAI≠true
    // && isComputerTurnPending return (disabled live button never fires).
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
      currentDice: null,
      winner: null,
    });
    const rollBtn = board.querySelector(
      '.juggle-roll-btn'
    ) as HTMLButtonElement;
    expect(rollBtn.disabled).toBe(false);
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player2',
      currentDice: null,
      winner: null,
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    const phaseAi = __getStateForTests().phase;
    rollBtn.click();
    expect(__getStateForTests().phase).toBe(phaseAi);
    expect(__getStateForTests().currentPlayer).toBe('player2');

    // Die listener while selectingShape, then flip phase → wrong-phase selectDie.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [4, 5],
      selectedCategory: null,
      selectedDieValue: null,
    });
    const die = board.querySelector('.juggle-die.selectable') as HTMLElement;
    expect(die).toBeTruthy();
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
      currentDice: null,
    });
    die.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('rolling');
    expect(__getStateForTests().selectedCategory).toBeNull();

    destroyGame();
  });

  it('forced-cursor cell clicks hit wrong-player / wrong-phase / AI-seat returns', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
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

    __setStateForTests(placingMonoState());
    const p1cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="2"][data-col="2"]'
    ) as HTMLElement;
    const p2cell = board.querySelector(
      '.juggle-board.player2 .juggle-cell[data-row="2"][data-col="2"]'
    ) as HTMLElement;

    // After sync, cursor drops — restore pointer so delegated handler reaches
    // controller guards (board-ui cursor gate would otherwise short-circuit).
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
    });
    p1cell.style.cursor = 'pointer';
    p1cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('rolling');

    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player1',
    });
    p2cell.style.cursor = 'pointer';
    p2cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('placing');
    expect(__getStateForTests().currentPlayer).toBe('player1');

    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      winner: null,
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    p2cell.style.cursor = 'pointer';
    p2cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');
    expect(__getStateForTests().phase).toBe('placing');

    // Hover/leave wrong-phase + AI-seat with forced pointer (structure only).
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [2, 3],
    });
    p1cell.style.cursor = 'pointer';
    p1cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();

    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      winner: null,
    });
    p2cell.style.cursor = 'pointer';
    p2cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    p2cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();

    destroyGame();
  });

  it('sync skips missing seat boards; AI continue + makeAIMove early-return', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
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

    // Drop one seat board node — updateUI sync hits missing-board false arms.
    board.querySelector('.juggle-board.player2')?.remove();
    __setStateForTests(placingMonoState());
    expect(board.querySelector('.juggle-board.player1')).toBeTruthy();
    expect(board.querySelector('.juggle-board.player2')).toBeNull();

    // Stubbed AI place that keeps AI seat → scheduleAI(handleRollDice) arm.
    // Structure only — no move-quality / timing asserts.
    const tromino = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    vi.spyOn(juggleAi, 'getAIDieChoice').mockReturnValue({ index: 0 });
    vi.spyOn(juggleAi, 'getAIShapeChoice').mockReturnValue({ shape: tromino });
    vi.spyOn(juggleAi, 'getAIPlacement').mockReturnValue({
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    });
    vi.spyOn(juggleRules, 'placeShape').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentPlayer: 'player2' as const,
      selectedShape: null,
      selectedCategory: null,
      selectedDieValue: null,
      selectedRotation: 0 as const,
      selectedFlipped: false,
      hoverPosition: null,
      winner: null,
      currentDice: null,
    }));

    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: tromino,
      currentDice: [3, 4],
      winner: null,
    });
    // Drive AI placing via scheduled makeAIMove after a stubbed human→AI handoff.
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player1',
    });
    // Rebuild missing p2 for pointer cell click handoff.
    if (!board.querySelector('.juggle-board.player2')) {
      board.querySelector('.juggle-boards')?.remove();
      __setStateForTests(placingMonoState());
    }
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // Flush AI roll → makeAIMove → stubbed place → continue-roll schedule.
    await vi.advanceTimersByTimeAsync(4000);
    expect(board.querySelector('.juggle-boards')).toBeTruthy();
    expect(juggleAi.getAIPlacement).toHaveBeenCalled();

    // makeAIMove early-return: arm timer then set winner before nested move.
    vi.mocked(juggleRules.placeShape).mockRestore();
    vi.spyOn(juggleRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      currentDice: [2, 3] as [number, number],
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
      phase: 'selectingShape' as const,
    }));
    __setStateForTests(placingMonoState());
    board
      .querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="1"][data-col="1"]'
      )
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // After 500ms roll schedules makeAIMove(+500); freeze winner before it runs.
    await vi.advanceTimersByTimeAsync(500);
    __setStateForTests({
      ...createInitialState(),
      winner: 'player1',
      phase: 'gameOver',
      currentPlayer: 'player2',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(2000);
    expect(__getStateForTests().winner).toBe('player1');

    destroyGame();
  });

  it('placeSelected orientation skips + empty spots return false', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      __placeSelectedForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    // Fits-anywhere true but every orientation yields no spots → false +
    // !canRotate rotation-skip continues inside the loop.
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1 && !s.canRotate)!;
    expect(mono).toBeTruthy();
    vi.spyOn(juggleRules, 'selectedShapeFitsAnywhere').mockReturnValue(true);
    vi.spyOn(juggleRules, 'getCurrentOrientationPlacements').mockReturnValue(
      []
    );
    __setStateForTests({
      ...placingMonoState(),
      selectedShape: mono,
      selectedRotation: 0,
      selectedFlipped: false,
    });
    expect(__placeSelectedForTests()).toBe(false);

    // Flippable shape with empty orientations exercises canFlip true arm.
    const flippable = SHAPE_POOLS.tromino.find((s) => s.canFlip)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: flippable,
      currentDice: [3, 4],
    });
    expect(__placeSelectedForTests()).toBe(false);

    destroyGame();
  });

  it('tutorial step-changed ignored; exit unsubscribes without HvH restart', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      __getStateForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    const phaseBefore = __getStateForTests().phase;

    // step-changed must not unsubscribe (else of completed|exited).
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(__getStateForTests().phase).toBe(phaseBefore);

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    // Exited arm: unsubscribe only — no forced newGameVsHuman beyond live shell.
    expect(board.querySelector('.juggle-boards')).toBeTruthy();
    expect(status.querySelector('.juggle-status')).toBeTruthy();

    destroyGame();
  });
});
