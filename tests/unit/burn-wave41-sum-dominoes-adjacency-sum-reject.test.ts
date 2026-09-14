/**
 * Wave 41 — Sum Dominoes adjacency / targetSum reject matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 41 sum-dominoes — adjacency targetSum rejects', () => {
  it('rejects adjacent cell when faces do not sum to target', () => {
    const state = createInitialState();
    // Center is [6|6]; place next to it with face that cannot make sum 3
    const d = makeDomino('no-match', 1, 1);
    const beside = { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL - 2 };
    expect(isValidPlacement(state, d, beside, 'horizontal', 3)).toBe(false);
    expect(isValidPlacement(state, d, beside, 'vertical', 3)).toBe(false);
  });

  it('accepts placement when face + adjacent = targetSum', () => {
    const state = createInitialState();
    // 0 next to 6 with target 6 → 0+6=6
    const d = makeDomino('ok', 0, 0);
    const placements = getValidPlacements(state, d, 6);
    expect(placements.length).toBeGreaterThan(0);
    expect(canPlayDomino(state, d, 6)).toBe(true);
    const sample = placements[0];
    expect(
      isValidPlacement(state, d, sample.position, sample.orientation, 6)
    ).toBe(true);
  });

  it('wrong targetSum yields empty valid placements for otherwise-fit domino', () => {
    const state = createInitialState();
    const d = makeDomino('sixish', 0, 1);
    expect(getValidPlacements(state, d, 99)).toEqual([]);
    expect(canPlayDomino(state, d, 99)).toBe(false);
  });
});
