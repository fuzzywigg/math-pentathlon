// FIAR AI — Division II rules (7 chips, marked blockers, gapped wins, either color)

import {
  FiarGameState,
  Player,
  ChipKind,
  CONFIG,
  getOpponent,
  getNodesInDirection,
  getBoardDirections,
  chipsRemaining,
  parseNodeId,
} from './types';

import {
  canPlaceChip,
  placeChip,
  getValidMoves,
  getSelectableNodes,
  moveChip,
  findPaths,
  findAnyWinningPath,
  setSelectedChipKind,
  normalizeSelectedChipKind,
} from './rules';
import { createSeededRng } from '../../core/ai-worker/seeded-rng';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface AIMove {
  type: 'place' | 'move';
  nodeId?: string;
  chipKind?: ChipKind;
  from?: string;
  to?: string;
}

/** Optional search controls — defaults preserve historical Math.random behavior. */
export interface AISearchOptions {
  /** Deterministic PRNG seed (worker/direct parity tests). */
  seed?: number;
  /**
   * Soft wall-time budget (ms). When exceeded between root-move evaluations,
   * return the best move scored so far. Depth is never reduced.
   */
  deadlineMs?: number;
  /** Clock override for tests. */
  now?: () => number;
}

export interface AISearchResult {
  move: AIMove | null;
  truncated: boolean;
}

interface SearchCtx {
  rng: () => number;
  now: () => number;
  deadline: number;
}

const DIFFICULTY_CONFIG = {
  // teachingBlunder: ignore search and pick a uniform legal move. Calibrated so
  // Easy < Hard vs random (depth-1 search was matching/beating Hard's win rate).
  easy: {
    maxDepth: 1,
    randomness: 0.55,
    considerMarked: true,
    // Tip-safe Easy weaken: Hard maxDepth stays 2 (depth 3 breaks HARD_FLAG_MS).
    teachingBlunder: 0.5,
  },
  medium: {
    maxDepth: 2,
    randomness: 0.12,
    considerMarked: true,
    teachingBlunder: 0,
  },
  // maxDepth stays 2 on tip — Hard movement at depth 3 exceeds HARD_FLAG_MS (500)
  // in the mid-game time bench when uncapped; Easy teachingBlunder restores order.
  hard: {
    maxDepth: 2,
    randomness: 0.02,
    considerMarked: true,
    teachingBlunder: 0,
  },
};

// =============================================================================
// Threat / win helpers
// =============================================================================

function wouldWinAfterPlace(
  state: FiarGameState,
  nodeId: string,
  kind: ChipKind
): boolean {
  if (!canPlaceChip(state, nodeId, kind)) return false;
  const next = placeChip(state, nodeId, kind);
  return next.winner === state.currentPlayer;
}

function wouldWinAfterMove(
  state: FiarGameState,
  from: string,
  to: string
): boolean {
  const next = moveChip(state, from, to);
  return next.winner === state.currentPlayer;
}

/** Opponent would have a winning path if they acted on this position. */
function opponentHasImmediateWin(state: FiarGameState): boolean {
  const opp = getOpponent(state.currentPlayer);
  const oppState: FiarGameState = {
    ...state,
    currentPlayer: opp,
  };
  if (oppState.phase === 'placement') {
    const kinds = availableKinds(oppState, opp);
    for (const [nodeId] of oppState.board.nodes) {
      for (const kind of kinds) {
        if (wouldWinAfterPlace(oppState, nodeId, kind)) return true;
      }
    }
  } else if (oppState.phase === 'movement') {
    for (const [nodeId, node] of oppState.board.nodes) {
      if (node.chip !== opp) continue;
      for (const to of getValidMoves(oppState, nodeId)) {
        if (wouldWinAfterMove(oppState, nodeId, to)) return true;
      }
    }
  }
  return false;
}

function availableKinds(state: FiarGameState, player: Player): ChipKind[] {
  const inv = state.chipInventory[player];
  const kinds: ChipKind[] = [];
  if (inv.plain > 0) kinds.push('plain');
  if (inv.marked > 0) kinds.push('marked');
  return kinds;
}

/**
 * Prefer plain chips; use marked when it uniquely creates a block (adjacent to
 * an opponent threat line) or when no plain chips remain.
 */
