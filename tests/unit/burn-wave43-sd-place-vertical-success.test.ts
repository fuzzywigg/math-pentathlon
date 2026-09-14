/**
 * Wave 43 TOKENMAXX — Sum Dominoes vertical place leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  placeDomino,
  isValidPlacement,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — vertical place', () => {
  it('places vertical tile adjacent to seeded double-six', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.map(() => null as PlacedDomino | null));
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;

    // Place below the seed so the vertical span does not overlap the center tile.
    const d = makeDomino('v1', 6, 1);
    const pos = { row: CONFIG.CENTER_ROW + 1, col: CONFIG.CENTER_COL };
    const sum = 12; // 6+6
    expect(isValidPlacement({ ...base, board }, d, pos, 'vertical', sum)).toBe(true);

    const state: SumDominoesState = {
      ...base,
      board,
      phase: 'placing',
      currentDice: [6, 6],
      selectedDomino: 'v1',
      hands: { player1: [d, makeDomino('keep', 0, 0)], player2: [] },
    };
    const next = placeDomino(state, pos, 'vertical');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.hands.player1).toHaveLength(1);
    expect(next.board[pos.row][pos.col]).not.toBeNull();
    expect(next.board[pos.row + 1][pos.col]).not.toBeNull();
    expect(next.passCount).toBe(0);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].orientation).toBe('vertical');
  });
});
