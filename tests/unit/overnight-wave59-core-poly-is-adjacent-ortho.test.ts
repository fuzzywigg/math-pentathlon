/**
 * Overnight HEAVY leftover after #280 — isAdjacent true on shared edge.
 * Opposite of wave57 corner-false connected leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAdjacent } from '../../src/core/polyomino';

describe('Wave 59 core poly — is adjacent ortho', () => {
  it('edge-neighbor is adjacent; diagonal is not', () => {
    const cells = [{ row: 0, col: 0 }];
    expect(isAdjacent({ row: 0, col: 1 }, cells)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, cells)).toBe(false);
  });
});
