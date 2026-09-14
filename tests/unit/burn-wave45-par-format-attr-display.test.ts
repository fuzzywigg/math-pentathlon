/**
 * Wave 45 — Par 55 formatMove / getAttributeDisplayName leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove, getAttributeDisplayName } from '../../src/games/par-55/rules';
import type { Par55Move } from '../../src/games/par-55/types';

describe('Wave 45 par — format helpers', () => {
  it('formatMove embeds attrs and points', () => {
    const move: Par55Move = {
      player: 'player1',
      block: { id: 'b0', shape: 'circle', color: 'red', size: 'small', thickness: 'thin' },
      baseId: 'base-1-1',
      pointsScored: 3,
      matchDetails: [],
      moveNumber: 1,
    };
    expect(formatMove(move)).toContain('3 pts');
    expect(formatMove(move)).toContain('circle');
  });

  it('getAttributeDisplayName maps known keys and passthrough', () => {
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('mystery')).toBe('mystery');
  });
});
