/**
 * Wave 43 — Juggle doRollDice seeded values leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — roll spy dice', () => {
  it('random 0 yields dice [1,1] and selectingShape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = doRollDice(createInitialState());
    expect(next.currentDice).toEqual([1, 1]);
    expect(next.phase).toBe('selectingShape');
  });

  it('identity when already selectingShape', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 3] as [number, number],
    };
    expect(doRollDice(state)).toBe(state);
  });
});
