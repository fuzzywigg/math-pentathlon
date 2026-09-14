/**
 * Wave 42 — markStatusLive remount live-region leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  markStatusLive,
  markBoardAsGrid,
  makeGridCell,
  applyRovingTabindex,
  collectGridCells,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 42 a11y — remount live region', () => {
  it('markStatusLive sets polite status role', () => {
    const el = document.createElement('div');
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('remount overwrite keeps polite after assertive', () => {
    const el = document.createElement('div');
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    markStatusLive(el);
    markStatusLive(el);
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('status text survives remount attrs', () => {
    const el = document.createElement('div');
    el.textContent = 'Blue to move';
    markStatusLive(el);
    expect(el.textContent).toBe('Blue to move');
  });

  it('board remount reapplies grid role + roving tabindex', () => {
    const board = document.createElement('div');
    document.body.appendChild(board);
    markBoardAsGrid(board);
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement('div');
      cell.dataset.row = String(Math.floor(i / 2));
      cell.dataset.col = String(i % 2);
      makeGridCell(cell, `cell ${i}`);
      board.appendChild(cell);
    }
    applyRovingTabindex(collectGridCells(board), 0);
    expect(board.getAttribute('role')).toBe('grid');
    const cells = collectGridCells(board);
    expect(cells).toHaveLength(4);
    expect((cells[0] as HTMLElement).tabIndex).toBe(0);
    expect((cells[1] as HTMLElement).tabIndex).toBe(-1);
  });

  it('second applyRovingTabindex can move preferred cell', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    for (const [r, c] of [
      [0, 0],
      [0, 1],
    ]) {
      const cell = document.createElement('div');
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      makeGridCell(cell, `${r},${c}`);
      board.appendChild(cell);
    }
    const cells = collectGridCells(board);
    applyRovingTabindex(cells, { row: '0', col: '0' });
    applyRovingTabindex(cells, { row: '0', col: '1' });
    expect((cells[0] as HTMLElement).tabIndex).toBe(-1);
    expect((cells[1] as HTMLElement).tabIndex).toBe(0);
  });
});
