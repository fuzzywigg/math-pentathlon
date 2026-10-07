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
import {
  getValidMoves,
  makeMove,
  selectPiece,
  hasValidMoves,
  restoreCapturedPiece,
  getRestoreTargets,
  checkWinner,
} from './rules';
import { renderBoard, injectQGStyles, getPlayerName } from './board-ui';
import { applyAIMove, getAIMove, AIDifficulty } from './ai';
import {
  cancelQueensAiRequests,
  disposeQueensAiWorker,
  getAIMoveAsync,
} from './ai-client';
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
      getCapturedCount: () => number;
      seedCapturedRestore: (opts?: {
        currentPlayer?: Player;
        keepVsAI?: boolean;
      }) => void;
      seedWinnerFormation: () => void;
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
let isAIThinking = false;
/** Invalidates in-flight worker replies after new game / leave. */
let aiGeneration = 0;
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
  updateUI();
}

// =============================================================================
// UI Rendering
// =============================================================================

function humanCanAct(): boolean {
  return !isAIThinking && !(vsAI && gameState.currentPlayer === aiPlayer);
}

/** Persist stalemate into state.winner (display already treated it as a win). */
function settleStalemateIfNeeded(): void {
  if (gameState.winner) return;
  if (gameState.capturedPieces.length > 0) return;
  if (hasValidMoves(gameState)) return;
  gameState = {
    ...gameState,
    winner: getOpponent(gameState.currentPlayer),
    selectedPiece: null,
  };
}