function chooseKindForPlacement(
  state: FiarGameState,
  nodeId: string,
  difficulty: AIDifficulty,
  rng: () => number
): ChipKind | null {
  const kinds = availableKinds(state, state.currentPlayer);
  if (kinds.length === 0) return null;
  if (kinds.length === 1) return kinds[0];

  // Immediate win with either kind — prefer plain to save marked
  const plainWins = wouldWinAfterPlace(state, nodeId, 'plain');
  const markedWins = wouldWinAfterPlace(state, nodeId, 'marked');
  if (plainWins) return 'plain';
  if (markedWins) return 'marked';

  if (difficulty === 'easy') {
    return rng() < 0.2 ? 'marked' : 'plain';
  }

  // Use marked if placing it adjacent to an opponent 3+ threat blocks them
  const opp = getOpponent(state.currentPlayer);
  const oppPaths = findPaths(state, opp);
  const threatens = oppPaths.some((p) => p.nodes.length >= 3 && !p.isBlocked);
  if (threatens) {
    const afterMarked = placeChip(state, nodeId, 'marked');
    if (afterMarked.phase !== 'gameOver') {
      const stillThreat = findPaths(afterMarked, opp).some(
        (p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH - 1
      );
      const beforeThreat = findPaths(state, opp).some(
        (p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH - 1
      );
      // If this node is adjacent to an opponent path node, marked is valuable
      const adjacentToOpp = [...state.board.nodes.values()].some((n) => {
        if (n.chip !== opp) return false;
        return state.board.edges.some(
          (e) =>
            (e.from === nodeId && e.to === n.id) ||
            (e.to === nodeId && e.from === n.id)
        );
      });
      if (adjacentToOpp && beforeThreat && stillThreat) {
        return 'marked';
      }
      void stillThreat;
    }
  }

  // Mid/late placement: save marked (use plain)
  return 'plain';
}

// =============================================================================
// Evaluation
// =============================================================================

function evaluatePosition(state: FiarGameState, aiPlayer: Player): number {
  const opponent = getOpponent(aiPlayer);

  if (state.winner === aiPlayer) return 10000;
  if (state.winner === opponent) return -10000;

  // Either-color path that the opponent would claim on their turn is bad
  const anyWin = findAnyWinningPath(state);
  if (anyWin) {
    // Position already has a win pending — whoever acts next claims it
    return state.currentPlayer === aiPlayer ? 8000 : -8000;
  }

  let score = 0;
  const aiPaths = findPaths(state, aiPlayer);
  const oppPaths = findPaths(state, opponent);

  for (const path of aiPaths) {
    score += path.isBlocked
      ? path.nodes.length * 15
      : path.nodes.length * path.nodes.length * 40;
  }
  for (const path of oppPaths) {
    score -= path.isBlocked
      ? path.nodes.length * 15
      : path.nodes.length * path.nodes.length * 45;
  }

  score += evaluatePotentialPaths(state, aiPlayer);
  score -= evaluatePotentialPaths(state, opponent) * 1.1;

  // Conserve marked chips
  const inv = state.chipInventory[aiPlayer];
  score += inv.marked * 25;

  if (state.phase === 'placement') {
    score += evaluateCenterControl(state, aiPlayer) * 10;
    score -= evaluateCenterControl(state, opponent) * 10;
  }

  return score;
}

function evaluatePotentialPaths(state: FiarGameState, player: Player): number {
  let score = 0;
  const dirs = getBoardDirections(state.board).slice(0, 4);

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;

    for (const dir of dirs) {
      let lineLength = 1;
      let emptySpaces = 0;
      let blocked = false;

      for (const id of getNodesInDirection(
        state.board,
        nodeId,
        dir.dx,
        dir.dy
      )) {
        const n = state.board.nodes.get(id);
        if (!n) break;
        if (n.chip === player) lineLength++;
        else if (n.chip === null) emptySpaces++;
        else {
          blocked = true;
          break;
        }
        if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH) break;
      }

      for (const id of getNodesInDirection(
        state.board,
        nodeId,
        -dir.dx,
        -dir.dy
      )) {
        const n = state.board.nodes.get(id);
        if (!n) break;
        if (n.chip === player) lineLength++;
        else if (n.chip === null) emptySpaces++;
        else {
          blocked = true;
          break;
        }
        if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH) break;
      }

      if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH && !blocked) {
        score += lineLength * lineLength * 5;
      }
    }
  }

  return score;
}

function evaluateCenterControl(state: FiarGameState, player: Player): number {
  let score = 0;
  // Prefer spaces near the yellow diamond (c4r3) without occupying it.
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;
    const p = parseNodeId(nodeId);
    if (!p) continue;
    const dist = Math.abs(p.col - 4) + Math.abs(p.row - 3);
    score += Math.max(0, 5 - dist);
  }
  return score;
}

