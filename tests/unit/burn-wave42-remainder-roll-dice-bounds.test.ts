/**
 * Wave 42 — Remainder Islands rollDice face/total bounds.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice } from '../../src/games/remainder-islands/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 remainder — rollDice bounds', () => {
  it('seeded lows yield 1+1=2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const roll = rollDice();
    expect(roll.die1).toBe(1);
    expect(roll.die2).toBe(1);
    expect(roll.total).toBe(2);
  });

  it('seeded highs yield 6+6=12', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const roll = rollDice();
    expect(roll.die1).toBe(6);
    expect(roll.die2).toBe(6);
    expect(roll.total).toBe(12);
  });

  it('many rolls stay in 1–6 with total = die1+die2', () => {
    const seq = [0.0, 0.16, 0.33, 0.49, 0.66, 0.83, 0.99, 0.2, 0.4, 0.6];
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i % seq.length];
      i++;
      return v;
    });
    for (let n = 0; n < 20; n++) {
      const roll = rollDice();
      expect(roll.die1).toBeGreaterThanOrEqual(1);
      expect(roll.die1).toBeLessThanOrEqual(6);
      expect(roll.die2).toBeGreaterThanOrEqual(1);
      expect(roll.die2).toBeLessThanOrEqual(6);
      expect(roll.total).toBe(roll.die1 + roll.die2);
    }
  });
});
