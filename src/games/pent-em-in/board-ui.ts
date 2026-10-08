// Pent'Em In Board UI
// Renders the game board, pieces, and piece selector

import {
  PentEmInState,
  BOARD_SIZE,
  getPlayerPieces,
  getPentominoShape,
} from './types';
import {
  getPieceCells,
  canPlacePiece,
  getCurrentOrientationPlacements,
  selectedPieceFitsAnywhere,
} from './rules';
import { Cell } from '../../core/polyomino/types';
import { normalizeCells } from '../../core/polyomino/transform';
import { getPlayerSeatColors } from '../../ui/player-colors';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindCellActivateKeys,
  applyRovingTabindex,
  collectGridCells,
} from '../../ui/board-a11y';

const CELL_SIZE = 36;
const PREVIEW_CELL_SIZE = 16;
const BOARD_PADDING = 20;
const VALID_FILL = 'rgba(76, 175, 80, 0.28)';
const VALID_STROKE = '#4caf50';

function playerColors() {
  return getPlayerSeatColors();
}

// =============================================================================
// Board Rendering
// =============================================================================

export interface PentEmInBoardRenderOptions {
  /** When false, suppress placement/selectable chrome and activate handlers (AI seat). */
  allowInput?: boolean;
}

export function renderBoard(
  state: PentEmInState,
  onCellClick: (cell: Cell) => void,
  onCellHover: (cell: Cell | null) => void,
  options: PentEmInBoardRenderOptions = {}
): SVGElement {
  const allowInput = options.allowInput !== false;
  const width = BOARD_SIZE * CELL_SIZE + BOARD_PADDING * 2;
  const height = BOARD_SIZE * CELL_SIZE + BOARD_PADDING * 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('pent-board');
  markBoardAsGrid(svg);

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  bg.setAttribute('fill', '#f5f5f5');
  svg.appendChild(bg);

  // Grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.classList.add('grid-lines');

  for (let i = 0; i <= BOARD_SIZE; i++) {
    // Horizontal lines
    const hLine = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    hLine.setAttribute('x1', String(BOARD_PADDING));
    hLine.setAttribute('y1', String(BOARD_PADDING + i * CELL_SIZE));
    hLine.setAttribute('x2', String(BOARD_PADDING + BOARD_SIZE * CELL_SIZE));
    hLine.setAttribute('y2', String(BOARD_PADDING + i * CELL_SIZE));
    hLine.setAttribute('stroke', '#bbb');
    hLine.setAttribute('stroke-width', '1');
    gridGroup.appendChild(hLine);

    // Vertical lines
    const vLine = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    vLine.setAttribute('x1', String(BOARD_PADDING + i * CELL_SIZE));
    vLine.setAttribute('y1', String(BOARD_PADDING));
    vLine.setAttribute('x2', String(BOARD_PADDING + i * CELL_SIZE));
    vLine.setAttribute('y2', String(BOARD_PADDING + BOARD_SIZE * CELL_SIZE));
    vLine.setAttribute('stroke', '#bbb');
    vLine.setAttribute('stroke-width', '1');
    gridGroup.appendChild(vLine);
  }
  svg.appendChild(gridGroup);

  // Placed pieces
  const piecesGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  piecesGroup.classList.add('placed-pieces');

  for (const piece of state.placedPieces) {
    const shape = getPentominoShape(piece.shapeId);
    if (!shape) continue;

    for (const cell of piece.cells) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', String(BOARD_PADDING + cell.col * CELL_SIZE + 1));
      rect.setAttribute('y', String(BOARD_PADDING + cell.row * CELL_SIZE + 1));
      rect.setAttribute('width', String(CELL_SIZE - 2));
      rect.setAttribute('height', String(CELL_SIZE - 2));
      rect.setAttribute('fill', playerColors()[piece.player]);
      rect.setAttribute('rx', '3');
      rect.setAttribute('opacity', '0.9');
      piecesGroup.appendChild(rect);

      // Add piece label on first cell
      if (cell === piece.cells[0]) {
        const text = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
        text.setAttribute(
          'x',
          String(BOARD_PADDING + cell.col * CELL_SIZE + CELL_SIZE / 2)
        );
        text.setAttribute(
          'y',
          String(BOARD_PADDING + cell.row * CELL_SIZE + CELL_SIZE / 2 + 4)
        );
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = piece.shapeId;
        piecesGroup.appendChild(text);
      }
    }
  }
  svg.appendChild(piecesGroup);

  const legalAnchors =
    allowInput && state.phase === 'placePiece' && state.selectedPiece
      ? new Set(
          getCurrentOrientationPlacements(state).map((c) => `${c.row},${c.col}`)
        )
      : new Set<string>();

  // Legal placement highlights (visible without hover — critical on tablet)
  if (legalAnchors.size > 0) {
    const validGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    validGroup.classList.add('pent-valid-cells');
    for (const key of legalAnchors) {
      const [r, c] = key.split(',').map(Number);
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', String(BOARD_PADDING + c * CELL_SIZE + 1));
      rect.setAttribute('y', String(BOARD_PADDING + r * CELL_SIZE + 1));
      rect.setAttribute('width', String(CELL_SIZE - 2));
      rect.setAttribute('height', String(CELL_SIZE - 2));
      rect.setAttribute('fill', VALID_FILL);
      rect.setAttribute('stroke', VALID_STROKE);
      rect.setAttribute('stroke-width', '2');
      rect.setAttribute('rx', '3');
      rect.classList.add('pent-cell-valid');
      validGroup.appendChild(rect);
    }
    svg.appendChild(validGroup);
  }

  // Preview layer (patched in place on hover — see patchPentPreview).
  // Omit the group entirely when input is suppressed (AI seat aria honesty).
  if (allowInput) {
    const previewGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    previewGroup.classList.add('preview');
    svg.appendChild(previewGroup);
    fillPentPreviewGroup(previewGroup, state, allowInput);
  }

  // Click/hover areas
  const interactionGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  interactionGroup.classList.add('interaction');

  // Occupancy map for labels (owner of cell if covered by a placed piece)
  const occupancy = new Map<string, 'player1' | 'player2' | null>();
  for (const piece of state.placedPieces) {
    for (const cell of piece.cells) {
      occupancy.set(`${cell.row},${cell.col}`, piece.player);
    }
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', String(BOARD_PADDING + col * CELL_SIZE));
      rect.setAttribute('y', String(BOARD_PADDING + row * CELL_SIZE));
      rect.setAttribute('width', String(CELL_SIZE));
      rect.setAttribute('height', String(CELL_SIZE));
      rect.setAttribute('fill', 'transparent');
      rect.setAttribute('data-row', String(row));
      rect.setAttribute('data-col', String(col));
      // Keep pointer cursor on human turns (legacy overnight aria tests);
      // only flatten during the computer seat.
      rect.style.cursor = allowInput ? 'pointer' : 'default';

      const occupant = occupancy.get(`${row},${col}`) ?? null;
      const owner =
        occupant === 'player1'
          ? 'Blue'
          : occupant === 'player2'
            ? 'Red'
            : undefined;
      const isLegalAnchor = legalAnchors.has(`${row},${col}`);
      makeGridCell(
        rect,
        buildCellAriaLabel({
          coord: `${row},${col}`,
          empty: occupant === null,
          owner,
          validPlacement: isLegalAnchor,
        })
      );

      if (allowInput) {
        const activate = () => onCellClick({ row, col });
        rect.addEventListener('click', activate);
        bindCellActivateKeys(rect, activate);
        rect.addEventListener('mouseenter', () => onCellHover({ row, col }));
        rect.addEventListener('mouseleave', () => onCellHover(null));
      }

      interactionGroup.appendChild(rect);
    }
  }
  svg.appendChild(interactionGroup);
  bindGridNavigation(svg);
  applyRovingTabindex(collectGridCells(svg));

  return svg;
}

