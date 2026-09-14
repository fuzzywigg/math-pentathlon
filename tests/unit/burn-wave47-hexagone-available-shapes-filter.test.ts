/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone available shapes filter. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 47 hex-a-gone deepen 8 — hexagone — getAvailableShapes filter', () => {
  it('drops shapes with bank count 0', () => {
    const state = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 6,
        rhombus: 6,
        triangle: 12,
        square: 6,
      },
    };
    const available = getAvailableShapes(state);
    expect(available).not.toContain('hexagon');
    expect(available).toContain('trapezoid');
    expect(available).toContain('triangle');
  });

  it('drops already-selected shapes', () => {
    let state = createInitialState();
    state = selectBlock(state, 'rhombus');
    state = selectBlock(state, 'square');
    const available = getAvailableShapes(state);
    expect(available).not.toContain('rhombus');
    expect(available).not.toContain('square');
    expect(available).toContain('hexagon');
    expect(available).toContain('triangle');
    expect(available).toContain('trapezoid');
  });

  it('opening returns all five shapes', () => {
    expect(getAvailableShapes(createInitialState())).toEqual([
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ]);
  });
});
