/**
 * Wave 43 — mid-turn selectedBlockForPlacement advances leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — midturn selected advances', () => {
  it('placing first of two advances selectedBlockForPlacement', () => {
    let s = createInitialState();
    s = selectBlock(s, 'triangle');
    s = selectBlock(s, 'square');
    s = commitSelection(s);
    expect(s.selectedBlockForPlacement).toBe('triangle');
    const next = placeBlock(s, 0, 0);
    expect(next.phase).toBe('placeBlocks');
    expect(next.selectedBlockForPlacement).toBe('square');
    expect(next.turnSelection.blocks).toEqual(['square']);
  });
});
