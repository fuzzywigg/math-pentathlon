// Contig 60 Game Controller
// Orchestrates game state, UI updates, and player interactions

import {
  ContigState,
  Player,
  createInitialState,
  getOpponent,
  getValidPlacements,
} from './types';
import { doRollDice, placeChip, passTurn, hasValidMoves, calculatePoints } from './rules';
import {
  renderBoard,
  renderDice,
  renderExpressionSelector,
  injectContigStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: ContigState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let vsAI = false;
let aiPlayer: Player = 'player2';

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) return;

  boardContainer.innerHTML = '';

  // Render scores
  const scoresDiv = document.createElement('div');
  scoresDiv.className = 'contig-scores';
  scoresDiv.innerHTML = `
    <div class="contig-score contig-score-p1">
      Blue: <strong>${gameState.scores.player1}</strong> pts
    </div>
    <div class="contig-score contig-score-p2">
      Red: <strong>${gameState.scores.player2}</strong> pts
    </div>
  `;
  boardContainer.appendChild(scoresDiv);

  // Render dice area
  const diceArea = renderDice(
    gameState.currentDice,
    handleRollDice,
    gameState.phase === 'rolling' && (!vsAI || gameState.currentPlayer !== aiPlayer)
  );
  boardContainer.appendChild(diceArea);

  // Render expression selector if in calculating phase
  if (gameState.phase === 'calculating' && gameState.currentDice) {
    const exprSelector = renderExpressionSelector(
      gameState,
      handleSelectPlacement,
      handlePass
    );
    boardContainer.appendChild(exprSelector);
  }

  // Render board
  const board = renderBoard(gameState, handleCellClick);
  boardContainer.appendChild(board);

  // Update status
  updateStatus();
}

function updateStatus(): void {
  if (!statusContainer) return;

  if (gameState.winner) {
    const winnerName = getPlayerName(gameState.winner);
    const winnerScore = gameState.scores[gameState.winner];
    const loserScore = gameState.scores[getOpponent(gameState.winner)];
    statusContainer.innerHTML = `
      <div class="contig-winner-banner">
        ${winnerName} wins! ${winnerScore} - ${loserScore}
      </div>
    `;
    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass = gameState.currentPlayer;

  let instruction = '';
  switch (gameState.phase) {
    case 'rolling':
      instruction = 'Roll the dice to start your turn';
      break;
    case 'calculating':
      if (hasValidMoves(gameState)) {
        instruction = 'Choose a number to place your chip';
      } else {
        instruction = 'No valid moves - you must pass';
      }
      break;
    case 'placing':
      instruction = 'Click a valid cell to place your chip';
      break;
  }

  const passes = gameState.consecutivePasses[gameState.currentPlayer];
  const passWarning = passes > 0 ? ` (${passes}/${3} passes)` : '';

  statusContainer.innerHTML = `
    <div class="contig-status ${playerClass}">
      <strong>${playerName}'s turn</strong> - ${instruction}${passWarning}
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleRollDice(): void {
  if (gameState.phase !== 'rolling') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = doRollDice(gameState);
  updateUI();

  // AI takes over after showing dice
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(makeAIMove, 1000);
  }
}

function handleSelectPlacement(value: number, expression: string): void {
  if (gameState.phase !== 'calculating') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = placeChip(gameState, value, expression);
  updateUI();

  // AI turn
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(handleRollDice, 500);
  }
}

function handleCellClick(value: number): void {
  if (gameState.phase !== 'calculating' || !gameState.currentDice) return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  // Find the expression for this value
  const placements = getValidPlacements(gameState, gameState.currentDice);
  const placement = placements.find((p) => p.result === value);

  if (placement) {
    handleSelectPlacement(value, placement.expression);
  }
}

function handlePass(): void {
  if (gameState.phase !== 'calculating') return;

  gameState = passTurn(gameState);
  updateUI();

  // AI turn
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(handleRollDice, 500);
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;
  if (gameState.phase !== 'calculating' || !gameState.currentDice) return;

  const placements = getValidPlacements(gameState, gameState.currentDice);

  if (placements.length === 0) {
    // Must pass
    gameState = passTurn(gameState);
    updateUI();

    if (!gameState.winner && gameState.currentPlayer === aiPlayer) {
      setTimeout(handleRollDice, 500);
    }
    return;
  }

  // Choose the placement with most points, with some randomness
  let bestPlacement = placements[0];
  let bestScore = calculatePoints(gameState, placements[0].result);

  for (const placement of placements) {
    const score = calculatePoints(gameState, placement.result);
    if (score > bestScore || (score === bestScore && Math.random() > 0.5)) {
      bestPlacement = placement;
      bestScore = score;
    }
  }

  gameState = placeChip(gameState, bestPlacement.result, bestPlacement.expression);
  updateUI();

  // Continue if AI's turn
  if (!gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(handleRollDice, 500);
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement
): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  injectContigStyles();
  gameState = createInitialState();
  vsAI = false;

  updateUI();
}

export function newGameVsHuman(): void {
  vsAI = false;
  gameState = createInitialState();
  updateUI();
}

export function newGameVsAI(): void {
  vsAI = true;
  aiPlayer = 'player2';
  gameState = createInitialState();
  updateUI();
}
