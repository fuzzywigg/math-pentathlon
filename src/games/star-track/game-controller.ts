// Star Track Game Controller

import { StarTrackGameState, createInitialState } from './types';
import { drawChains, selectChain, isGameOver } from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { owlSystem } from '../../core/owl';
import { getAIChainChoice, AIDifficulty } from './ai';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: StarTrackGameState;
let gameMode: GameMode = 'human-vs-human';
let aiDifficulty: AIDifficulty = 'medium';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let hasNotifiedGameEnd = false;
let moveCount = 0;

const AI_THINKING_DELAY = 600;

// Initialize the game
export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement
): void {
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
  owlSystem.onGameStart('star-track');
}

// Start new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  gameMode = 'human-vs-ai';
  aiDifficulty = difficulty;
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('star-track');
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Handle draw chains action
function handleDrawChains(): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'drawChains') return;

  gameState = drawChains(gameState);
  render();
}

// Handle chain selection
function handleSelectChain(index: 0 | 1): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'selectChain') return;

  gameState = selectChain(gameState, index);
  moveCount++;
  render();

  // Check for game end
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    owlSystem.onGameEnd('star-track', {
      winner: gameState.winner,
      moveCount,
    });
  }

  // Check for AI turn
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2'
  ) {
    triggerAITurn();
  }
}

// AI turn
function triggerAITurn(): void {
  isAIThinking = true;
  render();

  // AI draws chains
  setTimeout(() => {
    gameState = drawChains(gameState);
    render();

    // AI selects chain (after a delay) using AI module
    setTimeout(() => {
      const choice = getAIChainChoice(gameState, 'player2', aiDifficulty);

      if (choice) {
        gameState = selectChain(gameState, choice.chainIndex);
        moveCount++;
      }

      isAIThinking = false;
      render();

      // Check for game end after AI move
      if (gameState.winner && !hasNotifiedGameEnd) {
        hasNotifiedGameEnd = true;
        owlSystem.onGameEnd('star-track', {
          winner: gameState.winner,
          moveCount,
        });
      }
    }, AI_THINKING_DELAY);
  }, AI_THINKING_DELAY);
}

// Render the game
function render(): void {
  if (boardContainer) {
    // Only allow interaction if it's human's turn
    const canInteract =
      !isAIThinking &&
      (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1');

    renderBoard(
      gameState,
      boardContainer,
      canInteract ? handleDrawChains : undefined,
      canInteract ? handleSelectChain : undefined
    );
  }

  if (statusContainer) {
    renderStatus(gameState, statusContainer, gameMode, isAIThinking);
  }
}

// Get current state
export function getGameState(): StarTrackGameState {
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
