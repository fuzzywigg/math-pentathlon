import {
  GameState,
  Position,
  selectKing,
  moveKing,
  placeQuadraphage,
  isValidMove,
  getCurrentPhaseMessage,
  getKingPosition,
} from './game-state';
import { getOpponent } from './rules';

// Click handler callback type
export type CellClickCallback = (row: number, col: number) => void;

// Result of handling a cell click
export interface ClickResult {
  state: GameState;
  isInvalidClick: boolean;
}

// Handle cell click based on current game state
export function handleCellClick(
  row: number,
  col: number,
  state: GameState
): ClickResult {
  const position: Position = { row, col };

  // Game over - ignore all clicks
  if (state.turnPhase === 'gameOver') {
    return { state, isInvalidClick: false };
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
          state: {
            ...state,
            selectedKingPosition: null,
          },
          isInvalidClick: false,
        };
      }
      // Select the King
      return { state: selectKing(state), isInvalidClick: false };
    }

    // If King is selected and clicked a valid destination
    if (state.selectedKingPosition && isValidMove(state, position)) {
      return { state: moveKing(state, position), isInvalidClick: false };
    }

    // Invalid click - King selected but clicked invalid destination
    if (state.selectedKingPosition) {
      return { state, isInvalidClick: true };
    }

    // Clicked somewhere without King selected - not really "invalid", just ignored
    return { state, isInvalidClick: false };
  }

  // Place Quadraphage phase
  if (state.turnPhase === 'placeQuadraphage') {
    const clickedCell = state.board[row - 1][col - 1];

    // Only place on empty cells
    if (clickedCell === null) {
      return { state: placeQuadraphage(state, position), isInvalidClick: false };
    }

    // Occupied cell - invalid click
    return { state, isInvalidClick: true };
  }

  return { state, isInvalidClick: false };
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

  // Add phase class for CSS styling
  boardEl.classList.add(`phase-${state.turnPhase}`);

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

      // Mark valid placement cells during quadraphage phase
      if (state.turnPhase === 'placeQuadraphage' && piece === null) {
        cell.classList.add('cell-valid-placement');
      }

      // Highlight last move
      if (state.moveHistory.length > 0) {
        const lastMove = state.moveHistory[state.moveHistory.length - 1];
        if (lastMove.to.row === row && lastMove.to.col === col) {
          cell.classList.add('cell-last-move');
        }
      }

      boardEl.appendChild(cell);
    }
  }

  // Highlight trapped king on game over
  if (state.turnPhase === 'gameOver' && state.winner) {
    const loser = getOpponent(state.winner);
    const loserKingPos = getKingPosition(state, loser);
    if (loserKingPos) {
      const trappedCell = boardEl.querySelector(
        `.cell[data-row="${loserKingPos.row}"][data-col="${loserKingPos.col}"]`
      );
      if (trappedCell) {
        trappedCell.classList.add('cell-trapped');
      }
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

// Format a position as a coordinate string (e.g., "A1", "E5")
function formatPosition(pos: Position): string {
  const colLetter = String.fromCharCode(64 + pos.col); // 1 -> A, 2 -> B, etc.
  return `${colLetter}${pos.row}`;
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

// Render the move history
export function renderMoveHistory(state: GameState, container: HTMLElement): void {
  container.innerHTML = '';

  const historyEl = document.createElement('div');
  historyEl.className = 'move-history';

  const titleEl = document.createElement('div');
  titleEl.className = 'move-history-title';
  titleEl.textContent = 'Move History';
  historyEl.appendChild(titleEl);

  const listEl = document.createElement('div');
  listEl.className = 'move-history-list';

  if (state.moveHistory.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'move-history-empty';
    emptyEl.textContent = 'No moves yet';
    listEl.appendChild(emptyEl);
  } else {
    // Show last 10 moves (most recent first)
    const recentMoves = state.moveHistory.slice(-10).reverse();
    const startIndex = state.moveHistory.length;

    recentMoves.forEach((move, idx) => {
      const moveEl = document.createElement('div');
      moveEl.className = 'move-history-entry';
      moveEl.classList.add(move.player === 'player1' ? 'move-p1' : 'move-p2');

      const moveNumber = startIndex - idx;
      const playerIcon = move.player === 'player1' ? '🔵' : '🔴';

      let moveText: string;
      if (move.action === 'moveKing') {
        const from = move.from ? formatPosition(move.from) : '?';
        const to = formatPosition(move.to);
        moveText = `${moveNumber}. ${playerIcon} ♚ ${from}→${to}`;
      } else {
        const to = formatPosition(move.to);
        moveText = `${moveNumber}. ${playerIcon} ● ${to}`;
      }

      moveEl.textContent = moveText;
      listEl.appendChild(moveEl);
    });
  }

  historyEl.appendChild(listEl);
  container.appendChild(historyEl);
}
