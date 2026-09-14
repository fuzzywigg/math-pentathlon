/**
 * Wave 41 — Remainder Islands performRoll skip when all opponent-owned.
 * TOKENMAXX HEAVY leftovers — third parallel. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  selectIsland,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 remainder — opponent skip turn', () => {
  it('findValidIslands excludes opponent-owned only', () => {
    const state = createInitialState();
    const forged = {
      ...state,
      islands: state.islands.map((i, idx) =>
        idx === 0 ? { ...i, owner: 'player2' as const } : { ...i, owner: null }
      ),
    };
    const valids = findValidIslands(forged, 7);
    expect(valids).not.toContain(state.islands[0].id);
    expect(valids.length).toBe(state.islands.length - 1);
  });

  it('performRoll with all opponent islands flips seat and stays rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const blocked = {
      ...state,
      islands: state.islands.map((i) => ({ ...i, owner: 'player2' as const })),
      turnsRemaining: 5,
    };
    const next = performRoll(blocked);
    expect(next.validIslands).toEqual([]);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnsRemaining).toBe(4);
  });

  it('countOwnedIslands tallies both seats', () => {
    const state = createInitialState();
    const owned = {
      ...state,
      islands: state.islands.map((i, idx) => ({
        ...i,
        owner: (idx % 2 === 0 ? 'player1' : 'player2') as 'player1' | 'player2',
      })),
    };
    const counts = countOwnedIslands(owned);
    expect(counts.player1 + counts.player2).toBe(owned.islands.length);
  });

  it('selectIsland ghost id listed in validIslands but missing island → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      validIslands: ['ghost-island'],
    };
    expect(selectIsland(state, 'ghost-island')).toBe(state);
  });
});