function fillPentPreviewGroup(
  previewGroup: SVGGElement,
  state: PentEmInState,
  allowInput: boolean
): void {
  previewGroup.replaceChildren();
  if (!allowInput || !state.selectedPiece || !state.previewPosition) return;

  const previewCells = getPieceCells(
    state.selectedPiece,
    state.previewPosition,
    state.selectedRotation,
    state.selectedFlipped
  );

  const isValid = canPlacePiece(
    state,
    state.selectedPiece,
    state.previewPosition,
    state.selectedRotation,
    state.selectedFlipped
  );

  const fragment = document.createDocumentFragment();
  for (const cell of previewCells) {
    if (
      cell.row < 0 ||
      cell.row >= BOARD_SIZE ||
      cell.col < 0 ||
      cell.col >= BOARD_SIZE
    ) {
      continue;
    }

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(BOARD_PADDING + cell.col * CELL_SIZE + 1));
    rect.setAttribute('y', String(BOARD_PADDING + cell.row * CELL_SIZE + 1));
    rect.setAttribute('width', String(CELL_SIZE - 2));
    rect.setAttribute('height', String(CELL_SIZE - 2));
    rect.setAttribute(
      'fill',
      isValid ? playerColors()[state.currentPlayer] : '#ff5252'
    );
    rect.setAttribute('rx', '3');
    rect.setAttribute('opacity', '0.5');
    fragment.appendChild(rect);
  }
  previewGroup.appendChild(fragment);
}

