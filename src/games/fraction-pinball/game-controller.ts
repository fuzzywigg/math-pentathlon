// Fraction Pinball Game Controller
// Orchestrates game state, UI, and player interactions

import {
  FractionPinballState,
  createInitialState,
} from './types';
import {
  submitAnswer,
  nextChallenge,
  startGame,
} from './rules';
import {
  renderChallenge,
  renderResult,
  renderPinballBoard,
  renderScores,
  renderGameOver,
  getPlayerName,
  injectFractionPinballStyles,
} from './board-ui';

// =============================================================================
// Module State
// =============================================================================

let gameState: FractionPinballState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;

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
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn`;
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
      main.appendChild(renderChallenge(gameState, handleAnswerSelect));
    }

    wrapper.appendChild(main);
  }

  gameContainer.appendChild(wrapper);

  // AI turn
  if (isAIMode && gameState.phase === 'answering' && gameState.currentPlayer === 'player2') {
    setTimeout(aiTurn, 1000);
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleAnswerSelect(answer: string): void {
  if (gameState.phase !== 'answering') return;

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
  if (gameState.phase !== 'answering' || gameState.currentPlayer !== 'player2') return;
  if (!gameState.currentChallenge) return;

  const choices = gameState.currentChallenge.answerChoices;
  const correctAnswer = gameState.currentChallenge.correctAnswer;

  // AI accuracy - gets it right most of the time
  const accuracy = 0.75;

  let selectedAnswer: string;
  if (Math.random() < accuracy) {
    selectedAnswer = correctAnswer;
  } else {
    // Pick a random wrong answer
    const wrongChoices = choices.filter(c => c !== correctAnswer);
    selectedAnswer = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
  }

  gameState = submitAnswer(gameState, selectedAnswer);
  render();

  // Auto-continue after showing result
  setTimeout(() => {
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
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  render();
}

export function newGameVsHuman(): void {
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = false;
  render();
}

export function newGameVsAI(): void {
  gameState = createInitialState();
  gameState = startGame(gameState);
  isAIMode = true;
  render();
}

export function getCurrentState(): FractionPinballState {
  return gameState;
}
