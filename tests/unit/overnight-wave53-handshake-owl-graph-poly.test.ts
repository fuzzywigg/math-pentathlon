/**
 * Overnight HEAVY leftover after #241 — barrel handshake owl/graph/poly after wave52.
 * Distinct from wave52 export/module-name files (extra surface: moods + templates).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  owlSystem,
  owlMessages,
  integrate,
  OWL_FRICTION,
  resolveInspectTarget,
} from '../../src/core/owl';
import {
  createGridGraph,
  createTrackGraph,
  bfs,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph';
import {
  SIMPLE_SHAPES,
  TETROMINOES,
  createGrid,
  createBoard,
  canPlaceShape,
} from '../../src/core/polyomino';

describe('Wave 53 handshake — owl × graph × poly barrels', () => {
  it('owl singleton + physics constant + inspect unknown', () => {
    expect(typeof owlSystem.getState).toBe('function');
    expect(owlMessages.getMessagesByCategory('app:start').length).toBeGreaterThan(
      0
    );
    expect(OWL_FRICTION).toBeLessThan(1);
    const next = integrate({ x: 0, y: 0, vx: 1, vy: 0 });
    expect(next.vx).toBeCloseTo(OWL_FRICTION);
    expect(resolveInspectTarget(null).kind).toBe('unknown');
  });

  it('grid bfs hop agrees with track length-1', () => {
    const grid = createGridGraph(1, 2);
    expect(bfs(grid, '0-0', '0-1').distance).toBe(1);
    const track = createTrackGraph(2);
    expect(bfs(track, 't0', 't1').distance).toBe(1);
    expect(DEFAULT_GRAPH_CONFIG.showWeights).toBe(false);
  });

  it('simple + tetromino catalogs place on empty boards/grids', () => {
    expect(createGrid(2, 2).kind).toBe('grid');
    expect(canPlaceShape(createBoard(5, 5), SIMPLE_SHAPES[0])).toBe(true);
    expect(canPlaceShape(createBoard(5, 5), TETROMINOES[0])).toBe(true);
  });
});
