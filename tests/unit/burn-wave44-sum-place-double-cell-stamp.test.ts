/**
 * Wave 44 — Sum Dominoes placeDomino double-cell board stamp. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { placeDomino, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

describe('Wave 44 sum-dominoes — placeDomino double-cell stamp', () => {
  it('horizontal place stamps both cells with same reference', () => {
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
        player1: [makeDomino('play', 0, 0), makeDomino('keep', 1, 1)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'play',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const horiz = getValidPlacements(state, state.hands.player1[0], 6).find(
      (p) => p.orientation === 'horizontal'
    );
    expect(horiz).toBeDefined();
    const next = placeDomino(state, horiz!.position, 'horizontal');
    const a = next.board[horiz!.position.row][horiz!.position.col];
    const b = next.board[horiz!.position.row][horiz!.position.col + 1];
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a).toBe(b);
    expect(a!.orientation).toBe('horizontal');
  });

  it('vertical place stamps row and row+1', () => {
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
        player1: [makeDomino('play', 0, 0)],
        player2: [makeDomino('p2', 2, 2, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'play',
      phase: 'placing',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };
    const vert = getValidPlacements(state, state.hands.player1[0], 6).find(
      (p) => p.orientation === 'vertical'
    );
    expect(vert).toBeDefined();
    const next = placeDomino(state, vert!.position, 'vertical');
    const a = next.board[vert!.position.row][vert!.position.col];
    const b = next.board[vert!.position.row + 1][vert!.position.col];
    expect(a).toBe(b);
    expect(a!.orientation).toBe('vertical');
    expect(next.moveHistory[0].orientation).toBe('vertical');
  });

  it('history preserves prior moves when appending', () => {
    const board = emptyBoard();
    const seed = makeDomino('seed', 6, 6);
    const placed: PlacedDomino = {
      domino: { ...seed, orientation: 'horizontal' },
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
    };
    board[5][5] = placed;
    board[5][6] = placed;
    const prior = {
      player: 'player2' as const,
      domino: makeDomino('old', 1, 1),
      position: { row: 1, col: 1 },
      orientation: 'horizontal' as const,
      matchedFace: 1,
      adjacentFace: 5,
      diceSum: 6,
      moveNumber: 1,
    };
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [makeDomino('play', 0, 0), makeDomino('keep', 2, 2)],
        player2: [],
      },
      currentPlayer: 'player1',
      currentDice: [3, 3],
      selectedDomino: 'play',
      phase: 'placing',
      winner: null,
      moveHistory: [prior],
      passCount: 0,
    };
    const pick = getValidPlacements(state, state.hands.player1[0], 6)[0];
    const next = placeDomino(state, pick.position, pick.orientation);
    expect(next.moveHistory).toHaveLength(2);
    expect(next.moveHistory[0]).toEqual(prior);
    expect(next.moveHistory[1].moveNumber).toBe(2);
  });
});
