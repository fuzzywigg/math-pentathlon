/**
 * Wave 59 leftover after #281 — Queens/Pent getPlayerName Blue/Red.
 * Distinct from aria/CSS leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as queensName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';

describe('Wave 59 queens/pent — getPlayerName', () => {
  it('maps player1/player2 to Blue/Red for both modules', () => {
    expect(queensName('player1')).toBe('Blue');
    expect(queensName('player2')).toBe('Red');
    expect(pentName('player1')).toBe('Blue');
    expect(pentName('player2')).toBe('Red');
  });
});
