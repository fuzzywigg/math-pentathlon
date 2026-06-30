// Alignment Detection Demo - Interactive test page

import { AlignmentConfig, ContiguousConfig, CellValue } from '../core/alignment/types';
import {
  createArrayGetter,
  checkForWinner,
  findAllAlignments,
  countAlignmentPotential,
} from '../core/alignment/grid-alignment';
import {
  findAllRegions,
  regionConnectsEdges,
  getHexNeighbors,
} from '../core/alignment/contiguous';
import { injectHighlightStyles } from '../core/alignment/highlight-ui';

type Board = CellValue[][];

// Demo state
let currentBoard: Board = [];
let currentPlayer: 'X' | 'O' = 'X';


function createEmptyBoard(rows: number, cols: number): Board {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

function renderFourInRowDemo(container: HTMLElement): void {
  const rows = 6;
  const cols = 7;
  currentBoard = createEmptyBoard(rows, cols);
  currentPlayer = 'X';

  const config: AlignmentConfig = {
    targetLength: 4,
    rows,
    cols,
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'alignment-demo-section';
  wrapper.innerHTML = `
    <h3>Connect Four Style (4-in-a-row)</h3>
    <p class="demo-instructions">Click a column to drop a piece. Get 4 in a row to win!</p>
    <div class="demo-status" id="four-status">Current player: <span class="player-x">X</span></div>
    <div class="demo-board four-board" id="four-board"></div>
    <div class="demo-info" id="four-info"></div>
    <button class="demo-reset-btn" id="four-reset">Reset Game</button>
  `;

  container.appendChild(wrapper);

  const boardEl = wrapper.querySelector('#four-board') as HTMLElement;
  const statusEl = wrapper.querySelector('#four-status') as HTMLElement;
  const infoEl = wrapper.querySelector('#four-info') as HTMLElement;
  const resetBtn = wrapper.querySelector('#four-reset') as HTMLButtonElement;

  function render(): void {
    boardEl.innerHTML = '';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.className = 'demo-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        const value = currentBoard[row][col];
        if (value) {
          cell.classList.add(`cell-${value.toString().toLowerCase()}`);
          cell.textContent = value.toString();
        }

        cell.addEventListener('click', () => handleClick(col));
        boardEl.appendChild(cell);
      }
    }

    // Check for winner
    const getCell = createArrayGetter(currentBoard);
    const result = checkForWinner(getCell, config);

    if (result.hasWinner) {
      statusEl.innerHTML = `<span class="winner">Winner: ${result.winner}!</span>`;

      // Highlight winning cells
      for (const alignment of result.alignments) {
        for (const pos of alignment.positions) {
          const cell = boardEl.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
          if (cell) {
            cell.classList.add('winning-cell');
          }
        }
      }
    } else {
      statusEl.innerHTML = `Current player: <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>`;
    }

    // Show alignment info
    const alignments = findAllAlignments(getCell, { ...config, targetLength: 2 });
    const xAlignments = alignments.filter(a => a.value === 'X');
    const oAlignments = alignments.filter(a => a.value === 'O');
    infoEl.innerHTML = `
      <div>X has ${xAlignments.length} alignments (2+)</div>
      <div>O has ${oAlignments.length} alignments (2+)</div>
    `;
  }

  function handleClick(col: number): void {
    const getCell = createArrayGetter(currentBoard);
    const result = checkForWinner(getCell, config);
    if (result.hasWinner) return;

    // Find lowest empty row in column
    let targetRow = -1;
    for (let row = rows - 1; row >= 0; row--) {
      if (currentBoard[row][col] === null) {
        targetRow = row;
        break;
      }
    }

    if (targetRow === -1) return; // Column full

    currentBoard[targetRow][col] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    render();
  }

  resetBtn.addEventListener('click', () => {
    currentBoard = createEmptyBoard(rows, cols);
    currentPlayer = 'X';
    render();
  });

  render();
}

