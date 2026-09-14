/**
 * Wave 32 — roller structural immutability / isolation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  lockDice,
  unlockDice,
  selectDice,
  clearSelection,
  toggleDiceSelection,
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

describe('Wave 32 dice — mutators leave prior result intact', () => {
  it('lock / unlock / select / clear / toggle do not mutate prior rolls', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 3);
    const snap = structuredClone(base);

    const locked = lockDice(base, [base.rolls[0]!.id]);
    const unlocked = unlockDice(locked, [base.rolls[0]!.id]);
    const selected = selectDice(unlocked, [base.rolls[1]!.id], true);
    const toggled = toggleDiceSelection(selected, base.rolls[2]!.id);
    const cleared = clearSelection(toggled);

    expect(base).toEqual(snap);
    expect(locked.rolls[0]!.isLocked).toBe(true);
    expect(unlocked.rolls[0]!.isLocked).toBe(false);
    expect(selected.rolls[1]!.isSelected).toBe(true);
    expect(toggled.rolls[2]!.isSelected).toBe(true);
    expect(cleared.rolls.every((r) => !r.isSelected)).toBe(true);
  });

  it('rerollDice replaces only requested unlocked die object identity', () => {
    stubRandom('min');
    const base = rollMultiple('d6', 3);
    const keep0 = base.rolls[0]!;
    const keep2 = base.rolls[2]!;
    stubRandom('max');
    const next = rerollDice(base, [base.rolls[1]!.id]);
    expect(next.rolls[0]).toBe(keep0);
    expect(next.rolls[2]).toBe(keep2);
    expect(next.rolls[1]).not.toBe(base.rolls[1]);
    expect(next.rolls[1]!.value).toBe(6);
  });
});
