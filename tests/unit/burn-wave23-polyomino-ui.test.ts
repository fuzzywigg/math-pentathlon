/**
 * Wave 23 — polyomino-ui render / board / preview / selector / controls / drag.
 * Distinct from wave 21 polyomino-solve placement math and wave 22 toolkit UI.
 * Used by Juggle / Pent-em-in. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderPolyomino,
  renderBoard,
  renderPlacementPreview,
  createShapeSelector,
  createRotationControls,
  createInteractiveBoard,
  createDraggableShape,
  injectPolyominoStyles,
  getCellFromMouseEvent,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('polyomino-styles')?.remove();
  vi.restoreAllMocks();
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const trominoL = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 23 polyomino-ui — renderPolyomino / renderBoard', () => {
  it('renderPolyomino emits one rect per cell and shape metadata', () => {
    const svg = renderPolyomino(domino, 0, false, { cellSize: 20, padding: 1 });
    expect(svg.classList.contains('polyomino')).toBe(true);
    expect(svg.dataset.shapeId).toBe('domino');
    expect(svg.querySelectorAll('rect')).toHaveLength(2);
    expect(svg.getAttribute('width')).toBeTruthy();
  });

  it('renderPolyomino respects rotation cell count', () => {
    const upright = renderPolyomino(domino, 90, false);
    expect(upright.querySelectorAll('rect')).toHaveLength(2);
    const flipped = renderPolyomino(trominoL, 0, true);
    expect(flipped.querySelectorAll('rect')).toHaveLength(3);
  });

  it('renderBoard shows grid cells and placed shape fills', () => {
    let board = createBoard(3, 3);
    board = placePolyomino(board, mono, { row: 1, col: 1 });
    const svg = renderBoard(board, [mono], { cellSize: 10, padding: 0 });
    expect(svg.classList.contains('polyomino-board')).toBe(true);
    // 1 bg + 9 grid + 1 placed = 11 rects
    expect(svg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(10);
    const cell = svg.querySelector('[data-row="0"][data-col="0"]');
    expect(cell).toBeTruthy();
  });
});

describe('Wave 23 polyomino-ui — preview / selector / rotation', () => {
  it('renderPlacementPreview valid vs invalid colors', () => {
    const empty = createBoard(2, 2);
    const valid = renderPlacementPreview(
      empty,
      mono,
      { row: 0, col: 0 },
      0,
      false,
      { highlightColor: '#00ff00', invalidColor: '#ff0000', cellSize: 12 }
    );
    expect(valid.classList.contains('placement-preview')).toBe(true);
    expect(valid.querySelector('rect')?.getAttribute('fill')).toBe('#00ff00');

    let filled = createBoard(2, 2);
    filled = placePolyomino(filled, mono, { row: 0, col: 0 });
    const invalid = renderPlacementPreview(
      filled,
      mono,
      { row: 0, col: 0 },
      0,
      false,
      { highlightColor: '#00ff00', invalidColor: '#ff0000' }
    );
    expect(invalid.querySelector('rect')?.getAttribute('fill')).toBe('#ff0000');
  });

  it('createShapeSelector click selects shape and shows labels', () => {
    const picked: string[] = [];
    const panel = createShapeSelector(SIMPLE_SHAPES.slice(0, 2), (s) =>
      picked.push(s.id)
    );
    expect(panel.className).toBe('shape-selector');
    expect(panel.querySelectorAll('.shape-option')).toHaveLength(2);
    expect(panel.textContent).toContain('Single');
    (panel.querySelector('.shape-option') as HTMLElement).click();
    expect(picked).toEqual(['monomino']);
  });

  it('createRotationControls cw/ccw/flip; flip optional', () => {
    const rotates: string[] = [];
    const flips: number[] = [];
    const withFlip = createRotationControls(
      (d) => rotates.push(d),
      () => flips.push(1),
      true
    );
    expect(withFlip.querySelectorAll('button')).toHaveLength(3);
    withFlip.querySelectorAll('button')[0].dispatchEvent(new Event('click'));
    withFlip.querySelectorAll('button')[1].dispatchEvent(new Event('click'));
    withFlip.querySelectorAll('button')[2].dispatchEvent(new Event('click'));
    expect(rotates).toEqual(['ccw', 'cw']);
    expect(flips).toEqual([1]);

    const noFlip = createRotationControls(() => {}, () => {}, false);
    expect(noFlip.querySelectorAll('button')).toHaveLength(2);
  });
});

describe('Wave 23 polyomino-ui — interactive / drag / styles / mouse', () => {
  it('createInteractiveBoard click and hover map to cells', () => {
    const clicks: Array<[number, number]> = [];
    const hovers: Array<[number, number] | null> = [];
    const board = createBoard(2, 2);
    const el = createInteractiveBoard(
      board,
      [],
      (c) => clicks.push([c.row, c.col]),
      (c) => hovers.push(c ? [c.row, c.col] : null),
      { cellSize: 20, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    const target = svg.querySelector(
      '[data-row="1"][data-col="0"]'
    ) as SVGElement;
    target.dispatchEvent(new Event('click', { bubbles: true }));
    expect(clicks).toEqual([[1, 0]]);

    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 40, height: 40 }),
    });
    svg.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 25, clientY: 5, bubbles: true })
    );
    expect(hovers.at(-1)).toEqual([0, 1]);
    svg.dispatchEvent(new Event('mouseleave'));
    expect(hovers.at(-1)).toBeNull();
  });

  it('createDraggableShape sets dataset and drag payload', () => {
    const shape = createDraggableShape(domino, 90, false, { cellSize: 15 });
    expect(shape.draggable).toBe(true);
    expect(shape.dataset.shapeId).toBe('domino');
    expect(shape.dataset.rotation).toBe('90');
    expect(shape.dataset.flipped).toBe('false');

    const store: Record<string, string> = {};
    const start = new Event('dragstart', { bubbles: true }) as Event & {
      dataTransfer: { setData: (k: string, v: string) => void };
    };
    start.dataTransfer = {
      setData: (k: string, v: string) => {
        store[k] = v;
      },
    };
    shape.dispatchEvent(start);
    expect(JSON.parse(store['application/json'])).toEqual({
      shapeId: 'domino',
      rotation: 90,
      flipped: false,
    });
    expect(shape.style.opacity).toBe('0.5');
    shape.dispatchEvent(new Event('dragend'));
    expect(shape.style.opacity).toBe('1');
  });

  it('injectPolyominoStyles idempotent; getCellFromMouseEvent bounds', () => {
    injectPolyominoStyles();
    injectPolyominoStyles();
    expect(document.querySelectorAll('#polyomino-styles')).toHaveLength(1);

    const board = createBoard(2, 2);
    const svg = renderBoard(board, [], { cellSize: 10, padding: 2 });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 24, height: 24 }),
    });
    const inside = getCellFromMouseEvent(
      new MouseEvent('click', { clientX: 7, clientY: 7 }),
      svg,
      { cellSize: 10, padding: 2 }
    );
    expect(inside).toEqual({ row: 0, col: 0 });
    const outside = getCellFromMouseEvent(
      new MouseEvent('click', { clientX: 0, clientY: 0 }),
      svg,
      { cellSize: 10, padding: 2 }
    );
    expect(outside).toBeNull();
  });
});
