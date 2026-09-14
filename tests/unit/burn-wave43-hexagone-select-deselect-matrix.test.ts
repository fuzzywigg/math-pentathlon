/**
 * Wave 43 — Hex-a-Gone select/deselect/commit matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — select/deselect/commit', () => {
  it('selects up to 3 distinct shapes; rejects dupes and 4th', () => {
    let s = createInitialState();
    s = selectBlock(s, 'hexagon');
    s = selectBlock(s, 'triangle');
    s = selectBlock(s, 'square');
    expect(s.turnSelection.blocks).toEqual(['hexagon', 'triangle', 'square']);
    expect(selectBlock(s, 'rhombus')).toBe(s);
    expect(selectBlock(s, 'hexagon')).toBe(s);
  });

  it('deselect removes shape and clears placement preview match', () => {
    let s = selectBlock(createInitialState(), 'rhombus');
    s = { ...s, selectedBlockForPlacement: 'rhombus' };
    const next = deselectBlock(s, 'rhombus');
    expect(next.turnSelection.blocks).toEqual([]);
    expect(next.selectedBlockForPlacement).toBeNull();
    const open = createInitialState();
    expect(deselectBlock(open, 'hexagon')).toBe(open);
  });

  it('commit empty is identity; commit non-empty enters placeBlocks', () => {
    const open = createInitialState();
    expect(commitSelection(open)).toBe(open);
    const selected = selectBlock(createInitialState(), 'trapezoid');
    const committed = commitSelection(selected);
    expect(committed.phase).toBe('placeBlocks');
    expect(committed.turnSelection.committed).toBe(true);
    expect(committed.selectedBlockForPlacement).toBe('trapezoid');
  });

  it('selectBlockForPlacement only in placeBlocks for selected shapes', () => {
    const selected = selectBlock(selectBlock(createInitialState(), 'hexagon'), 'triangle');
    const placed = commitSelection(selected);
    const switched = selectBlockForPlacement(placed, 'triangle');
    expect(switched.selectedBlockForPlacement).toBe('triangle');
    expect(selectBlockForPlacement(placed, 'square')).toBe(placed);
    const open = createInitialState();
    expect(selectBlockForPlacement(open, 'hexagon')).toBe(open);
  });
});