/** Cheap static placement score used to prune root candidates on the 40-node board. */
function quickPlaceScore(
  state: FiarGameState,
  nodeId: string,
  aiPlayer: Player
): number {
  const p = parseNodeId(nodeId);
  let score = 0;
  if (p) {
    score += Math.max(0, 5 - (Math.abs(p.col - 4) + Math.abs(p.row - 3))) * 3;
  }
  // Prefer nodes that sit on longer maximal lines
  for (const line of state.board.straightLinesCache ?? []) {
    if (!line.includes(nodeId)) continue;
    score += line.length;
  }
  void aiPlayer;
  return score;
}

// =============================================================================
// Placement search
// =============================================================================

function getBestPlacement(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty,
  ctx: SearchCtx
): {
  place: { nodeId: string; chipKind: ChipKind } | null;
  truncated: boolean;
} {
  const config = DIFFICULTY_CONFIG[difficulty];
  state = normalizeSelectedChipKind(state);

  // 1) Take immediate win (either color via auto-detect)
  for (const [nodeId] of state.board.nodes) {
    for (const kind of availableKinds(state, aiPlayer)) {
      if (wouldWinAfterPlace(state, nodeId, kind)) {
        return {
          place: {
            nodeId,
            chipKind:
              kind === 'marked' &&
              canPlaceChip(state, nodeId, 'plain') &&
              wouldWinAfterPlace(state, nodeId, 'plain')
                ? 'plain'
                : kind,
          },
          truncated: false,
        };
      }
    }
  }

  // 2) Block opponent immediate win if possible
  if (difficulty !== 'easy' || ctx.rng() > 0.35) {
    const block = findBlockingPlacement(state, aiPlayer);
    if (block) return { place: block, truncated: false };
  }

  // Warm line cache once, then rank empties before expensive search.
  void findPaths(state, aiPlayer);

  const empties: string[] = [];
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip === null) empties.push(nodeId);
  }
  empties.sort(
    (a, b) =>
      quickPlaceScore(state, b, aiPlayer) - quickPlaceScore(state, a, aiPlayer)
  );

  // Easy: heuristic pick only (tablet-friendly). Medium/hard: top candidates.
  const rootCap = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 14;
  const candidates = empties.slice(0, Math.max(rootCap, 1));

  const placements: { nodeId: string; chipKind: ChipKind; score: number }[] =
    [];
  const chipsOut = state.chipsPlaced.player1 + state.chipsPlaced.player2;

  let truncated = false;
  for (const nodeId of candidates) {
    if (ctx.now() >= ctx.deadline) {
      truncated = true;
      break;
    }
    const kind = chooseKindForPlacement(state, nodeId, difficulty, ctx.rng);
    if (!kind || !canPlaceChip(state, nodeId, kind)) continue;

    const newState = placeChip(state, nodeId, kind);
    // Avoid handing opponent an instant win (skip early-game full scan)
    if (
      difficulty !== 'easy' &&
      chipsOut >= 4 &&
      newState.winner === null &&
      opponentHasImmediateWin({
        ...newState,
        currentPlayer: getOpponent(aiPlayer),
      })
    ) {
      placements.push({ nodeId, chipKind: kind, score: -5000 });
      continue;
    }

    if (difficulty === 'easy') {
      placements.push({
        nodeId,
        chipKind: kind,
        score: quickPlaceScore(state, nodeId, aiPlayer),
      });
      continue;
    }

    const score = minimax(
      newState,
      Math.min(config.maxDepth - 1, 1),
      -Infinity,
      Infinity,
      false,
      aiPlayer
    );
    placements.push({ nodeId, chipKind: kind, score });
  }

  if (placements.length === 0) return { place: null, truncated };
  placements.sort((a, b) => b.score - a.score);

  if (ctx.rng() < config.randomness && placements.length > 1) {
    const idx = Math.floor(ctx.rng() * Math.min(3, placements.length));
    return {
      place: {
        nodeId: placements[idx].nodeId,
        chipKind: placements[idx].chipKind,
      },
      truncated,
    };
  }

  return {
    place: {
      nodeId: placements[0].nodeId,
      chipKind: placements[0].chipKind,
    },
    truncated,
  };
}

