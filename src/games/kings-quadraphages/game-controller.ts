import { createInitialGameState, GameState } from './game-state';
import { renderBoard, renderStatus, renderMoveHistory, handleCellClick } from './board-ui';

// Game state
let gameState: GameState = createInitialGameState();

// Container references (set during initialization)
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let historyContainer: HTMLElement | null = null;
let newGameButton: HTMLElement | null = null;

// Render the current game state
function render(): void {
  if (!boardContainer || !statusContainer) {
    console.error('Game containers not initialized');
    return;
  }

  renderBoard(gameState, boardContainer, onCellClick);
  renderStatus(gameState, statusContainer);

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
  const result = handleCellClick(row, col, gameState);

  if (result.isInvalidClick) {
    triggerInvalidAnimation(row, col);
  }

  if (result.state !== gameState) {
    gameState = result.state;
    render();
  }
}

// Start a new game
export function newGame(): void {
  gameState = createInitialGameState();
  render();
}

// Initialize the game
export function initGame(
  boardEl: HTMLElement,
  statusEl: HTMLElement,
  historyEl?: HTMLElement,
  newGameBtn?: HTMLElement
): void {
  boardContainer = boardEl;
  statusContainer = statusEl;
  historyContainer = historyEl || null;
  newGameButton = newGameBtn || null;

  // Initial render
  render();
}

// Get current game state (for debugging or testing)
export function getGameState(): GameState {
  return gameState;
}
