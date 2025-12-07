// Calla Game Controller

import { CallaGameState, createInitialState } from './types';
import { makeMove, isGameOver, getValidPits } from './rules';
import { renderBoard, renderStatus } from './board-ui';

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: CallaGameState;
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

// Handle pit click
function handlePitClick(pitIndex: number): void {
  if (isAIThinking) return;
  if (isGameOver(gameState)) return;

  const prevPlayer = gameState.currentPlayer;
  gameState = makeMove(gameState, pitIndex);
  render();

  // Check if turn switched to AI
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2' &&
    (gameState.currentPlayer !== prevPlayer || gameState.currentPlayer === 'player2')
  ) {
    triggerAITurn();
  }
}

// AI turn logic
function triggerAITurn(): void {
  if (isGameOver(gameState)) return;
  if (gameState.currentPlayer !== 'player2') return;

  isAIThinking = true;
  render();

  setTimeout(() => {
    // AI strategy: evaluate each valid pit
    const validPits = getValidPits(gameState);

    if (validPits.length === 0) {
      isAIThinking = false;
      render();
      return;
    }

    // Simple AI: prioritize moves that:
    // 1. Land in Calla (free turn)
    // 2. Can capture opponent's cubes
    // 3. Otherwise pick the pit with most cubes

    let bestPit = validPits[0];
    let bestScore = -Infinity;

    for (const pitIndex of validPits) {
      let score = 0;
      const cubes = gameState.player2Pits[pitIndex];

      // Simulate move to check for free turn or capture
      const afterMove = makeMove(gameState, pitIndex);

      // Free turn is very valuable
      if (afterMove.currentPlayer === 'player2' && !isGameOver(afterMove)) {
        score += 100;
      }

      // Capture is valuable
      const captured = afterMove.player2Calla - gameState.player2Calla;
      if (captured > cubes) {
        score += captured * 10;
      }

      // Prefer pits with more cubes (moves pieces forward faster)
      score += cubes;

      // Avoid leaving opponent with easy captures
      // (this could be more sophisticated)

      if (score > bestScore) {
        bestScore = score;
        bestPit = pitIndex;
      }
    }

    gameState = makeMove(gameState, bestPit);
    isAIThinking = false;
    render();

    // Check if AI gets another turn (free turn from landing in Calla)
    if (
      !isGameOver(gameState) &&
      gameState.currentPlayer === 'player2'
    ) {
      setTimeout(triggerAITurn, AI_THINKING_DELAY);
    }
  }, AI_THINKING_DELAY);
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

// Reset game
export function resetGame(): void {
  if (gameMode === 'human-vs-ai') {
    newGameVsAI();
  } else {
    newGameVsHuman();
  }
}
