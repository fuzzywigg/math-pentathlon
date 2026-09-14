/**
 * Wave 32 — lock × selection cohabitation (flags independent).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  lockDice,
  unlockDice,
  selectDice,
  toggleDiceSelection,
  clearSelection,
  getSelectedTotal,
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

describe('Wave 32 dice — lock and selection independence', () => {
  it('locking does not clear selection; selecting does not lock', () => {
    stubRandom('min');
    let result = rollMultiple('d6', 3);
    const ids = result.rolls.map((r) => r.id);
    result = selectDice(result, [ids[0]!, ids[1]!], true);
    result = lockDice(result, [ids[1]!]);
    expect(result.rolls.map((r) => r.isSelected)).toEqual([true, true, false]);
    expect(result.rolls.map((r) => r.isLocked)).toEqual([false, true, false]);
    expect(getSelectedTotal(result)).toBe(2);
  });

  it('clearSelection preserves locks; unlock preserves selection', () => {
    stubRandom('min');
    let result = rollMultiple('d6', 2);
    const ids = result.rolls.map((r) => r.id);
    result = selectDice(result, ids, true);
    result = lockDice(result, [ids[0]!]);
    result = clearSelection(result);
    expect(result.rolls.every((r) => !r.isSelected)).toBe(true);
    expect(result.rolls[0]!.isLocked).toBe(true);
    result = selectDice(result, [ids[1]!], true);
    result = unlockDice(result, [ids[0]!]);
    expect(result.rolls[1]!.isSelected).toBe(true);
    expect(result.rolls[0]!.isLocked).toBe(false);
  });

  it('toggle on locked die still flips selection flag', () => {
    stubRandom('min');
    let result = rollMultiple('d6', 1);
    const id = result.rolls[0]!.id;
    result = lockDice(result, [id]);
    result = toggleDiceSelection(result, id);
    expect(result.rolls[0]!.isLocked).toBe(true);
    expect(result.rolls[0]!.isSelected).toBe(true);
  });

  it('reroll of unlocked selected die replaces selection flag to false', () => {
    stubRandom('min');
    let result = rollMultiple('d6', 2);
    const ids = result.rolls.map((r) => r.id);
    result = selectDice(result, ids, true);
    stubRandom('max');
    result = rerollDice(result, [ids[0]!]);
    // New die from rollDie starts unselected
    expect(result.rolls[0]!.isSelected).toBe(false);
    expect(result.rolls[1]!.isSelected).toBe(true);
    expect(result.rolls[0]!.value).toBe(6);
  });
});
