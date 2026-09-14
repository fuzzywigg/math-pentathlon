/**
 * Wave 44 overnight HEAVY — applyRovingTabindex preferred / empty.
 */
import { describe, it, expect } from 'vitest';
import { applyRovingTabindex, makeGridCell } from '../../src/ui/board-a11y';

describe('Wave 44 UI — roving tabindex', () => {
  it('empty → null; preferred coords win; else first', () => {
    expect(applyRovingTabindex([])).toBeNull();
    const cells = [0, 1, 2].map((i) => {
      const el = document.createElement('div');
      makeGridCell(el, `c${i}`);
      el.setAttribute('data-row', '0');
      el.setAttribute('data-col', String(i));
      return el;
    });
    const active = applyRovingTabindex(cells, { row: '0', col: '2' });
    expect(active).toBe(cells[2]);
    expect(cells[2].getAttribute('tabindex')).toBe('0');
    expect(cells[0].getAttribute('tabindex')).toBe('-1');
    const first = applyRovingTabindex(cells, { row: '9', col: '9' });
    expect(first).toBe(cells[0]);
  });
});
