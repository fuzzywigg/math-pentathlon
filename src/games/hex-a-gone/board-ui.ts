// Hex-a-Gone! Board UI - Renders the hexagonal board and pattern blocks

import { HexAGoneGameState, BlockShape, BLOCK_COLORS } from './types';
import { getPhaseMessage, getValidPlacements } from './rules';
import { seatIcon } from '../../ui/player-colors';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindCellActivateKeys,
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';

export type CellClickCallback = (q: number, r: number) => void;
export type BlockSelectCallback = (shape: BlockShape) => void;
export type ConfirmCallback = () => void;

// Hex dimensions
const HEX_SIZE = 30;

// Convert axial coordinates to pixel coordinates
function axialToPixel(q: number, r: number): { x: number; y: number } {
  const x = HEX_SIZE * ((3 / 2) * q);
  const y = HEX_SIZE * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return { x, y };
}

// Create hexagon path for SVG
function hexagonPath(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// Render the game board
export function renderBoard(
  state: HexAGoneGameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback,
  onBlockSelect?: BlockSelectCallback,
  onConfirm?: ConfirmCallback
): void {
  const previousFocus = captureFocusedCell(container);
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'hex-a-gone-wrapper';

  // Create SVG for the board
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'hex-a-gone-board');
  // Radius-3 hexes with HEX_SIZE=30 extend past ±150; pad viewBox so edges aren't clipped
  svg.setAttribute('viewBox', '-185 -195 370 390');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  markBoardAsGrid(svg);

  // Get valid placements for highlighting
  const validPlacements =
    state.phase === 'placeBlocks' ? getValidPlacements(state) : [];
  const validSet = new Set(validPlacements.map((p) => `${p.q},${p.r}`));

  // Draw cells
  const cellsGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  cellsGroup.setAttribute('class', 'hex-a-gone-cells');

  state.board.forEach((cell) => {
    const { x, y } = axialToPixel(cell.q, cell.r);
    const hex = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    hex.setAttribute('points', hexagonPath(x, y, HEX_SIZE - 2));

    const isValid = validSet.has(`${cell.q},${cell.r}`);
    let className = 'hex-a-gone-cell';

    if (cell.filled) {
      className += ' hex-a-gone-cell-filled';
      // Color based on who placed
      if (cell.filledBy === 'player1') {
        className += ' hex-a-gone-cell-p1';
      } else {
        className += ' hex-a-gone-cell-p2';
      }
      // Find the block to get its color
      const block = state.placedBlocks.find(
        (b) => b.q === cell.q && b.r === cell.r
      );
      if (block) {
        hex.setAttribute('fill', BLOCK_COLORS[block.shape]);
      }
    } else if (isValid) {
      className += ' hex-a-gone-cell-valid';
    }

    hex.setAttribute('class', className);
    hex.setAttribute('data-q', String(cell.q));
    hex.setAttribute('data-r', String(cell.r));
    // Stamp row/col for ARIA grid roving (axial q/r mapped 1:1)
    hex.setAttribute('data-row', String(cell.r));
    hex.setAttribute('data-col', String(cell.q));

    const owner =
      cell.filledBy === 'player1'
        ? 'Blue'
        : cell.filledBy === 'player2'
          ? 'Red'
          : undefined;
    const isValidPlacement = !cell.filled && isValid && !!onCellClick;

    makeGridCell(
      hex,
      buildCellAriaLabel({
        coord: `${cell.q},${cell.r}`,
        empty: !cell.filled,
        owner,
        validPlacement: isValidPlacement,
      })
    );

    if (isValidPlacement) {
      hex.style.cursor = 'pointer';
      const activate = () => onCellClick!(cell.q, cell.r);
      hex.addEventListener('click', activate);
      bindCellActivateKeys(hex, activate);
    }

    cellsGroup.appendChild(hex);

    // Add coordinate label for debugging (optional)
    // const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // label.setAttribute('x', String(x));
    // label.setAttribute('y', String(y + 4));
    // label.setAttribute('text-anchor', 'middle');
    // label.setAttribute('class', 'hex-a-gone-coord');
    // label.textContent = `${cell.q},${cell.r}`;
    // cellsGroup.appendChild(label);
  });

  svg.appendChild(cellsGroup);
  bindGridNavigation(svg);
  wrapper.appendChild(svg);

  // Block selection area
  const selectionArea = document.createElement('div');
  selectionArea.className = 'hex-a-gone-selection-area';

  if (state.phase === 'selectBlocks' || state.phase === 'placeBlocks') {
    // Bank section
    const bankSection = document.createElement('div');
    bankSection.className = 'hex-a-gone-bank';

    const bankTitle = document.createElement('div');
    bankTitle.className = 'hex-a-gone-bank-title';
    bankTitle.textContent = 'Pattern Block Bank';
    bankSection.appendChild(bankTitle);

    const bankBlocks = document.createElement('div');
    bankBlocks.className = 'hex-a-gone-bank-blocks';

    const shapes: BlockShape[] = [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ];

    shapes.forEach((shape) => {
      const blockBtn = document.createElement('button');
      blockBtn.className = 'hex-a-gone-block-btn';
      blockBtn.setAttribute('data-shape', shape);

      const isSelected = state.turnSelection.blocks.includes(shape);
      const isCurrentPlacement = state.selectedBlockForPlacement === shape;
      const isAvailable = state.bank[shape] > 0;
      const canSelect =
        state.phase === 'selectBlocks' && !state.turnSelection.committed;

      if (isSelected) blockBtn.classList.add('selected');
      if (isCurrentPlacement) blockBtn.classList.add('placing');
      if (!isAvailable) blockBtn.classList.add('empty');

      blockBtn.innerHTML = `
        <div class="block-icon" style="background-color: ${BLOCK_COLORS[shape]}">${getShapeIcon(shape)}</div>
        <div class="block-name">${shape}</div>
        <div class="block-count">${state.bank[shape]} left</div>
      `;

      if (canSelect && isAvailable && onBlockSelect) {
        blockBtn.addEventListener('click', () => onBlockSelect(shape));
      } else if (state.phase === 'placeBlocks' && isSelected && onBlockSelect) {
        // Allow switching between selected blocks during placement
        blockBtn.addEventListener('click', () => onBlockSelect(shape));
      }

      bankBlocks.appendChild(blockBtn);
    });

    bankSection.appendChild(bankBlocks);
    selectionArea.appendChild(bankSection);

    // Selection status
    if (state.phase === 'selectBlocks') {
      const selectionStatus = document.createElement('div');
      selectionStatus.className = 'hex-a-gone-selection-status';

      if (state.turnSelection.blocks.length > 0) {
        const selectedList = document.createElement('div');
        selectedList.className = 'selected-blocks';
        selectedList.innerHTML = `<strong>Selected:</strong> ${state.turnSelection.blocks
          .map(
            (s) =>
              `<span class="selected-shape" style="background-color: ${BLOCK_COLORS[s]}">${getShapeIcon(s)}</span>`
          )
          .join(' ')}`;
        selectionStatus.appendChild(selectedList);

        if (onConfirm) {
          const confirmBtn = document.createElement('button');
          confirmBtn.className = 'hex-a-gone-confirm-btn';
          confirmBtn.textContent = `Confirm (${state.turnSelection.blocks.length} block${state.turnSelection.blocks.length > 1 ? 's' : ''})`;
          confirmBtn.addEventListener('click', onConfirm);
          selectionStatus.appendChild(confirmBtn);
        }
      } else {
        selectionStatus.textContent =
          'Select 1-3 different blocks from the bank';
      }

      selectionArea.appendChild(selectionStatus);
    }

    // Current placement indicator
    if (state.phase === 'placeBlocks' && state.selectedBlockForPlacement) {
      const placingInfo = document.createElement('div');
      placingInfo.className = 'hex-a-gone-placing-info';
      placingInfo.innerHTML = `
        <strong>Placing:</strong>
        <span class="placing-shape" style="background-color: ${BLOCK_COLORS[state.selectedBlockForPlacement]}">
          ${getShapeIcon(state.selectedBlockForPlacement)} ${state.selectedBlockForPlacement}
        </span>
        <span class="placing-hint">Click an empty cell to place</span>
      `;
      selectionArea.appendChild(placingInfo);
    }
  }

  if (state.phase === 'gameOver') {
    const winnerMsg = document.createElement('div');
    winnerMsg.className = 'hex-a-gone-winner game-winner-banner';
    const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
    winnerMsg.textContent = `🎉 ${winnerName} wins! 🎉`;
    selectionArea.appendChild(winnerMsg);
  }

  wrapper.appendChild(selectionArea);
  container.appendChild(wrapper);
  restoreGridFocus(container, previousFocus);
}

