/**
 * Overnight HEAVY leftover after #234 — Juggle getPreviewCells monomino residual. Tests-only.
 * Complements wave48 empty-preview with a live shape path.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDie,
  getPreviewCells,
  isPlacementValid,
} from '../../src/games/juggle/rules';

describe('Wave 52 juggle — preview cells mono', () => {
  it('returns one cell and valid for monomino on empty board', () => {
    const s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const cells = getPreviewCells(s, { row: 4, col: 4 });
    expect(cells).toEqual([{ row: 4, col: 4 }]);
    expect(isPlacementValid(s, { row: 4, col: 4 })).toBe(true);
  });
});
