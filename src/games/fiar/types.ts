// FIAR (Four In A Row) Game Types
// Division II alignment game: place then move chips to form 4 in a row

import type { BoardLayout, LayoutEdge, YellowCenterShape } from './layout';
import { createVerifiedProductionLayout, edgeKey } from './layout';

export type Player = 'player1' | 'player2';

/** Plain chip or Fire Extinguisher (marked blocker). Dot color is a theme value. */
export type ChipKind = 'plain' | 'marked';

export interface BoardNode {
  id: string;
  x: number;
  y: number;
  chip: Player | null;
  chipKind: ChipKind | null;
}

export interface BoardEdge {
  from: string;
  to: string;
  crossesYellowCenter: boolean;
}

export interface FiarBoard {
  nodes: Map<string, BoardNode>;
  edges: BoardEdge[];
  /** Quick lookup: undirected edge key → crosses yellow. */
  yellowCrossingKeys: Set<string>;
  yellowCenter: YellowCenterShape | null;
  spacing: number;
  layoutId: string;
  layoutVerified: boolean;
  /**
   * Maximal straight lines of length ≥ WIN_LENGTH (layout-static).
   * Filled lazily by getStraightLines in rules.ts.
   */
  straightLinesCache?: string[][];
}

export type GamePhase = 'placement' | 'movement' | 'gameOver';

export interface ChipInventory {
  plain: number;
  marked: number;
}

export interface FiarGameState {
  board: FiarBoard;
  currentPlayer: Player;
  phase: GamePhase;
  /** How many chips each seat has placed (plain + marked). */
  chipsPlaced: { player1: number; player2: number };
  /** Remaining chips in hand, by kind. */
  chipInventory: { player1: ChipInventory; player2: ChipInventory };
  /** Chip kind the current player will place next. */
  selectedChipKind: ChipKind;
  selectedNode: string | null;
  winner: Player | null;
  /** Node ids of the chips that formed the winning path (may include gaps between). */
  winningPath: string[] | null;
  /** Color of the chips on the winning path (may differ from winner). */
  winningPathColor: Player | null;
  starter: Player;
  moveHistory: FiarMove[];
}

export interface FiarMove {
  player: Player;
  type: 'place' | 'move';
  nodeId: string;
  fromNodeId?: string;
  chipKind?: ChipKind;
  moveNumber: number;
}

export interface PathResult {
  nodes: string[];
  isBlocked: boolean;
  color: Player;
}

export const CONFIG = {
  CHIPS_PER_PLAYER: 7,
  MARKED_CHIPS_PER_PLAYER: 2,
  PLAIN_CHIPS_PER_PLAYER: 5,
  WIN_LENGTH: 4,
  NODE_RADIUS: 24,
  EDGE_STROKE: 3,
};

export interface CreateInitialStateOptions {
  starter?: Player;
  layout?: BoardLayout;
}

function inventoryFor(seat: Player): ChipInventory {
  void seat;
  return {
    plain: CONFIG.PLAIN_CHIPS_PER_PLAYER,
    marked: CONFIG.MARKED_CHIPS_PER_PLAYER,
  };
}

export function createBoardFromLayout(layout: BoardLayout): FiarBoard {
  const nodes = new Map<string, BoardNode>();
  for (const n of layout.nodes) {
    nodes.set(n.id, {
      id: n.id,
      x: n.x,
      y: n.y,
      chip: null,
      chipKind: null,
    });
  }

  const edges: BoardEdge[] = layout.edges.map((e: LayoutEdge) => ({
    from: e.from,
    to: e.to,
    crossesYellowCenter: e.crossesYellowCenter,
  }));

  const yellowCrossingKeys = new Set<string>();
  for (const e of edges) {
    if (e.crossesYellowCenter) {
      yellowCrossingKeys.add(edgeKey(e.from, e.to));
    }
  }

  return {
    nodes,
    edges,
    yellowCrossingKeys,
    yellowCenter: layout.yellowCenter,
    spacing: layout.spacing,
    layoutId: layout.id,
    layoutVerified: layout.verified,
  };
}

/** Create the FIAR board from the verified production layout. */
export function createFiarBoard(layout?: BoardLayout): FiarBoard {
  return createBoardFromLayout(layout ?? createVerifiedProductionLayout());
}

