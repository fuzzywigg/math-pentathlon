/**
 * Wave 48 — Ramrod selectRod rejects opponent hand leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — select opponent rod', () => {
  it('cannot select player2 rod on player1 turn', () => {
    const s = createInitialState();
    const opp = s.playerRods.player2[0];
    expect(selectRod(s, opp)).toBe(s);
  });
});
