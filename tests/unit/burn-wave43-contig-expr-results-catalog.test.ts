/**
 * Wave 43 TOKENMAXX — Contig getAllPossibleResults leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults, getValidPlacements, createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — expression results', () => {
  it('three dice yield positive finite results used by placements', () => {
    const dice: [number, number, number] = [2, 3, 4];
    const results = getAllPossibleResults(dice);
    expect(results.length).toBeGreaterThan(0);
    const resultSet = new Set(results.map((r) => r.result));
    for (const { result } of results) {
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    }
    const state = createInitialState();
    const placements = getValidPlacements(state, dice);
    for (const { result } of placements) {
      expect(resultSet.has(result)).toBe(true);
      expect(state.cells.get(result)?.owner).toBeNull();
    }
  });
});
