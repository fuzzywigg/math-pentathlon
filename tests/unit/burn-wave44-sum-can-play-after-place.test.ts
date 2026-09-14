/**
 * Wave 44 — Sum Dominoes canPlayDomino matrix after a successful place. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlayDomino,
  getValidPlacements,
  placeDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number, owner: Domino['owner'] = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function seedState(): SumDominoesState {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
    orientation: 'horizontal',
  };
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;
  return {
    board,
    hands: {
      player1: [makeDomino('play', 0, 0), makeDomino('later', 3, 3)],
      player2: [makeDomino('p2', 1, 1, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [3, 3], // sum 6 → 0+6
    selectedDomino: 'play',
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
  };
}

describe('Wave 44 sum-dominoes — canPlayDomino after place', () => {
  it('place expands adjacency so previously unplayable sum can become playable', () => {
    const before = seedState();
    const probe = makeDomino('probe', 0, 1);
    // Against double-six only, sum 7 needs face1=1 against a 6 — playable via 1 face
    expect(canPlayDomino(before, probe, 7)).toBe(true);
    // sum 3 cannot match any 6-face adjacency yet for a 0|1 (needs adjacent 3 or 2)
    expect(canPlayDomino(before, probe, 3)).toBe(false);

    const valids = getValidPlacements(before, before.hands.player1[0], 6);
    expect(valids.length).toBeGreaterThan(0);
    const pick = valids[0];
    const after = placeDomino(before, pick.position, pick.orientation);
    expect(after.moveHistory).toHaveLength(1);

    // After placing 0|0 adjacent to 6, new faces of 0 exist — sum 1 can match 0+1
    expect(canPlayDomino(after, probe, 1)).toBe(true);
  });

  it('canPlayDomino stays false for impossible high sum after place', () => {
    const before = seedState();
    const valids = getValidPlacements(before, before.hands.player1[0], 6);
    const after = placeDomino(before, valids[0].position, valids[0].orientation);
    const lonely = makeDomino('lonely', 0, 0);
    expect(canPlayDomino(after, lonely, 13)).toBe(false);
    expect(canPlayDomino(after, lonely, 14)).toBe(false);
    expect(canPlayDomino(after, lonely, -1)).toBe(false);
  });

  it('canPlay mirrors nonempty getValidPlacements after place', () => {
    const before = seedState();
    const valids = getValidPlacements(before, before.hands.player1[0], 6);
    const after = placeDomino(before, valids[0].position, valids[0].orientation);
    for (const [a, b] of [
      [0, 0],
      [1, 2],
      [6, 0],
    ] as const) {
      const d = makeDomino(`m-${a}-${b}`, a, b);
      for (const sum of [5, 6, 7, 12]) {
        expect(canPlayDomino(after, d, sum)).toBe(getValidPlacements(after, d, sum).length > 0);
      }
    }
  });
});
