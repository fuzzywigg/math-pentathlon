/**
 * Wave 48 — Juggle getPreviewCells empty without selectedShape. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getPreviewCells, isPlacementValid } from '../../src/games/juggle/rules';

describe('Wave 48 juggle — preview empty no shape', () => {
  it('preview empty and placement invalid without shape', () => {
    const s = { ...createInitialState(), phase: 'placing' as const };
    expect(getPreviewCells(s, { row: 0, col: 0 })).toEqual([]);
    expect(isPlacementValid(s, { row: 0, col: 0 })).toBe(false);
  });
});
