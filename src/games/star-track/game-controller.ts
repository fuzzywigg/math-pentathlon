// Star Track Game Controller

import type { StarTrackGameState } from './types';
import { createInitialState } from './types';
import { drawChains, selectChain, isGameOver } from './rules';
import { renderBoard, renderStatus } from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { starTrackTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import type { AIDifficulty } from './ai';
import { getAIChainChoice } from './ai';
import { applyGameModeChrome } from '../../ui/player-colors';
import {
  clearNullableTimeout,
  scheduleGenerationGated,
} from '../../ui/timeout-handle';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadStarTrackBoard3DModule } from './board-3d-loader';
import type { StarTrackBoard3D } from '../../ui/three/star-track-board-3d';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) {
    return;
  }
  applyGameModeChrome(root, gameMode);
}

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
/** Invalidates nested AI setTimeouts after route leave / new game. */
let aiGeneration = 0;
/** Single pending AI think-delay timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

let board3d: StarTrackBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;

const AI_THINKING_DELAY = 600;

function clearAiTimer(): void {
  aiTimer = clearNullableTimeout(aiTimer);
}

/** Schedule AI work; no-ops if New Game / route leave invalidated the generation. */
function scheduleAI(fn: () => void, delayMs: number): void {
  scheduleGenerationGated(
    {
      clearTimer: clearAiTimer,
      setTimer: (t: ReturnType<typeof setTimeout> | null) => {
        aiTimer = t;
      },
      getGeneration: () => aiGeneration,
    },
    fn,
    delayMs
  );
}

function unmountBoard3d(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
}

function fallbackTo2dBoard(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dEnabled = false;
  board3dLoading = null;
  render();
}

async function ensureBoard3d(): Promise<void> {
  if (!boardContainer || board3d || !board3dEnabled) {
    return;
  }
  try {
    const mod = await loadStarTrackBoard3DModule();
    if (!boardContainer || !board3dEnabled) {
      return;
    }
    board3d = await mod.createStarTrackBoard3D(boardContainer, () => {
      fallbackTo2dBoard();
    });
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    board3d = null;
    board3dEnabled = false;
  }
}

function canHumanInteract(): boolean {
  return (
    !isAIThinking &&
    (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1')
  );
}

// Initialize the game
export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  unmountBoard3d();
  boardContainer = boardEl;
  statusContainer = statusEl;

  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      render();
    });
  }

  newGameVsHuman();
}

// Start new human vs human game
export function newGameVsHuman(): void {
  aiGeneration += 1;
  clearAiTimer();
  gameMode = 'human-vs-human';
  syncOpponentChrome();
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('star-track');
}

// Start new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  clearAiTimer();
  gameMode = 'human-vs-ai';
  syncOpponentChrome();
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
  if (!canHumanInteract()) {
    return;
  }
  if (gameState.phase !== 'drawChains') {
    return;
  }

  if (tutorialManager.getIsActive()) {
    tutorialManager.handleAction('click', { selector: '.star-track-draw-btn' });
  }

  gameState = drawChains(gameState);
  render();

  // Choices appear after draw; re-ring the choose-chain highlight
  if (tutorialManager.getIsActive()) {
    tutorialManager.refreshHighlight();
  }
}

// Handle chain selection
function handleSelectChain(index: 0 | 1): void {
  if (!canHumanInteract()) {
    return;
  }
  if (gameState.phase !== 'selectChain') {
    return;
  }

  if (tutorialManager.getIsActive()) {
    tutorialManager.handleAction('click', { selector: '.star-track-choices' });
  }

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
  scheduleAI(() => {
    gameState = drawChains(gameState);
    render();

    // AI selects chain (after a delay) using AI module
    scheduleAI(() => {
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
    const canInteract = canHumanInteract();

    if (board3dEnabled && board3d) {
      board3d.update(gameState, {
        onDrawChains: canInteract ? handleDrawChains : undefined,
        onSelectChain: canInteract ? handleSelectChain : undefined,
      });
    } else if (!board3dEnabled) {
      renderBoard(
        gameState,
        boardContainer,
        canInteract ? handleDrawChains : undefined,
        canInteract ? handleSelectChain : undefined
      );
    }
    // If 3D enabled but still loading → skip board paint until ready
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

// Start the tutorial
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

  tutorialManager.start(starTrackTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Dispose 3D resources and clear mounts (route change). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  isAIThinking = false;
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
}

/** Whether the live controller is using the 3D board path. */
export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

/** Await pending 3D mount (tests / callers that need the canvas ready). */
export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}
