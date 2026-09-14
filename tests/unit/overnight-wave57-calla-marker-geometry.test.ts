/**
 * Wave 57 leftover after #262 — Calla arrowhead marker geometry.
 * Distinct from wave56 fill colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — marker geometry', () => {
  it('locks arrowhead-p1 marker size, ref, orient, and points', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const m = el.querySelector('#arrowhead-p1')!;
    expect(m.getAttribute('markerWidth')).toBe('10');
    expect(m.getAttribute('markerHeight')).toBe('7');
    expect(m.getAttribute('refX')).toBe('9');
    expect(m.getAttribute('refY')).toBe('3.5');
    expect(m.getAttribute('orient')).toBe('auto');
    expect(m.querySelector('polygon')?.getAttribute('points')).toBe(
      '0 0, 10 3.5, 0 7'
    );
  });
});
