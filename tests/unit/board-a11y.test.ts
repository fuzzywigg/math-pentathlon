import { describe, it, expect, afterEach } from 'vitest';
import {
  buildCellAriaLabel,
  makeCellFocusable,
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

describe('board-a11y helpers (Wave 2 grid + roving)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function makeCell(row: number, col: number, label = `${row},${col}`): HTMLElement {
    const cell = document.createElement('div');
    cell.dataset.row = String(row);
    cell.dataset.col = String(col);
    makeGridCell(cell, label);
    return cell;
  }

  it('makeGridCell sets role=gridcell and tabindex=-1', () => {
    const cell = document.createElement('div');
    makeGridCell(cell, 'E2, empty');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.getAttribute('tabindex')).toBe('-1');
    expect(cell.getAttribute('aria-label')).toBe('E2, empty');
  });

  it('markBoardAsGrid sets role=grid', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    expect(board.getAttribute('role')).toBe('grid');
  });

  it('applyRovingTabindex leaves exactly one tabindex=0', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1), makeCell(1, 0)];
    const active = applyRovingTabindex(cells);
    expect(active).toBe(cells[0]);
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);

    applyRovingTabindex(cells, { row: '0', col: '1' });
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('findGridNeighbor steps over holes', () => {
    const cells = [makeCell(0, 0), makeCell(0, 2)];
    const next = findGridNeighbor(cells, 0, 0, 0, 1);
    expect(next).toBe(cells[1]);
  });

  it('bindGridNavigation moves focus with arrows and updates roving tabindex', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    const c = makeCell(1, 0);
    board.append(a, b, c);
    document.body.appendChild(board);

    applyRovingTabindex(collectGridCells(board));
    bindGridNavigation(board);
    a.focus();

    a.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(b);
    expect(b.getAttribute('tabindex')).toBe('0');
    expect(a.getAttribute('tabindex')).toBe('-1');

    b.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    // no (1,1) cell — stays
    expect(document.activeElement).toBe(b);

    b.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(a);

    a.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(c);
  });

  it('restoreGridFocus reapplies roving and focuses previous cell', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const first = makeCell(2, 3);
    container.appendChild(first);
    applyRovingTabindex([first]);
    first.focus();

    const focus = captureFocusedCell(container);
    container.innerHTML = '';

    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nextA = makeCell(1, 1);
    const nextB = makeCell(2, 3);
    board.append(nextA, nextB);
    container.appendChild(board);

    restoreGridFocus(container, focus);
    expect(document.activeElement).toBe(nextB);
    expect(nextB.getAttribute('tabindex')).toBe('0');
    expect(nextA.getAttribute('tabindex')).toBe('-1');
  });

  it('restoreGridFocus with null focus does not steal focus', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const cell = makeCell(0, 0);
    board.appendChild(cell);
    container.appendChild(board);

    restoreGridFocus(container, null);
    expect(cell.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).not.toBe(cell);
  });
});
