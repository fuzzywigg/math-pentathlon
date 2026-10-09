/**
 * q-mp-222 / UI coverage round 10 — juggle board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import {
  applyJuggleHoverPreview,
  getPlayerName,
  renderBoard,
  renderDice,
  renderShapeControls,
  renderShapeSelector,
  syncJuggleBoardCells,
} from '../../src/games/juggle/board-ui';
import {
  CONFIG,
  getShapeById,
  getShapesForDie,
  SHAPE_POOLS,
} from '../../src/games/juggle/types';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import { createBoard } from '../../src/core/polyomino/placement';

installDomHooks({
  fakeTimers: true,
  styleIds: ['juggle-styles'],
});

function stubCanvas2d(ctx: CanvasRenderingContext2D | null = null): void {
  if (ctx === null) {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    return;
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
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

describe('q-mp-222 ui-cov-r10 juggle board-ui residuals', () => {
  it('syncJuggleBoardCells: missing grid early-return + cell-map rebuild', () => {
    const state = placingMonoState();
    const bare = document.createElement('div');
    bare.className = 'juggle-board player1 active';
    // No .juggle-grid — must no-op without throw.
    syncJuggleBoardCells(bare, state.boards.player1, 'player1', true, state);
    expect(bare.querySelector('.juggle-grid')).toBeNull();

    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const grid = el.querySelector('.juggle-grid') as HTMLElement & {
      __juggleCells?: Map<string, HTMLElement>;
    };
    expect(grid.__juggleCells?.size).toBe(CONFIG.GRID_SIZE * CONFIG.GRID_SIZE);
    delete grid.__juggleCells;
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, {
      ...state,
      hoverPosition: { row: 0, col: 0 },
    });
    // Map rebuilt from DOM; preview chrome present on hover.
    expect(grid.__juggleCells?.size).toBe(CONFIG.GRID_SIZE * CONFIG.GRID_SIZE);
    expect(el.querySelector('.preview-valid, .preview-invalid')).toBeTruthy();
  });

  it('syncJuggleBoardCells: occupied fill + skip missing map keys', () => {
    const state = placingMonoState();
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    board.cells[0]![0] = true;
    const el = renderBoard(
      board,
      'player1',
      true,
      { ...state, boards: { ...state.boards, player1: board } },
      () => undefined,
      () => undefined,
      () => undefined
    );
    const grid = el.querySelector('.juggle-grid') as HTMLElement & {
      __juggleCells?: Map<string, HTMLElement>;
    };
    // Drop one key so the sync loop hits the continue arm.
    grid.__juggleCells?.delete('1,1');
    syncJuggleBoardCells(el, board, 'player1', true, state);
    const occupied = el.querySelector(
      '.juggle-cell.occupied-player1'
    ) as HTMLElement | null;
    expect(occupied).toBeTruthy();
    expect(occupied?.getAttribute('aria-label') ?? '').toMatch(
      getPlayerName('player1')
    );
    expect(el.querySelector('.fill-percent')?.textContent).toMatch(/%$/);
  });

  it('applyJuggleHoverPreview: phase/allowInput/missing-board guards + clear', () => {
    const state = placingMonoState();
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    // No .juggle-board.player1 — early return.
    applyJuggleHoverPreview(root, state);
    expect(root.querySelector('.preview-valid')).toBeNull();

    const boardEl = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(boardEl);

    applyJuggleHoverPreview(root, state, { allowInput: false });
    applyJuggleHoverPreview(root, {
      ...state,
      phase: 'rolling',
      hoverPosition: { row: 0, col: 0 },
    });
    expect(boardEl.querySelector('.preview-valid')).toBeNull();

    applyJuggleHoverPreview(root, {
      ...state,
      hoverPosition: { row: 2, col: 2 },
    });
    expect(boardEl.dataset.hoverKeys).toContain('2,2');
    expect(boardEl.querySelector('.preview-valid')).toBeTruthy();

    applyJuggleHoverPreview(root, { ...state, hoverPosition: null });
    expect(boardEl.dataset.hoverKeys).toBe('');
    expect(boardEl.querySelector('.preview-valid')).toBeNull();
  });

  it('applyJuggleHoverPreview: skips occupied cells; missing grid no-ops', () => {
    const state = placingMonoState();
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    board.cells[0]![0] = true;
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    const boardEl = renderBoard(
      board,
      'player1',
      true,
      { ...state, boards: { ...state.boards, player1: board } },
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(boardEl);
    boardEl.dataset.hoverKeys = '0,0|0,1';
    applyJuggleHoverPreview(root, {
      ...state,
      boards: { ...state.boards, player1: board },
      hoverPosition: { row: 0, col: 0 },
    });
    // Occupied (0,0) must not gain preview class.
    expect(
      boardEl
        .querySelector('.juggle-cell[data-row="0"][data-col="0"]')
        ?.classList.contains('preview-valid')
    ).toBe(false);

    // Board without grid.
    const hollow = document.createElement('div');
    hollow.className = 'juggle-board player1';
    const hollowRoot = document.createElement('div');
    hollowRoot.className = 'juggle-boards';
    hollowRoot.appendChild(hollow);
    applyJuggleHoverPreview(hollowRoot, {
      ...state,
      hoverPosition: { row: 1, col: 1 },
    });
    expect(hollow.querySelector('.juggle-grid')).toBeNull();
  });

  it('renderBoard event guards: outside click, Space, leave, non-pointer keys', () => {
    const state = placingMonoState();
    const onClick = vi.fn();
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      onClick,
      onHover,
      onLeave
    );
    const grid = el.querySelector('.juggle-grid')!;
    grid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();

    const cell = el.querySelector(
      '.juggle-cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledWith(1, 1);

    onClick.mockClear();
    cell.style.cursor = '';
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();

    cell.style.cursor = 'pointer';
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith(1, 1);
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onLeave).toHaveBeenCalled();

    // Non-cell mouseenter target on grid (capture listener).
    onHover.mockClear();
    grid.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true, composed: true })
    );
    expect(onHover).not.toHaveBeenCalled();
  });

  it('renderDice / shape chrome: keyboard activate + empty selector/controls', () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const onSelectDie = vi.fn();
    const dice = renderDice(
      [4, 5],
      () => undefined,
      onSelectDie,
      false,
      'selectingShape'
    );
    const die = dice.querySelector('.juggle-die.selectable') as HTMLElement;
    expect(die.getAttribute('role')).toBe('button');
    die.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onSelectDie).toHaveBeenCalled();

    // Empty selector when category missing or die mismatch.
    expect(
      renderShapeSelector(
        { ...createInitialState(), phase: 'selectingShape', currentDice: null },
        () => undefined
      ).childElementCount
    ).toBe(0);
    expect(
      renderShapeSelector(
        {
          ...createInitialState(),
          phase: 'selectingShape',
          currentDice: [1, 1],
          selectedCategory: 'pentomino',
        },
        () => undefined
      ).childElementCount
    ).toBe(0);

    // Controls empty outside placing / without shape.
    expect(
      renderShapeControls(
        createInitialState(),
        () => undefined,
        () => undefined
      ).childElementCount
    ).toBe(0);

    // Shape option keyboard activate.
    const onShape = vi.fn();
    const selector = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [2, 3],
        selectedCategory: 'domino',
      },
      onShape
    );
    const option = selector.querySelector(
      '.juggle-shape-option[role="button"]'
    ) as HTMLElement;
    option.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onShape).toHaveBeenCalled();
  });

  it('renderShapePreview tolerates null 2d context; getShapeById hits types', () => {
    stubCanvas2d(null);
    const shape = SHAPE_POOLS.tromino[0]!;
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape,
        selectedCategory: 'tromino',
        currentDice: [3, 1],
      },
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('canvas')).toBeTruthy();
    expect(el.querySelectorAll('.juggle-control-btn').length).toBeGreaterThan(
      0
    );

    expect(getShapeById(shape.id)?.id).toBe(shape.id);
    expect(getShapeById('__no-such-juggle-shape__')).toBeUndefined();
  });
});

describe('q-mp-222 ui-cov-r10 juggle controller residuals', () => {
  it('rotate/flip via .juggle-control-btn + wrong-board click no-op', async () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

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

    const tromino = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: tromino,
      currentDice: [3, 4],
    });

    const buttons = [
      ...board.querySelectorAll('.juggle-control-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const rotBefore = __getStateForTests().selectedRotation;
    const flipBefore = __getStateForTests().selectedFlipped;
    buttons[0]!.click();
    expect(__getStateForTests().selectedRotation).not.toBe(rotBefore);
    buttons[1]!.click();
    expect(__getStateForTests().selectedFlipped).not.toBe(flipBefore);

    // Click opponent board while player1 places — phase stays placing.
    const p2 = board.querySelector(
      '.juggle-board.player2 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement | null;
    p2?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().phase).toBe('placing');
    expect(__getStateForTests().currentPlayer).toBe('player1');

    destroyGame();
  });

  it('die → shape → place chrome advances phase; DEV hooks edge cases', async () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      __getStateForTests,
      __placeSelectedForTests,
      __abandonPlacementForTests,
      setAIDifficulty,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    // No #app — syncOpponentChrome early-return arm.
    initGame(board, status);
    newGameVsHuman();
    setAIDifficulty('hard');

    // Tetromino (die 4) keeps selectingShape so the shape list is shown.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [4, 5],
      selectedCategory: null,
      selectedDieValue: null,
      selectedShape: null,
    });
    expect(board.querySelector('.juggle-die.selectable')).toBeTruthy();
    (
      board.querySelector('.juggle-die.selectable') as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().selectedCategory).toBeTruthy();
    expect(__getStateForTests().phase).toBe('selectingShape');

    const option = board.querySelector(
      '.juggle-shape-option[role="button"]'
    ) as HTMLElement | null;
    option?.click();
    expect(__getStateForTests().phase).toBe('placing');
    expect(board.querySelector('.juggle-shape-controls')).toBeTruthy();

    // placeSelected while not placing → false; abandon from placing restores select.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
    });
    expect(__placeSelectedForTests()).toBe(false);

    __setStateForTests(placingMonoState());
    expect(__placeSelectedForTests()).toBe(true);
    // Fresh placing then abandon.
    __setStateForTests(placingMonoState());
    __abandonPlacementForTests();
    expect(['selectingShape', 'rolling', 'placing']).toContain(
      __getStateForTests().phase
    );

    // After destroy, setState hits null-container updateUI guard.
    destroyGame();
    __setStateForTests(placingMonoState());
    expect(board.innerHTML).toBe('');
  });

  it('vsAI: AI-thinking status chrome + timer flush without choice asserts', async () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

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
    expect(app.dataset.opponent).toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    // Seed AI seat rolling — status uses thinking chrome class; dice not selectable.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player2',
      winner: null,
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(board.querySelector('.juggle-die.selectable')).toBeNull();
    const roll = board.querySelector(
      '.juggle-roll-btn'
    ) as HTMLButtonElement | null;
    expect(roll?.disabled).toBe(true);

    // Human roll click while AI seat pending must no-op.
    const phaseBefore = __getStateForTests().phase;
    roll?.click();
    expect(__getStateForTests().phase).toBe(phaseBefore);

    // Seed AI selectingShape with category — disabled shape options structure.
    __setStateForTests({
      ...createInitialState(),
      phase: 'selectingShape',
      currentPlayer: 'player2',
      currentDice: [2, 3],
      selectedCategory: 'domino',
      selectedDieValue: 2,
      selectedShape: null,
      winner: null,
    });
    expect(
      board.querySelector('.juggle-shape-option[aria-disabled="true"]')
    ).toBeTruthy();

    // Arm AI via human place → scheduled AI roll → makeAIMove chain.
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    __setStateForTests({
      ...placingMonoState(),
      selectedShape: mono,
    });
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement | null;
    expect(cell?.style.cursor).toBe('pointer');
    cell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');
    // Flush AI roll (500ms) + nested makeAIMove delays; no choice asserts.
    await vi.advanceTimersByTimeAsync(8000);
    const after = __getStateForTests();
    expect(board.querySelector('.juggle-boards')).toBeTruthy();
    // AI progressed out of a pure idle rolling seat, or game ended.
    expect(
      after.phase !== 'rolling' ||
        after.currentDice !== null ||
        after.winner !== null ||
        after.currentPlayer === 'player1'
    ).toBe(true);

    // AI placing seat: rotate/flip/hover guards no-op (computer turn pending).
    const placeShape = SHAPE_POOLS.tromino.find((s) => s.canRotate)!;
    __setStateForTests({
      ...placingMonoState(),
      currentPlayer: 'player2',
      selectedCategory: 'tromino',
      selectedDieValue: 3,
      selectedShape: placeShape,
      currentDice: [3, 4],
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    (
      board.querySelector('.juggle-control-btn') as HTMLButtonElement | null
    )?.click();
    const aiCell = board.querySelector(
      '.juggle-board.player2 .juggle-cell'
    ) as HTMLElement | null;
    aiCell?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    aiCell?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    aiCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().currentPlayer).toBe('player2');

    destroyGame();
  });

  it('winner banner structure + gameOver status arm + hover without boards', async () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

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

    __setStateForTests({
      ...createInitialState(),
      winner: 'player2',
      phase: 'gameOver',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeTruthy();

    // gameOver without winner hits default instruction arm (no banner).
    __setStateForTests({
      ...createInitialState(),
      winner: null,
      phase: 'gameOver',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeNull();
    expect(status.querySelector('.juggle-status')).toBeTruthy();

    // Hover/leave through controller while placing (boards present).
    __setStateForTests({
      ...placingMonoState(),
      hoverPosition: null,
    });
    const cell = board.querySelector(
      '.juggle-board.player1 .juggle-cell[data-row="3"][data-col="3"]'
    ) as HTMLElement;
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toEqual({ row: 3, col: 3 });
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();

    // Guard: handlers when phase is not placing.
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
    });
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(__getStateForTests().hoverPosition).toBeNull();

    destroyGame();
  });

  it('selectDie autoshape path via rules helpers still renders placing chrome', () => {
    // Pure board-ui follow-on: selectDie→selectShape state feeds renderBoard.
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const shapes = getShapesForDie(1);
    s = selectShape(s, shapes[0]!);
    expect(s.phase).toBe('placing');
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(el.classList.contains('active')).toBe(true);
    expect((el.querySelector('.juggle-cell') as HTMLElement).style.cursor).toBe(
      'pointer'
    );
  });

  it('renderBoard tolerates sparse board rows; keydown ignores non-cells', () => {
    const state = placingMonoState();
    const sparse = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    // Force undefined row / cell arms in the dense render loop.
    (sparse.cells as (boolean[] | undefined)[])[2] = undefined;
    sparse.cells[3] = sparse.cells[3]!.slice(
      0,
      CONFIG.GRID_SIZE - 1
    ) as boolean[];

    const onClick = vi.fn();
    const el = renderBoard(
      sparse,
      'player1',
      true,
      { ...state, boards: { ...state.boards, player1: sparse } },
      onClick,
      () => undefined,
      () => undefined
    );
    const grid = el.querySelector('.juggle-grid')!;
    // keydown on the grid itself (not a .juggle-cell) must no-op.
    grid.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();
    expect(el.querySelectorAll('.juggle-cell').length).toBeGreaterThan(0);
  });

  it('tutorial complete remounts HvH chrome; placeSelected jammed board false', async () => {
    stubCanvas2d({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const {
      initGame,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      __setStateForTests,
      __placeSelectedForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(board.querySelector('.juggle-boards')).toBeTruthy();

    // Fill entire board so placeSelected cannot fit.
    const full = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        full.cells[r]![c] = true;
      }
    }
    __setStateForTests({
      ...placingMonoState(),
      boards: {
        player1: full,
        player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      },
    });
    expect(__placeSelectedForTests()).toBe(false);

    destroyGame();
  });
});
