/**
 * Wave 35 — roller helpers do not mutate input RollResult.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  lockDice,
  unlockDice,
  selectDice,
  clearSelection,
  toggleDiceSelection,
  rerollDice,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 37) / 37;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function snapshot(result: ReturnType<typeof rollMultiple>) {
  return JSON.stringify(result);
}

describe('Wave 35 dice-immutability — pure transforms', () => {
  it('lock/unlock/select/clear/toggle leave original untouched', () => {
    const original = rollMultiple('d6', 3);
    const before = snapshot(original);
    const id = original.rolls[0].id;

    lockDice(original, [id]);
    expect(snapshot(original)).toBe(before);
    unlockDice(original, [id]);
    expect(snapshot(original)).toBe(before);
    selectDice(original, [id], true);
    expect(snapshot(original)).toBe(before);
    clearSelection(original);
    expect(snapshot(original)).toBe(before);
    toggleDiceSelection(original, id);
    expect(snapshot(original)).toBe(before);
  });

  it('rerollDice does not mutate original rolls array', () => {
    const original = rollMultiple('d8', 2);
    const before = snapshot(original);
    rerollDice(original, [original.rolls[0].id]);
    expect(snapshot(original)).toBe(before);
  });
});