/**
 * Hover-only: replace the `.preview` group contents without rebuilding the SVG.
 */
export function patchPentPreview(
  svg: SVGElement,
  state: PentEmInState,
  options: PentEmInBoardRenderOptions = {}
): boolean {
  const allowInput = options.allowInput !== false;
  const previewGroup = svg.querySelector('g.preview') as SVGGElement | null;
  if (!previewGroup) return false;
  fillPentPreviewGroup(previewGroup, state, allowInput);
  return true;
}

// =============================================================================
// Piece Selector Rendering
// =============================================================================

export function renderPieceSelector(
  state: PentEmInState,
  onPieceSelect: (shapeId: string) => void,
  options: PentEmInBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'pent-piece-selector';

  const pieces = getPlayerPieces(state, state.currentPlayer);
  const playerColor = playerColors()[state.currentPlayer];

  for (const shapeId of pieces.available) {
    const shape = getPentominoShape(shapeId);
    if (!shape) continue;

    const pieceEl = document.createElement('div');
    const selected = state.selectedPiece === shapeId;
    pieceEl.className = [
      'pent-piece-option',
      selected ? 'selected' : '',
      !allowInput ? 'disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
    pieceEl.setAttribute('data-piece', shapeId);
    pieceEl.style.border = selected
      ? `2px solid ${playerColor}`
      : '2px solid #ddd';

    // Mini SVG preview
    const cells = normalizeCells(shape.cells);
    const maxRow = Math.max(...cells.map((c) => c.row)) + 1;
    const maxCol = Math.max(...cells.map((c) => c.col)) + 1;

    const svgWidth = maxCol * PREVIEW_CELL_SIZE + 4;
    const svgHeight = maxRow * PREVIEW_CELL_SIZE + 4;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(Math.max(svgWidth, 50)));
    svg.setAttribute('height', String(Math.max(svgHeight, 50)));

    for (const cell of cells) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', String(2 + cell.col * PREVIEW_CELL_SIZE));
      rect.setAttribute('y', String(2 + cell.row * PREVIEW_CELL_SIZE));
      rect.setAttribute('width', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('height', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('fill', playerColor);
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
    }

    pieceEl.appendChild(svg);

    // Label
    const label = document.createElement('div');
    label.className = 'pent-piece-label';
    label.textContent = shapeId;
    pieceEl.appendChild(label);

    if (allowInput) {
      pieceEl.addEventListener('click', () => onPieceSelect(shapeId));
      pieceEl.setAttribute('role', 'button');
      pieceEl.setAttribute('tabindex', '0');
      pieceEl.setAttribute('aria-label', `Select ${shapeId} piece`);
    } else {
      pieceEl.setAttribute('aria-disabled', 'true');
      pieceEl.setAttribute('aria-label', `${shapeId} piece`);
    }
    container.appendChild(pieceEl);
  }

  return container;
}

// =============================================================================
// Status and Controls
// =============================================================================

export interface PentEmInPlaceControlHandlers {
  onRotate: () => void;
  onFlip: () => void;
  onCancel: () => void;
}

/**
 * Rotate / flip / choose-another controls for the placePiece phase.
 */
export function renderPlaceControls(
  state: PentEmInState,
  handlers: PentEmInPlaceControlHandlers,
  options: PentEmInBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'pent-place-controls';

  if (!allowInput || state.phase !== 'placePiece' || !state.selectedPiece) {
    return container;
  }

  const shape = getPentominoShape(state.selectedPiece);
  const fitsAnywhere = selectedPieceFitsAnywhere(state);
  const currentFits = getCurrentOrientationPlacements(state).length > 0;

  // Orientation preview so rotate/flip is visible without board hover
  if (shape) {
    const previewWrap = document.createElement('div');
    previewWrap.className = 'pent-current-piece';
    const used = normalizeCells(
      getPieceCells(
        state.selectedPiece,
        { row: 0, col: 0 },
        state.selectedRotation,
        state.selectedFlipped
      )
    );
    const maxRow = Math.max(...used.map((c) => c.row), 0) + 1;
    const maxCol = Math.max(...used.map((c) => c.col), 0) + 1;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'width',
      String(Math.max(maxCol * PREVIEW_CELL_SIZE + 4, 40))
    );
    svg.setAttribute(
      'height',
      String(Math.max(maxRow * PREVIEW_CELL_SIZE + 4, 40))
    );
    svg.setAttribute('aria-hidden', 'true');
    const color = playerColors()[state.currentPlayer];
    for (const cell of used) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', String(2 + cell.col * PREVIEW_CELL_SIZE));
      rect.setAttribute('y', String(2 + cell.row * PREVIEW_CELL_SIZE));
      rect.setAttribute('width', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('height', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
    }
    previewWrap.appendChild(svg);
    container.appendChild(previewWrap);
  }

  const controls = document.createElement('div');
  controls.className = 'pent-controls';

  if (shape?.canRotate) {
    const rotateBtn = document.createElement('button');
    rotateBtn.type = 'button';
    rotateBtn.className = 'pent-btn pent-btn-rotate';
    rotateBtn.textContent = `Rotate (${state.selectedRotation}°)`;
    rotateBtn.addEventListener('click', handlers.onRotate);
    controls.appendChild(rotateBtn);
  }

  if (shape?.canFlip) {
    const flipBtn = document.createElement('button');
    flipBtn.type = 'button';
    flipBtn.className = 'pent-btn pent-btn-flip';
    flipBtn.textContent = state.selectedFlipped ? 'Flipped' : 'Flip';
    flipBtn.addEventListener('click', handlers.onFlip);
    controls.appendChild(flipBtn);
  }

  const otherBtn = document.createElement('button');
  otherBtn.type = 'button';
  // Keep .pent-btn-cancel for legacy overnight selectors; choose-other is the UX label.
  otherBtn.className = 'pent-btn pent-btn-cancel pent-btn-choose-other';
  otherBtn.textContent = fitsAnywhere
    ? 'Choose another piece'
    : "Can't fit — choose another";
  otherBtn.addEventListener('click', handlers.onCancel);
  controls.appendChild(otherBtn);

  container.appendChild(controls);

  const hint = document.createElement('div');
  hint.className = 'pent-instructions pent-place-hint';
  if (!fitsAnywhere) {
    hint.textContent = "This piece doesn't fit anywhere. Choose another piece.";
  } else if (!currentFits) {
    hint.textContent =
      'No green cells at this angle — rotate or flip, or choose another piece.';
  } else {
    hint.textContent =
      'Tap a green cell to place. Rotate or flip to try other angles.';
  }
  container.appendChild(hint);

  return container;
}

export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

export function injectPentEmInStyles(): void {
  if (document.getElementById('pent-em-in-styles')) return;

  const style = document.createElement('style');
  style.id = 'pent-em-in-styles';
  style.textContent = `
    .pent-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .pent-board {
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .pent-piece-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      max-width: 600px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .pent-piece-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pent-piece-option:hover:not(.disabled) {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .pent-piece-option.selected {
      background: #e3f2fd;
    }

    .pent-piece-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pent-piece-label {
      font-size: 12px;
      font-weight: bold;
      color: #666;
      margin-top: 4px;
    }

    .pent-status {
      font-size: 18px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .pent-status.player1 {
      background: #e3f2fd;
      color: var(--color-player1-text, #1d4ed8);
    }

    .pent-status.player2 {
      background: #ffebee;
      color: var(--color-player2-text, #b91c1c);
    }

    [data-opponent="ai"] .pent-status.player2 {
      background: #ede9fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .pent-status.player1 {
      background: #ede9fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .pent-status.player2 {
      background: #ffebee;
    }

    .pent-winner-banner {
      font-size: 24px;
      font-weight: bold;
      padding: 16px 24px;
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #333;
      border-radius: 12px;
      text-align: center;
    }

    .pent-place-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .pent-current-piece {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .pent-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .pent-btn {
      padding: 10px 16px;
      min-height: 44px;
      min-width: 44px;
      font-size: 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pent-btn-rotate {
      background: #7c4dff;
      color: white;
    }

    .pent-btn-flip {
      background: #00bcd4;
      color: white;
    }

    .pent-btn-cancel,
    .pent-btn-choose-other {
      background: #546e7a;
      color: white;
    }

    .pent-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .pent-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pent-instructions {
      font-size: 14px;
      color: #666;
      text-align: center;
      max-width: 400px;
    }

    .pent-place-hint {
      font-weight: 500;
      color: #37474f;
    }

    .pent-cell-valid {
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .pent-btn:hover,
      .pent-piece-option:hover:not(.disabled) {
        transform: none;
      }
    }
  `;
  document.head.appendChild(style);
}
