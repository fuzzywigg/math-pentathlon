/**
 * Wave 32 — unknown die id no-ops across lock / unlock / select / reroll.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  lockDice,
  unlockDice,
  selectDice,
  rerollDice,
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

describe('Wave 32 dice — unknown ids', () => {
  it('lockDice with unknown id leaves flags false', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 2);
    const next = lockDice(base, ['nope']);
    expect(next.rolls.every((r) => r.isLocked === false)).toBe(true);
  });

  it('unlockDice with unknown id leaves prior locks', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 2);
    const locked = lockDice(base, [base.rolls[0]!.id]);
    const next = unlockDice(locked, ['ghost']);
    expect(next.rolls[0]!.isLocked).toBe(true);
    expect(next.rolls[1]!.isLocked).toBe(false);
  });

  it('selectDice with unknown id leaves selection empty', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 2);
    const next = selectDice(base, ['ghost'], true);
    expect(next.rolls.every((r) => !r.isSelected)).toBe(true);
  });

  it('rerollDice with unknown id preserves all values', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 3);
    stubRandom('max');
    const next = rerollDice(base, ['ghost']);
    expect(next.rolls.map((r) => r.value)).toEqual(
      base.rolls.map((r) => r.value)
    );
    expect(next.id).not.toBe(base.id);
  });
});
