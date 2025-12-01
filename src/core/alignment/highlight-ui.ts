// Alignment Highlighting UI Utilities

import { GridPosition, AlignmentResult, Region } from './types';

/** Highlight style configuration */
export interface HighlightStyle {
  /** Fill color for highlighted cells */
  fillColor?: string;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Stroke color for outline */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Whether to animate the highlight */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** CSS class to add */
  className?: string;
}

/** Default highlight styles */
export const HIGHLIGHT_STYLES = {
  winning: {
    fillColor: '#4caf50',
    fillOpacity: 0.3,
    strokeColor: '#2e7d32',
    strokeWidth: 3,
    animate: true,
    animationDuration: 1000,
    className: 'highlight-winning',
  } as HighlightStyle,
  selected: {
    fillColor: '#2196f3',
    fillOpacity: 0.2,
    strokeColor: '#1976d2',
    strokeWidth: 2,
    animate: false,
    className: 'highlight-selected',
  } as HighlightStyle,
  threat: {
    fillColor: '#ff9800',
    fillOpacity: 0.25,
    strokeColor: '#f57c00',
    strokeWidth: 2,
    animate: true,
    animationDuration: 500,
    className: 'highlight-threat',
  } as HighlightStyle,
  path: {
    fillColor: '#9c27b0',
    fillOpacity: 0.2,
    strokeColor: '#7b1fa2',
    strokeWidth: 2,
    animate: false,
    className: 'highlight-path',
  } as HighlightStyle,
};

