/**
 * Wave 41 — Sum Dominoes seeded-board adjacency place leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import {
  canPlayDomino,
  isValidPlacement,
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

function seedBoard(
  face1: number,
  face2: number,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const domino = makeDomino('seed', face1, face2, null);
  const placed: PlacedDomino = {
    domino: { ...domino, orientation },
    position: { row, col },
    orientation,
  };
  board[row][col] = placed;
  if (orientation === 'horizontal') board[row][col + 1] = placed;
  else board[row + 1][col] = placed;
  return board;
}

function seededState(
  overrides: Partial<SumDominoesState> = {}
): SumDominoesState {
  return {
    board: seedBoard(6, 6, 5, 5, 'horizontal'),
    hands: {
      player1: [makeDomino('play', 2, 4), makeDomino('keep', 1, 1)],
      player2: [makeDomino('p2', 3, 3, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [3, 5], // sum 8 → 2+6
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 41 Sum Dominoes — seeded adjacency place', () => {
  it('face+adjacent=targetSum allows placement beside horizontal double-six', () => {
    const state = seededState();
    const d = state.hands.player1[0]; // 2|4
    expect(canPlayDomino(state, d, 8)).toBe(true); // 2+6
    const placements = getValidPlacements(state, d, 8);
    expect(placements.length).toBeGreaterThan(0);
    const hit = placements.find(
      (p) =>
        isValidPlacement(state, d, p.position, p.orientation, 8)
    );
    expect(hit).toBeDefined();
  });

  it('placeDomino after select removes tile and records adjacency match', () => {
    let state = seededState();
    const d = state.hands.player1[0];
    const { position, orientation } = getValidPlacements(state, d, 8)[0];
    state = selectDomino(state, d.id);
    expect(state.selectedDomino).toBe(d.id);
    state = placeDomino(state, position, orientation);
    expect(state.hands.player1.map((x) => x.id)).toEqual(['keep']);
    expect(state.board[position.row][position.col]).not.toBeNull();
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].diceSum).toBe(8);
    expect(
      state.moveHistory[0].matchedFace + state.moveHistory[0].adjacentFace
    ).toBe(8);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');
    expect(state.passCount).toBe(0);
  });

  it('vertical seed exposes face for horizontal complement placement', () => {
    const board = seedBoard(5, 3, 4, 4, 'vertical'); // faces at (4,4)=5, (5,4)=3
    const state = seededState({
      board,
      currentDice: [4, 3], // sum 7 → 2+5
      hands: {
        player1: [makeDomino('vplay', 2, 0)],
        player2: [],
      },
    });
    const d = state.hands.player1[0];
    expect(canPlayDomino(state, d, 7)).toBe(true);
    const placements = getValidPlacements(state, d, 7);
    expect(placements.length).toBeGreaterThan(0);
    // Wrong sum rejects
    expect(canPlayDomino(state, d, 9)).toBe(false);
  });

  it('placeDomino identity when selected placement fails adjacency', () => {
    const state = seededState({
      selectedDomino: 'play',
      currentDice: [1, 1], // sum 2 — 2|4 cannot match 6+? for sum 2
    });
    const before = state;
    expect(placeDomino(state, { row: 0, col: 0 }, 'horizontal')).toBe(before);
  });

  it('emptying hand via place settles gameOver winner', () => {
    let state = seededState({
      hands: {
        player1: [makeDomino('last', 2, 0)],
        player2: [makeDomino('p2', 1, 1, 'player2')],
      },
      currentDice: [2, 6], // sum 8
    });
    const d = state.hands.player1[0];
    const { position, orientation } = getValidPlacements(state, d, 8)[0];
    state = selectDomino(state, d.id);
    state = placeDomino(state, position, orientation);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(state.hands.player1).toHaveLength(0);
  });
});
