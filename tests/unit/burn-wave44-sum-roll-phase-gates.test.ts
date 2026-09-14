/**
 * Wave 44 — Sum Dominoes doRollDice phase gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, doRollDice, canPlayDomino } from '../../src/games/sum-dominoes/rules';
import { getDiceSum, type SumDominoesState } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 sum-dominoes — doRollDice phase gates', () => {
  it('identity for placing / passing / gameOver regardless of dice', () => {
    const base = createInitialState();
    for (const phase of ['placing', 'passing', 'gameOver'] as const) {
      const state: SumDominoesState = {
        ...base,
        phase,
        currentDice: [6, 6],
        selectedDomino: 'ghost',
      };
      expect(doRollDice(state)).toBe(state);
      expect(doRollDice(state).currentDice).toEqual([6, 6]);
    }
  });

  it('rolling always stamps currentDice and never stays rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // die ≈ 6
    const next = doRollDice(createInitialState());
    expect(next.currentDice).toEqual([6, 6]);
    expect(next.phase).not.toBe('rolling');
    expect(['placing', 'passing']).toContain(next.phase);
  });

  it('phase matches hand playability for forced sum 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1]
    const state = createInitialState();
    const next = doRollDice(state);
    expect(next.currentDice).toEqual([1, 1]);
    const sum = getDiceSum(next.currentDice!);
    const playable = next.hands[next.currentPlayer].some((d) => canPlayDomino(next, d, sum));
    expect(next.phase).toBe(playable ? 'placing' : 'passing');
  });

  it('does not mutate currentPlayer or winner on roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const next = doRollDice(state);
    expect(next.currentPlayer).toBe(state.currentPlayer);
    expect(next.winner).toBeNull();
    expect(next.passCount).toBe(0);
  });
});
