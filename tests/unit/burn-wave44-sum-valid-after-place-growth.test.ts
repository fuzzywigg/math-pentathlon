/**
 * Wave 44 — Sum Dominoes getValidPlacements growth after first placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidPlacements,
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

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 sum-dominoes — valid placements after first seed play', () => {
  it('placement count for complement can increase after first tile', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('first', 0, 0), makeDomino('spare', 1, 1)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'first',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const probe = makeDomino('probe', 0, 1);
    const beforeCount = getValidPlacements(state, probe, 1).length; // need adjacent 0 or 1 for faces
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const afterCount = getValidPlacements(after, probe, 1).length;
    // Placing 0|0 introduces new 0 faces → sum 1 becomes available/more available
    expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
    expect(afterCount).toBeGreaterThan(0);
  });

  it('every post-place placement still passes isValidPlacement', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 4, 4);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('first', 2, 0)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3], // sum 6 → 2+4
      selectedDomino: 'first',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const d = makeDomino('scan', 0, 2);
    for (const sum of [4, 6, 2]) {
      for (const p of getValidPlacements(after, d, sum)) {
        expect(isValidPlacement(after, d, p.position, p.orientation, sum)).toBe(true);
      }
    }
  });

  it('far-from-seed positions remain absent after one place', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('first', 0, 0)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'first',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const after = placeDomino(state, pick.position, pick.orientation);
    const d = makeDomino('far', 0, 0);
    for (const p of getValidPlacements(after, d, 6)) {
      expect(p.position.row).toBeGreaterThan(1);
      expect(p.position.row).toBeLessThan(CONFIG.BOARD_SIZE - 2);
    }
  });
});
