/**
 * Wave 49 — Frac-fact getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — names', () => {
  it('maps Blue/Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
