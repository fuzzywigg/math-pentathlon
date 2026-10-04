import {
  createInitialGameState,
  GameState,
  moveKing,
  placeQuadraphage,
} from './game-state';
import {
  renderBoard,
  renderStatus,
  renderMoveHistory,
  handleCellClick,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { kingsQuadraphagesTutorial } from './tutorial';
import { getAIMove, AIDifficulty, isAITurn } from './ai';
import { PlayerOwner } from './pieces';
import { owlSystem } from '../../core/owl';
import { applyGameModeChrome } from '../../ui/player-colors';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadKingsQuadraphagesBoard3DModule } from './board-3d-loader';
import type { KingsQuadraphagesBoard3D } from '../../ui/three/kings-quadraphages-board-3d';

// Game mode types
export type GameMode = 'human-vs-human' | 'human-vs-ai';

// Game state
let gameState: GameState = createInitialGameState();

// Game mode settings
let gameMode: GameMode = 'human-vs-human';
let aiPlayer: PlayerOwner | null = null;
let aiDifficulty: AIDifficulty = 'medium';
let isAIThinking: boolean = false;

// AI thinking delay (ms) for better UX
const AI_THINKING_DELAY = 500;
const AI_MOVE_DELAY = 300;

// Track if game has ended (to prevent multiple owl notifications)
let hasNotifiedGameEnd = false;

// Container references (set during initialization)
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let historyContainer: HTMLElement | null = null;
let newGameButton: HTMLElement | null = null;

// Optional Three.js board (only when feature flag is on)
let board3d: KingsQuadraphagesBoard3D | null = null;
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
    const mod = await loadKingsQuadraphagesBoard3DModule();
    if (!boardContainer || !board3dEnabled) return;
    board3d = await mod.createKingsQuadraphagesBoard3D(
      boardContainer,
      onCellClick
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

// Render the current game state
function render(): void {
  if (!boardContainer || !statusContainer) {
    console.error('Game containers not initialized');
    return;
  }

  // Disable board interaction during AI turn
  const allowClicks = !isAIThinking && !isAITurn(gameState, aiPlayer, gameMode);

  if (board3dEnabled && board3d) {
    board3d.update(gameState, allowClicks ? onCellClick : undefined);
  } else if (!board3dEnabled) {
    renderBoard(
      gameState,
      boardContainer,
      allowClicks ? onCellClick : undefined
    );
  }
  // If 3D is enabled but still loading, skip board paint until ready.

  renderStatus(
    gameState,
    statusContainer,
    gameMode,
    aiDifficulty,
    isAIThinking
  );

  if (historyContainer) {
    renderMoveHistory(gameState, historyContainer);
  }

  // Update New Game button styling based on game state
  if (newGameButton) {
    if (gameState.turnPhase === 'gameOver') {
      newGameButton.classList.add('game-over-active');
    } else {
      newGameButton.classList.remove('game-over-active');
    }
  }

  // Notify Owl system when game ends
  if (gameState.turnPhase === 'gameOver' && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    const winner = gameState.winner;

    owlSystem.onGameEnd('kings-quadraphages', {
      winner:
        winner === 'player1'
          ? 'player1'
          : winner === 'player2'
            ? 'player2'
            : 'draw',
      moveCount: gameState.moveHistory.length,
    });
  }

  // Keep tutorial highlight / enlarged tap target aligned with the live board
  if (tutorialManager.getIsActive()) {
    tutorialManager.refreshHighlight();
  }
}

// Trigger invalid click animation on a cell
function triggerInvalidAnimation(row: number, col: number): void {
  if (!boardContainer) return;

  const cell = boardContainer.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  ) as HTMLElement | null;

  if (cell) {
    cell.classList.add('cell-invalid');
    // Remove the class after animation completes
    setTimeout(() => {
      cell.classList.remove('cell-invalid');
    }, 300);
  }
}

// Handle cell clicks
function onCellClick(row: number, col: number): void {
  // Ignore clicks during AI turn
  if (isAIThinking || isAITurn(gameState, aiPlayer, gameMode)) {
    return;
  }

  // Check if tutorial is waiting for this click
  if (tutorialManager.getIsActive()) {
    const handled = tutorialManager.handleAction('click-cell', { row, col });
    // If tutorial handled the click and it was the expected action, also process the game action
    // This allows the tutorial to progress while the game state updates
    if (handled) {
      // Process the game action
      processGameClick(row, col);
      return;
    }

    // Check if we're on a step that requires a specific action
    const currentStep = tutorialManager.getCurrentStep();
    if (currentStep?.requiredAction) {
      // Tutorial is active and waiting for a specific action - still allow gameplay
      processGameClick(row, col);
      return;
    }
  }

  processGameClick(row, col);
}

