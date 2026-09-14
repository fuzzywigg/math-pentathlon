/**
 * Wave 43 — Hex-a-Gone selectBlockForPlacement not-in-selection identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — selectBlockForPlacement gate', () => {
  it('shape not in selection is identity; in-selection switches', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'rhombus');
    state = commitSelection(state);
    expect(selectBlockForPlacement(state, 'triangle')).toBe(state);
    const next = selectBlockForPlacement(state, 'rhombus');
    expect(next.selectedBlockForPlacement).toBe('rhombus');
  });
});
