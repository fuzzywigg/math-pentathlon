/**
 * Wave 45 — Prime Gold rollDice phase gate leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import { DICE_CONFIG } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — rollDice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('roll advances to placing with dice in face bounds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = rollDice(createInitialState());
    expect(next.phase).toBe('placing');
    expect(next.diceRoll!.die1).toBe(DICE_CONFIG.die1.min);
    expect(next.diceRoll!.die2).toBe(DICE_CONFIG.die2.min);
    expect(next.diceRoll!.die3).toBe(DICE_CONFIG.die3.min);
  });

  it('roll is identity outside rolling phase', () => {
    const state = createInitialState();
    const placing = { ...state, phase: 'placing' as const, diceRoll: { die1: 1, die2: 1, die3: 1 } };
    expect(rollDice(placing)).toBe(placing);
  });
});
