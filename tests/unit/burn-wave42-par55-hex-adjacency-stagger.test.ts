/** Wave 42 — Par 55 odd vs even row hex neighbor sets. Tests-only. */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { createBaseId, CONFIG } from '../../src/games/par-55/types';

describe('Wave 42 par55 — hex adjacency stagger', () => {
  it('even-row interior uses even-row neighbor offsets', () => {
    const state = createInitialState();
    const row = 2; // even
    const col = 3;
    const base = state.bases.get(createBaseId(row, col))!;
    expect(base).toBeTruthy();
    const expected = [
      createBaseId(row - 1, col - 1),
      createBaseId(row - 1, col),
      createBaseId(row, col - 1),
      createBaseId(row, col + 1),
      createBaseId(row + 1, col - 1),
      createBaseId(row + 1, col),
    ].filter((id) => state.bases.has(id));
    expect([...base.adjacentBases].sort()).toEqual([...expected].sort());
  });

  it('odd-row interior uses odd-row neighbor offsets', () => {
    const state = createInitialState();
    const row = 1; // odd
    const col = 2;
    const base = state.bases.get(createBaseId(row, col))!;
    expect(base).toBeTruthy();
    const expected = [
      createBaseId(row - 1, col),
      createBaseId(row - 1, col + 1),
      createBaseId(row, col - 1),
      createBaseId(row, col + 1),
      createBaseId(row + 1, col),
      createBaseId(row + 1, col + 1),
    ].filter((id) => state.bases.has(id));
    expect([...base.adjacentBases].sort()).toEqual([...expected].sort());
  });

  it('odd and even neighbor sets differ at same col', () => {
    const state = createInitialState();
    const even = state.bases.get(createBaseId(2, 2))!;
    const odd = state.bases.get(createBaseId(1, 2))!;
    expect([...even.adjacentBases].sort().join('|')).not.toBe(
      [...odd.adjacentBases].sort().join('|')
    );
  });

  it('odd rows have one fewer column than even rows', () => {
    const state = createInitialState();
    for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
      const cols = [...state.bases.values()].filter((b) => b.row === row).length;
      const expected =
        row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
      expect(cols).toBe(expected);
    }
  });

  it('corner even-row base has fewer than 6 neighbors', () => {
    const state = createInitialState();
    const corner = state.bases.get(createBaseId(0, 0))!;
    expect(corner.adjacentBases.length).toBeLessThan(6);
    expect(corner.adjacentBases.every((id) => state.bases.has(id))).toBe(true);
  });
});
