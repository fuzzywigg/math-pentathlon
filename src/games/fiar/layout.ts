// FIAR board layout (nodes, edges, yellow center)
// Production layout is the historical 5×5 guess — NOT verified against the official board.
// Yellow-center crossing is data-driven so a verified layout can drop in later.

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
}

export interface LayoutEdge {
  from: string;
  to: string;
  /** True when traveling this edge crosses the central yellow area. */
  crossesYellowCenter: boolean;
}

/** Ellipse used for SVG / 3D rendering of the yellow center region. */
export interface YellowCenterEllipse {
  kind: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface BoardLayout {
  id: string;
  /** False until an authoritative source confirms nodes/edges/center. */
  verified: boolean;
  sourceNote: string;
  spacing: number;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  yellowCenter: YellowCenterEllipse | null;
}

const GRID_SIZE = 5;
const SPACING = 80;
const OFFSET_X = 200;
const OFFSET_Y = 100;

/**
 * Unverified production layout: legacy 5×5 with full H/V/diagonal edges.
 * Photos of the official kit show a yellow center the pathways go around, but
 * exact node coordinates and edge lists were not recoverable from public sources
 * (product photos are oblique / partially occluded; Rule Manual is not online).
 * No production edge is marked as crossing yellow until a verified layout lands.
 */
export function createUnverifiedProductionLayout(): BoardLayout {
  const nodes: LayoutNode[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      nodes.push({
        id: `${row}-${col}`,
        x: OFFSET_X + col * SPACING,
        y: OFFSET_Y + row * SPACING,
      });
    }
  }

  const edges: LayoutEdge[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const id = `${row}-${col}`;
      if (col < GRID_SIZE - 1) {
        edges.push({
          from: id,
          to: `${row}-${col + 1}`,
          crossesYellowCenter: false,
        });
      }
      if (row < GRID_SIZE - 1) {
        edges.push({
          from: id,
          to: `${row + 1}-${col}`,
          crossesYellowCenter: false,
        });
      }
      if (row < GRID_SIZE - 1 && col < GRID_SIZE - 1) {
        edges.push({
          from: id,
          to: `${row + 1}-${col + 1}`,
          crossesYellowCenter: false,
        });
      }
      if (row < GRID_SIZE - 1 && col > 0) {
        edges.push({
          from: id,
          to: `${row + 1}-${col - 1}`,
          crossesYellowCenter: false,
        });
      }
    }
  }

  const centerX = OFFSET_X + 2 * SPACING;
  const centerY = OFFSET_Y + 2 * SPACING;

  return {
    id: 'fiar-5x5-unverified',
    verified: false,
    sourceNote:
      'No authoritative node/edge map found (mathpentath.org product photos + Division II highlights). Keeping legacy 5×5; yellow-crossing edges empty pending verified layout.',
    spacing: SPACING,
    nodes,
    edges,
    // Visual cue only — no edges marked as crossing on this unverified map.
    yellowCenter: {
      kind: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: SPACING * 0.55,
      ry: SPACING * 0.55,
    },
  };
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
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: spacing, y: 0 },
    { id: 'c', x: spacing * 2, y: 0 },
    { id: 'd', x: spacing * 3, y: 0 },
    { id: 'e', x: spacing * 4, y: 0 },
    { id: 'f', x: spacing * 2, y: spacing },
  ];
  const edges: LayoutEdge[] = [
    { from: 'a', to: 'b', crossesYellowCenter: false },
    // Crossing yellow between b and c
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
  };
}

export function edgeKey(from: string, to: string): string {
  return from < to ? `${from}|${to}` : `${to}|${from}`;
}
