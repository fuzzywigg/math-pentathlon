/**
 * Polyomino UI
 * Visual rendering of polyominoes and placement grids
 */

import type { Cell, Polyomino, PolyominoStyle, PolyominoPlacement } from './types';
import { DEFAULT_POLYOMINO_STYLE, POLYOMINO_COLORS } from './types';
import { getBounds, transformCells, normalizeCells } from './transformations';
import type { PolyominoGrid } from './placement';

/**
 * Render a polyomino as an HTML element
 */
export function renderPolyomino(
  polyomino: Polyomino,
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE
): HTMLElement {
  const cells = normalizeCells(polyomino.cells);
  const bounds = getBounds(cells);

  const container = document.createElement('div');
  container.classList.add('polyomino');
  container.dataset.polyominoId = polyomino.id;
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${bounds.width}, ${style.cellSize}px)`;
  container.style.gridTemplateRows = `repeat(${bounds.height}, ${style.cellSize}px)`;
  container.style.gap = `${style.gap}px`;
  container.style.width = 'fit-content';

  // Create cell lookup
  const cellSet = new Set(cells.map((c) => `${c.row},${c.col}`));

  // Fill grid
  for (let row = 0; row < bounds.height; row++) {
    for (let col = 0; col < bounds.width; col++) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('polyomino-cell');
      cellEl.style.width = `${style.cellSize}px`;
      cellEl.style.height = `${style.cellSize}px`;

      if (cellSet.has(`${row},${col}`)) {
        cellEl.classList.add('filled');
        cellEl.style.backgroundColor = polyomino.color || POLYOMINO_COLORS[polyomino.id] || '#888';
        cellEl.style.border = `${style.borderWidth}px solid ${style.borderColor}`;
        cellEl.style.borderRadius = `${style.borderRadius}px`;
        cellEl.style.boxSizing = 'border-box';
      } else {
        cellEl.classList.add('empty');
        cellEl.style.backgroundColor = 'transparent';
      }

      container.appendChild(cellEl);
    }
  }

  return container;
}

/**
 * Render a polyomino as SVG
 */
export function renderPolyominoSVG(
  polyomino: Polyomino,
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE
): SVGSVGElement {
  const cells = normalizeCells(polyomino.cells);
  const bounds = getBounds(cells);

  const width = bounds.width * style.cellSize + (bounds.width - 1) * style.gap;
  const height = bounds.height * style.cellSize + (bounds.height - 1) * style.gap;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('polyomino-svg');
  svg.dataset.polyominoId = polyomino.id;

  const color = polyomino.color || POLYOMINO_COLORS[polyomino.id] || '#888';

  for (const cell of cells) {
    const x = cell.col * (style.cellSize + style.gap);
    const y = cell.row * (style.cellSize + style.gap);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(style.cellSize));
    rect.setAttribute('height', String(style.cellSize));
    rect.setAttribute('fill', color);
    rect.setAttribute('stroke', style.borderColor);
    rect.setAttribute('stroke-width', String(style.borderWidth));
    rect.setAttribute('rx', String(style.borderRadius));
    rect.setAttribute('ry', String(style.borderRadius));

    svg.appendChild(rect);
  }

  return svg;
}

/**
 * Render a grid with placed polyominoes
 */
export function renderGrid(
  grid: PolyominoGrid,
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE,
  polyominoColors?: Record<string, string>
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('polyomino-grid');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${grid.cols}, ${style.cellSize}px)`;
  container.style.gridTemplateRows = `repeat(${grid.rows}, ${style.cellSize}px)`;
  container.style.gap = `${style.gap}px`;
  container.style.padding = '4px';
  container.style.backgroundColor = '#e0e0e0';
  container.style.borderRadius = `${style.borderRadius}px`;
  container.style.width = 'fit-content';

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const cell = grid.cells[row][col];
      const cellEl = document.createElement('div');
      cellEl.classList.add('grid-cell');
      cellEl.dataset.row = String(row);
      cellEl.dataset.col = String(col);
      cellEl.style.width = `${style.cellSize}px`;
      cellEl.style.height = `${style.cellSize}px`;
      cellEl.style.boxSizing = 'border-box';
      cellEl.style.borderRadius = `${style.borderRadius}px`;

      if (cell.occupied && cell.polyominoId) {
        const color =
          polyominoColors?.[cell.polyominoId] ||
          POLYOMINO_COLORS[cell.polyominoId] ||
          '#888';
        cellEl.classList.add('occupied');
        cellEl.style.backgroundColor = color;
        cellEl.style.border = `${style.borderWidth}px solid ${style.borderColor}`;
      } else {
        cellEl.classList.add('empty');
        cellEl.style.backgroundColor = '#fff';
        cellEl.style.border = '1px solid #ccc';
      }

      container.appendChild(cellEl);
    }
  }

  return container;
}

/**
 * Render placement preview (ghost) on a grid
 */
