/**
 * Wave 42 — Prime Gold rollDice seeded leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import { DICE_CONFIG } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — rollDice seeded', () => {
  it('phase gate: identity when not rolling', () => {
    const base = createInitialState();
    const placing = { ...base, phase: 'placing' as const, diceRoll: { die1: 1, die2: 2, die3: 3 } };
    const over = { ...base, phase: 'gameOver' as const, winner: 'player2' as const };
    expect(rollDice(placing)).toBe(placing);
    expect(rollDice(over)).toBe(over);
  });

  it('seeded Math.random(0) yields minimum face on each die', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = rollDice(createInitialState());
    expect(next.phase).toBe('placing');
    expect(next.diceRoll).toEqual({
      die1: DICE_CONFIG.die1.min,
      die2: DICE_CONFIG.die2.min,
      die3: DICE_CONFIG.die3.min,
    });
  });

  it('seeded Math.random(0.99) yields maximum face on each die', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const next = rollDice(createInitialState());
    expect(next.diceRoll).toEqual({
      die1: DICE_CONFIG.die1.max,
      die2: DICE_CONFIG.die2.max,
      die3: DICE_CONFIG.die3.max,
    });
  });

  it('does not mutate the input state object', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const snapshot = { ...state, diceRoll: state.diceRoll };
    rollDice(state);
    expect(state.phase).toBe(snapshot.phase);
    expect(state.diceRoll).toBeNull();
  });
});
