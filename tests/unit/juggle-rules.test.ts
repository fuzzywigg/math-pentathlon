import { describe, it, expect, vi, afterEach } from 'vitest';
import { JuggleState } from '../../src/games/juggle/types';
import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
  placeShape,
  rotateShape,
  flipShape,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { TETROMINOES } from '../../src/core/polyomino/types';

afterEach(() => {
  vi.restoreAllMocks();
});

function withDice(
  state: JuggleState,
  dice: [number, number]
): JuggleState {
  return {
    ...state,
    currentDice: dice,
    phase: 'selectingShape',
  };
}

describe('Juggle – createInitialState', () => {
  it('starts rolling with empty boards', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.currentDice).toBeNull();
    expect(state.boards.player1.width).toBe(9);
    expect(state.boards.player2.height).toBe(9);
    expect(state.winner).toBeNull();
  });
});

describe('Juggle – monomino path [1,1]', () => {
  it('selectDie auto-selects monomino and placeShape fills a cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    let state = doRollDice(createInitialState());
    expect(state.currentDice).toEqual([1, 1]);
    expect(state.phase).toBe('selectingShape');

    state = selectDie(state, 0);
    expect(state.selectedCategory).toBe('monomino');
    expect(state.selectedShape?.size).toBe(1);
    expect(state.phase).toBe('placing');

    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    state = placeShape(state, { row: 0, col: 0 });

    expect(state.boards.player1.grid[0][0]).toBe(1);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('rolling');
    expect(state.moveHistory).toHaveLength(1);
  });

  it('rejects overlapping placement', () => {
    let state = withDice(createInitialState(), [1, 1]);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 2, col: 2 });

    // player2 turn — give them monomino dice and occupy then overlap on their board
    state = withDice(state, [1, 1]);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 0, col: 0 });

    // Back to player1; place again on already filled cell
    state = withDice(state, [1, 1]);
    state = selectDie(state, 0);
    expect(state.boards.player1.grid[2][2]).toBe(1);
    expect(isPlacementValid(state, { row: 2, col: 2 })).toBe(false);
    const before = state;
    expect(placeShape(state, { row: 2, col: 2 })).toBe(before);
  });
});

describe('Juggle – rotateShape / flipShape', () => {
  it('rotateShape cycles rotation while placing', () => {
    let state = withDice(createInitialState(), [4, 4]);
    state = selectDie(state, 0);
    // Tetrominoes have multiple shapes — pick one if not auto-selected
    if (state.phase === 'selectingShape') {
      state = selectShape(state, TETROMINOES[0]);
    }
    expect(state.phase).toBe('placing');
    expect(state.selectedRotation).toBe(0);

    state = rotateShape(state);
    expect(state.selectedRotation).toBe(90);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(180);
  });

  it('flipShape toggles when shape allows flip', () => {
    const flippable = TETROMINOES.find((s) => s.canFlip);
    expect(flippable).toBeDefined();

    let state = withDice(createInitialState(), [4, 1]);
    state = selectDie(state, 0); // tetromino category
    if (!state.selectedShape) {
      state = selectShape(state, flippable!);
    } else if (!state.selectedShape.canFlip) {
      // Force a flippable shape by re-selecting via selectShape only works in selectingShape
      state = {
        ...state,
        phase: 'selectingShape',
        selectedCategory: 'tetromino',
        selectedShape: null,
      };
      state = selectShape(state, flippable!);
    }

    expect(state.phase).toBe('placing');
    expect(state.selectedFlipped).toBe(false);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(true);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(false);
  });

  it('rotateShape / flipShape are no-ops outside placing', () => {
    const state = createInitialState();
    expect(rotateShape(state)).toBe(state);
    expect(flipShape(state)).toBe(state);
  });
});
