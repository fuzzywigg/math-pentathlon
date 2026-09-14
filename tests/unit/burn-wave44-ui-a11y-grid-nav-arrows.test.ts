/**
 * Wave 44 overnight HEAVY — bindGridNavigation arrow move.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  markBoardAsGrid,
  makeGridCell,
  applyRovingTabindex,
  bindGridNavigation,
  collectGridCells,
} from '../../src/ui/board-a11y';

describe('Wave 44 UI — grid nav arrows', () => {
  let board: HTMLElement;
  beforeEach(() => {
    board = document.createElement('div');
    document.body.appendChild(board);
    markBoardAsGrid(board);
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      makeGridCell(cell, `0,${c}`);
      cell.setAttribute('data-row', '0');
      cell.setAttribute('data-col', String(c));
      board.appendChild(cell);
    }
    applyRovingTabindex(collectGridCells(board));
    bindGridNavigation(board);
  });
  afterEach(() => board.remove());

  it('ArrowRight moves roving focus', () => {
    const cells = collectGridCells(board);
    (cells[0] as HTMLElement).focus();
    cells[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(cells[1].getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(cells[1]);
  });
});
