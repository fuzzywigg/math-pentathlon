// Queens & Guards Game Controller
// Orchestrates game state, UI updates, and player interactions

import {
  QueensGuardsState,
  Player,
  BoardCoord,
  createInitialState,
  cellKey,
  parseKey,
  getOpponent,
} from './types';
import { getValidMoves, makeMove, selectPiece, hasValidMoves } from './rules';
import { renderBoard, injectQGStyles, getPlayerName } from './board-ui';
import { getAIMove, applyAIMove, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { queensGuardsTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { applyGameModeChrome } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadQueensGuardsBoard3DModule } from './board-3d-loader';
import type { QueensGuardsBoard3D } from '../../ui/three/queens-guards-board-3d';

declare global {
  interface Window {
    __mp3dQueensGuardsCtrl?: {
      forceWinner: (winner: Player | null) => void;
      getMoveCount: () => number;
      getPieceCount: () => number;
      getSelected: () => string | null;
    };
  }
}

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, vsAI ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Game Controller State
// =============================================================================

let gameState: QueensGuardsState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let vsAI = false;
let aiPlayer: Player = 'player2';
let aiDifficulty: AIDifficulty = 'medium';
let hasNotifiedGameEnd = false;
let moveCount = 0;

// Optional Three.js board (only when feature flag is on)
let board3d: QueensGuardsBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;

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
    const mod = await loadQueensGuardsBoard3DModule();
    if (!boardContainer || !board3dEnabled) return;
    board3d = await mod.createQueensGuardsBoard3D(
      boardContainer,
      handleCellClick
    );
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    board3d = null;
    board3dEnabled = false;
  }
}

// =============================================================================
// UI Rendering
// =============================================================================

function updateUI(): void {
  if (!boardContainer || !statusContainer) return;

  if (board3dEnabled && board3d) {
    board3d.update(gameState, handleCellClick);
  } else if (!board3dEnabled) {
    boardContainer.innerHTML = '';
    const svg = renderBoard(gameState, handleCellClick);
    boardContainer.appendChild(svg);
  }
  // If 3D is enabled but still loading, skip board paint until ready.

  updateStatus();
}

function updateStatus(): void {
  if (!statusContainer) return;
  markStatusLive(statusContainer);

  if (gameState.winner) {
    const winnerName = getPlayerName(gameState.winner);
    statusContainer.innerHTML = `
      <div class="qg-winner-banner">
        ${winnerName} wins! 👑
      </div>
    `;

    if (!hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      owlSystem.onGameEnd('queens-guards', {
        winner: gameState.winner,
        moveCount,
      });
    }

    return;
  }

  // Check for stalemate
  if (!hasValidMoves(gameState)) {
    const stalematedPlayer = getPlayerName(gameState.currentPlayer);
    const winner = getOpponent(gameState.currentPlayer);
    const winnerName = getPlayerName(winner);
    statusContainer.innerHTML = `
      <div class="qg-winner-banner">
        ${stalematedPlayer} cannot move - ${winnerName} wins!
      </div>
    `;

    if (!hasNotifiedGameEnd) {
      hasNotifiedGameEnd = true;
      owlSystem.onGameEnd('queens-guards', {
        winner: winner,
        moveCount,
      });
    }

    return;
  }

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass =
    gameState.currentPlayer === 'player1' ? 'player1' : 'player2';

  let instruction = 'Select a piece to move';
  if (gameState.selectedPiece) {
    instruction =
      'Click a highlighted cell to move, or select a different piece';
  }
  if (gameState.capturedPieces.length > 0) {
    instruction = 'Place captured pieces on the outer ring';
  }

  statusContainer.innerHTML = `
    <div class="qg-status ${playerClass}">
      ${playerName}'s turn - ${instruction}
    </div>
    <div class="qg-info">
      <span>Move ${Math.floor(gameState.moveHistory.length / 2) + 1}</span>
      ${vsAI ? `<span>Playing vs AI</span>` : ''}
    </div>
  `;
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleCellClick(coord: BoardCoord): void {
  if (gameState.winner) return;

  // If playing vs AI and it's AI's turn, ignore clicks
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  const key = cellKey(coord.ring, coord.position);
  const cell = gameState.cells.get(key);

  // If a piece is selected, try to move it
  if (gameState.selectedPiece) {
    const fromCoord = parseKey(gameState.selectedPiece);
    const validMoves = getValidMoves(gameState, fromCoord);
    const isValidMove = validMoves.some(
      (m) => m.ring === coord.ring && m.position === coord.position
    );

    if (isValidMove) {
      // Execute move
      gameState = makeMove(gameState, fromCoord, coord);
      moveCount++;
      updateUI();

      // Check for AI turn
      if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
        setTimeout(performAIMove, 500);
      }
      return;
    }
  }

  // Try to select a piece
  if (cell?.piece?.player === gameState.currentPlayer) {
    gameState = selectPiece(gameState, coord);
    updateUI();
    return;
  }

  // Deselect if clicking elsewhere
  if (gameState.selectedPiece) {
    gameState = { ...gameState, selectedPiece: null };
    updateUI();
  }
}

// =============================================================================
// AI Logic
// =============================================================================

function performAIMove(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  const aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);
  if (aiMove) {
    gameState = applyAIMove(gameState, aiMove);
    moveCount++;
    updateUI();
  }
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  unmountBoard3d();

  boardContainer = boardEl;
  statusContainer = statusEl;

  injectQGStyles();
  gameState = createInitialState();
  vsAI = false;
  syncOpponentChrome();

  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      updateUI();
    });
  }

  if (import.meta.env.DEV) {
    window.__mp3dQueensGuardsCtrl = {
      forceWinner: (winner: Player | null) => {
        gameState = { ...gameState, winner };
        updateUI();
      },
      getMoveCount: () => gameState.moveHistory.length,
      getPieceCount: () => {
        let n = 0;
        for (const cell of gameState.cells.values()) {
          if (cell.piece) n++;
        }
        return n;
      },
      getSelected: () => gameState.selectedPiece,
    };
  }

  updateUI();
}

/** Dispose 3D resources and clear mounts (route change). */
export function destroyGame(): void {
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
  if (import.meta.env.DEV && window.__mp3dQueensGuardsCtrl) {
    delete window.__mp3dQueensGuardsCtrl;
  }
}

/** Whether the live controller is using the 3D board path. */
export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

/** Await pending 3D mount (tests / callers that need the canvas ready). */
export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

export function getGameState(): QueensGuardsState {
  return gameState;
}

export function newGameVsHuman(): void {
  vsAI = false;
  syncOpponentChrome();
  hasNotifiedGameEnd = false;
  moveCount = 0;
  gameState = createInitialState();
  updateUI();
  owlSystem.onGameStart('queens-guards');
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  vsAI = true;
  syncOpponentChrome();
  aiPlayer = 'player2';
  aiDifficulty = difficulty;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  gameState = createInitialState();
  updateUI();
  owlSystem.onGameStart('queens-guards');
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

  tutorialManager.start(queensGuardsTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
