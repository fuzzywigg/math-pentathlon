/**
 * Wave 43 TOKENMAXX — Sum Dominoes selectDomino unplayable reject. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDomino } from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type PlacedDomino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — select unplayable', () => {
  it('rejects missing id / unplayable / wrong phase', () => {
    const base = createInitialState();
    expect(selectDomino(base, 'x')).toBe(base);

    const board = base.board.map((row) => row.map(() => null as PlacedDomino | null));
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;

    const unplayable = makeDomino('u', 0, 0);
    const playable = makeDomino('p', 6, 1);
    const state: SumDominoesState = {
      ...base,
      board,
      phase: 'placing',
      currentDice: [6, 6],
      hands: { player1: [unplayable, playable], player2: [] },
    };
    expect(selectDomino(state, 'missing')).toBe(state);
    expect(selectDomino(state, 'u')).toBe(state);
    const ok = selectDomino(state, 'p');
    expect(ok.selectedDomino).toBe('p');
  });
});
