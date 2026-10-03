// Hex-a-Gone! Game Controller

import { HexAGoneGameState, createInitialState, BlockShape } from './types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  selectBlockForPlacement,
  placeBlock,
  isGameOver,
} from './rules';
import { renderBoard, renderStatus, buildSelectionArea } from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { hexAGoneTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { getAISelection, getAIPlacement, AIDifficulty } from './ai';
import { applyGameModeChrome } from '../../ui/player-colors';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadHexAGoneBoard3DModule } from './board-3d-loader';
import type { HexAGoneBoard3D } from '../../ui/three/hex-a-gone-board-3d';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, gameMode);
}

// Game mode
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Controller state
let gameState: HexAGoneGameState;
let gameMode: GameMode = 'human-vs-human';
let aiDifficulty: AIDifficulty = 'medium';
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIThinking = false;
let hasNotifiedGameEnd = false;
let moveCount = 0;

let board3d: HexAGoneBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;
let board3dHost: HTMLElement | null = null;
let selectionHost: HTMLElement | null = null;

const AI_THINKING_DELAY = 800;

function unmountBoard3d(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
  board3dHost = null;
  selectionHost = null;
}

function fallBackTo2dBoard(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dEnabled = false;
  board3dHost = null;
  selectionHost = null;
  render();
}

async function ensureBoard3d(): Promise<void> {
  if (!boardContainer || board3d || !board3dEnabled) return;
  try {
    const mod = await loadHexAGoneBoard3DModule();
    if (!boardContainer || !board3dEnabled) return;

    // Structure: wrapper → 3D host + selection chrome (bank/confirm stay DOM)
    boardContainer.replaceChildren();
    const wrapper = document.createElement('div');
    wrapper.className = 'hex-a-gone-wrapper hex-a-gone-wrapper-3d';
    board3dHost = document.createElement('div');
    board3dHost.className = 'hex-a-gone-board-3d-slot';
    selectionHost = document.createElement('div');
    selectionHost.className = 'hex-a-gone-selection-host';
    wrapper.append(board3dHost, selectionHost);
    boardContainer.appendChild(wrapper);

    board3d = await mod.createHexAGoneBoard3D(
      board3dHost,
      handleCellClick,
      fallBackTo2dBoard
    );
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    board3d = null;
    board3dEnabled = false;
    board3dHost = null;
    selectionHost = null;
  }
}

function canHumanInteract(): boolean {
  return (
    !isAIThinking &&
    (gameMode === 'human-vs-human' || gameState.currentPlayer === 'player1')
  );
}

// Initialize the game
export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  unmountBoard3d();
  boardContainer = boardEl;
  statusContainer = statusEl;
  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      render();
    });
  }
  newGameVsHuman();
}

// Start new human vs human game
export function newGameVsHuman(): void {
  gameMode = 'human-vs-human';
  syncOpponentChrome();
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('hex-a-gone');
}

// Start new game vs AI
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  gameMode = 'human-vs-ai';
  syncOpponentChrome();
  aiDifficulty = difficulty;
  gameState = createInitialState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  render();
  owlSystem.onGameStart('hex-a-gone');
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Handle block selection from bank
function handleBlockSelect(shape: BlockShape): void {
  if (isAIThinking) return;

  if (gameState.phase === 'selectBlocks') {
    // Toggle selection
    if (gameState.turnSelection.blocks.includes(shape)) {
      gameState = deselectBlock(gameState, shape);
    } else {
      gameState = selectBlock(gameState, shape);
    }
  } else if (gameState.phase === 'placeBlocks') {
    // Switch to this block for placement
    gameState = selectBlockForPlacement(gameState, shape);
  }

  render();
}

// Handle confirm selection
function handleConfirm(): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'selectBlocks') return;

  gameState = commitSelection(gameState);
  render();
}

// Handle cell click for placement
function handleCellClick(q: number, r: number): void {
  if (isAIThinking) return;
  if (gameState.phase !== 'placeBlocks') return;

  const prevPlayer = gameState.currentPlayer;
  gameState = placeBlock(gameState, q, r);
  moveCount++;
  render();

  // Check for game end
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    owlSystem.onGameEnd('hex-a-gone', {
      winner: gameState.winner,
      moveCount,
    });
  }

  // Check if turn switched to AI
  if (
    gameMode === 'human-vs-ai' &&
    !isGameOver(gameState) &&
    gameState.currentPlayer === 'player2' &&
    gameState.currentPlayer !== prevPlayer
  ) {
    triggerAITurn();
  }
}

// AI turn logic
function triggerAITurn(): void {
  isAIThinking = true;
  render();

  setTimeout(() => {
    // AI selects blocks using AI module
    const aiSelectBlocks = (): void => {
      const selection = getAISelection(gameState, 'player2', aiDifficulty);

      if (!selection || selection.blocks.length === 0) {
        isAIThinking = false;
        render();
        return;
      }

      // Select each block
      for (const block of selection.blocks) {
        gameState = selectBlock(gameState, block);
      }

      gameState = commitSelection(gameState);
      render();

      // Place blocks after a delay
      setTimeout(aiPlaceBlocks, AI_THINKING_DELAY);
    };

    // AI places blocks one by one using AI module
    const aiPlaceBlocks = (): void => {
      if (
        gameState.phase !== 'placeBlocks' ||
        !gameState.selectedBlockForPlacement
      ) {
        isAIThinking = false;
        render();
        return;
      }

      const placement = getAIPlacement(gameState, 'player2', aiDifficulty);

      if (!placement) {
        isAIThinking = false;
        render();
        return;
      }

      gameState = placeBlock(gameState, placement.q, placement.r);
      moveCount++;
      render();

      // Check for game end
      if (gameState.winner && !hasNotifiedGameEnd) {
        hasNotifiedGameEnd = true;
        owlSystem.onGameEnd('hex-a-gone', {
          winner: gameState.winner,
          moveCount,
        });
      }

      // Continue placing if more blocks to place
      if (
        gameState.phase === 'placeBlocks' &&
        gameState.currentPlayer === 'player2'
      ) {
        setTimeout(aiPlaceBlocks, AI_THINKING_DELAY);
      } else {
        isAIThinking = false;
        render();
      }
    };

    aiSelectBlocks();
  }, AI_THINKING_DELAY);
}

// Render the game
function render(): void {
  if (boardContainer) {
    const canInteract = canHumanInteract();
    const onCell = canInteract ? handleCellClick : undefined;
    const onBlock = canInteract ? handleBlockSelect : undefined;
    const onConfirm = canInteract ? handleConfirm : undefined;

    if (board3dEnabled && board3d && board3dHost && selectionHost) {
      board3d.update(gameState, onCell);
      selectionHost.replaceChildren(
        buildSelectionArea(gameState, onBlock, onConfirm)
      );
    } else if (!board3dEnabled) {
      renderBoard(gameState, boardContainer, onCell, onBlock, onConfirm);
    }
    // If 3D enabled but still loading, skip board paint until ready.
  }

  if (statusContainer) {
    renderStatus(gameState, statusContainer, gameMode, isAIThinking);
  }
}

export function destroyGame(): void {
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
}

export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

// Get current state
export function getGameState(): HexAGoneGameState {
  return gameState;
}

// Reset game
export function resetGame(): void {
  if (gameMode === 'human-vs-ai') {
    newGameVsAI();
  } else {
    newGameVsHuman();
  }
}

// Start the tutorial
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

  tutorialManager.start(hexAGoneTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
