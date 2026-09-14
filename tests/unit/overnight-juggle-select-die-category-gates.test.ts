/**
 * Overnight HEAVY after #214/#215 — Juggle selectDie category gates leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { DICE_TO_CATEGORY } from '../../src/games/juggle/types';

describe('Overnight juggle — selectDie gates', () => {
  it('rolling is identity; selectingShape sets category from die face', () => {
    const rolling = createInitialState();
    expect(selectDie(rolling, 0)).toBe(rolling);
    const selecting = {
      ...rolling,
      phase: 'selectingShape' as const,
      currentDice: [2, 5] as [number, number],
    };
    const next = selectDie(selecting, 1);
    expect(next.selectedCategory).toBe(DICE_TO_CATEGORY[5]);
  });
});