function updateUI(): void {
  if (!boardContainer || !statusContainer) return;

  settleStalemateIfNeeded();

  const onCell = humanCanAct() ? handleCellClick : undefined;

  if (board3dEnabled && board3d) {
    board3d.update(gameState, onCell);
  } else if (!board3dEnabled) {
    boardContainer.innerHTML = '';
    const svg = renderBoard(gameState, onCell);
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
    // Formation win vs stalemate (no queen+guards ring) — keep prior copy.
    const isFormationWin = checkWinner(gameState) === gameState.winner;
    statusContainer.innerHTML = isFormationWin
      ? `
      <div class="qg-winner-banner">
        ${winnerName} wins! 👑
      </div>
    `
      : `
      <div class="qg-winner-banner">
        ${getPlayerName(gameState.currentPlayer)} cannot move - ${winnerName} wins!
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

  const playerName = getPlayerName(gameState.currentPlayer);
  const playerClass =
    gameState.currentPlayer === 'player1' ? 'player1' : 'player2';

  // Computer seat: never invite a human tap ("Select a piece…") even during the
  // short paint delay before isAIThinking flips true.
  const computerSeat =
    vsAI && gameState.currentPlayer === aiPlayer && !gameState.winner;
  const showAiChrome = computerSeat || isAIThinking;

  let instruction = 'Select a piece to move';
  if (gameState.selectedPiece) {
    instruction =
      'Tap a highlighted cell to move, or select a different piece';
  }
  if (gameState.capturedPieces.length > 0) {
    instruction =
      'Tap a captured piece (red outline), then an empty outer-ring space';
  }
  if (showAiChrome) {
    instruction = 'Computer is thinking…';
  }

  statusContainer.innerHTML = `
    <div class="qg-status ${playerClass}${showAiChrome ? ' status-ai-thinking' : ''}">
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

/** Paint delay before AI search — keep short so tablet Hard stays under ~3s. */
const AI_THINK_PAINT_MS = 250;
/** Brief pause between capture-restore AI plies. */
const AI_RESTORE_CHAIN_MS = 280;

function maybeTriggerAI(): void {
  if (vsAI && !gameState.winner && gameState.currentPlayer === aiPlayer) {
    // Slight delay so the thinking status can paint before search starts.
    setTimeout(() => {
      void performAIMove();
    }, AI_THINK_PAINT_MS);
  }
}

function isCapturedCoord(coord: BoardCoord): boolean {
  return gameState.capturedPieces.some(
    (c) => c.ring === coord.ring && c.position === coord.position
  );
}

function handleRestoreClick(coord: BoardCoord): void {
  if (isCapturedCoord(coord)) {
    gameState = {
      ...gameState,
      selectedPiece: cellKey(coord.ring, coord.position),
    };
    updateUI();
    return;
  }

  const targets = getRestoreTargets(gameState);
  const isTarget = targets.some(
    (t) => t.ring === coord.ring && t.position === coord.position
  );
  if (!isTarget) return;

  const from = gameState.selectedPiece
    ? parseKey(gameState.selectedPiece)
    : gameState.capturedPieces[0]!;
  if (
    !gameState.capturedPieces.some(
      (c) => c.ring === from.ring && c.position === from.position
    )
  ) {
    return;
  }

  const next = restoreCapturedPiece(gameState, from, coord);
  if (next === gameState) return;
  gameState = {
    ...next,
    selectedPiece:
      next.capturedPieces.length > 0
        ? cellKey(
            next.capturedPieces[0]!.ring,
            next.capturedPieces[0]!.position
          )
        : null,
  };
  moveCount++;
  updateUI();
  maybeTriggerAI();
}

function handleCellClick(coord: BoardCoord): void {
  if (gameState.winner) return;
  if (isAIThinking) return;

  // If playing vs AI and it's AI's turn, ignore clicks
  if (vsAI && gameState.currentPlayer === aiPlayer) return;

  // Official capture restore must finish before any other move.
  if (gameState.capturedPieces.length > 0) {
    handleRestoreClick(coord);
    return;
  }

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
      gameState = makeMove(gameState, fromCoord, coord);
      moveCount++;
      if (gameState.capturedPieces.length > 0) {
        const first = gameState.capturedPieces[0]!;
        gameState = {
          ...gameState,
          selectedPiece: cellKey(first.ring, first.position),
        };
      }
      updateUI();
      maybeTriggerAI();
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

async function performAIMove(): Promise<void> {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  const gen = ++aiGeneration;
  isAIThinking = true;
  updateUI();

  let aiMove;
  try {
    aiMove = await getAIMoveAsync(gameState, aiPlayer, aiDifficulty);
  } catch {
    aiMove = null;
  }

  // Worker cancel / rare failure: sync search so the human seat is never soft-locked.
  if (!aiMove && gen === aiGeneration) {
    try {
      aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);
    } catch {
      aiMove = null;
    }
  }

  if (gen !== aiGeneration) return;
  isAIThinking = false;

  if (!aiMove) {
    // No legal move (stalemate) or search exhausted — settle winner chrome.
    settleStalemateIfNeeded();
    updateUI();
    return;
  }

  const next = applyAIMove(gameState, aiMove);
  if (next === gameState) {
    settleStalemateIfNeeded();
    updateUI();
    return;
  }
  gameState = next;
  moveCount++;
  updateUI();

  // Capture keeps the AI seat until restore finishes.
  if (!gameState.winner && gameState.currentPlayer === aiPlayer) {
    setTimeout(() => {
      void performAIMove();
    }, AI_RESTORE_CHAIN_MS);
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
      getCapturedCount: () => gameState.capturedPieces.length,
      seedCapturedRestore: (opts?: {
        currentPlayer?: Player;
        keepVsAI?: boolean;
      }) => {
        const base = createInitialState();
        const cells = new Map(base.cells);
        const captured: BoardCoord = { ring: 2, position: 0 };
        cells.set(cellKey(captured.ring, captured.position), {
          ring: captured.ring,
          position: captured.position,
          piece: {
            id: 'p2-captured-guard',
            player: 'player2',
            type: 'guard',
          },
        });
        const seat = opts?.currentPlayer ?? 'player1';
        gameState = {
          ...base,
          cells,
          currentPlayer: seat,
          capturedPieces: [captured],
          selectedPiece: cellKey(captured.ring, captured.position),
          winner: null,
          moveHistory: [],
        };
        if (!opts?.keepVsAI) vsAI = false;
        updateUI();
        maybeTriggerAI();
      },
      seedWinnerFormation: () => {
        const base = createInitialState();
        const cells = new Map(base.cells);
        const outerQueen = cells.get(cellKey(5, 7))!;
        cells.set(cellKey(5, 7), { ...outerQueen, piece: null });
        cells.set(cellKey(0, 0), {
          ring: 0,
          position: 0,
          piece: {
            id: 'p1-queen',
            player: 'player1',
            type: 'queen',
          },
        });
        const guardPositions = [1, 3, 5, 9, 11, 13];
        for (let i = 0; i < 6; i++) {
          const from = cells.get(cellKey(5, guardPositions[i]!))!;
          cells.set(cellKey(5, guardPositions[i]!), {
            ...from,
            piece: null,
          });
          cells.set(cellKey(1, i), {
            ring: 1,
            position: i,
            piece: from.piece,
          });
        }
        gameState = {
          ...base,
          cells,
          currentPlayer: 'player1',
          winner: 'player1',
          selectedPiece: null,
          capturedPieces: [],
        };
        updateUI();
      },
    };
  }

  updateUI();
}

/** Dispose 3D resources and clear mounts (route change). */
export function destroyGame(): void {
  aiGeneration += 1;
  isAIThinking = false;
  cancelQueensAiRequests();
  disposeQueensAiWorker();
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
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
  aiGeneration += 1;
  isAIThinking = false;
  cancelQueensAiRequests();
  vsAI = false;
  syncOpponentChrome();
  hasNotifiedGameEnd = false;
  moveCount = 0;
  gameState = createInitialState();
  updateUI();
  owlSystem.onGameStart('queens-guards');
}

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  aiGeneration += 1;
  isAIThinking = false;
  cancelQueensAiRequests();
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
