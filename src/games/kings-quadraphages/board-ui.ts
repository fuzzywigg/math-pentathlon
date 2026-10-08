import {
  GameState,
  Position,
  selectKing,
  moveKing,
  placeQuadraphage,
  endTurn,
  isValidMove,
  isValidPlacement,
  getCurrentPhaseMessage,
  getKingPosition,
  getSupply,
} from './game-state';
import { getOpponent } from './rules';
import { PlayerOwner } from './pieces';
import { getGameModeChromeRoot, seatIcon } from '../../ui/player-colors';
import { clearElement } from '../../core/dom-security';

import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindBoardCellKeys,
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
  type BoardFocusable,
} from '../../ui/board-a11y';

/** AI seat from game-mode chrome (defaults to player2). */
function resolveAiSeat(): PlayerOwner {
  const root = getGameModeChromeRoot();
  return root?.dataset.aiSeat === 'player1' ? 'player1' : 'player2';
}

/** True when vs-AI chrome is on and it is the computer's seat to act. */
function isComputerSeatTurn(state: GameState): boolean {
  const root = getGameModeChromeRoot();
  if (root?.dataset.opponent !== 'ai') return false;
  return state.currentPlayer === resolveAiSeat();
}

/** You/AI labels that honor which seat the computer occupies. */
function vsAiActorName(player: PlayerOwner): 'You' | 'AI' {
  return player === resolveAiSeat() ? 'AI' : 'You';
}

/**
 * Inject Kings-local board sizing so cells stay near 44×44 on tablet/desktop.
 * Shared `.board { width: min(450px, 100%) }` collapses under flex shrink-to-fit
 * (~285px / 29px cells on desktop); vw sizing matches the mobile-play-shell fix.
 * Idempotent via DOM marker (safe across test teardowns that remove the node).
 */
function ensureKingsBoardStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.head.querySelector('style[data-kings-board-styles]')) {
    return;
  }

  const style = document.createElement('style');
  style.dataset.kingsBoardStyles = 'true';
  style.textContent = `
    /* Prefer vw over % so #board shrink-to-fit does not crush the grid. */
    .board.kings-board {
      width: min(450px, calc(100vw - 8rem));
      max-width: 100%;
      height: auto;
      aspect-ratio: 1;
      box-sizing: border-box;
    }

    /* Coarse / touch: target ≥44px cells (9×44 + gaps/border ≈ 420px). */
    @media (pointer: coarse), (hover: none) {
      .board.kings-board {
        width: min(420px, calc(100vw - 2rem));
      }

      .board.kings-board .cell {
        /* Keep grid fraction sizing; do not force min-width (overflow). */
        touch-action: manipulation;
      }
    }

    @media (max-width: 560px) {
      .board.kings-board {
        width: min(420px, calc(100vw - 1.5rem));
      }
    }
  `;
  document.head.appendChild(style);
}

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
    if (
      clickedCell?.type === 'king' &&
      clickedCell?.owner === state.currentPlayer
    ) {
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
    // Empty supply: cannot place. Settle instead of ignoring clicks forever.
    if (getSupply(state, state.currentPlayer) <= 0) {
      return { state: endTurn(state), isInvalidClick: false };
    }

    const clickedCell = state.board[row - 1][col - 1];

    // Only place on empty cells
    if (clickedCell === null) {
      return {
        state: placeQuadraphage(state, position),
        isInvalidClick: false,
      };
    }

    // Occupied cell - invalid click
    return { state, isInvalidClick: true };
  }

  return { state, isInvalidClick: false };
}

const KINGS_BOARD_SIZE = 9;
const KINGS_CELL_COUNT = KINGS_BOARD_SIZE * KINGS_BOARD_SIZE;

/** Mutable click binding so listeners can be attached once (#11). */
interface BoardClickBinding {
  onCellClick?: CellClickCallback;
}

const boardClickBindings = new WeakMap<HTMLElement, BoardClickBinding>();

