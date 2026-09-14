/**
 * Wave 32 — full roller handshake montage (roll → select → lock → reroll → validate).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  selectDice,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  lockDice,
  unlockDice,
  rerollDice,
  clearSelection,
  getAllPossibleSums,
  getTwoDiceResults,
  getDiceConfig,
  type DiceType,
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

describe('Wave 32 dice — handshake montage', () => {
  it('plays a Contig-like 2d6 select-one then lock flow', () => {
    stubRandom('min');
    const dice: DiceType[] = ['d6', 'd6'];
    let result = rollDice({ dice, minSelectable: 1, maxSelectable: 1 });
    expect(result.total).toBe(2);

    expect(
      isValidSelection(result, { dice, minSelectable: 1, maxSelectable: 1 })
    ).toBe(false);

    result = selectDice(result, [result.rolls[0]!.id], true);
    expect(
      isValidSelection(result, { dice, minSelectable: 1, maxSelectable: 1 })
    ).toBe(true);
    expect(getSelectedValues(result)).toEqual([1]);
    expect(getSelectedTotal(result)).toBe(1);

    result = lockDice(result, [result.rolls[0]!.id]);
    stubRandom('max');
    result = rerollDice(
      result,
      result.rolls.map((r) => r.id)
    );
    expect(result.rolls[0]!.value).toBe(1);
    expect(result.rolls[1]!.value).toBe(6);
    expect(result.total).toBe(7);

    result = unlockDice(result, [result.rolls[0]!.id]);
    result = clearSelection(result);
    expect(result.rolls.every((r) => !r.isSelected && !r.isLocked)).toBe(true);
  });

  it('ties selected sum into possible-sums + two-dice map', () => {
    stubRandom('min');
    let result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    // all ones
    const possible = getAllPossibleSums(result.rolls.map((r) => r.value));
    expect(possible).toEqual([1, 2, 3]);

    result = selectDice(
      result,
      result.rolls.map((r) => r.id),
      true
    );
    expect(possible).toContain(getSelectedTotal(result));

    const pair = getTwoDiceResults(
      result.rolls[0]!.value,
      result.rolls[1]!.value
    );
    expect(pair.get('1 + 1')).toBe(2);
    expect(getDiceConfig('d6').faces).toBe(6);
  });
});
