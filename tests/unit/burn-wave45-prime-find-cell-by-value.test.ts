/**
 * Wave 45 — Prime Gold findCellByValue leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, findCellByValue } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — findCellByValue', () => {
  it('finds 1 at spiral center and null for OOB', () => {
    const state = createInitialState();
    const one = findCellByValue(state, 1);
    expect(one?.value).toBe(1);
    expect(one?.row).toBe(3);
    expect(one?.col).toBe(3);
    expect(findCellByValue(state, 99)).toBeNull();
  });
});
