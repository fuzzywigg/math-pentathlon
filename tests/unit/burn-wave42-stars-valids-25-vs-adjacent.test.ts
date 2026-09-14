/**
 * Wave 42 — Stars & Bars getValidPlacements empty-25 vs adjacent ring. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getValidPlacements,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — valids 25 vs adjacent', () => {
  it('empty board exposes all 25 cells', () => {
    const valids = getValidPlacements(createInitialState());
    expect(valids).toHaveLength(25);
    const keys = new Set(valids.map((p) => `${p.row},${p.col}`));
    expect(keys.size).toBe(25);
  });

  it('after center place only the 8-adjacent ring remains', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    const valids = getValidPlacements(state);
    expect(valids).toHaveLength(8);
    for (const [r, c] of [
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ]) {
      expect(valids).toContainEqual({ row: r, col: c });
    }
    expect(valids).not.toContainEqual({ row: 0, col: 0 });
    expect(valids).not.toContainEqual({ row: 2, col: 2 });
  });

  it('corner seed yields only three adjacent empties', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 0, 0);
    const valids = getValidPlacements(state);
    expect(valids).toHaveLength(3);
    expect(valids).toEqual(
      expect.arrayContaining([
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ])
    );
  });
});
