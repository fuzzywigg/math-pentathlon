/**
 * Wave 42 — FIAR placeChip history monotonic + move numbers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { placeChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

describe('Wave 42 fiar — history monotonic', () => {
  it('four places assign increasing moveNumbers', () => {
    let s = createInitialState();
    for (const id of ['c2r1', 'c2r2', 'c3r1', 'c3r2']) {
      s = placeChip(s, id);
    }
    expect(s.moveHistory.map((m) => m.moveNumber)).toEqual([1, 2, 3, 4]);
    expect(s.moveHistory.every((m) => m.type === 'place')).toBe(true);
    expect(s.moveHistory[0].player).toBe('player1');
    expect(s.moveHistory[1].player).toBe('player2');
  });
});
