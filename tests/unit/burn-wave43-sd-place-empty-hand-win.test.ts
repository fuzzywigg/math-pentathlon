/**
 * Wave 43 — placeDomino empty-hand win leftover (distinct from wave41). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import {
  getValidPlacements,
  selectDomino,
  placeDomino,
} from '../../src/games/sum-dominoes/rules';

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

describe('Wave 43 sd — place empty hand win', () => {
  it('last tile against vertical seed settles gameOver for P1', () => {
    const board = emptyBoard();
    const seedDomino = makeDomino('seed', 5, 3, null);
    const placed: PlacedDomino = {
      domino: { ...seedDomino, orientation: 'vertical' },
      position: { row: 4, col: 4 },
      orientation: 'vertical',
    };
    board[4][4] = placed;
    board[5][4] = placed;

    let state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('last', 2, 0)],
        player2: [makeDomino('p2', 1, 1, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [4, 3], // sum 7 → 2+5
      selectedDomino: null,
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };

    const d = state.hands.player1[0];
    const placements = getValidPlacements(state, d, 7);
    expect(placements.length).toBeGreaterThan(0);
    const { position, orientation } = placements[0];
    state = selectDomino(state, d.id);
    expect(state.selectedDomino).toBe('last');
    state = placeDomino(state, position, orientation);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(state.hands.player1).toHaveLength(0);
  });
});
