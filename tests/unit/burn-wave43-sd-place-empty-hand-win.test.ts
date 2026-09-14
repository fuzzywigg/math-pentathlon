/**
 * Wave 43 TOKENMAXX — Sum Dominoes empty-hand win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeDomino, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type PlacedDomino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 43 sum-dominoes — empty-hand win', () => {
  it('last tile place settles gameOver for current seat', () => {
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
    const d = makeDomino('last', 0, 6);
    const seeded: SumDominoesState = {
      ...base,
      board,
      phase: 'placing',
      currentDice: [6, 6],
      selectedDomino: 'last',
      hands: { player1: [d], player2: [makeDomino('p2', 1, 1)] },
    };
    const picks = getValidPlacements(seeded, d, 12);
    expect(picks.length).toBeGreaterThan(0);
    const next = placeDomino(seeded, picks[0].position, picks[0].orientation);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.hands.player1).toHaveLength(0);
    expect(next.currentPlayer).toBe('player1');
  });
});
