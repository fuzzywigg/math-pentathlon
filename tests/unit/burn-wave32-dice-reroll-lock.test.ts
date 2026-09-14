/**
 * Wave 32 — rerollDice × lockDice / unlockDice interaction matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  rerollDice,
  lockDice,
  unlockDice,
} from '../../src/core/dice';

function stubRandom(kind: 'min' | 'max' | 'mid' = 'min'): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    if (kind === 'min') return (i % 10_000) * 1e-7;
    if (kind === 'mid') return 0.5 + (i % 100) * 1e-9;
    return 0.999999 - (i % 10_000) * 1e-12;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice — lock / unlock immutability', () => {
  it('lockDice does not mutate source rolls array', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 3);
    const locked = lockDice(original, [original.rolls[0]!.id]);
    expect(original.rolls[0]!.isLocked).toBe(false);
    expect(locked.rolls[0]!.isLocked).toBe(true);
    expect(locked.rolls).not.toBe(original.rolls);
    expect(locked.id).toBe(original.id);
    expect(locked.total).toBe(original.total);
  });

  it('unlockDice clears only requested ids', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 3);
    const ids = original.rolls.map((r) => r.id);
    const locked = lockDice(original, ids);
    const unlocked = unlockDice(locked, [ids[1]!]);
    expect(unlocked.rolls.map((r) => r.isLocked)).toEqual([true, false, true]);
  });
});

describe('Wave 32 dice — reroll respects locks', () => {
  it('rerolls unlocked targets and assigns a new result id', () => {
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      // first batch: near-zero → value 1 + unique ids; later near-one → max face
      call += 1;
      if (call <= 7) return call * 1e-7; // 3 dice × (value+id) + result id
      return 0.999999 - call * 1e-12;
    });
    const original = rollMultiple('d6', 3);
    expect(original.rolls.every((r) => r.value === 1)).toBe(true);
    const target = original.rolls[1]!.id;
    expect(target.length).toBeGreaterThan(0);
    const rerolled = rerollDice(original, [target]);
    expect(rerolled.id).not.toBe(original.id);
    expect(rerolled.rolls[0]!.value).toBe(1);
    expect(rerolled.rolls[1]!.value).toBe(6);
    expect(rerolled.rolls[2]!.value).toBe(1);
    expect(rerolled.total).toBe(8);
  });

  it('locked die keeps value even when listed for reroll', () => {
    stubRandom('min');
    let result = rollMultiple('d6', 2);
    const lockedId = result.rolls[0]!.id;
    const lockedValue = result.rolls[0]!.value;
    result = lockDice(result, [lockedId]);
    stubRandom('max');
    result = rerollDice(
      result,
      result.rolls.map((r) => r.id)
    );
    expect(result.rolls[0]!.value).toBe(lockedValue);
    expect(result.rolls[0]!.id).toBe(lockedId);
    expect(result.rolls[1]!.value).toBe(6);
  });

  it('empty dieIds list is identity on values/total (new id)', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 2);
    const rerolled = rerollDice(original, []);
    expect(rerolled.rolls.map((r) => r.value)).toEqual(
      original.rolls.map((r) => r.value)
    );
    expect(rerolled.total).toBe(original.total);
    expect(rerolled.id).not.toBe(original.id);
  });
});
