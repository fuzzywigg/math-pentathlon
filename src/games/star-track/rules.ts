// Star Track Game Rules

import {
  StarTrackGameState,
  Player,
  TRACK_LENGTH,
  getOpponent,
  getPlayerPosition,
  createChainBucket,
} from './types';

// Draw two chains from the bucket
export function drawChains(state: StarTrackGameState): StarTrackGameState {
  if (state.phase !== 'drawChains') return state;

  // If the bucket is depleted (or has fewer than 2 chains), reset it so the
  // game can always continue — this is the recovery mechanism for Bug #5.
  let newBucket = state.chainBucket.length < 2
    ? createChainBucket()
    : [...state.chainBucket];

  const chain1 = newBucket.pop()!;
  const chain2 = newBucket.pop()!;

  return {
    ...state,
    drawnChains: [chain1, chain2],
    chainBucket: newBucket,
    phase: 'selectChain',
  };
}

// Select which chain to use
export function selectChain(
  state: StarTrackGameState,
  chainIndex: 0 | 1
): StarTrackGameState {
  if (state.phase !== 'selectChain') return state;
  if (!state.drawnChains) return state;

  const selectedChain = state.drawnChains[chainIndex];
  const unusedChain = state.drawnChains[chainIndex === 0 ? 1 : 0];

  // Return unused chain to bucket (shuffled back in)
  const newBucket = [...state.chainBucket, unusedChain];

  // Calculate new position
  const currentPosition = getPlayerPosition(state, state.currentPlayer);
  const newPosition = Math.min(currentPosition + selectedChain.length, TRACK_LENGTH);

  // Check for winner
  const isWinner = newPosition >= TRACK_LENGTH;

  // Record the move
  const move = {
    player: state.currentPlayer,
    chainUsed: selectedChain.length,
    fromPosition: currentPosition,
    toPosition: newPosition,
    moveNumber: state.moveHistory.length + 1,
  };

  // Update position
  const newState: StarTrackGameState = {
    ...state,
    player1Position:
      state.currentPlayer === 'player1' ? newPosition : state.player1Position,
    player2Position:
      state.currentPlayer === 'player2' ? newPosition : state.player2Position,
    selectedChain,
    drawnChains: null,
    chainBucket: newBucket,
    moveHistory: [...state.moveHistory, move],
    winner: isWinner ? state.currentPlayer : null,
    phase: isWinner ? 'gameOver' : 'drawChains',
    currentPlayer: isWinner ? state.currentPlayer : getOpponent(state.currentPlayer),
  };

  return newState;
}

// Check if game is over
export function isGameOver(state: StarTrackGameState): boolean {
  return state.phase === 'gameOver' || state.winner !== null;
}

// Get the player's progress as a percentage
export function getProgress(state: StarTrackGameState, player: Player): number {
  const position = getPlayerPosition(state, player);
  return (position / TRACK_LENGTH) * 100;
}

// Get descriptive text for current phase
export function getPhaseMessage(state: StarTrackGameState): string {
  const playerName = state.currentPlayer === 'player1' ? 'Blue' : 'Red';

  switch (state.phase) {
    case 'drawChains':
      return `${playerName}'s turn - Draw chains from the bucket`;
    case 'selectChain':
      return `${playerName}: Choose a chain to move`;
    case 'gameOver': {
      const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
      return `${winnerName} wins!`;
    }
    default:
      return '';
  }
}
