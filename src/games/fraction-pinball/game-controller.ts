// Fraction Pinball Game Controller
// Orchestrates game state, UI, and player interactions

import type { FractionPinballState } from './types';
import { createInitialState } from './types';
import { submitAnswer, nextChallenge, startGame } from './rules';
import {
  renderChallenge,
  renderResult,
  renderPinballBoard,
  renderScores,
  renderGameOver,
  getPlayerName,
  injectFractionPinballStyles,
} from './board-ui';
import type { AIDifficulty } from './ai';
import { getAIAnswer } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { fractionPinballTutorial } from './tutorial';
import { clearElement } from '../../core/dom-security';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Module State
// =============================================================================

let gameState: FractionPinballState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';
/** Bumped to cancel in-flight AI timeouts after new game / destroy. */
let aiGeneration = 0;
let aiThinkTimer: ReturnType<typeof setTimeout> | null = null;
let aiContinueTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimers(): void {
  if (aiThinkTimer !== null) {
    clearTimeout(aiThinkTimer);
    aiThinkTimer = null;
  }
  if (aiContinueTimer !== null) {
    clearTimeout(aiContinueTimer);
    aiContinueTimer = null;
  }
}

function isComputerAnswering(): boolean {
  return (
    isAIMode &&
    gameState.phase === 'answering' &&
    gameState.currentPlayer === 'player2'
  );
}

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!gameContainer) return;

  gameContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'pinball-game-container';

  // Scores
  wrapper.appendChild(renderScores(gameState));

  // Game over or active game
  if (gameState.phase === 'gameOver') {
    wrapper.appendChild(renderGameOver(gameState));
  } else {
    // Current player status
    const status = document.createElement('div');
    status.className = `pinball-status ${gameState.currentPlayer}`;
    markStatusLive(status);
    if (isComputerAnswering()) {
      status.textContent = 'Computer is thinking…';
      status.classList.add('status-ai-thinking');
    } else {
      status.textContent = `${seatIcon(gameState.currentPlayer)} ${getPlayerName(gameState.currentPlayer)}'s turn`;
    }
    wrapper.appendChild(status);

    // Main game area
    const main = document.createElement('div');
    main.className = 'pinball-main';

    // Pinball board visual
    main.appendChild(renderPinballBoard(gameState));

    // Challenge or result
    if (gameState.phase === 'showResult') {
      main.appendChild(renderResult(gameState, handleContinue));
    } else {
      main.appendChild(
        renderChallenge(gameState, handleAnswerSelect, {
          allowInput: !isComputerAnswering(),
        })
      );
    }

    wrapper.appendChild(main);
  }

  gameContainer.appendChild(wrapper);

  // AI turn — generation token cancels stacked timeouts
  if (isComputerAnswering()) {
    const gen = ++aiGeneration;
    clearAiTimers();
    aiThinkTimer = setTimeout(() => {
      aiThinkTimer = null;
      if (gen !== aiGeneration) return;
      aiTurn();
    }, 1000);
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleAnswerSelect(answer: string): void {
  if (gameState.phase !== 'answering') return;
  if (isComputerAnswering()) return;

  gameState = submitAnswer(gameState, answer);
  render();
}

function handleContinue(): void {
  if (gameState.phase !== 'showResult') return;

  gameState = nextChallenge(gameState);
  render();
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  if (
    gameState.phase !== 'answering' ||
    gameState.currentPlayer !== 'player2'
  ) {
    return;
  }
  if (!gameState.currentChallenge) return;

  // Use AI module to get answer; fall back so vs-AI never soft-locks on null.
  let selectedAnswer = getAIAnswer(gameState, 'player2', aiDifficulty);
  if (!selectedAnswer) {
    const choices = gameState.currentChallenge.answerChoices;
    selectedAnswer =
      choices[0] ?? gameState.currentChallenge.correctAnswer ?? null;
  }

  if (!selectedAnswer) return;

  gameState = submitAnswer(gameState, selectedAnswer);
  render();

  // Auto-continue after showing result
  const gen = aiGeneration;
  if (aiContinueTimer !== null) {
    clearTimeout(aiContinueTimer);
  }
  aiContinueTimer = setTimeout(() => {
    aiContinueTimer = null;
    if (gen !== aiGeneration) return;
    if (gameState.phase === 'showResult') {
      handleContinue();
    }
  }, 1500);
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  injectFractionPinballStyles();
  gameContainer = containerEl;
  aiGeneration += 1;
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(): void {
  aiGeneration += 1;
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = true;
  syncOpponentChrome();
  aiDifficulty = difficulty;
  render();
}

export function getCurrentState(): FractionPinballState {
  return gameState;
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

  tutorialManager.start(fractionPinballTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Tip-held destroy hook — invalidate AI timers and drop mount DOM/listeners. */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimers();
  if (gameContainer) {
    clearElement(gameContainer);
  }
  gameContainer = null;
}
