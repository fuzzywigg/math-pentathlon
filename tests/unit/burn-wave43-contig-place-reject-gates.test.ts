/**
 * Wave 43 TOKENMAXX — Contig placeChip reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { placeChip } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — placeChip reject', () => {
  it('rejects wrong phase, missing dice, owned, unknown', () => {
    const base = createInitialState();
    expect(placeChip(base, 1, '1')).toBe(base);

    const calc = { ...base, phase: 'calculating' as const, currentDice: [1, 2, 3] as [number, number, number] };
    expect(placeChip(calc, 9999, 'x')).toBe(calc);

    const cells = new Map(calc.cells);
    cells.set(1, { ...cells.get(1)!, owner: 'player2' });
    const owned = { ...calc, cells };
    expect(placeChip(owned, 1, '1')).toBe(owned);
  });
});
