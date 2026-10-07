// Remainder Islands Game Controller
// Orchestrates game state, UI, and player interactions

import { RemainderIslandsState, createInitialState } from './types';
import { performRoll, selectIsland, setSelectedIsland } from './rules';
import {
  renderBoard,
  renderDice,
  renderScores,
  renderDivisionPreview,
  renderGameOver,
  getPlayerName,
  injectRemainderIslandsStyles,
} from './board-ui';
import { getAIIslandChoice, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { remainderIslandsTutorial } from './tutorial';
import { applyGameModeChrome } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAIMode ? 'human-vs-ai' : 'human-vs-human');
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
/** Pending AI think timers — cleared on remount / new game to avoid ghost moves. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
/** Bumps on every new game so stale AI callbacks cannot mutate a fresh match. */
let aiGeneration = 0;

/** Keep AI pacing snappy for full matches without feeling instant. */
const AI_ROLL_DELAY_MS = 450;
const AI_SELECT_DELAY_MS = 550;

function clearAITimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function scheduleAI(delayMs: number, action: () => void): void {
  clearAITimer();
  const gen = aiGeneration;
  aiTimer = setTimeout(() => {
    aiTimer = null;
    if (gen !== aiGeneration) return;
    action();
  }, delayMs);
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
  if (!existing) return;
  existing.replaceWith(renderDivisionPreview(gameState));
}

function render(): void {
  if (!gameContainer) return;

  gameContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'remainder-game-container';
  const computerTurn = isComputerTurn();

  // Scores
  wrapper.appendChild(renderScores(gameState));

  // Game over or active game
  if (gameState.phase === 'gameOver') {
    wrapper.appendChild(renderGameOver(gameState));
  } else {
    // Current player status
    const status = document.createElement('div');
    status.className = `remainder-status ${gameState.currentPlayer}`;
    if (skipNotice) {
      status.textContent = skipNotice;
    } else if (computerTurn) {
      status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn (computer)`;
    } else {
      status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn`;
    }
    markStatusLive(status);
    wrapper.appendChild(status);

    // Dice
    wrapper.appendChild(renderDice(gameState.currentRoll));

    // Roll button or selection instruction
    const controls = document.createElement('div');
    controls.className = 'remainder-controls';

    if (gameState.phase === 'rolling') {
      if (computerTurn) {
        const wait = document.createElement('div');
        wait.className = 'remainder-instruction';
        wait.textContent = 'Computer is thinking…';
        controls.appendChild(wait);
      } else {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'remainder-btn remainder-btn-roll';
        rollBtn.textContent = '🎲 Roll Dice';
        rollBtn.addEventListener('click', handleRoll);
        controls.appendChild(rollBtn);
      }
    } else if (gameState.phase === 'selectIsland') {
      const instruction = document.createElement('div');
      instruction.className = 'remainder-instruction';
      instruction.textContent = computerTurn
        ? 'Computer is choosing an island'
        : 'Tap a highlighted island — remainder = your points';
      controls.appendChild(instruction);

      // Division preview
      wrapper.appendChild(renderDivisionPreview(gameState));
    }

    wrapper.appendChild(controls);

    // Board
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

  // AI turn (single pending timer; generation-guarded against New Game races)
  if (computerTurn && gameState.phase !== 'gameOver') {
    if (gameState.phase === 'rolling') {
      scheduleAI(AI_ROLL_DELAY_MS, aiRoll);
    } else if (gameState.phase === 'selectIsland') {
      scheduleAI(AI_SELECT_DELAY_MS, aiSelectIsland);
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
  if (gameState.phase !== 'rolling') return;
  const beforePlayer = gameState.currentPlayer;
  gameState = performRoll(gameState);
  noteEmptyValidSkip(beforePlayer);
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
  if (gameState.phase !== 'rolling' || gameState.currentPlayer !== 'player2')
    return;
  const beforePlayer = gameState.currentPlayer;
  gameState = performRoll(gameState);
  noteEmptyValidSkip(beforePlayer);
  render();
}

function aiSelectIsland(): void {
  if (
    gameState.phase !== 'selectIsland' ||
    gameState.currentPlayer !== 'player2'
  )
    return;

  // Prefer scored AI choice; fall back to the first island that still exists on the board.
  const choice = getAIIslandChoice(gameState, 'player2', aiDifficulty);
  const islandId =
    choice?.islandId ??
    gameState.validIslands.find((id) =>
      gameState.islands.some((island) => island.id === id)
    );
  if (!islandId) return;

  const before = gameState;
  skipNotice = null;
  gameState = selectIsland(gameState, islandId);
  // Guard against a no-op select (ghost ids) re-scheduling forever.
  if (gameState === before || gameState.phase === before.phase) {
    gameState = before;
    return;
  }
  render();
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  clearAITimer();
  aiGeneration += 1;
  injectRemainderIslandsStyles();
  gameContainer = containerEl;
  gameState = createInitialState();
  isAIMode = false;
  skipNotice = null;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(): void {
  clearAITimer();
  aiGeneration += 1;
  gameState = createInitialState();
  isAIMode = false;
  skipNotice = null;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  clearAITimer();
  aiGeneration += 1;
  gameState = createInitialState();
  isAIMode = true;
  skipNotice = null;
  syncOpponentChrome();
  aiDifficulty = difficulty;
  render();
}

/** Test/helper: AI think delays used by the controller orchestration. */
export function getAIThinkDelays(): { rollMs: number; selectMs: number } {
  return { rollMs: AI_ROLL_DELAY_MS, selectMs: AI_SELECT_DELAY_MS };
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
