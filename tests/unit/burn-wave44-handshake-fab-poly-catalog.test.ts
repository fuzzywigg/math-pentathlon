/**
 * Wave 44 — fab fraction bar catalog × poly order catalog handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { FRACTION_BAR_VALUES } from '../../src/games/fab-a-diffy/types';
import { getPolyominoesByOrder, SIMPLE_SHAPES } from '../../src/core/polyomino';

describe('Wave 44 handshake — fab × poly catalogs', () => {
  it('fab bars non-empty; poly orders 1-3 cover SIMPLE_SHAPES', () => {
    const state = createInitialState();
    expect(state.fractionBars.size).toBeGreaterThan(0);
    expect(FRACTION_BAR_VALUES.length).toBeGreaterThan(0);
    const orders = [1, 2, 3].flatMap((o) => getPolyominoesByOrder(o));
    expect(orders.length).toBe(SIMPLE_SHAPES.length);
    expect(state.phase).toBe('selectingBar1');
  });
});
