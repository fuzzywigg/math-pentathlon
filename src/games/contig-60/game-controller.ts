// Contig 60 Game Controller
// Orchestrates game state, UI updates, and player interactions

import {
  ContigState,
  Player,
  ContigWinner,
  createInitialState,
  getValidPlacements,
} from './types';
import { doRollDice, placeChip, passTurn, hasValidMoves } from './rules';
import {
  renderBoard,
  renderDice,
  renderExpressionSelector,
  injectContigStyles,
  getPlayerName,
} from './board-ui';
import { getAIPlacement, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { contig60Tutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import {
  clearElement,
  replaceWithSafeHtml,
  safeHtml,
} from '../../core/dom-security';

import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
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
/** Bumped on init / New Game so pending AI setTimeouts cannot mutate a fresh match. */
let aiGeneration = 0;
/** Single pending AI timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

/** Pause before the computer rolls (keeps “thinking…” readable without dragging turns). */
const AI_ROLL_DELAY_MS = 350;
/** Pause after the computer rolls before placing / passing. */
const AI_PLACE_DELAY_MS = 450;

function isComputerTurn(): boolean {
  return vsAI && gameState.currentPlayer === aiPlayer;
}

function bumpAIGeneration(): void {
  aiGeneration += 1;
}

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

/** Schedule AI work; no-ops if New Game / mode change invalidated the generation. */
function scheduleAI(fn: () => void, delayMs: number): void {
  clearAiTimer();
  const gen = aiGeneration;
  aiTimer = setTimeout(() => {
    aiTimer = null;
    if (gen !== aiGeneration) return;
    fn();
  }, delayMs);
}

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) return;

  const previousFocus = captureFocusedCell(boardContainer);
  clearElement(boardContainer);
  const humanCanAct = !isComputerTurn();

  // Render scores
  const scoresDiv = document.createElement('div');
  scoresDiv.className = 'contig-scores';
  replaceWithSafeHtml(
    scoresDiv,
    safeHtml`
    <div class="contig-score contig-score-p1">
      ${seatIcon('player1')} Blue: <strong>${gameState.scores.player1}</strong> pts
    </div>
    <div class="contig-score contig-score-p2">
      ${seatIcon('player2')} Red: <strong>${gameState.scores.player2}</strong> pts
    </div>
  `
  );
  boardContainer.appendChild(scoresDiv);

  // Render dice area
  const diceArea = renderDice(
    gameState.currentDice,
    handleRollDice,
    gameState.phase === 'rolling' && humanCanAct
  );
  boardContainer.appendChild(diceArea);

  // Board before expression list so green targets stay above the fold on tablets
  const board = renderBoard(gameState, handleCellClick, {
    allowInput: humanCanAct,
  });
  boardContainer.appendChild(board);

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
  if (!statusContainer) return;
  markStatusLive(statusContainer);

  if (gameState.phase === 'gameOver') {
    replaceWithSafeHtml(
      statusContainer,
      safeHtml`
      <div class="contig-winner-banner game-winner-banner">
        ${formatEndBanner(gameState.winner)}
      </div>
    `
    );
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
          instruction =
            'Tap a green number on the board, or pick an expression below';
        } else {
          instruction = 'No valid moves — tap Pass Turn';
        }
        break;
      case 'placing':
        // Phase retained for typing exhaustiveness; placement resolves in calculating.
        instruction = 'Select a green number to place your chip';
        break;
      default: {
        const _exhaustive: never = gameState.phase;
        instruction = _exhaustive;
      }
    }
  }

  replaceWithSafeHtml(
    statusContainer,
    safeHtml`
    <div class="contig-status">
      <strong>${icon} ${playerName}'s turn</strong> - ${instruction}
    </div>
  `
  );
  const statusEl = statusContainer.querySelector('.contig-status');
  if (statusEl) {
    statusEl.className = `contig-status ${playerClass}${isComputerTurn() ? ' status-ai-thinking' : ''}`;
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleRollDice(fromAI: boolean | Event = false): void {
  if (gameState.phase !== 'rolling') return;
  // Block human UI clicks during the AI seat; AI schedules rolls with true.
  // (Click handlers pass an Event as the first arg — only `true` is AI.)
  if (fromAI !== true && vsAI && gameState.currentPlayer === aiPlayer) return;
  // Stale timers after New Game must not roll for the human seat.
  if (fromAI === true && (!vsAI || gameState.currentPlayer !== aiPlayer)) {
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
    scheduleAI(makeAIMove, AI_PLACE_DELAY_MS);
  }
}

function handleSelectPlacement(value: number, expression: string): void {
  if (gameState.phase !== 'calculating') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = placeChip(gameState, value, expression);
  updateUI();

  // AI turn — must pass fromAI so the roll guard does not no-op.
  if (
    vsAI &&
    gameState.phase !== 'gameOver' &&
    gameState.currentPlayer === aiPlayer
  ) {
    scheduleAI(() => handleRollDice(true), AI_ROLL_DELAY_MS);
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
  // Block human Pass Turn during the AI seat (mirrors place/roll guards).
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = passTurn(gameState);
  updateUI();

  // AI turn — must pass fromAI so the roll guard does not no-op.
  if (
    vsAI &&
    gameState.phase !== 'gameOver' &&
    gameState.currentPlayer === aiPlayer
  ) {
    scheduleAI(() => handleRollDice(true), AI_ROLL_DELAY_MS);
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.phase === 'gameOver' || gameState.currentPlayer !== aiPlayer)
    return;
  if (gameState.phase !== 'calculating' || !gameState.currentDice) return;

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
      scheduleAI(() => handleRollDice(true), AI_ROLL_DELAY_MS);
    }
    return;
  }

  gameState = placeChip(gameState, placement.value, placement.expression);
  updateUI();

  // Continue if AI's turn
  if (gameState.phase !== 'gameOver' && gameState.currentPlayer === aiPlayer) {
    scheduleAI(() => handleRollDice(true), AI_ROLL_DELAY_MS);
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  injectContigStyles();
  bumpAIGeneration();
  gameState = createInitialState();
  vsAI = false;
  syncOpponentChrome();

  updateUI();
}

export function newGameVsHuman(): void {
  bumpAIGeneration();
  vsAI = false;
  syncOpponentChrome();
  gameState = createInitialState();
  updateUI();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  bumpAIGeneration();
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

/** Cancel pending AI timeouts and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  bumpAIGeneration();
  clearAiTimer();
  boardContainer = null;
  statusContainer = null;
}
