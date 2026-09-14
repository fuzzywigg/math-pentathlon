/**
 * Wave 48 — Juggle selectShape without category is identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectShape } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

describe('Wave 48 juggle — selectShape no category', () => {
  it('identity when selectingShape but category still null', () => {
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
    };
    expect(selectShape(s, SHAPE_POOLS.tetromino[0])).toBe(s);
  });
});