function syncKingsCell(
  cell: HTMLElement,
  state: GameState,
  row: number,
  col: number
): void {
  const isLight = (row + col) % 2 === 0;
  cell.className = `cell ${isLight ? 'cell-light' : 'cell-dark'}`;
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);

  const piece = state.board[row - 1][col - 1];
  const colLetter = String.fromCharCode(64 + col);
  const coord = `${colLetter}${row}`;
  let owner: string | undefined;
  let pieceName: string | undefined;
  let empty = false;

  if (piece === null) {
    cell.classList.add('cell-empty');
    cell.textContent = '';
    empty = true;
  } else if (piece.type === 'king') {
    cell.classList.add('cell-king');
    cell.classList.add(piece.owner === 'player1' ? 'cell-p1' : 'cell-p2');
    cell.textContent = '♚';
    owner = piece.owner === 'player1' ? 'Player 1' : 'Player 2';
    pieceName = 'King';
  } else if (piece.type === 'quadraphage') {
    cell.classList.add('cell-quad');
    cell.classList.add(piece.owner === 'player1' ? 'cell-p1' : 'cell-p2');
    cell.textContent = '●';
    owner = piece.owner === 'player1' ? 'Player 1' : 'Player 2';
    pieceName = 'Quadraphage';
  }

  if (
    state.selectedKingPosition &&
    state.selectedKingPosition.row === row &&
    state.selectedKingPosition.col === col
  ) {
    cell.classList.add('cell-selected');
  }

  // Omit actionable targets on the AI seat (Hex #383 / aria honesty).
  const announceTargets = !isComputerSeatTurn(state);

  const isValidMoveTarget =
    announceTargets &&
    !!state.selectedKingPosition &&
    state.turnPhase === 'moveKing' &&
    isValidMove(state, { row, col });

  if (isValidMoveTarget) {
    cell.classList.add('cell-valid-move');
  }

  const isPlacementTarget =
    announceTargets && isValidPlacement(state, { row, col });

  if (isPlacementTarget) {
    cell.classList.add('cell-valid-placement');
  }

  makeGridCell(
    cell,
    buildCellAriaLabel({
      coord,
      empty,
      owner,
      piece: pieceName,
      validMove: isValidMoveTarget,
      validPlacement: isPlacementTarget,
    })
  );

  if (state.moveHistory.length > 0) {
    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    if (lastMove.to.row === row && lastMove.to.col === col) {
      cell.classList.add('cell-last-move');
    }
  }
}

function ensureKingsBoard(container: HTMLElement): {
  boardEl: HTMLElement;
  created: boolean;
} {
  let boardEl = container.querySelector(
    ':scope > .board'
  ) as HTMLElement | null;
  const cells = boardEl
    ? (Array.from(boardEl.querySelectorAll('.cell')) as HTMLElement[])
    : [];

  if (boardEl && cells.length === KINGS_CELL_COUNT) {
    return { boardEl, created: false };
  }

  container.replaceChildren();
  boardEl = document.createElement('div');
  boardEl.className = 'board kings-board';
  markBoardAsGrid(boardEl);

  const fragment = document.createDocumentFragment();
  for (let row = 1; row <= KINGS_BOARD_SIZE; row++) {
    for (let col = 1; col <= KINGS_BOARD_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      fragment.appendChild(cell);
    }
  }
  boardEl.appendChild(fragment);
  container.appendChild(boardEl);
  return { boardEl, created: true };
}

function bindKingsBoardInteractions(
  boardEl: HTMLElement,
  container: HTMLElement
): void {
  const handleCellAction = (cellEl: BoardFocusable) => {
    const binding = boardClickBindings.get(container);
    if (!binding?.onCellClick) return;

    const clickedRow = parseInt(cellEl.getAttribute('data-row') ?? '', 10);
    const clickedCol = parseInt(cellEl.getAttribute('data-col') ?? '', 10);
    if (!Number.isFinite(clickedRow) || !Number.isFinite(clickedCol)) return;
    if (
      clickedRow < 1 ||
      clickedRow > KINGS_BOARD_SIZE ||
      clickedCol < 1 ||
      clickedCol > KINGS_BOARD_SIZE
    ) {
      return;
    }
    binding.onCellClick(clickedRow, clickedCol);
  };

  boardEl.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const cellEl = target.closest('.cell') as HTMLElement | null;
    if (!cellEl || !boardEl.contains(cellEl)) return;
    handleCellAction(cellEl);
  });

  bindBoardCellKeys(
    boardEl,
    (el) => el.classList.contains('cell'),
    handleCellAction
  );
  bindGridNavigation(boardEl);
}

/**
 * Render the game board.
 * Cells are created once and updated in place (#11) so focus / CSS transitions
 * survive state changes and Playwright "element is not stable" churn drops.
 */
export function renderBoard(
  state: GameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback
): void {
  ensureKingsBoardStyles();
  const previousFocus = captureFocusedCell(container);
  const { boardEl, created } = ensureKingsBoard(container);

  boardClickBindings.set(container, { onCellClick });
  if (created) {
    bindKingsBoardInteractions(boardEl, container);
  }

  boardEl.className = 'board kings-board';
  boardEl.classList.add(`phase-${state.turnPhase}`);

  const cells = Array.from(boardEl.querySelectorAll('.cell')) as HTMLElement[];
  let i = 0;
  for (let row = 1; row <= KINGS_BOARD_SIZE; row++) {
    for (let col = 1; col <= KINGS_BOARD_SIZE; col++) {
      syncKingsCell(cells[i++]!, state, row, col);
    }
  }

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

  restoreGridFocus(container, previousFocus);
}

// Format a position as a coordinate string (e.g., "A1", "E5")
function formatPosition(pos: Position): string {
  const colLetter = String.fromCharCode(64 + pos.col); // 1 -> A, 2 -> B, etc.
  return `${colLetter}${pos.row}`;
}

