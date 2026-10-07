// Queens & Guards Board UI
// SVG rendering for the hexagonal game board

import {
  QueensGuardsState,
  CONFIG,
  BoardCoord,
  cellKey,
  cellsInRing,
  parseKey,
} from './types';
import { getValidMoves, getRestoreTargets } from './rules';
import { getPlayerSeatColors } from '../../ui/player-colors';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindCellActivateKeys,
  collectGridCells,
  applyRovingTabindex,
} from '../../ui/board-a11y';

// Colors
const COLORS = {
  background: '#f8f4e8',
  cellLight: '#e8e0c8',
  cellDark: '#d4c8a8',
  cellCenter: '#ffd700',
  cellRing1: '#ffeb99',
  stroke: '#8b7355',
  validMove: '#4caf50',
  selected: '#ff9800',
  queen: '#ffd700',
};

function playerColors() {
  return getPlayerSeatColors();
}

/**
 * Convert ring/position to pixel coordinates
 */
function ringPosToPixel(
  ring: number,
  position: number,
  centerX: number,
  centerY: number
): { x: number; y: number } {
  if (ring === 0) {
    return { x: centerX, y: centerY };
  }

  const count = cellsInRing(ring);
  const angle = (2 * Math.PI * position) / count - Math.PI / 2;
  const radius = ring * CONFIG.HEX_SIZE * 1.8;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

/**
 * Get hex corners for a cell
 */
function getHexCorners(
  cx: number,
  cy: number,
  size: number
): { x: number; y: number }[] {
  const corners: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    corners.push({
      x: cx + size * Math.cos(angle),
      y: cy + size * Math.sin(angle),
    });
  }
  return corners;
}

/**
 * Create hex path string
 */
function hexPath(cx: number, cy: number, size: number): string {
  const corners = getHexCorners(cx, cy, size);
  return (
    corners
      .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
      .join(' ') + ' Z'
  );
}

/**
 * Render the game board
 */
