/**
 * Wave 48 — Remainder countOwnedIslands. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { countOwnedIslands } from '../../src/games/remainder-islands/rules';

describe('Wave 48 remainder — owned counts', () => {
  it('counts owners after synthetic claims', () => {
    const s = createInitialState();
    expect(countOwnedIslands(s)).toEqual({ player1: 0, player2: 0 });
    const islands = s.islands.map((i, idx) =>
      idx === 0 ? { ...i, owner: 'player1' as const } : idx === 1 ? { ...i, owner: 'player2' as const } : i
    );
    expect(countOwnedIslands({ ...s, islands })).toEqual({ player1: 1, player2: 1 });
  });
});
