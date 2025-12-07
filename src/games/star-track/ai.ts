// Star Track AI Module
// Strategic AI for chain-based racing game
//
// EDUCATIONAL NOTES:
// Star Track teaches counting, addition, and comparing numbers.
// Key skills: Adding to find totals, comparing chain lengths,
// understanding "just enough" vs "too much".
//
// Strategy tips for learners:
// 1. Longer chains usually move you faster toward the goal
// 2. But don't waste! If you need 2 more spaces, a 6 is no better than a 2
// 3. Count how many spaces you need to win before choosing
// 4. Think about what chain you're giving back - your opponent might get it!

import {
  StarTrackGameState,
  Player,
  TRACK_LENGTH,
  getPlayerPosition,
} from './types';

import { drawChains, selectChain, isGameOver } from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.02, teachingMode: false },
};

// =============================================================================
// Chain Selection Strategy
// =============================================================================

interface ChainChoice {
  chainIndex: 0 | 1;
  score: number;
  reasoning: string;
}

/**
 * Evaluate which chain to select
 */
function evaluateChainChoices(
  state: StarTrackGameState,
  aiPlayer: Player
): ChainChoice[] {
  if (!state.drawnChains) return [];

  const currentPos = getPlayerPosition(state, aiPlayer);
  const spacesNeeded = TRACK_LENGTH - currentPos;
  const choices: ChainChoice[] = [];

  for (let i = 0; i < 2; i++) {
    const chain = state.drawnChains[i as 0 | 1];
    const otherChain = state.drawnChains[(i === 0 ? 1 : 0) as 0 | 1];
    const reasons: string[] = [];
    let score = 0;

    // Factor 1: Does this chain win the game?
    if (chain.length >= spacesNeeded) {
      score += 1000;
      reasons.push('This chain wins the game!');

      // Prefer exact fit over overkill (educational - no waste)
      if (chain.length === spacesNeeded) {
        score += 50;
        reasons.push('Exactly the right amount!');
      }
    } else {
      // Factor 2: How much progress does it make?
      score += chain.length * 10;
      reasons.push(`Moves ${chain.length} spaces`);
    }

    // Factor 3: What are we giving back to opponent?
    // Giving back a long chain is bad, short chain is less valuable
    const giveBackPenalty = otherChain.length * 3;
    score -= giveBackPenalty;
    if (otherChain.length >= 5) {
      reasons.push(`Giving opponent a long chain (${otherChain.length})`);
    }

    // Factor 4: Consider opponent's position
    const opponentPos = getPlayerPosition(state, aiPlayer === 'player1' ? 'player2' : 'player1');
    const opponentNeeds = TRACK_LENGTH - opponentPos;

    // Don't give back exactly what opponent needs
    if (otherChain.length >= opponentNeeds) {
      score -= 20;
      reasons.push('That chain could let opponent win!');
    }

    choices.push({
      chainIndex: i as 0 | 1,
      score,
      reasoning: reasons.join(' '),
    });
  }

  // Sort by score
  choices.sort((a, b) => b.score - a.score);

  return choices;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal choices
 */
function getTeachingChoice(
  state: StarTrackGameState,
  aiPlayer: Player
): { chainIndex: 0 | 1; hint?: string } | null {
  const choices = evaluateChainChoices(state, aiPlayer);

  if (choices.length < 2) return null;

  // 40% chance to pick the worse chain
  if (Math.random() < 0.4) {
    const worseChoice = choices[1];
    const betterChoice = choices[0];

    // Generate a hint about the missed opportunity
    let hint: string | undefined;
    if (state.drawnChains) {
      const betterChain = state.drawnChains[betterChoice.chainIndex];
      const currentPos = getPlayerPosition(state, aiPlayer === 'player1' ? 'player2' : 'player1');
      const spacesNeeded = TRACK_LENGTH - currentPos;

      if (betterChain.length >= spacesNeeded) {
        hint = `Look! You could have won by choosing the ${betterChain.length}-chain!`;
      } else if (betterChain.length > state.drawnChains[worseChoice.chainIndex].length + 2) {
        hint = `Think about which chain moves you further ahead!`;
      }
    }

    return { chainIndex: worseChoice.chainIndex, hint };
  }

  return null;
}

// =============================================================================
// Public API
// =============================================================================

export interface AIChainChoice {
  chainIndex: 0 | 1;
  hint?: string;
}

/**
 * Get the AI's chain selection
 */
export function getAIChainChoice(
  state: StarTrackGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIChainChoice | null {
  if (state.phase !== 'selectChain') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.drawnChains) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingChoice(state, aiPlayer);
    if (result) return result;
  }

  const choices = evaluateChainChoices(state, aiPlayer);

  if (choices.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && choices.length > 1) {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    return { chainIndex: randomChoice.chainIndex };
  }

  return { chainIndex: choices[0].chainIndex };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: StarTrackGameState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (isGameOver(state)) return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn (draw + select)
 */
export function executeAITurn(
  state: StarTrackGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): StarTrackGameState {
  let currentState = state;

  // Phase 1: Draw chains
  if (currentState.phase === 'drawChains' && currentState.currentPlayer === aiPlayer) {
    currentState = drawChains(currentState);
  }

  // Phase 2: Select chain
  if (currentState.phase === 'selectChain' && currentState.currentPlayer === aiPlayer) {
    const choice = getAIChainChoice(currentState, aiPlayer, difficulty);
    if (choice) {
      currentState = selectChain(currentState, choice.chainIndex);
    }
  }

  return currentState;
}
