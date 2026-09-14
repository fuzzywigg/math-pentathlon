/**
 * Wave 43 — Ramrod CONFIG + box target layout leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createBoxId, ROD_NAMES } from '../../src/games/ramrod/types';
import { createInitialState } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — config/layout', () => {
  it('TARGET_SCORE 24; 3x4 boxes with targets 5-10 ladder', () => {
    expect(CONFIG.TARGET_SCORE).toBe(24);
    expect(CONFIG.STARTING_RODS_PER_PLAYER).toBe(5);
    const state = createInitialState();
    expect(state.boxes.size).toBe(12);
    const expected = [
      [5, 6, 7, 8],
      [6, 7, 8, 9],
      [7, 8, 9, 10],
    ];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const box = state.boxes.get(createBoxId(r, c))!;
        expect(box.targetSum).toBe(expected[r][c]);
      }
    }
    expect(ROD_NAMES[1]).toBeTruthy();
  });
});
