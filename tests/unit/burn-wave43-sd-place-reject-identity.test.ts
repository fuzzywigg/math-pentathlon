/**
 * Wave 43 TOKENMAXX — Sum Dominoes placeDomino reject identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeDomino } from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type PlacedDomino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — place reject', () => {
  it('rejects wrong phase / missing selection / invalid spot', () => {
    const base = createInitialState();
    const pos = { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL };
    expect(placeDomino(base, pos, 'horizontal')).toBe(base);

    const noDice: SumDominoesState = {
      ...base,
      phase: 'placing',
      selectedDomino: 'x',
      currentDice: null,
    };
    expect(placeDomino(noDice, pos, 'horizontal')).toBe(noDice);

    const board = base.board.map((row) => row.map(() => null as PlacedDomino | null));
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: pos,
      orientation: 'horizontal',
    };
    board[pos.row][pos.col] = placed;
    board[pos.row][pos.col + 1] = placed;
    const d = makeDomino('bad', 0, 0);
    const state: SumDominoesState = {
      ...base,
      board,
      phase: 'placing',
      currentDice: [6, 6],
      selectedDomino: 'bad',
      hands: { player1: [d], player2: [] },
    };
    // invalid: 0+6 != 12
    expect(placeDomino(state, { row: pos.row - 1, col: pos.col }, 'horizontal')).toBe(state);

    const ghost: SumDominoesState = {
      ...state,
      selectedDomino: 'ghost',
    };
    expect(placeDomino(ghost, pos, 'horizontal')).toBe(ghost);
  });
});
