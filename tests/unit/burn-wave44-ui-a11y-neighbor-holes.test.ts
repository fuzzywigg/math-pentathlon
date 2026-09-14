/**
 * Wave 44 overnight HEAVY — findGridNeighbor steps over holes.
 */
import { describe, it, expect } from 'vitest';
import { findGridNeighbor, makeGridCell } from '../../src/ui/board-a11y';

describe('Wave 44 UI — grid neighbor holes', () => {
  it('skips missing mid cell and stops at bounds', () => {
    const mk = (r: number, c: number) => {
      const el = document.createElement('div');
      makeGridCell(el, `${r},${c}`);
      el.setAttribute('data-row', String(r));
      el.setAttribute('data-col', String(c));
      return el;
    };
    // 0,0 and 0,2 present — hole at 0,1
    const cells = [mk(0, 0), mk(0, 2), mk(1, 0)];
    expect(findGridNeighbor(cells, 0, 0, 0, 1)?.getAttribute('data-col')).toBe('2');
    expect(findGridNeighbor(cells, 0, 0, -1, 0)).toBeNull();
    expect(findGridNeighbor([], 0, 0, 1, 0)).toBeNull();
  });
});
