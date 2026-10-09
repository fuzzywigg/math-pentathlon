/**
 * q-mp-281 — engine coverage round 8: post-r7 residual characterization.
 *
 * Themes: cold NON-RULES core helpers (fractions / graph / polyomino) still
 * under branch coverage after rounds 1–7. Pins CURRENT behavior only.
 * Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post748, coverage-engine-r8-baseline, non-UI core):
 *   graph/algorithms 90.00% · polyomino/placement 90.09% ·
 *   graph/types 94.11% · polyomino/transform 96.42% ·
 *   fractions/arithmetic 100% · fractions/types 100% · polyomino/types 100%
 */
import { describe, expect, it } from 'vitest';

import {
  bfs,
  dijkstra,
  findAllPaths,
  findComponents,
  findNodesAtDistance,
  findNodesWithinDistance,
  findPlayerRegion,
  findReachable,
  isConnected,
  playerConnectsSets,
} from '../../src/core/graph/algorithms';
import {
  createCompleteGraph,
  createHexLatticeGraph,
  createTrackGraph,
  type Graph,
  type GraphBoard,
} from '../../src/core/graph/types';

import {
  createBoard,
  createBoardWithBlockedCells,
  createGrid,
  isCellOccupied,
  isOccupied,
  placePolyomino,
  removeLastPolyomino,
  removePolyomino,
  solvePlacement,
  type Board,
  type Grid,
} from '../../src/core/polyomino/placement';
import {
  getAllOrientations,
  rotateCells,
} from '../../src/core/polyomino/transform';
import type { PolyominoShape } from '../../src/core/polyomino/types';
import {
  COMMON_FRACTIONS,
  FRACTION_COLORS,
} from '../../src/core/fractions/types';
import { createFraction, simplify } from '../../src/core/fractions/arithmetic';

const mono = (id = 'm0'): PolyominoShape => ({
  id,
  name: 'mono',
  cells: [{ row: 0, col: 0 }],
  color: '#000',
  canRotate: false,
  canFlip: true,
  size: 1,
  order: 1,
});

const domino = (id = 'd0'): PolyominoShape => ({
  id,
  name: 'domino',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  color: '#000',
  canRotate: true,
  canFlip: false,
  size: 2,
  order: 2,
});

// =============================================================================
// 1. fractions — already hot; smoke that catalog helpers stay wired
// =============================================================================

describe('engine-coverage-round-8 — fractions (hot baseline)', () => {
  it('COMMON_FRACTIONS / FRACTION_COLORS / createFraction stay consistent', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    expect(FRACTION_COLORS[2]).toBeDefined();
    const f = createFraction(2, 4);
    expect(simplify(f)).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
  });
});

// =============================================================================
// 2. polyomino/placement.ts — sparse forges + solvePlacement maxSolutions=0
// =============================================================================

