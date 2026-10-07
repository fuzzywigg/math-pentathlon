// Pent'Em In Game Controller
// Orchestrates game state, UI, and player interactions

import { PentEmInState, createInitialState, getPlayerPieces } from './types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
  setPreviewPosition,
  placePiece,
  canPlacePiece,
  selectedPieceFitsAnywhere,
  getCurrentOrientationPlacements,
} from './rules';
import {
  renderBoard,
  renderPieceSelector,
  renderPlaceControls,
  getPlayerName,
  injectPentEmInStyles,
} from './board-ui';
import { Cell } from '../../core/polyomino/types';
import { getAIMove, isAITurn, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { pentEmInTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadPentEmInBoard3DModule } from './board-3d-loader';
import type { PentEmInBoard3D } from '../../ui/three/pent-em-in-board-3d';

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

let gameState: PentEmInState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';
let aiTimer: ReturnType<typeof setTimeout> | null = null;

let board3d: PentEmInBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function unmountBoard3d(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
}

async function ensureBoard3d(): Promise<void> {
  if (!boardContainer || board3d || !board3dEnabled) return;
  try {
    const mod = await loadPentEmInBoard3DModule();
    if (!boardContainer || !board3dEnabled) return;
    board3d = await mod.createPentEmInBoard3D(
      boardContainer,
      handleCellClick,
      handleCellHover
    );
    boardContainer.addEventListener('mp3d-context-lost', onBoard3dContextLost);
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    board3d = null;
    board3dEnabled = false;
  }
}

function onBoard3dContextLost(): void {
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
  board3d = null;
  board3dEnabled = false;
  board3dLoading = null;
  render();
}

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!boardContainer || !statusContainer) return;

  const inputOpts = { allowInput: !isComputerTurnPending() };

  if (board3dEnabled && board3d) {
    board3d.update(gameState, handleCellClick, handleCellHover);
  } else if (!board3dEnabled) {
    boardContainer.innerHTML = '';
    const svg = renderBoard(
      gameState,
      handleCellClick,
      handleCellHover,
      inputOpts
    );
    boardContainer.appendChild(svg);
  }
  // If 3D is enabled but still loading, skip board paint until ready.

  renderStatusAndControls();
}

function renderBoardOnly(): void {
  if (!boardContainer) return;
  const inputOpts = { allowInput: !isComputerTurnPending() };
  if (board3dEnabled && board3d) {
    board3d.update(gameState, handleCellClick, handleCellHover);
  } else if (!board3dEnabled) {
    boardContainer.innerHTML = '';
    const svg = renderBoard(
      gameState,
      handleCellClick,
      handleCellHover,
      inputOpts
    );
    boardContainer.appendChild(svg);
  }
}

function renderStatusAndControls(): void {
  if (!statusContainer) return;
  statusContainer.innerHTML = '';
  markStatusLive(statusContainer);

  // Winner banner
  if (gameState.winner) {
    const banner = document.createElement('div');
    banner.className = 'pent-winner-banner';
    banner.textContent = `${getPlayerName(gameState.winner)} wins! 🎉`;
    statusContainer.appendChild(banner);
    return;
  }

  const computerTurn = isComputerTurnPending();

  // Current player status
  const status = document.createElement('div');
  status.className = `pent-status ${gameState.currentPlayer}`;

  if (computerTurn) {
    status.textContent = `${seatIcon(gameState.currentPlayer)} Computer is thinking…`;
  } else if (gameState.phase === 'selectPiece') {
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - Select a piece`;
  } else if (gameState.phase === 'placePiece') {
    const fitsAnywhere = selectedPieceFitsAnywhere(gameState);
    const currentFits = getCurrentOrientationPlacements(gameState).length > 0;
    if (!fitsAnywhere) {
      status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - ${gameState.selectedPiece} won't fit — choose another`;
    } else if (!currentFits) {
      status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - Rotate or flip ${gameState.selectedPiece} to fit`;
    } else {
      status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - Place the ${gameState.selectedPiece} piece`;
    }
  }
  statusContainer.appendChild(status);

  // Piece selector (in select phase) — disabled chrome during computer seat
  if (gameState.phase === 'selectPiece') {
    const selector = renderPieceSelector(gameState, handlePieceSelect, {
      allowInput: !computerTurn,
    });
    statusContainer.appendChild(selector);
  }

  // Controls (in place phase) — hide while computer thinks
  if (
    !computerTurn &&
    gameState.phase === 'placePiece' &&
    gameState.selectedPiece
  ) {
    statusContainer.appendChild(
      renderPlaceControls(
        gameState,
        {
          onRotate: handleRotate,
          onFlip: handleFlip,
          onCancel: handleCancel,
        },
        { allowInput: true }
      )
    );
  }

  // Pieces remaining count
  const pieces = getPlayerPieces(gameState, gameState.currentPlayer);
  const countInfo = document.createElement('div');
  countInfo.className = 'pent-instructions';
  countInfo.textContent = `Pieces remaining: ${pieces.available.length}`;
  statusContainer.appendChild(countInfo);
}

