/**
 * Wave 35 — lock → unlock → reroll lifecycle leftovers.
 * Distinct from wave32 lock-reroll. Tests-only.
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
    return (n % 97) / 97;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-unlock — unlock restores rerollability', () => {
  it('locked die survives reroll; unlock then reroll changes value id', () => {
    let result = rollMultiple('d6', 3);
    const target = result.rolls[1];
    result = lockDice(result, [target.id]);
    const before = result.rolls[1].value;
    result = rerollDice(
      result,
      result.rolls.map((d) => d.id)
    );
    expect(result.rolls[1].id).toBe(target.id);
    expect(result.rolls[1].value).toBe(before);
    expect(result.rolls[1].isLocked).toBe(true);

    result = unlockDice(result, [target.id]);
    expect(result.rolls[1].isLocked).toBe(false);
    const unlockedId = result.rolls[1].id;
    result = rerollDice(result, [unlockedId]);
    // new DieRoll from rollDie → new id
    expect(result.rolls[1].id).not.toBe(unlockedId);
    expect(result.rolls[1].isLocked).toBe(false);
  });

  it('unlock on unknown ids is a no-op for locks', () => {
    let result = rollMultiple('d8', 2);
    result = lockDice(result, [result.rolls[0].id]);
    result = unlockDice(result, ['ghost', 'nope']);
    expect(result.rolls[0].isLocked).toBe(true);
    expect(result.rolls[1].isLocked).toBe(false);
  });
});

describe('Wave 35 dice-unlock — double lock/unlock idempotent', () => {
  it('locking twice then unlocking once clears lock', () => {
    let result = rollMultiple('d4', 2);
    const id = result.rolls[0].id;
    result = lockDice(result, [id]);
    result = lockDice(result, [id]);
    expect(result.rolls[0].isLocked).toBe(true);
    result = unlockDice(result, [id]);
    expect(result.rolls[0].isLocked).toBe(false);
    result = unlockDice(result, [id]);
    expect(result.rolls[0].isLocked).toBe(false);
  });
});
