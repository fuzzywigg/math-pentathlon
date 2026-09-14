/**
 * Wave 42 — Par-55 hasValidMoves false when board ring full. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  hasValidMoves,
  getValidPlacements,
  isValidPlacement,
} from '../../src/games/par-55/rules';

describe('Wave 42 par-55 — filled board moves', () => {
  it('filling all empty bases empties placements', () => {
    const s = createInitialState();
    const bases = new Map(s.bases);
    const filler = s.hands.player1[0];
    for (const [id, base] of bases) {
      if (!base.block) {
        bases.set(id, { ...base, block: filler, placedBy: 'player1' });
      }
    }
    const full = { ...s, bases };
    expect(getValidPlacements(full)).toEqual([]);
    expect(hasValidMoves(full)).toBe(false);
    expect(isValidPlacement(full, [...bases.keys()][0])).toBe(false);
  });
});
