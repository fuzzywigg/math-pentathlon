/**
 * Wave 41 — Remainder Islands findValidIslands ownership filter matrix.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  findValidIslands,
  performRoll,
  selectIsland,
} from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 remainder — findValidIslands matrix', () => {
  it('opening: all islands valid for player1', () => {
    const state = createInitialState();
    const ids = findValidIslands(state, 7);
    expect(ids).toHaveLength(state.islands.length);
    expect(ids).toEqual(state.islands.map((i) => i.id));
  });

  it('opponent-owned excluded; own-owned still valid', () => {
    const state = createInitialState();
    const islands = state.islands.map((island, idx) => {
      if (idx === 0) return { ...island, owner: 'player2' as const };
      if (idx === 1) return { ...island, owner: 'player1' as const };
      return island;
    });
    const forged = { ...state, islands };
    const ids = findValidIslands(forged, 9);
    expect(ids).not.toContain(islands[0].id);
    expect(ids).toContain(islands[1].id);
    expect(ids.length).toBe(state.islands.length - 1);
  });

  it('all opponent-owned → empty; performRoll skips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    for (const island of state.islands) {
      island.owner = 'player2';
    }
    expect(findValidIslands(state, 8)).toEqual([]);
    const next = performRoll(state);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnsRemaining).toBe(state.turnsRemaining - 1);
  });

  it('player2 seat sees player1-owned as blocked', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    const islands = state.islands.map((island, idx) =>
      idx < 2 ? { ...island, owner: 'player1' as const } : island
    );
    const forged = { ...state, islands };
    const ids = findValidIslands(forged, 6);
    expect(ids).not.toContain(islands[0].id);
    expect(ids).not.toContain(islands[1].id);
    expect(ids.length).toBe(state.islands.length - 2);
    void selectIsland;
  });
});
