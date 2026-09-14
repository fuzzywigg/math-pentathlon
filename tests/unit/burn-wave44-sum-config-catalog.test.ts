/**
 * Wave 44 — Sum Dominoes CONFIG leftovers (rules vs #196 AI).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 44 Sum Dominoes — CONFIG catalog', () => {
  it('board/hand/center constants', () => {
    expect(CONFIG.BOARD_SIZE).toBe(11);
    expect(CONFIG.STARTING_HAND_SIZE).toBe(7);
    expect(CONFIG.CENTER_ROW).toBe(5);
    expect(CONFIG.CENTER_COL).toBe(5);
    expect(CONFIG.MAX_FACE_VALUE).toBe(6);
  });
});
