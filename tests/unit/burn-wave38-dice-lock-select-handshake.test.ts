/**
 * Wave 38 — dice lock×select×reroll handshake leftovers.
 * Tests-only after #171.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  roll,
  rollMultiple,
  lockDice,
  unlockDice,
  rerollDice,
  selectDice,
  getSelectedTotal,
  clearSelection,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 3) % 89;
    return n / 89;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 38 dice-handshake — lock protects across select/reroll', () => {
  it('locked die keeps value through reroll-all-ids', () => {
    let result = rollMultiple('d20', 3);
    const [a, b, c] = result.rolls.map((d) => d.id);
    const lockedVal = result.rolls[0].value;
    result = lockDice(result, [a]);
    result = rerollDice(result, [a, b, c]);
    expect(result.rolls.find((d) => d.id === a)?.value).toBe(lockedVal);
    expect(result.rolls.find((d) => d.id === a)?.isLocked).toBe(true);
  });

  it('selection survives lock/unlock of other dice', () => {
    let result = roll('d6', 'd6', 'd8');
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, [ids[0], ids[2]], true);
    const selectedTotal = getSelectedTotal(result);
    result = lockDice(result, [ids[1]]);
    result = unlockDice(result, [ids[1]]);
    expect(getSelectedTotal(result)).toBe(selectedTotal);
    expect(result.rolls.filter((d) => d.isSelected)).toHaveLength(2);
  });

  it('clearSelection does not clear locks', () => {
    let result = rollMultiple('d6', 2);
    const [a] = result.rolls.map((d) => d.id);
    result = lockDice(result, [a]);
    result = selectDice(result, [a], true);
    result = clearSelection(result);
    expect(result.rolls[0].isSelected).toBe(false);
    expect(result.rolls[0].isLocked).toBe(true);
  });

  it('total always equals sum of current face values after lock/reroll', () => {
    let result = rollMultiple('d12', 4);
    const [a, b] = result.rolls.map((d) => d.id);
    result = lockDice(result, [a]);
    result = rerollDice(result, [b]);
    expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
  });
});
