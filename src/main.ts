import './style.css';
import { createInitialBoard } from './games/kings-quadraphages/board';
import { renderBoard } from './games/kings-quadraphages/board-renderer';

// Set up the page structure
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Math Pentathlon</h1>
    <p class="subtitle">Kings & Quadraphages</p>
    <div id="board-container"></div>
  </div>
`;

// Create and render the board
const board = createInitialBoard();
const boardElement = renderBoard(board, {
  onCellClick: (position) => {
    console.log(`Clicked cell: row ${position.row}, col ${position.col}`);
  },
});

document.querySelector('#board-container')!.appendChild(boardElement);
