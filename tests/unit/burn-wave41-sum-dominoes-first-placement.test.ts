/**
 * Wave 41 — Sum Dominoes first-placement adjacency leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
  placeDomino,
  canPlayDomino,
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

function seededState(): SumDominoesState {
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
  return { ...base, board };
}

describe('Wave 41 sum-dominoes — first placement', () => {
  it('isolated board rejects any first tile (needs adjacency)', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.map(() => null));
    const empty: SumDominoesState = { ...base, board };
    const d = makeDomino('first', 6, 6);
    expect(canPlayDomino(empty, d, 12)).toBe(false);
    expect(getValidPlacements(empty, d, 12)).toEqual([]);
    expect(
      isValidPlacement(
        empty,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'horizontal',
        12
      )
    ).toBe(false);
  });

  it('seeded center enables first hand placement for matching sum', () => {
    const base = seededState();
    const d = makeDomino('first-ok', 0, 1);
    expect(canPlayDomino(base, d, 6)).toBe(true);
    const placements = getValidPlacements(base, d, 6);
    expect(placements.length).toBeGreaterThan(0);

    const placing: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [1, 5],
      selectedDomino: 'first-ok',
      hands: { ...base.hands, player1: [d] },
    };
    const pick = placements[0];
    const next = placeDomino(placing, pick.position, pick.orientation);
    expect(next.phase).toBe('gameOver'); // emptied hand
    expect(next.winner).toBe('player1');
    expect(next.hands.player1).toHaveLength(0);
  });
});
