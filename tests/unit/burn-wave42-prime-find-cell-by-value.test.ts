/**
 * Wave 42 — Prime Gold findCellByValue leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, findCellByValue } from '../../src/games/prime-gold/rules';
import { CONFIG } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — findCellByValue', () => {
  it('returns null for values outside 1..49', () => {
    const state = createInitialState();
    for (const miss of [0, -1, 50, 100, NaN]) {
      expect(findCellByValue(state, miss)).toBeNull();
    }
  });

  it('hits every board value with stable row/col metadata', () => {
    const state = createInitialState();
    for (let v = 1; v <= CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE; v++) {
      const cell = findCellByValue(state, v);
      expect(cell).toBeTruthy();
      expect(cell!.value).toBe(v);
      expect(cell!.row).toBeGreaterThanOrEqual(0);
      expect(cell!.row).toBeLessThan(CONFIG.BOARD_SIZE);
      expect(cell!.col).toBeGreaterThanOrEqual(0);
      expect(cell!.col).toBeLessThan(CONFIG.BOARD_SIZE);
      expect(state.cells.get(`${cell!.row},${cell!.col}`)?.value).toBe(v);
    }
  });

  it('center lookup returns value 1 at board center', () => {
    const state = createInitialState();
    const center = Math.floor(CONFIG.BOARD_SIZE / 2);
    const cell = findCellByValue(state, 1);
    expect(cell!.row).toBe(center);
    expect(cell!.col).toBe(center);
  });
});
