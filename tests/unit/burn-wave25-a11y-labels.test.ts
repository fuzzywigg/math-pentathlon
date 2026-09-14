/**
 * Wave 25 — board-a11y label / focusable attr deepen.
 * Distinct from #131 inventory/resource, #133 grid-alignment/shell chrome,
 * and thin board-a11y.test.ts smoke. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  buildCellAriaLabel,
  makeCellFocusable,
  makeSvgFocusable,
  makeGridCell,
  markBoardAsGrid,
  type CellLabelParts,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 25 a11y-labels — buildCellAriaLabel permutations', () => {
  it('coord-only yields a single segment', () => {
    expect(buildCellAriaLabel({ coord: 'E2' })).toBe('E2');
    expect(buildCellAriaLabel({ coord: '12' })).toBe('12');
    expect(buildCellAriaLabel({ coord: '0,0' })).toBe('0,0');
  });

  it('empty suppresses owner/piece mid segments', () => {
    expect(
      buildCellAriaLabel({
        coord: 'A1',
        empty: true,
        owner: 'Blue',
        piece: 'King',
      })
    ).toBe('A1, empty');
  });

  it('owner and piece join with a single space mid segment', () => {
    expect(
      buildCellAriaLabel({
        coord: 'E1',
        owner: 'Player 1',
        piece: 'King',
      })
    ).toBe('E1, Player 1 King');
    expect(
      buildCellAriaLabel({
        coord: '7',
        owner: 'Red',
        piece: 'Quadraphage',
      })
    ).toBe('7, Red Quadraphage');
  });

  it('owner-only or piece-only mid segments omit blanks', () => {
    expect(buildCellAriaLabel({ coord: '3', owner: 'Blue' })).toBe('3, Blue');
    expect(buildCellAriaLabel({ coord: '3', piece: 'prime' })).toBe('3, prime');
    expect(buildCellAriaLabel({ coord: '3', owner: '', piece: '' })).toBe('3');
  });

  it('extras append after mid/empty and before valid flags', () => {
    expect(
      buildCellAriaLabel({
        coord: '7',
        empty: true,
        extras: ['prime', 'gold'],
        validPlacement: true,
      })
    ).toBe('7, empty, prime, gold, valid placement');

    expect(
      buildCellAriaLabel({
        coord: 'B2',
        owner: 'AI',
        piece: 'chip',
        extras: ['blocked'],
        validMove: true,
      })
    ).toBe('B2, AI chip, blocked, valid move');
  });

  it('skips falsy extras without leaving empty commas', () => {
    expect(
      buildCellAriaLabel({
        coord: '1',
        extras: ['', 'keep', ''],
      })
    ).toBe('1, keep');
  });

  it('validMove and validPlacement can both appear', () => {
    expect(
      buildCellAriaLabel({
        coord: 'C3',
        empty: true,
        validMove: true,
        validPlacement: true,
      })
    ).toBe('C3, empty, valid move, valid placement');
  });

  it('omits valid flags when falsey', () => {
    expect(
      buildCellAriaLabel({
        coord: 'D4',
        empty: true,
        validMove: false,
        validPlacement: false,
      })
    ).toBe('D4, empty');
  });

  it('matrix of common game label shapes stays stable', () => {
    const cases: Array<[CellLabelParts, string]> = [
      [{ coord: 'E2', empty: true, validMove: true }, 'E2, empty, valid move'],
      [
        { coord: 'A1', empty: true, validPlacement: true },
        'A1, empty, valid placement',
      ],
      [{ coord: '12', owner: 'Blue' }, '12, Blue'],
      [
        { coord: '42', owner: 'Player 2', extras: ['claimed'] },
        '42, Player 2, claimed',
      ],
      [
        { coord: '0,3', piece: 'domino', validPlacement: true },
        '0,3, domino, valid placement',
      ],
      [
        { coord: 'hex-2', empty: true, extras: ['removed'] },
        'hex-2, empty, removed',
      ],
    ];
    for (const [parts, expected] of cases) {
      expect(buildCellAriaLabel(parts)).toBe(expected);
    }
  });

  it('preserves unusual coord strings used by number boards', () => {
    expect(buildCellAriaLabel({ coord: '60', empty: true })).toBe('60, empty');
    expect(buildCellAriaLabel({ coord: 'q:1,r:-1', owner: 'Blue' })).toBe(
      'q:1,r:-1, Blue'
    );
  });
});

describe('Wave 25 a11y-labels — makeCellFocusable / makeSvgFocusable', () => {
  it('makeCellFocusable overwrites prior role/tabindex/label', () => {
    const cell = document.createElement('button');
    cell.setAttribute('role', 'presentation');
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('aria-label', 'old');
    makeCellFocusable(cell, 'E2, empty, valid move');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');
    expect(cell.getAttribute('aria-label')).toBe('E2, empty, valid move');
  });

  it('makeSvgFocusable works on path/g/rect and preserves NS', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg.append(path, g, rect);
    document.body.appendChild(svg);

    makeSvgFocusable(path, 'path cell');
    makeSvgFocusable(g, 'g cell');
    makeSvgFocusable(rect, 'rect cell');

    for (const el of [path, g, rect]) {
      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('tabindex')).toBe('0');
      expect(el.namespaceURI).toBe('http://www.w3.org/2000/svg');
    }
    expect(path.getAttribute('aria-label')).toBe('path cell');
    expect(g.getAttribute('aria-label')).toBe('g cell');
    expect(rect.getAttribute('aria-label')).toBe('rect cell');
  });

  it('makeSvgFocusable accepts HTML Element via Element signature', () => {
    const div = document.createElement('div');
    makeSvgFocusable(div, 'html via svg helper');
    expect(div.getAttribute('role')).toBe('button');
    expect(div.getAttribute('tabindex')).toBe('0');
    expect(div.getAttribute('aria-label')).toBe('html via svg helper');
  });
});

describe('Wave 25 a11y-labels — makeGridCell / markBoardAsGrid', () => {
  it('makeGridCell defaults tabindex -1 and role gridcell', () => {
    const cell = document.createElement('div');
    makeGridCell(cell, '0,0, empty');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.getAttribute('tabindex')).toBe('-1');
    expect(cell.getAttribute('aria-label')).toBe('0,0, empty');
  });

  it('makeGridCell on SVG nodes keeps SVG namespace', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    makeGridCell(g, '1,2, Blue');
    expect(g.getAttribute('role')).toBe('gridcell');
    expect(g.getAttribute('tabindex')).toBe('-1');
    expect(g.getAttribute('aria-label')).toBe('1,2, Blue');
    expect(g.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('markBoardAsGrid works on HTML and SVG roots', () => {
    const div = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(div);
    markBoardAsGrid(svg);
    expect(div.getAttribute('role')).toBe('grid');
    expect(svg.getAttribute('role')).toBe('grid');
  });

  it('gridcell + button attrs are distinct patterns', () => {
    const buttonish = document.createElement('div');
    const gridish = document.createElement('div');
    makeCellFocusable(buttonish, 'btn');
    makeGridCell(gridish, 'cell');
    expect(buttonish.getAttribute('role')).toBe('button');
    expect(buttonish.getAttribute('tabindex')).toBe('0');
    expect(gridish.getAttribute('role')).toBe('gridcell');
    expect(gridish.getAttribute('tabindex')).toBe('-1');
  });

  it('relabeling a gridcell updates aria-label without changing role', () => {
    const cell = document.createElement('div');
    makeGridCell(cell, 'old');
    makeGridCell(cell, 'new, empty, valid placement');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.getAttribute('aria-label')).toBe('new, empty, valid placement');
    expect(cell.getAttribute('tabindex')).toBe('-1');
  });
});
