// Juggle Game Controller
// Orchestrates game state, UI updates, and player interactions

import type { JuggleState, Player } from './types';
import type { PolyominoShape, Rotation } from '../../core/polyomino/types';
import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  placeShape,
  abandonPlacement,
  getCurrentOrientationPlacements,
  selectedShapeFitsAnywhere,
} from './rules';
import type { AIDifficulty } from './ai';
import { getAIDieChoice, getAIShapeChoice, getAIPlacement } from './ai';
import {
  renderBoard,
  syncJuggleBoardCells,
  applyJuggleHoverPreview,
  renderDice,
  renderShapeSelector,
  renderShapeControls,
  injectJuggleStyles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { clearElement } from '../../core/dom-security';
import { juggleTutorial } from './tutorial';
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

let gameState: JuggleState;
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

function isComputerTurnPending(): boolean {
  return (
    vsAI &&
    gameState.currentPlayer === aiPlayer &&
    !gameState.winner &&
    gameState.phase !== 'gameOver'
  );
}

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) {
    return;
  }

  const previousFocus = captureFocusedCell(boardContainer);
  const allowInput = !isComputerTurnPending();
  const inputOpts = { allowInput };

  // Keep persistent board grids; only rebuild chrome that changes by phase.
  let boardsContainer = boardContainer.querySelector(
    '.juggle-boards'
  ) as HTMLElement | null;
  const chromeNodes = Array.from(boardContainer.children).filter(
    (el) => !el.classList.contains('juggle-boards')
  );
  for (const node of chromeNodes) {
    node.remove();
  }

  // Render dice area — hide Roll / selectable dice while the computer seat thinks
  const diceArea = renderDice(
    gameState.currentDice,
    handleRollDice,
    handleSelectDie,
    allowInput && gameState.phase === 'rolling',
    gameState.phase,
    inputOpts
  );
  boardContainer.insertBefore(diceArea, boardsContainer);

  // Render shape selector or controls
  let phaseChrome: HTMLElement | null = null;
  if (gameState.phase === 'selectingShape' && gameState.selectedCategory) {
    phaseChrome = renderShapeSelector(gameState, handleSelectShape, inputOpts);
  } else if (gameState.phase === 'placing') {
    phaseChrome = renderShapeControls(
      gameState,
      handleRotate,
      handleFlip,
      inputOpts
    );
  }
  if (phaseChrome) {
    boardContainer.insertBefore(phaseChrome, boardsContainer);
  }

  if (!boardsContainer) {
    boardsContainer = document.createElement('div');
    boardsContainer.className = 'juggle-boards';

    const p1Board = renderBoard(
      gameState.boards.player1,
      'player1',
      gameState.currentPlayer === 'player1',
      gameState,
      (row, col) => handleCellClick(row, col, 'player1'),
      (row, col) => handleCellHover(row, col),
      handleCellLeave,
      inputOpts
    );
    boardsContainer.appendChild(p1Board);

    const p2Board = renderBoard(
      gameState.boards.player2,
      'player2',
      gameState.currentPlayer === 'player2',
      gameState,
      (row, col) => handleCellClick(row, col, 'player2'),
      (row, col) => handleCellHover(row, col),
      handleCellLeave,
      inputOpts
    );
    boardsContainer.appendChild(p2Board);
    boardContainer.appendChild(boardsContainer);
  } else {
    const p1Board = boardsContainer.querySelector(
      '.juggle-board.player1'
    ) as HTMLElement | null;
    const p2Board = boardsContainer.querySelector(
      '.juggle-board.player2'
    ) as HTMLElement | null;
    if (p1Board) {
      syncJuggleBoardCells(
        p1Board,
        gameState.boards.player1,
        'player1',
        gameState.currentPlayer === 'player1',
        gameState,
        inputOpts
      );
    }
    if (p2Board) {
      syncJuggleBoardCells(
        p2Board,
        gameState.boards.player2,
        'player2',
        gameState.currentPlayer === 'player2',
        gameState,
        inputOpts
      );
    }
  }

  // Update status
  updateStatus();
  restoreGridFocus(boardContainer, previousFocus);
}

