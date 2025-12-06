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
import { getAIMove, applyAIMove, AIDifficulty } from './ai';
import { owlSystem } from '../../core/owl';

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: QueensGuardsState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let vsAI = false;
let aiPlayer: Player = 'player2';
let aiDifficulty: AIDifficulty = 'medium';
let hasNotifiedGameEnd = false;
let moveCount = 0;

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

    if (!hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      owlSystem.onGameEnd('queens-guards', {
        winner: gameState.winner,
        moveCount,
      });
    }

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

    if (!hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      owlSystem.onGameEnd('queens-guards', {
        winner: winner,
        moveCount,
      });
    }

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
      moveCount++;
      updateUI();

      // Check for AI turn
      if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
        setTimeout(performAIMove, 500);
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

function performAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  const aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);
  if (aiMove) {
    gameState = applyAIMove(gameState, aiMove);
    moveCount++;
    updateUI();
  }
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
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
  hasNotifiedGameEnd = false;
  moveCount = 0;
  gameState = createInitialState();
  updateUI();
  owlSystem.onGameStart('queens-guards');
}

export function newGameVsAI(): void {
  vsAI = true;
  aiPlayer = 'player2';
  hasNotifiedGameEnd = false;
  moveCount = 0;
  gameState = createInitialState();
  updateUI();
  owlSystem.onGameStart('queens-guards');
}