describe('engine-coverage-round-8 — polyomino/placement', () => {
  it('isCellOccupied treats missing occupied as occupied (?? true)', () => {
    const grid = createGrid(2, 2);
    // Forge: cell object present but occupied undefined → nullish coalesce.
    (grid.cells[0] as Grid['cells'][number])[0] = {
      occupied: undefined as unknown as boolean,
    };
    expect(isCellOccupied(grid, 0, 0)).toBe(true);
    expect(isCellOccupied(grid, 0, 1)).toBe(false);
  });

  it('isOccupied on short board row uses ?? true hole-guard', () => {
    const board = createBoard(2, 2);
    board.cells[0] = [];
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
    expect(isOccupied(board, { row: 1, col: 0 })).toBe(false);
  });

  it('placePolyomino Grid API skips write when target row was punched out', () => {
    const grid = createGrid(2, 2);
    delete grid.cells[1];
    const placed = placePolyomino(grid, mono('g1'), { row: 1, col: 0 });
    // Grid path does not validate; punched row → rowCells falsy → no write.
    expect(placed.cells[1]).toBeUndefined();
    expect(placed.placements).toHaveLength(1);
    expect(placed.placements[0]?.polyomino.id).toBe('g1');
  });

  it('removeLastPolyomino skips clear when row punched or bounds shrunk', () => {
    let board: Board = createBoard(2, 2);
    board = placePolyomino(board, mono('a'), { row: 0, col: 0 });
    board = placePolyomino(board, mono('b'), { row: 1, col: 1 });

    // Punch the last placement's row → isInBounds true, rowCells falsy.
    const punched: Board = {
      ...board,
      cells: board.cells.map((row) => [...row]),
      placements: [...board.placements],
    };
    delete punched.cells[1];
    const afterPunch = removeLastPolyomino(punched, [mono('a'), mono('b')]);
    expect(afterPunch.placements).toHaveLength(1);
    // Cell (1,1) could not be cleared (row missing); remaining placement intact.
    expect(afterPunch.placements[0]?.shapeId).toBe('a');

    // Shrink rows so last placement cells are OOB → isInBounds false arm.
    const shrunk: Board = {
      ...board,
      rows: 0,
      cols: 0,
      cells: board.cells.map((row) => [...row]),
      placements: [...board.placements],
    };
    const afterShrink = removeLastPolyomino(shrunk, [mono('a'), mono('b')]);
    expect(afterShrink.placements).toHaveLength(1);
    // Original occupied bits left uncleared because OOB skip.
    expect(afterShrink.cells[1]?.[1]).toBe(true);
  });

  it('removePolyomino still drops placement when matching cells sit on punched rows', () => {
    let grid = createGrid(2, 2);
    grid = placePolyomino(grid, mono('x'), { row: 0, col: 0 });
    // Documented: rowCells falsy arm inside the match block is unreachable once
    // `newCells[r]?.[c]` already resolved a cell. Punching the row only skips
    // the match; placement list is still filtered by id.
    delete grid.cells[0];
    const cleared = removePolyomino(grid, 'x');
    expect(cleared.placements).toHaveLength(0);
    expect(cleared.cells[0]).toBeUndefined();
  });

  it('solvePlacement with maxSolutions=0 returns immediately (no search)', () => {
    // Pins the top-of-solve `solutions.length >= maxSolutions` early return.
    const sols = solvePlacement(createBoard(1, 1), [mono()], 0);
    expect(sols).toEqual([]);
  });

  it('createBoardWithBlockedCells ignores OOB blocked coords', () => {
    const board = createBoardWithBlockedCells(2, 2, [
      { row: -1, col: 0 },
      { row: 0, col: 0 },
      { row: 9, col: 9 },
    ]);
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
    expect(isOccupied(board, { row: 0, col: 1 })).toBe(false);
  });

  it('placePolyomino Board path throws when placement invalid', () => {
    const board = createBoard(1, 1);
    board.cells[0]![0] = true;
    expect(() => placePolyomino(board, mono(), { row: 0, col: 0 })).toThrow(
      /occupied|Invalid placement/i
    );
    // Documented unreachable: validatePlacement always sets `reason`, so the
    // `reason || 'Invalid placement'` fallback never fires on the public path.
  });
});

// =============================================================================
// 3. polyomino/transform.ts — invalid rotation default + orientation dedupe
// =============================================================================

describe('engine-coverage-round-8 — polyomino/transform', () => {
  it('rotateCells default arm copies cells for non-canonical rotation', () => {
    const cells = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    // Rotation is typed 0|90|180|270; forge an out-of-union value.
    const out = rotateCells(cells, 45 as 0);
    expect(out).toEqual(cells);
    expect(out).not.toBe(cells);
    expect(out[0]).not.toBe(cells[0]);
  });

  it('getAllOrientations dedupes flip when canRotate is false (monomino)', () => {
    const shape = mono('sym');
    const orients = getAllOrientations(shape);
    // Flip of a single cell matches the unflipped key → seen.has skip arm.
    expect(orients).toHaveLength(1);
    expect(orients[0]).toEqual([{ row: 0, col: 0 }]);
  });
});