function findBlockingPlacement(
  state: FiarGameState,
  aiPlayer: Player
): { nodeId: string; chipKind: ChipKind } | null {
  const opp = getOpponent(aiPlayer);
  const oppState: FiarGameState = { ...state, currentPlayer: opp };

  // Find placements that deny opponent's winning place
  const dangerous: string[] = [];
  for (const [nodeId] of state.board.nodes) {
    for (const kind of availableKinds(oppState, opp)) {
      if (wouldWinAfterPlace(oppState, nodeId, kind)) {
        dangerous.push(nodeId);
      }
    }
  }

  for (const nodeId of dangerous) {
    // Occupy the square with plain if possible
    if (canPlaceChip(state, nodeId, 'plain')) {
      return { nodeId, chipKind: 'plain' };
    }
    if (canPlaceChip(state, nodeId, 'marked')) {
      return { nodeId, chipKind: 'marked' };
    }
  }

  // Place a marked chip adjacent to a nearly-complete opponent path
  const oppPaths = findPaths(state, opp).filter(
    (p) => !p.isBlocked && p.nodes.length >= 3
  );
  if (oppPaths.length > 0 && state.chipInventory[aiPlayer].marked > 0) {
    for (const path of oppPaths) {
      for (const pathNode of path.nodes) {
        for (const edge of state.board.edges) {
          const neighbor =
            edge.from === pathNode
              ? edge.to
              : edge.to === pathNode
                ? edge.from
                : null;
          if (!neighbor) continue;
          const n = state.board.nodes.get(neighbor);
          if (n?.chip === null && canPlaceChip(state, neighbor, 'marked')) {
            return { nodeId: neighbor, chipKind: 'marked' };
          }
        }
      }
    }
  }

  return null;
}

// =============================================================================
// Movement search
// =============================================================================

function getBestMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty,
  ctx: SearchCtx
): { move: { from: string; to: string } | null; truncated: boolean } {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves: { from: string; to: string; score: number }[] = [];

  // Immediate wins first (own color or opponent color)
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== aiPlayer) continue;
    for (const to of getValidMoves(state, nodeId)) {
      if (wouldWinAfterMove(state, nodeId, to)) {
        return { move: { from: nodeId, to }, truncated: false };
      }
    }
  }

  let truncated = false;
  outer: for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== aiPlayer) continue;
    for (const to of getValidMoves(state, nodeId)) {
      if (ctx.now() >= ctx.deadline) {
        truncated = true;
        break outer;
      }
      const newState = moveChip(state, nodeId, to);
      if (
        difficulty !== 'easy' &&
        newState.winner === null &&
        opponentHasImmediateWin({
          ...newState,
          currentPlayer: getOpponent(aiPlayer),
        })
      ) {
        moves.push({ from: nodeId, to, score: -8000 });
        continue;
      }
      const score = minimax(
        newState,
        config.maxDepth - 1,
        -Infinity,
        Infinity,
        false,
        aiPlayer
      );
      moves.push({ from: nodeId, to, score });
    }
  }

  if (moves.length === 0) return { move: null, truncated };
  moves.sort((a, b) => b.score - a.score);

  if (ctx.rng() < config.randomness && moves.length > 1) {
    const idx = Math.floor(ctx.rng() * Math.min(3, moves.length));
    return { move: { from: moves[idx].from, to: moves[idx].to }, truncated };
  }

  return { move: { from: moves[0].from, to: moves[0].to }, truncated };
}

// =============================================================================
// Minimax
// =============================================================================

function minimax(
  state: FiarGameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  if (depth <= 0 || state.phase === 'gameOver' || state.winner) {
    return evaluatePosition(state, aiPlayer);
  }

  if (state.phase === 'placement') {
    const options: { nodeId: string; kind: ChipKind }[] = [];
    for (const [nodeId] of state.board.nodes) {
      for (const kind of availableKinds(state, state.currentPlayer)) {
        if (canPlaceChip(state, nodeId, kind)) {
          options.push({ nodeId, kind });
        }
      }
    }
    // Cap branching for tablet speed (40-node board)
    const capped =
      options.length > 12
        ? options.filter((_, i) => i % Math.ceil(options.length / 12) === 0)
        : options;

    if (capped.length === 0) return evaluatePosition(state, aiPlayer);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const opt of capped) {
        const evalScore = minimax(
          placeChip(state, opt.nodeId, opt.kind),
          depth - 1,
          alpha,
          beta,
          false,
          aiPlayer
        );
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    }

    let minEval = Infinity;
    for (const opt of capped) {
      const evalScore = minimax(
        placeChip(state, opt.nodeId, opt.kind),
        depth - 1,
        alpha,
        beta,
        true,
        aiPlayer
      );
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }

  // Movement
  const allMoves: { from: string; to: string }[] = [];
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== state.currentPlayer) continue;
    for (const to of getValidMoves(state, nodeId)) {
      allMoves.push({ from: nodeId, to });
    }
  }

  const cappedMoves =
    allMoves.length > 24
      ? allMoves.filter((_, i) => i % Math.ceil(allMoves.length / 24) === 0)
      : allMoves;

  if (cappedMoves.length === 0) return evaluatePosition(state, aiPlayer);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of cappedMoves) {
      const evalScore = minimax(
        moveChip(state, move.from, move.to),
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer
      );
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of cappedMoves) {
    const evalScore = minimax(
      moveChip(state, move.from, move.to),
      depth - 1,
      alpha,
      beta,
      true,
      aiPlayer
    );
    minEval = Math.min(minEval, evalScore);
    beta = Math.min(beta, evalScore);
    if (beta <= alpha) break;
  }
  return minEval;
}

