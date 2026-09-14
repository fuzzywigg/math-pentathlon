/**
 * Wave 24 — board-a11y edge matrix (holes, labels, focus restore misses).
 * Deepens existing board-a11y helpers beyond waves 1–3 smoke coverage.
 * Distinct from waves 19–23 UI toolkit / owl / storage burns.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  buildCellAriaLabel,
  makeCellFocusable,
  makeSvgFocusable,
  makeGridCell,
  markBoardAsGrid,
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

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function gridCell(row: number, col: number, label = `${row},${col}`): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-row', String(row));
  el.setAttribute('data-col', String(col));
  makeGridCell(el, label);
  return el;
}

describe('Wave 24 a11y — label / focusable attrs', () => {
  it('buildCellAriaLabel extras-only and valid flags without empty', () => {
    expect(
      buildCellAriaLabel({
        coord: 'B4',
        owner: 'Blue',
        piece: 'King',
        extras: ['prime', ''],
        validMove: true,
        validPlacement: true,
      })
    ).toBe('B4, Blue King, prime, valid move, valid placement');

    expect(buildCellAriaLabel({ coord: 'Z9' })).toBe('Z9');
    expect(
      buildCellAriaLabel({ coord: 'A1', empty: true, owner: 'ignored' })
    ).toBe('A1, empty');
  });

  it('makeCellFocusable / makeSvgFocusable overwrite prior attrs', () => {
    const cell = document.createElement('button');
    cell.setAttribute('tabindex', '-1');
    makeCellFocusable(cell, 'first');
    makeCellFocusable(cell, 'second');
    expect(cell.getAttribute('aria-label')).toBe('second');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    makeSvgFocusable(svg, 'svg-label');
    expect(svg.getAttribute('role')).toBe('button');
    expect(svg.getAttribute('tabindex')).toBe('0');
    expect(svg.getAttribute('aria-label')).toBe('svg-label');
  });
});

describe('Wave 24 a11y — grid holes and roving edges', () => {
  it('findGridNeighbor skips missing coords and stops at bounds', () => {
    const cells = [
      gridCell(0, 0),
      gridCell(0, 2),
      gridCell(1, 0),
      gridCell(1, 1),
    ];
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 0, 2, 0, 1)).toBeNull();
    expect(findGridNeighbor(cells, 0, 0, -1, 0)).toBeNull();
    expect(findGridNeighbor([], 0, 0, 1, 0)).toBeNull();
  });

  it('applyRovingTabindex prefers coords then falls back; empty → null', () => {
    expect(applyRovingTabindex([])).toBeNull();
    const cells = [gridCell(0, 0), gridCell(0, 1), gridCell(1, 0)];
    const preferred = applyRovingTabindex(cells, { row: '1', col: '0' });
    expect(preferred).toBe(cells[2]);
    expect(cells[2].getAttribute('tabindex')).toBe('0');
    expect(cells[0].getAttribute('tabindex')).toBe('-1');

    const missing = applyRovingTabindex(cells, { row: '9', col: '9' });
    expect(missing).toBe(cells[0]);
  });

  it('collectGridCells only returns role=gridcell with data-row/col', () => {
    const root = document.createElement('div');
    markBoardAsGrid(root);
    const a = gridCell(0, 0);
    const stray = document.createElement('div');
    stray.setAttribute('data-row', '0');
    stray.setAttribute('data-col', '1');
    stray.setAttribute('role', 'button');
    root.append(a, stray);
    document.body.appendChild(root);
    expect(collectGridCells(root)).toEqual([a]);
  });

  it('bindGridNavigation ignores non-arrow and non-gridcell targets', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = gridCell(0, 0);
    const b = gridCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);
    bindGridNavigation(board);
    applyRovingTabindex([a, b]);

    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(a.getAttribute('tabindex')).toBe('0');

    const btn = document.createElement('button');
    board.appendChild(btn);
    btn.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(a.getAttribute('tabindex')).toBe('0');

    a.focus();
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(b.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(b);
  });
});

describe('Wave 24 a11y — capture / restore / activate', () => {
  it('captureFocusedCell null when focus outside or missing coords', () => {
    const root = document.createElement('div');
    const outside = document.createElement('button');
    document.body.append(root, outside);
    outside.focus();
    expect(captureFocusedCell(root)).toBeNull();

    const cell = document.createElement('div');
    cell.setAttribute('tabindex', '0');
    root.appendChild(cell);
    cell.focus();
    expect(captureFocusedCell(root)).toBeNull();
  });

  it('restoreFocusedCell no-ops on null / missing; restores match', () => {
    const root = document.createElement('div');
    const cell = gridCell(2, 3);
    cell.setAttribute('tabindex', '0');
    root.appendChild(cell);
    document.body.appendChild(root);

    restoreFocusedCell(root, null);
    restoreFocusedCell(root, { row: '9', col: '9' });
    expect(document.activeElement).not.toBe(cell);

    restoreFocusedCell(root, { row: '2', col: '3' });
    expect(document.activeElement).toBe(cell);
  });

  it('restoreGridFocus with preferred coords focuses; null leaves one tab stop', () => {
    const board = document.createElement('div');
    const a = gridCell(0, 0);
    const b = gridCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);

    restoreGridFocus(board, null);
    expect(
      [a, b].filter((c) => c.getAttribute('tabindex') === '0')
    ).toHaveLength(1);

    restoreGridFocus(board, { row: '0', col: '1' });
    expect(b.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(b);
  });

  it('bindCellActivateKeys / bindBoardCellKeys ignore other keys', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'c');
    document.body.appendChild(cell);
    const onActivate = vi.fn();
    bindCellActivateKeys(cell, onActivate);
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(onActivate).not.toHaveBeenCalled();
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(onActivate).toHaveBeenCalledTimes(1);

    const board = document.createElement('div');
    const target = document.createElement('div');
    makeCellFocusable(target, 't');
    board.appendChild(target);
    document.body.appendChild(board);
    const boardActivate = vi.fn();
    bindBoardCellKeys(board, (el) => el === target, boardActivate);
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(boardActivate).not.toHaveBeenCalled();
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(boardActivate).toHaveBeenCalledWith(target);
  });

  it('markStatusLive is idempotent overwrite', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'assertive');
    markStatusLive(el);
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
