// FIAR Game Controller
// Main game logic and UI orchestration

import {
  FiarGameState,
  createInitialState,
  CONFIG,
} from './types';
import {
  canPlaceChip,
  placeChip,
  selectChip,
  moveChip,
  getValidMoves,
  getSelectableNodes,
  isDraw,
} from './rules';
import { renderBoard, injectFiarStyles, getPlayerName } from './board-ui';

// =============================================================================
// Module State
// =============================================================================

let gameState: FiarGameState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIMode = false;

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!boardContainer || !statusContainer) return;

  // Render board
  boardContainer.innerHTML = '';
  const svg = renderBoard(gameState, handleNodeClick);
  boardContainer.appendChild(svg);

  // Render status
  renderStatus();
}

function renderStatus(): void {
  if (!statusContainer) return;

  const { phase, currentPlayer, winner, chipsPlaced, selectedNode } = gameState;

  if (winner) {
    statusContainer.innerHTML = `
      <div class="fiar-winner-banner">
        ${getPlayerName(winner)} wins! 🎉
      </div>
    `;
    return;
  }

  if (isDraw(gameState)) {
    statusContainer.innerHTML = `
      <div class="fiar-status">
        Draw! No valid moves available.
      </div>
    `;
    return;
  }

  let statusText = '';
  const playerClass = currentPlayer;

  if (phase === 'placement') {
    const remaining = CONFIG.CHIPS_PER_PLAYER - chipsPlaced[currentPlayer];
    statusText = `${getPlayerName(currentPlayer)}'s turn: Place a chip (${remaining} left)`;
  } else if (phase === 'movement') {
    if (selectedNode) {
      statusText = `${getPlayerName(currentPlayer)}'s turn: Click a green node to move, or click chip again to deselect`;
    } else {
      statusText = `${getPlayerName(currentPlayer)}'s turn: Select a chip to move`;
    }
  }

  statusContainer.innerHTML = `
    <div class="fiar-status ${playerClass}">
      ${statusText}
    </div>
    <div class="fiar-chips-info">
      <div class="fiar-chip-count">
        <span class="fiar-chip-icon player1"></span>
        Blue: ${chipsPlaced.player1}/${CONFIG.CHIPS_PER_PLAYER}
      </div>
      <div class="fiar-chip-count">
        <span class="fiar-chip-icon player2"></span>
        Red: ${chipsPlaced.player2}/${CONFIG.CHIPS_PER_PLAYER}
      </div>
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleNodeClick(nodeId: string): void {
  if (gameState.winner) return;

  const { phase, selectedNode } = gameState;

  if (phase === 'placement') {
    // Placement phase: place chip on clicked node
    if (canPlaceChip(gameState, nodeId)) {
      gameState = placeChip(gameState, nodeId);
      render();

      // Check if AI should play
      if (isAIMode && gameState.currentPlayer === 'player2' && !gameState.winner) {
        setTimeout(aiTurn, 500);
      }
    }
  } else if (phase === 'movement') {
    const node = gameState.board.nodes.get(nodeId);

    if (selectedNode) {
      // A chip is selected
      const validMoves = getValidMoves(gameState, selectedNode);

      if (validMoves.includes(nodeId)) {
        // Move to valid destination
        gameState = moveChip(gameState, selectedNode, nodeId);
        render();

        // Check if AI should play
        if (isAIMode && gameState.currentPlayer === 'player2' && !gameState.winner) {
          setTimeout(aiTurn, 500);
        }
      } else if (node?.chip === gameState.currentPlayer) {
        // Click on another own chip - select it instead
        gameState = selectChip(gameState, nodeId);
        render();
      } else if (nodeId === selectedNode) {
        // Click on same chip - deselect
        gameState = selectChip(gameState, nodeId);
        render();
      }
    } else {
      // No chip selected - try to select this one
      if (node?.chip === gameState.currentPlayer) {
        const validMoves = getValidMoves(gameState, nodeId);
        if (validMoves.length > 0) {
          gameState = selectChip(gameState, nodeId);
          render();
        }
      }
    }
  }
}

// =============================================================================
// AI
// =============================================================================

function aiTurn(): void {
  if (gameState.winner || gameState.currentPlayer !== 'player2') return;

  const { phase } = gameState;

  if (phase === 'placement') {
    // Simple AI: place on random empty node
    const emptyNodes: string[] = [];
    for (const [nodeId, node] of gameState.board.nodes) {
      if (node.chip === null) {
        emptyNodes.push(nodeId);
      }
    }

    if (emptyNodes.length > 0) {
      const randomNode = emptyNodes[Math.floor(Math.random() * emptyNodes.length)];
      gameState = placeChip(gameState, randomNode);
      render();

      // Continue if still AI's turn (shouldn't happen in placement)
      if (gameState.currentPlayer === 'player2' && !gameState.winner) {
        setTimeout(aiTurn, 500);
      }
    }
  } else if (phase === 'movement') {
    // Simple AI: pick random move
    const selectableNodes = getSelectableNodes(gameState);

    if (selectableNodes.length > 0) {
      const randomChip = selectableNodes[Math.floor(Math.random() * selectableNodes.length)];
      const validMoves = getValidMoves(gameState, randomChip);

      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        gameState = moveChip(gameState, randomChip, randomMove);
        render();
      }
    }
  }
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement
): void {
  injectFiarStyles();
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

export function newGameVsAI(): void {
  gameState = createInitialState();
  isAIMode = true;
  render();
}

export function getCurrentState(): FiarGameState {
  return gameState;
}
