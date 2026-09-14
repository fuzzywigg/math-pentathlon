/**
 * Wave 35 — renderPolyomino cell/bbox/config leftover matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  SIMPLE_SHAPES,
  TETROMINOES,
  PENTOMINOES,
  renderPolyomino,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

const byId = (id: string) =>
  [...SIMPLE_SHAPES, ...TETROMINOES, ...PENTOMINOES].find((s) => s.id === id)!;

describe('Wave 35 poly-ui-render — cell counts across catalog', () => {
  it.each(SIMPLE_SHAPES.map((s) => [s.id, s.cells.length] as const))(
    'SIMPLE %s renders %i rects',
    (id, n) => {
      const svg = renderPolyomino(byId(id));
      expect(svg.dataset.shapeId).toBe(id);
      expect(svg.querySelectorAll('rect')).toHaveLength(n);
      expect(svg.classList.contains('polyomino')).toBe(true);
    }
  );

  it.each(TETROMINOES.map((s) => [s.id, s.cells.length] as const))(
    'TETROMINO %s renders %i rects at 0/90/180/270',
    (id, n) => {
      for (const rot of [0, 90, 180, 270] as const) {
        const svg = renderPolyomino(byId(id), rot, false, { cellSize: 12 });
        expect(svg.querySelectorAll('rect')).toHaveLength(n);
      }
    }
  );

  it('flip preserves cell count for asymmetric tromino-L', () => {
    const shape = byId('tromino-L');
    const a = renderPolyomino(shape, 0, false);
    const b = renderPolyomino(shape, 0, true);
    expect(a.querySelectorAll('rect')).toHaveLength(3);
    expect(b.querySelectorAll('rect')).toHaveLength(3);
  });
});

describe('Wave 35 poly-ui-render — config sizing', () => {
  it('larger cellSize grows svg dimensions for monomino', () => {
    const small = renderPolyomino(byId('monomino'), 0, false, {
      cellSize: 10,
      padding: 0,
    });
    const large = renderPolyomino(byId('monomino'), 0, false, {
      cellSize: 40,
      padding: 0,
    });
    expect(Number(large.getAttribute('width'))).toBeGreaterThan(
      Number(small.getAttribute('width'))
    );
    expect(Number(large.getAttribute('height'))).toBe(
      Number(large.getAttribute('width'))
    );
  });

  it('padding expands both axes equally for monomino', () => {
    const svg = renderPolyomino(byId('monomino'), 0, false, {
      cellSize: 20,
      padding: 5,
    });
    expect(svg.getAttribute('width')).toBe('30');
    expect(svg.getAttribute('height')).toBe('30');
  });

  it('fill uses shape.color; stroke is darkened hex', () => {
    const shape = { ...byId('domino'), color: '#ff0000' };
    const svg = renderPolyomino(shape);
    const rect = svg.querySelector('rect')!;
    expect(rect.getAttribute('fill')).toBe('#ff0000');
    const stroke = rect.getAttribute('stroke')!;
    expect(stroke.startsWith('#')).toBe(true);
    expect(stroke).not.toBe('#ff0000');
  });

  it('domino horizontal vs 90° changes bounding box aspect', () => {
    const h = renderPolyomino(byId('domino'), 0, false, {
      cellSize: 10,
      padding: 0,
    });
    const v = renderPolyomino(byId('domino'), 90, false, {
      cellSize: 10,
      padding: 0,
    });
    const hw = Number(h.getAttribute('width'));
    const hh = Number(h.getAttribute('height'));
    const vw = Number(v.getAttribute('width'));
    const vh = Number(v.getAttribute('height'));
    expect(hw).not.toBe(hh);
    expect(vw).toBe(hh);
    expect(vh).toBe(hw);
  });
});
