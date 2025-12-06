// Polyomino System Demo Page
// Interactive demo for testing polyomino shapes, rotation, and placement

import {
  PolyominoShape,
  Rotation,
  Cell,
  TETROMINOES,
  PENTOMINOES,
  SIMPLE_SHAPES,
  HEX_PATTERN_BLOCKS,
} from '../core/polyomino/types';
import {
  nextRotation,
  prevRotation,
  getAllOrientations,
  getBoundingBox,
  getTransformedCells,
} from '../core/polyomino/transform';
import {
  Board,
  createBoard,
  validatePlacement,
  placePolyomino,
  removeLastPolyomino,
  findValidPlacements,
  canPlaceShape,
  countEmptyCells,
} from '../core/polyomino/placement';
import {
  renderPolyomino,
  renderBoard,
  createRotationControls,
  injectPolyominoStyles,
} from '../core/polyomino/polyomino-ui';
import { navigate } from '../core/router';

// Demo state
let currentShapeSet: PolyominoShape[] = TETROMINOES;
let selectedShape: PolyominoShape | null = null;
let currentRotation: Rotation = 0;
let isFlipped = false;
let board: Board = createBoard(10, 10);
let hoverCell: Cell | null = null;

export function renderPolyominoDemo(container: HTMLElement): void {
  injectPolyominoStyles();

  container.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Back</button>
      <h1>Polyomino System Demo</h1>
    </header>

    <div class="demo-container">
      <div class="demo-section">
        <h2>Shape Sets</h2>
        <p>Select a polyomino set to explore</p>

        <div class="shape-set-selector">
          <button class="set-btn selected" data-set="tetrominoes">Tetrominoes (4)</button>
          <button class="set-btn" data-set="pentominoes">Pentominoes (5)</button>
          <button class="set-btn" data-set="simple">Simple (1-3)</button>
          <button class="set-btn" data-set="pattern">Pattern Blocks</button>
        </div>

        <div id="shape-gallery" class="shape-gallery"></div>
      </div>

      <div class="demo-section">
        <h2>Shape Rotation & Flip</h2>
        <p>Select a shape and use controls to rotate/flip</p>

        <div class="rotation-demo">
          <div id="selected-shape" class="selected-shape-display">
            <div class="placeholder">Click a shape above to select</div>
          </div>
          <div id="rotation-controls"></div>
          <div id="orientation-count" class="orientation-info"></div>
        </div>

        <div id="all-orientations" class="orientations-gallery"></div>
      </div>

      <div class="demo-section">
        <h2>Placement Demo</h2>
        <p>Click the board to place the selected shape</p>

        <div class="placement-demo">
          <div class="board-controls">
            <button id="clear-board-btn">Clear Board</button>
            <button id="undo-btn">Undo</button>
            <span id="empty-count">Empty: 100</span>
          </div>
          <div class="placement-area">
            <div id="board-container"></div>
            <div id="valid-positions" class="valid-positions-info"></div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Shape Info</h2>
        <div id="shape-info" class="shape-info">
          <p>Select a shape to see details</p>
        </div>
      </div>
    </div>

    <style>
      .demo-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
      }

      .demo-section {
        background: #f9f9f9;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .demo-section h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .demo-section p {
        color: #666;
        margin: 0 0 1rem 0;
      }

      .shape-set-selector {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .set-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      }

      .set-btn:hover {
        border-color: #2196f3;
      }

      .set-btn.selected {
        background: #2196f3;
        border-color: #2196f3;
        color: white;
      }

      .shape-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 8px;
        min-height: 100px;
      }

      .shape-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .shape-item:hover {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      .shape-item.selected {
        background: #bbdefb;
        border-color: #1976d2;
      }

      .shape-item .label {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }

      .rotation-demo {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .selected-shape-display {
        padding: 20px;
        background: white;
        border-radius: 8px;
        min-width: 150px;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .placeholder {
        color: #999;
        font-style: italic;
      }

      .orientation-info {
        font-size: 14px;
        color: #666;
      }

      .orientations-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 8px;
        min-height: 50px;
      }

      .orientation-item {
        padding: 8px;
        background: #f5f5f5;
        border-radius: 6px;
        text-align: center;
      }

      .orientation-item .label {
        font-size: 11px;
        color: #888;
        margin-top: 4px;
      }

      .placement-demo {
        background: white;
        border-radius: 8px;
        padding: 15px;
      }

      .board-controls {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 15px;
      }

      .board-controls button {
        padding: 8px 16px;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
      }

      .board-controls button:hover {
        border-color: #2196f3;
        background: #e3f2fd;
      }

      #empty-count {
        margin-left: auto;
        color: #666;
        font-size: 14px;
      }

      .placement-area {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }

      #board-container {
        position: relative;
      }

      .valid-positions-info {
        font-size: 14px;
        color: #666;
      }

      .shape-info {
        background: white;
        border-radius: 8px;
        padding: 15px;
      }

      .shape-info h3 {
        margin: 0 0 10px 0;
        color: #333;
      }

      .shape-info dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 5px 15px;
        margin: 0;
      }

      .shape-info dt {
        font-weight: 600;
        color: #555;
      }

      .shape-info dd {
        margin: 0;
        color: #666;
      }

      .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      @media (max-width: 600px) {
        .shape-set-selector {
          flex-direction: column;
        }

        .placement-area {
          flex-direction: column;
        }
      }
    </style>
  `;

  // Wire up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('/'));
  }

  // Set up shape set selector
  setupShapeSetSelector();

  // Initial render
  renderShapeGallery();
  renderBoardSection();
}

function setupShapeSetSelector(): void {
  const setBtns = document.querySelectorAll('.set-btn');

  setBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      const setName = (btn as HTMLElement).dataset.set;
      switch (setName) {
        case 'tetrominoes':
          currentShapeSet = TETROMINOES;
          break;
        case 'pentominoes':
          currentShapeSet = PENTOMINOES;
          break;
        case 'simple':
          currentShapeSet = SIMPLE_SHAPES;
          break;
        case 'pattern':
          currentShapeSet = HEX_PATTERN_BLOCKS;
          break;
      }

      selectedShape = null;
      currentRotation = 0;
      isFlipped = false;
      renderShapeGallery();
      updateSelectedShapeDisplay();
      updateShapeInfo();
    });
  });
}

function renderShapeGallery(): void {
  const gallery = document.getElementById('shape-gallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  currentShapeSet.forEach((shape) => {
    const item = document.createElement('div');
    item.className = 'shape-item';
    if (selectedShape?.id === shape.id) {
      item.classList.add('selected');
    }

    const svg = renderPolyomino(shape, 0, false, { cellSize: 20 });
    item.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = shape.name;
    item.appendChild(label);

    item.addEventListener('click', () => {
      selectedShape = shape;
      currentRotation = 0;
      isFlipped = false;
      renderShapeGallery();
      updateSelectedShapeDisplay();
      updateShapeInfo();
      updateValidPositions();
    });

    gallery.appendChild(item);
  });
}

function updateSelectedShapeDisplay(): void {
  const display = document.getElementById('selected-shape');
  const controlsContainer = document.getElementById('rotation-controls');
  const orientationsGallery = document.getElementById('all-orientations');
  const orientationCount = document.getElementById('orientation-count');

  if (!display || !controlsContainer || !orientationsGallery || !orientationCount) return;

  if (!selectedShape) {
    display.innerHTML = '<div class="placeholder">Click a shape above to select</div>';
    controlsContainer.innerHTML = '';
    orientationsGallery.innerHTML = '';
    orientationCount.textContent = '';
    return;
  }

  // Render current orientation
  display.innerHTML = '';
  const svg = renderPolyomino(selectedShape, currentRotation, isFlipped, { cellSize: 30 });
  display.appendChild(svg);

  // Rotation controls
  controlsContainer.innerHTML = '';
  const controls = createRotationControls(
    (dir) => {
      if (dir === 'cw') {
        currentRotation = nextRotation(currentRotation);
      } else {
        currentRotation = prevRotation(currentRotation);
      }
      updateSelectedShapeDisplay();
      updateValidPositions();
    },
    () => {
      isFlipped = !isFlipped;
      updateSelectedShapeDisplay();
      updateValidPositions();
    },
    selectedShape.canFlip
  );
  controlsContainer.appendChild(controls);

  // All unique orientations
  const allOrientations = getAllOrientations(selectedShape);
  orientationCount.textContent = `${allOrientations.length} unique orientation(s)`;

  orientationsGallery.innerHTML = '';
  allOrientations.forEach((cells, i) => {
    const item = document.createElement('div');
    item.className = 'orientation-item';

    // Create mini SVG for this orientation
    const bbox = getBoundingBox(cells);
    const cellSize = 15;
    const width = bbox.width * cellSize + 4;
    const height = bbox.height * cellSize + 4;

    const miniSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    miniSvg.setAttribute('width', String(width));
    miniSvg.setAttribute('height', String(height));
    miniSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    cells.forEach((cell) => {
      const x = (cell.col - bbox.minCol) * cellSize + 2;
      const y = (cell.row - bbox.minRow) * cellSize + 2;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(cellSize - 1));
      rect.setAttribute('height', String(cellSize - 1));
      rect.setAttribute('fill', selectedShape!.color);
      rect.setAttribute('rx', '2');

      miniSvg.appendChild(rect);
    });

    item.appendChild(miniSvg);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = `#${i + 1}`;
    item.appendChild(label);

    orientationsGallery.appendChild(item);
  });
}

