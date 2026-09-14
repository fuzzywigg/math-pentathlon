/**
 * Overnight TOKENMAXX — Hex isValidPosition OOB leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isValidPosition } from '../../src/games/hex/rules';

describe('Overnight hex — isValidPosition', () => {
  it('in-bounds true; negatives and past size false', () => {
    expect(isValidPosition({ row: 0, col: 0 }, 5)).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 }, 5)).toBe(false);
    expect(isValidPosition({ row: 0, col: 5 }, 5)).toBe(false);
  });
});
