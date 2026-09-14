/**
 * Wave 46 — Prime Gold rollDice max faces leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import { DICE_CONFIG } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — roll max faces', () => {
  afterEach(() => vi.restoreAllMocks());

  it('random≈1 yields max faces on each die', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const next = rollDice(createInitialState());
    expect(next.diceRoll!.die1).toBe(DICE_CONFIG.die1.max);
    expect(next.diceRoll!.die2).toBe(DICE_CONFIG.die2.max);
    expect(next.diceRoll!.die3).toBe(DICE_CONFIG.die3.max);
  });
});
