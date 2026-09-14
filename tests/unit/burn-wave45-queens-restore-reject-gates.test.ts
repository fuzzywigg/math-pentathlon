/**
 * Wave 45 TOKENMAXX — Queens restoreCapturedPiece reject gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  CONFIG,
  cellsInRing,
} from '../../src/games/queens-guards/types';
import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';

describe('Wave 45 queens — restore reject gates', () => {
  it('rejects non-outer target and occupied outer cell', () => {
    const base = createInitialState();
    const captured = { ring: 5, position: 1 };
    const withCap = { ...base, capturedPieces: [captured] };

    expect(
      restoreCapturedPiece(withCap, captured, { ring: 2, position: 0 })
    ).toBe(withCap);

    // Find occupied outer cell
    const outer = CONFIG.NUM_RINGS - 1;
    let occupied = -1;
    for (let pos = 0; pos < cellsInRing(outer); pos++) {
      if (base.cells.get(cellKey(outer, pos))?.piece) {
        occupied = pos;
        break;
      }
    }
    expect(occupied).toBeGreaterThanOrEqual(0);
    expect(
      restoreCapturedPiece(withCap, captured, { ring: outer, position: occupied })
    ).toBe(withCap);
  });
});
