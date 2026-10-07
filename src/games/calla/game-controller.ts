// Calla Game Controller

import { CallaGameState, createInitialState } from './types';
import {
  makeMove,
  isGameOver,
  getValidPits,
  settleNoValidMoves,
} from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { callaTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { getAIMove, AIDifficulty } from './ai';
import { applyGameModeChrome } from '../../ui/player-colors';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, gameMode);
}

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
/** Invalidates pending AI timeouts after new game / destroy. */
let aiGeneration = 0;

const AI_THINKING_DELAY = 800;

// Initialize the game
export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;
  newGameVsHuman();
}

// Start new human vs human game
export function newGameVsHuman(): void {
  aiGeneration += 1;
  gameMode = 'human-vs-human';
  syncOpponentChrome();
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('calla');
}

// Start new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  gameMode = 'human-vs-ai';
  syncOpponentChrome();
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

  notifyCallaEndIfNeeded();

  // Check if turn switched to AI
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2' &&
    (gameState.currentPlayer !== prevPlayer ||
      gameState.currentPlayer === 'player2')
  ) {
    triggerAITurn();
  }
}

// AI turn logic
function triggerAITurn(): void {
  if (isGameOver(gameState)) return;
  if (gameState.currentPlayer !== 'player2') return;

  const gen = ++aiGeneration;
  isAIThinking = true;
  render();

  setTimeout(() => {
    if (gen !== aiGeneration) return;

    // Use the AI module to get the best move
    let aiMove = getAIMove(gameState, 'player2', aiDifficulty);

    // Soft-lock recovery: null search with legal pits → first valid; empty → end settle.
    if (!aiMove) {
      const valids = getValidPits(gameState);
      if (valids.length > 0) {
        aiMove = { pit: valids[0]! };
      } else {
        gameState = settleNoValidMoves(gameState);
        isAIThinking = false;
        render();
        notifyCallaEndIfNeeded();
        return;
      }
    }

    // Store hint for teaching mode (easy difficulty)
    currentHint = aiMove.hint || null;

    gameState = makeMove(gameState, aiMove.pit);
    moveCount++;
    isAIThinking = false;
    render();

    notifyCallaEndIfNeeded();

    // Check if AI gets another turn (free turn from landing in Calla)
    if (!isGameOver(gameState) && gameState.currentPlayer === 'player2') {
      setTimeout(triggerAITurn, AI_THINKING_DELAY);
    }
  }, AI_THINKING_DELAY);
}

function notifyCallaEndIfNeeded(): void {
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    const owlWinner = gameState.winner === 'tie' ? 'draw' : gameState.winner;
    owlSystem.onGameEnd('calla', {
      winner: owlWinner,
      moveCount,
    });
  }
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

/** Cancel pending AI timeouts and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  aiGeneration += 1;
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

/**
 * Drop into a fresh interactive practice board (human vs human).
 * Used after tutorial Finish — same machinery as a normal new game.
 */
export function startPracticeGame(): void {
  newGameVsHuman();
}

// Start the tutorial
export function startTutorial(): void {
  newGameVsHuman();

  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      if (event.type === 'completed') {
        // Finish → playable practice board
        startPracticeGame();
      }
    }
  });

  tutorialManager.start(callaTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
