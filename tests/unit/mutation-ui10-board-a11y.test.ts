/**
 * q-mp-325 mutation audit UI wave 10 — kill / pin board-a11y survivors.
 * Structural / role / namespaceURI asserts only — no player-facing copy.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  ensureAriaGridRows,
  makeGridCell,
  markBoardAsGrid,
} from '../../src/ui/board-a11y';

const SVG_NS = 'http://www.w3.org/2000/svg';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mutation-ui10 board-a11y', () => {
  it('HTML nest with spoofed SVG namespaceURI wraps with SVG g rows (kills L179 ||→&&)', () => {
    // Survivor: namespaceURI === SVG_NS || instanceof SVGElement → &&
    // Under jsdom both sides usually agree; spoof namespaceURI alone so ||≠&&.
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    Object.defineProperty(nest, 'namespaceURI', {
      configurable: true,
      get: () => SVG_NS,
    });
    board.appendChild(nest);
    for (const row of [0, 1]) {
      const cell = document.createElement('div');
      cell.dataset.row = String(row);
      cell.dataset.col = '0';
      makeGridCell(cell, `${row},0`);
      nest.appendChild(cell);
    }
    expect(nest instanceof SVGElement).toBe(false);
    expect(nest.namespaceURI).toBe(SVG_NS);
    ensureAriaGridRows(board);
    const rows = nest.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(2);
    for (const row of Array.from(rows)) {
      expect(row.namespaceURI).toBe(SVG_NS);
      expect(row.tagName.toLowerCase()).toBe('g');
    }
  });

  it('promotes nest with role=presentation (kills parentHasForeignRole !== presentation)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    nest.setAttribute('role', 'presentation');
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
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);
  });

  it('promotes nest with role=none (kills parentHasForeignRole !== none)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    nest.setAttribute('role', 'none');
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
  });

  it('does not promote nest with foreign role=group (keeps wrapper rows)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    nest.setAttribute('role', 'group');
    board.appendChild(nest);
    for (const col of [0, 1]) {
      const cell = document.createElement('div');
      cell.dataset.row = '0';
      cell.dataset.col = String(col);
      makeGridCell(cell, `0,${col}`);
      nest.appendChild(cell);
    }
    ensureAriaGridRows(board);
    expect(nest.getAttribute('role')).not.toBe('row');
    expect(
      nest.querySelectorAll(':scope > [role="row"]').length
    ).toBeGreaterThanOrEqual(1);
  });

  it('marks role-less chrome without cells as presentation', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const chrome = document.createElement('div');
    board.appendChild(chrome);
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    const cell = document.createElement('div');
    makeGridCell(cell, '0,0');
    row.appendChild(cell);
    board.appendChild(row);
    ensureAriaGridRows(board);
    expect(chrome.getAttribute('role')).toBe('presentation');
    expect(row.getAttribute('role')).toBe('row');
  });

  it.skip('equivalent: orphanCells.length > 0 vs >= 0 — empty orphans no-op either way', () => {
    // Reason: when length is 0 the group loops do nothing; not observable.
  });
});
