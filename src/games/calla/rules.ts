// Calla Game Rules
// Mancala-style distribution, capture, and free turn mechanics

import {
  CallaGameState,
  Player,
  PITS_PER_SIDE,
  getOpponent,
  getPlayerPits,
  getOppositePitIndex,
} from './types';

// Check if a pit can be selected (has cubes and belongs to current player)
export function canSelectPit(
  state: CallaGameState,
  player: Player,
  pitIndex: number
): boolean {
  if (state.phase !== 'selectPit') return false;
  if (state.currentPlayer !== player) return false;
  if (pitIndex < 0 || pitIndex >= PITS_PER_SIDE) return false;

  const pits = getPlayerPits(state, player);
  return (pits[pitIndex] ?? 0) > 0;
}

// Get valid pits that can be selected
export function getValidPits(state: CallaGameState): number[] {
  if (state.phase !== 'selectPit') return [];

  const pits = getPlayerPits(state, state.currentPlayer);
  return pits.reduce((valid: number[], count, index) => {
    if (count > 0) valid.push(index);
    return valid;
  }, []);
}

// Execute a move: pick up cubes from a pit and sow them
export function makeMove(
  state: CallaGameState,
  pitIndex: number
): CallaGameState {
  if (!canSelectPit(state, state.currentPlayer, pitIndex)) {
    return state;
  }

  const currentPlayer = state.currentPlayer;
  const opponent = getOpponent(currentPlayer);

  // Create mutable copies
  const newP1Pits = [...state.player1Pits];
  const newP2Pits = [...state.player2Pits];
  let newP1Calla = state.player1Calla;
  let newP2Calla = state.player2Calla;

  // Pick up cubes from selected pit
  const playerPits = currentPlayer === 'player1' ? newP1Pits : newP2Pits;
  let cubesInHand = playerPits[pitIndex] ?? 0;
  const cubesDistributed = cubesInHand;
  playerPits[pitIndex] = 0;

  // Sowing direction: counter-clockwise
  // For player1: own pits (0→4), own calla, opponent pits (4→0), back to own pits
  // For player2: own pits (0→4), own calla, opponent pits (4→0), back to own pits

  // Current position in the circular board
  // Position encoding:
  // 0-4: current player's pits
  // 5: current player's calla
  // 6-10: opponent's pits (reversed order from their view)
  // Then wrap back to 0

  let position = pitIndex + 1; // Start sowing from next pit
  let lastSownSide: 'player1' | 'player2' | 'calla' = currentPlayer;
  let lastSownIndex = pitIndex;

  while (cubesInHand > 0) {
    if (position < PITS_PER_SIDE) {
      // Current player's pits
      if (currentPlayer === 'player1') {
        newP1Pits[position] = (newP1Pits[position] ?? 0) + 1;
        lastSownSide = 'player1';
      } else {
        newP2Pits[position] = (newP2Pits[position] ?? 0) + 1;
        lastSownSide = 'player2';
      }
      lastSownIndex = position;
    } else if (position === PITS_PER_SIDE) {
      // Current player's calla
      if (currentPlayer === 'player1') {
        newP1Calla++;
      } else {
        newP2Calla++;
      }
      lastSownSide = 'calla';
      lastSownIndex = 0;
    } else if (position < PITS_PER_SIDE * 2 + 1) {
      // Opponent's pits (sow in reverse order from their view)
      const opponentPitIndex = PITS_PER_SIDE * 2 - position;
      if (opponent === 'player1') {
        newP1Pits[opponentPitIndex] = (newP1Pits[opponentPitIndex] ?? 0) + 1;
        lastSownSide = 'player1';
      } else {
        newP2Pits[opponentPitIndex] = (newP2Pits[opponentPitIndex] ?? 0) + 1;
        lastSownSide = 'player2';
      }
      lastSownIndex = opponentPitIndex;
    }
    // Skip opponent's calla (position would be PITS_PER_SIDE * 2 + 1)

    cubesInHand--;
    position++;

    // Wrap around (skip opponent's calla at position 11)
    if (position > PITS_PER_SIDE * 2) {
      position = 0;
    }
  }

  // Check for capture: last cube landed in empty pit on current player's side
  let captured = 0;
  const currentPlayerPits = currentPlayer === 'player1' ? newP1Pits : newP2Pits;
  const opponentPits = opponent === 'player1' ? newP1Pits : newP2Pits;

  if (
    lastSownSide === currentPlayer &&
    currentPlayerPits[lastSownIndex] === 1 // Was empty before this cube
  ) {
    const oppositeIndex = getOppositePitIndex(lastSownIndex);
    const oppositeCubes = opponentPits[oppositeIndex] ?? 0;
    if (oppositeCubes > 0) {
      // Capture!
      captured = oppositeCubes + 1; // Opponent's cubes + the capturing cube
      opponentPits[oppositeIndex] = 0;
      currentPlayerPits[lastSownIndex] = 0;

      if (currentPlayer === 'player1') {
        newP1Calla += captured;
      } else {
        newP2Calla += captured;
      }
    }
  }

  // Check for free turn: last cube landed in current player's calla
  const gotFreeTurn = lastSownSide === 'calla';

  // Record the move
  const move = {
    player: currentPlayer,
    pitIndex,
    cubesDistributed,
    captured,
    gotFreeTurn,
    moveNumber: state.moveHistory.length + 1,
  };

  // Determine next player
  const nextPlayer = gotFreeTurn ? currentPlayer : opponent;

  // Check for game end: if one side is empty
  const p1Empty = newP1Pits.every((c) => c === 0);
  const p2Empty = newP2Pits.every((c) => c === 0);

  let winner: Player | 'tie' | null = null;
  let phase = state.phase;

  if (p1Empty || p2Empty) {
    // Game ends - remaining cubes go to the player whose side they're on
    if (!p1Empty) {
      newP1Calla += newP1Pits.reduce((a, b) => a + b, 0);
      newP1Pits.fill(0);
    }
    if (!p2Empty) {
      newP2Calla += newP2Pits.reduce((a, b) => a + b, 0);
      newP2Pits.fill(0);
    }

    phase = 'gameOver';
    if (newP1Calla > newP2Calla) {
      winner = 'player1';
    } else if (newP2Calla > newP1Calla) {
      winner = 'player2';
    } else {
      winner = 'tie';
    }
  }

  return {
    ...state,
    player1Pits: newP1Pits,
    player2Pits: newP2Pits,
    player1Calla: newP1Calla,
    player2Calla: newP2Calla,
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : nextPlayer,
    phase,
    lastSownPit: { side: lastSownSide, index: lastSownIndex },
    moveHistory: [...state.moveHistory, move],
    winner,
  };
}