// Get icon for shape
function getShapeIcon(shape: BlockShape): string {
  switch (shape) {
    case 'hexagon':
      return '⬡';
    case 'trapezoid':
      return '⏢';
    case 'rhombus':
      return '◇';
    case 'triangle':
      return '△';
    case 'square':
      return '□';
    default:
      return '○';
  }
}

// Render status display
export function renderStatus(
  state: HexAGoneGameState,
  container: HTMLElement,
  gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  isAIThinking: boolean = false
): void {
  markStatusLive(container);
  container.innerHTML = '';

  const statusEl = document.createElement('div');
  statusEl.className = 'hex-a-gone-status';

  // Turn indicator
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';

  if (state.winner) {
    turnEl.classList.add('status-winner');
    const winnerName =
      gameMode === 'human-vs-ai'
        ? state.winner === 'player1'
          ? 'You'
          : 'AI'
        : state.winner === 'player1'
          ? 'Blue'
          : 'Red';
    turnEl.textContent = `🎉 ${seatIcon(state.winner)} ${winnerName} Wins! 🎉`;
  } else if (isAIThinking) {
    turnEl.textContent = '🤖 AI is thinking...';
    turnEl.classList.add('status-ai-thinking');
  } else {
    turnEl.textContent = getPhaseMessage(state);
  }

  statusEl.appendChild(turnEl);

  // Player indicators
  const playersEl = document.createElement('div');
  playersEl.className = 'hex-a-gone-players';

  const p1Label = gameMode === 'human-vs-ai' ? 'You' : 'Blue Player';
  const p2Label = gameMode === 'human-vs-ai' ? 'AI' : 'Red Player';

  const p1El = document.createElement('div');
  p1El.className = `player-indicator ${state.currentPlayer === 'player1' ? 'active' : ''}`;
  p1El.innerHTML = `${seatIcon('player1')} ${p1Label}`;
  playersEl.appendChild(p1El);

  const p2El = document.createElement('div');
  p2El.className = `player-indicator ${state.currentPlayer === 'player2' ? 'active' : ''}`;
  p2El.innerHTML = `${seatIcon('player2')} ${p2Label}`;
  playersEl.appendChild(p2El);

  statusEl.appendChild(playersEl);

  // Board coverage
  const filledCells = state.board.filter((c) => c.filled).length;
  const totalCells = state.board.length;
  const coverageEl = document.createElement('div');
  coverageEl.className = 'hex-a-gone-coverage';
  coverageEl.textContent = `Board: ${filledCells}/${totalCells} cells filled`;
  statusEl.appendChild(coverageEl);

  container.appendChild(statusEl);
}
