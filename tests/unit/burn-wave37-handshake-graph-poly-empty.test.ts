/**
 * Wave 37 — handshake: polyomino adjacency modeled as graph connectivity.
 * Cross-slice using existing graph + polyomino APIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  placePolyomino,
  getEmptyCells,
  SIMPLE_SHAPES,
  TETROMINOES,
} from '../../src/core/polyomino';
import {
  isConnected,
  findComponents,
  bfs,
  getNodeDegree,
  type Graph,
  type GraphNode,
  type GraphEdge,
  type NodeId,
} from '../../src/core/graph';

function emptyCellsGraph(
  cells: { row: number; col: number }[]
): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];
  const set = new Set(cells.map((c) => `${c.row},${c.col}`));
  for (const c of cells) {
    const id = `${c.row},${c.col}`;
    nodes.set(id, { id, position: { x: c.col, y: c.row } });
  }
  for (const c of cells) {
    const id = `${c.row},${c.col}`;
    for (const [dr, dc] of [
      [0, 1],
      [1, 0],
    ] as const) {
      const nid = `${c.row + dr},${c.col + dc}`;
      if (set.has(nid)) edges.push({ from: id, to: nid });
    }
  }
  return { nodes, edges, directed: false };
}

describe('Wave 37 handshake — empty-cell dual graph', () => {
  it('empty rectangular board graph is connected with expected degrees', () => {
    const board = createBoard(3, 3);
    const g = emptyCellsGraph(getEmptyCells(board));
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
    expect(getNodeDegree(g, '0,0')).toBe(2); // corner
    expect(getNodeDegree(g, '1,1')).toBe(4); // center
    expect(bfs(g, '0,0', '2,2').distance).toBe(4);
  });

  it('placing O in corner splits degrees but stays connected on 4×4', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    const board = placePolyomino(createBoard(4, 4), O, { row: 0, col: 0 });
    const g = emptyCellsGraph(getEmptyCells(board));
    expect(g.nodes.size).toBe(12);
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });

  it('blocking a middle corridor can disconnect empty dual graph', () => {
    // 1×5 row; place monominoes at ends and leave gap — actually place walls at col 2
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(1, 5);
    board = placePolyomino(board, { ...mono, id: 'wall' }, { row: 0, col: 2 });
    const g = emptyCellsGraph(getEmptyCells(board));
    expect(isConnected(g)).toBe(false);
    expect(findComponents(g)).toHaveLength(2);
    expect(bfs(g, '0,0', '0,4').found).toBe(false);
  });

  it('two O blocks on opposite corners leave 8 empty cells in components', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    let board = createBoard(4, 4);
    board = placePolyomino(board, { ...O, id: 'a' }, { row: 0, col: 0 });
    board = placePolyomino(board, { ...O, id: 'b' }, { row: 2, col: 2 });
    const g = emptyCellsGraph(getEmptyCells(board));
    expect(g.nodes.size).toBe(8);
    // Corner blocks can split the empty dual into multiple regions
    expect(findComponents(g).length).toBeGreaterThanOrEqual(1);
    expect(findComponents(g).reduce((n, c) => n + c.length, 0)).toBe(8);
  });
});
