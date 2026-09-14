/**
 * Overnight HEAVY leftover after #234 — Handshake exports across graph/poly/align/owl.
 * Distinct from overnight-core-handshake-graph-hex-exports. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { bfs, renderGraph, createTrackGraph } from '../../src/core/graph';
import {
  cellsToKey,
  createGrid,
  getPolyominoById,
} from '../../src/core/polyomino';
import { wrapPosition, clearHighlights } from '../../src/core/alignment';
import { clampToViewport, resolveInspectTarget, owlMessages } from '../../src/core/owl';

describe('Wave 52 handshake — graph/poly/align/owl exports', () => {
  it('core barrels expose residual helpers used by wave52 tests', () => {
    expect(typeof bfs).toBe('function');
    expect(typeof renderGraph).toBe('function');
    expect(createTrackGraph(2).nodes.size).toBe(2);
    expect(typeof cellsToKey).toBe('function');
    expect(createGrid(1, 1).kind).toBe('grid');
    expect(getPolyominoById('hexagon')?.order).toBe(6);
    expect(wrapPosition(0, 0, 2, 2)).toEqual({ row: 0, col: 0 });
    expect(typeof clearHighlights).toBe('function');
    expect(clampToViewport(0, 0, 10, 10, 100, 100)).toEqual({ x: 0, y: 0 });
    expect(resolveInspectTarget(null).kind).toBe('unknown');
    expect(owlMessages.getMessagesByCategory('achievement:unlock').length).toBeGreaterThan(
      0
    );
  });
});
