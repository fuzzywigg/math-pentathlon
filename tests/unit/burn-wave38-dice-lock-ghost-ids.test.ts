/**
 * Wave 38 — lock/unlock ghost ids + immutability leftovers.
 * Beyond wave 35 reroll ghosts. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { rollMultiple, lockDice, unlockDice } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 17) / 17;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 38 dice-lock — ghost ids', () => {
  it('ghost lock ids leave all unlocked and copy rolls', () => {
    const original = rollMultiple('d6', 3);
    const next = lockDice(original, ['ghost-a', 'ghost-b']);
    expect(next).not.toBe(original);
    expect(next.rolls.every((d) => !d.isLocked)).toBe(true);
    expect(next.rolls.map((d) => d.id)).toEqual(original.rolls.map((d) => d.id));
  });

  it('lock then unlock cycle restores unlocked state', () => {
    let result = rollMultiple('d8', 2);
    const ids = result.rolls.map((d) => d.id);
    result = lockDice(result, ids);
    expect(result.rolls.every((d) => d.isLocked)).toBe(true);
    result = unlockDice(result, ids);
    expect(result.rolls.every((d) => !d.isLocked)).toBe(true);
  });

  it('partial lock leaves untargeted dice unchanged', () => {
    const original = rollMultiple('d6', 3);
    const target = original.rolls[1].id;
    const next = lockDice(original, [target]);
    expect(next.rolls[0].isLocked).toBeFalsy();
    expect(next.rolls[1].isLocked).toBe(true);
    expect(next.rolls[2].isLocked).toBeFalsy();
    expect(original.rolls[1].isLocked).toBeFalsy();
  });

  it('unlock ghost ids is a no-op on locked set', () => {
    let result = rollMultiple('d6', 2);
    result = lockDice(
      result,
      result.rolls.map((d) => d.id)
    );
    const after = unlockDice(result, ['nope']);
    expect(after.rolls.every((d) => d.isLocked)).toBe(true);
  });
});