// Process a game click (separate from tutorial handling)
function processGameClick(row: number, col: number): void {
  const result = handleCellClick(row, col, gameState);

  if (result.isInvalidClick) {
    triggerInvalidAnimation(row, col);
  }

  if (result.state !== gameState) {
    gameState = result.state;
    render();

    // Check if it's now AI's turn
    checkAndTriggerAITurn();
  }
}

// Check if AI should play and trigger its turn
function checkAndTriggerAITurn(): void {
  if (gameMode !== 'human-vs-ai' || !aiPlayer) return;
  if (gameState.turnPhase === 'gameOver') return;
  if (isAIThinking) return;

  if (isAITurn(gameState, aiPlayer, gameMode)) {
    executeAITurn();
  }
}

// Execute the AI's turn with delays for better UX
async function executeAITurn(): Promise<void> {
  if (!aiPlayer) return;

  isAIThinking = true;
  render(); // Show "AI is thinking..." status

  // Initial thinking delay
  await delay(AI_THINKING_DELAY);

  // Get AI's move
  const aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);

  if (!aiMove) {
    // AI has no valid moves (shouldn't happen if game logic is correct)
    isAIThinking = false;
    render();
    return;
  }

  // Execute king move (convert from 0-based to 1-based)
  const kingMovePos = {
    row: aiMove.kingMove.row + 1,
    col: aiMove.kingMove.col + 1,
  };
  gameState = moveKing(gameState, kingMovePos);
  render();

  // Delay before placing quadraphage
  await delay(AI_MOVE_DELAY);

  // Execute quadraphage placement (convert from 0-based to 1-based)
  const quadPos = {
    row: aiMove.quadraphagePlacement.row + 1,
    col: aiMove.quadraphagePlacement.col + 1,
  };
  gameState = placeQuadraphage(gameState, quadPos);

  isAIThinking = false;
  render();

  // If game continues and it's still AI's turn (shouldn't happen), check again
  checkAndTriggerAITurn();
}

// Simple delay helper
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start a new game with current settings
export function newGame(): void {
  gameState = createInitialGameState();
  isAIThinking = false;
  hasNotifiedGameEnd = false;
  render();

  // Notify Owl system about game start
  owlSystem.onGameStart('kings-quadraphages');

  // If AI goes first (AI is player 1), trigger AI turn
  if (gameMode === 'human-vs-ai' && aiPlayer === 'player1') {
    checkAndTriggerAITurn();
  }
}

function syncModeChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(
    root,
    gameMode,
    aiPlayer === 'player1' ? 'player1' : 'player2'
  );
}

// Start a new game vs AI
export function newGameVsAI(
  difficulty: AIDifficulty,
  humanPlaysFirst: boolean = true
): void {
  gameMode = 'human-vs-ai';
  aiDifficulty = difficulty;
  aiPlayer = humanPlaysFirst ? 'player2' : 'player1';
  syncModeChrome();
  newGame();
}

// Start a new game vs human
export function newGameVsHuman(): void {
  gameMode = 'human-vs-human';
  aiPlayer = null;
  syncModeChrome();
  newGame();
}

// Get current game mode
export function getGameMode(): GameMode {
  return gameMode;
}

// Get current AI difficulty
export function getAIDifficulty(): AIDifficulty {
  return aiDifficulty;
}

// Set AI difficulty
export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

// Start the tutorial
export function startTutorial(): void {
  // Reset to fresh game state for tutorial (human vs human mode)
  gameMode = 'human-vs-human';
  aiPlayer = null;
  syncModeChrome();
  gameState = createInitialGameState();
  render();
  // Subscribe to tutorial events
  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      // Optionally reset game after tutorial
      if (event.type === 'completed') {
        newGame();
      }
    }
  });

  // Start the tutorial
  tutorialManager.start(kingsQuadraphagesTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

// Initialize the game
export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement,
  historyEl?: HTMLElement,
  newGameBtn?: HTMLElement
): void {
  // Tear down any prior 3D view (hot re-init / remount)
  unmountBoard3d();

  boardContainer = boardEl;
  statusContainer = statusEl;
  historyContainer = historyEl || null;
  newGameButton = newGameBtn || null;

  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      render();
    });
  }

  // Initial render (2D immediately; 3D after async mount)
  render();
}

/** Dispose 3D resources and clear controller mounts (route change). */
export function destroyGame(): void {
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
  historyContainer = null;
  newGameButton = null;
}

/** Whether the live controller is using the 3D board path. */
export function isUsingBoard3d(): boolean {
  return board3dEnabled;
}

/** Await pending 3D mount (tests / callers that need the canvas ready). */
export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

// Get current game state (for debugging or testing)
export function getGameState(): GameState {
  return gameState;
}
