// Frac Fact Game Controller
// Orchestrates game state, UI, and player interactions

import {
  FracFactState,
  createInitialState,
  Difficulty,
} from './types';
import {
  submitAnswer,
  nextProblem,
  startGame,
} from './rules';
import {
  renderProblem,
  renderAnswerChoices,
  renderResult,
  renderScores,
  renderGameOver,
  getPlayerName,
  injectFracFactStyles,
} from './board-ui';
import { Fraction } from '../../core/fractions/types';
import { getAIAnswer, AIDifficulty } from './ai';

// =============================================================================
// Module State
// =============================================================================

let gameState: FracFactState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!gameContainer) return;

  gameContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'frac-game-container';

  // Scores
  wrapper.appendChild(renderScores(gameState));

  // Current player status
  if (gameState.phase !== 'gameOver') {
    const status = document.createElement('div');
    status.className = `frac-status ${gameState.currentPlayer}`;
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn`;
    wrapper.appendChild(status);
  }

  // Main game area based on phase
  if (gameState.phase === 'gameOver') {
    wrapper.appendChild(renderGameOver(gameState));
  } else if (gameState.phase === 'showingResult') {
    wrapper.appendChild(renderProblem(gameState));
    wrapper.appendChild(renderResult(gameState, handleContinue));
  } else {
    wrapper.appendChild(renderProblem(gameState));
    wrapper.appendChild(renderAnswerChoices(gameState, handleAnswerSelect));
  }

  gameContainer.appendChild(wrapper);

  // AI turn
  if (isAIMode && gameState.phase === 'playing' && gameState.currentPlayer === 'player2') {
    setTimeout(aiTurn, 1000);
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleAnswerSelect(answer: Fraction): void {
  if (gameState.phase !== 'playing') return;

  gameState = submitAnswer(gameState, answer);
  render();
}

function handleContinue(): void {
  if (gameState.phase !== 'showingResult') return;

  gameState = nextProblem(gameState);
  render();
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  if (gameState.phase !== 'playing' || gameState.currentPlayer !== 'player2') return;
  if (!gameState.currentProblem) return;

  // Use AI module to get answer
  const selectedAnswer = getAIAnswer(gameState, 'player2', aiDifficulty);

  if (selectedAnswer) {
    gameState = submitAnswer(gameState, selectedAnswer);
    render();

    // Auto-continue after showing result
    setTimeout(() => {
      if (gameState.phase === 'showingResult') {
        handleContinue();
      }
    }, 1500);
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  injectFracFactStyles();
  gameContainer = containerEl;
  gameState = createInitialState('medium');
  gameState = startGame(gameState);
  isAIMode = false;
  render();
}

export function newGameVsHuman(difficulty: Difficulty = 'medium'): void {
  gameState = createInitialState(difficulty);
  gameState = startGame(gameState);
  isAIMode = false;
  render();
}

export function newGameVsAI(difficulty: Difficulty = 'medium', aiDiff: AIDifficulty = 'medium'): void {
  gameState = createInitialState(difficulty);
  gameState = startGame(gameState);
  isAIMode = true;
  aiDifficulty = aiDiff;
  render();
}

export function setDifficulty(difficulty: Difficulty): void {
  if (gameState.problemsCompleted === 0) {
    gameState = { ...gameState, difficulty };
    gameState = startGame(gameState);
    render();
  }
}

export function getCurrentState(): FracFactState {
  return gameState;
}
