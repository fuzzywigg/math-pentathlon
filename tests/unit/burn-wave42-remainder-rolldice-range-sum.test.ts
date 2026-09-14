/** Wave 42 — Remainder rollDice range and sum. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { rollDice } from '../../src/games/remainder-islands/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 remainder — rollDice range sum', () => {
  it('dice faces are integers in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const roll = rollDice();
    expect(roll.die1).toBeGreaterThanOrEqual(1);
    expect(roll.die1).toBeLessThanOrEqual(6);
    expect(roll.die2).toBeGreaterThanOrEqual(1);
    expect(roll.die2).toBeLessThanOrEqual(6);
  });

  it('total equals die1 + die2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const roll = rollDice();
    expect(roll.total).toBe(roll.die1 + roll.die2);
  });

  it('random 0 → both dice are 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const roll = rollDice();
    expect(roll).toEqual({ die1: 1, die2: 1, total: 2 });
  });

  it('random just under 1 → both dice are 6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const roll = rollDice();
    expect(roll.die1).toBe(6);
    expect(roll.die2).toBe(6);
    expect(roll.total).toBe(12);
  });

  it('mixed random sequence yields distinct faces', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0).mockReturnValueOnce(0.5);
    const roll = rollDice();
    expect(roll.die1).toBe(1);
    expect(roll.die2).toBe(4); // floor(0.5*6)+1 = 4
    expect(roll.total).toBe(5);
  });
});