// Check if game is over
export function isGameOver(state: CallaGameState): boolean {
  return state.phase === 'gameOver' || state.winner !== null;
}

/**
 * Soft-lock recovery when the current seat has no selectable pits.
 * Same end settlement as makeMove (remaining cubes → owning Calla; compare stores).
 * Does not alter scoring or win conditions — only applies the existing end path.
 */
export function settleNoValidMoves(state: CallaGameState): CallaGameState {
  if (isGameOver(state)) return state;
  if (getValidPits(state).length > 0) return state;

  const newP1Pits = [...state.player1Pits];
  const newP2Pits = [...state.player2Pits];
  let newP1Calla = state.player1Calla;
  let newP2Calla = state.player2Calla;

  // Same collection as makeMove end: remaining cubes go to that side's Calla.
  const p1Empty = newP1Pits.every((c) => c === 0);
  const p2Empty = newP2Pits.every((c) => c === 0);
  if (!p1Empty) {
    newP1Calla += newP1Pits.reduce((a, b) => a + b, 0);
    newP1Pits.fill(0);
  }
  if (!p2Empty) {
    newP2Calla += newP2Pits.reduce((a, b) => a + b, 0);
    newP2Pits.fill(0);
  }

  let winner: Player | 'tie';
  if (newP1Calla > newP2Calla) {
    winner = 'player1';
  } else if (newP2Calla > newP1Calla) {
    winner = 'player2';
  } else {
    winner = 'tie';
  }

  return {
    ...state,
    player1Pits: newP1Pits,
    player2Pits: newP2Pits,
    player1Calla: newP1Calla,
    player2Calla: newP2Calla,
    phase: 'gameOver',
    winner,
  };
}

export type CallaDisplayMode = 'human-vs-human' | 'human-vs-ai';

function seatDisplayName(
  seat: Player,
  gameMode: CallaDisplayMode = 'human-vs-human'
): string {
  if (gameMode === 'human-vs-ai') {
    return seat === 'player1' ? 'You' : 'AI';
  }
  return seat === 'player1' ? 'Blue' : 'Red';
}

function seatPossessive(
  seat: Player,
  gameMode: CallaDisplayMode = 'human-vs-human'
): string {
  if (gameMode === 'human-vs-ai') {
    return seat === 'player1' ? 'Your' : "AI's";
  }
  return seat === 'player1' ? "Blue's" : "Red's";
}

// Get phase message
export function getPhaseMessage(
  state: CallaGameState,
  gameMode: CallaDisplayMode = 'human-vs-human'
): string {
  const possessive = seatPossessive(state.currentPlayer, gameMode);

  switch (state.phase) {
    case 'selectPit':
      return `${possessive} turn - Select a shield to distribute`;
    case 'animating':
      return `${seatDisplayName(state.currentPlayer, gameMode)} is distributing cubes...`;
    case 'gameOver': {
      if (state.winner === 'tie') {
        return "It's a tie!";
      }
      if (state.winner === 'player1' || state.winner === 'player2') {
        const winnerName = seatDisplayName(state.winner, gameMode);
        // "You win!" vs "Blue wins!" / "AI wins!"
        if (winnerName === 'You') return 'You win!';
        return `${winnerName} wins!`;
      }
      return '';
    }
    default: {
      const _exhaustive: never = state.phase;
      void _exhaustive;
      return '';
    }
  }
}

// Get last move info for display
export function getLastMoveInfo(
  state: CallaGameState,
  gameMode: CallaDisplayMode = 'human-vs-human'
): string | null {
  if (state.moveHistory.length === 0) return null;

  const lastMove = state.moveHistory[state.moveHistory.length - 1];
  if (lastMove === undefined) return null;
  const playerName = seatDisplayName(lastMove.player, gameMode);

  let info = `${playerName} distributed ${lastMove.cubesDistributed} cube${lastMove.cubesDistributed !== 1 ? 's' : ''}`;

  if (lastMove.captured > 0) {
    info += `, captured ${lastMove.captured}!`;
  }

  if (lastMove.gotFreeTurn) {
    info += ' Free turn!';
  }

  return info;
}
