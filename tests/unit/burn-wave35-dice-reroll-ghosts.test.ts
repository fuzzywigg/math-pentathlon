/**
 * Wave 35 — reroll with ghost / empty / all-locked id lists.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { rollMultiple, lockDice, rerollDice } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 23) / 23;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-reroll-ghosts — no-ops', () => {
  it('empty dieIds returns new id but same values', () => {
    const original = rollMultiple('d6', 3);
    const next = rerollDice(original, []);
    expect(next.id).not.toBe(original.id);
    expect(next.rolls.map((d) => d.value)).toEqual(
      original.rolls.map((d) => d.value)
    );
    expect(next.rolls.map((d) => d.id)).toEqual(
      original.rolls.map((d) => d.id)
    );
  });

  it('ghost ids do not change any die', () => {
    const original = rollMultiple('d6', 2);
    const next = rerollDice(original, ['ghost-a', 'ghost-b']);
    expect(next.rolls.map((d) => [d.id, d.value])).toEqual(
      original.rolls.map((d) => [d.id, d.value])
    );
  });

  it('all locked + all ids listed keeps values', () => {
    let result = rollMultiple('d6', 2);
    result = lockDice(
      result,
      result.rolls.map((d) => d.id)
    );
    const values = result.rolls.map((d) => d.value);
    const next = rerollDice(
      result,
      result.rolls.map((d) => d.id)
    );
    expect(next.rolls.map((d) => d.value)).toEqual(values);
    expect(next.rolls.every((d) => d.isLocked)).toBe(true);
  });
});
