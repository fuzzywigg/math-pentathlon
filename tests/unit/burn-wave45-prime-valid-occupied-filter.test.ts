/**
 * Wave 45 — Prime Gold getValidPlacements occupied filter leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements, findCellByValue } from '../../src/games/prime-gold/rules';

describe('Wave 45 prime — occupied filter', () => {
  it('drops owned cell values from valids', () => {
    let state = createInitialState();
    state = { ...state, phase: 'placing', diceRoll: { die1: 1, die2: 1, die3: 1 } };
    const before = getValidPlacements(state);
    expect(before.length).toBeGreaterThan(0);
    const target = before[0].value;
    const cell = findCellByValue(state, target)!;
    const cells = new Map(state.cells);
    cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    const after = getValidPlacements({ ...state, cells });
    expect(after.every((p) => p.value !== target)).toBe(true);
  });

  it('empty when not placing', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });
});
