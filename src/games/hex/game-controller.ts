// Hex Game Controller - Manages game flow and UI updates

import { HexGameState, createInitialState, DEFAULT_BOARD_SIZE } from './types';
import { makeMove, isValidMove } from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { getBestMove, AIDifficulty } from './ai';
import { owlSystem } from '../../core/owl';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexGameState;
let gameMode: GameMode = 'human-vs-human';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let aiDifficulty: AIDifficulty = 'medium';

// AI config
const AI_THINKING_DELAY = 500;

// Track game end for owl notifications
let hasNotifiedGameEnd = false;
let moveCount = 0;

// Initialize the game
export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement,
  _newGameBtn?: HTMLElement
): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  // Start a new game
  newGameVsHuman();
}

// Start a new human vs human game
export function newGameVsHuman(): void {
  gameMode = 'human-vs-human';
  gameState = createInitialState(DEFAULT_BOARD_SIZE);
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('hex');
}

// Start a new game vs AI
export function newGameVsAI(): void {
  gameMode = 'human-vs-ai';
  gameState = createInitialState(DEFAULT_BOARD_SIZE);
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('hex');
}

// Handle cell click
function handleCellClick(row: number, col: number): void {
  if (isAIThinking) return;
  if (gameState.winner) return;

  // In AI mode, only allow clicks during human's turn
  if (gameMode === 'human-vs-ai' && gameState.currentPlayer !== 'player1') {
    return;
  }

  const pos = { row, col };
  if (!isValidMove(gameState, pos)) return;

  // Make the move
  gameState = makeMove(gameState, pos);
  moveCount++;
  render();

  // Check for game end
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    owlSystem.onGameEnd('hex', {
      winner: gameState.winner,
      moveCount,
    });
  }

  // If AI mode and game not over, trigger AI move
  if (gameMode === 'human-vs-ai' && !gameState.winner && gameState.currentPlayer === 'player2') {
    triggerAIMove();
  }
}

// Trigger AI move using sophisticated AI module
function triggerAIMove(): void {
  isAIThinking = true;
  render();

  setTimeout(() => {
    const aiMove = getBestMove(gameState, 'player2', aiDifficulty);
    if (aiMove) {
      gameState = makeMove(gameState, aiMove);
      moveCount++;
    }
    isAIThinking = false;
    render();

    // Check for game end after AI move
    if (gameState.winner && !hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      owlSystem.onGameEnd('hex', {
        winner: gameState.winner,
        moveCount,
      });
    }
  }, AI_THINKING_DELAY);
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Render the game
function render(): void {
  if (boardContainer) {
    renderBoard(gameState, boardContainer, handleCellClick);
  }
  if (statusContainer) {
    renderStatus(gameState, statusContainer, gameMode, isAIThinking);
  }
}

// Get current game state (for external access)
export function getGameState(): HexGameState {
  return gameState;
}

// Reset game
export function resetGame(): void {
  if (gameMode === 'human-vs-ai') {
    newGameVsAI();
  } else {
    newGameVsHuman();
  }
}