/** vs-AI turn copy — You/AI (not Player 1/2) + clearer place-phase hint. */
function getVsAiPhaseMessage(state: GameState): string {
  const actor = vsAiActorName(state.currentPlayer);

  switch (state.turnPhase) {
    case 'moveKing':
      if (state.selectedKingPosition) {
        return `${actor}: Click a green square to move`;
      }
      return `${actor}: Click your King to select it`;
    case 'placeQuadraphage':
      return `${actor}: Place a Quadraphage on a green square`;
    case 'gameOver': {
      if (!state.winner) {
        return 'Game Over! Tie!';
      }
      const winnerName = vsAiActorName(state.winner);
      return `Game Over! ${winnerName} win${winnerName === 'You' ? '' : 's'}!`;
    }
    default: {
      const _exhaustive: never = state.turnPhase;
      return _exhaustive;
    }
  }
}

// Render the status display
export function renderStatus(
  state: GameState,
  container: HTMLElement,
  gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium',
  isAIThinking: boolean = false
): void {
  markStatusLive(container);
  clearElement(container);

  const statusEl = document.createElement('div');
  statusEl.className = 'status';

  // Game mode indicator (for AI mode)
  if (gameMode === 'human-vs-ai') {
    const modeEl = document.createElement('div');
    modeEl.className = 'status-mode';
    const difficultyLabel =
      aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1);
    modeEl.textContent = `vs AI (${difficultyLabel})`;
    statusEl.appendChild(modeEl);
  }

  // Turn/phase message
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';

  if (isAIThinking) {
    turnEl.textContent = '🤖 AI is thinking...';
    turnEl.classList.add('status-ai-thinking');
  } else if (gameMode === 'human-vs-ai') {
    turnEl.textContent = getVsAiPhaseMessage(state);
  } else {
    turnEl.textContent = getCurrentPhaseMessage(state);
  }
  statusEl.appendChild(turnEl);

  // Winner / tie celebration
  if (state.turnPhase === 'gameOver') {
    const winnerEl = document.createElement('div');
    winnerEl.className = 'status-winner';

    if (!state.winner) {
      winnerEl.textContent = `🤝 ${seatIcon('player1')} ${seatIcon('player2')} Tie!`;
    } else {
      let winnerName: string;
      if (gameMode === 'human-vs-ai') {
        // Honor aiSeat (human may be player2 when the computer opens).
        winnerName = vsAiActorName(state.winner);
      } else {
        winnerName = state.winner === 'player1' ? 'Player 1' : 'Player 2';
      }
      const winnerColor = seatIcon(state.winner);
      winnerEl.textContent = `🎉 ${winnerColor} ${winnerName} Win${winnerName === 'You' ? '' : 's'}! 🎉`;
    }
    statusEl.appendChild(winnerEl);
  }

  // Supplies
  const suppliesEl = document.createElement('div');
  suppliesEl.className = 'status-supplies';

  const aiSeat = resolveAiSeat();
  const supply1El = document.createElement('span');
  supply1El.className = 'supply-p1';
  const p1Label =
    gameMode === 'human-vs-ai' ? (aiSeat === 'player1' ? 'AI' : 'You') : 'P1';
  supply1El.textContent = `${seatIcon('player1')} ${p1Label}: ${state.player1Supply}`;
  suppliesEl.appendChild(supply1El);

  const supply2El = document.createElement('span');
  supply2El.className = 'supply-p2';
  const p2Label =
    gameMode === 'human-vs-ai' ? (aiSeat === 'player2' ? 'AI' : 'You') : 'P2';
  supply2El.textContent = `${seatIcon('player2')} ${p2Label}: ${state.player2Supply}`;
  suppliesEl.appendChild(supply2El);

  statusEl.appendChild(suppliesEl);

  container.appendChild(statusEl);
}

// Render the move history (renders into the history-content div)
export function renderMoveHistory(
  state: GameState,
  container: HTMLElement
): void {
  clearElement(container);

  const titleEl = document.createElement('div');
  titleEl.className = 'move-history-title';
  titleEl.textContent = 'Moves';
  container.appendChild(titleEl);

  const listEl = document.createElement('div');
  listEl.className = 'move-history-list';

  if (state.moveHistory.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'move-history-empty';
    emptyEl.textContent = 'No moves yet';
    listEl.appendChild(emptyEl);
  } else {
    // Show last 15 moves (most recent first)
    const recentMoves = state.moveHistory.slice(-15).reverse();
    const startIndex = state.moveHistory.length;

    recentMoves.forEach((move, idx) => {
      const moveEl = document.createElement('div');
      moveEl.className = 'move-history-entry';
      moveEl.classList.add(move.player === 'player1' ? 'move-p1' : 'move-p2');

      const moveNumber = startIndex - idx;
      const playerIcon = seatIcon(move.player);

      let moveText: string;
      if (move.action === 'moveKing') {
        const from = move.from ? formatPosition(move.from) : '?';
        const to = formatPosition(move.to);
        moveText = `${moveNumber}. ${playerIcon}♚${from}→${to}`;
      } else {
        const to = formatPosition(move.to);
        moveText = `${moveNumber}. ${playerIcon}●${to}`;
      }

      moveEl.textContent = moveText;
      listEl.appendChild(moveEl);
    });
  }

  container.appendChild(listEl);
}
