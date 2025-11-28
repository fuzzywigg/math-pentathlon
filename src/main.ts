import './style.css';
import { initGame, newGame } from './games/kings-quadraphages/game-controller';

// Initialize the game when DOM is ready
const boardContainer = document.getElementById('board');
const statusContainer = document.getElementById('status');
const newGameBtn = document.getElementById('new-game-btn');

if (boardContainer && statusContainer) {
  initGame(boardContainer, statusContainer);
}

// Wire up New Game button
if (newGameBtn) {
  newGameBtn.addEventListener('click', () => {
    newGame();
  });
}
