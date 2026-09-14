/**
 * Wave 56 leftover after #256 — Calla arrowhead polygon fill colors.
 * Distinct from wave50/52 marker id existence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — arrowhead fills', () => {
  it('fills p1/p2 arrowhead polygons with seat colors', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(
      el.querySelector('#arrowhead-p1 polygon')?.getAttribute('fill')
    ).toBe('#1976d2');
    expect(
      el.querySelector('#arrowhead-p2 polygon')?.getAttribute('fill')
    ).toBe('#d32f2f');
  });
});
