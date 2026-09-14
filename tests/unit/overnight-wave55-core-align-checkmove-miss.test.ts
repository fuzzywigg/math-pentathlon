/**
 * Overnight HEAVY leftover after #250 — checkMoveForWin miss / hit on a 3-in-row.
 * Distinct from wave24 winner matrix happy path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkMoveForWin, createArrayGetter } from '../../src/core/alignment';

describe('Wave 55 core align — checkMoveForWin miss', () => {
  it('isolated drop is not a win; completing a row of 3 is', () => {
    const board = [
      ['X', 'X', null],
      [null, null, null],
      [null, null, null],
    ];
    const get = createArrayGetter(board);
    const cfg = { rows: 3, cols: 3, targetLength: 3 };
    const miss = checkMoveForWin(1, 1, 'X', get, cfg);
    expect(miss.hasWinner).toBe(false);
    expect(miss.winner).toBeNull();
    const hit = checkMoveForWin(0, 2, 'X', get, cfg);
    expect(hit.hasWinner).toBe(true);
    expect(hit.winner).toBe('X');
    expect(hit.alignments[0].length).toBeGreaterThanOrEqual(3);
  });
});