export function renderPlacementPreview(
  placement: PolyominoPlacement,
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE,
  valid: boolean = true
): HTMLElement {
  const transformedCells = transformCells(
    placement.polyomino.cells,
    placement.rotation,
    placement.flipped
  );
  const bounds = getBounds(transformedCells);

  const container = document.createElement('div');
  container.classList.add('placement-preview');
  container.classList.add(valid ? 'valid' : 'invalid');
  container.style.position = 'absolute';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${bounds.width}, ${style.cellSize}px)`;
  container.style.gridTemplateRows = `repeat(${bounds.height}, ${style.cellSize}px)`;
  container.style.gap = `${style.gap}px`;
  container.style.pointerEvents = 'none';
  container.style.opacity = '0.6';

  // Position on grid
  const left = placement.position.col * (style.cellSize + style.gap);
  const top = placement.position.row * (style.cellSize + style.gap);
  container.style.left = `${left}px`;
  container.style.top = `${top}px`;

  const cellSet = new Set(transformedCells.map((c) => `${c.row},${c.col}`));
  const color = valid ? (placement.polyomino.color || '#4caf50') : '#f44336';

  for (let row = 0; row < bounds.height; row++) {
    for (let col = 0; col < bounds.width; col++) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('preview-cell');
      cellEl.style.width = `${style.cellSize}px`;
      cellEl.style.height = `${style.cellSize}px`;

      if (cellSet.has(`${row},${col}`)) {
        cellEl.classList.add('filled');
        cellEl.style.backgroundColor = color;
        cellEl.style.border = `2px dashed ${style.borderColor}`;
        cellEl.style.borderRadius = `${style.borderRadius}px`;
        cellEl.style.boxSizing = 'border-box';
      } else {
        cellEl.style.backgroundColor = 'transparent';
      }

      container.appendChild(cellEl);
    }
  }

  return container;
}

/**
 * Render a polyomino picker/palette
 */
export function renderPolyominoPalette(
  polyominoes: Polyomino[],
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE,
  onSelect?: (polyomino: Polyomino) => void
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('polyomino-palette');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '12px';
  container.style.padding = '8px';

  for (const polyomino of polyominoes) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('palette-item');
    wrapper.style.cursor = 'pointer';
    wrapper.style.padding = '4px';
    wrapper.style.borderRadius = '4px';
    wrapper.style.border = '2px solid transparent';
    wrapper.style.transition = 'border-color 0.2s';

    wrapper.addEventListener('mouseenter', () => {
      wrapper.style.borderColor = '#2196f3';
    });

    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.borderColor = 'transparent';
    });

    if (onSelect) {
      wrapper.addEventListener('click', () => onSelect(polyomino));
    }

    const polyominoEl = renderPolyomino(polyomino, { ...style, cellSize: 20 });
    wrapper.appendChild(polyominoEl);

    // Add label
    const label = document.createElement('div');
    label.classList.add('polyomino-label');
    label.textContent = polyomino.id;
    label.style.textAlign = 'center';
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.style.marginTop = '4px';
    wrapper.appendChild(label);

    container.appendChild(wrapper);
  }

  return container;
}

/**
 * Create a draggable polyomino element
 */
export function createDraggablePolyomino(
  polyomino: Polyomino,
  style: PolyominoStyle = DEFAULT_POLYOMINO_STYLE
): HTMLElement {
  const element = renderPolyomino(polyomino, style);
  element.classList.add('draggable');
  element.draggable = true;
  element.style.cursor = 'grab';

  element.addEventListener('dragstart', (e) => {
    element.style.cursor = 'grabbing';
    element.style.opacity = '0.5';
    if (e.dataTransfer) {
      e.dataTransfer.setData('polyomino-id', polyomino.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  element.addEventListener('dragend', () => {
    element.style.cursor = 'grab';
    element.style.opacity = '1';
  });

  return element;
}

/**
 * Highlight cells on a grid element
 */
export function highlightCells(
  gridElement: HTMLElement,
  cells: Cell[],
  highlightClass: string = 'highlighted',
  color?: string
): void {
  // Clear existing highlights
  const highlighted = gridElement.querySelectorAll(`.${highlightClass}`);
  highlighted.forEach((el) => {
    el.classList.remove(highlightClass);
    (el as HTMLElement).style.removeProperty('box-shadow');
  });

  // Add new highlights
  for (const cell of cells) {
    const cellEl = gridElement.querySelector(
      `.grid-cell[data-row="${cell.row}"][data-col="${cell.col}"]`
    );
    if (cellEl) {
      cellEl.classList.add(highlightClass);
      if (color) {
        (cellEl as HTMLElement).style.boxShadow = `inset 0 0 0 3px ${color}`;
      }
    }
  }
}

/**
 * Get CSS styles for polyomino UI components
 */
export function getPolyominoStyles(): string {
  return `
    .polyomino {
      transition: transform 0.2s;
    }
    .polyomino:hover {
      transform: scale(1.02);
    }
    .polyomino-cell.filled {
      box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    }
    .polyomino-grid {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .grid-cell {
      transition: background-color 0.15s, box-shadow 0.15s;
    }
    .grid-cell:hover {
      opacity: 0.9;
    }
    .grid-cell.highlighted {
      box-shadow: inset 0 0 0 3px #ffd700;
    }
    .placement-preview {
      pointer-events: none;
    }
    .placement-preview.valid .preview-cell.filled {
      animation: pulse 1s infinite;
    }
    .placement-preview.invalid .preview-cell.filled {
      animation: shake 0.3s;
    }
    .palette-item {
      background: #f5f5f5;
    }
    .palette-item:hover {
      background: #e3f2fd;
    }
    .palette-item.selected {
      border-color: #2196f3 !important;
      background: #e3f2fd;
    }
    .draggable:active {
      cursor: grabbing;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 0.8; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }
  `;
}

/**
 * Inject polyomino styles into document
 */
export function injectPolyominoStyles(): void {
  const styleId = 'polyomino-ui-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = getPolyominoStyles();
  document.head.appendChild(style);
}