// =============================================================================
// Public API
// =============================================================================

export function searchAIMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AISearchResult {
  if (state.phase === 'gameOver' || state.winner) {
    return { move: null, truncated: false };
  }
  if (state.currentPlayer !== aiPlayer) {
    return { move: null, truncated: false };
  }

  const rng =
    options.seed === undefined ? Math.random : createSeededRng(options.seed);
  const now = options.now ?? (() => performance.now());
  const started = now();
  const deadline =
    options.deadlineMs === undefined
      ? Number.POSITIVE_INFINITY
      : started + options.deadlineMs;
  const ctx: SearchCtx = { rng, now, deadline };
  const config = DIFFICULTY_CONFIG[difficulty];

  // Easy teaching blunders: uniform legal move (still always legal).
  if (config.teachingBlunder > 0 && rng() < config.teachingBlunder) {
    if (state.phase === 'placement') {
      const kinds: ChipKind[] = [];
      const inv = state.chipInventory[aiPlayer];
      if (inv.plain > 0) kinds.push('plain');
      if (config.considerMarked && inv.marked > 0) kinds.push('marked');
      const legal: { nodeId: string; chipKind: ChipKind }[] = [];
      for (const chipKind of kinds) {
        for (const nodeId of state.board.nodes.keys()) {
          if (canPlaceChip(state, nodeId, chipKind)) {
            legal.push({ nodeId, chipKind });
          }
        }
      }
      if (legal.length > 0) {
        const pick = legal[Math.floor(rng() * legal.length)];
        return {
          move: { type: 'place', nodeId: pick.nodeId, chipKind: pick.chipKind },
          truncated: false,
        };
      }
    } else if (state.phase === 'movement') {
      const selectable = getSelectableNodes(state);
      const legal: { from: string; to: string }[] = [];
      for (const from of selectable) {
        for (const to of getValidMoves(state, from)) {
          legal.push({ from, to });
        }
      }
      if (legal.length > 0) {
        const pick = legal[Math.floor(rng() * legal.length)];
        return {
          move: { type: 'move', from: pick.from, to: pick.to },
          truncated: false,
        };
      }
    }
  }

  if (state.phase === 'placement') {
    if (chipsRemaining(state.chipInventory[aiPlayer]) === 0) {
      return { move: null, truncated: false };
    }
    const { place, truncated } = getBestPlacement(
      state,
      aiPlayer,
      difficulty,
      ctx
    );
    if (place) {
      return {
        move: {
          type: 'place',
          nodeId: place.nodeId,
          chipKind: place.chipKind,
        },
        truncated,
      };
    }
    return { move: null, truncated };
  }

  if (state.phase === 'movement') {
    const { move, truncated } = getBestMove(state, aiPlayer, difficulty, ctx);
    if (move) {
      return {
        move: { type: 'move', from: move.from, to: move.to },
        truncated,
      };
    }
    return { move: null, truncated };
  }

  return { move: null, truncated: false };
}

export function getAIMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AIMove | null {
  return searchAIMove(state, aiPlayer, difficulty, options).move;
}

export function applyAIMove(state: FiarGameState, move: AIMove): FiarGameState {
  if (move.type === 'place' && move.nodeId) {
    const kind = move.chipKind ?? 'plain';
    let s = setSelectedChipKind(state, kind);
    s = normalizeSelectedChipKind(s);
    return placeChip(s, move.nodeId, kind);
  }
  if (move.type === 'move' && move.from && move.to) {
    return moveChip(state, move.from, move.to);
  }
  return state;
}
