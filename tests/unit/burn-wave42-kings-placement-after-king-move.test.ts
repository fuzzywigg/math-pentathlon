/**
 * Wave 42 — Kings isValidQuadraphagePlacement after king move leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isValidQuadraphagePlacement,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — placement validity after king move', () => {
  it('vacated king cell becomes valid placement (0-based)', () => {
    let state = createInitialGameState();
    expect(isValidQuadraphagePlacement(state, { row: 0, col: 4 })).toBe(false);
    state = moveKing(state, { row: 2, col: 5 });
    // Old king square (0,4) now empty
    expect(isValidQuadraphagePlacement(state, { row: 0, col: 4 })).toBe(true);
    // New king square occupied
    expect(isValidQuadraphagePlacement(state, { row: 1, col: 4 })).toBe(false);
  });

  it('placement count stays 79 after king-only move', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 4 });
    expect(getValidQuadraphagePlacements(state)).toHaveLength(79);
  });

  it('OOB and same-cell king still false mid-place phase', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 1, col: 6 });
    expect(isValidQuadraphagePlacement(state, { row: 9, col: 0 })).toBe(false);
    expect(isValidQuadraphagePlacement(state, { row: 0, col: 5 })).toBe(false);
  });
});
