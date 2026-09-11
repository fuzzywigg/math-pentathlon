import { describe, it, expect, afterEach } from 'vitest';
import {
  buildCellAriaLabel,
  makeCellFocusable,
  bindCellActivateKeys,
  bindBoardCellKeys,
  captureFocusedCell,
  restoreFocusedCell,
  markStatusLive,
} from '../../src/ui/board-a11y';

describe('board-a11y helpers (Wave 1)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('buildCellAriaLabel joins coord, empty, and valid move/placement', () => {
    expect(
      buildCellAriaLabel({
        coord: 'E2',
        empty: true,
        validMove: true,
      })
    ).toBe('E2, empty, valid move');

    expect(
      buildCellAriaLabel({
        coord: 'A1',
        empty: true,
        validPlacement: true,
      })
    ).toBe('A1, empty, valid placement');
  });

  it('buildCellAriaLabel includes owner and piece without color-only gaps', () => {
    expect(
      buildCellAriaLabel({
        coord: 'E1',
        owner: 'Player 1',
        piece: 'King',
      })
    ).toBe('E1, Player 1 King');

    expect(
      buildCellAriaLabel({
        coord: '12',
        owner: 'Blue',
      })
    ).toBe('12, Blue');

    expect(
      buildCellAriaLabel({
        coord: '7',
        empty: true,
        extras: ['prime'],
        validPlacement: true,
      })
    ).toBe('7, empty, prime, valid placement');
  });

  it('makeCellFocusable sets role, tabindex, and aria-label', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'E2, empty, valid move');
    expect(cell.getAttribute('role')).toBe('button');
    expect(cell.getAttribute('tabindex')).toBe('0');
    expect(cell.getAttribute('aria-label')).toBe('E2, empty, valid move');
  });

  it('bindCellActivateKeys fires on Enter and Space', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    let count = 0;
    bindCellActivateKeys(cell, () => {
      count += 1;
    });

    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(count).toBe(2);
  });

  it('bindBoardCellKeys delegates Enter/Space to matching cells', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
    document.body.appendChild(board);

    let activated: HTMLElement | null = null;
    bindBoardCellKeys(
      board,
      (el) => el.classList.contains('cell'),
      (el) => {
        activated = el;
      }
    );

    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(activated).toBe(cell);
  });

  it('capture/restore focus by data-row and data-col after rebuild', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const first = document.createElement('div');
    first.dataset.row = '2';
    first.dataset.col = '3';
    first.tabIndex = 0;
    container.appendChild(first);
    first.focus();

    const focus = captureFocusedCell(container);
    expect(focus).toEqual({ row: '2', col: '3' });

    container.innerHTML = '';
    const next = document.createElement('div');
    next.dataset.row = '2';
    next.dataset.col = '3';
    next.tabIndex = 0;
    container.appendChild(next);

    restoreFocusedCell(container, focus);
    expect(document.activeElement).toBe(next);
  });

  it('markStatusLive sets role=status and aria-live=polite', () => {
    const status = document.createElement('div');
    markStatusLive(status);
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});