// =============================================================================
// Event Handlers
// =============================================================================

function handlePieceSelect(shapeId: string): void {
  if (isComputerTurnPending()) return;
  if (gameState.phase !== 'selectPiece') return;
  gameState = selectPiece(gameState, shapeId);
  render();
}

function handleRotate(): void {
  if (isComputerTurnPending()) return;
  gameState = rotateSelectedPiece(gameState);
  render();
}

function handleFlip(): void {
  if (isComputerTurnPending()) return;
  gameState = flipSelectedPiece(gameState);
  render();
}

function handleCancel(): void {
  if (isComputerTurnPending()) return;
  gameState = cancelSelection(gameState);
  render();
}

function handleCellClick(cell: Cell): void {
  if (isComputerTurnPending()) return;
  if (gameState.phase !== 'placePiece' || !gameState.selectedPiece) return;

  if (
    canPlacePiece(
      gameState,
      gameState.selectedPiece,
      cell,
      gameState.selectedRotation,
      gameState.selectedFlipped
    )
  ) {
    gameState = placePiece(
      gameState,
      gameState.selectedPiece,
      cell,
      gameState.selectedRotation,
      gameState.selectedFlipped
    );
    render();

    // AI turn
    if (
      isAIMode &&
      !gameState.winner &&
      gameState.currentPlayer === 'player2'
    ) {
      clearAiTimer();
      aiTimer = setTimeout(aiTurn, 500);
    }
  }
}

function handleCellHover(cell: Cell | null): void {
  if (isComputerTurnPending()) return;
  if (gameState.phase !== 'placePiece') return;
  // Leaving a cell: keep a legal ghost so tablets aren't left blank.
  const nextCell =
    cell ?? getCurrentOrientationPlacements(gameState)[0] ?? null;
  const prev = gameState.previewPosition;
  if (
    (prev === null && nextCell === null) ||
    (prev !== null &&
      nextCell !== null &&
      prev.row === nextCell.row &&
      prev.col === nextCell.col)
  ) {
    return;
  }
  gameState = setPreviewPosition(gameState, nextCell);
  // Preview-only: refresh board (3D paint-on-demand) without rebuilding controls.
  renderBoardOnly();
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  aiTimer = null;
  if (gameState.winner || gameState.currentPlayer !== 'player2') return;

  // Use AI module to get move
  const move = getAIMove(gameState, 'player2', aiDifficulty);

  if (move) {
    gameState = placePiece(
      gameState,
      move.shapeId,
      move.position,
      move.rotation,
      move.flipped
    );
    render();
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  injectPentEmInStyles();
  clearAiTimer();
  unmountBoard3d();
  boardContainer = boardEl;
  statusContainer = statusEl;
  gameState = createInitialState();
  isAIMode = false;
  syncOpponentChrome();
  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      render();
    });
  }
  render();
}

export function newGameVsHuman(): void {
  clearAiTimer();
  gameState = createInitialState();
  isAIMode = false;
  syncOpponentChrome();
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  clearAiTimer();
  gameState = createInitialState();
  isAIMode = true;
  syncOpponentChrome();
  aiDifficulty = difficulty;
  render();
}

export function getCurrentState(): PentEmInState {
  return gameState;
}

export function destroyGame(): void {
  clearAiTimer();
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
}

export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

/** Test helper: inject state and re-render (keeps 3D / 2D path). */
export function __setStateForTests(state: PentEmInState): void {
  gameState = state;
  render();
}

declare global {
  interface Window {
    __mpPentEmInController?: {
      setState: (state: PentEmInState) => void;
      getState: () => PentEmInState;
    };
  }
}

if (import.meta.env.DEV) {
  window.__mpPentEmInController = {
    setState: __setStateForTests,
    getState: getCurrentState,
  };
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

  tutorialManager.start(pentEmInTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
