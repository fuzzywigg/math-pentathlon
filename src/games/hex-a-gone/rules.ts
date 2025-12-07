// Hex-a-Gone! Game Rules

import {
  HexAGoneGameState,
  BlockShape,
  GamePhase,
  getCellAt,
  getOpponent,
  getAvailableShapes,
  BLOCK_COLORS,
} from './types';

// Add a block to the current turn selection (max 3 different blocks)
export function selectBlock(
  state: HexAGoneGameState,
  shape: BlockShape
): HexAGoneGameState {
  if (state.phase !== 'selectBlocks') return state;
  if (state.turnSelection.committed) return state;
  if (state.turnSelection.blocks.length >= 3) return state;
  if (state.turnSelection.blocks.includes(shape)) return state;
  if (state.bank[shape] <= 0) return state;

  return {
    ...state,
    turnSelection: {
      ...state.turnSelection,
      blocks: [...state.turnSelection.blocks, shape],
    },
  };
}

// Remove a block from selection
export function deselectBlock(
  state: HexAGoneGameState,
  shape: BlockShape
): HexAGoneGameState {
  if (state.phase !== 'selectBlocks') return state;
  if (state.turnSelection.committed) return state;
  if (!state.turnSelection.blocks.includes(shape)) return state;

  return {
    ...state,
    turnSelection: {
      ...state.turnSelection,
      blocks: state.turnSelection.blocks.filter(b => b !== shape),
    },
    selectedBlockForPlacement: state.selectedBlockForPlacement === shape ? null : state.selectedBlockForPlacement,
  };
}

// Commit selection and move to placement phase
export function commitSelection(state: HexAGoneGameState): HexAGoneGameState {
  if (state.phase !== 'selectBlocks') return state;
  if (state.turnSelection.blocks.length === 0) return state;

  return {
    ...state,
    phase: 'placeBlocks',
    turnSelection: {
      ...state.turnSelection,
      committed: true,
    },
    selectedBlockForPlacement: state.turnSelection.blocks[0],
  };
}

// Select which block from the selection to place next
export function selectBlockForPlacement(
  state: HexAGoneGameState,
  shape: BlockShape
): HexAGoneGameState {
  if (state.phase !== 'placeBlocks') return state;
  if (!state.turnSelection.blocks.includes(shape)) return state;

  return {
    ...state,
    selectedBlockForPlacement: shape,
  };
}

// Check if a cell is available for placement
export function canPlaceAt(
  state: HexAGoneGameState,
  q: number,
  r: number
): boolean {
  const cell = getCellAt(state, q, r);
  return cell !== undefined && !cell.filled;
}

