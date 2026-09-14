/**
 * Wave 43 — sum-dominoes types pips/double/dice leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isDouble,
  getDominoPips,
  getDiceSum,
  type Domino,
} from '../../src/games/sum-dominoes/types';

describe('Wave 43 sd — types pips double dice', () => {
  it('isDouble / getDominoPips / getDiceSum matrix', () => {
    const d: Domino = {
      id: 'd',
      face1: 3,
      face2: 3,
      owner: null,
      orientation: 'horizontal',
    };
    expect(isDouble(d)).toBe(true);
    expect(getDominoPips(d)).toBe(6);
    expect(isDouble({ ...d, face2: 4 })).toBe(false);
    expect(getDiceSum([2, 5])).toBe(7);
  });
});
