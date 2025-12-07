// Stars & Bars Game Rules
// Attribute logic placement game

import {
  StarsState,
  BoardCell,
  AttributeCard,
  Player,
  MoveRecord,
  CONFIG,
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  countDifferences,
} from './types';

// =============================================================================
// Deck Creation
// =============================================================================

/**
 * Create the full deck of attribute cards (60 cards)
 */
function createDeck(): AttributeCard[] {
  const deck: AttributeCard[] = [];
  let id = 0;

  for (const shape of SHAPES) {
    for (const color of COLORS) {
      for (const size of SIZES) {
        for (const thickness of THICKNESSES) {
          deck.push({
            id: `card-${id++}`,
            shape,
            color,
            size,
            thickness,
          });
        }
      }
    }
  }

  return deck;
}

/**
 * Shuffle an array in place
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// =============================================================================
// Board Creation
// =============================================================================

/**
 * Create the game board with star positions
 */
function createBoard(): BoardCell[][] {
  const board: BoardCell[][] = [];

  // Star positions (corners and center are worth double)
  const starPositions = new Set([
    '0,0', '0,4',
    '2,2', // center
    '4,0', '4,4',
  ]);

  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    const boardRow: BoardCell[] = [];
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      boardRow.push({
        row,
        col,
        card: null,
        owner: null,
        isStar: starPositions.has(`${row},${col}`),
      });
    }
    board.push(boardRow);
  }

  return board;
}

/**
 * Draw cards from deck
 */
function drawCards(deck: AttributeCard[], count: number): { drawn: AttributeCard[]; remaining: AttributeCard[] } {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
}

// =============================================================================
// State Management
// =============================================================================

/**
 * Create initial game state
 */
export function createInitialState(): StarsState {
  const deck = shuffle(createDeck());

  // Draw initial hands
  const p1Draw = drawCards(deck, CONFIG.HAND_SIZE);
  const p2Draw = drawCards(p1Draw.remaining, CONFIG.HAND_SIZE);

  return {
    cells: createBoard(),
    playerHands: {
      player1: p1Draw.drawn,
      player2: p2Draw.drawn,
    },
    playerScores: {
      player1: 0,
      player2: 0,
    },
    currentPlayer: 'player1',
    selectedCard: null,
    phase: 'selectingCard',
    winner: null,
    moveHistory: [],
    deck: p2Draw.remaining,
    lastMove: null,
  };
}

// =============================================================================
// Card Selection
// =============================================================================

/**
 * Select a card from hand
 */
export function selectCard(state: StarsState, cardId: string): StarsState {
  if (state.phase === 'gameOver') return state;

  const hand = state.playerHands[state.currentPlayer];
  const card = hand.find((c) => c.id === cardId);

  if (!card) return state;

  return {
    ...state,
    selectedCard: card,
    phase: 'placingCard',
  };
}

/**
 * Clear selection
 */
export function clearSelection(state: StarsState): StarsState {
  return {
    ...state,
    selectedCard: null,
    phase: 'selectingCard',
  };
}

// =============================================================================
// Card Placement
// =============================================================================

/**
 * Get valid placement positions
 */
export function getValidPlacements(state: StarsState): { row: number; col: number }[] {
  const validPositions: { row: number; col: number }[] = [];

  // Check if board is empty - if so, all positions are valid
  const boardEmpty = state.cells.flat().every((cell) => cell.card === null);

  if (boardEmpty) {
    for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
      for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
        validPositions.push({ row, col });
      }
    }
    return validPositions;
  }

  // Otherwise, must place adjacent to existing card
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      if (state.cells[row][col].card !== null) continue;

      // Check if adjacent to any existing card (orthogonal and diagonal)
      const hasAdjacent = getAdjacentCells(state, row, col).some((cell) => cell.card !== null);

      if (hasAdjacent) {
        validPositions.push({ row, col });
      }
    }
  }

  return validPositions;
}

/**
 * Get all adjacent cells (orthogonal and diagonal)
 */
function getAdjacentCells(state: StarsState, row: number, col: number): BoardCell[] {
  const adjacent: BoardCell[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < CONFIG.BOARD_SIZE &&
      newCol >= 0 &&
      newCol < CONFIG.BOARD_SIZE
    ) {
      adjacent.push(state.cells[newRow][newCol]);
    }
  }

  return adjacent;
}

