/**
 * Wave 43 — selectShape identity without category leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectShape } from '../../src/games/juggle/rules';
import { ALL_SHAPES } from '../../src/games/juggle/types';

describe('Wave 43 juggle — selectShape no category', () => {
  it('selectShape is identity when selectedCategory null', () => {
    const state = createInitialState();
    expect(selectShape(state, ALL_SHAPES[0])).toBe(state);
  });
});