// =============================================================================
// 4. graph/types.ts — lattice / complete constructors (residual arms documented)
// =============================================================================

describe('engine-coverage-round-8 — graph/types', () => {
  it('createHexLatticeGraph builds a connected lattice; bad-id continue unreachable', () => {
    // Documented unreachable: node ids are always `${q},${r}`, so
    // `q === undefined || r === undefined` after split never fires.
    const g = createHexLatticeGraph(1);
    expect(g.nodes.size).toBe(7);
    expect(g.edges.length).toBeGreaterThan(0);
    expect(g.directed).toBe(false);
  });

  it('createCompleteGraph densifies circular base; index holes unreachable', () => {
    // Documented unreachable: Array.from(Map.keys()) has no holes, so
    // `from !== undefined && to !== undefined` false arm never fires.
    const g = createCompleteGraph(4);
    expect(g.nodes.size).toBe(4);
    // K4 has 6 undirected edges.
    expect(g.edges).toHaveLength(6);
  });
});

// =============================================================================
// 5. graph/algorithms.ts — public paths + documented queue/Map guards
// =============================================================================

describe('engine-coverage-round-8 — graph/algorithms', () => {
  it('track graph covers bfs / dijkstra / reach / distance helpers', () => {
    const graph = createTrackGraph(4);
    expect(bfs(graph, 't0', 't3').found).toBe(true);
    expect(bfs(graph, 't0', 't0')).toEqual({
      found: true,
      path: ['t0'],
      distance: 0,
    });
    expect(dijkstra(graph, 't0', 't3').found).toBe(true);
    expect(isConnected(graph)).toBe(true);
    expect(findComponents(graph)).toHaveLength(1);
    expect(findReachable(graph, 't0').has('t3')).toBe(true);
    expect(findAllPaths(graph, 't0', 't2', 5).length).toBeGreaterThan(0);
    expect(findNodesAtDistance(graph, 't0', 2)).toEqual(['t2']);
    expect(findNodesWithinDistance(graph, 't0', 1).sort()).toEqual([
      't0',
      't1',
    ]);
  });

  it('player helpers on a forged GraphBoard', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 2 }],
      ]),
    };
    expect(findPlayerRegion(board, 't0', 1).sort()).toEqual(['t0', 't1']);
    expect(playerConnectsSets(board, 1, ['t0'], ['t1'])).toBe(true);
    expect(playerConnectsSets(board, 1, ['t0'], ['t2'])).toBe(false);
  });

  it('documents unreachable queue.shift / Map-miss continues', () => {
    // Documented unreachable on public paths (same class as r7 Map continues):
    // - `queue.shift()` → undefined while `queue.length > 0` (bfs / isConnected /
    //   findComponents / findReachable / findNodes* / findPlayerRegion /
    //   playerConnectsSets)
    // - `distances.get` / `currentDist` undefined after initialization (dijkstra)
    // - `startResult.done` after `nodes.size > 0` (isConnected)
    // These arms stay for defensive narrowing; no Map.prototype spy (isolate:false
    // AI calibration risk — see q-mp-252 round 7).
    const empty: Graph = { nodes: new Map(), edges: [], directed: false };
    expect(isConnected(empty)).toBe(true);
    expect(findComponents(empty)).toEqual([]);
  });

  it('dijkstra with edge to a node absent from nodes Map (stub path)', () => {
    // Neighbor missing from `graph.nodes` never enters `distances`; update skip
    // keeps prior quirk: found stub path for absent end.
    const graph: Graph = {
      nodes: new Map([['A', { id: 'A', position: { x: 0, y: 0 } }]]),
      edges: [{ from: 'A', to: 'B', weight: 1 }],
      directed: true,
    };
    const result = dijkstra(graph, 'A', 'B');
    expect(result.found).toBe(true);
    expect(result.path).toEqual(['B']);
  });
});
