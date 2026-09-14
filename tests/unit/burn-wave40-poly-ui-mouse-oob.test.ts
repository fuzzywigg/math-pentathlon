/**
 * Wave 40 — poly-ui getCellFromMouseEvent OOB + invalid preview color leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderBoard,
  renderPlacementPreview,
  createInteractiveBoard,
  getCellFromMouseEvent,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

describe('Wave 40 poly-ui — mouse OOB + invalid preview', () => {
  it('negative mouse coords return null', () => {
    const svg = renderBoard(createBoard(3, 3), [], {
      cellSize: 10,
      padding: 2,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 100, top: 100, width: 40, height: 40 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 90, clientY: 110 }),
        svg,
        { cellSize: 10, padding: 2 }
      )
    ).toBeNull();
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 110, clientY: 90 }),
        svg,
        { cellSize: 10, padding: 2 }
      )
    ).toBeNull();
  });

  it('large OOB still returns a Cell (documented current behavior)', () => {
    const svg = renderBoard(createBoard(2, 2), [], {
      cellSize: 10,
      padding: 0,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 20, height: 20 }),
    });
    // Positive OOB is not clamped — returns computed row/col beyond board.
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 500, clientY: 500 }),
        svg,
        { cellSize: 10, padding: 0 }
      )
    ).toEqual({ row: 50, col: 50 });
  });

  it('invalid placement preview uses invalidColor', () => {
    let board = createBoard(2, 2);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    const preview = renderPlacementPreview(
      board,
      mono,
      { row: 0, col: 0 },
      0,
      false,
      { highlightColor: '#00ff00', invalidColor: '#ff00aa', cellSize: 12 }
    );
    expect(preview.querySelector('rect')?.getAttribute('fill')).toBe(
      '#ff00aa'
    );
  });

  it('interactive board mouseleave reports null hover', () => {
    const hovers: Array<[number, number] | null> = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      () => undefined,
      (c) => hovers.push(c ? [c.row, c.col] : null),
      { cellSize: 20, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 40, height: 40 }),
    });
    svg.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 5, clientY: 5, bubbles: true })
    );
    expect(hovers.at(-1)).toEqual([0, 0]);
    svg.dispatchEvent(new Event('mouseleave'));
    expect(hovers.at(-1)).toBeNull();
  });

  it('mousemove outside board bounds yields null hover', () => {
    const hovers: Array<[number, number] | null> = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      () => undefined,
      (c) => hovers.push(c ? [c.row, c.col] : null),
      { cellSize: 10, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 20, height: 20 }),
    });
    svg.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 99, clientY: 5, bubbles: true })
    );
    expect(hovers.at(-1)).toBeNull();
  });
});
