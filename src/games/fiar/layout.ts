// FIAR board layout — verified against official kit photo + board art (2026-10).
// Source data: docs/mp3d/fiar-board/layout.json

export interface LayoutNode {
  id: string;
  /** Grid column index (c0..c8). */
  col: number;
  /** Grid row index (r0..r6). */
  row: number;
  x: number;
  y: number;
}

export interface LayoutEdge {
  from: string;
  to: string;
  /** True when traveling this edge crosses the central yellow area. */
  crossesYellowCenter: boolean;
}

/** Ellipse used by the yellow-center test fixture. */
export interface YellowCenterEllipse {
  kind: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** Diamond (square rotated 45°) marking the non-playable yellow center. */
export interface YellowCenterDiamond {
  kind: 'diamond';
  cx: number;
  cy: number;
  /** Half the diagonal length in world units (corner-to-center). */
  halfDiagonal: number;
}

export type YellowCenterShape = YellowCenterEllipse | YellowCenterDiamond;

export interface BoardLayout {
  id: string;
  /** False until an authoritative source confirms nodes/edges/center. */
  verified: boolean;
  sourceNote: string;
  spacing: number;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  yellowCenter: YellowCenterShape | null;
  /**
   * Whether the 4 diamond-outline diagonals are included as playable edges.
   * See INCLUDE_DIAMOND_BORDER_EDGES.
   */
  includeDiamondBorderEdges: boolean;
}

const SPACING = 80;
const OFFSET_X = 80;
const OFFSET_Y = 60;

/** Row → column indices that hold a playing space (landscape, c0..c8 × r0..r6). */
const ROW_COLS: ReadonlyArray<ReadonlyArray<number>> = [
  [3, 4, 5], // r0
  [1, 2, 3, 4, 5, 6], // r1
  [1, 2, 3, 4, 5, 6, 7], // r2
  [0, 1, 2, 3, 5, 6, 7, 8], // r3 — gap at c4 (yellow)
  [1, 2, 3, 4, 5, 6, 7], // r4
  [2, 3, 4, 5, 6, 7], // r5
  [3, 4, 5], // r6
];

/**
 * TODO(Math Pentathlon / Andrew): confirm whether the 4 red-orange diagonals
 * that form the yellow diamond's outline count as playable connecting lines
 * (c4r2–c3r3, c4r2–c5r3, c3r3–c4r4, c5r3–c4r4). Photos show them as the
 * diamond border; neither rules PDF addresses them. Default OFF → 24
 * four-or-more lines; ON → 28. Pending product decision.
 */
export const INCLUDE_DIAMOND_BORDER_EDGES = false;

const DIAMOND_BORDER_EDGES: ReadonlyArray<readonly [string, string]> = [
  ['c4r2', 'c3r3'],
  ['c4r2', 'c5r3'],
  ['c3r3', 'c4r4'],
  ['c5r3', 'c4r4'],
];

export function nodeId(col: number, row: number): string {
  return `c${col}r${row}`;
}

export function parseNodeId(id: string): { col: number; row: number } | null {
  const m = /^c(\d+)r(\d+)$/.exec(id);
  if (!m) return null;
  return { col: Number(m[1]), row: Number(m[2]) };
}

function buildConfirmedEdges(): Array<readonly [string, string]> {
  // Rebuild from adjacency rules so the source list cannot drift from ROW_COLS.
  const nodeSet = new Set<string>();
  for (let row = 0; row < ROW_COLS.length; row++) {
    for (const col of ROW_COLS[row]!) {
      nodeSet.add(nodeId(col, row));
    }
  }

  const dirs: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  const edges: Array<readonly [string, string]> = [];
  const seen = new Set<string>();

  for (const id of nodeSet) {
    const p = parseNodeId(id)!;
    for (const [dc, dr] of dirs) {
      const other = nodeId(p.col + dc, p.row + dr);
      if (!nodeSet.has(other)) continue;
      // No edge into / through the yellow center lattice point.
      if (
        (p.col === 4 && p.row === 3) ||
        (p.col + dc === 4 && p.row + dr === 3)
      ) {
        continue;
      }
      const key = edgeKey(id, other);
      if (seen.has(key)) continue;
      // Skip diamond-border diagonals here — gated separately.
      const isDiamondBorder = DIAMOND_BORDER_EDGES.some(
        ([a, b]) => edgeKey(a, b) === key
      );
      if (isDiamondBorder) continue;
      seen.add(key);
      edges.push([id, other]);
    }
  }

  return edges;
}

/**
 * Verified production layout: 40 spaces, 116 confirmed edges, yellow diamond
 * at c4r3 (not a space). Shape has 180° rotational symmetry only.
 */
export function createVerifiedProductionLayout(
  options: { includeDiamondBorderEdges?: boolean } = {}
): BoardLayout {
  const includeDiamond =
    options.includeDiamondBorderEdges ?? INCLUDE_DIAMOND_BORDER_EDGES;

  const nodes: LayoutNode[] = [];
  for (let row = 0; row < ROW_COLS.length; row++) {
    for (const col of ROW_COLS[row]!) {
      nodes.push({
        id: nodeId(col, row),
        col,
        row,
        x: OFFSET_X + col * SPACING,
        y: OFFSET_Y + row * SPACING,
      });
    }
  }

  const edges: LayoutEdge[] = buildConfirmedEdges().map(([from, to]) => ({
    from,
    to,
    crossesYellowCenter: false,
  }));

  if (includeDiamond) {
    for (const [from, to] of DIAMOND_BORDER_EDGES) {
      edges.push({ from, to, crossesYellowCenter: false });
    }
  }

  const cx = OFFSET_X + 4 * SPACING;
  const cy = OFFSET_Y + 3 * SPACING;

  return {
    id: includeDiamond ? 'fiar-40-verified-diamond-border' : 'fiar-40-verified',
    verified: true,
    sourceNote:
      'Verified 2026-10 from official product photo 2411_fiar_web.jpg + board art DivIIfiarwebcr.jpg (docs/mp3d/fiar-board/). 40 nodes, 116 confirmed edges; diamond-border diagonals gated by INCLUDE_DIAMOND_BORDER_EDGES.',
    spacing: SPACING,
    nodes,
    edges,
    yellowCenter: {
      kind: 'diamond',
      cx,
      cy,
      halfDiagonal: SPACING,
    },
    includeDiamondBorderEdges: includeDiamond,
  };
}

/** @deprecated Use createVerifiedProductionLayout — kept for import stability. */
export function createUnverifiedProductionLayout(): BoardLayout {
  return createVerifiedProductionLayout();
}

/**
 * Explicit test fixture: a small graph where the middle edge of a 5-node line
 * crosses the yellow center. Used to unit-test movement + win bridging rules.
 *
 * Layout (ids):
 *   a — b —[yellow]— c — d — e
 *              |
 *              f
 */
export function createYellowCenterTestLayout(): BoardLayout {
  const spacing = 80;
  const nodes: LayoutNode[] = [
    { id: 'a', col: 0, row: 0, x: 0, y: 0 },
    { id: 'b', col: 1, row: 0, x: spacing, y: 0 },
    { id: 'c', col: 2, row: 0, x: spacing * 2, y: 0 },
    { id: 'd', col: 3, row: 0, x: spacing * 3, y: 0 },
    { id: 'e', col: 4, row: 0, x: spacing * 4, y: 0 },
    { id: 'f', col: 2, row: 1, x: spacing * 2, y: spacing },
  ];
  const edges: LayoutEdge[] = [
    { from: 'a', to: 'b', crossesYellowCenter: false },
    { from: 'b', to: 'c', crossesYellowCenter: true },
    { from: 'c', to: 'd', crossesYellowCenter: false },
    { from: 'd', to: 'e', crossesYellowCenter: false },
    { from: 'c', to: 'f', crossesYellowCenter: false },
  ];
  return {
    id: 'fiar-yellow-fixture',
    verified: true,
    sourceNote: 'Synthetic fixture for yellow-center unit tests only.',
    spacing,
    nodes,
    edges,
    yellowCenter: {
      kind: 'ellipse',
      cx: spacing * 1.5,
      cy: 0,
      rx: spacing * 0.35,
      ry: spacing * 0.35,
    },
    includeDiamondBorderEdges: false,
  };
}

export function edgeKey(from: string, to: string): string {
  return from < to ? `${from}|${to}` : `${to}|${from}`;
}

/** Count of confirmed edges (always 116; diamond border optional extra). */
export function countConfirmedEdges(): number {
  return buildConfirmedEdges().length;
}