function renderHexConnectDemo(container: HTMLElement): void {
  const size = 7;
  const board: Board = createEmptyBoard(size, size);
  let player: 'B' | 'R' = 'B';

  const config: ContiguousConfig = {
    rows: size,
    cols: size,
    includeDiagonals: false,
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'alignment-demo-section';
  wrapper.innerHTML = `
    <h3>Hex-style Connection</h3>
    <p class="demo-instructions">Blue connects top-bottom, Red connects left-right. Click to place.</p>
    <div class="demo-status" id="hex-status">Current player: <span class="player-b">Blue</span></div>
    <div class="demo-board hex-board" id="hex-board"></div>
    <div class="demo-info" id="hex-info"></div>
    <button class="demo-reset-btn" id="hex-reset">Reset Game</button>
  `;

  container.appendChild(wrapper);

  const boardEl = wrapper.querySelector('#hex-board') as HTMLElement;
  const statusEl = wrapper.querySelector('#hex-status') as HTMLElement;
  const infoEl = wrapper.querySelector('#hex-info') as HTMLElement;
  const resetBtn = wrapper.querySelector('#hex-reset') as HTMLButtonElement;

  function render(): void {
    boardEl.innerHTML = '';
    boardEl.style.setProperty('--hex-size', String(size));

    for (let row = 0; row < size; row++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'hex-row';
      rowEl.style.marginLeft = `${row * 18}px`;

      for (let col = 0; col < size; col++) {
        const cell = document.createElement('div');
        cell.className = 'demo-hex-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        const value = board[row][col];
        if (value === 'B') {
          cell.classList.add('cell-blue');
        } else if (value === 'R') {
          cell.classList.add('cell-red');
        }

        cell.addEventListener('click', () => handleClick(row, col));
        rowEl.appendChild(cell);
      }

      boardEl.appendChild(rowEl);
    }

    // Check for winner using contiguous regions
    const getCell = createArrayGetter(board);
    const regions = findAllRegions(getCell, config, getHexNeighbors);

    let winner: string | null = null;

    for (const region of regions) {
      if (region.value === 'B' && regionConnectsEdges(region, 'top', 'bottom', config)) {
        winner = 'Blue';
        // Highlight winning path
        for (const pos of region.positions) {
          const cell = boardEl.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
          if (cell) cell.classList.add('winning-cell');
        }
      }
      if (region.value === 'R' && regionConnectsEdges(region, 'left', 'right', config)) {
        winner = 'Red';
        for (const pos of region.positions) {
          const cell = boardEl.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
          if (cell) cell.classList.add('winning-cell');
        }
      }
    }

    if (winner) {
      statusEl.innerHTML = `<span class="winner">Winner: ${winner}!</span>`;
    } else {
      const playerName = player === 'B' ? 'Blue' : 'Red';
      statusEl.innerHTML = `Current player: <span class="player-${player.toLowerCase()}">${playerName}</span>`;
    }

    // Show region info
    const blueRegions = regions.filter(r => r.value === 'B');
    const redRegions = regions.filter(r => r.value === 'R');
    infoEl.innerHTML = `
      <div>Blue: ${blueRegions.length} region(s), largest: ${Math.max(0, ...blueRegions.map(r => r.size))}</div>
      <div>Red: ${redRegions.length} region(s), largest: ${Math.max(0, ...redRegions.map(r => r.size))}</div>
    `;
  }

  function handleClick(row: number, col: number): void {
    if (board[row][col] !== null) return;

    // Check for existing winner
    const getCell = createArrayGetter(board);
    const regions = findAllRegions(getCell, config, getHexNeighbors);
    for (const region of regions) {
      if (region.value === 'B' && regionConnectsEdges(region, 'top', 'bottom', config)) return;
      if (region.value === 'R' && regionConnectsEdges(region, 'left', 'right', config)) return;
    }

    board[row][col] = player;
    player = player === 'B' ? 'R' : 'B';
    render();
  }

  resetBtn.addEventListener('click', () => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        board[r][c] = null;
      }
    }
    player = 'B';
    render();
  });

  render();
}

