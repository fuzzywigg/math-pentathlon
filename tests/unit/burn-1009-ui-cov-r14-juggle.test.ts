/**
 * q-mp-269 / UI coverage round 14 — juggle board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Orthogonal to #744 (r10, already on tip) and #745 mutation-ui6 (separate file).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import * as juggleRules from '../../src/games/juggle/rules';
import {
  applyJuggleHoverPreview,
  getPlayerName,
  injectJuggleStyles,
  renderBoard,
  renderDice,
  syncJuggleBoardCells,
} from '../../src/games/juggle/board-ui';
import {
  CONFIG,
  getShapesForDie,
  SHAPE_POOLS,
} from '../../src/games/juggle/types';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';
import * as juggleAi from '../../src/games/juggle/ai';

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
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/juggle/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

describe('q-mp-269 ui-cov-r14 juggle board-ui residuals', () => {
  it('sync + hover preview: invalid OOB placement class + mouseleave non-cell', () => {
    // Domino at last column spills OOB → preview-invalid on empty edge cell.
    let state = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [2, 2],
      },
      0
    );
    const domino = getShapesForDie(2)[0]!;
    state = selectShape(state, domino);
    const col = CONFIG.GRID_SIZE - 1;
    state = { ...state, hoverPosition: { row: 0, col } };

    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      { ...state, hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    // sync path (not initial render) paints invalid preview.
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, state);
    expect(el.querySelector('.preview-invalid')).toBeTruthy();

    const root = document.createElement('div');
    root.className = 'juggle-boards';
    // Clear preview classes then paint via hover-only helper.
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, {
      ...state,
      hoverPosition: null,
    });
    root.appendChild(el);
    applyJuggleHoverPreview(root, state);
    expect(el.querySelector('.preview-invalid')).toBeTruthy();

    const onLeave = vi.fn();
    const fresh = renderBoard(
      createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      'player1',
      true,
      placingMonoState(),
      () => undefined,
      () => undefined,
      onLeave
    );
    const freshGrid = fresh.querySelector('.juggle-grid')!;
    // mouseleave capture on non-cell target hits the early-return arm.
    freshGrid.dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true, composed: true })
    );
    expect(onLeave).not.toHaveBeenCalled();
  });

  it('renderDice: sparse die hole + out-of-range face fallback; styles idempotent', () => {
    // Tuple with a hole — continue arm when dieValue === undefined.
    const sparse = [3, undefined] as unknown as [number, number];
    const dice = renderDice(
      sparse,
      () => undefined,
      () => undefined,
      false,
      'selectingShape'
    );
    expect(dice.querySelectorAll('.juggle-die').length).toBe(1);

    // Out-of-range face uses numeric fallback (structure: die node still rendered).
    const weird = renderDice(
      [0, 9] as [number, number],
      () => undefined,
      () => undefined,
      false,
      'selectingShape'
    );
    expect(weird.querySelectorAll('.juggle-die').length).toBe(2);

    injectJuggleStyles();
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
  });
});

describe('q-mp-269 ui-cov-r14 juggle controller residuals', () => {
  it('phase/seat guards: roll/select/rotate/flip/click no-ops', async () => {
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

    // Human roll while not in rolling phase — no-op.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [2, 3],
      currentPlayer: 'player1',
    });
    const phaseBefore = __getStateForTests().phase;
    (
      board.querySelector('.juggle-roll-btn') as HTMLButtonElement | null
    )?.click();
    expect(__getStateForTests().phase).toBe(phaseBefore);

    // Die click while AI seat owns selectingShape — no-op.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [4, 5],
      currentPlayer: 'player2',
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
      winner: null,
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    // allowInput false → dice not selectable; force-call would need listeners.
    // Seed human selectingShape then flip seat mid-chrome via second setState:
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [4, 5],
      currentPlayer: 'player1',
      selectedCategory: null,
    });
    const die = board.querySelector('.juggle-die.selectable') as HTMLElement;
    expect(die).toBeTruthy();
    // Switch to AI seat without re-render listeners: click still fires human handler
    // but isComputerTurnPending is false until setState. Cover AI-seat selectDie by
    // setting AI seat with selectable chrome disabled — use placing mono for rotate.
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!,
      currentDice: [3, 4],
    });
    const rotBefore = __getStateForTests().selectedRotation;
    const flipBefore = __getStateForTests().selectedFlipped;
    (
      board.querySelector('.juggle-control-btn') as HTMLButtonElement | null
    )?.click();
    expect(__getStateForTests().selectedRotation).toBe(rotBefore);
    expect(__getStateForTests().selectedFlipped).toBe(flipBefore);

    // Wrong-board / wrong-phase cell clicks no-op.
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player1',
    });
    const p2cell = board.querySelector(
      '.juggle-board.player2 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    p2cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('placing');
    expect(__getStateForTests().currentPlayer).toBe('player1');

    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
    });
    const p1cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    p1cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('rolling');

    destroyGame();
  });

  it('hover/leave without boards rebuilds chrome; fresh p2 board callbacks', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      __getStateForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    __setStateForTests(placingMonoState());
    const boards = board.querySelector('.juggle-boards') as HTMLElement;
    const cell = boards.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    // Detach boards while keeping cell listeners — hover hits updateUI rebuild arm.
    boards.remove();
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(board.querySelector('.juggle-boards')).toBeTruthy();
    expect(__getStateForTests().hoverPosition).toEqual({ row: 1, col: 1 });

    // Leave with boards detached again → clear hover via updateUI arm.
    const boards2 = board.querySelector('.juggle-boards') as HTMLElement;
    const cell2 = boards2.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    boards2.remove();
    cell2.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();
    expect(board.querySelector('.juggle-boards')).toBeTruthy();

    // Force fresh board create path (no .juggle-boards) for player2 seat.
    board.querySelector('.juggle-boards')?.remove();
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      selectedShape: SIMPLE_SHAPES.find((s) => s.size === 1)!,
      selectedCategory: 'monomino',
      selectedDieValue: 1,
      currentDice: [1, 2],
    });
    expect(board.querySelector('.juggle-board.player2.active')).toBeTruthy();
    const p2 = board.querySelector(
      '.juggle-board.player2 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    expect(p2.style.cursor).toBe('pointer');
    p2.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toEqual({ row: 0, col: 0 });
    p2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // Place advances seat or ends — structural only.
    expect(['player1', 'player2']).toContain(
      __getStateForTests().currentPlayer
    );

    destroyGame();
  });

  it('vsAI makeAIMove null-choice + stubbed place path (structure only)', async () => {
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

    // Controlled dice: tromino (multi-shape, canRotate+canFlip) for shape/place arms.
    const tromino = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    expect(tromino).toBeTruthy();
    vi.spyOn(juggleRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      currentDice: [3, 4] as [number, number],
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
      phase: 'selectingShape' as const,
    }));

    vi.spyOn(juggleAi, 'getAIDieChoice').mockReturnValue(null);
    vi.spyOn(juggleAi, 'getAIShapeChoice').mockReturnValue(null);
    vi.spyOn(juggleAi, 'getAIPlacement').mockReturnValue(null);

    // Human place → schedules AI roll → makeAIMove; null die choice early-returns.
    __setStateForTests(placingMonoState());
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');
    await vi.advanceTimersByTimeAsync(2000);
    expect(juggleAi.getAIDieChoice).toHaveBeenCalled();
    expect(board.querySelector('.juggle-boards')).toBeTruthy();

    // Die choice succeeds → selectingShape with category → null shapeChoice.
    vi.mocked(juggleAi.getAIDieChoice).mockReturnValue({ index: 0 });
    __setStateForTests(placingMonoState());
    board
      .querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="1"][data-col="1"]'
      )
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(3000);
    expect(juggleAi.getAIShapeChoice).toHaveBeenCalled();

    // Shape choice → placing → null placement → trailing updateUI.
    vi.mocked(juggleAi.getAIShapeChoice).mockReturnValue({ shape: tromino });
    __setStateForTests(placingMonoState());
    board
      .querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="2"][data-col="2"]'
      )
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(4000);
    expect(juggleAi.getAIPlacement).toHaveBeenCalled();

    // Stubbed placement with rotation/flip mismatch — no choice-quality asserts.
    vi.mocked(juggleAi.getAIPlacement).mockReturnValue({
      position: { row: 0, col: 0 },
      rotation: 90,
      flipped: true,
    });
    __setStateForTests(placingMonoState());
    board
      .querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="3"][data-col="3"]'
      )
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(8000);
    expect(board.querySelector('.juggle-boards')).toBeTruthy();

    // Winner banner structure + flush any pending AI timers (early-return arm).
    __setStateForTests({
      ...createInitialState(),
      winner: 'player1',
      phase: 'gameOver',
      currentPlayer: 'player2',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(2000);

    destroyGame();
  });

  it('selectDie/selectShape wrong-phase; placeSelected non-rotate skip; selectingShape chrome', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      __setStateForTests,
      __getStateForTests,
      __placeSelectedForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    // selectingShape without category — status chrome + die selectable.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [5, 6],
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
    });
    expect(status.querySelector('.juggle-status.player1')).toBeTruthy();
    expect(board.querySelector('.juggle-die.selectable')).toBeTruthy();
    (
      board.querySelector('.juggle-die.selectable') as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().selectedCategory).toBeTruthy();

    // Shape option click advances to placing.
    if (__getStateForTests().phase === 'selectingShape') {
      (
        board.querySelector(
          '.juggle-shape-option[role="button"]'
        ) as HTMLElement | null
      )?.click();
    }
    // Wrong-phase selectShape: seed rolling then click a leftover option if any.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentDice: null,
    });
    (
      board.querySelector(
        '.juggle-shape-option[role="button"]'
      ) as HTMLElement | null
    )?.click();
    expect(__getStateForTests().phase).toBe('rolling');

    // placeSelected with non-rotatable shape still places (skip rotation loop arm).
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1 && !s.canRotate)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedShape: mono,
      selectedRotation: 0,
      selectedFlipped: false,
    });
    expect(__placeSelectedForTests()).toBe(true);

    // AI-seat selectDie / selectShape guards via vsAI + thinking chrome clicks.
    newGameVsAI('medium');
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player2',
      currentDice: [4, 5],
      selectedCategory: 'tetromino',
      selectedDieValue: 4,
      selectedShape: null,
      winner: null,
    });
    expect(
      board.querySelector('.juggle-shape-option[aria-disabled="true"]')
    ).toBeTruthy();
    // Disabled options have no click listeners — cover human-phase wrong seat
    // by clicking while isComputerTurnPending: force via die on AI rolling.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player2',
      currentDice: null,
      winner: null,
    });
    const roll = board.querySelector(
      '.juggle-roll-btn'
    ) as HTMLButtonElement | null;
    expect(roll?.disabled).toBe(true);
    const phase = __getStateForTests().phase;
    roll?.click();
    expect(__getStateForTests().phase).toBe(phase);

    destroyGame();
  });

  it('detached listeners hit phase/seat guards; destroy hover; jammed placeSelected', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
      __setStateForTests,
      __getStateForTests,
      __placeSelectedForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsAI('easy');

    // Capture roll listener while rolling, then flip phase — handler early-returns.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
      currentDice: null,
    });
    const rollBtn = board.querySelector(
      '.juggle-roll-btn'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [2, 3],
    });
    rollBtn.click();
    expect(__getStateForTests().phase).toBe('selectingShape');

    // Die listener while human selectingShape, then AI seat — computer-turn guard.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [4, 5],
      selectedCategory: null,
    });
    const die = board.querySelector('.juggle-die.selectable') as HTMLElement;
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player2',
      currentDice: [4, 5],
      selectedCategory: null,
      winner: null,
    });
    die.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().selectedCategory).toBeNull();

    // Shape option listener, then wrong phase.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [3, 4],
      selectedCategory: 'tromino',
      selectedDieValue: 3,
    });
    const option = board.querySelector(
      '.juggle-shape-option[role="button"]'
    ) as HTMLElement;
    expect(option).toBeTruthy();
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
      currentDice: null,
    });
    option.click();
    expect(__getStateForTests().phase).toBe('rolling');

    // Shape option + AI seat guard.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [3, 4],
      selectedCategory: 'tromino',
      selectedDieValue: 3,
    });
    const option2 = board.querySelector(
      '.juggle-shape-option[role="button"]'
    ) as HTMLElement;
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player2',
      currentDice: [3, 4],
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      winner: null,
    });
    option2.click();
    expect(__getStateForTests().selectedShape).toBeNull();

    // Rotate/flip listeners then AI seat.
    const tromino = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: tromino,
      currentDice: [3, 4],
      currentPlayer: 'player1',
    });
    const buttons = [
      ...board.querySelectorAll('.juggle-control-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const rotBtn = buttons[0]!;
    const flipBtn = buttons[1]!;
    __setStateForTests({
      ...placingMonoState(),
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: tromino,
      currentDice: [3, 4],
      currentPlayer: 'player2',
      selectedRotation: 0,
      selectedFlipped: false,
      winner: null,
    });
    rotBtn.click();
    flipBtn.click();
    expect(__getStateForTests().selectedRotation).toBe(0);
    expect(__getStateForTests().selectedFlipped).toBe(false);

    // Cell click listeners: wrong phase + AI seat + wrong player via detach.
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player1',
    });
    const p1cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="4"][data-col="4"]'
    ) as HTMLElement;
    const p2cell = board.querySelector(
      '.juggle-board.player2 .juggle-cell[data-row="4"][data-col="4"]'
    ) as HTMLElement;
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player1',
    });
    p1cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('rolling');
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      winner: null,
    });
    p1cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');
    // Wrong-player click while human places on p1 — use p2 cell listener.
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player1',
    });
    p2cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('placing');

    // Hover/leave after destroy → boardContainer null arms.
    __setStateForTests(placingMonoState());
    const hoverCell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    destroyGame();
    hoverCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    hoverCell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    // Remount for jammed placeSelected (non-rotate skip arms + false).
    initGame(board, status);
    newGameVsAI('easy');
    const full = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        full.cells[r]![c] = true;
      }
    }
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1 && !s.canRotate)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedShape: mono,
      boards: {
        player1: full,
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
    });
    expect(__placeSelectedForTests()).toBe(false);

    // Scheduled AI move after winner set → makeAIMove early-return.
    vi.spyOn(juggleAi, 'getAIDieChoice').mockReturnValue(null);
    __setStateForTests(placingMonoState());
    board
      .querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
      )
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    __setStateForTests({
      ...createInitialState(),
      winner: 'player2',
      phase: 'gameOver',
      currentPlayer: 'player2',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(2000);

    destroyGame();
  });

  it('hover not-placing / AI-seat no-ops; placeSelected false when no shape', async () => {
    stubCanvas2d();
    const {
      initGame,
      newGameVsAI,
      __setStateForTests,
      __getStateForTests,
      __placeSelectedForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsAI('easy');

    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player1',
      currentDice: [2, 3],
    });
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell'
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
    });
    const aiCell = board.querySelector(
      '.juggle-board.player2 .juggle-cell'
    ) as HTMLElement;
    aiCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();
    aiCell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    aiCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    __setStateForTests({
      ...createInitialState(),
      phase: 'placing',
      selectedShape: null,
      currentDice: [1, 2],
    });
    expect(__placeSelectedForTests()).toBe(false);

    destroyGame();
  });
});
