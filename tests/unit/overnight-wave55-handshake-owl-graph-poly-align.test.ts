/**
 * Overnight HEAVY leftover after #250 — handshake owl × graph × poly × align
 * after #250 wave53 barrels. Tests-only. No engines.
 */
import { describe, it, expect } from 'vitest';
import {
  owlSystem,
  owlMessages,
  integrate,
  stubNarrationFor,
} from '../../src/core/owl';
import {
  createGridGraph,
  createCompleteGraph,
  getEdge,
  bfs,
} from '../../src/core/graph';
import {
  TETROMINOES,
  SIMPLE_SHAPES,
  createGrid,
  placePolyomino,
  flipPolyomino,
  cellsToKey,
} from '../../src/core/polyomino';
import {
  wrapPosition,
  hasAlignment,
  createArrayAccessor,
  getArrayDimensions,
} from '../../src/core/alignment';

describe('Wave 55 handshake — owl × graph × poly × align', () => {
  it('owl speak API + inspect unknown-chrome + friction step', () => {
    expect(typeof owlSystem.speakNow).toBe('function');
    expect(owlMessages.getMessagesByCategory('game:end').some((m) =>
      m.id.startsWith('draw-')
    )).toBe(true);
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'unknown-chrome' })
    ).toMatch(/Chrome/);
    expect(integrate({ x: 0, y: 0, vx: 2, vy: 0 }, 0).vx).toBe(0);
  });

  it('K3 bfs hop and undirected reverse edge', () => {
    const k3 = createCompleteGraph(3);
    expect(bfs(k3, 'n0', 'n2').found).toBe(true);
    const grid = createGridGraph(1, 2);
    expect(getEdge(grid, '0-1', '0-0')).toBeTruthy();
  });

  it('grid place I stays flat; flipPolyomino mutates J key; align 3-run', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const placed = placePolyomino(createGrid(4, 4), I, { row: 0, col: 0 }, 90);
    expect(placed.cells[0][3].occupied).toBe(true);
    const J = TETROMINOES.find((s) => s.id === 'J')!;
    expect(cellsToKey(flipPolyomino(J).cells)).not.toBe(cellsToKey(J.cells));
    expect(SIMPLE_SHAPES[0].id).toBe('monomino');
    const g = [['A', 'A', 'A']];
    expect(
      hasAlignment(getArrayDimensions(g), createArrayAccessor(g), {
        requiredLength: 3,
      })
    ).toBe(true);
    expect(wrapPosition(-1, 0, 3, 3)).toEqual({ row: 2, col: 0 });
  });
});
