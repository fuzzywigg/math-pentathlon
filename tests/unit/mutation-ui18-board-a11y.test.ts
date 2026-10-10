/**
 * q-mp-527 mutation audit UI wave 18 — board-a11y first-20 re-pins.
 * Structural role / tabindex / namespaceURI asserts only — no aria-label /
 * player-facing copy pins. Soft-fail residuals owned by open #986 / q-mp-522.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  ensureAriaGridRows,
  makeCellFocusable,
  makeGridCell,
  makeSvgFocusable,
  markBoardAsGrid,
} from '../../src/ui/board-a11y';

const SVG_NS = 'http://www.w3.org/2000/svg';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mutation-ui18 board-a11y', () => {
  it('makeCellFocusable / makeSvgFocusable set role=button and tabindex=0', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'x');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');
    // Presence only — do not pin label string content.
    expect(cell.hasAttribute('aria-label')).toBe(true);

    const svg = document.createElementNS(SVG_NS, 'g');
    makeSvgFocusable(svg, 'y');
    expect(svg.getAttribute('role')).toBe('button');
    expect(svg.getAttribute('tabindex')).toBe('0');
    expect(svg.hasAttribute('aria-label')).toBe(true);
  });

  it('makeGridCell sets gridcell role and tabindex=-1', () => {
    const cell = document.createElement('div');
    makeGridCell(cell, '0,0');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.getAttribute('tabindex')).toBe('-1');
  });

  it('markBoardAsGrid sets role=grid', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    expect(board.getAttribute('role')).toBe('grid');
  });

  it('wraps a single orphan gridcell (length > 0 window; >→>= hold documented)', () => {
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

  it('leaves already-rowed grids unchanged when orphans empty', () => {
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

  it('HTML nest with spoofed SVG namespaceURI wraps with SVG g rows (||≠&&)', () => {
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

  it('promotes single-row nest; refuses multi-row (&& chain + size === 1)', () => {
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
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);

    const board2 = document.createElement('div');
    markBoardAsGrid(board2);
    const nest2 = document.createElement('div');
    board2.appendChild(nest2);
    for (const row of [0, 1]) {
      const cell = document.createElement('div');
      cell.dataset.row = String(row);
      cell.dataset.col = '0';
      makeGridCell(cell, `${row},0`);
      nest2.appendChild(cell);
    }
    ensureAriaGridRows(board2);
    expect(nest2.getAttribute('role')).not.toBe('row');
    expect(nest2.querySelectorAll(':scope > [role="row"]')).toHaveLength(2);
  });

  it('does not promote nest with foreign role=group', () => {
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

  it.skip('equivalent: orphanCells.length > 0 vs >= 0 — empty orphans no-op either way', () => {
    // Reason: when length is 0 the group loops do nothing; not observable.
    // Same hold as wave 2 / wave 10 (first-20 m6).
  });
});
