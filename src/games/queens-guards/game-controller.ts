// Queens & Guards Game Controller
// Orchestrates game state, UI updates, and player interactions

import {
  QueensGuardsState,
  Player,
  BoardCoord,
  createInitialState,
  cellKey,
  parseKey,
  getOpponent,
} from './types';
import { getValidMoves, makeMove, selectPiece, hasValidMoves } from './rules';
import { renderBoard, injectQGStyles, getPlayerName } from './board-ui';

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: QueensGuardsState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let vsAI = false;
let aiPlayer: Player = 'player2';

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) return;

  // Clear and re-render board
  boardContainer.innerHTML = '';
  const svg = renderBoard(gameState, handleCellClick);
  boardContainer.appendChild(svg);

  // Update status
  updateStatus();
}

function updateStatus(): void {
  if (!statusContainer) return;

  if (gameState.winner) {
    const winnerName = getPlayerName(gameState.winner);
    statusContainer.innerHTML = `
      <div class="qg-winner-banner">
        ${winnerName} wins! 👑
      </div>
    `;
    return;
  }

  // Check for stalemate
  if (!hasValidMoves(gameState)) {
    const stalematedPlayer = getPlayerName(gameState.currentPlayer);
    const winner = getOpponent(gameState.currentPlayer);
    const winnerName = getPlayerName(winner);
    statusContainer.innerHTML = `
      <div class="qg-winner-banner">
        ${stalematedPlayer} cannot move - ${winnerName} wins!
      </div>
    `;
    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass = gameState.currentPlayer === 'player1' ? 'player1' : 'player2';

  let instruction = 'Select a piece to move';
  if (gameState.selectedPiece) {
    instruction = 'Click a highlighted cell to move, or select a different piece';
  }
  if (gameState.capturedPieces.length > 0) {
    instruction = 'Place captured pieces on the outer ring';
  }

  statusContainer.innerHTML = `
    <div class="qg-status ${playerClass}">
      ${playerName}'s turn - ${instruction}
    </div>
    <div class="qg-info">
      <span>Move ${Math.floor(gameState.moveHistory.length / 2) + 1}</span>
      ${vsAI ? `<span>Playing vs AI</span>` : ''}
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleCellClick(coord: BoardCoord): void {
  if (gameState.winner) return;

  // If playing vs AI and it's AI's turn, ignore clicks
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  const key = cellKey(coord.ring, coord.position);
  const cell = gameState.cells.get(key);

  // If a piece is selected, try to move it
  if (gameState.selectedPiece) {
    const fromCoord = parseKey(gameState.selectedPiece);
    const validMoves = getValidMoves(gameState, fromCoord);
    const isValidMove = validMoves.some((m) => m.ring === coord.ring && m.position === coord.position);

    if (isValidMove) {
      // Execute move
      gameState = makeMove(gameState, fromCoord, coord);
      updateUI();

      // Check for AI turn
      if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
        setTimeout(makeAIMove, 500);
      }
      return;
    }
  }

  // Try to select a piece
  if (cell?.piece?.player === gameState.currentPlayer) {
    gameState = selectPiece(gameState, coord);
    updateUI();
    return;
  }

  // Deselect if clicking elsewhere
  if (gameState.selectedPiece) {
    gameState = { ...gameState, selectedPiece: null };
    updateUI();
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  // Get all pieces that can move
  const movablePieces: { coord: BoardCoord; moves: BoardCoord[] }[] = [];

  for (const [key, cell] of gameState.cells) {
    if (cell.piece?.player === aiPlayer) {
      const coord = parseKey(key);
      const moves = getValidMoves(gameState, coord);
      if (moves.length > 0) {
        movablePieces.push({ coord, moves });
      }
    }
  }

  if (movablePieces.length === 0) return;

  // Simple AI: prefer moves that get closer to center
  let bestMove: { from: BoardCoord; to: BoardCoord; score: number } | null = null;

  for (const { coord, moves } of movablePieces) {
    const fromCell = gameState.cells.get(cellKey(coord.ring, coord.position));
    const isQueen = fromCell?.piece?.type === 'queen';

    for (const to of moves) {
      let score = 0;

      // Prefer moving toward center
      score += (coord.ring - to.ring) * 10;

      // Queen gets bonus for moving inward
      if (isQueen) {
        score += (coord.ring - to.ring) * 20;

        // Big bonus for reaching center
        if (to.ring === 0) {
          score += 1000;
        }
      }

      // Guards get bonus for moving to inner rings (near center)
      if (!isQueen && to.ring === 1) {
        score += 50;
      }

      // Add some randomness
      score += Math.random() * 5;

      if (!bestMove || score > bestMove.score) {
        bestMove = { from: coord, to, score };
      }
    }
  }

  if (bestMove) {
    gameState = makeMove(gameState, bestMove.from, bestMove.to);
    updateUI();
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement
): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  injectQGStyles();
  gameState = createInitialState();
  vsAI = false;

  updateUI();
}

export function newGameVsHuman(): void {
  vsAI = false;
  gameState = createInitialState();
  updateUI();
}

export function newGameVsAI(): void {
  vsAI = true;
  aiPlayer = 'player2';
  gameState = createInitialState();
  updateUI();
}
