/**
 * Wave 56 leftover after #256 — Ramrod slot data-col = col*2+slot.
 * Distinct from wave52 digit-only data-col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 56 ramrod — slot data-col', () => {
  it('encodes box-1-2 slots as data-col 4 and 5', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined);
    // box row1 col2 → first slot of that box is 3rd box in row (0-index col 2)
    const boxes = [...el.querySelectorAll('.ramrod-box')];
    // grid is 3 rows × 4 cols; index = row*4+col → 1*4+2 = 6
    const box = boxes[6];
    expect(box?.querySelector('.ramrod-box-label')?.textContent).toMatch(
      /Sum:/
    );
    const slots = [...box.querySelectorAll('.ramrod-slot')];
    expect(slots[0]?.getAttribute('data-col')).toBe('4');
    expect(slots[1]?.getAttribute('data-col')).toBe('5');
    expect(slots[0]?.getAttribute('data-row')).toBe('1');
  });
});
