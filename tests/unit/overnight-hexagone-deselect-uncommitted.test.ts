/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone deselect uncommitted leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, deselectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Overnight hex-a-gone — deselect', () => {
  it('deselect removes; committed rejects further select/deselect of others', () => {
    let s = selectBlock(selectBlock(createInitialState(), 'hexagon'), 'square');
    s = deselectBlock(s, 'hexagon');
    expect(s.turnSelection.blocks).toEqual(['square']);
    const committed = commitSelection(s);
    expect(deselectBlock(committed, 'square')).toBe(committed);
  });
});
