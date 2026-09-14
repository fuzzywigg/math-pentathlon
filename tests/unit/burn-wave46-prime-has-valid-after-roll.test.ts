/**
 * Wave 46 — Prime Gold hasValidMoves after roll leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  rollDice,
  hasValidMoves,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';

describe('Wave 46 prime — hasValid after roll', () => {
  afterEach(() => vi.restoreAllMocks());

  it('after roll, hasValidMoves matches non-empty placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const rolled = rollDice(createInitialState());
    expect(hasValidMoves(rolled)).toBe(getValidPlacements(rolled).length > 0);
  });
});
