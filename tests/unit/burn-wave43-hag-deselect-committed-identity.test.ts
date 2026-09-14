/**
 * Wave 43 — Hex-a-Gone deselectBlock while committed identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  deselectBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — deselect committed', () => {
  it('deselect is identity after commit', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = commitSelection(state);
    expect(deselectBlock(state, 'square')).toBe(state);
  });

  it('deselect removes shape before commit', () => {
    let state = createInitialState();
    state = selectBlock(state, 'square');
    state = selectBlock(state, 'triangle');
    const next = deselectBlock(state, 'square');
    expect(next.turnSelection.blocks).toEqual(['triangle']);
  });
});
