// Remainder Islands Game Controller
// Orchestrates game state, UI, and player interactions

import type { RemainderIslandsState } from './types';
import { createInitialState } from './types';
import { performRoll, selectIsland, setSelectedIsland } from './rules';
import {
  renderBoard,
  syncBoard,
  renderDice,
  renderScores,
  renderDivisionPreview,
  renderGameOver,
  getPlayerName,
  injectRemainderIslandsStyles,
} from './board-ui';
import type { AIDifficulty } from './ai';
import { getAIIslandChoice } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { remainderIslandsTutorial } from './tutorial';
import { syncAppOpponentChrome } from '../../ui/player-colors';
import {
  clearNullableTimeout,
  scheduleGenerationGated,
} from '../../ui/timeout-handle';
import { markStatusLive } from '../../ui/board-a11y';

import { clearElement } from '../../core/dom-security';

function syncOpponentChrome(): void {
  syncAppOpponentChrome(isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Module State
// =============================================================================

let gameState: RemainderIslandsState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';
/** Live-status flash when a roll finds no open islands (soft-lock UX). */
let skipNotice: string | null = null;
/** Invalidates nested AI setTimeouts after route leave / new game. */
let aiGeneration = 0;
/** Single pending AI timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
/**
 * After a human roll (esp. empty-valid skip), ignore a rapid second Roll so
 * double-click/tap cannot operate the opponent's newly painted Roll control.
 */
const HUMAN_ROLL_SETTLE_MS = 250;
let humanRollSettleTimer: ReturnType<typeof setTimeout> | null = null;

function clearHumanRollSettle(): void {
  if (humanRollSettleTimer !== null) {
    clearTimeout(humanRollSettleTimer);
    humanRollSettleTimer = null;
  }
}

function markHumanRollSettle(): void {
  clearHumanRollSettle();
  humanRollSettleTimer = setTimeout(() => {
    humanRollSettleTimer = null;
  }, HUMAN_ROLL_SETTLE_MS);
}

function isHumanRollSettling(): boolean {
  return humanRollSettleTimer !== null;
}

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

// =============================================================================
// Rendering
// =============================================================================

function isComputerTurn(): boolean {
  return isAIMode && gameState.currentPlayer === 'player2';
}

function patchDivisionPreview(): void {
  if (!gameContainer) return;
  const existing = gameContainer.querySelector('.remainder-preview');
  const next = gameState.selectedIsland
    ? renderDivisionPreview(gameState)
    : null;

  if (existing && next) {
    existing.replaceWith(next);
    return;
  }
  if (existing && !next) {
    existing.remove();
    return;
  }
  if (!existing && next) {
    // Insert ahead of controls / board so the equation stays near the dice.
    const controls = gameContainer.querySelector('.remainder-controls');
    if (controls) {
      controls.before(next);
    } else {
      gameContainer
        .querySelector('.remainder-game-container')
        ?.appendChild(next);
    }
  }
}

function buildRollButton(): HTMLButtonElement {
  const rollBtn = document.createElement('button');
  rollBtn.className = 'remainder-btn remainder-btn-roll';
  rollBtn.textContent = '🎲 Roll Dice';
  // Reject multi-click detail>1 so a double-click cannot roll for the
  // opponent after an empty-valid skip rebuilds this button in place.
  rollBtn.addEventListener('click', (event) => {
    if (event.detail > 1) return;
    handleRoll();
  });
  return rollBtn;
}

function fillActiveChrome(
  wrapper: HTMLElement,
  computerTurn: boolean,
  board: SVGElement | null
): void {
  let status = wrapper.querySelector('.remainder-status') as HTMLElement | null;
  if (!status) {
    status = document.createElement('div');
    const dice = wrapper.querySelector('.remainder-dice');
    if (dice) {
      wrapper.insertBefore(status, dice);
    } else {
      wrapper.appendChild(status);
    }
  }
  status.className = `remainder-status ${gameState.currentPlayer}`;
  if (skipNotice) {
    status.textContent = skipNotice;
  } else if (computerTurn) {
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn (computer)`;
  } else {
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn`;
  }
  markStatusLive(status);

  const nextDice = renderDice(gameState.currentRoll);
  const existingDice = wrapper.querySelector('.remainder-dice');
  if (existingDice) {
    existingDice.replaceWith(nextDice);
  } else {
    wrapper.appendChild(nextDice);
  }

  wrapper.querySelector('.remainder-preview')?.remove();

  const controls = document.createElement('div');
  controls.className = 'remainder-controls';
  if (gameState.phase === 'rolling') {
    if (computerTurn) {
      const wait = document.createElement('div');
      wait.className = 'remainder-instruction';
      wait.textContent = 'Computer is thinking…';
      controls.appendChild(wait);
    } else {
      controls.appendChild(buildRollButton());
    }
  } else if (gameState.phase === 'selectIsland') {
    const instruction = document.createElement('div');
    instruction.className = 'remainder-instruction';
    instruction.textContent = computerTurn
      ? 'Computer is choosing an island'
      : 'Select an island to land on';
    controls.appendChild(instruction);
    if (gameState.selectedIsland) {
      const preview = renderDivisionPreview(gameState);
      if (board) {
        board.before(preview);
      } else {
        wrapper.appendChild(preview);
      }
    }
  }

  const existingControls = wrapper.querySelector('.remainder-controls');
  if (existingControls) {
    existingControls.replaceWith(controls);
  } else if (board) {
    board.before(controls);
  } else {
    wrapper.appendChild(controls);
  }
}

function render(): void {
  if (!gameContainer) return;

  const computerTurn = isComputerTurn();
  const existingWrapper = gameContainer.querySelector(
    '.remainder-game-container'
  ) as HTMLElement | null;
  const existingBoard = existingWrapper?.querySelector(
    'svg.remainder-board'
  ) as SVGElement | null;
  const wasGameOver = Boolean(
    existingWrapper?.querySelector('.remainder-game-over')
  );
  const canReuseBoard =
    Boolean(existingWrapper) &&
    Boolean(existingBoard) &&
    !wasGameOver &&
    gameState.phase !== 'gameOver';

  if (!canReuseBoard) {
    clearElement(gameContainer);

    const wrapper = document.createElement('div');
    wrapper.className = 'remainder-game-container';
    wrapper.appendChild(renderScores(gameState));

    if (gameState.phase === 'gameOver') {
      wrapper.appendChild(renderGameOver(gameState));
    } else {
      fillActiveChrome(wrapper, computerTurn, null);
      wrapper.appendChild(
        renderBoard(
          gameState,
          handleIslandClick,
          handleIslandHover,
          !computerTurn
        )
      );
    }

    gameContainer.appendChild(wrapper);
  } else if (existingWrapper && existingBoard) {
    const wrapper = existingWrapper;
    const board = existingBoard;

    wrapper
      .querySelector('.remainder-scores')
      ?.replaceWith(renderScores(gameState));
    fillActiveChrome(wrapper, computerTurn, board);
    syncBoard(
      board,
      gameState,
      handleIslandClick,
      handleIslandHover,
      !computerTurn
    );
  }

  // AI turn
  if (computerTurn && gameState.phase !== 'gameOver') {
    if (gameState.phase === 'rolling') {
      scheduleAI(aiRoll, 800);
    } else if (gameState.phase === 'selectIsland') {
      scheduleAI(aiSelectIsland, 800);
    }
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function noteEmptyValidSkip(
  beforePlayer: RemainderIslandsState['currentPlayer']
): void {
  if (
    gameState.phase === 'rolling' &&
    gameState.currentPlayer !== beforePlayer &&
    gameState.validIslands.length === 0
  ) {
    skipNotice = 'No open islands — turn skipped';
  } else {
    skipNotice = null;
  }
}

function handleRoll(): void {
  if (isComputerTurn()) return;
  if (isHumanRollSettling()) return;
  if (gameState.phase !== 'rolling') return;
  const beforePlayer = gameState.currentPlayer;
  gameState = performRoll(gameState);
  noteEmptyValidSkip(beforePlayer);
  // Seat may have flipped on empty-valid skip — drop click-through Roll.
  markHumanRollSettle();
  render();
}

function handleIslandClick(islandId: string): void {
  if (isComputerTurn()) return;
  if (gameState.phase !== 'selectIsland') return;
  if (!gameState.validIslands.includes(islandId)) return;

  skipNotice = null;
  gameState = selectIsland(gameState, islandId);
  render();
}

function handleIslandHover(islandId: string | null): void {
  if (isComputerTurn()) return;
  if (gameState.phase !== 'selectIsland') return;
  if (gameState.selectedIsland === islandId) return;

  // Update preview state without rebuilding the SVG. A full render() here
  // replaces the node under the pointer, so mouseup never becomes a click.
  gameState = setSelectedIsland(gameState, islandId);
  patchDivisionPreview();
}

// =============================================================================
// AI
// =============================================================================

function aiRoll(): void {
  if (gameState.phase !== 'rolling' || gameState.currentPlayer !== 'player2') {
    return;
  }
  const beforePlayer = gameState.currentPlayer;
  gameState = performRoll(gameState);
  noteEmptyValidSkip(beforePlayer);
  render();
}

function aiSelectIsland(): void {
  if (
    gameState.phase !== 'selectIsland' ||
    gameState.currentPlayer !== 'player2'
  ) {
    return;
  }

  // Use AI module to get choice
  const choice = getAIIslandChoice(gameState, 'player2', aiDifficulty);

  if (choice) {
    skipNotice = null;
    gameState = selectIsland(gameState, choice.islandId);
    render();
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  injectRemainderIslandsStyles();
  gameContainer = containerEl;
  aiGeneration += 1;
  clearHumanRollSettle();
  gameState = createInitialState();
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(): void {
  aiGeneration += 1;
  clearHumanRollSettle();
  gameState = createInitialState();
  isAIMode = false;
  skipNotice = null;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  clearHumanRollSettle();
  gameState = createInitialState();
  isAIMode = true;
  skipNotice = null;
  syncOpponentChrome();
  aiDifficulty = difficulty;
  render();
}

export function getCurrentState(): RemainderIslandsState {
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

  tutorialManager.start(remainderIslandsTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Cancel pending AI timeouts and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  clearHumanRollSettle();
  gameContainer = null;
}
