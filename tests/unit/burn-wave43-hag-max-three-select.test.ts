/**
 * Wave 43 — Hex-a-Gone max 3 select + duplicate reject leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — max three select', () => {
  it('fourth distinct select is identity; duplicate is identity', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toHaveLength(3);
    expect(selectBlock(state, 'square')).toBe(state);
    expect(selectBlock(state, 'hexagon')).toBe(state);
  });
});
