/**
 * Overnight HEAVY leftovers after #234 — Hex formatPosition corner matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatPosition } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — formatPosition', () => {
  it('maps corners and mid for 11x11 alphabet', () => {
    expect(formatPosition({ row: 0, col: 0 })).toBe('A1');
    expect(formatPosition({ row: 10, col: 10 })).toBe('K11');
    expect(formatPosition({ row: 4, col: 2 })).toBe('C5');
    expect(formatPosition({ row: 0, col: 10 })).toBe('K1');
    expect(formatPosition({ row: 10, col: 0 })).toBe('A11');
  });
});
