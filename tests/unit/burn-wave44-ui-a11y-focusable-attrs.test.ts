/**
 * Wave 44 overnight HEAVY — makeCellFocusable / SVG / grid / status.
 */
import { describe, it, expect } from 'vitest';
import {
  makeCellFocusable,
  makeSvgFocusable,
  markBoardAsGrid,
  makeGridCell,
  markStatusLive,
} from '../../src/ui/board-a11y';

describe('Wave 44 UI — a11y attrs', () => {
  it('stamps focusable / grid / live attrs', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'A1, empty');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');
    expect(cell.getAttribute('aria-label')).toBe('A1, empty');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    makeSvgFocusable(svg, 'hex');
    expect(svg.getAttribute('role')).toBe('button');

    const board = document.createElement('div');
    markBoardAsGrid(board);
    expect(board.getAttribute('role')).toBe('grid');
    const gc = document.createElement('div');
    makeGridCell(gc, 'r0c0');
    expect(gc.getAttribute('role')).toBe('gridcell');
    expect(gc.getAttribute('tabindex')).toBe('-1');

    const status = document.createElement('div');
    markStatusLive(status);
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});
