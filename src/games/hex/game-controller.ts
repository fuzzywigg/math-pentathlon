// Hex Game Controller - Manages game flow and UI updates

import { HexGameState, createInitialState, DEFAULT_BOARD_SIZE } from './types';
import { makeMove, isValidMove } from './rules';
import { renderBoard, renderStatus } from './board-ui';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexGameState;
let gameMode: GameMode = 'human-vs-human';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;

// AI config (simple for now, can be enhanced later)
const AI_THINKING_DELAY = 500;

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
  render();
}

// Start a new game vs AI
export function newGameVsAI(): void {
  gameMode = 'human-vs-ai';
  gameState = createInitialState(DEFAULT_BOARD_SIZE);
  isAIThinking = false;
  render();
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
  render();

  // If AI mode and game not over, trigger AI move
  if (gameMode === 'human-vs-ai' && !gameState.winner && gameState.currentPlayer === 'player2') {
    triggerAIMove();
  }
}

// Trigger AI move
function triggerAIMove(): void {
  isAIThinking = true;
  render();

  setTimeout(() => {
    const aiMove = getAIMove(gameState);
    if (aiMove) {
      gameState = makeMove(gameState, aiMove);
    }
    isAIThinking = false;
    render();
  }, AI_THINKING_DELAY);
}

// Simple AI - picks a random valid move with some basic strategy
function getAIMove(state: HexGameState): { row: number; col: number } | null {
  const validMoves: { row: number; col: number }[] = [];

  for (let row = 0; row < state.boardSize; row++) {
    for (let col = 0; col < state.boardSize; col++) {
      if (state.board[row][col] === null) {
        validMoves.push({ row, col });
      }
    }
  }

  if (validMoves.length === 0) return null;

  // Simple strategy: prefer center and moves that extend existing chains
  // For now, just add some preference for center
  const center = Math.floor(state.boardSize / 2);

  // Score moves based on distance to center (lower is better)
  const scoredMoves = validMoves.map((move) => {
    const distToCenter = Math.abs(move.row - center) + Math.abs(move.col - center);
    // Add randomness
    const score = distToCenter + Math.random() * 3;
    return { move, score };
  });

  // Sort by score and pick from top moves
  scoredMoves.sort((a, b) => a.score - b.score);

  // Pick from top 5 moves randomly
  const topMoves = scoredMoves.slice(0, Math.min(5, scoredMoves.length));
  const selected = topMoves[Math.floor(Math.random() * topMoves.length)];

  return selected.move;
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
