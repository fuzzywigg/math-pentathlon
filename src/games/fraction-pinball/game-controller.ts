// Fraction Pinball Game Controller
// Orchestrates game state, UI, and player interactions

import type { FractionPinballState } from './types';
import { createInitialState, getPlayerStats } from './types';
import { submitAnswer, nextChallenge, startGame } from './rules';
import {
  renderChallenge,
  renderResult,
  renderPinballBoard,
  renderScores,
  renderGameOver,
  getPlayerName,
  injectFractionPinballStyles,
  type PinballGameMode,
} from './board-ui';
import type { AIDifficulty } from './ai';
import { getAIAnswer } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { fractionPinballTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

import { clearElement } from '../../core/dom-security';

/** Think pause before computer selects an answer (snappier than 1s). */
const AI_THINK_MS = 650;
/** Auto-advance after computer result (human still reads HIT/Miss). */
const AI_RESULT_MS = 900;

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

function gameMode(): PinballGameMode {
  return isAIMode ? 'human-vs-ai' : 'human-vs-human';
}

// =============================================================================
// Module State
// =============================================================================

let gameState: FractionPinballState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';
/** Bumped to cancel in-flight AI timeouts after new game. */
let aiGeneration = 0;
/** Pending AI think / result timers — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
let resultTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimers(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
  if (resultTimer !== null) {
    clearTimeout(resultTimer);
    resultTimer = null;
  }
}
/** Display-only: points from the most recent hit (not part of rules state). */
let lastPointsAwarded = 0;

function isComputerAnswering(): boolean {
  return (
    isAIMode &&
    gameState.phase === 'answering' &&
    gameState.currentPlayer === 'player2'
  );
}

function isComputerShowingResult(): boolean {
  return (
    isAIMode &&
    gameState.phase === 'showResult' &&
    gameState.currentPlayer === 'player2'
  );
}

function statusForTurn(): string {
  if (isComputerAnswering()) {
    return 'Computer is thinking…';
  }
  if (gameState.phase === 'showResult') {
    if (isComputerShowingResult()) {
      return gameState.isCorrect
        ? 'Computer hit! Next challenge…'
        : 'Computer missed. Next challenge…';
    }
    return gameState.isCorrect ? 'HIT! Tap Continue.' : 'Miss! Tap Continue.';
  }
  if (isAIMode) {
    if (gameState.currentPlayer === 'player1') {
      return `${seatIcon('player1')} Your turn`;
    }
    return `${seatIcon('player2')} Computer's turn`;
  }
  return `${seatIcon(gameState.currentPlayer)} ${getPlayerName(gameState.currentPlayer)}'s turn`;
}

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!gameContainer) return;

  clearElement(gameContainer);

  const wrapper = document.createElement('div');
  wrapper.className = 'pinball-game-container';

  // Scores
  wrapper.appendChild(renderScores(gameState, gameMode()));

  // Game over or active game
  if (gameState.phase === 'gameOver') {
    wrapper.appendChild(renderGameOver(gameState, gameMode()));
  } else {
    // Current player status
    const status = document.createElement('div');
    status.className = `pinball-status ${gameState.currentPlayer}`;
    markStatusLive(status);
    status.textContent = statusForTurn();
    if (isComputerAnswering()) {
      status.classList.add('status-ai-thinking');
    }
    wrapper.appendChild(status);

    // Main game area — challenge first in DOM for tablet focus
    const main = document.createElement('div');
    main.className = 'pinball-main';

    if (gameState.phase === 'showResult') {
      main.appendChild(
        renderResult(gameState, handleContinue, {
          pointsAwarded: lastPointsAwarded,
          showContinue: !isComputerShowingResult(),
        })
      );
    } else {
      main.appendChild(
        renderChallenge(gameState, handleAnswerSelect, {
          allowInput: !isComputerAnswering(),
        })
      );
    }

    // Decorative board (non-interactive)
    main.appendChild(renderPinballBoard(gameState));

    wrapper.appendChild(main);
  }

  gameContainer.appendChild(wrapper);

  // AI turn — generation token cancels stacked timeouts
  if (isComputerAnswering()) {
    const gen = ++aiGeneration;
    clearAiTimers();
    aiTimer = setTimeout(() => {
      aiTimer = null;
      if (gen !== aiGeneration) return;
      aiTurn();
    }, AI_THINK_MS);
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleAnswerSelect(answer: string): void {
  if (gameState.phase !== 'answering') return;
  if (isComputerAnswering()) return;

  const before = getPlayerStats(gameState, gameState.currentPlayer).score;
  gameState = submitAnswer(gameState, answer);
  const after = getPlayerStats(gameState, gameState.currentPlayer).score;
  lastPointsAwarded = Math.max(0, after - before);
  render();
}

function handleContinue(): void {
  if (gameState.phase !== 'showResult') return;

  gameState = nextChallenge(gameState);
  lastPointsAwarded = 0;
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

  const before = getPlayerStats(gameState, 'player2').score;
  gameState = submitAnswer(gameState, selectedAnswer);
  const after = getPlayerStats(gameState, 'player2').score;
  lastPointsAwarded = Math.max(0, after - before);
  render();

  // Auto-continue after showing result
  const gen = aiGeneration;
  if (resultTimer !== null) {
    clearTimeout(resultTimer);
  }
  resultTimer = setTimeout(() => {
    resultTimer = null;
    if (gen !== aiGeneration) return;
    if (gameState.phase === 'showResult') {
      handleContinue();
    }
  }, AI_RESULT_MS);
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  injectFractionPinballStyles();
  gameContainer = containerEl;
  aiGeneration += 1;
  lastPointsAwarded = 0;
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(): void {
  aiGeneration += 1;
  lastPointsAwarded = 0;
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  lastPointsAwarded = 0;
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

/** Invalidate pending AI timeouts and drop the mount (route change). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimers();
  gameContainer = null;
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
