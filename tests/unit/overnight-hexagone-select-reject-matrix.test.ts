/**
 * Overnight TOKENMAXX — Hex-a-Gone selectBlock reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — select reject', () => {
  it('duplicate / bank0 / length>=3 / wrong phase identity', () => {
    let s = createInitialState();
    s = selectBlock(s, 'triangle');
    expect(selectBlock(s, 'triangle')).toBe(s); // duplicate
    // exhaust bank of hexagon then try select
    const bank0 = {
      ...createInitialState(),
      bank: { ...createInitialState().bank, hexagon: 0 },
    };
    expect(selectBlock(bank0, 'hexagon')).toBe(bank0);
    // max 3
    let full = createInitialState();
    full = selectBlock(full, 'triangle');
    full = selectBlock(full, 'square');
    full = selectBlock(full, 'rhombus');
    expect(selectBlock(full, 'trapezoid')).toBe(full);
    // wrong phase
    const placed = commitSelection(full);
    expect(placed.phase).toBe('placeBlocks');
    expect(selectBlock(placed, 'hexagon')).toBe(placed);
  });
});
