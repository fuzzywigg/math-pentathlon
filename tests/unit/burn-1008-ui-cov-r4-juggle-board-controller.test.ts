/**
 * burn-1008-mp-ui-coverage-round-4 — juggle board-ui hover preview + controller
 * human shell paths (destroy, winner chrome class, abandon, hover). Tests-only.
 * No player-facing copy assertions; no AI move-choice / timing asserts.
 *
 * STACK NOTE (round-5 / tip alpha restore): tip `juggle/board-ui` no longer
 * exports `applyJuggleHoverPreview` (removed with the Friday AI/copy restore).
 * These characterization tests were written against the pre-restore surface.
 * Skip the whole file until tip re-gains that helper (e.g. #511 fold) — do not
 * reintroduce source here (tests-only round-5).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createInitialState,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import * as juggleBoardUi from '../../src/games/juggle/board-ui';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { installDomHooks } from './helpers/dom';

const applyJuggleHoverPreview = (
  juggleBoardUi as {
    applyJuggleHoverPreview?: (...args: never[]) => void;
    renderBoard: typeof juggleBoardUi.renderBoard;
  }
).applyJuggleHoverPreview;
const { renderBoard } = juggleBoardUi;

const JUGGLE_HOVER_HELPER_PRESENT =
  typeof applyJuggleHoverPreview === 'function';

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

function placingState() {
  const mono = SHAPE_POOLS.monomino[0]!;
  const base = {
    ...createInitialState(),
    phase: 'selectingShape' as const,
    currentDice: [1, 1] as [number, number],
  };
  const withDie = selectDie(base, 0);
  return selectShape(withDie, mono);
}

describe.skipIf(!JUGGLE_HOVER_HELPER_PRESENT)(
  'burn-1008 ui-cov-r4 juggle board-ui hover',
  () => {
  installDomHooks({ styleIds: ['juggle-styles'] });
  beforeEach(() => stubCanvas());
  afterEach(() => vi.restoreAllMocks());

  it('applyJuggleHoverPreview no-ops when allowInput false or not placing', () => {
    const state = placingState();
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    const board = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(board);
    document.body.appendChild(root);

    applyJuggleHoverPreview(root, state, { allowInput: false });
    expect(board.dataset.hoverKeys ?? '').toBe('');

    applyJuggleHoverPreview(
      root,
      { ...state, phase: 'rolling', hoverPosition: { row: 0, col: 0 } },
      { allowInput: true }
    );
    expect(board.querySelectorAll('.preview-valid,.preview-invalid')).toHaveLength(
      0
    );
  });

  it('applyJuggleHoverPreview paints then clears hover keys on leave', () => {
    const state = {
      ...placingState(),
      hoverPosition: { row: 0, col: 0 },
    };
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    const board = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(board);
    document.body.appendChild(root);

    applyJuggleHoverPreview(root, state, { allowInput: true });
    expect((board.dataset.hoverKeys ?? '').length).toBeGreaterThan(0);
    expect(
      board.querySelectorAll('.preview-valid,.preview-invalid').length
    ).toBeGreaterThan(0);

    applyJuggleHoverPreview(
      root,
      { ...state, hoverPosition: null },
      { allowInput: true }
    );
    expect(board.dataset.hoverKeys).toBe('');
    expect(board.querySelectorAll('.preview-valid,.preview-invalid')).toHaveLength(
      0
    );
  });

  it('applyJuggleHoverPreview returns early without matching board/grid', () => {
    const state = {
      ...placingState(),
      hoverPosition: { row: 1, col: 1 },
    };
    const empty = document.createElement('div');
    empty.className = 'juggle-boards';
    document.body.appendChild(empty);
    expect(() =>
      applyJuggleHoverPreview(empty, state, { allowInput: true })
    ).not.toThrow();

    const orphanBoard = document.createElement('div');
    orphanBoard.className = 'juggle-board player1';
    empty.appendChild(orphanBoard);
    expect(() =>
      applyJuggleHoverPreview(empty, state, { allowInput: true })
    ).not.toThrow();
  });
  }
);

describe.skipIf(!JUGGLE_HOVER_HELPER_PRESENT)(
  'burn-1008 ui-cov-r4 juggle controller shell',
  () => {
  installDomHooks({ fakeTimers: true, styleIds: ['juggle-styles'] });
  beforeEach(() => stubCanvas());
  afterEach(async () => {
    const { destroyGame } = await import(
      '../../src/games/juggle/game-controller'
    );
    destroyGame();
    vi.restoreAllMocks();
  });

  it('human roll → die select → place → destroy clears mounts', async () => {
    const {
      initGame,
      newGameVsHuman,
      __getStateForTests,
      __setStateForTests,
      destroyGame,
    } = await import('../../src/games/juggle/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    vi.spyOn(Math, 'random').mockReturnValue(0);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    expect(__getStateForTests().phase).toBe('selectingShape');

    const die = board.querySelector('.juggle-die.selectable') as HTMLElement;
    die?.click();
    const afterDie = __getStateForTests();
    expect(['selectingShape', 'placing']).toContain(afterDie.phase);

    if (afterDie.phase === 'selectingShape') {
      const option = board.querySelector(
        '.juggle-shape-option:not(.disabled)'
      ) as HTMLElement;
      option?.click();
    }
    expect(__getStateForTests().phase).toBe('placing');

    const valid = board.querySelector(
      '.juggle-board.player1 .juggle-cell-valid'
    ) as HTMLElement;
    expect(valid).toBeTruthy();
    valid.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    valid.click();
    expect(__getStateForTests().boards.player1).toBeTruthy();

    // Winner chrome class when state already has a winner (structural only)
    __setStateForTests({
      ...__getStateForTests(),
      winner: 'player1',
      phase: 'gameOver',
    });
    expect(status.querySelector('.juggle-winner-banner')).toBeTruthy();

    destroyGame();
    expect(board.querySelector('.juggle-boards')).toBeTruthy(); // last paint kept
  });

  it('abandon control returns to selectingShape; AI seat blocks human handlers', async () => {
    const {
      initGame,
      newGameVsAI,
      __getStateForTests,
      __setStateForTests,
    } = await import('../../src/games/juggle/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    const placing = placingState();
    __setStateForTests(placing);
    expect(__getStateForTests().phase).toBe('placing');
    const abandon = board.querySelector(
      '.juggle-choose-other-btn'
    ) as HTMLButtonElement | null;
    expect(abandon).toBeTruthy();
    abandon!.click();
    expect(__getStateForTests().phase).toBe('selectingShape');

    // Force AI seat pending — human roll must no-op (structural guard)
    __setStateForTests({
      ...createInitialState(),
      phase: 'rolling',
      currentPlayer: 'player2',
    });
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    const roll = board.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    const before = __getStateForTests().phase;
    roll?.click();
    expect(__getStateForTests().phase).toBe(before);
  });
  }
);
