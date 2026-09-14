/**
 * Wave 42 — Remainder performRoll skip when all opponent-owned. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { performRoll, findValidIslands, setSelectedIsland, previewDivision } from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 remainder — roll skip chain', () => {
  it('when all islands opponent-owned, roll skips seat and stays rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // die = 4
    const state = createInitialState();
    const islands = state.islands.map((i) => ({ ...i, owner: 'player2' as const, chips: 1 }));
    const blocked = { ...state, islands, phase: 'rolling' as const };
    expect(findValidIslands(blocked, 8)).toEqual([]);
    const next = performRoll(blocked);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnsRemaining).toBe(state.turnsRemaining - 1);
    expect(next.validIslands).toEqual([]);
  });

  it('normal roll enters selectIsland with valids', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    const next = performRoll(createInitialState());
    expect(next.phase).toBe('selectIsland');
    expect(next.currentRoll?.total).toBe(2);
    expect(next.validIslands.length).toBeGreaterThan(0);
    expect(next.currentPlayer).toBe('player1');
  });

  it('wrong-phase roll identity; preview + select helpers', () => {
    const open = createInitialState();
    const selecting = { ...open, phase: 'selectIsland' as const };
    expect(performRoll(selecting)).toBe(selecting);
    const withRoll = {
      ...open,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
    };
    expect(previewDivision(withRoll, 'missing')).toBeNull();
    expect(previewDivision(open, open.islands[0].id)).toBeNull();
    const prev = previewDivision(withRoll, withRoll.islands[0].id)!;
    expect(prev.dividend).toBe(5);
    expect(prev.divisor).toBe(withRoll.islands[0].value);
    expect(setSelectedIsland(withRoll, withRoll.islands[0].id).selectedIsland).toBe(
      withRoll.islands[0].id
    );
  });
});