function renderPotentialDemo(container: HTMLElement): void {
  const rows = 5;
  const cols = 5;
  const board: Board = createEmptyBoard(rows, cols);

  // Pre-populate with some pieces
  board[2][2] = 'X';
  board[2][3] = 'X';
  board[1][2] = 'O';

  const config: AlignmentConfig = {
    targetLength: 4,
    rows,
    cols,
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'alignment-demo-section';
  wrapper.innerHTML = `
    <h3>Alignment Potential Analysis</h3>
    <p class="demo-instructions">Click cells to place X. See alignment potential for each direction.</p>
    <div class="demo-board potential-board" id="potential-board"></div>
    <div class="demo-info" id="potential-info"></div>
    <button class="demo-reset-btn" id="potential-reset">Reset</button>
  `;

  container.appendChild(wrapper);

  const boardEl = wrapper.querySelector('#potential-board') as HTMLElement;
  const infoEl = wrapper.querySelector('#potential-info') as HTMLElement;
  const resetBtn = wrapper.querySelector('#potential-reset') as HTMLButtonElement;

  function render(selectedRow?: number, selectedCol?: number): void {
    boardEl.innerHTML = '';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.className = 'demo-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        const value = board[row][col];
        if (value) {
          cell.classList.add(`cell-${value.toString().toLowerCase()}`);
          cell.textContent = value.toString();
        }

        if (row === selectedRow && col === selectedCol) {
          cell.classList.add('selected-cell');
        }

        cell.addEventListener('click', () => handleClick(row, col));
        boardEl.appendChild(cell);
      }
    }

    // Show potential for selected cell
    if (selectedRow !== undefined && selectedCol !== undefined) {
      const getCell = createArrayGetter(board);
      const potential = countAlignmentPotential(selectedRow, selectedCol, 'X', getCell, config);

      let html = `<strong>Alignment potential at (${selectedRow}, ${selectedCol}):</strong><br>`;
      potential.forEach((data, direction) => {
        const status = data.blocked ? '(blocked)' : '(open)';
        html += `${direction}: ${data.count} ${status}<br>`;
      });
      infoEl.innerHTML = html;
    } else {
      infoEl.innerHTML = 'Click a cell to see alignment potential';
    }
  }

  function handleClick(row: number, col: number): void {
    if (board[row][col] === null) {
      board[row][col] = 'X';
    } else if (board[row][col] === 'X') {
      board[row][col] = 'O';
    } else {
      board[row][col] = null;
    }
    render(row, col);
  }

  resetBtn.addEventListener('click', () => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        board[r][c] = null;
      }
    }
    render();
  });

  render();
}

export function renderAlignmentDemo(container: HTMLElement): void {
  injectHighlightStyles();

  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'alignment-demo';
  wrapper.innerHTML = `
    <style>
      .alignment-demo {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }
      .alignment-demo h1 {
        text-align: center;
        color: #1a237e;
        margin-bottom: 0.5rem;
      }
      .alignment-demo > p {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
      }
      .alignment-demo-section {
        margin-bottom: 3rem;
        padding: 1.5rem;
        background: #f5f5f5;
        border-radius: 12px;
      }
      .alignment-demo-section h3 {
        margin-top: 0;
        color: #333;
      }
      .demo-instructions {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      .demo-status {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .player-x, .player-b { color: #1976d2; }
      .player-o, .player-r { color: #d32f2f; }
      .winner { color: #2e7d32; font-weight: bold; }

      .demo-board {
        display: grid;
        gap: 4px;
        justify-content: center;
        margin-bottom: 1rem;
      }
      .four-board {
        grid-template-columns: repeat(7, 50px);
      }
      .potential-board {
        grid-template-columns: repeat(5, 50px);
      }
      .demo-cell {
        width: 50px;
        height: 50px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .demo-cell:hover {
        background: #e3f2fd;
        border-color: #1976d2;
      }
      .cell-x { background: #bbdefb; color: #1565c0; }
      .cell-o { background: #ffcdd2; color: #c62828; }
      .cell-blue { background: #1976d2; }
      .cell-red { background: #d32f2f; }
      .winning-cell {
        animation: pulse-winner 0.5s ease infinite;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      }
      .selected-cell {
        border-color: #9c27b0;
        box-shadow: 0 0 8px rgba(156, 39, 176, 0.4);
      }
      @keyframes pulse-winner {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .hex-board {
        display: flex;
        flex-direction: column;
        gap: 2px;
        background: linear-gradient(135deg, #1976d2 0%, #1976d2 10%, transparent 10%, transparent 90%, #d32f2f 90%);
        padding: 10px;
        border-radius: 8px;
      }
      .hex-row {
        display: flex;
        gap: 4px;
      }
      .demo-hex-cell {
        width: 36px;
        height: 36px;
        background: #e0e0e0;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .demo-hex-cell:hover {
        background: #bdbdbd;
      }

      .demo-info {
        font-size: 0.9rem;
        color: #666;
        padding: 0.75rem;
        background: white;
        border-radius: 8px;
        margin-bottom: 1rem;
      }
      .demo-reset-btn {
        padding: 0.5rem 1rem;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
      }
      .demo-reset-btn:hover {
        background: #1565c0;
      }
      .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        color: #1976d2;
        text-decoration: none;
      }
      .back-link:hover {
        text-decoration: underline;
      }
    </style>

    <a href="#/" class="back-link">&larr; Back to Games</a>
    <h1>🔗 Alignment Detection Demo</h1>
    <p>Test the reusable alignment detection system</p>
  `;

  container.appendChild(wrapper);

  renderFourInRowDemo(wrapper);
  renderHexConnectDemo(wrapper);
  renderPotentialDemo(wrapper);
}