/** Generate CSS for alignment highlights */
export function getHighlightStyles(): string {
  return `
    .alignment-highlight {
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .highlight-winning {
      animation: pulse-win 1s ease-in-out infinite;
    }

    .highlight-threat {
      animation: pulse-threat 0.5s ease-in-out infinite;
    }

    @keyframes pulse-win {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.02);
      }
    }

    @keyframes pulse-threat {
      0%, 100% {
        opacity: 0.25;
      }
      50% {
        opacity: 0.5;
      }
    }

    .highlight-line {
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .highlight-line.animated {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw-line 0.5s ease-out forwards;
    }

    @keyframes draw-line {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
}

/**
 * Create SVG highlight overlay for a list of positions
 * @param positions - Grid positions to highlight
 * @param cellToPixel - Function to convert grid position to pixel coordinates
 * @param cellSize - Size of each cell
 * @param style - Highlight style configuration
 */
export function createHighlightOverlay(
  positions: GridPosition[],
  cellToPixel: (row: number, col: number) => { x: number; y: number },
  cellSize: { width: number; height: number },
  style: HighlightStyle = HIGHLIGHT_STYLES.selected
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', `alignment-highlight ${style.className || ''}`);

  for (const pos of positions) {
    const { x, y } = cellToPixel(pos.row, pos.col);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x - cellSize.width / 2));
    rect.setAttribute('y', String(y - cellSize.height / 2));
    rect.setAttribute('width', String(cellSize.width));
    rect.setAttribute('height', String(cellSize.height));
    rect.setAttribute('fill', style.fillColor || 'transparent');
    rect.setAttribute('fill-opacity', String(style.fillOpacity || 0.2));
    rect.setAttribute('stroke', style.strokeColor || 'transparent');
    rect.setAttribute('stroke-width', String(style.strokeWidth || 0));
    rect.setAttribute('rx', '4');
    rect.setAttribute('ry', '4');

    group.appendChild(rect);
  }

  return group;
}

/**
 * Create SVG line connecting alignment positions
 */
export function createAlignmentLine(
  alignment: AlignmentResult,
  cellToPixel: (row: number, col: number) => { x: number; y: number },
  style: HighlightStyle = HIGHLIGHT_STYLES.winning
): SVGLineElement {
  const startPixel = cellToPixel(alignment.start.row, alignment.start.col);
  const endPixel = cellToPixel(alignment.end.row, alignment.end.col);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', String(startPixel.x));
  line.setAttribute('y1', String(startPixel.y));
  line.setAttribute('x2', String(endPixel.x));
  line.setAttribute('y2', String(endPixel.y));
  line.setAttribute('stroke', style.strokeColor || '#4caf50');
  line.setAttribute('stroke-width', String((style.strokeWidth || 2) * 2));
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('class', `highlight-line ${style.animate ? 'animated' : ''}`);

  return line;
}

/**
 * Create a complete highlight group for an alignment result
 */
export function createAlignmentHighlight(
  alignment: AlignmentResult,
  cellToPixel: (row: number, col: number) => { x: number; y: number },
  cellSize: { width: number; height: number },
  style: HighlightStyle = HIGHLIGHT_STYLES.winning
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', `alignment-highlight ${style.className || ''}`);

  // Add cell highlights
  const cellHighlights = createHighlightOverlay(
    alignment.positions,
    cellToPixel,
    cellSize,
    style
  );
  group.appendChild(cellHighlights);

  // Add connecting line
  const line = createAlignmentLine(alignment, cellToPixel, style);
  group.appendChild(line);

  return group;
}

/**
 * Create highlight for a region (contiguous cells)
 */
export function createRegionHighlight(
  region: Region,
  cellToPixel: (row: number, col: number) => { x: number; y: number },
  cellSize: { width: number; height: number },
  style: HighlightStyle = HIGHLIGHT_STYLES.path
): SVGGElement {
  return createHighlightOverlay(region.positions, cellToPixel, cellSize, style);
}

/**
 * Create path highlight connecting positions in order
 */
export function createPathHighlight(
  path: GridPosition[],
  cellToPixel: (row: number, col: number) => { x: number; y: number },
  style: HighlightStyle = HIGHLIGHT_STYLES.path
): SVGPathElement {
  if (path.length < 2) {
    const emptyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    emptyPath.setAttribute('d', '');
    return emptyPath;
  }

  const points = path.map(pos => cellToPixel(pos.row, pos.col));
  const pathData = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', pathData);
  pathElement.setAttribute('stroke', style.strokeColor || '#9c27b0');
  pathElement.setAttribute('stroke-width', String(style.strokeWidth || 2));
  pathElement.setAttribute('fill', 'none');
  pathElement.setAttribute('stroke-linecap', 'round');
  pathElement.setAttribute('stroke-linejoin', 'round');
  pathElement.setAttribute('class', `highlight-line ${style.animate ? 'animated' : ''} ${style.className || ''}`);

  return pathElement;
}

/**
 * Add data attributes to cell elements for CSS-based highlighting
 */
export function markCellsForHighlight(
  container: HTMLElement,
  positions: GridPosition[],
  highlightClass: string,
  cellSelector: (row: number, col: number) => string = (r, c) => `[data-row="${r}"][data-col="${c}"]`
): void {
  // Remove existing highlights
  container.querySelectorAll(`.${highlightClass}`).forEach(el => {
    el.classList.remove(highlightClass);
  });

  // Add highlights to specified positions
  for (const pos of positions) {
    const selector = cellSelector(pos.row, pos.col);
    const cell = container.querySelector(selector);
    if (cell) {
      cell.classList.add(highlightClass);
    }
  }
}

/**
 * Clear all highlights from a container
 */
export function clearHighlights(
  container: HTMLElement,
  highlightClasses: string[] = ['highlight-winning', 'highlight-selected', 'highlight-threat', 'highlight-path']
): void {
  for (const className of highlightClasses) {
    container.querySelectorAll(`.${className}`).forEach(el => {
      el.classList.remove(className);
    });
  }

  // Also remove SVG highlight groups
  container.querySelectorAll('.alignment-highlight').forEach(el => {
    el.remove();
  });
}

/**
 * Inject highlight styles into the document
 */
export function injectHighlightStyles(): void {
  const styleId = 'alignment-highlight-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = getHighlightStyles();
    document.head.appendChild(style);
  }
}
