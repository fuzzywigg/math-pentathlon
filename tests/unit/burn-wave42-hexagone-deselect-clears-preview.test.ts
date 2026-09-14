/**
 * Wave 42 leftovers D — Hex-a-Gone deselect clears preview. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, deselectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 42 hexagone — deselect clears selectedBlockForPlacement', () => {
  it('deselect matching preview clears selectedBlockForPlacement', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    // Manually set preview to triangle (mirrors mid-select preview usage)
    state = { ...state, selectedBlockForPlacement: 'triangle' };

    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual(['square']);
    expect(state.selectedBlockForPlacement).toBeNull();
  });

  it('deselect non-matching leaves preview intact', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    state = { ...state, selectedBlockForPlacement: 'square' };

    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual(['square']);
    expect(state.selectedBlockForPlacement).toBe('square');
  });
});
