/**
 * Regression: Juggle jammed-roll Pass recovery (soft-lock escape).
 * No scoring/win-rule changes — only turn recovery when dice cannot place.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  canMakeAnyMove,
  shouldOfferPass,
  passTurn,
  selectDie,
  selectShape,
  canPlaceSelectedShape,
  canPlaceAnyShapeForDie,
  clearSelectedShape,
  placeShape,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS, type JuggleState } from '../../src/games/juggle/types';
import { placePolyomino, canPlaceShape } from '../../src/core/polyomino/placement';
import { executeAITurn, getAIDieChoice } from '../../src/games/juggle/ai';
import { renderPassControls, renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => {
  vi.restoreAllMocks();
});

function fillBoardAlmostFull(leaveHoles: Array<{ row: number; col: number }>) {
  const holeSet = new Set(leaveHoles.map((h) => `${h.row},${h.col}`));
  const mono = SHAPE_POOLS.monomino[0];
  let board = createInitialState().boards.player1;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (holeSet.has(`${row},${col}`)) continue;
      board = placePolyomino(board, mono, { row, col }, 0, false, 1);
    }
  }
  return board;
}

function jammedSelectingState(): JuggleState {
  // One empty cell — only monomino fits; dice are both pentominoes.
  const board = fillBoardAlmostFull([{ row: 4, col: 4 }]);
  return {
    ...createInitialState(),
    boards: {
      player1: board,
      player2: createInitialState().boards.player2,
    },
    currentDice: [5, 6],
    phase: 'selectingShape',
  };
}

describe('Juggle pass / jam recovery', () => {
  it('shouldOfferPass when neither die can place', () => {
    const state = jammedSelectingState();
    expect(canMakeAnyMove(state)).toBe(false);
    expect(shouldOfferPass(state)).toBe(true);
    expect(canPlaceAnyShapeForDie(state, 5)).toBe(false);
    expect(canPlaceAnyShapeForDie(state, 1)).toBe(true);
  });

  it('passTurn flips seat and returns to rolling without inventing a winner', () => {
    const state = jammedSelectingState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
    expect(next.selectedShape).toBeNull();
    expect(next.winner).toBeNull();
    // Board fill unchanged (no scoring / placement side effects).
    expect(next.boards.player1).toBe(state.boards.player1);
  });

  it('passTurn is a no-op when a legal placement still exists', () => {
    const open = {
      ...createInitialState(),
      currentDice: [1, 5] as [number, number],
      phase: 'selectingShape' as const,
    };
    expect(shouldOfferPass(open)).toBe(false);
    expect(passTurn(open)).toBe(open);
  });

  it('selectDie does not auto-enter placing when the sole shape cannot fit', () => {
    const board = fillBoardAlmostFull([
      { row: 0, col: 0 },
      { row: 0, col: 2 },
    ]); // two isolated holes — domino cannot fit
    const state: JuggleState = {
      ...createInitialState(),
      boards: {
        player1: board,
        player2: createInitialState().boards.player2,
      },
      currentDice: [2, 5],
      phase: 'selectingShape',
    };
    const next = selectDie(state, 0);
    expect(next.selectedCategory).toBe('domino');
    expect(next.phase).toBe('selectingShape');
    expect(next.selectedShape).toBeNull();
  });

  it('selectShape refuses shapes that cannot fit', () => {
    const board = fillBoardAlmostFull([{ row: 4, col: 4 }]);
    const pent = SHAPE_POOLS.pentomino[0];
    expect(canPlaceShape(board, pent)).toBe(false);
    const state: JuggleState = {
      ...createInitialState(),
      boards: {
        player1: board,
        player2: createInitialState().boards.player2,
      },
      currentDice: [5, 1],
      selectedCategory: 'pentomino',
      phase: 'selectingShape',
    };
    expect(selectShape(state, pent)).toBe(state);
  });

  it('clearSelectedShape returns to selectingShape when placing piece will not fit', () => {
    const board = fillBoardAlmostFull([{ row: 4, col: 4 }]);
    const state: JuggleState = {
      ...createInitialState(),
      boards: {
        player1: board,
        player2: createInitialState().boards.player2,
      },
      currentDice: [5, 1],
      selectedCategory: 'pentomino',
      selectedShape: SHAPE_POOLS.pentomino[0],
      phase: 'placing',
    };
    expect(canPlaceSelectedShape(state)).toBe(false);
    const cleared = clearSelectedShape(state);
    expect(cleared.phase).toBe('selectingShape');
    expect(cleared.selectedShape).toBeNull();
  });

  it('executeAITurn passes instead of soft-locking on jammed dice', () => {
    const state = {
      ...jammedSelectingState(),
      currentPlayer: 'player2' as const,
      boards: {
        player1: createInitialState().boards.player1,
        player2: jammedSelectingState().boards.player1,
      },
    };
    expect(getAIDieChoice(state, 'player2', 'hard')).toBeNull();
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
    expect(next.winner).toBeNull();
  });

  it('renderPassControls exposes Pass Turn button', () => {
    const onPass = vi.fn();
    const el = renderPassControls(onPass);
    const btn = el.querySelector('.juggle-pass-btn') as HTMLButtonElement | null;
    expect(btn?.textContent).toMatch(/Pass Turn/);
    btn?.click();
    expect(onPass).toHaveBeenCalledOnce();
  });

  it('shape selector disables shapes that will not fit', () => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
    };
    vi.spyOn(proto, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const board = fillBoardAlmostFull([{ row: 4, col: 4 }]);
    const state: JuggleState = {
      ...createInitialState(),
      boards: {
        player1: board,
        player2: createInitialState().boards.player2,
      },
      currentDice: [5, 1],
      selectedCategory: 'pentomino',
      phase: 'selectingShape',
    };
    const el = renderShapeSelector(state, () => undefined);
    const options = el.querySelectorAll('.juggle-shape-option');
    expect(options.length).toBeGreaterThan(0);
    for (const opt of options) {
      expect(opt.classList.contains('disabled')).toBe(true);
      expect(opt.getAttribute('aria-label')).toMatch(/will not fit/);
    }
  });

  it('chosenDie in move history matches selected category die', () => {
    let state = {
      ...createInitialState(),
      currentDice: [2, 1] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 1); // monomino from die 1
    expect(state.phase).toBe('placing');
    state = placeShape(state, { row: 0, col: 0 });
    expect(state.moveHistory[0]?.chosenDie).toBe(1);
  });
});
