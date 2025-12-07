// Polyomino UI - Visual Rendering and Interaction
// Renders polyomino shapes, boards, and handles drag-and-drop

import { Cell, PolyominoShape, Rotation, PolyominoRenderConfig } from './types';
import { Board, validatePlacement } from './placement';
import { getTransformedCells, getBoundingBox, getCellsAtPosition } from './transform';

/** Default render configuration */
const DEFAULT_CONFIG: Required<PolyominoRenderConfig> = {
  cellSize: 30,
  padding: 2,
  showGrid: true,
  highlightColor: '#4caf50',
  invalidColor: '#f44336',
};

/**
 * Create SVG element with namespace
 */
function createSVG(width: number, height: number): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  return svg;
}

/**
 * Render a single polyomino shape as an SVG
 */
export function renderPolyomino(
  shape: PolyominoShape,
  rotation: Rotation = 0,
  flipped: boolean = false,
  config: Partial<PolyominoRenderConfig> = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const cells = getTransformedCells(shape, rotation, flipped);
  const bbox = getBoundingBox(cells);

  const width = bbox.width * cfg.cellSize + cfg.padding * 2;
  const height = bbox.height * cfg.cellSize + cfg.padding * 2;

  const svg = createSVG(width, height);
  svg.classList.add('polyomino');
  svg.dataset.shapeId = shape.id;

  // Render each cell
  for (const cell of cells) {
    const x = (cell.col - bbox.minCol) * cfg.cellSize + cfg.padding;
    const y = (cell.row - bbox.minRow) * cfg.cellSize + cfg.padding;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x + 1));
    rect.setAttribute('y', String(y + 1));
    rect.setAttribute('width', String(cfg.cellSize - 2));
    rect.setAttribute('height', String(cfg.cellSize - 2));
    rect.setAttribute('fill', shape.color);
    rect.setAttribute('stroke', darkenColor(shape.color, 0.3));
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '3');

    svg.appendChild(rect);
  }

  return svg;
}

/**
 * Render a board as an SVG
 */
export function renderBoard(
  board: Board,
  shapes: PolyominoShape[],
  config: Partial<PolyominoRenderConfig> = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const width = board.cols * cfg.cellSize + cfg.padding * 2;
  const height = board.rows * cfg.cellSize + cfg.padding * 2;

  const svg = createSVG(width, height);
  svg.classList.add('polyomino-board');

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', '0');
  bg.setAttribute('y', '0');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  bg.setAttribute('fill', '#f5f5f5');
  svg.appendChild(bg);

  // Grid cells
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const x = c * cfg.cellSize + cfg.padding;
      const y = r * cfg.cellSize + cfg.padding;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(cfg.cellSize));
      rect.setAttribute('height', String(cfg.cellSize));
      rect.setAttribute('fill', board.cells[r][c] ? '#e0e0e0' : '#fff');
      rect.setAttribute('stroke', '#ccc');
      rect.setAttribute('stroke-width', '1');
      rect.dataset.row = String(r);
      rect.dataset.col = String(c);

      svg.appendChild(rect);
    }
  }

  // Render placed polyominoes
  for (const placement of board.placements) {
    const shape = shapes.find(s => s.id === placement.shapeId);
    if (!shape) continue;

    const cells = getCellsAtPosition(shape, placement.position, placement.rotation, placement.flipped);

    for (const cell of cells) {
      if (cell.row >= 0 && cell.row < board.rows && cell.col >= 0 && cell.col < board.cols) {
        const x = cell.col * cfg.cellSize + cfg.padding;
        const y = cell.row * cfg.cellSize + cfg.padding;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(x + 1));
        rect.setAttribute('y', String(y + 1));
        rect.setAttribute('width', String(cfg.cellSize - 2));
        rect.setAttribute('height', String(cfg.cellSize - 2));
        rect.setAttribute('fill', shape.color);
        rect.setAttribute('stroke', darkenColor(shape.color, 0.3));
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '3');

        svg.appendChild(rect);
      }
    }
  }

  return svg;
}

/**
 * Render a placement preview (ghost) on the board
 */
