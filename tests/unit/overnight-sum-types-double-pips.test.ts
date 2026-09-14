/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes doubles/pips leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createDominoSet,
  isDouble,
  getDominoPips,
  getDiceSum,
  CONFIG,
} from '../../src/games/sum-dominoes/types';

describe('Overnight sum-dominoes — doubles/pips', () => {
  it('full double-six set; doubles and pip sums', () => {
    const set = createDominoSet();
    expect(set.length).toBe(28);
    const doubles = set.filter(isDouble);
    expect(doubles.length).toBe(CONFIG.MAX_FACE_VALUE + 1);
    expect(getDominoPips(doubles[0])).toBe(doubles[0].face1 + doubles[0].face2);
    expect(getDiceSum([3, 4])).toBe(7);
  });
});
