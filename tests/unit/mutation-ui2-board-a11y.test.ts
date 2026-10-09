import { afterEach, describe, expect, it } from 'vitest';
import {
  ensureAriaGridRows,
  makeGridCell,
  markBoardAsGrid,
} from '../../src/ui/board-a11y';

describe('mutation-ui2 board-a11y ensureAriaGridRows survivors', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('wraps a single orphan gridcell (length > 0, not > 1)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const cell = document.createElement('div');
    cell.dataset.row = '0';
    cell.dataset.col = '0';
    makeGridCell(cell, '0,0');
    board.appendChild(cell);
    ensureAriaGridRows(board);
    const rows = board.querySelectorAll(':scope > [role="row"]');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.querySelectorAll('[role="gridcell"]')).toHaveLength(1);
  });

  it('leaves already-rowed grids unchanged (no-op when orphans empty)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    const cell = document.createElement('div');
    makeGridCell(cell, '0,0');
    row.appendChild(cell);
    board.appendChild(row);
    ensureAriaGridRows(board);
    expect(board.querySelectorAll('[role="row"]')).toHaveLength(1);
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);
  });

  it('promotes nested HTML parent when single data-row group (&& chain)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    board.appendChild(nest);
    for (const col of [0, 1]) {
      const cell = document.createElement('div');
      cell.dataset.row = '0';
      cell.dataset.col = String(col);
      makeGridCell(cell, `0,${col}`);
      nest.appendChild(cell);
    }
    ensureAriaGridRows(board);
    expect(nest.getAttribute('role')).toBe('row');
    // Must not insert an extra aria-grid-row wrapper when promoting.
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);
  });

  it('does not promote when multiple data-row keys under same parent', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    board.appendChild(nest);
    for (const row of [0, 1]) {
      const cell = document.createElement('div');
      cell.dataset.row = String(row);
      cell.dataset.col = '0';
      makeGridCell(cell, `${row},0`);
      nest.appendChild(cell);
    }
    ensureAriaGridRows(board);
    expect(nest.getAttribute('role')).not.toBe('row');
    expect(nest.querySelectorAll(':scope > [role="row"]')).toHaveLength(2);
  });

  it('SVG namespace path creates SVG row groups', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg);
    for (const col of [0, 1]) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-row', String(col === 0 ? 0 : 1));
      g.setAttribute('data-col', '0');
      makeGridCell(g, `${col},0`);
      svg.appendChild(g);
    }
    ensureAriaGridRows(svg);
    const rows = svg.querySelectorAll('[role="row"]');
    expect(rows.length).toBeGreaterThanOrEqual(2);
    for (const row of rows) {
      expect(row.namespaceURI).toBe('http://www.w3.org/2000/svg');
    }
  });

  it.skip('equivalent: orphanCells.length > 0 vs >= 0 — empty orphans no-op either way', () => {
    // Reason: when length is 0 the group loops do nothing; not observable.
  });
});
