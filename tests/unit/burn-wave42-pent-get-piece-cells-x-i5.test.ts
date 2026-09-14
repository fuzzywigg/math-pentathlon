/**
 * Wave 42 — Pent'Em In getPieceCells X / I5 special flags leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPieceCells } from '../../src/games/pent-em-in/rules';
import { getPentominoShape } from '../../src/games/pent-em-in/types';

describe('Wave 42 pent-em-in — getPieceCells X / I5 specials', () => {
  it('X ignores rotation and flip flags (symmetric pentomino)', () => {
    const anchor = { row: 4, col: 4 };
    const base = getPieceCells('X', anchor, 0, false);
    expect(base).toHaveLength(5);
    expect(getPieceCells('X', anchor, 90, false)).toEqual(base);
    expect(getPieceCells('X', anchor, 180, true)).toEqual(base);
    expect(getPieceCells('X', anchor, 270, true)).toEqual(base);
  });

  it('X shape metadata: no rotate, no flip', () => {
    const x = getPentominoShape('X');
    expect(x?.canRotate).toBe(false);
    expect(x?.canFlip).toBe(false);
  });

  it('I5 rotates but flip flag is ignored', () => {
    const anchor = { row: 0, col: 0 };
    const horizontal = getPieceCells('I5', anchor, 0, false);
    const vertical = getPieceCells('I5', anchor, 90, false);
    expect(horizontal).toHaveLength(5);
    expect(vertical).toHaveLength(5);
    expect(horizontal).not.toEqual(vertical);
    expect(getPieceCells('I5', anchor, 90, true)).toEqual(vertical);
  });

  it('I5 metadata: rotate yes, flip no', () => {
    const i5 = getPentominoShape('I5');
    expect(i5?.canRotate).toBe(true);
    expect(i5?.canFlip).toBe(false);
  });
});
