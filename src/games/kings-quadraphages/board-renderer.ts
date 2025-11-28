import { Board, BOARD_SIZE, Position, Cell } from './board';

export type CellClickHandler = (position: Position) => void;

export interface BoardRendererOptions {
  onCellClick?: CellClickHandler;
}

// Create the CSS styles for the board
function createStyles(): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = `
    .game-board {
      display: grid;
      grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
      grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
      gap: 2px;
      background: linear-gradient(135deg, #f4a460 0%, #daa520 50%, #f4a460 100%);
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      width: 450px;
      height: 450px;
    }

    .cell {
      background-color: #ffecd2;
      border: 1px solid #8b4513;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .cell:hover {
      background-color: #ffe4b5;
    }

    .piece {
      width: 80%;
      height: 80%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .piece.king {
      border-radius: 8px;
    }

    .piece.player1 {
      background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .piece.player2 {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  `;
  return style;
}

// Render a single piece
function renderPiece(cell: Cell): HTMLElement | null {
  if (!cell) return null;

  const piece = document.createElement('div');
  piece.className = `piece ${cell.type} ${cell.owner}`;
  piece.textContent = cell.type === 'king' ? 'K' : 'Q';
  return piece;
}

// Render a single cell
function renderCell(
  cell: Cell,
  position: Position,
  onCellClick?: CellClickHandler
): HTMLElement {
  const cellElement = document.createElement('div');
  cellElement.className = 'cell';
  cellElement.dataset.row = String(position.row);
  cellElement.dataset.col = String(position.col);

  const piece = renderPiece(cell);
  if (piece) {
    cellElement.appendChild(piece);
  }

  if (onCellClick) {
    cellElement.addEventListener('click', () => {
      onCellClick(position);
    });
  }

  return cellElement;
}

// Render the entire board
export function renderBoard(
  board: Board,
  options: BoardRendererOptions = {}
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-board';

  // Add styles if not already present
  if (!document.querySelector('style[data-board-styles]')) {
    const styles = createStyles();
    styles.dataset.boardStyles = 'true';
    document.head.appendChild(styles);
  }

  // Render each cell
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      const cellElement = renderCell(cell, { row, col }, options.onCellClick);
      container.appendChild(cellElement);
    }
  }

  return container;
}

// Update an existing board display
export function updateBoard(
  container: HTMLElement,
  board: Board,
  options: BoardRendererOptions = {}
): void {
  container.innerHTML = '';

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      const cellElement = renderCell(cell, { row, col }, options.onCellClick);
      container.appendChild(cellElement);
    }
  }
}
