// Juggle Game Controller
// Orchestrates game state, UI updates, and player interactions

import { JuggleState, Player, getCategoryFromDie, getShapesForDie } from './types';
import { PolyominoShape, Rotation } from '../../core/polyomino/types';
import { findValidPlacements } from '../../core/polyomino/placement';
import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  placeShape,
} from './rules';
import {
  renderBoard,
  renderDice,
  renderShapeSelector,
  renderShapeControls,
  injectJuggleStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: JuggleState;
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

  // Render dice area
  const diceArea = renderDice(
    gameState.currentDice,
    handleRollDice,
    handleSelectDie,
    gameState.phase === 'rolling' && (!vsAI || gameState.currentPlayer !== aiPlayer),
    gameState.phase
  );
  boardContainer.appendChild(diceArea);

  // Render shape selector or controls
  if (gameState.phase === 'selectingShape' && gameState.selectedCategory) {
    const shapeSelector = renderShapeSelector(gameState, handleSelectShape);
    boardContainer.appendChild(shapeSelector);
  } else if (gameState.phase === 'placing') {
    const shapeControls = renderShapeControls(gameState, handleRotate, handleFlip);
    boardContainer.appendChild(shapeControls);
  }

  // Render boards side by side
  const boardsContainer = document.createElement('div');
  boardsContainer.className = 'juggle-boards';

  const p1Board = renderBoard(
    gameState.boards.player1,
    'player1',
    gameState.currentPlayer === 'player1',
    gameState,
    (row, col) => handleCellClick(row, col, 'player1'),
    (row, col) => handleCellHover(row, col),
    handleCellLeave
  );
  boardsContainer.appendChild(p1Board);

  const p2Board = renderBoard(
    gameState.boards.player2,
    'player2',
    gameState.currentPlayer === 'player2',
    gameState,
    (row, col) => handleCellClick(row, col, 'player2'),
    (row, col) => handleCellHover(row, col),
    handleCellLeave
  );
  boardsContainer.appendChild(p2Board);

  boardContainer.appendChild(boardsContainer);

  // Update status
  updateStatus();
}

function updateStatus(): void {
  if (!statusContainer) return;

  if (gameState.winner) {
    const winnerName = getPlayerName(gameState.winner);
    statusContainer.innerHTML = `
      <div class="juggle-winner-banner">
        ${winnerName} filled their board first and wins!
      </div>
    `;
    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass = gameState.currentPlayer;

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
      <strong>${playerName}'s turn</strong> - ${instruction}
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

  // AI takes turn after dice are shown
  if (vsAI && gameState.currentPlayer === aiPlayer) {
    setTimeout(makeAIMove, 500);
  }
}

function handleSelectDie(index: 0 | 1): void {
  if (gameState.phase !== 'selectingShape') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = selectDie(gameState, index);
  updateUI();
}

function handleSelectShape(shape: PolyominoShape): void {
  if (gameState.phase !== 'selectingShape') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = selectShape(gameState, shape);
  updateUI();
}

function handleRotate(): void {
  gameState = rotateShape(gameState);
  updateUI();
}

function handleFlip(): void {
  gameState = flipShape(gameState);
  updateUI();
}

function handleCellClick(row: number, col: number, player: Player): void {
  if (player !== gameState.currentPlayer) return;
  if (gameState.phase !== 'placing') return;
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  gameState = placeShape(gameState, { row, col });
  updateUI();

  // AI turn
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(handleRollDice, 500);
  }
}

function handleCellHover(row: number, col: number): void {
  if (gameState.phase !== 'placing') return;

  gameState = { ...gameState, hoverPosition: { row, col } };
  updateUI();
}

function handleCellLeave(): void {
  gameState = { ...gameState, hoverPosition: null };
  updateUI();
}

// =============================================================================
// AI Logic
// =============================================================================

function makeAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  // Handle each phase
  if (gameState.phase === 'selectingShape' && !gameState.selectedCategory) {
    // Choose die with larger shape (more cells = faster fill)
    const index = gameState.currentDice![0] >= gameState.currentDice![1] ? 0 : 1;
    gameState = selectDie(gameState, index as 0 | 1);
    setTimeout(makeAIMove, 300);
    updateUI();
    return;
  }

  if (gameState.phase === 'selectingShape' && gameState.selectedCategory) {
    // Choose first available shape
    const dieValue = gameState.currentDice!.find(d =>
      getCategoryFromDie(d) === gameState.selectedCategory
    );
    if (dieValue) {
      const shapes = getShapesForDie(dieValue);
      if (shapes.length > 0) {
        // Pick random shape
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        gameState = selectShape(gameState, shape);
        setTimeout(makeAIMove, 300);
        updateUI();
        return;
      }
    }
    return;
  }

  if (gameState.phase === 'placing' && gameState.selectedShape) {
    // Find valid placement
    const board = gameState.boards[aiPlayer];
    const rotations: Rotation[] = [0, 90, 180, 270];
    const flips = [false, true];

    for (const rotation of rotations) {
      for (const flipped of flips) {
        if (flipped && !gameState.selectedShape.canFlip) continue;
        if (rotation !== 0 && !gameState.selectedShape.canRotate) continue;

        const positions = findValidPlacements(board, gameState.selectedShape, rotation, flipped);
        if (positions.length > 0) {
          // Set rotation/flip
          let tempState = gameState;
          while (tempState.selectedRotation !== rotation) {
            tempState = rotateShape(tempState);
          }
          if (flipped !== tempState.selectedFlipped) {
            tempState = flipShape(tempState);
          }
          gameState = tempState;

          // Pick random valid position
          const pos = positions[Math.floor(Math.random() * positions.length)];
          gameState = placeShape(gameState, pos);
          updateUI();

          // Continue if still AI's turn
          if (!gameState.winner && gameState.currentPlayer === aiPlayer) {
            setTimeout(handleRollDice, 500);
          }
          return;
        }
      }
    }
  }

  updateUI();
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

  injectJuggleStyles();
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
