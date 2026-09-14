/**
 * Wave 40 — Hex-a-Gone selectBlock max-3 / committed / bank / duplicate.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  selectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';
import {
  createInitialState,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 40 hex-a-gone — select gates', () => {
  it('max 3 blocks then fourth select is identity', () => {
    let state = createInitialState();
    for (let i = 0; i < 3; i++) {
      state = selectBlock(state, SHAPES[i]);
    }
    expect(state.turnSelection.blocks).toHaveLength(3);
    expect(selectBlock(state, SHAPES[3])).toBe(state);
  });

  it('duplicate shape and empty bank are identity', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    expect(selectBlock(state, 'hexagon')).toBe(state);

    const emptyBank = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(selectBlock(emptyBank, 'triangle')).toBe(emptyBank);
  });

  it('committed selection rejects further selectBlock', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'rhombus');
    state = commitSelection(state);
    expect(state.turnSelection.committed).toBe(true);
    expect(selectBlock(state, 'triangle')).toBe(state);
  });
});
