// Calla Game Controller

import { CallaGameState, createInitialState } from './types';
import { makeMove, isGameOver } from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { owlSystem } from '../../core/owl';
import { getAIMove, AIDifficulty } from './ai';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: CallaGameState;
let gameMode: GameMode = 'human-vs-human';
let aiDifficulty: AIDifficulty = 'medium';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let hasNotifiedGameEnd = false;
let moveCount = 0;
let currentHint: string | null = null;

const AI_THINKING_DELAY = 800;

// Initialize the game
export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;
  newGameVsHuman();
}

// Start new human vs human game
export function newGameVsHuman(): void {
  gameMode = 'human-vs-human';
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('calla');
}

// Start new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  gameMode = 'human-vs-ai';
  aiDifficulty = difficulty;
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  currentHint = null;
  render();
  owlSystem.onGameStart('calla');
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Get current hint (for teaching mode)
export function getCurrentHint(): string | null {
  return currentHint;
}

// Handle pit click
function handlePitClick(pitIndex: number): void {
  if (isAIThinking) return;
  if (isGameOver(gameState)) return;

  const prevPlayer = gameState.currentPlayer;
  gameState = makeMove(gameState, pitIndex);
  moveCount++;
  render();

  // Check for game end
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    // Map 'tie' to 'draw' for OWL system compatibility
    const owlWinner = gameState.winner === 'tie' ? 'draw' : gameState.winner;
    owlSystem.onGameEnd('calla', {
      winner: owlWinner,
      moveCount,
    });
  }

  // Check if turn switched to AI
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2' &&
    (gameState.currentPlayer !== prevPlayer || gameState.currentPlayer === 'player2')
  ) {
    triggerAITurn();
  }
}

// AI turn logic
function triggerAITurn(): void {
  if (isGameOver(gameState)) return;
  if (gameState.currentPlayer !== 'player2') return;

  isAIThinking = true;
  render();

  setTimeout(() => {
    // Use the AI module to get the best move
    const aiMove = getAIMove(gameState, 'player2', aiDifficulty);

    if (!aiMove) {
      isAIThinking = false;
      render();
      return;
    }

    // Store hint for teaching mode (easy difficulty)
    currentHint = aiMove.hint || null;

    gameState = makeMove(gameState, aiMove.pit);
    moveCount++;
    isAIThinking = false;
    render();

    // Check for game end
    if (gameState.winner && !hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      // Map 'tie' to 'draw' for OWL system compatibility
      const owlWinner = gameState.winner === 'tie' ? 'draw' : gameState.winner;
      owlSystem.onGameEnd('calla', {
        winner: owlWinner,
        moveCount,
      });
    }

    // Check if AI gets another turn (free turn from landing in Calla)
    if (
      !isGameOver(gameState) &&
      gameState.currentPlayer === 'player2'
    ) {
      setTimeout(triggerAITurn, AI_THINKING_DELAY);
    }
  }, AI_THINKING_DELAY);
}

// Render the game
function render(): void {
  if (boardContainer) {
    const canInteract =
      !isAIThinking &&
      !isGameOver(gameState) &&
      (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1');

    renderBoard(
      gameState,
      boardContainer,
      canInteract ? handlePitClick : undefined
    );
  }

  if (statusContainer) {
    renderStatus(gameState, statusContainer, gameMode, isAIThinking);
  }
}

// Get current state
export function getGameState(): CallaGameState {
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
