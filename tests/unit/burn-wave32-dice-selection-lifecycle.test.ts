/**
 * Wave 32 — toggle / select / clearSelection lifecycle.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  toggleDiceSelection,
  selectDice,
  clearSelection,
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

describe('Wave 32 dice — toggleDiceSelection', () => {
  it('toggles one die without touching siblings', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 3);
    const mid = original.rolls[1]!.id;
    const once = toggleDiceSelection(original, mid);
    expect(once.rolls.map((r) => r.isSelected)).toEqual([false, true, false]);
    const twice = toggleDiceSelection(once, mid);
    expect(twice.rolls.map((r) => r.isSelected)).toEqual([false, false, false]);
    expect(original.rolls.every((r) => !r.isSelected)).toBe(true);
  });

  it('unknown dieId leaves selection unchanged', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 2);
    const next = toggleDiceSelection(original, 'missing-id');
    expect(next.rolls.map((r) => r.isSelected)).toEqual([false, false]);
    expect(next.rolls).not.toBe(original.rolls);
  });
});

describe('Wave 32 dice — selectDice batch', () => {
  it('selects a subset then deselects one', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 4);
    const ids = original.rolls.map((r) => r.id);
    const selected = selectDice(original, [ids[0]!, ids[2]!], true);
    expect(selected.rolls.map((r) => r.isSelected)).toEqual([
      true,
      false,
      true,
      false,
    ]);
    const deselected = selectDice(selected, [ids[0]!], false);
    expect(deselected.rolls.map((r) => r.isSelected)).toEqual([
      false,
      false,
      true,
      false,
    ]);
  });

  it('selectDice with empty ids is a no-op on flags', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 2);
    const next = selectDice(original, [], true);
    expect(next.rolls.every((r) => !r.isSelected)).toBe(true);
  });
});

describe('Wave 32 dice — clearSelection', () => {
  it('clears all flags after full select', () => {
    stubRandom('min');
    const original = rollMultiple('d6', 3);
    const ids = original.rolls.map((r) => r.id);
    const selected = selectDice(original, ids, true);
    const cleared = clearSelection(selected);
    expect(cleared.rolls.every((r) => r.isSelected === false)).toBe(true);
    expect(selected.rolls.every((r) => r.isSelected)).toBe(true);
  });
});