// Place the selected block at position
export function placeBlock(
  state: HexAGoneGameState,
  q: number,
  r: number
): HexAGoneGameState {
  if (state.phase !== 'placeBlocks') return state;
  if (!state.selectedBlockForPlacement) return state;
  if (!canPlaceAt(state, q, r)) return state;

  const shape = state.selectedBlockForPlacement;

  // Update board
  const newBoard = state.board.map(cell => {
    if (cell.q === q && cell.r === r) {
      return {
        ...cell,
        filled: true,
        filledBy: state.currentPlayer,
        blockId: state.nextBlockId,
      };
    }
    return cell;
  });

  // Add placed block
  const newPlacedBlock = {
    shape,
    player: state.currentPlayer,
    q,
    r,
    rotation: 0,
  };

  // Update bank
  const newBank = {
    ...state.bank,
    [shape]: state.bank[shape] - 1,
  };

  // Remove from selection
  const remainingBlocks = state.turnSelection.blocks.filter(b => b !== shape);

  // Check if turn is complete (all selected blocks placed)
  const turnComplete = remainingBlocks.length === 0;

  // If turn complete, check for game over
  let newPhase: GamePhase = state.phase;
  let nextPlayer = state.currentPlayer;
  let winner = state.winner;
  let newMoveHistory = state.moveHistory;

  if (turnComplete) {
    // Record the move
    const move = {
      player: state.currentPlayer,
      blocksPlaced: state.turnSelection.blocks,
      moveNumber: state.moveHistory.length + 1,
    };
    newMoveHistory = [...state.moveHistory, move];

    // Switch to next player
    nextPlayer = getOpponent(state.currentPlayer);

    // Check if next player can make a move
    const nextPlayerCanMove = canPlayerMove({
      ...state,
      board: newBoard,
      bank: newBank,
      currentPlayer: nextPlayer,
    });

    if (!nextPlayerCanMove) {
      // Current player wins!
      newPhase = 'gameOver';
      winner = state.currentPlayer;
    } else {
      newPhase = 'selectBlocks';
    }
  }

  return {
    ...state,
    board: newBoard,
    placedBlocks: [...state.placedBlocks, newPlacedBlock],
    nextBlockId: state.nextBlockId + 1,
    bank: newBank,
    currentPlayer: nextPlayer,
    phase: newPhase,
    turnSelection: turnComplete
      ? { blocks: [], committed: false }
      : { ...state.turnSelection, blocks: remainingBlocks },
    selectedBlockForPlacement: turnComplete ? null : remainingBlocks[0] || null,
    moveHistory: newMoveHistory,
    winner,
  };
}

// Check if a player can make any valid move
export function canPlayerMove(state: HexAGoneGameState): boolean {
  // Check if there are any blocks available
  const availableShapes = getAvailableShapes(state);
  if (availableShapes.length === 0) return false;

  // Check if there are any empty cells
  const emptyCells = state.board.filter(cell => !cell.filled);
  if (emptyCells.length === 0) return false;

  return true;
}

// Get valid placement positions for current block
export function getValidPlacements(state: HexAGoneGameState): { q: number; r: number }[] {
  if (!state.selectedBlockForPlacement) return [];

  return state.board
    .filter(cell => !cell.filled)
    .map(cell => ({ q: cell.q, r: cell.r }));
}

// Check if game is over
export function isGameOver(state: HexAGoneGameState): boolean {
  return state.phase === 'gameOver' || state.winner !== null;
}

// Get phase message
export function getPhaseMessage(state: HexAGoneGameState): string {
  const playerName = state.currentPlayer === 'player1' ? 'Blue' : 'Red';

  switch (state.phase) {
    case 'selectBlocks': {
      const count = state.turnSelection.blocks.length;
      if (count === 0) {
        return `${playerName}'s turn - Select 1-3 blocks from the bank`;
      }
      return `${playerName}: ${count} block(s) selected. Select more or confirm.`;
    }
    case 'placeBlocks': {
      const remaining = state.turnSelection.blocks.length;
      return `${playerName}: Place your blocks (${remaining} remaining)`;
    }
    case 'gameOver': {
      const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
      return `${winnerName} wins!`;
    }
    default:
      return '';
  }
}

// Skip turn (pass) - only if player cannot place
export function passTurn(state: HexAGoneGameState): HexAGoneGameState {
  if (state.phase === 'gameOver') return state;

  // Can only pass if no blocks selected yet
  if (state.turnSelection.blocks.length > 0) return state;

  const nextPlayer = getOpponent(state.currentPlayer);

  // Check if next player can move
  const nextPlayerCanMove = canPlayerMove({
    ...state,
    currentPlayer: nextPlayer,
  });

  if (!nextPlayerCanMove) {
    // Both players can't move - game over
    // Winner is the last player who placed
    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    return {
      ...state,
      phase: 'gameOver',
      winner: lastMove?.player || state.currentPlayer,
    };
  }

  return {
    ...state,
    currentPlayer: nextPlayer,
  };
}

// Get block color for display
export function getBlockColor(shape: BlockShape): string {
  return BLOCK_COLORS[shape];
}
