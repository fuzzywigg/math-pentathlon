// Calla Game Controller

import type { CallaGameState } from './types';
import { createInitialState } from './types';
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
import type { AIDifficulty } from './ai';
import { getAIMove } from './ai';
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
/** Single pending AI timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

const AI_THINKING_DELAY = 600;
/** Faster cadence for AI free-turn chains so multi-sow bursts don't feel stuck. */
const AI_FREE_TURN_DELAY = 250;

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function scheduleAiTimeout(fn: () => void, delayMs: number): void {
  clearAiTimer();
  aiTimer = setTimeout(() => {
    aiTimer = null;
    fn();
  }, delayMs);
}

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

/** Soft-lock recovery: empty valids mid-game → existing end collection. */
function recoverIfNoValidMoves(): boolean {
  if (isGameOver(gameState)) return false;
  if (getValidPits(gameState).length > 0) return false;
  gameState = settleNoValidMoves(gameState);
  return true;
}

// Handle pit click
function handlePitClick(pitIndex: number): void {
  if (isAIThinking) return;
  if (isGameOver(gameState)) return;

  // Human seat with no legal pits (defensive) — settle instead of stalling.
  if (recoverIfNoValidMoves()) {
    render();
    notifyCallaEndIfNeeded();
    return;
  }

  const prevPlayer = gameState.currentPlayer;
  gameState = makeMove(gameState, pitIndex);
  moveCount++;
  // Fresh human sow clears the prior Easy teaching tip.
  currentHint = null;
  if (recoverIfNoValidMoves()) {
    render();
    notifyCallaEndIfNeeded();
    return;
  }
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

  scheduleAiTimeout(() => {
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

    notifyCallaEndIfNeeded();

    // Keep thinking chrome through free-turn chains so the board never shows
    // "AI's turn / 0 valid pits" in the gap before the next sow.
    if (!isGameOver(gameState) && gameState.currentPlayer === 'player2') {
      render();
      scheduleAiTimeout(triggerAITurn, AI_FREE_TURN_DELAY);
    } else {
      isAIThinking = false;
      render();
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
  // Defensive: never paint a live board with zero legal pits for the seat.
  if (!isAIThinking && recoverIfNoValidMoves()) {
    // Settled during paint — still notify owl/stats once.
    notifyCallaEndIfNeeded();
  }

  if (boardContainer) {
    const canInteract =
      !isAIThinking &&
      !isGameOver(gameState) &&
      (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1');

    renderBoard(
      gameState,
      boardContainer,
      canInteract ? handlePitClick : undefined,
      gameMode
    );
  }

  if (statusContainer) {
    renderStatus(
      gameState,
      statusContainer,
      gameMode,
      isAIThinking,
      currentHint
    );
  }
}

// Get current state
export function getGameState(): CallaGameState {
  return gameState;
}

/** Cancel pending AI timeouts and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  isAIThinking = false;
  boardContainer = null;
  statusContainer = null;
}

// Reset game (preserve AI difficulty — do not silently drop Hard → Medium)
export function resetGame(): void {
  if (gameMode === 'human-vs-ai') {
    newGameVsAI(aiDifficulty);
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
