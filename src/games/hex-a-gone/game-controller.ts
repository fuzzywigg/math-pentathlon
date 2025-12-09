// Hex-a-Gone! Game Controller

import { HexAGoneGameState, createInitialState, BlockShape } from './types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
  isGameOver,
} from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { owlSystem } from '../../core/owl';
import { getAISelection, getAIPlacement, AIDifficulty } from './ai';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexAGoneGameState;
let gameMode: GameMode = 'human-vs-human';
let aiDifficulty: AIDifficulty = 'medium';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let hasNotifiedGameEnd = false;
let moveCount = 0;

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
  owlSystem.onGameStart('hex-a-gone');
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
  owlSystem.onGameStart('hex-a-gone');
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Handle block selection from bank
function handleBlockSelect(shape: BlockShape): void {
  if (isAIThinking) return;

  if (gameState.phase === 'selectBlocks') {
    // Toggle selection
    if (gameState.turnSelection.blocks.includes(shape)) {
      gameState = deselectBlock(gameState, shape);
    } else {
      gameState = selectBlock(gameState, shape);
    }
  } else if (gameState.phase === 'placeBlocks') {
    // Switch to this block for placement
    gameState = selectBlockForPlacement(gameState, shape);
  }

  render();
}

// Handle confirm selection
function handleConfirm(): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'selectBlocks') return;

  gameState = commitSelection(gameState);
  render();
}

// Handle cell click for placement
function handleCellClick(q: number, r: number): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'placeBlocks') return;

  const prevPlayer = gameState.currentPlayer;
  gameState = placeBlock(gameState, q, r);
  moveCount++;
  render();

  // Check for game end
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    owlSystem.onGameEnd('hex-a-gone', {
      winner: gameState.winner,
      moveCount,
    });
  }

  // Check if turn switched to AI
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2' &&
    gameState.currentPlayer !== prevPlayer
  ) {
    triggerAITurn();
  }
}

// AI turn logic
function triggerAITurn(): void {
  isAIThinking = true;
  render();

  setTimeout(() => {
    // AI selects blocks using AI module
    const aiSelectBlocks = (): void => {
      const selection = getAISelection(gameState, 'player2', aiDifficulty);

      if (!selection || selection.blocks.length === 0) {
        isAIThinking = false;
        render();
        return;
      }

      // Select each block
      for (const block of selection.blocks) {
        gameState = selectBlock(gameState, block);
      }

      gameState = commitSelection(gameState);
      render();

      // Place blocks after a delay
      setTimeout(aiPlaceBlocks, AI_THINKING_DELAY);
    };

    // AI places blocks one by one using AI module
    const aiPlaceBlocks = (): void => {
      if (gameState.phase !== 'placeBlocks' || !gameState.selectedBlockForPlacement) {
        isAIThinking = false;
        render();
        return;
      }

      const placement = getAIPlacement(gameState, 'player2', aiDifficulty);

      if (!placement) {
        isAIThinking = false;
        render();
        return;
      }

      gameState = placeBlock(gameState, placement.q, placement.r);
      moveCount++;
      render();

      // Check for game end
      if (gameState.winner && !hasNotifiedGameEnd) {
        hasNotifiedGameEnd = true;
        owlSystem.onGameEnd('hex-a-gone', {
          winner: gameState.winner,
          moveCount,
        });
      }

      // Continue placing if more blocks to place
      if (gameState.phase === 'placeBlocks' && gameState.currentPlayer === 'player2') {
        setTimeout(aiPlaceBlocks, AI_THINKING_DELAY);
      } else {
        isAIThinking = false;
        render();
      }
    };

    aiSelectBlocks();
  }, AI_THINKING_DELAY);
}

// Render the game
function render(): void {
  if (boardContainer) {
    const canInteract =
      !isAIThinking &&
      (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1');

    renderBoard(
      gameState,
      boardContainer,
      canInteract ? handleCellClick : undefined,
      canInteract ? handleBlockSelect : undefined,
      canInteract ? handleConfirm : undefined
    );
  }

  if (statusContainer) {
    renderStatus(gameState, statusContainer, gameMode, isAIThinking);
  }
}

// Get current state
export function getGameState(): HexAGoneGameState {
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
