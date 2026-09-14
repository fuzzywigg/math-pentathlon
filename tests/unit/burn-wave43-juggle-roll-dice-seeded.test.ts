/**
 * Wave 43 — Juggle rollDice utility seeded leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { rollDice } from '../../src/games/juggle/types';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — rollDice seeded', () => {
  it('rollDice returns faces in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999);
    expect(rollDice()).toEqual([1, 6]);
  });

  it('doRollDice dense faces across random ladder', () => {
    for (const r of [0, 0.16, 0.33, 0.5, 0.66, 0.83]) {
      vi.spyOn(Math, 'random').mockReturnValue(r);
      const next = doRollDice(createInitialState());
      expect(next.currentDice![0]).toBeGreaterThanOrEqual(1);
      expect(next.currentDice![0]).toBeLessThanOrEqual(6);
      vi.restoreAllMocks();
    }
  });
});
