/**
 * Wave 25 — board-a11y Enter/Space activate keys (cell + board delegation).
 * Distinct from #131 inventory and #133 shell/router. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  makeCellFocusable,
  makeSvgFocusable,
  makeGridCell,
  bindCellActivateKeys,
  bindBoardCellKeys,
  type BoardFocusable,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 25 a11y-activate-keys — bindCellActivateKeys', () => {
  it('fires on Enter and Space, not other keys', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    const onActivate = vi.fn();
    bindCellActivateKeys(cell, onActivate);

    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Spacebar', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('preventDefault on Enter/Space (no scroll / click ghost)', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    bindCellActivateKeys(cell, () => undefined);

    const enter = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    const space = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    cell.dispatchEvent(enter);
    cell.dispatchEvent(space);
    expect(enter.defaultPrevented).toBe(true);
    expect(space.defaultPrevented).toBe(true);
  });

  it('works on HTML button-pattern cells', () => {
    const cell = document.createElement('div');
    makeCellFocusable(cell, 'E2, empty, valid move');
    document.body.appendChild(cell);
    const onActivate = vi.fn();
    bindCellActivateKeys(cell, onActivate);
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('works on SVG focusables (Calla / Queens / Remainder pattern)', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    makeSvgFocusable(g, 'node, empty, valid placement');
    document.body.appendChild(g);
    const onActivate = vi.fn();
    bindCellActivateKeys(g, onActivate);
    g.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('multiple binds stack independent listeners', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    const a = vi.fn();
    const b = vi.fn();
    bindCellActivateKeys(cell, a);
    bindCellActivateKeys(cell, b);
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('callback can close over cell identity for placement boards', () => {
    const activated: string[] = [];
    for (const id of ['12', '24', '36']) {
      const cell = document.createElement('div');
      cell.dataset.value = id;
      makeGridCell(cell, id);
      document.body.appendChild(cell);
      bindCellActivateKeys(cell, () => {
        activated.push(id);
      });
      cell.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    }
    expect(activated).toEqual(['12', '24', '36']);
  });
});

describe('Wave 25 a11y-activate-keys — bindBoardCellKeys delegation', () => {
  it('delegates Enter/Space only when isCell matches', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    const other = document.createElement('div');
    other.className = 'chrome';
    board.append(cell, other);
    document.body.appendChild(board);

    const activated: BoardFocusable[] = [];
    bindBoardCellKeys(
      board,
      (el) => el.classList.contains('cell'),
      (el) => {
        activated.push(el);
      }
    );

    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    other.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    other.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(activated).toEqual([cell, cell]);
  });

  it('ignores non-activate keys even on matching cells', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'kq-cell';
    board.appendChild(cell);
    document.body.appendChild(board);
    const onActivate = vi.fn();
    bindBoardCellKeys(
      board,
      (el) => el.classList.contains('kq-cell'),
      onActivate
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    );
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('preventDefault on delegated Enter/Space', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
    document.body.appendChild(board);
    bindBoardCellKeys(
      board,
      (el) => el.classList.contains('cell'),
      () => undefined
    );
    const ev = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    cell.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
  });

  it('isCell can require focused element itself (Kings pattern)', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'square';
    const child = document.createElement('span');
    child.className = 'piece';
    cell.appendChild(child);
    board.appendChild(cell);
    document.body.appendChild(board);

    const hits: BoardFocusable[] = [];
    bindBoardCellKeys(
      board,
      (el) => el.classList.contains('square'),
      (el) => {
        hits.push(el);
      }
    );

    // keydown on child bubbles; target is child — isCell false
    child.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(hits).toHaveLength(0);

    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(hits).toEqual([cell]);
  });

  it('works with SVG board roots and SVG cell targets', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hex-cell');
    makeSvgFocusable(g, '0,0');
    svg.appendChild(g);
    document.body.appendChild(svg);

    const hits: BoardFocusable[] = [];
    bindBoardCellKeys(
      svg,
      (el) => el.getAttribute('class') === 'hex-cell',
      (el) => {
        hits.push(el);
      }
    );
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(hits).toEqual([g]);
  });

  it('nested boards: only the bound root receives its own activations', () => {
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    const outerCell = document.createElement('div');
    outerCell.className = 'cell';
    const innerCell = document.createElement('div');
    innerCell.className = 'cell';
    outer.append(outerCell, inner);
    inner.appendChild(innerCell);
    document.body.appendChild(outer);

    const outerHits: BoardFocusable[] = [];
    const innerHits: BoardFocusable[] = [];
    bindBoardCellKeys(
      outer,
      (el) => el.classList.contains('cell'),
      (el) => {
        outerHits.push(el);
      }
    );
    bindBoardCellKeys(
      inner,
      (el) => el.classList.contains('cell'),
      (el) => {
        innerHits.push(el);
      }
    );

    innerCell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    // bubbles through both
    expect(innerHits).toEqual([innerCell]);
    expect(outerHits).toEqual([innerCell]);

    outerCell.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(outerHits).toEqual([innerCell, outerCell]);
    expect(innerHits).toEqual([innerCell]);
  });
});
