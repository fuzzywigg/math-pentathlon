/**
 * Overnight HEAVY leftover after #256 — handshake owl × graph × poly barrels.
 * Tests-only. No engines.
 */
import { describe, it, expect } from 'vitest';
import {
  owlMessages,
  integrate,
  resolveInspectTarget,
} from '../../src/core/owl';
import {
  createStarGraph,
  getNodeDegree,
  bfs,
} from '../../src/core/graph';
import {
  createGrid,
  isValidPlacement,
  removePolyomino,
  placePolyomino,
  injectPolyominoStyles,
  TETROMINOES,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 56 handshake — owl × graph × poly', () => {
  it('owl win-first catalog + friction amplify + inspect unknown', () => {
    expect(
      owlMessages.getMessagesByCategory('game:end').some((m) => m.id === 'win-first-1')
    ).toBe(true);
    expect(integrate({ x: 0, y: 0, vx: 1, vy: 0 }, 2).vx).toBe(2);
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
  });

  it('star n1 degree + bfs hop', () => {
    const g = createStarGraph(1);
    expect(getNodeDegree(g, 'center')).toBe(1);
    expect(bfs(g, 'center', 'n0').distance).toBe(1);
  });

  it('I validplace miss on tall grid; remove clears monomino id; selected css', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    expect(isValidPlacement(createGrid(4, 1), I, { row: 0, col: 0 })).toBe(false);
    const mono = SIMPLE_SHAPES[0];
    const after = removePolyomino(
      placePolyomino(createGrid(1, 1), mono, { row: 0, col: 0 }),
      mono.id
    );
    expect(after.cells[0][0]).toEqual({ occupied: false });
    injectPolyominoStyles();
    expect(
      document.getElementById('polyomino-styles')?.textContent
    ).toContain('.shape-option.selected');
    document.getElementById('polyomino-styles')?.remove();
  });
});