function updateShapeInfo(): void {
  const infoContainer = document.getElementById('shape-info');
  if (!infoContainer) return;

  if (!selectedShape) {
    infoContainer.innerHTML = '<p>Select a shape to see details</p>';
    return;
  }

  const orientations = getAllOrientations(selectedShape);

  infoContainer.innerHTML = `
    <h3>${selectedShape.name}</h3>
    <dl>
      <dt>ID</dt>
      <dd>${selectedShape.id}</dd>
      <dt>Size</dt>
      <dd>${selectedShape.size} cell(s)</dd>
      <dt>Can Rotate</dt>
      <dd>${selectedShape.canRotate ? 'Yes' : 'No'}</dd>
      <dt>Can Flip</dt>
      <dd>${selectedShape.canFlip ? 'Yes' : 'No'}</dd>
      <dt>Unique Orientations</dt>
      <dd>${orientations.length}</dd>
      <dt>Color</dt>
      <dd><span style="display: inline-block; width: 20px; height: 20px; background: ${selectedShape.color}; border-radius: 3px; vertical-align: middle;"></span> ${selectedShape.color}</dd>
    </dl>
  `;
}

function renderBoardSection(): void {
  const boardContainer = document.getElementById('board-container');
  const clearBtn = document.getElementById('clear-board-btn');
  const undoBtn = document.getElementById('undo-btn');

  if (!boardContainer) return;

  const container = boardContainer; // Capture for nested functions

  function renderCurrentBoard(): void {
    container.innerHTML = '';

    const svg = renderBoard(board, currentShapeSet, { cellSize: 30 });
    container.appendChild(svg);

    // Add click handlers
    const cells = svg.querySelectorAll('rect[data-row]');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const row = parseInt((cell as SVGElement).dataset.row!, 10);
        const col = parseInt((cell as SVGElement).dataset.col!, 10);
        handleBoardClick({ row, col });
      });

      cell.addEventListener('mouseenter', () => {
        const row = parseInt((cell as SVGElement).dataset.row!, 10);
        const col = parseInt((cell as SVGElement).dataset.col!, 10);
        hoverCell = { row, col };
        updatePreview();
      });
    });

    svg.addEventListener('mouseleave', () => {
      hoverCell = null;
      updatePreview();
    });

    updateEmptyCount();
    updateValidPositions();
  }

  function updatePreview(): void {
    // Remove existing preview
    const existingPreview = container.querySelector('.preview-overlay');
    if (existingPreview) {
      existingPreview.remove();
    }

    if (!hoverCell || !selectedShape) return;

    const validation = validatePlacement(board, selectedShape, hoverCell, currentRotation, isFlipped);
    const cells = getTransformedCells(selectedShape, currentRotation, isFlipped);

    // Create preview SVG
    const previewSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    previewSvg.classList.add('preview-overlay');
    previewSvg.setAttribute('width', String(board.cols * 30 + 4));
    previewSvg.setAttribute('height', String(board.rows * 30 + 4));
    previewSvg.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none;';

    const color = validation.valid ? '#4caf50' : '#f44336';

    cells.forEach((cell) => {
      const x = (hoverCell!.col + cell.col) * 30 + 2;
      const y = (hoverCell!.row + cell.row) * 30 + 2;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x + 3));
      rect.setAttribute('y', String(y + 3));
      rect.setAttribute('width', '24');
      rect.setAttribute('height', '24');
      rect.setAttribute('fill', color);
      rect.setAttribute('fill-opacity', '0.4');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '2');
      rect.setAttribute('stroke-dasharray', '4,4');
      rect.setAttribute('rx', '3');

      previewSvg.appendChild(rect);
    });

    container.appendChild(previewSvg);
  }

  function handleBoardClick(cell: Cell): void {
    if (!selectedShape) return;

    const validation = validatePlacement(board, selectedShape, cell, currentRotation, isFlipped);
    if (validation.valid) {
      board = placePolyomino(board, selectedShape, cell, currentRotation, isFlipped);
      renderCurrentBoard();
    }
  }

  function updateEmptyCount(): void {
    const countEl = document.getElementById('empty-count');
    if (countEl) {
      countEl.textContent = `Empty: ${countEmptyCells(board)}`;
    }
  }

  clearBtn?.addEventListener('click', () => {
    board = createBoard(10, 10);
    renderCurrentBoard();
  });

  undoBtn?.addEventListener('click', () => {
    board = removeLastPolyomino(board, currentShapeSet);
    renderCurrentBoard();
  });

  renderCurrentBoard();
}

function updateValidPositions(): void {
  const positionsInfo = document.getElementById('valid-positions');
  if (!positionsInfo) return;

  if (!selectedShape) {
    positionsInfo.textContent = '';
    return;
  }

  const positions = findValidPlacements(board, selectedShape, currentRotation, isFlipped);
  const canPlace = canPlaceShape(board, selectedShape);

  positionsInfo.innerHTML = `
    <div><strong>Current orientation:</strong> ${positions.length} valid position(s)</div>
    <div><strong>Any orientation:</strong> ${canPlace ? 'Can be placed' : 'Cannot be placed'}</div>
  `;
}
