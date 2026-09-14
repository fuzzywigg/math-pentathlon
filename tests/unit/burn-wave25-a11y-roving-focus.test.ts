/**
 * Wave 25 — board-a11y roving tabindex + capture/restore focus after rebuild.
 * Distinct from #131 inventory and thin board-a11y.test.ts. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  makeGridCell,
  markBoardAsGrid,
  applyRovingTabindex,
  collectGridCells,
  captureFocusedCell,
  restoreFocusedCell,
  restoreGridFocus,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeCell(row: number | string, col: number | string): HTMLElement {
  const cell = document.createElement('div');
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);
  makeGridCell(cell, `${row},${col}`);
  return cell;
}

describe('Wave 25 a11y-roving-focus — applyRovingTabindex', () => {
  it('returns null and no-ops on empty list', () => {
    expect(applyRovingTabindex([])).toBeNull();
    expect(applyRovingTabindex([], { row: '0', col: '0' })).toBeNull();
  });

  it('defaults to first cell when preferred missing', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1), makeCell(1, 0)];
    const active = applyRovingTabindex(cells, { row: '9', col: '9' });
    expect(active).toBe(cells[0]);
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual([
      '0',
      '-1',
      '-1',
    ]);
  });

  it('selects preferred coords when present', () => {
    const cells = [makeCell(0, 0), makeCell(2, 3), makeCell(1, 1)];
    const active = applyRovingTabindex(cells, { row: '2', col: '3' });
    expect(active).toBe(cells[1]);
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ]);
  });

  it('re-applying preferred moves the single tab stop', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1), makeCell(0, 2)];
    applyRovingTabindex(cells, { row: '0', col: '0' });
    applyRovingTabindex(cells, { row: '0', col: '2' });
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
    ]);
  });

  it('null preferred behaves like undefined (first cell)', () => {
    const cells = [makeCell(5, 5), makeCell(5, 6)];
    const active = applyRovingTabindex(cells, null);
    expect(active).toBe(cells[0]);
  });

  it('string coords with leading zeros must match attribute strings exactly', () => {
    const cells = [makeCell('01', '02'), makeCell('1', '2')];
    const active = applyRovingTabindex(cells, { row: '01', col: '02' });
    expect(active).toBe(cells[0]);
    const other = applyRovingTabindex(cells, { row: '1', col: '2' });
    expect(other).toBe(cells[1]);
  });

  it('exactly one tabindex=0 even on large boards', () => {
    const cells: HTMLElement[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        cells.push(makeCell(r, c));
      }
    }
    applyRovingTabindex(cells, { row: '3', col: '4' });
    const zeros = cells.filter((c) => c.getAttribute('tabindex') === '0');
    const neg = cells.filter((c) => c.getAttribute('tabindex') === '-1');
    expect(zeros).toHaveLength(1);
    expect(zeros[0].dataset.row).toBe('3');
    expect(zeros[0].dataset.col).toBe('4');
    expect(neg).toHaveLength(63);
  });
});

describe('Wave 25 a11y-roving-focus — captureFocusedCell', () => {
  it('returns null when nothing focused', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(makeCell(0, 0));
    expect(captureFocusedCell(container)).toBeNull();
  });

  it('returns null when focus is outside container', () => {
    const container = document.createElement('div');
    const outside = document.createElement('button');
    document.body.append(container, outside);
    container.appendChild(makeCell(1, 1));
    outside.focus();
    expect(captureFocusedCell(container)).toBeNull();
  });

  it('returns null when focused element lacks data-row/col', () => {
    const container = document.createElement('div');
    const el = document.createElement('div');
    el.tabIndex = 0;
    makeGridCell(el, 'no-coords');
    container.appendChild(el);
    document.body.appendChild(container);
    el.focus();
    expect(captureFocusedCell(container)).toBeNull();
  });

  it('snapshots focused row/col as strings', () => {
    const container = document.createElement('div');
    const cell = makeCell(2, 7);
    cell.tabIndex = 0;
    container.appendChild(cell);
    document.body.appendChild(container);
    cell.focus();
    expect(captureFocusedCell(container)).toEqual({ row: '2', col: '7' });
  });

  it('works with SVG focused targets', () => {
    const container = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-row', '4');
    g.setAttribute('data-col', '1');
    makeGridCell(g, '4,1');
    g.setAttribute('tabindex', '0');
    svg.appendChild(g);
    container.appendChild(svg);
    document.body.appendChild(container);
    (g as SVGElement).focus();
    expect(captureFocusedCell(container)).toEqual({ row: '4', col: '1' });
  });
});

describe('Wave 25 a11y-roving-focus — restoreFocusedCell', () => {
  it('no-ops on null focus', () => {
    const container = document.createElement('div');
    const cell = makeCell(0, 0);
    cell.tabIndex = 0;
    container.appendChild(cell);
    document.body.appendChild(container);
    restoreFocusedCell(container, null);
    expect(document.activeElement).not.toBe(cell);
  });

  it('no-ops when coords missing after rebuild', () => {
    const container = document.createElement('div');
    container.appendChild(makeCell(0, 0));
    document.body.appendChild(container);
    restoreFocusedCell(container, { row: '9', col: '9' });
    expect(document.activeElement).not.toBe(container.firstChild);
  });

  it('restores focus after innerHTML rebuild', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const first = makeCell(3, 1);
    first.tabIndex = 0;
    container.appendChild(first);
    first.focus();
    const focus = captureFocusedCell(container);
    expect(focus).toEqual({ row: '3', col: '1' });

    container.innerHTML = '';
    const next = makeCell(3, 1);
    next.tabIndex = 0;
    container.appendChild(next);
    restoreFocusedCell(container, focus);
    expect(document.activeElement).toBe(next);
  });
});

describe('Wave 25 a11y-roving-focus — restoreGridFocus', () => {
  it('with focus: roves + focuses previous cell deep in nested board', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const old = makeCell(2, 3);
    old.tabIndex = 0;
    container.appendChild(old);
    old.focus();
    const focus = captureFocusedCell(container);

    container.innerHTML = '';
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const wrap = document.createElement('div');
    const a = makeCell(0, 0);
    const b = makeCell(2, 3);
    const c = makeCell(5, 5);
    wrap.append(a, b, c);
    board.appendChild(wrap);
    container.appendChild(board);

    restoreGridFocus(container, focus);
    expect(document.activeElement).toBe(b);
    expect(b.getAttribute('tabindex')).toBe('0');
    expect(a.getAttribute('tabindex')).toBe('-1');
    expect(c.getAttribute('tabindex')).toBe('-1');
  });

  it('with null focus: one tab stop, does not steal focus', () => {
    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();

    const container = document.createElement('div');
    document.body.appendChild(container);
    const board = document.createElement('div');
    markBoardAsGrid(board);
    board.append(makeCell(0, 0), makeCell(0, 1));
    container.appendChild(board);

    restoreGridFocus(container, null);
    const cells = collectGridCells(container);
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual(['0', '-1']);
    expect(document.activeElement).toBe(other);
  });

  it('preferred missing after rebuild falls back to first cell and focuses it', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    board.append(a, b);
    container.appendChild(board);

    restoreGridFocus(container, { row: '99', col: '99' });
    // preferred missing → active = first; focus is truthy so it focuses active
    expect(document.activeElement).toBe(a);
    expect(a.getAttribute('tabindex')).toBe('0');
  });

  it('empty board after rebuild is a safe no-op', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() =>
      restoreGridFocus(container, { row: '0', col: '0' })
    ).not.toThrow();
  });

  it('multi-step remount preserves focus across two rebuilds', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    function mount(focusRow: string, focusCol: string): void {
      container.innerHTML = '';
      const board = document.createElement('div');
      markBoardAsGrid(board);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          board.appendChild(makeCell(r, c));
        }
      }
      container.appendChild(board);
      restoreGridFocus(container, { row: focusRow, col: focusCol });
    }

    mount('1', '1');
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe('1');
    const mid = captureFocusedCell(container);
    mount('2', '0');
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe('0');
    restoreGridFocus(container, mid);
    expect(document.activeElement).toMatchObject({
      // jsdom Element
    });
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe('1');
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe('1');
  });
});
