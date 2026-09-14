/**
 * Wave 55 leftover after #250 — Ramrod renderBoard skips missing box ids.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — missing box skip', () => {
  it('omits deleted box-0-0 while keeping the rest of the 3×4 grid', () => {
    const s = createInitialState();
    const boxes = new Map(s.boxes);
    boxes.delete('box-0-0');
    const el = renderBoard({ ...s, boxes }, () => undefined);
    expect(el.querySelectorAll('.ramrod-box').length).toBe(11);
    expect(el.querySelectorAll('.ramrod-row').length).toBe(3);
  });
});
