/**
 * Wave 42 — Remainder Islands performRoll phase gates + success.
 * Beyond wave41 opponent-skip. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { performRoll } from '../../src/games/remainder-islands/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 remainder — performRoll phase', () => {
  it('identity outside rolling phase', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: ['island-0-0'],
    };
    expect(performRoll(selecting)).toBe(selecting);

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(performRoll(over)).toBe(over);
  });

  it('open board → selectIsland with nonempty valids', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = performRoll(createInitialState());
    expect(next.phase).toBe('selectIsland');
    expect(next.currentRoll).not.toBeNull();
    expect(next.currentRoll!.total).toBeGreaterThanOrEqual(2);
    expect(next.currentRoll!.total).toBeLessThanOrEqual(12);
    expect(next.validIslands.length).toBe(next.islands.length);
    expect(next.currentPlayer).toBe('player1');
    expect(next.turnsRemaining).toBe(createInitialState().turnsRemaining);
  });

  it('player2 rolling on open board keeps seat and enters selectIsland', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    const next = performRoll(state);
    expect(next.phase).toBe('selectIsland');
    expect(next.currentPlayer).toBe('player2');
    expect(next.validIslands.length).toBeGreaterThan(0);
  });
});
