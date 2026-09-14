/**
 * Wave 25 — board-a11y label / grid / arrows / focus restore / live status edges.
 * Distinct from board-a11y.test.ts smoke and wave 24 shell/grid-alignment.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  buildCellAriaLabel,
  makeCellFocusable,
  makeSvgFocusable,
  markBoardAsGrid,
  makeGridCell,
  applyRovingTabindex,
  collectGridCells,
  findGridNeighbor,
  bindGridNavigation,
  restoreGridFocus,
  bindCellActivateKeys,
  bindBoardCellKeys,
  captureFocusedCell,
  restoreFocusedCell,
  markStatusLive,
} from '../../src/ui/board-a11y';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  root.remove();
  vi.restoreAllMocks();
});

function gridCell(row: number, col: number): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-row', String(row));
  el.setAttribute('data-col', String(col));
  makeGridCell(el, `r${row}c${col}`);
  return el;
}

describe('Wave 25 board-a11y — labels + focusable attrs', () => {
  it('buildCellAriaLabel prefers empty over owner/piece and appends extras/moves', () => {
    expect(
      buildCellAriaLabel({
        coord: 'E2',
        owner: 'Blue',
        piece: 'King',
        empty: true,
        extras: ['prime', ''],
        validMove: true,
        validPlacement: true,
      })
    ).toBe('E2, empty, prime, valid move, valid placement');

    expect(
      buildCellAriaLabel({ coord: '12', owner: 'Red', piece: 'Guard' })
    ).toBe('12, Red Guard');

    expect(buildCellAriaLabel({ coord: 'A1' })).toBe('A1');
  });

  it('makeCellFocusable and makeSvgFocusable stamp role/tabindex/label', () => {
    const cell = document.createElement('button');
    makeCellFocusable(cell, 'cell A');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');
    expect(cell.getAttribute('aria-label')).toBe('cell A');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    makeSvgFocusable(svg, 'hex 1');
    expect(svg.getAttribute('role')).toBe('button');
    expect(svg.getAttribute('tabindex')).toBe('0');
    expect(svg.getAttribute('aria-label')).toBe('hex 1');
  });

  it('markStatusLive sets polite status region', () => {
    const status = document.createElement('div');
    markStatusLive(status);
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});

describe('Wave 25 board-a11y — grid roving + neighbors', () => {
  it('applyRovingTabindex prefers coords else first; empty → null', () => {
    expect(applyRovingTabindex([])).toBeNull();

    const a = gridCell(0, 0);
    const b = gridCell(0, 1);
    const c = gridCell(1, 0);
    root.append(a, b, c);

    const first = applyRovingTabindex([a, b, c]);
    expect(first).toBe(a);
    expect(a.getAttribute('tabindex')).toBe('0');
    expect(b.getAttribute('tabindex')).toBe('-1');

    const preferred = applyRovingTabindex([a, b, c], { row: '1', col: '0' });
    expect(preferred).toBe(c);
    expect(c.getAttribute('tabindex')).toBe('0');

    const missing = applyRovingTabindex([a, b, c], { row: '9', col: '9' });
    expect(missing).toBe(a);
  });

  it('collectGridCells only returns role=gridcell with coords', () => {
    markBoardAsGrid(root);
    const a = gridCell(0, 0);
    const stray = document.createElement('div');
    stray.setAttribute('data-row', '0');
    stray.setAttribute('data-col', '1');
    root.append(a, stray);
    expect(collectGridCells(root)).toEqual([a]);
  });

  it('findGridNeighbor steps over holes within bounds', () => {
    const cells = [gridCell(0, 0), gridCell(0, 2), gridCell(2, 0)];
    expect(findGridNeighbor([], 0, 0, 0, 1)).toBeNull();
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 0, 0, 1, 0)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 0, 0, 0, -1)).toBeNull();
    expect(findGridNeighbor(cells, 0, 2, 0, 1)).toBeNull();
  });
});

describe('Wave 25 board-a11y — keyboard bindings + focus restore', () => {
  it('bindGridNavigation moves focus with arrows', () => {
    markBoardAsGrid(root);
    const a = gridCell(0, 0);
    const b = gridCell(0, 1);
    root.append(a, b);
    applyRovingTabindex([a, b]);
    bindGridNavigation(root);
    a.focus();

    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(b);
    expect(b.getAttribute('tabindex')).toBe('0');
  });

  it('bindCellActivateKeys and bindBoardCellKeys fire on Enter/Space', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'x');
    root.appendChild(cell);
    const single = vi.fn();
    bindCellActivateKeys(cell, single);
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(single).toHaveBeenCalledTimes(2);

    const board = document.createElement('div');
    const c1 = document.createElement('div');
    makeCellFocusable(c1, 'c1');
    board.appendChild(c1);
    root.appendChild(board);
    const delegated = vi.fn();
    bindBoardCellKeys(
      board,
      (el) => el === c1,
      (el) => delegated(el)
    );
    c1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(delegated).toHaveBeenCalledWith(c1);
  });

  it('capture/restore focused cell and restoreGridFocus', () => {
    const a = gridCell(1, 2);
    const b = gridCell(3, 4);
    root.append(a, b);
    a.focus();
    const focus = captureFocusedCell(root);
    expect(focus).toEqual({ row: '1', col: '2' });

    root.innerHTML = '';
    const a2 = gridCell(1, 2);
    const b2 = gridCell(3, 4);
    root.append(a2, b2);
    restoreFocusedCell(root, focus);
    expect(document.activeElement).toBe(a2);

    restoreFocusedCell(root, null);
    restoreGridFocus(root, { row: '3', col: '4' });
    expect(document.activeElement).toBe(b2);

    restoreGridFocus(root, null);
    const cells = collectGridCells(root);
    expect(cells.some((c) => c.getAttribute('tabindex') === '0')).toBe(true);
  });

  it('captureFocusedCell returns null outside container or without coords', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    expect(captureFocusedCell(root)).toBeNull();
    outside.remove();

    const bare = document.createElement('div');
    bare.tabIndex = 0;
    root.appendChild(bare);
    bare.focus();
    expect(captureFocusedCell(root)).toBeNull();
  });
});
