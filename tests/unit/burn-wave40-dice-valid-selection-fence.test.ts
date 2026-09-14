/**
 * Wave 40 — isValidSelection min/max fence leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  clearSelection,
  isValidSelection,
} from '../../src/core/dice';
import type { RollConfig } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 97;
    return n / 97;
  });
});
afterEach(() => vi.restoreAllMocks());

describe('Wave 40 dice — valid selection fence', () => {
  it('minSelectable rejects empty; maxSelectable rejects over-select', () => {
    let result = rollMultiple('d6', 3);
    const cfg: RollConfig = {
      dice: ['d6', 'd6', 'd6'],
      minSelectable: 1,
      maxSelectable: 2,
    };

    result = clearSelection(result);
    expect(isValidSelection(result, cfg)).toBe(false);

    result = selectDice(result, [result.rolls[0].id], true);
    expect(isValidSelection(result, cfg)).toBe(true);

    result = selectDice(
      result,
      result.rolls.map((d) => d.id),
      true
    );
    expect(isValidSelection(result, cfg)).toBe(false);
  });
});
