// Hex Game Controller - Manages game flow and UI updates

import { HexGameState, createInitialState, DEFAULT_BOARD_SIZE } from './types';
import { makeMove, isValidMove } from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { AIDifficulty, getRandomMove } from './ai';
import {
  cancelHexAiRequests,
  disposeHexAiWorker,
  getBestMoveAsync,
} from './ai-client';
import { tutorialManager } from '../../core/tutorial';
import { hexTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { applyGameModeChrome } from '../../ui/player-colors';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, gameMode);
}

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexGameState;
let gameMode: GameMode = 'human-vs-human';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let aiDifficulty: AIDifficulty = 'medium';
/** Invalidates in-flight worker replies after new game. */
let aiGeneration = 0;

// AI paint delay before worker search (search budgets are separate).
const AI_THINKING_DELAY = 250;

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
  aiGeneration += 1;
  cancelHexAiRequests();
  gameMode = 'human-vs-human';
  syncOpponentChrome();
  gameState = createInitialState(DEFAULT_BOARD_SIZE);
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('hex');
}

// Start a new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  cancelHexAiRequests();
  gameMode = 'human-vs-ai';
  aiDifficulty = difficulty;
  syncOpponentChrome();
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
  if (
    gameMode === 'human-vs-ai' &&
    !gameState.winner &&
    gameState.currentPlayer === 'player2'
  ) {
    triggerAIMove();
  }
}

// Trigger AI move using sophisticated AI module (off main thread via Worker)
function triggerAIMove(): void {
  const gen = ++aiGeneration;
  isAIThinking = true;
  render();

  setTimeout(() => {
    void (async () => {
      let aiMove = null;
      try {
        aiMove = await getBestMoveAsync(gameState, 'player2', aiDifficulty);
      } catch {
        aiMove = null;
      }
      if (gen !== aiGeneration) return;

      // Worker cancel / failure must not soft-lock the AI seat.
      if (!aiMove && !gameState.winner) {
        aiMove = getRandomMove(gameState);
      }

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
    })();
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

/** Cancel in-flight AI and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  aiGeneration += 1;
  cancelHexAiRequests();
  disposeHexAiWorker();
  isAIThinking = false;
  boardContainer = null;
  statusContainer = null;
}

// Reset game
export function resetGame(): void {
  if (gameMode === 'human-vs-ai') {
    newGameVsAI();
  } else {
    newGameVsHuman();
  }
}

// Start the tutorial (Next-only; How-to modal remains available)
export function startTutorial(): void {
  newGameVsHuman();

  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      if (event.type === 'completed') {
        newGameVsHuman();
      }
    }
  });

  tutorialManager.start(hexTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
