import {
  GameState,
  Position,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidMove,
  getCurrentPhaseMessage,
} from './game-state';

// Click handler callback type
export type CellClickCallback = (row: number, col: number) => void;

// Handle cell click based on current game state
export function handleCellClick(
  row: number,
  col: number,
  state: GameState
): GameState {
  const position: Position = { row, col };

  // Game over - ignore all clicks
  if (state.turnPhase === 'gameOver') {
    return state;
  }

  // Move King phase
  if (state.turnPhase === 'moveKing') {
    const clickedCell = state.board[row - 1][col - 1]; // Convert 1-based to 0-based

    // Check if clicked on current player's King
    if (clickedCell?.type === 'king' && clickedCell?.owner === state.currentPlayer) {
      // If King is already selected and we click it again, deselect
      if (
        state.selectedKingPosition &&
        state.selectedKingPosition.row === row &&
        state.selectedKingPosition.col === col
      ) {
        return {
          ...state,
          selectedKingPosition: null,
        };
      }
      // Select the King
      return selectKing(state);
    }

    // If King is selected and clicked a valid destination
    if (state.selectedKingPosition && isValidMove(state, position)) {
      return moveKing(state, position);
    }

    // Invalid click, return unchanged
    return state;
  }

  // Place Quadraphage phase
  if (state.turnPhase === 'placeQuadraphage') {
    const clickedCell = state.board[row - 1][col - 1];

    // Only place on empty cells
    if (clickedCell === null) {
      return placeQuadraphage(state, position);
    }

    // Occupied cell, return unchanged
    return state;
  }

  return state;
}

// Render the game board
export function renderBoard(
  state: GameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback
): void {
  container.innerHTML = '';

  const boardEl = document.createElement('div');
  boardEl.className = 'board';

  // Loop through rows 1-9 and columns 1-9 (1-based indexing)
  for (let row = 1; row <= 9; row++) {
    for (let col = 1; col <= 9; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);

      // Checkerboard pattern
      const isLight = (row + col) % 2 === 0;
      cell.classList.add(isLight ? 'cell-light' : 'cell-dark');

      // Get cell contents (convert to 0-based for array access)
      const piece = state.board[row - 1][col - 1];

      if (piece === null) {
        cell.classList.add('cell-empty');
      } else if (piece.type === 'king') {
        cell.classList.add('cell-king');
        cell.classList.add(piece.owner === 'player1' ? 'cell-p1' : 'cell-p2');
        cell.textContent = '♚';
      } else if (piece.type === 'quadraphage') {
        cell.classList.add('cell-quad');
        cell.classList.add(piece.owner === 'player1' ? 'cell-p1' : 'cell-p2');
        cell.textContent = '●';
      }

      // Check if this cell is selected
      if (
        state.selectedKingPosition &&
        state.selectedKingPosition.row === row &&
        state.selectedKingPosition.col === col
      ) {
        cell.classList.add('cell-selected');
      }

      // Highlight valid moves when king is selected
      if (
        state.selectedKingPosition &&
        state.turnPhase === 'moveKing' &&
        isValidMove(state, { row, col })
      ) {
        cell.classList.add('cell-valid-move');
      }

      boardEl.appendChild(cell);
    }
  }

  // Event delegation for clicks
  if (onCellClick) {
    boardEl.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const cellEl = target.closest('.cell') as HTMLElement;
      if (!cellEl) return;

      const clickedRow = parseInt(cellEl.dataset.row!, 10);
      const clickedCol = parseInt(cellEl.dataset.col!, 10);

      onCellClick(clickedRow, clickedCol);
    });
  }

  container.appendChild(boardEl);
}

// Render the status display
export function renderStatus(state: GameState, container: HTMLElement): void {
  container.innerHTML = '';

  const statusEl = document.createElement('div');
  statusEl.className = 'status';

  // Turn/phase message
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';
  turnEl.textContent = getCurrentPhaseMessage(state);
  statusEl.appendChild(turnEl);

  // Winner celebration
  if (state.winner) {
    const winnerEl = document.createElement('div');
    winnerEl.className = 'status-winner';
    const winnerName = state.winner === 'player1' ? 'Player 1' : 'Player 2';
    const winnerColor = state.winner === 'player1' ? '🔵' : '🔴';
    winnerEl.textContent = `🎉 ${winnerColor} ${winnerName} Wins! 🎉`;
    statusEl.appendChild(winnerEl);
  }

  // Supplies
  const suppliesEl = document.createElement('div');
  suppliesEl.className = 'status-supplies';

  const supply1El = document.createElement('span');
  supply1El.className = 'supply-p1';
  supply1El.textContent = `🔵 ${state.player1Supply}`;
  suppliesEl.appendChild(supply1El);

  const supply2El = document.createElement('span');
  supply2El.className = 'supply-p2';
  supply2El.textContent = `🔴 ${state.player2Supply}`;
  suppliesEl.appendChild(supply2El);

  statusEl.appendChild(suppliesEl);

  container.appendChild(statusEl);
}
