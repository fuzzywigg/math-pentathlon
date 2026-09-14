/**
 * Wave 48 — Ramrod getBoxSum when both rods present. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getBoxSum } from '../../src/games/ramrod/rules';
import { createRod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — box sum both rods', () => {
  it('sums lengths when both slots filled', () => {
    const s = createInitialState();
    const box = s.boxes.get('box-0-0')!;
    const filled = {
      ...box,
      rods: [createRod('a', 2), createRod('b', 3)] as [ReturnType<typeof createRod>, ReturnType<typeof createRod>],
    };
    expect(getBoxSum(filled)).toBe(5);
    expect(getBoxSum(box)).toBeNull();
  });
});
