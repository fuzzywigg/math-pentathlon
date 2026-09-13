import { describe, it, expect } from 'vitest';
import {
  HexAGoneGameState,
  createInitialState,
  getCellAt,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  canPlaceAt,
  passTurn,
  isGameOver,
  deselectBlock,
  getValidPlacements,
  getPhaseMessage,
} from '../../src/games/hex-a-gone/rules';

function fillCell(
  state: HexAGoneGameState,
  q: number,
  r: number
): HexAGoneGameState {
  return {
    ...state,
    board: state.board.map((cell) =>
      cell.q === q && cell.r === r
        ? { ...cell, filled: true, filledBy: 'player2', blockId: 99 }
        : cell
    ),
  };
}

describe('Hex-a-Gone – createInitialState', () => {
  it('starts selecting blocks with a hex board and full bank', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player1');
    expect(state.turnSelection).toEqual({ blocks: [], committed: false });
    expect(state.winner).toBeNull();
    expect(state.board.length).toBeGreaterThan(0);
    expect(state.bank.triangle).toBe(12);
  });
});

describe('Hex-a-Gone – select / commit / place', () => {
  it('selects triangle, commits, and places on a valid empty cell', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual(['triangle']);

    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.committed).toBe(true);
    expect(state.selectedBlockForPlacement).toBe('triangle');

    expect(canPlaceAt(state, 0, 0)).toBe(true);
    state = placeBlock(state, 0, 0);

    const cell = getCellAt(state, 0, 0);
    expect(cell?.filled).toBe(true);
    expect(cell?.filledBy).toBe('player1');
    expect(state.bank.triangle).toBe(11);
    expect(state.placedBlocks).toHaveLength(1);
    // Single-block turn completes → next player selecting
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player2');
  });

  it('selecting the same shape twice is a no-op', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    const before = state;
    state = selectBlock(state, 'triangle');
    expect(state).toBe(before);
    expect(state.turnSelection.blocks).toEqual(['triangle']);
  });

  it('rejects placement on a filled cell', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = commitSelection(state);
    state = fillCell(state, 0, 0);

    expect(canPlaceAt(state, 0, 0)).toBe(false);
    const before = state;
    expect(placeBlock(state, 0, 0)).toBe(before);
  });

  it('commitSelection is a no-op with empty selection', () => {
    const state = createInitialState();
    expect(commitSelection(state)).toBe(state);
  });
});

describe('Hex-a-Gone – passTurn / isGameOver', () => {
  it('passTurn flips to the opponent when no blocks selected', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectBlocks');
  });

  it('passTurn is blocked once blocks are selected', () => {
    const state = selectBlock(createInitialState(), 'rhombus');
    expect(passTurn(state)).toBe(state);
  });

  it('isGameOver reflects phase and winner', () => {
    expect(isGameOver(createInitialState())).toBe(false);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toBe(true);
  });
});

describe('Hex-a-Gone – deselect / multi-select / placements / messages', () => {
  it('deselectBlock removes a shape from the turn selection', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = selectBlock(state, 'rhombus');
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual(['rhombus']);
    expect(deselectBlock(state, 'triangle')).toBe(state); // already gone
  });

  it('multi-selects up to 3 then commitSelection → placeBlocks', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'trapezoid');
    expect(state.turnSelection.blocks).toHaveLength(3);
    // Fourth distinct shape is ignored at cap
    const capped = selectBlock(state, 'hexagon');
    expect(capped).toBe(state);

    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.committed).toBe(true);
    expect(state.selectedBlockForPlacement).toBe('triangle');
  });

  it('places one block then continues with remaining selection', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    state = selectBlock(state, 'rhombus');
    state = commitSelection(state);
    expect(getValidPlacements(state).length).toBeGreaterThan(0);

    state = placeBlock(state, 0, 0);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.blocks).toEqual(['rhombus']);
    expect(state.selectedBlockForPlacement).toBe('rhombus');
    expect(state.currentPlayer).toBe('player1');
  });

  it('getPhaseMessage covers select, place, and game-over', () => {
    const fresh = createInitialState();
    expect(getPhaseMessage(fresh)).toMatch(/Select 1-3/);

    const selected = selectBlock(fresh, 'triangle');
    expect(getPhaseMessage(selected)).toMatch(/1 block/);

    const placing = commitSelection(selected);
    expect(getPhaseMessage(placing)).toMatch(/Place your blocks/);

    expect(
      getPhaseMessage({
        ...fresh,
        phase: 'gameOver',
        winner: 'player2',
      })
    ).toMatch(/Red wins/);
  });

  it('selectBlock is a no-op when the bank is empty for that shape', () => {
    const state: HexAGoneGameState = {
      ...createInitialState(),
      bank: {
        ...createInitialState().bank,
        triangle: 0,
      },
    };
    expect(selectBlock(state, 'triangle')).toBe(state);
  });

  it('passTurn flips seat when selection is empty', () => {
    const next = passTurn(createInitialState());
    expect(next.currentPlayer).toBe('player2');
  });
});
