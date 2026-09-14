/**
 * Wave 45 — Pent rotateSelectedPiece full cycle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, rotateSelectedPiece } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — rotate cycle', () => {
  it('Y rotates 0→90→180→270→0', () => {
    let s = selectPiece(createInitialState(), 'Y');
    const seen: number[] = [s.selectedRotation];
    for (let i = 0; i < 4; i++) {
      s = rotateSelectedPiece(s);
      seen.push(s.selectedRotation);
    }
    expect(seen).toEqual([0, 90, 180, 270, 0]);
  });
});
