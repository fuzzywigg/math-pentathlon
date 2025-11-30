/**
 * Scoring System
 * Point tracking, leaderboards, and game results
 */

import type {
  ScoringConfig,
  ScoringState,
  PlayerScore,
  ScoreEntry,
  ScoreMultiplier,
  LeaderboardEntry,
  RoundSummary,
  GameResult,
} from './types';
import { DEFAULT_SCORING_CONFIG } from './types';

/**
 * Create a new scoring state
 */
export function createScoringState(
  config: Partial<ScoringConfig> = {},
  playerIds: string[] = [],
  playerNames?: Record<string, string>
): ScoringState {
  const fullConfig: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, ...config };

  const players: PlayerScore[] = playerIds.map((id) => ({
    playerId: id,
    playerName: playerNames?.[id] ?? `Player ${id}`,
    total: 0,
    entries: [],
  }));

  return {
    config: fullConfig,
    players,
    currentRound: 1,
    roundScores: new Map(),
  };
}

/**
 * Add a player to the scoring state
 */
export function addPlayer(
  state: ScoringState,
  playerId: string,
  playerName?: string
): ScoringState {
  if (state.players.some((p) => p.playerId === playerId)) {
    return state; // Player already exists
  }

  return {
    ...state,
    players: [
      ...state.players,
      {
        playerId,
        playerName: playerName ?? `Player ${playerId}`,
        total: 0,
        entries: [],
      },
    ],
  };
}

/**
 * Remove a player from the scoring state
 */
export function removePlayer(state: ScoringState, playerId: string): ScoringState {
  return {
    ...state,
    players: state.players.filter((p) => p.playerId !== playerId),
  };
}

/**
 * Generate a unique score entry ID
 */
