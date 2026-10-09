// Contig 60 Game Controller
// Orchestrates game state, UI updates, and player interactions

import type { ContigState, Player, ContigWinner } from './types';
import { createInitialState, getValidPlacements } from './types';
import { doRollDice, placeChip, passTurn, hasValidMoves } from './rules';
import {
  renderBoard,
  renderDice,
  renderExpressionSelector,
  injectContigStyles,
  getPlayerName,
} from './board-ui';
import type { AIDifficulty } from './ai';
import { getAIPlacement } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { clearElement } from '../../core/dom-security';
import { contig60Tutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';
import {
  clearNullableTimeout,
  scheduleGenerationGated,
} from '../../ui/timeout-handle';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) {
    return;
  }
  applyGameModeChrome(root, vsAI ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: ContigState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let vsAI = false;
let aiPlayer: Player = 'player2';
let aiDifficulty: AIDifficulty = 'medium';
/** Invalidates nested AI setTimeouts after route leave / new game. */
let aiGeneration = 0;
/** Single pending AI timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

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

function isComputerTurn(): boolean {
  return vsAI && gameState.currentPlayer === aiPlayer;
}

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) {
    return;
  }

  const previousFocus = captureFocusedCell(boardContainer);
  boardContainer.innerHTML = '';
  const humanCanAct = !isComputerTurn();

  // Render scores
  const scoresDiv = document.createElement('div');
  scoresDiv.className = 'contig-scores';
  scoresDiv.innerHTML = `
    <div class="contig-score contig-score-p1">
      ${seatIcon('player1')} Blue: <strong>${gameState.scores.player1}</strong> pts
    </div>
    <div class="contig-score contig-score-p2">
      ${seatIcon('player2')} Red: <strong>${gameState.scores.player2}</strong> pts
    </div>
  `;
  boardContainer.appendChild(scoresDiv);

  // Render dice area
  const diceArea = renderDice(
    gameState.currentDice,
    handleRollDice,
    gameState.phase === 'rolling' && humanCanAct
  );
  boardContainer.appendChild(diceArea);

  // Expression / pass chrome only on the human seat (blocks AI soft-lock taps)
  if (
    gameState.phase === 'calculating' &&
    gameState.currentDice &&
    humanCanAct
  ) {
    const exprSelector = renderExpressionSelector(
      gameState,
      handleSelectPlacement,
      handlePass
    );
    boardContainer.appendChild(exprSelector);
  }

  // Render board — no placement targets while the computer thinks
  const board = renderBoard(gameState, handleCellClick, {
    allowInput: humanCanAct,
  });
  boardContainer.appendChild(board);

  // Update status
  updateStatus();
  restoreGridFocus(boardContainer, previousFocus);
}

function formatEndBanner(winner: ContigWinner | null): string {
  switch (winner) {
    case 'player1':
    case 'player2':
      return `${seatIcon(winner)} ${getPlayerName(winner)} wins!`;
    case 'draw':
    case null:
      return "It's a draw!";
    default: {
      const _exhaustive: never = winner;
      return _exhaustive;
    }
  }
}

function updateStatus(): void {
  if (!statusContainer) {
    return;
  }
  markStatusLive(statusContainer);

  if (gameState.phase === 'gameOver') {
    statusContainer.innerHTML = `
      <div class="contig-winner-banner game-winner-banner">
        ${formatEndBanner(gameState.winner)}
      </div>
    `;
    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass = gameState.currentPlayer;
  const icon = seatIcon(gameState.currentPlayer);

  let instruction = '';
  if (isComputerTurn()) {
    instruction = 'Computer is thinking…';
  } else {
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
      default: {
        const _exhaustive: never = gameState.phase;
        instruction = _exhaustive;
      }
    }
  }

  statusContainer.innerHTML = `
    <div class="contig-status ${playerClass}${isComputerTurn() ? ' status-ai-thinking' : ''}">
      <strong>${icon} ${playerName}'s turn</strong> - ${instruction}
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleRollDice(fromAI: boolean | Event = false): void {
  if (gameState.phase !== 'rolling') {
    return;
  }
  // Block human UI clicks during the AI seat; AI schedules rolls with true.
  // (Click handlers pass an Event as the first arg — only `true` is AI.)
  if (fromAI !== true && vsAI && gameState.currentPlayer === aiPlayer) {
    return;
  }

  if (tutorialManager.getIsActive()) {
    tutorialManager.handleAction('click', { selector: '.contig-roll-btn' });
  }

  gameState = doRollDice(gameState);
  updateUI();

  if (tutorialManager.getIsActive()) {
    tutorialManager.refreshHighlight();
  }

  // AI takes over after showing dice
  if (
    vsAI &&
    gameState.phase !== 'gameOver' &&
    gameState.currentPlayer === aiPlayer
  ) {
    scheduleAI(makeAIMove, 1000);
  }
}

function handleSelectPlacement(value: number, expression: string): void {
  if (gameState.phase !== 'calculating') {
    return;
  }
  if (vsAI && gameState.currentPlayer === aiPlayer) {
    return;
  }

  gameState = placeChip(gameState, value, expression);
  updateUI();

  // AI turn — must pass fromAI so the roll guard does not no-op.
  if (
    vsAI &&
    gameState.phase !== 'gameOver' &&
    gameState.currentPlayer === aiPlayer
  ) {
    scheduleAI(() => handleRollDice(true), 500);
  }
}

function handleCellClick(value: number): void {
  if (gameState.phase !== 'calculating' || !gameState.currentDice) {
    return;
  }
  if (vsAI && gameState.currentPlayer === aiPlayer) {
    return;
  }

  // Find the expression for this value
  const placements = getValidPlacements(gameState, gameState.currentDice);
  const placement = placements.find((p) => p.result === value);

  if (placement) {
    handleSelectPlacement(value, placement.expression);
  }
}

function handlePass(): void {
  if (gameState.phase !== 'calculating') {
    return;
  }
  // Block human Pass Turn during the AI seat (mirrors place/roll guards).
  if (vsAI && gameState.currentPlayer === aiPlayer) {
    return;
  }

  gameState = passTurn(gameState);
  updateUI();

  // AI turn — must pass fromAI so the roll guard does not no-op.
  if (
    vsAI &&
    gameState.phase !== 'gameOver' &&
    gameState.currentPlayer === aiPlayer
  ) {
    scheduleAI(() => handleRollDice(true), 500);
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.phase === 'gameOver' || gameState.currentPlayer !== aiPlayer) {
    return;
  }
  if (gameState.phase !== 'calculating' || !gameState.currentDice) {
    return;
  }

  // Use AI module to get the best placement
  const placement = getAIPlacement(gameState, aiPlayer, aiDifficulty);

  if (!placement) {
    // Must pass - no valid moves
    gameState = passTurn(gameState);
    updateUI();

    if (
      gameState.phase !== 'gameOver' &&
      gameState.currentPlayer === aiPlayer
    ) {
      scheduleAI(() => handleRollDice(true), 500);
    }
    return;
  }

  gameState = placeChip(gameState, placement.value, placement.expression);
  updateUI();

  // Continue if AI's turn
  if (gameState.phase !== 'gameOver' && gameState.currentPlayer === aiPlayer) {
    scheduleAI(() => handleRollDice(true), 500);
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  injectContigStyles();
  aiGeneration += 1;
  clearAiTimer();
  gameState = createInitialState();
  vsAI = false;
  syncOpponentChrome();

  updateUI();
}

export function newGameVsHuman(): void {
  aiGeneration += 1;
  clearAiTimer();
  vsAI = false;
  syncOpponentChrome();
  gameState = createInitialState();
  updateUI();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  clearAiTimer();
  vsAI = true;
  syncOpponentChrome();
  aiPlayer = 'player2';
  aiDifficulty = difficulty;
  gameState = createInitialState();
  updateUI();
}

export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
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

  tutorialManager.start(contig60Tutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Cancel pending AI timers and clear mounts (route change / remount). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  if (boardContainer) {
    clearElement(boardContainer);
  }
  if (statusContainer) {
    clearElement(statusContainer);
  }
  boardContainer = null;
  statusContainer = null;
}
