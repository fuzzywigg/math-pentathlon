/**
 * Wave 45 — Pent setPreviewPosition leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { setPreviewPosition } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — preview', () => {
  it('sets and clears previewPosition', () => {
    const state = createInitialState();
    const set = setPreviewPosition(state, { row: 1, col: 2 });
    expect(set.previewPosition).toEqual({ row: 1, col: 2 });
    expect(setPreviewPosition(set, null).previewPosition).toBeNull();
  });
});
