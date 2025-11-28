import './style.css';
import { initGame, newGame } from './games/kings-quadraphages/game-controller';

// Initialize the game when DOM is ready
const boardContainer = document.getElementById('board');
const statusContainer = document.getElementById('status');
const historyContainer = document.getElementById('move-history');
const newGameBtn = document.getElementById('new-game-btn');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const modalClose = helpModal?.querySelector('.modal-close');

if (boardContainer && statusContainer) {
  initGame(boardContainer, statusContainer, historyContainer || undefined);
}

// Wire up New Game button
if (newGameBtn) {
  newGameBtn.addEventListener('click', () => {
    newGame();
  });
}

// Wire up Help modal
if (helpBtn && helpModal) {
  helpBtn.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
  });

  modalClose?.addEventListener('click', () => {
    helpModal.classList.add('hidden');
  });

  // Close modal on backdrop click
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.classList.add('hidden');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
      helpModal.classList.add('hidden');
    }
  });
}
