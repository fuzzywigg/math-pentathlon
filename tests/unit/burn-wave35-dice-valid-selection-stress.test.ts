/**
 * Wave 35 — isValidSelection stress across min/max matrices.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  clearSelection,
  isValidSelection,
  type DiceType,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 29) / 29;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-valid — min/max grid', () => {
  it('enumerates selectedCount vs bounds for 5 dice', () => {
    const dice: DiceType[] = ['d6', 'd6', 'd6', 'd6', 'd6'];
    let result = rollMultiple('d6', 5);
    for (let min = 0; min <= 5; min++) {
      for (let max = min; max <= 5; max++) {
        for (let count = 0; count <= 5; count++) {
          result = clearSelection(result);
          const ids = result.rolls.slice(0, count).map((d) => d.id);
          result = selectDice(result, ids, true);
          const ok = isValidSelection(result, {
            dice,
            minSelectable: min,
            maxSelectable: max,
          });
          expect(ok).toBe(count >= min && count <= max);
        }
      }
    }
  });

  it('undefined bounds always valid regardless of selection size', () => {
    let result = rollMultiple('d10', 3);
    const dice: DiceType[] = ['d10', 'd10', 'd10'];
    expect(isValidSelection(result, { dice })).toBe(true);
    result = selectDice(
      result,
      result.rolls.map((d) => d.id),
      true
    );
    expect(isValidSelection(result, { dice })).toBe(true);
  });
});
