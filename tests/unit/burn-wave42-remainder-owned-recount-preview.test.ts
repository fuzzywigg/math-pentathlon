/**
 * Wave 42 — Remainder owned recount after multi-claim + preview. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  selectIsland,
  countOwnedIslands,
  previewDivision,
  findValidIslands,
} from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — owned recount', () => {
  it('two claims update ownership counts; own islands stay valid', () => {
    let s = createInitialState();
    const a = s.islands[0].id;
    const b = s.islands[1].id;
    s = {
      ...s,
      phase: 'selectIsland',
      currentRoll: { die1: 3, die2: 4, total: 7 },
      validIslands: [a, b],
    };
    s = selectIsland(s, a);
    expect(countOwnedIslands(s)).toEqual({ player1: 1, player2: 0 });
    // p2 turn
    s = {
      ...s,
      phase: 'selectIsland',
      currentRoll: { die1: 2, die2: 2, total: 4 },
      validIslands: findValidIslands(s, 4),
    };
    expect(s.validIslands).not.toContain(a); // owned by p1
    expect(s.validIslands).toContain(b);
    const prev = previewDivision(s, b)!;
    expect(prev.remainder).toBe(4 % s.islands.find((i) => i.id === b)!.value);
  });
});
