// Frac Fact Game Controller
// Orchestrates game state, UI, and player interactions

import { FracFactState, createInitialState, Difficulty } from './types';
import { submitAnswer, nextProblem, startGame } from './rules';
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
import { getAIAnswer, isAITurn, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { fracFactTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

/** True while it is the computer's seat (including the think pause). */
function isComputerTurnPending(): boolean {
  return isAITurn(gameState, isAIMode ? 'player2' : null);
}

// =============================================================================
// Module State
// =============================================================================

let gameState: FracFactState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';
/** Single pending AI timer — avoids stacked setTimeouts from UI rebuilds. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
let resultTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function clearResultTimer(): void {
  if (resultTimer !== null) {
    clearTimeout(resultTimer);
    resultTimer = null;
  }
}

function scheduleAiTurn(): void {
  if (aiTimer !== null) return;
  aiTimer = setTimeout(() => {
    aiTimer = null;
    aiTurn();
  }, 1000);
}

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!gameContainer) return;

  gameContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'frac-game-container';

  const computerTurn = isComputerTurnPending();

  // Scores
  wrapper.appendChild(renderScores(gameState));

  // Current player status
  if (gameState.phase !== 'gameOver') {
    const status = document.createElement('div');
    status.className = `frac-status ${gameState.currentPlayer}`;
    markStatusLive(status);
    if (computerTurn) {
      status.textContent = `${seatIcon(gameState.currentPlayer)} Computer is thinking…`;
    } else {
      status.textContent = `${seatIcon(gameState.currentPlayer)} ${getPlayerName(gameState.currentPlayer)}'s turn`;
    }
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
    wrapper.appendChild(
      renderAnswerChoices(gameState, handleAnswerSelect, {
        allowInput: !computerTurn,
      })
    );
  }

  gameContainer.appendChild(wrapper);

  // AI turn — schedule once while computer seat is pending
  if (computerTurn) {
    scheduleAiTurn();
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleAnswerSelect(answer: Fraction): void {
  if (isComputerTurnPending()) return;
  if (gameState.phase !== 'playing') return;

  gameState = submitAnswer(gameState, answer);
  render();
}

function handleContinue(): void {
  if (gameState.phase !== 'showingResult') return;

  clearResultTimer();
  gameState = nextProblem(gameState);
  render();
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  if (gameState.phase !== 'playing' || gameState.currentPlayer !== 'player2')
    return;
  if (!gameState.currentProblem) return;

  // Use AI module to get answer
  const selectedAnswer = getAIAnswer(gameState, 'player2', aiDifficulty);

  if (selectedAnswer) {
    gameState = submitAnswer(gameState, selectedAnswer);
    render();

    // Auto-continue after showing result
    clearResultTimer();
    resultTimer = setTimeout(() => {
      resultTimer = null;
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
  clearAiTimer();
  clearResultTimer();
  gameContainer = containerEl;
  gameState = createInitialState('medium');
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(difficulty: Difficulty = 'medium'): void {
  clearAiTimer();
  clearResultTimer();
  gameState = createInitialState(difficulty);
  gameState = startGame(gameState);
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(
  difficulty: Difficulty = 'medium',
  aiDiff: AIDifficulty = 'medium'
): void {
  clearAiTimer();
  clearResultTimer();
  gameState = createInitialState(difficulty);
  gameState = startGame(gameState);
  isAIMode = true;
  syncOpponentChrome();
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

/** Clear pending AI/result timers and drop the mount (route change). */
export function destroyGame(): void {
  clearAiTimer();
  clearResultTimer();
  gameContainer = null;
}

/** Test helper: inject state and re-render. */
export function __setStateForTests(state: FracFactState): void {
  gameState = state;
  render();
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

  tutorialManager.start(fracFactTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
