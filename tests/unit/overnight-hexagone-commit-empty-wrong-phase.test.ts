/**
 * Overnight TOKENMAXX — Hex-a-Gone commitSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { commitSelection, selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — commit gates', () => {
  it('empty selection and placeBlocks identity', () => {
    const s = createInitialState();
    expect(commitSelection(s)).toBe(s);
    let sel = selectBlock(s, 'triangle');
    sel = commitSelection(sel);
    expect(sel.phase).toBe('placeBlocks');
    expect(commitSelection(sel)).toBe(sel);
  });
});
