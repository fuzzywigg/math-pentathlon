/**
 * Wave 32 — isValidSelection min/max/none matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollMultiple,
  selectDice,
  isValidSelection,
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

const dice3: DiceType[] = ['d6', 'd6', 'd6'];

function withSelected(count: number) {
  stubRandom('min');
  const result = rollMultiple('d6', 3);
  if (count === 0) return result;
  const ids = result.rolls.slice(0, count).map((r) => r.id);
  return selectDice(result, ids, true);
}

describe('Wave 32 dice — isValidSelection unconstrained', () => {
  it('always true when min/max omitted', () => {
    for (const n of [0, 1, 2, 3]) {
      expect(isValidSelection(withSelected(n), { dice: dice3 })).toBe(true);
    }
  });
});

describe('Wave 32 dice — isValidSelection min only', () => {
  it.each([
    [0, false],
    [1, false],
    [2, true],
    [3, true],
  ] as const)('count %i with minSelectable=2 → %s', (count, ok) => {
    expect(
      isValidSelection(withSelected(count), {
        dice: dice3,
        minSelectable: 2,
      })
    ).toBe(ok);
  });
});

describe('Wave 32 dice — isValidSelection max only', () => {
  it.each([
    [0, true],
    [1, true],
    [2, true],
    [3, false],
  ] as const)('count %i with maxSelectable=2 → %s', (count, ok) => {
    expect(
      isValidSelection(withSelected(count), {
        dice: dice3,
        maxSelectable: 2,
      })
    ).toBe(ok);
  });
});

describe('Wave 32 dice — isValidSelection exact band', () => {
  it.each([
    [0, false],
    [1, true],
    [2, true],
    [3, false],
  ] as const)('count %i with min=1 max=2 → %s', (count, ok) => {
    expect(
      isValidSelection(withSelected(count), {
        dice: dice3,
        minSelectable: 1,
        maxSelectable: 2,
      })
    ).toBe(ok);
  });

  it('minSelectable=0 treats empty as valid', () => {
    expect(
      isValidSelection(withSelected(0), {
        dice: dice3,
        minSelectable: 0,
        maxSelectable: 3,
      })
    ).toBe(true);
  });
});
