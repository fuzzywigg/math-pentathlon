// Hex-a-Gone! Game Controller

import { HexAGoneGameState, createInitialState, BlockShape, getAvailableShapes } from './types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
  isGameOver,
} from './rules';
import { renderBoard, renderStatus } from './board-ui';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexAGoneGameState;
let gameMode: GameMode = 'human-vs-human';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;

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
  render();
}

// Start new game vs AI
export function newGameVsAI(): void {
  gameMode = 'human-vs-ai';
  gameState = createInitialState();
  isAIThinking = false;
  render();
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
  render();

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
    // AI selects blocks
    const aiSelectBlocks = (): void => {
      const available = getAvailableShapes(gameState);
      if (available.length === 0) {
        isAIThinking = false;
        render();
        return;
      }

      // AI strategy: select 1-2 random blocks
      const numToSelect = Math.min(2, available.length);
      const shuffled = [...available].sort(() => Math.random() - 0.5);

      for (let i = 0; i < numToSelect; i++) {
        gameState = selectBlock(gameState, shuffled[i]);
      }

      gameState = commitSelection(gameState);
      render();

      // Place blocks after a delay
      setTimeout(aiPlaceBlocks, AI_THINKING_DELAY);
    };

    // AI places blocks one by one
    const aiPlaceBlocks = (): void => {
      if (gameState.phase !== 'placeBlocks' || !gameState.selectedBlockForPlacement) {
        isAIThinking = false;
        render();
        return;
      }

      // Find empty cells
      const emptyCells = gameState.board.filter(c => !c.filled);
      if (emptyCells.length === 0) {
        isAIThinking = false;
        render();
        return;
      }

      // Pick a random empty cell
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameState = placeBlock(gameState, randomCell.q, randomCell.r);
      render();

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
