/**
 * Wave 35 — RollResult.total invariant across transforms.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  roll,
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
    return (n % 19) / 19;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function assertTotal(result: ReturnType<typeof roll>) {
  expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
}

describe('Wave 35 dice-total — conserved under non-reroll transforms', () => {
  it('lock/select/clear/toggle preserve total', () => {
    let result = roll('d6', 'd8', 'd10');
    assertTotal(result);
    const total = result.total;
    result = lockDice(result, [result.rolls[0].id]);
    expect(result.total).toBe(total);
    assertTotal(result);
    result = selectDice(result, [result.rolls[1].id], true);
    expect(result.total).toBe(total);
    result = toggleDiceSelection(result, result.rolls[2].id);
    expect(result.total).toBe(total);
    result = clearSelection(result);
    expect(result.total).toBe(total);
    result = unlockDice(result, [result.rolls[0].id]);
    expect(result.total).toBe(total);
  });

  it('reroll recomputes total from new faces', () => {
    let result = roll('d6', 'd6', 'd6');
    result = rerollDice(result, [result.rolls[0].id]);
    assertTotal(result);
  });
});
