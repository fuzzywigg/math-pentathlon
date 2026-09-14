/**
 * Wave 25 — board-a11y SVG grid + mixed HTML/SVG focus matrix.
 * Distinct from wave 23 hex-ui and #131 inventory. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  makeGridCell,
  makeSvgFocusable,
  markBoardAsGrid,
  collectGridCells,
  findGridNeighbor,
  bindGridNavigation,
  applyRovingTabindex,
  bindCellActivateKeys,
  captureFocusedCell,
  restoreGridFocus,
  buildCellAriaLabel,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function svgCell(row: number, col: number, label?: string): SVGElement {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-row', String(row));
  g.setAttribute('data-col', String(col));
  makeGridCell(
    g,
    label ??
      buildCellAriaLabel({
        coord: `${row},${col}`,
        empty: true,
      })
  );
  return g;
}

function htmlCell(row: number, col: number): HTMLElement {
  const cell = document.createElement('div');
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);
  makeGridCell(cell, `${row},${col}`);
  return cell;
}

describe('Wave 25 a11y-svg-grid — SVG grid construction', () => {
  it('markBoardAsGrid + makeGridCell on SVG mirrors HTML contracts', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg);
    const a = svgCell(0, 0);
    const b = svgCell(
      0,
      1,
      buildCellAriaLabel({ coord: '0,1', owner: 'Blue' })
    );
    svg.append(a, b);
    document.body.appendChild(svg);

    expect(svg.getAttribute('role')).toBe('grid');
    expect(a.getAttribute('role')).toBe('gridcell');
    expect(b.getAttribute('aria-label')).toBe('0,1, Blue');
    expect(collectGridCells(svg)).toHaveLength(2);
  });

  it('applyRovingTabindex on SVG leaves exactly one tabindex=0', () => {
    const cells = [svgCell(0, 0), svgCell(1, 0), svgCell(2, 0)];
    applyRovingTabindex(cells, { row: '1', col: '0' });
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ]);
  });

  it('findGridNeighbor works on SVG cell maps with holes', () => {
    const cells = [svgCell(0, 0), svgCell(0, 2), svgCell(2, 0)];
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(cells[1]);
    expect(findGridNeighbor(cells, 0, 0, 1, 0)).toBe(cells[2]);
    expect(findGridNeighbor(cells, 0, 2, 1, 0)).toBeNull();
  });

  it('arrow navigation on SVG grid focuses neighbor and updates roving', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg);
    const a = svgCell(0, 0);
    const b = svgCell(0, 1);
    const c = svgCell(1, 0);
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
    a.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(document.activeElement).toBe(c);
  });

  it('restoreGridFocus after SVG rebuild focuses prior coords', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg1);
    const first = svgCell(3, 2);
    svg1.append(svgCell(0, 0), first);
    container.appendChild(svg1);
    applyRovingTabindex(collectGridCells(container), {
      row: '3',
      col: '2',
    });
    (first as SVGElement).focus();
    const focus = captureFocusedCell(container);
    expect(focus).toEqual({ row: '3', col: '2' });

    container.innerHTML = '';
    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg2);
    const again = svgCell(3, 2);
    svg2.append(svgCell(1, 1), again, svgCell(4, 4));
    container.appendChild(svg2);
    restoreGridFocus(container, focus);
    expect(document.activeElement).toBe(again);
    expect(again.getAttribute('tabindex')).toBe('0');
  });
});

describe('Wave 25 a11y-svg-grid — button SVG vs gridcell SVG', () => {
  it('makeSvgFocusable button pattern is separate from gridcell', () => {
    const btn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const cell = svgCell(0, 0);
    makeSvgFocusable(
      btn,
      buildCellAriaLabel({
        coord: 'pit-3',
        extras: ['4 seeds'],
        validMove: true,
      })
    );
    expect(btn.getAttribute('role')).toBe('button');
    expect(btn.getAttribute('tabindex')).toBe('0');
    expect(btn.getAttribute('aria-label')).toBe('pit-3, 4 seeds, valid move');
    expect(cell.getAttribute('role')).toBe('gridcell');
    expect(cell.getAttribute('tabindex')).toBe('-1');
  });

  it('Enter/Space on SVG buttons fire activate without needing grid nav', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    makeSvgFocusable(g, 'island-A');
    document.body.appendChild(g);
    const hits: string[] = [];
    bindCellActivateKeys(g, () => {
      hits.push('go');
    });
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(hits).toEqual(['go']);
  });
});

describe('Wave 25 a11y-svg-grid — mixed HTML + SVG in one container', () => {
  it('collectGridCells finds both HTML and SVG gridcells', () => {
    const root = document.createElement('div');
    markBoardAsGrid(root);
    const html = htmlCell(0, 0);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = svgCell(0, 1);
    svg.appendChild(g);
    root.append(html, svg);
    document.body.appendChild(root);
    const cells = collectGridCells(root);
    expect(cells).toHaveLength(2);
    expect(findGridNeighbor(cells, 0, 0, 0, 1)).toBe(g);
  });

  it('roving across mixed HTML/SVG updates tabindex on both kinds', () => {
    const root = document.createElement('div');
    markBoardAsGrid(root);
    const html = htmlCell(0, 0);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const g = svgCell(0, 1);
    svg.appendChild(g);
    root.append(html, svg);
    document.body.appendChild(root);
    const cells = collectGridCells(root);
    bindGridNavigation(root);
    applyRovingTabindex(cells);
    html.focus();
    html.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement).toBe(g);
    expect(g.getAttribute('tabindex')).toBe('0');
    expect(html.getAttribute('tabindex')).toBe('-1');
  });
});

describe('Wave 25 a11y-svg-grid — large SVG board stress', () => {
  it('7×7 SVG with diagonal holes still arrow-navigates', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markBoardAsGrid(svg);
    const cells: SVGElement[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === c && r !== 0 && r !== 6) continue; // diagonal holes
        const cell = svgCell(r, c);
        cells.push(cell);
        svg.appendChild(cell);
      }
    }
    document.body.appendChild(svg);
    applyRovingTabindex(collectGridCells(svg));
    bindGridNavigation(svg);
    (cells[0] as SVGElement).focus();

    // walk right along row 0
    for (let i = 0; i < 6; i++) {
      (document.activeElement as Element).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );
    }
    expect((document.activeElement as Element).getAttribute('data-col')).toBe(
      '6'
    );

    // down — may hop holes on diagonal
    (document.activeElement as Element).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(document.activeElement?.getAttribute('role')).toBe('gridcell');
  });
});
