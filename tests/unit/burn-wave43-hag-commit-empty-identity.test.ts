/**
 * Wave 43 — Hex-a-Gone commitSelection empty identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { commitSelection, selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — commit empty identity', () => {
  it('commitSelection with no blocks is identity', () => {
    const state = createInitialState();
    expect(commitSelection(state)).toBe(state);
  });

  it('commit with blocks enters placeBlocks and picks first', () => {
    let state = createInitialState();
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'triangle');
    const next = commitSelection(state);
    expect(next.phase).toBe('placeBlocks');
    expect(next.turnSelection.committed).toBe(true);
    expect(next.selectedBlockForPlacement).toBe('rhombus');
  });
});
