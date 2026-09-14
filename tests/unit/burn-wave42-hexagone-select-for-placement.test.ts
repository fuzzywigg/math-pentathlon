/**
 * Wave 42 leftovers D — Hex-a-Gone selectBlockForPlacement. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — selectBlockForPlacement', () => {
  it('identity when wrong phase or shape not in selection', () => {
    const opening = createInitialState();
    expect(selectBlockForPlacement(opening, 'triangle')).toBe(opening);

    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(selectBlockForPlacement(state, 'square')).toBe(state);
  });

  it('switches preview among selected blocks', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(state.selectedBlockForPlacement).toBe('hexagon');
    state = selectBlockForPlacement(state, 'triangle');
    expect(state.selectedBlockForPlacement).toBe('triangle');
  });
});
