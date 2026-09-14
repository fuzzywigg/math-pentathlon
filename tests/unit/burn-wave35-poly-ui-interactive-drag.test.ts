/**
 * Wave 35 — interactive board + draggable shape + mouse cell leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderBoard,
  createInteractiveBoard,
  createDraggableShape,
  getCellFromMouseEvent,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const trominoL = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 35 poly-ui-interactive — click matrix', () => {
  it('every grid cell click reports correct coords', () => {
    const clicks: Array<[number, number]> = [];
    const board = createBoard(3, 2);
    const el = createInteractiveBoard(
      board,
      [],
      (c) => clicks.push([c.row, c.col]),
      () => {},
      { cellSize: 10, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const target = svg.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        ) as SVGElement;
        target.dispatchEvent(new Event('click', { bubbles: true }));
      }
    }
    expect(clicks).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
    ]);
  });

  it('click on non-cell target is ignored', () => {
    const clicks: unknown[] = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      (c) => clicks.push(c),
      () => {}
    );
    el.querySelector('svg')!.dispatchEvent(
      new Event('click', { bubbles: true })
    );
    expect(clicks).toEqual([]);
  });

  it('hover outside board bounds reports null', () => {
    const hovers: Array<[number, number] | null> = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      () => {},
      (c) => hovers.push(c ? [c.row, c.col] : null),
      { cellSize: 10, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 20, height: 20 }),
    });
    svg.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true })
    );
    expect(hovers.at(-1)).toBeNull();
  });

  it('renders placed shapes inside interactive board', () => {
    let board = createBoard(2, 2);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    const el = createInteractiveBoard(board, [mono], () => {}, () => {}, {
      cellSize: 10,
      padding: 0,
    });
    expect(el.className).toBe('interactive-board');
    const overlays = [...el.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === mono.color
    );
    expect(overlays).toHaveLength(1);
  });
});

describe('Wave 35 poly-ui-drag — dataset + hover scale', () => {
  it.each([
    [0, false],
    [90, true],
    [180, false],
    [270, true],
  ] as const)('rotation %i flipped=%s stamps dataset', (rot, flipped) => {
    const el = createDraggableShape(trominoL, rot, flipped, { cellSize: 12 });
    expect(el.dataset.shapeId).toBe('tromino-L');
    expect(el.dataset.rotation).toBe(String(rot));
    expect(el.dataset.flipped).toBe(String(flipped));
    expect(el.querySelectorAll('rect')).toHaveLength(3);
  });

  it('mouseenter/leave toggles scale transform', () => {
    const el = createDraggableShape(domino);
    el.dispatchEvent(new Event('mouseenter'));
    expect(el.style.transform).toBe('scale(1.05)');
    el.dispatchEvent(new Event('mouseleave'));
    expect(el.style.transform).toBe('scale(1)');
  });

  it('drag payload includes flipped true', () => {
    const el = createDraggableShape(domino, 180, true);
    const store: Record<string, string> = {};
    const start = new Event('dragstart') as DragEvent;
    Object.defineProperty(start, 'dataTransfer', {
      value: {
        setData: (k: string, v: string) => {
          store[k] = v;
        },
      },
    });
    el.dispatchEvent(start);
    expect(JSON.parse(store['application/json'])).toEqual({
      shapeId: 'domino',
      rotation: 180,
      flipped: true,
    });
  });
});

describe('Wave 35 poly-ui-mouse — getCellFromMouseEvent grid', () => {
  it('maps a 3x3 board with padding into correct cells', () => {
    const board = createBoard(3, 3);
    const svg = renderBoard(board, [], { cellSize: 20, padding: 4 });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 10, width: 68, height: 68 }),
    });
    // cell (1,2): x = 10+4+40+1 = 55, y = 10+4+20+1 = 35
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 55, clientY: 35 }),
        svg,
        { cellSize: 20, padding: 4 }
      )
    ).toEqual({ row: 1, col: 2 });
  });

  it('negative coords from padding return null', () => {
    const svg = renderBoard(createBoard(2, 2), [], {
      cellSize: 10,
      padding: 5,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 30, height: 30 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 2, clientY: 2 }),
        svg,
        { cellSize: 10, padding: 5 }
      )
    ).toBeNull();
  });
});
