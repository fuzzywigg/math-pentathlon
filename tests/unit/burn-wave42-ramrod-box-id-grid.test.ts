/**
 * Wave 42 leftovers D — ramrod box id grid. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createBoxId } from '../../src/games/ramrod/types';
import { createInitialState } from '../../src/games/ramrod/rules';

describe('Wave 42 ramrod — box id grid', () => {
  it('createBoxId(r,c); opening boxes map has all 3x4 ids', () => {
    expect(createBoxId(0, 0)).toBe('box-0-0');
    expect(createBoxId(2, 3)).toBe('box-2-3');

    const state = createInitialState();
    expect(state.boxes.size).toBe(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS);

    for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
      for (let c = 0; c < CONFIG.BOARD_COLS; c++) {
        const id = createBoxId(r, c);
        expect(state.boxes.has(id)).toBe(true);
        const box = state.boxes.get(id)!;
        expect(box.row).toBe(r);
        expect(box.col).toBe(c);
        expect(box.id).toBe(id);
      }
    }
  });
});
