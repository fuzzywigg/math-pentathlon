/**
 * Overnight TOKENMAXX — Hex formatPosition leftovers. Tests-only. Not hexagone.
 */
import { describe, it, expect } from 'vitest';
import { formatPosition } from '../../src/games/hex/board-ui';

describe('Overnight hex — formatPosition', () => {
  it('A1 / K1 / A11 matrix', () => {
    expect(formatPosition({ row: 0, col: 0 })).toBe('A1');
    expect(formatPosition({ row: 0, col: 10 })).toBe('K1');
    expect(formatPosition({ row: 10, col: 0 })).toBe('A11');
  });
});
