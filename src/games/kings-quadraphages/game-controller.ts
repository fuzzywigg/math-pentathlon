import { createInitialGameState, GameState } from './game-state';
import { renderBoard, renderStatus, handleCellClick } from './board-ui';

// Game state
let gameState: GameState = createInitialGameState();

// Container references (set during initialization)
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;

// Render the current game state
function render(): void {
  if (!boardContainer || !statusContainer) {
    console.error('Game containers not initialized');
    return;
  }

  renderBoard(gameState, boardContainer, onCellClick);
  renderStatus(gameState, statusContainer);
}

// Handle cell clicks
function onCellClick(row: number, col: number): void {
  const newState = handleCellClick(row, col, gameState);

  if (newState !== gameState) {
    gameState = newState;
    render();
  }
}

// Start a new game
export function newGame(): void {
  gameState = createInitialGameState();
  render();
}

// Initialize the game
export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  boardContainer = boardEl;
  statusContainer = statusEl;

  // Initial render
  render();
}

// Get current game state (for debugging or testing)
export function getGameState(): GameState {
  return gameState;
}