/**
 * Calculate score for placing a card
 */
function calculatePlacementScore(
  state: StarsState,
  card: AttributeCard,
  row: number,
  col: number
): { score: number; breakdown: string } {
  const cell = state.cells[row][col];
  const adjacentCells = getAdjacentCells(state, row, col);
  const adjacentCards = adjacentCells.filter((c) => c.card !== null);

  let totalScore = 0;
  const breakdownParts: string[] = [];

  for (const adjCell of adjacentCards) {
    if (!adjCell.card) continue;
    const diff = countDifferences(card, adjCell.card);
    totalScore += diff;
    breakdownParts.push(`${diff}-way`);
  }

  // Double for star cells
  if (cell.isStar && totalScore > 0) {
    breakdownParts.push('(star x2)');
    totalScore *= 2;
  }

  return {
    score: totalScore,
    breakdown: breakdownParts.length > 0 ? breakdownParts.join(' + ') : 'first card',
  };
}

/**
 * Place a card on the board
 */
export function placeCard(state: StarsState, row: number, col: number): StarsState {
  if (state.phase !== 'placingCard' || !state.selectedCard) return state;

  const cell = state.cells[row][col];
  if (cell.card !== null) return state;

  // Check valid placement
  const validPlacements = getValidPlacements(state);
  const isValid = validPlacements.some((p) => p.row === row && p.col === col);
  if (!isValid) return state;

  // Calculate score
  const { score, breakdown } = calculatePlacementScore(
    state,
    state.selectedCard,
    row,
    col
  );

  // Update board
  const newCells = state.cells.map((r, ri) =>
    r.map((c, ci) => {
      if (ri === row && ci === col) {
        return {
          ...c,
          card: state.selectedCard,
          owner: state.currentPlayer,
        };
      }
      return c;
    })
  );

  // Remove card from hand
  const newHand = state.playerHands[state.currentPlayer].filter(
    (c) => c.id !== state.selectedCard!.id
  );

  // Draw new card if available
  let newDeck = state.deck;
  if (state.deck.length > 0) {
    const { drawn, remaining } = drawCards(state.deck, 1);
    newHand.push(...drawn);
    newDeck = remaining;
  }

  // Update scores
  const newScores = {
    ...state.playerScores,
    [state.currentPlayer]: state.playerScores[state.currentPlayer] + score,
  };

  // Record move
  const moveRecord: MoveRecord = {
    player: state.currentPlayer,
    card: state.selectedCard,
    row,
    col,
    score,
    breakdown,
  };

  // Check for winner
  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';
  let winner: Player | null = null;
  let phase: StarsState['phase'] = 'selectingCard';

  // Check win conditions
  if (newScores[state.currentPlayer] >= CONFIG.TARGET_SCORE) {
    winner = state.currentPlayer;
    phase = 'gameOver';
  } else if (
    newHand.length === 0 &&
    state.playerHands[nextPlayer].length === 0
  ) {
    // Both hands empty - higher score wins
    phase = 'gameOver';
    if (newScores.player1 > newScores.player2) {
      winner = 'player1';
    } else if (newScores.player2 > newScores.player1) {
      winner = 'player2';
    }
    // If equal, it's a tie (winner stays null)
  }

  return {
    ...state,
    cells: newCells,
    playerHands: {
      ...state.playerHands,
      [state.currentPlayer]: newHand,
    },
    playerScores: newScores,
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : nextPlayer,
    selectedCard: null,
    phase,
    winner,
    moveHistory: [...state.moveHistory, moveRecord],
    deck: newDeck,
    lastMove: { row, col },
  };
}

// =============================================================================
// Game Flow
// =============================================================================

/**
 * Pass turn (only if no valid moves)
 */
export function passTurn(state: StarsState): StarsState {
  if (state.phase === 'gameOver') return state;

  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';

  return {
    ...state,
    currentPlayer: nextPlayer,
    selectedCard: null,
    phase: 'selectingCard',
  };
}

/**
 * Check if player has valid moves
 */
export function hasValidMoves(state: StarsState): boolean {
  const hand = state.playerHands[state.currentPlayer];
  if (hand.length === 0) return false;

  const validPlacements = getValidPlacements(state);
  return validPlacements.length > 0;
}