export function createInitialState(
  options: CreateInitialStateOptions = {}
): FiarGameState {
  const starter = options.starter ?? 'player1';
  const layout = options.layout ?? createVerifiedProductionLayout();
  return {
    board: createBoardFromLayout(layout),
    currentPlayer: starter,
    phase: 'placement',
    chipsPlaced: { player1: 0, player2: 0 },
    chipInventory: {
      player1: inventoryFor('player1'),
      player2: inventoryFor('player2'),
    },
    selectedChipKind: 'plain',
    selectedNode: null,
    winner: null,
    winningPath: null,
    winningPathColor: null,
    starter,
    moveHistory: [],
  };
}

export { getOpponentSeat as getOpponent } from '../../core/seats';

export function chipsRemaining(inv: ChipInventory): number {
  return inv.plain + inv.marked;
}

export function areConnected(
  board: FiarBoard,
  nodeA: string,
  nodeB: string
): boolean {
  return board.edges.some(
    (edge) =>
      (edge.from === nodeA && edge.to === nodeB) ||
      (edge.from === nodeB && edge.to === nodeA)
  );
}

function edgeCrossesYellow(
  board: FiarBoard,
  nodeA: string,
  nodeB: string
): boolean {
  return board.yellowCrossingKeys.has(edgeKey(nodeA, nodeB));
}

export function getConnectedNodes(board: FiarBoard, nodeId: string): string[] {
  const connected: string[] = [];
  for (const edge of board.edges) {
    if (edge.from === nodeId) {
      connected.push(edge.to);
    } else if (edge.to === nodeId) {
      connected.push(edge.from);
    }
  }
  return connected;
}

/**
 * Nodes in a straight line from start along (dx, dy), following edges.
 * Stops at board edge, missing connection, or (by default) a yellow-crossing edge.
 */
export function getNodesInDirection(
  board: FiarBoard,
  startId: string,
  dx: number,
  dy: number,
  options: { allowYellowCrossing?: boolean } = {}
): string[] {
  const result: string[] = [];
  const startNode = board.nodes.get(startId);
  if (!startNode) {
    return result;
  }

  let currentX = startNode.x;
  let currentY = startNode.y;
  const allowYellow = options.allowYellowCrossing === true;

  while (true) {
    currentX += dx;
    currentY += dy;

    let found = false;
    for (const [id, node] of board.nodes) {
      if (
        Math.abs(node.x - currentX) < 10 &&
        Math.abs(node.y - currentY) < 10
      ) {
        const prevId = result.length > 0 ? result[result.length - 1] : startId;
        if (prevId === undefined) {
          break;
        }
        if (!areConnected(board, prevId, id)) {
          break;
        }
        if (!allowYellow && edgeCrossesYellow(board, prevId, id)) {
          return result;
        }
        result.push(id);
        found = true;
        break;
      }
    }

    if (!found) {
      break;
    }
  }

  return result;
}

export function getDirections(
  spacing: number = CONFIG_SPACING_FALLBACK
): { dx: number; dy: number }[] {
  return [
    { dx: spacing, dy: 0 },
    { dx: -spacing, dy: 0 },
    { dx: 0, dy: spacing },
    { dx: 0, dy: -spacing },
    { dx: spacing, dy: spacing },
    { dx: -spacing, dy: -spacing },
    { dx: spacing, dy: -spacing },
    { dx: -spacing, dy: spacing },
  ];
}

const CONFIG_SPACING_FALLBACK = 80;

export function getBoardDirections(board: FiarBoard): {
  dx: number;
  dy: number;
}[] {
  return getDirections(board.spacing || CONFIG_SPACING_FALLBACK);
}

/** Re-export layout helpers used by tests / 3D. */
export {
  createVerifiedProductionLayout,
  createYellowCenterTestLayout,
  INCLUDE_DIAMOND_BORDER_EDGES,
  parseNodeId,
  nodeId,
  countConfirmedEdges,
} from './layout';
export type {
  BoardLayout,
  YellowCenterEllipse,
  YellowCenterDiamond,
  YellowCenterShape,
} from './layout';
