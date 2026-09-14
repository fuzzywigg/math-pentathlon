/**
 * Overnight HEAVY leftover — Calla sow-direction arrows and markers.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — arrows', () => {
  it('mounts p1/p2 arrows with matching marker defs', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('svg.calla-board')?.getAttribute('viewBox')).toBe(
      '0 0 500 200'
    );
    expect(el.querySelector('.calla-arrow-p1')?.getAttribute('marker-end')).toBe(
      'url(#arrowhead-p1)'
    );
    expect(el.querySelector('.calla-arrow-p2')?.getAttribute('marker-end')).toBe(
      'url(#arrowhead-p2)'
    );
    expect(el.querySelector('#arrowhead-p1')).toBeTruthy();
    expect(el.querySelector('#arrowhead-p2')).toBeTruthy();
    expect(el.querySelector('.calla-board-bg')).toBeTruthy();
  });
});
