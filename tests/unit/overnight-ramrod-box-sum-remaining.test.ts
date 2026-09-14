/**
 * Overnight HEAVY after #214/#215 — Ramrod getBoxSum/remaining leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getBoxSum, getRemainingValue } from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';

describe('Overnight ramrod — box sum/remaining', () => {
  it('opening boxes have null sum and positive remaining', () => {
    const s = createInitialState();
    expect(s.boxes.size).toBe(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS);
    for (const box of s.boxes.values()) {
      expect(getBoxSum(box)).toBeNull();
      expect(getRemainingValue(box)).toBe(box.targetSum);
    }
    expect(CONFIG.TARGET_SCORE).toBe(24);
  });
});
