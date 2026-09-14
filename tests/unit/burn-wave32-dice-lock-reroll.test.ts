/**
 * Wave 32 — lock / unlock / reroll edge matrix.
 * Deepens wave 27 lock smoke into multi-die / partial-id / no-op cases.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  lockDice,
  unlockDice,
  rerollDice,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice-lock — selective lock/unlock', () => {
  it('locking unknown ids is a no-op on lock flags', () => {
    const base = rollMultiple('d6', 3);
    const locked = lockDice(base, ['missing-id']);
    expect(locked.rolls.every((d) => !d.isLocked)).toBe(true);
    expect(locked.rolls.map((d) => d.value)).toEqual(
      base.rolls.map((d) => d.value)
    );
  });

  it('lock then unlock subset leaves others unlocked', () => {
    let result = rollMultiple('d6', 4);
    const [a, b] = result.rolls.map((d) => d.id);
    result = lockDice(result, [a, b]);
    expect(result.rolls.filter((d) => d.isLocked)).toHaveLength(2);
    result = unlockDice(result, [a]);
    expect(result.rolls.find((d) => d.id === a)?.isLocked).toBe(false);
    expect(result.rolls.find((d) => d.id === b)?.isLocked).toBe(true);
  });

  it('lock is immutable — original result unchanged', () => {
    const base = rollMultiple('d6', 2);
    const locked = lockDice(base, [base.rolls[0].id]);
    expect(base.rolls[0].isLocked).toBe(false);
    expect(locked.rolls[0].isLocked).toBe(true);
    expect(locked).not.toBe(base);
  });
});

describe('Wave 32 dice-lock — reroll respects locks', () => {
  it('rerolling all ids keeps locked values and refreshes unlocked', () => {
    let result = rollMultiple('d6', 3);
    const lockedId = result.rolls[1].id;
    const lockedValue = result.rolls[1].value;
    result = lockDice(result, [lockedId]);

    // Force next rolls away from prior sequence
    let n = 7;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n = (n + 1) % 10;
      return n / 10;
    });

    const before = result.rolls.map((d) => ({ id: d.id, value: d.value }));
    result = rerollDice(
      result,
      result.rolls.map((d) => d.id)
    );

    // Locked die keeps same id + value (not replaced by rollDie)
    const lockedAfter = result.rolls.find((d) => d.id === lockedId);
    expect(lockedAfter?.value).toBe(lockedValue);
    expect(lockedAfter?.isLocked).toBe(true);

    // Unlocked dice are replaced via rollDie → new ids
    const unlockedChanged = result.rolls.some(
      (d, i) => !d.isLocked && d.id !== before[i].id
    );
    expect(unlockedChanged).toBe(true);
    expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
  });

  it('reroll with empty id list returns same values with new result id', () => {
    const base = rollMultiple('d6', 2);
    const next = rerollDice(base, []);
    expect(next.rolls.map((d) => d.value)).toEqual(
      base.rolls.map((d) => d.value)
    );
    expect(next.id).not.toBe(base.id);
  });
});