export function renderPlacementPreview(
  board: Board,
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation = 0,
  flipped: boolean = false,
  config: Partial<PolyominoRenderConfig> = {}
): SVGGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const cells = getCellsAtPosition(shape, position, rotation, flipped);
  const validation = validatePlacement(board, shape, position, rotation, flipped);

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.classList.add('placement-preview');

  const color = validation.valid ? cfg.highlightColor : cfg.invalidColor;

  for (const cell of cells) {
    const x = cell.col * cfg.cellSize + cfg.padding;
    const y = cell.row * cfg.cellSize + cfg.padding;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x + 2));
    rect.setAttribute('y', String(y + 2));
    rect.setAttribute('width', String(cfg.cellSize - 4));
    rect.setAttribute('height', String(cfg.cellSize - 4));
    rect.setAttribute('fill', color);
    rect.setAttribute('fill-opacity', '0.4');
    rect.setAttribute('stroke', color);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', '4,4');
    rect.setAttribute('rx', '3');

    group.appendChild(rect);
  }

  return group;
}

/**
 * Create a shape selector panel
 */
export function createShapeSelector(
  shapes: PolyominoShape[],
  onSelect: (shape: PolyominoShape) => void,
  config: Partial<PolyominoRenderConfig> = {}
): HTMLElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const container = document.createElement('div');
  container.className = 'shape-selector';
  container.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 8px;
  `;

  for (const shape of shapes) {
    const wrapper = document.createElement('div');
    wrapper.className = 'shape-option';
    wrapper.style.cssText = `
      cursor: pointer;
      padding: 5px;
      border: 2px solid transparent;
      border-radius: 6px;
      transition: all 0.2s;
    `;

    wrapper.addEventListener('mouseenter', () => {
      wrapper.style.borderColor = shape.color;
      wrapper.style.background = '#fff';
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.borderColor = 'transparent';
      wrapper.style.background = 'transparent';
    });

    wrapper.addEventListener('click', () => {
      onSelect(shape);
    });

    const svg = renderPolyomino(shape, 0, false, { ...cfg, cellSize: 20 });
    wrapper.appendChild(svg);

    // Label
    const label = document.createElement('div');
    label.style.cssText = `
      font-size: 11px;
      text-align: center;
      color: #666;
      margin-top: 2px;
    `;
    label.textContent = shape.name;
    wrapper.appendChild(label);

    container.appendChild(wrapper);
  }

  return container;
}

/**
 * Create rotation controls for a shape
 */
export function createRotationControls(
  onRotate: (direction: 'cw' | 'ccw') => void,
  onFlip: () => void,
  canFlip: boolean = true
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'rotation-controls';
  container.style.cssText = `
    display: flex;
    gap: 8px;
    margin: 10px 0;
  `;

  const btnStyle = `
    padding: 8px 16px;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  `;

  const ccwBtn = document.createElement('button');
  ccwBtn.style.cssText = btnStyle;
  ccwBtn.innerHTML = '↺';
  ccwBtn.title = 'Rotate counter-clockwise';
  ccwBtn.addEventListener('click', () => onRotate('ccw'));
  container.appendChild(ccwBtn);

  const cwBtn = document.createElement('button');
  cwBtn.style.cssText = btnStyle;
  cwBtn.innerHTML = '↻';
  cwBtn.title = 'Rotate clockwise';
  cwBtn.addEventListener('click', () => onRotate('cw'));
  container.appendChild(cwBtn);

  if (canFlip) {
    const flipBtn = document.createElement('button');
    flipBtn.style.cssText = btnStyle;
    flipBtn.innerHTML = '⇄';
    flipBtn.title = 'Flip horizontally';
    flipBtn.addEventListener('click', onFlip);
    container.appendChild(flipBtn);
  }

  return container;
}

/**
 * Create an interactive board element with click handling
 */
export function createInteractiveBoard(
  board: Board,
  shapes: PolyominoShape[],
  onCellClick: (cell: Cell) => void,
  onCellHover: (cell: Cell | null) => void,
  config: Partial<PolyominoRenderConfig> = {}
): HTMLElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const container = document.createElement('div');
  container.className = 'interactive-board';
  container.style.cssText = 'position: relative; display: inline-block;';

  const svg = renderBoard(board, shapes, cfg);
  container.appendChild(svg);

  // Add event listeners
  svg.addEventListener('click', (e) => {
    const target = e.target as SVGElement;
    if (target.dataset.row !== undefined && target.dataset.col !== undefined) {
      const cell = {
        row: parseInt(target.dataset.row, 10),
        col: parseInt(target.dataset.col, 10),
      };
      onCellClick(cell);
    }
  });

  svg.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - cfg.padding;
    const y = e.clientY - rect.top - cfg.padding;

    const col = Math.floor(x / cfg.cellSize);
    const row = Math.floor(y / cfg.cellSize);

    if (row >= 0 && row < board.rows && col >= 0 && col < board.cols) {
      onCellHover({ row, col });
    } else {
      onCellHover(null);
    }
  });

  svg.addEventListener('mouseleave', () => {
    onCellHover(null);
  });

  return container;
}

/**
 * Create a draggable shape element
 */
export function createDraggableShape(
  shape: PolyominoShape,
  rotation: Rotation = 0,
  flipped: boolean = false,
  config: Partial<PolyominoRenderConfig> = {}
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'draggable-shape';
  container.draggable = true;
  container.style.cssText = `
    display: inline-block;
    cursor: grab;
    transition: transform 0.1s;
  `;

  container.dataset.shapeId = shape.id;
  container.dataset.rotation = String(rotation);
  container.dataset.flipped = String(flipped);

  const svg = renderPolyomino(shape, rotation, flipped, config);
  container.appendChild(svg);

  // Drag events
  container.addEventListener('dragstart', (e) => {
    container.style.opacity = '0.5';
    e.dataTransfer?.setData('application/json', JSON.stringify({
      shapeId: shape.id,
      rotation,
      flipped,
    }));
  });

  container.addEventListener('dragend', () => {
    container.style.opacity = '1';
  });

  container.addEventListener('mouseenter', () => {
    container.style.transform = 'scale(1.05)';
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = 'scale(1)';
  });

  return container;
}

/**
 * Inject required styles for polyomino components
 */
export function injectPolyominoStyles(): void {
  if (document.getElementById('polyomino-styles')) return;

  const style = document.createElement('style');
  style.id = 'polyomino-styles';
  style.textContent = `
    .polyomino {
      display: inline-block;
    }

    .polyomino-board rect {
      transition: fill 0.15s;
    }

    .polyomino-board rect:hover {
      fill-opacity: 0.8;
    }

    .shape-selector .shape-option:hover {
      transform: translateY(-2px);
    }

    .shape-selector .shape-option.selected {
      border-color: #2196f3 !important;
      background: #e3f2fd !important;
    }

    .draggable-shape:active {
      cursor: grabbing;
    }

    .placement-preview {
      pointer-events: none;
    }

    .rotation-controls button:hover {
      border-color: #2196f3;
      background: #e3f2fd;
    }

    .rotation-controls button:active {
      transform: scale(0.95);
    }

    @keyframes pulse-valid {
      0%, 100% { fill-opacity: 0.3; }
      50% { fill-opacity: 0.6; }
    }

    @keyframes pulse-invalid {
      0%, 100% { fill-opacity: 0.3; stroke-opacity: 0.5; }
      50% { fill-opacity: 0.5; stroke-opacity: 1; }
    }

    .placement-preview.valid rect {
      animation: pulse-valid 0.8s ease-in-out infinite;
    }

    .placement-preview.invalid rect {
      animation: pulse-invalid 0.5s ease-in-out infinite;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * percent));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

/**
 * Get cell from mouse position on board
 */
export function getCellFromMouseEvent(
  e: MouseEvent,
  boardElement: SVGSVGElement,
  config: Partial<PolyominoRenderConfig> = {}
): Cell | null {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const rect = boardElement.getBoundingClientRect();
  const x = e.clientX - rect.left - cfg.padding;
  const y = e.clientY - rect.top - cfg.padding;

  const col = Math.floor(x / cfg.cellSize);
  const row = Math.floor(y / cfg.cellSize);

  if (row < 0 || col < 0) return null;

  return { row, col };
}
