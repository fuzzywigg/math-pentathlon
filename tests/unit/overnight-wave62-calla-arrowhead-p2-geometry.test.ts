/**
 * Wave 62 leftover after #293 — Calla arrowhead-p2 marker geometry.
 * Complements wave58 p1 marker geometry + wave56 fills. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 62 calla — arrowhead-p2 geometry', () => {
  it('locks arrowhead-p2 marker size, ref, orient, and points', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const m = el.querySelector('#arrowhead-p2')!;
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