function updateStatus(): void {
  if (!statusContainer) {
    return;
  }
  markStatusLive(statusContainer);

  if (gameState.winner) {
    const winnerName = getPlayerName(gameState.winner);
    statusContainer.innerHTML = `
      <div class="juggle-winner-banner">
        ${seatIcon(gameState.winner)} ${winnerName} filled their board first and wins!
      </div>
    `;
    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass = gameState.currentPlayer;
  const icon = seatIcon(gameState.currentPlayer);

  if (isComputerTurnPending()) {
    statusContainer.innerHTML = `
      <div class="juggle-status ${playerClass} status-ai-thinking">
        <strong>${icon} ${playerName}'s turn</strong> - Computer is thinking…
      </div>
    `;
    return;
  }

  let instruction = '';
  switch (gameState.phase) {
    case 'rolling':
      instruction = 'Roll the dice';
      break;
    case 'selectingShape':
      if (gameState.selectedCategory) {
        instruction = 'Choose a shape';
      } else {
        instruction = 'Click a die to choose shape category';
      }
      break;
    case 'placing':
      instruction = 'Place the shape on your board';
      break;
  }

  statusContainer.innerHTML = `
    <div class="juggle-status ${playerClass}">
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
  if (fromAI !== true && isComputerTurnPending()) {
    return;
  }

  gameState = doRollDice(gameState);
  updateUI();

  // AI continues after its own roll.
  if (vsAI && gameState.currentPlayer === aiPlayer) {
    scheduleAI(makeAIMove, 500);
  }
}

function handleSelectDie(index: 0 | 1): void {
  if (gameState.phase !== 'selectingShape') {
    return;
  }
  if (isComputerTurnPending()) {
    return;
  }

  gameState = selectDie(gameState, index);
  updateUI();
}

function handleSelectShape(shape: PolyominoShape): void {
  if (gameState.phase !== 'selectingShape') {
    return;
  }
  if (isComputerTurnPending()) {
    return;
  }

  gameState = selectShape(gameState, shape);
  updateUI();
}

function handleRotate(): void {
  if (isComputerTurnPending()) {
    return;
  }
  gameState = rotateShape(gameState);
  updateUI();
}

function handleFlip(): void {
  if (isComputerTurnPending()) {
    return;
  }
  gameState = flipShape(gameState);
  updateUI();
}

function handleCellClick(row: number, col: number, player: Player): void {
  if (player !== gameState.currentPlayer) {
    return;
  }
  if (gameState.phase !== 'placing') {
    return;
  }
  if (isComputerTurnPending()) {
    return;
  }

  gameState = placeShape(gameState, { row, col });
  updateUI();

  // AI turn — must pass fromAI so the roll guard does not no-op.
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    scheduleAI(() => handleRollDice(true), 500);
  }
}

function handleCellHover(row: number, col: number): void {
  if (isComputerTurnPending()) {
    return;
  }
  if (gameState.phase !== 'placing') {
    return;
  }

  gameState = { ...gameState, hoverPosition: { row, col } };
  if (!boardContainer) {
    return;
  }
  const boards = boardContainer.querySelector('.juggle-boards');
  if (boards) {
    applyJuggleHoverPreview(boards as HTMLElement, gameState, {
      allowInput: true,
    });
  } else {
    updateUI();
  }
}

function handleCellLeave(): void {
  if (isComputerTurnPending()) {
    return;
  }
  gameState = { ...gameState, hoverPosition: null };
  if (!boardContainer) {
    return;
  }
  const boards = boardContainer.querySelector('.juggle-boards');
  if (boards) {
    applyJuggleHoverPreview(boards as HTMLElement, gameState, {
      allowInput: true,
    });
  } else {
    updateUI();
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) {
    return;
  }

  // Handle each phase using the AI module
  if (gameState.phase === 'selectingShape' && !gameState.selectedCategory) {
    const dieChoice = getAIDieChoice(gameState, aiPlayer, aiDifficulty);
    if (dieChoice) {
      gameState = selectDie(gameState, dieChoice.index);
      scheduleAI(makeAIMove, 300);
      updateUI();
      return;
    }
    return;
  }

  if (gameState.phase === 'selectingShape' && gameState.selectedCategory) {
    const shapeChoice = getAIShapeChoice(gameState, aiPlayer, aiDifficulty);
    if (shapeChoice) {
      gameState = selectShape(gameState, shapeChoice.shape);
      scheduleAI(makeAIMove, 300);
      updateUI();
      return;
    }
    return;
  }

  if (gameState.phase === 'placing' && gameState.selectedShape) {
    const placement = getAIPlacement(gameState, aiPlayer, aiDifficulty);
    if (placement) {
      // Apply rotation
      while (gameState.selectedRotation !== placement.rotation) {
        gameState = rotateShape(gameState);
      }
      // Apply flip
      if (placement.flipped !== gameState.selectedFlipped) {
        gameState = flipShape(gameState);
      }
      // Place shape
      gameState = placeShape(gameState, placement.position);
      updateUI();

      // Continue if still AI's turn
      if (!gameState.winner && gameState.currentPlayer === aiPlayer) {
        scheduleAI(() => handleRollDice(true), 500);
      }
      return;
    }
  }

  updateUI();
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  injectJuggleStyles();
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

  tutorialManager.start(juggleTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Test-only: replace state and re-render (AI-seat chrome guards). */
export function __setStateForTests(state: JuggleState): void {
  gameState = state;
  updateUI();
}

/** Test-only: read current controller state. */
export function __getStateForTests(): JuggleState {
  return gameState;
}

/** Tip-held destroy hook — cancel AI timers and drop mount DOM/listeners. */
/**
 * Test-only: back out of placing to shape/die select (rules `abandonPlacement`).
 * Live UI has no abandon control; e2e/fullgame uses this DEV hook instead.
 */
export function __abandonPlacementForTests(): void {
  gameState = abandonPlacement(gameState);
  updateUI();
}

/**
 * Test-only: place the selected shape on a legal anchor (any orientation).
 * Returns false when the shape cannot fit — caller should abandon / reshuffle.
 */
export function __placeSelectedForTests(): boolean {
  const shape = gameState.selectedShape;
  if (gameState.phase !== 'placing' || !shape) {
    return false;
  }
  if (!selectedShapeFitsAnywhere(gameState)) {
    return false;
  }

  const rotations: Rotation[] = [0, 90, 180, 270];
  const flips = shape.canFlip ? [false, true] : [false];
  for (const flipped of flips) {
    for (const rotation of rotations) {
      if (!shape.canRotate && rotation !== 0) {
        continue;
      }
      gameState = {
        ...gameState,
        selectedRotation: rotation,
        selectedFlipped: flipped,
      };
      const spots = getCurrentOrientationPlacements(gameState);
      if (spots.length) {
        // Prefer top-left for denser packing under e2e softlock pressure.
        spots.sort((a, b) => a.row - b.row || a.col - b.col);
        const spot = spots[0];
        if (!spot) {
          continue;
        }
        gameState = placeShape(gameState, spot);
        updateUI();
        return true;
      }
    }
  }
  return false;
}

declare global {
  interface Window {
    __mpJuggleController?: {
      setState: (state: JuggleState) => void;
      getState: () => JuggleState;
      abandonPlacement: () => void;
      placeSelected: () => boolean;
    };
  }
}

if (import.meta.env.DEV) {
  window.__mpJuggleController = {
    setState: __setStateForTests,
    getState: __getStateForTests,
    abandonPlacement: __abandonPlacementForTests,
    placeSelected: __placeSelectedForTests,
  };
}

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
