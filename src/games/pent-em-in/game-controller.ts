// Pent'Em In Game Controller
// Orchestrates game state, UI, and player interactions

import {
  PentEmInState,
  createInitialState,
  getPlayerPieces,
  getPentominoShape,
} from './types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
  setPreviewPosition,
  placePiece,
  canPlacePiece,
} from './rules';
import {
  renderBoard,
  renderPieceSelector,
  getPlayerName,
  injectPentEmInStyles,
} from './board-ui';
import { Cell } from '../../core/polyomino/types';
import { getAIMove, AIDifficulty } from './ai';

// =============================================================================
// Module State
// =============================================================================

let gameState: PentEmInState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!boardContainer || !statusContainer) return;

  // Clear containers
  boardContainer.innerHTML = '';
  statusContainer.innerHTML = '';

  // Render board
  const svg = renderBoard(gameState, handleCellClick, handleCellHover);
  boardContainer.appendChild(svg);

  // Render status and controls
  renderStatusAndControls();
}

function renderStatusAndControls(): void {
  if (!statusContainer) return;

  // Winner banner
  if (gameState.winner) {
    const banner = document.createElement('div');
    banner.className = 'pent-winner-banner';
    banner.textContent = `${getPlayerName(gameState.winner)} wins! 🎉`;
    statusContainer.appendChild(banner);
    return;
  }

  // Current player status
  const status = document.createElement('div');
  status.className = `pent-status ${gameState.currentPlayer}`;

  if (gameState.phase === 'selectPiece') {
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - Select a piece`;
  } else if (gameState.phase === 'placePiece') {
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn - Place the ${gameState.selectedPiece} piece`;
  }
  statusContainer.appendChild(status);

  // Piece selector (in select phase)
  if (gameState.phase === 'selectPiece') {
    const selector = renderPieceSelector(gameState, handlePieceSelect);
    statusContainer.appendChild(selector);
  }

  // Controls (in place phase)
  if (gameState.phase === 'placePiece' && gameState.selectedPiece) {
    const controls = document.createElement('div');
    controls.className = 'pent-controls';

    const shape = getPentominoShape(gameState.selectedPiece);

    // Rotate button
    if (shape?.canRotate) {
      const rotateBtn = document.createElement('button');
      rotateBtn.className = 'pent-btn pent-btn-rotate';
      rotateBtn.textContent = `Rotate (${gameState.selectedRotation}°)`;
      rotateBtn.addEventListener('click', handleRotate);
      controls.appendChild(rotateBtn);
    }

    // Flip button
    if (shape?.canFlip) {
      const flipBtn = document.createElement('button');
      flipBtn.className = 'pent-btn pent-btn-flip';
      flipBtn.textContent = gameState.selectedFlipped ? 'Flipped ↔' : 'Flip ↔';
      flipBtn.addEventListener('click', handleFlip);
      controls.appendChild(flipBtn);
    }

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'pent-btn pent-btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', handleCancel);
    controls.appendChild(cancelBtn);

    statusContainer.appendChild(controls);

    // Instructions
    const instructions = document.createElement('div');
    instructions.className = 'pent-instructions';
    instructions.textContent = 'Click on the board to place your piece. The preview shows where it will go.';
    statusContainer.appendChild(instructions);
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
  if (gameState.phase !== 'selectPiece') return;
  gameState = selectPiece(gameState, shapeId);
  render();
}

function handleRotate(): void {
  gameState = rotateSelectedPiece(gameState);
  render();
}

function handleFlip(): void {
  gameState = flipSelectedPiece(gameState);
  render();
}

function handleCancel(): void {
  gameState = cancelSelection(gameState);
  render();
}

function handleCellClick(cell: Cell): void {
  if (gameState.phase !== 'placePiece' || !gameState.selectedPiece) return;

  if (canPlacePiece(
    gameState,
    gameState.selectedPiece,
    cell,
    gameState.selectedRotation,
    gameState.selectedFlipped
  )) {
    gameState = placePiece(
      gameState,
      gameState.selectedPiece,
      cell,
      gameState.selectedRotation,
      gameState.selectedFlipped
    );
    render();

    // AI turn
    if (isAIMode && !gameState.winner && gameState.currentPlayer === 'player2') {
      setTimeout(aiTurn, 500);
    }
  }
}

function handleCellHover(cell: Cell | null): void {
  if (gameState.phase !== 'placePiece') return;
  gameState = setPreviewPosition(gameState, cell);
  render();
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  if (gameState.winner || gameState.currentPlayer !== 'player2') return;

  // Use AI module to get move
  const move = getAIMove(gameState, 'player2', aiDifficulty);

  if (move) {
    gameState = placePiece(gameState, move.shapeId, move.position, move.rotation, move.flipped);
    render();
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement
): void {
  injectPentEmInStyles();
  boardContainer = boardEl;
  statusContainer = statusEl;
  gameState = createInitialState();
  isAIMode = false;
  render();
}

export function newGameVsHuman(): void {
  gameState = createInitialState();
  isAIMode = false;
  render();
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  gameState = createInitialState();
  isAIMode = true;
  aiDifficulty = difficulty;
  render();
}

export function getCurrentState(): PentEmInState {
  return gameState;
}
