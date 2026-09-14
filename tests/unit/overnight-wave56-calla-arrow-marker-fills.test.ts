/**
 * Wave 56 leftover after #256 — Calla arrowhead polygon seat fills.
 * Distinct from wave50/52 arrow path + marker-end leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — arrow marker fills', () => {
  it('fills p1 arrowhead blue and p2 arrowhead red', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const p1 = el.querySelector('#arrowhead-p1 polygon');
    const p2 = el.querySelector('#arrowhead-p2 polygon');
    expect(p1?.getAttribute('fill')).toBe('#1976d2');
    expect(p2?.getAttribute('fill')).toBe('#d32f2f');
    expect(p1?.getAttribute('points')).toBe('0 0, 10 3.5, 0 7');
  });
});