export function renderBoard(
  state: QueensGuardsState,
  onCellClick?: (coord: BoardCoord) => void
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const allowInput = typeof onCellClick === 'function';

  const size = CONFIG.NUM_RINGS * CONFIG.HEX_SIZE * 1.8 * 2 + 100;
  const centerX = size / 2;
  const centerY = size / 2;

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  // Intrinsic size avoids the browser’s 300×150 replaced-element default, which
  // previously shrunk hex cells to ~21px CSS (far under the 44px touch budget).
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('class', 'qg-board');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  markBoardAsGrid(svg);

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', size.toString());
  bg.setAttribute('height', size.toString());
  bg.setAttribute('fill', COLORS.background);
  bg.setAttribute('rx', '12');
  svg.appendChild(bg);

  // Get valid moves for selected piece (normal play) or restore targets
  // Suppress targets while the computer seat thinks (no click handler).
  const restoring = allowInput && state.capturedPieces.length > 0;
  const validMoves: Set<string> = new Set();
  if (restoring) {
    getRestoreTargets(state).forEach((m) =>
      validMoves.add(cellKey(m.ring, m.position))
    );
  } else if (allowInput && state.selectedPiece) {
    const selectedCoord = parseKey(state.selectedPiece);
    const moves = getValidMoves(state, selectedCoord);
    moves.forEach((m) => validMoves.add(cellKey(m.ring, m.position)));
  }

  // Draw cells
  for (const [key, cell] of state.cells) {
    const { x, y } = ringPosToPixel(cell.ring, cell.position, centerX, centerY);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = allowInput ? 'pointer' : 'default';
    g.dataset.cellKey = key;
    g.setAttribute('data-row', String(cell.ring));
    g.setAttribute('data-col', String(cell.position));

    // Determine cell color
    let fillColor = cell.ring % 2 === 0 ? COLORS.cellLight : COLORS.cellDark;
    if (cell.ring === 0) fillColor = COLORS.cellCenter;
    else if (cell.ring === 1) fillColor = COLORS.cellRing1;

    let strokeColor = COLORS.stroke;
    let strokeWidth = 1;

    // Highlight valid moves
    if (validMoves.has(key)) {
      fillColor = COLORS.validMove;
      strokeWidth = 2;
    }

    // Highlight selected piece
    if (state.selectedPiece === key) {
      strokeColor = COLORS.selected;
      strokeWidth = 3;
    }

    // Highlight captured pieces
    if (
      state.capturedPieces.some(
        (c) => c.ring === cell.ring && c.position === cell.position
      )
    ) {
      strokeColor = '#f44336';
      strokeWidth = 3;
    }

    // Draw hex
    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hex.setAttribute('d', hexPath(x, y, CONFIG.HEX_SIZE));
    hex.setAttribute('fill', fillColor);
    hex.setAttribute('stroke', strokeColor);
    hex.setAttribute('stroke-width', strokeWidth.toString());
    g.appendChild(hex);

    // Draw piece if present
    if (cell.piece) {
      const seats = playerColors();
      const pieceColor =
        cell.piece.player === 'player1' ? seats.player1 : seats.player2;
      const pieceSize = CONFIG.HEX_SIZE * 0.6;

      if (cell.piece.type === 'queen') {
        // Queen: larger circle with crown
        const queenBg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        queenBg.setAttribute('cx', x.toString());
        queenBg.setAttribute('cy', y.toString());
        queenBg.setAttribute('r', (pieceSize + 4).toString());
        queenBg.setAttribute('fill', COLORS.queen);
        queenBg.setAttribute('stroke', '#b8860b');
        queenBg.setAttribute('stroke-width', '2');
        g.appendChild(queenBg);

        const queen = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        queen.setAttribute('cx', x.toString());
        queen.setAttribute('cy', y.toString());
        queen.setAttribute('r', pieceSize.toString());
        queen.setAttribute('fill', pieceColor);
        queen.setAttribute('stroke', '#fff');
        queen.setAttribute('stroke-width', '2');
        g.appendChild(queen);

        // Crown symbol
        const crown = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
        crown.setAttribute('x', x.toString());
        crown.setAttribute('y', (y + 5).toString());
        crown.setAttribute('text-anchor', 'middle');
        crown.setAttribute('fill', '#fff');
        crown.setAttribute('font-size', '14');
        crown.setAttribute('font-weight', 'bold');
        crown.textContent = '♛';
        g.appendChild(crown);
      } else {
        // Guard: simple circle
        const guard = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        guard.setAttribute('cx', x.toString());
        guard.setAttribute('cy', y.toString());
        guard.setAttribute('r', pieceSize.toString());
        guard.setAttribute('fill', pieceColor);
        guard.setAttribute('stroke', '#fff');
        guard.setAttribute('stroke-width', '2');
        g.appendChild(guard);

        // Shine effect
        const shine = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'ellipse'
        );
        shine.setAttribute('cx', (x - 4).toString());
        shine.setAttribute('cy', (y - 4).toString());
        shine.setAttribute('rx', '4');
        shine.setAttribute('ry', '3');
        shine.setAttribute('fill', 'rgba(255,255,255,0.3)');
        g.appendChild(shine);
      }
    }

    // Click / keyboard handler (omitted on AI seat)
    const activate = allowInput
      ? () => {
          onCellClick!({ ring: cell.ring, position: cell.position });
        }
      : undefined;
    if (activate) {
      g.addEventListener('click', activate);
    }

    const owner =
      cell.piece?.player === 'player1'
        ? 'Blue'
        : cell.piece?.player === 'player2'
          ? 'Red'
          : undefined;
    const pieceName =
      cell.piece?.type === 'queen'
        ? 'Queen'
        : cell.piece?.type === 'guard'
          ? 'Guard'
          : undefined;
    const isCaptured = state.capturedPieces.some(
      (c) => c.ring === cell.ring && c.position === cell.position
    );
    makeGridCell(
      g,
      buildCellAriaLabel({
        coord: `ring ${cell.ring} pos ${cell.position}`,
        empty: !cell.piece,
        owner,
        piece: pieceName,
        // Keep opening labels stable for handshake pins; AI-seat honesty uses
        // aria-disabled + "not available" extras instead of selectable.
        validMove: validMoves.has(key),
        extras: [
          ...(state.selectedPiece === key ? ['selected'] : []),
          ...(isCaptured ? ['captured'] : []),
          ...(!allowInput ? ['not available'] : []),
        ],
      })
    );
    if (!allowInput) {
      g.setAttribute('aria-disabled', 'true');
    }
    if (activate) {
      bindCellActivateKeys(g, activate);
    }

    // Hover effect
    if (allowInput) {
      g.addEventListener('mouseenter', () => {
        hex.setAttribute('filter', 'brightness(1.1)');
      });
      g.addEventListener('mouseleave', () => {
        hex.removeAttribute('filter');
      });
    }

    svg.appendChild(g);
  }

  bindGridNavigation(svg);
  applyRovingTabindex(collectGridCells(svg));
  return svg;
}

/**
 * Inject CSS styles
 */
export function injectQGStyles(): void {
  const existingStyle = document.getElementById('qg-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'qg-styles';
  style.textContent = `
    /* Pin board CSS width so hex hit areas clear WCAG 2.5.5 (~44px).
       viewBox ≈791 → 660px ⇒ scale≈0.83 ⇒ path ≈46×53. Shell #app is
       ~700px, so allow a short horizontal scroll rather than shrinking cells. */
    .qg-game-area {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      max-width: 100%;
      align-items: stretch;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    /* 2D SVG only — do not pin width on .board-3d-host / .qg-board-3d-host
       or canvas ray-picks (cellToClientPoint) drift under overflow-x. */
    .qg-board-container:not(.board-3d-host) {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      box-sizing: border-box;
      min-width: 660px;
      width: 660px;
      max-width: none;
      margin: 0 auto;
    }

    .qg-board-container:not(.board-3d-host) svg.qg-board,
    .qg-board-container:not(.board-3d-host) svg {
      display: block;
      min-width: 660px;
      width: 660px;
      max-width: none;
      height: auto;
      aspect-ratio: 1;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
    }

    @media (pointer: coarse) {
      .qg-game-area {
        -webkit-overflow-scrolling: touch;
      }
    }

    .qg-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .qg-status.player1 {
      color: var(--color-player1-text, #1d4ed8);
    }

    .qg-status.player2 {
      color: var(--color-player2-text, #b91c1c);
    }

    .qg-info {
      display: flex;
      justify-content: center;
      gap: 2rem;
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .qg-winner-banner {
      text-align: center;
      padding: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
      border-radius: 8px;
      margin: 1rem;
      animation: qg-glow 1s ease-in-out infinite alternate;
    }

    @keyframes qg-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    @media (prefers-reduced-motion: reduce) {
      .qg-winner-banner {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
