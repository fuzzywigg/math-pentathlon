/** Wave 42 — Remainder performRoll wrong-phase identity. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  performRoll,
  selectIsland,
} from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 remainder — performRoll wrong phase', () => {
  it('performRoll identity when phase is selectIsland', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: ['island-0-0'],
    };
    expect(performRoll(state)).toBe(state);
  });

  it('performRoll identity when phase is gameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(performRoll(over)).toBe(over);
  });

  it('performRoll from rolling advances to selectIsland when valids exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    const next = performRoll(state);
    expect(next).not.toBe(state);
    expect(next.currentRoll).not.toBeNull();
    expect(next.phase).toBe('selectIsland');
    expect(next.validIslands.length).toBeGreaterThan(0);
  });

  it('selectIsland then performRoll on resulting rolling is allowed again', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = performRoll(createInitialState());
    const islandId = state.validIslands[0];
    state = selectIsland(state, islandId);
    expect(state.phase).toBe('rolling');
    const again = performRoll(state);
    expect(again.phase).toBe('selectIsland');
    expect(again.currentRoll).not.toBeNull();
  });
});
