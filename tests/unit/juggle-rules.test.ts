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
import { PENTOMINOES, TETROMINOES } from '../../src/core/polyomino/types';

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
    expect(state.boards.player1.rows).toBe(9);
    expect(state.boards.player2.cols).toBe(9);
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

    expect(state.boards.player1.cells[0][0]).toBe(true);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('rolling');
    expect(state.moveHistory).toHaveLength(1);
  });

  it('rejects overlapping placement', () => {
    let state = withDice(createInitialState(), [1, 1]);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 2, col: 2 });

    // player2 turn — place monomino on their board
    state = withDice(state, [1, 1]);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 0, col: 0 });

    // Back to player1; reject overlap on already filled cell
    state = withDice(state, [1, 1]);
    state = selectDie(state, 0);
    expect(state.boards.player1.cells[2][2]).toBe(true);
    expect(isPlacementValid(state, { row: 2, col: 2 })).toBe(false);
    const before = state;
    expect(placeShape(state, { row: 2, col: 2 })).toBe(before);
  });
});

describe('Juggle – rotateShape / flipShape', () => {
  it('rotateShape cycles rotation while placing', () => {
    let state = withDice(createInitialState(), [4, 4]);
    state = selectDie(state, 0);
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
    const flippable = PENTOMINOES.find((s) => s.canFlip);
    expect(flippable).toBeDefined();

    let state = withDice(createInitialState(), [5, 1]);
    state = selectDie(state, 0); // pentomino category
    if (state.phase === 'selectingShape') {
      state = selectShape(state, flippable!);
    } else if (!state.selectedShape?.canFlip) {
      state = {
        ...state,
        phase: 'selectingShape',
        selectedCategory: 'pentomino',
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
