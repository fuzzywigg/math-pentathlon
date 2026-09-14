/**
 * Wave 44 overnight HEAVY — captureFocusedCell / restoreFocusedCell / restoreGridFocus.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  makeGridCell,
  markBoardAsGrid,
  captureFocusedCell,
  restoreFocusedCell,
  restoreGridFocus,
  collectGridCells,
} from '../../src/ui/board-a11y';

describe('Wave 44 UI — capture/restore focus', () => {
  let board: HTMLElement;
  beforeEach(() => {
    board = document.createElement('div');
    document.body.appendChild(board);
    markBoardAsGrid(board);
    for (let i = 0; i < 2; i++) {
      const cell = document.createElement('div');
      makeGridCell(cell, `0,${i}`);
      cell.setAttribute('data-row', '0');
      cell.setAttribute('data-col', String(i));
      board.appendChild(cell);
    }
  });
  afterEach(() => board.remove());

  it('roundtrips focus coords and restores grid', () => {
    const cells = collectGridCells(board);
    (cells[1] as HTMLElement).focus();
    const snap = captureFocusedCell(board);
    expect(snap).toEqual({ row: '0', col: '1' });
    (cells[0] as HTMLElement).focus();
    restoreFocusedCell(board, snap);
    expect(document.activeElement).toBe(cells[1]);
    restoreGridFocus(board, { row: '0', col: '0' });
    expect(cells[0].getAttribute('tabindex')).toBe('0');
    expect(captureFocusedCell(board)).toEqual({ row: '0', col: '0' });
  });

  it('null focus paths', () => {
    expect(captureFocusedCell(board)).toBeNull();
    restoreFocusedCell(board, null);
    restoreGridFocus(board, null);
    expect(collectGridCells(board)[0].getAttribute('tabindex')).toBe('0');
  });
});