function generateEntryId(): string {
  return `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add points to a player's score
 */
export function addScore(
  state: ScoringState,
  playerId: string,
  points: number,
  reason: string = 'points',
  metadata?: Record<string, unknown>
): ScoringState {
  const entry: ScoreEntry = {
    id: generateEntryId(),
    playerId,
    points,
    reason,
    timestamp: Date.now(),
    metadata,
  };

  // Apply multipliers
  let finalPoints = points;
  if (state.config.multipliers) {
    for (const multiplier of state.config.multipliers) {
      if (!multiplier.condition || multiplier.condition(entry, state)) {
        finalPoints *= multiplier.multiplier;
      }
    }
  }

  const updatedEntry = { ...entry, points: finalPoints };

  return {
    ...state,
    players: state.players.map((player) => {
      if (player.playerId !== playerId) return player;

      let newTotal = player.total + finalPoints;

      // Apply min/max constraints
      if (state.config.maxScore !== undefined) {
        newTotal = Math.min(newTotal, state.config.maxScore);
      }
      if (state.config.minScore !== undefined) {
        newTotal = Math.max(newTotal, state.config.minScore);
      }

      return {
        ...player,
        total: newTotal,
        entries: [...player.entries, updatedEntry],
      };
    }),
  };
}

/**
 * Subtract points from a player's score
 */
export function subtractScore(
  state: ScoringState,
  playerId: string,
  points: number,
  reason: string = 'penalty'
): ScoringState {
  return addScore(state, playerId, -points, reason);
}

/**
 * Set a player's score to a specific value
 */
export function setScore(
  state: ScoringState,
  playerId: string,
  score: number,
  reason: string = 'set'
): ScoringState {
  return {
    ...state,
    players: state.players.map((player) => {
      if (player.playerId !== playerId) return player;

      const entry: ScoreEntry = {
        id: generateEntryId(),
        playerId,
        points: score - player.total,
        reason,
        timestamp: Date.now(),
      };

      return {
        ...player,
        total: score,
        entries: [...player.entries, entry],
      };
    }),
  };
}

/**
 * Reset all scores to zero
 */
export function resetScores(state: ScoringState): ScoringState {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      total: 0,
      entries: [],
    })),
    currentRound: 1,
    roundScores: new Map(),
  };
}

/**
 * Get a player's current score
 */
export function getPlayerScore(state: ScoringState, playerId: string): number {
  const player = state.players.find((p) => p.playerId === playerId);
  return player?.total ?? 0;
}

/**
 * Get a player's score data
 */
export function getPlayerData(state: ScoringState, playerId: string): PlayerScore | undefined {
  return state.players.find((p) => p.playerId === playerId);
}

/**
 * Get the leaderboard (sorted by score)
 */
export function getLeaderboard(
  state: ScoringState,
  currentPlayerId?: string
): LeaderboardEntry[] {
  const sorted = [...state.players].sort((a, b) => {
    const isHighestWins = state.config.winCondition?.type !== 'lowest';
    return isHighestWins ? b.total - a.total : a.total - b.total;
  });

  return sorted.map((player, index) => ({
    rank: index + 1,
    playerId: player.playerId,
    playerName: player.playerName,
    score: player.total,
    isCurrentPlayer: player.playerId === currentPlayerId,
  }));
}

/**
 * Get the current leader
 */
export function getLeader(state: ScoringState): PlayerScore | null {
  if (state.players.length === 0) return null;

  const isHighestWins = state.config.winCondition?.type !== 'lowest';

  return state.players.reduce((leader, player) => {
    if (isHighestWins) {
      return player.total > leader.total ? player : leader;
    }
    return player.total < leader.total ? player : leader;
  });
}

/**
 * Check if any player has won based on win condition
 */
export function checkWinCondition(state: ScoringState): string | null {
  const { winCondition } = state.config;
  if (!winCondition) return null;

  switch (winCondition.type) {
    case 'target':
      for (const player of state.players) {
        if (player.total >= winCondition.value) {
          return player.playerId;
        }
      }
      break;

    case 'exact':
      for (const player of state.players) {
        if (player.total === winCondition.value) {
          return player.playerId;
        }
      }
      break;

    // 'highest' and 'lowest' don't have automatic win conditions
    // They are determined at game end
  }

  return null;
}

/**
 * Add a score multiplier
 */
export function addMultiplier(
  state: ScoringState,
  multiplier: ScoreMultiplier
): ScoringState {
  return {
    ...state,
    config: {
      ...state.config,
      multipliers: [...(state.config.multipliers ?? []), multiplier],
    },
  };
}

/**
 * Remove a score multiplier
 */
export function removeMultiplier(state: ScoringState, multiplierId: string): ScoringState {
  return {
    ...state,
    config: {
      ...state.config,
      multipliers: state.config.multipliers?.filter((m) => m.id !== multiplierId),
    },
  };
}

/**
 * Start a new round
 */
export function startNewRound(state: ScoringState): ScoringState {
  // Save current round scores
  const currentRoundScores = state.players.map((player) => ({
    ...player,
    entries: player.entries.filter(
      (e) => !state.roundScores.get(state.currentRound)?.some((p) => p.entries.includes(e))
    ),
  }));

  const newRoundScores = new Map(state.roundScores);
  newRoundScores.set(state.currentRound, currentRoundScores);

  return {
    ...state,
    currentRound: state.currentRound + 1,
    roundScores: newRoundScores,
  };
}

/**
 * Get round summary
 */
export function getRoundSummary(state: ScoringState, roundNumber: number): RoundSummary | null {
  const roundScores = state.roundScores.get(roundNumber);
  if (!roundScores) return null;

  const scores = roundScores.map((player) => {
    const roundScore = player.entries.reduce((sum, e) => sum + e.points, 0);
    return {
      playerId: player.playerId,
      playerName: player.playerName,
      roundScore,
      totalScore: player.total,
    };
  });

  const winner = scores.reduce((w, s) =>
    s.roundScore > (w?.roundScore ?? -Infinity) ? s : w
  );

  return {
    roundNumber,
    scores,
    winner: winner?.playerId,
  };
}

/**
 * Get score difference between two players
 */
export function getScoreDifference(
  state: ScoringState,
  playerId1: string,
  playerId2: string
): number {
  const score1 = getPlayerScore(state, playerId1);
  const score2 = getPlayerScore(state, playerId2);
  return score1 - score2;
}

/**
 * Get recent score entries for a player
 */
export function getRecentEntries(
  state: ScoringState,
  playerId: string,
  limit: number = 5
): ScoreEntry[] {
  const player = state.players.find((p) => p.playerId === playerId);
  if (!player) return [];

  return player.entries.slice(-limit).reverse();
}

/**
 * Calculate final game result
 */
export function calculateGameResult(
  state: ScoringState,
  totalDuration: number
): GameResult {
  const leaderboard = getLeaderboard(state);

  // Check for tie
  const topScore = leaderboard[0]?.score;
  const tiedPlayers = leaderboard.filter((e) => e.score === topScore);
  const isTie = tiedPlayers.length > 1;

  // Get all round summaries
  const rounds: RoundSummary[] = [];
  for (let i = 1; i <= state.currentRound; i++) {
    const summary = getRoundSummary(state, i);
    if (summary) rounds.push(summary);
  }

  return {
    winnerId: isTie ? null : tiedPlayers[0]?.playerId ?? null,
    winnerName: isTie ? null : tiedPlayers[0]?.playerName ?? null,
    finalScores: state.players,
    totalDuration,
    rounds,
    isTie,
    tiedPlayerIds: isTie ? tiedPlayers.map((p) => p.playerId) : undefined,
  };
}

/**
 * Get point value from config
 */
export function getPointValue(state: ScoringState, key: string): number {
  return state.config.pointValues?.[key] ?? state.config.pointValues?.default ?? 1;
}

/**
 * Add named point values to config
 */
export function setPointValues(
  state: ScoringState,
  values: Record<string, number>
): ScoringState {
  return {
    ...state,
    config: {
      ...state.config,
      pointValues: {
        ...state.config.pointValues,
        ...values,
      },
    },
  };
}
