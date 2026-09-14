/**
 * Wave 25 — board-a11y findGridNeighbor / bindGridNavigation edges.
 * Distinct from #131 inventory and #133 alignment/shell. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  makeGridCell,
  markBoardAsGrid,
  collectGridCells,
  findGridNeighbor,
  bindGridNavigation,
  applyRovingTabindex,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeCell(
  row: number,
  col: number,
  label = `${row},${col}`
): HTMLElement {
  const cell = document.createElement('div');
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);
  makeGridCell(cell, label);
  return cell;
}

function makeSvgCell(row: number, col: number): SVGElement {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-row', String(row));
  g.setAttribute('data-col', String(col));
  makeGridCell(g, `${row},${col}`);
  return g;
}

describe('Wave 25 a11y-grid-nav — findGridNeighbor holes + bounds', () => {
  it('returns null for empty cell list', () => {
    expect(findGridNeighbor([], 0, 0, 0, 1)).toBeNull();
  });

  it('steps over single and multi-cell holes horizontally', () => {
    const cells = [makeCell(0, 0), makeCell(0, 3), makeCell(0, 5)];
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 0, 3, 0, 1)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 0, 5, 0, -1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 0, 3, 0, -1)).toBe(cells[0]);
  });

  it('steps over holes vertically', () => {
    const cells = [makeCell(0, 1), makeCell(2, 1), makeCell(5, 1)];
    expect(findGridNeighbor(cells, 0, 1, 1, 0)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 2, 1, 1, 0)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 5, 1, -1, 0)).toBe(cells[1]);
  });

  it('returns null when stepping past bbox with no further cells', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1), makeCell(1, 0)];
    expect(findGridNeighbor(cells, 0, 0, -1, 0)).toBeNull();
    expect(findGridNeighbor(cells, 0, 0, 0, -1)).toBeNull();
    expect(findGridNeighbor(cells, 0, 1, 0, 1)).toBeNull();
    expect(findGridNeighbor(cells, 1, 0, 1, 0)).toBeNull();
    // diagonal hole with no (1,1)
    expect(findGridNeighbor(cells, 0, 1, 1, 0)).toBeNull();
  });

  it('uses numeric min/max bbox even when coords are sparse', () => {
    const cells = [makeCell(2, 4), makeCell(2, 8), makeCell(6, 4)];
    expect(findGridNeighbor(cells, 2, 4, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 2, 4, 1, 0)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 2, 8, 1, 0)).toBeNull();
  });

  it('ignores non-finite data-row/data-col when computing bbox', () => {
    const good = makeCell(0, 0);
    const bad = document.createElement('div');
    bad.dataset.row = 'NaN';
    bad.dataset.col = '1';
    makeGridCell(bad, 'bad');
    const right = makeCell(0, 2);
    const cells = [good, bad, right];
    // bad is in the map keyed by "NaN,1" but stepping stays on finite path
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(right);
  });

  it('immediate adjacent neighbor wins without overshoot', () => {
    const cells = [
      makeCell(1, 1),
      makeCell(1, 2),
      makeCell(1, 3),
      makeCell(2, 1),
    ];
    expect(findGridNeighbor(cells, 1, 1, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 1, 2, 0, 1)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 1, 1, 1, 0)).toBe(cells[3]);
  });

  it('Sum Dominoes-style covered hole: only exposed cells navigate', () => {
    // 3x3 with center missing (covered by domino)
    const cells = [
      makeCell(0, 0),
      makeCell(0, 1),
      makeCell(0, 2),
      makeCell(1, 0),
      // (1,1) hole
      makeCell(1, 2),
      makeCell(2, 0),
      makeCell(2, 1),
      makeCell(2, 2),
    ];
    expect(findGridNeighbor(cells, 1, 0, 0, 1)).toBe(cells[4]); // jump to 1,2
    expect(findGridNeighbor(cells, 0, 1, 1, 0)).toBe(cells[6]); // jump to 2,1
    expect(findGridNeighbor(cells, 1, 2, 0, -1)).toBe(cells[3]);
  });
});

describe('Wave 25 a11y-grid-nav — collectGridCells filter', () => {
  it('only collects role=gridcell with both data-row and data-col', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const ok = makeCell(0, 0);
    const noRole = document.createElement('div');
    noRole.dataset.row = '0';
    noRole.dataset.col = '1';
    const noCol = document.createElement('div');
    noCol.dataset.row = '1';
    makeGridCell(noCol, 'no-col');
    const button = document.createElement('div');
    button.dataset.row = '2';
    button.dataset.col = '2';
    button.setAttribute('role', 'button');
    board.append(ok, noRole, noCol, button);
    document.body.appendChild(board);

    const cells = collectGridCells(board);
    expect(cells).toHaveLength(1);
    expect(cells[0]).toBe(ok);
  });

  it('collects nested gridcells under wrapper rows', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const row = document.createElement('div');
    row.append(makeCell(0, 0), makeCell(0, 1));
    board.appendChild(row);
    expect(collectGridCells(board)).toHaveLength(2);
  });
});

describe('Wave 25 a11y-grid-nav — bindGridNavigation arrows', () => {
  function mountBoard(cells: HTMLElement[]): HTMLElement {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    board.append(...cells);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    bindGridNavigation(board);
    return board;
  }

  it('ArrowRight/Left/Down/Up move focus and update roving tabindex', () => {
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    const c = makeCell(1, 0);
    const d = makeCell(1, 1);
    mountBoard([a, b, c, d]);
    a.focus();

    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(b);
    expect(b.getAttribute('tabindex')).toBe('0');
    expect(a.getAttribute('tabindex')).toBe('-1');

    b.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(document.activeElement).toBe(d);

    d.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    expect(document.activeElement).toBe(c);

    c.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    expect(document.activeElement).toBe(a);
  });

  it('ignores non-arrow keys and does not preventDefault path', () => {
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    mountBoard([a, b]);
    a.focus();
    a.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    a.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(document.activeElement).toBe(a);
    expect(a.getAttribute('tabindex')).toBe('0');
  });

  it('ignores arrows when target is not a gridcell', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const btn = document.createElement('button');
    btn.textContent = 'roll';
    board.append(a, btn);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    bindGridNavigation(board);
    btn.focus();
    btn.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(btn);
  });

  it('does not move when neighbor missing at edge', () => {
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    mountBoard([a, b]);
    a.focus();
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    expect(document.activeElement).toBe(a);
  });

  it('hole-stepping works through arrow navigation', () => {
    const a = makeCell(0, 0);
    const b = makeCell(0, 2); // hole at 0,1
    mountBoard([a, b]);
    a.focus();
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(b);
  });

  it('SVG gridcells participate in arrow roving across holes', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg);
    const a = makeSvgCell(0, 0);
    const b = makeSvgCell(0, 2);
    const c = makeSvgCell(1, 0);
    svg.append(a, b, c);
    document.body.appendChild(svg);
    applyRovingTabindex(collectGridCells(svg));
    bindGridNavigation(svg);
    (a as SVGElement).focus();

    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(b);
    b.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    expect(document.activeElement).toBe(a);
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(document.activeElement).toBe(c);
  });

  it('gridcell with non-numeric data-row/col is ignored by navigation', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const broken = document.createElement('div');
    broken.dataset.row = 'x';
    broken.dataset.col = 'y';
    makeGridCell(broken, 'broken');
    const ok = makeCell(0, 1);
    board.append(broken, ok);
    document.body.appendChild(board);
    bindGridNavigation(board);
    broken.focus();
    broken.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    // Number('x') is NaN → handler returns without moving
    expect(document.activeElement).toBe(broken);
  });

  it('missing data-row/col coerce to 0 via Number(null) and may navigate', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const broken = document.createElement('div');
    makeGridCell(broken, 'broken');
    // no data-row/col → getAttribute null → Number(null) === 0
    const ok = makeCell(0, 1);
    board.append(broken, ok);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    bindGridNavigation(board);
    broken.focus();
    broken.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    // treated as (0,0) looking right → lands on (0,1)
    expect(document.activeElement).toBe(ok);
  });
});
