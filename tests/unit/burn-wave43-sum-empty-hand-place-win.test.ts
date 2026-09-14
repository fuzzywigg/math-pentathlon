/**
 * Wave 43 — Sum Dominoes empty-hand win on place resets passCount. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  canPlayDomino,
  getValidPlacements,
  selectDomino,
  placeDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function seedBoard(): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const domino = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...domino, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

describe('Wave 43 sum-dominoes — empty-hand place win', () => {
  it('placing last tile wins and clears passCount', () => {
    const play = makeDomino('last', 2, 4);
    const state: SumDominoesState = {
      board: seedBoard(),
      hands: { player1: [play], player2: [makeDomino('p2', 1, 1, 'player2')] },
      currentPlayer: 'player1',
      currentDice: [3, 5],
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 2,
    };
    expect(canPlayDomino(state, play, 8)).toBe(true);
    const placements = getValidPlacements(state, play, 8);
    expect(placements.length).toBeGreaterThan(0);
    const selected = selectDomino(state, play.id);
    const { position, orientation } = placements[0];
    const next = placeDomino(selected, position, orientation);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.passCount).toBe(0);
    expect(next.hands.player1).toHaveLength(0);
  });
});
