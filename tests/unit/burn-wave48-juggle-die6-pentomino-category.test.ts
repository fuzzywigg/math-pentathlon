/**
 * Wave 48 — Juggle die 6 maps to pentomino category leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { DICE_TO_CATEGORY } from '../../src/games/juggle/types';

describe('Wave 48 juggle — die6 pentomino', () => {
  it('selecting die value 6 sets pentomino category', () => {
    expect(DICE_TO_CATEGORY[6]).toBe('pentomino');
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [6, 2] as [number, number],
    };
    const next = selectDie(selecting, 0);
    expect(next.selectedCategory).toBe('pentomino');
    expect(next.phase).toBe('selectingShape'); // multiple pentomino shapes
  });
});
