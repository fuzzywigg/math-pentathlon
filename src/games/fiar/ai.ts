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
} from './types';

import {
  canPlaceChip,
  placeChip,
  getValidMoves,
  moveChip,
  findPaths,
  findAnyWinningPath,
  setSelectedChipKind,
  normalizeSelectedChipKind,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 1, randomness: 0.45, considerMarked: true },
  medium: { maxDepth: 2, randomness: 0.12, considerMarked: true },
  hard: { maxDepth: 2, randomness: 0.04, considerMarked: true },
};

export interface AIMove {
  type: 'place' | 'move';
  nodeId?: string;
  chipKind?: ChipKind;
  from?: string;
  to?: string;
}

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
  difficulty: AIDifficulty
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
    return Math.random() < 0.2 ? 'marked' : 'plain';
  }

  // Use marked if placing it adjacent to an opponent 3+ threat blocks them
  const opp = getOpponent(state.currentPlayer);
  const oppPaths = findPaths(state, opp);
  const threatens = oppPaths.some(
    (p) => p.nodes.length >= 3 && !p.isBlocked
  );
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

      for (const id of getNodesInDirection(state.board, nodeId, dir.dx, dir.dy)) {
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
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;
    const parts = nodeId.split('-').map(Number);
    if (parts.length === 2 && !Number.isNaN(parts[0])) {
      const dist = Math.abs(parts[0] - 2) + Math.abs(parts[1] - 2);
      score += 4 - dist;
    }
  }
  return score;
}

// =============================================================================
// Placement search
// =============================================================================

function getBestPlacement(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty
): { nodeId: string; chipKind: ChipKind } | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  state = normalizeSelectedChipKind(state);

  // 1) Take immediate win (either color via auto-detect)
  for (const [nodeId] of state.board.nodes) {
    for (const kind of availableKinds(state, aiPlayer)) {
      if (wouldWinAfterPlace(state, nodeId, kind)) {
        return { nodeId, chipKind: kind === 'marked' && canPlaceChip(state, nodeId, 'plain') && wouldWinAfterPlace(state, nodeId, 'plain') ? 'plain' : kind };
      }
    }
  }

  // 2) Block opponent immediate win if possible
  if (difficulty !== 'easy' || Math.random() > 0.35) {
    const block = findBlockingPlacement(state, aiPlayer);
    if (block) return block;
  }

  const placements: { nodeId: string; chipKind: ChipKind; score: number }[] =
    [];

  for (const [nodeId] of state.board.nodes) {
    const kind = chooseKindForPlacement(state, nodeId, difficulty);
    if (!kind || !canPlaceChip(state, nodeId, kind)) continue;

    const newState = placeChip(state, nodeId, kind);
    // Avoid handing opponent an instant win
    if (
      difficulty !== 'easy' &&
      newState.winner === null &&
      opponentHasImmediateWin({
        ...newState,
        currentPlayer: getOpponent(aiPlayer),
      })
    ) {
      placements.push({ nodeId, chipKind: kind, score: -5000 });
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
    placements.push({ nodeId, chipKind: kind, score });
  }

  if (placements.length === 0) return null;
  placements.sort((a, b) => b.score - a.score);

  if (Math.random() < config.randomness && placements.length > 1) {
    const idx = Math.floor(Math.random() * Math.min(3, placements.length));
    return { nodeId: placements[idx].nodeId, chipKind: placements[idx].chipKind };
  }

  return {
    nodeId: placements[0].nodeId,
    chipKind: placements[0].chipKind,
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
  difficulty: AIDifficulty
): { from: string; to: string } | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves: { from: string; to: string; score: number }[] = [];

  // Immediate wins first (own color or opponent color)
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== aiPlayer) continue;
    for (const to of getValidMoves(state, nodeId)) {
      if (wouldWinAfterMove(state, nodeId, to)) {
        return { from: nodeId, to };
      }
    }
  }

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== aiPlayer) continue;
    for (const to of getValidMoves(state, nodeId)) {
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

  if (moves.length === 0) return null;
  moves.sort((a, b) => b.score - a.score);

  if (Math.random() < config.randomness && moves.length > 1) {
    const idx = Math.floor(Math.random() * Math.min(3, moves.length));
    return { from: moves[idx].from, to: moves[idx].to };
  }

  return { from: moves[0].from, to: moves[0].to };
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
    // Cap branching for tablet speed
    const capped =
      options.length > 18
        ? options.filter((_, i) => i % Math.ceil(options.length / 18) === 0)
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

export function getAIMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver' || state.winner) return null;
  if (state.currentPlayer !== aiPlayer) return null;

  if (state.phase === 'placement') {
    if (chipsRemaining(state.chipInventory[aiPlayer]) === 0) return null;
    const place = getBestPlacement(state, aiPlayer, difficulty);
    if (place) {
      return {
        type: 'place',
        nodeId: place.nodeId,
        chipKind: place.chipKind,
      };
    }
  } else if (state.phase === 'movement') {
    const move = getBestMove(state, aiPlayer, difficulty);
    if (move) {
      return { type: 'move', from: move.from, to: move.to };
    }
  }

  return null;
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
