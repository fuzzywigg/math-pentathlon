/**
 * Wave 60 leftover after tip/#279 (post-#289 residual) — Calla selectPit phase exact.
 * Tightens burn-wave41 regex. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Wave 60 calla — phase select shield exact', () => {
  it('locks Blue and Red select-shield copy', () => {
    expect(getPhaseMessage(createInitialState())).toBe(
      "Blue's turn - Select a shield to distribute"
    );
    expect(
      getPhaseMessage({ ...createInitialState(), currentPlayer: 'player2' })
    ).toBe("Red's turn - Select a shield to distribute");
  });
});
