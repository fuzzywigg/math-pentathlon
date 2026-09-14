/**
 * Wave 45 TOKENMAXX — Par-55 formatMove + attribute display leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove, getAttributeDisplayName } from '../../src/games/par-55/rules';
import { createBlockSet } from '../../src/games/par-55/types';

describe('Wave 45 par55 — format/display', () => {
  it('formatMove includes player and points; attr names non-empty', () => {
    const block = createBlockSet()[0];
    const text = formatMove({
      player: 'player1',
      block,
      baseId: 'r0c0',
      pointsScored: 3,
      matchDetails: ['color'],
      moveNumber: 1,
    });
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/3/);
    for (const a of ['shape', 'color', 'size', 'thickness']) {
      expect(getAttributeDisplayName(a).length).toBeGreaterThan(0);
    }
  });
});
