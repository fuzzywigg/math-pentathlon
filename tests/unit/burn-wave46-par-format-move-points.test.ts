/**
 * Wave 46 — Par 55 formatMove points embedding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove, getAttributeDisplayName } from '../../src/games/par-55/rules';
import type { Par55Move } from '../../src/games/par-55/types';

describe('Wave 46 par — formatMove', () => {
  it('embeds shape/color and points; display names known', () => {
    const move: Par55Move = {
      player: 'player1',
      block: {
        id: 'b',
        shape: 'square',
        color: 'blue',
        size: 'large',
        thickness: 'thick',
      },
      baseId: 'base-1-1',
      pointsScored: 4,
      matchDetails: [],
      moveNumber: 2,
    };
    expect(formatMove(move)).toContain('4');
    expect(formatMove(move)).toMatch(/square|blue|large|thick/i);
    expect(getAttributeDisplayName('color')).toBe('Color');
  });
});
