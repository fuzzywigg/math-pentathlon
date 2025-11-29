/**
 * Alignment Highlight UI
 * Visual highlighting utilities for alignments and regions
 */

import type { Position, HighlightStyle, AlignmentResult, ContiguousRegion } from './types';
import { DEFAULT_HIGHLIGHT_STYLES } from './types';

/**
 * Generate CSS class name for a highlight style
 */
export function getHighlightClassName(styleName: string): string {
  return `alignment-highlight-${styleName}`;
}

/**
 * Generate CSS for highlight styles
 */
export function generateHighlightCSS(
  styles: Record<string, HighlightStyle> = DEFAULT_HIGHLIGHT_STYLES
): string {
  let css = '';

  for (const [name, style] of Object.entries(styles)) {
    const className = getHighlightClassName(name);
    const opacity = style.opacity ?? 0.5;
    const borderWidth = style.borderWidth ?? 2;

    css += `
      .${className} {
        background-color: ${style.color} !important;
        opacity: ${opacity};
        box-shadow: inset 0 0 0 ${borderWidth}px ${style.color};
      }
    `;

    if (style.pulseAnimation) {
      css += `
        .${className} {
          animation: ${className}-pulse 1s ease-in-out infinite;
        }

        @keyframes ${className}-pulse {
          0%, 100% {
            opacity: ${opacity};
            box-shadow: inset 0 0 0 ${borderWidth}px ${style.color};
          }
          50% {
            opacity: ${Math.min(1, opacity + 0.2)};
            box-shadow: inset 0 0 0 ${borderWidth + 2}px ${style.color};
          }
        }
      `;
    }
  }

  return css;
}

/**
 * Inject highlight CSS styles into document
 */
export function injectHighlightStyles(
  styles: Record<string, HighlightStyle> = DEFAULT_HIGHLIGHT_STYLES
): void {
  const styleId = 'alignment-highlight-styles';
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = generateHighlightCSS(styles);
  document.head.appendChild(styleElement);
}

/**
 * Apply highlight to cells by selector
 */
export function highlightCells(
  container: HTMLElement,
  positions: Position[],
  styleName: string,
  cellSelector: (pos: Position) => string = (pos) => `[data-row="${pos.row}"][data-col="${pos.col}"]`
): HTMLElement[] {
  const className = getHighlightClassName(styleName);
  const elements: HTMLElement[] = [];

  for (const pos of positions) {
    const selector = cellSelector(pos);
    const cell = container.querySelector(selector) as HTMLElement | null;

    if (cell) {
      cell.classList.add(className);
      elements.push(cell);
    }
  }

  return elements;
}

/**
 * Remove highlight from cells
 */
export function removeHighlight(
  container: HTMLElement,
  positions: Position[],
  styleName: string,
  cellSelector: (pos: Position) => string = (pos) => `[data-row="${pos.row}"][data-col="${pos.col}"]`
): void {
  const className = getHighlightClassName(styleName);

  for (const pos of positions) {
    const selector = cellSelector(pos);
    const cell = container.querySelector(selector);

    if (cell) {
      cell.classList.remove(className);
    }
  }
}

/**
 * Remove all highlights of a specific style
 */
export function removeAllHighlights(container: HTMLElement, styleName: string): void {
  const className = getHighlightClassName(styleName);
  const elements = container.querySelectorAll(`.${className}`);

  elements.forEach((el) => el.classList.remove(className));
}

/**
 * Remove all alignment highlights
 */
export function clearAllHighlights(
  container: HTMLElement,
  styles: Record<string, HighlightStyle> = DEFAULT_HIGHLIGHT_STYLES
): void {
  for (const name of Object.keys(styles)) {
    removeAllHighlights(container, name);
  }
}

/**
 * Highlight an alignment result
 */
export function highlightAlignment(
  container: HTMLElement,
  alignment: AlignmentResult,
  styleName: string = 'winning',
  cellSelector?: (pos: Position) => string
): HTMLElement[] {
  return highlightCells(container, alignment.positions, styleName, cellSelector);
}

/**
 * Highlight a contiguous region
 */
export function highlightRegion(
  container: HTMLElement,
  region: ContiguousRegion,
  styleName: string = 'selected',
  cellSelector?: (pos: Position) => string
): HTMLElement[] {
  return highlightCells(container, region.positions, styleName, cellSelector);
}

/**
 * Create a temporary highlight that auto-removes
 */
export function flashHighlight(
  container: HTMLElement,
  positions: Position[],
  styleName: string,
  duration: number = 1000,
  cellSelector?: (pos: Position) => string
): Promise<void> {
  const elements = highlightCells(container, positions, styleName, cellSelector);

  return new Promise((resolve) => {
    setTimeout(() => {
      const className = getHighlightClassName(styleName);
      elements.forEach((el) => el.classList.remove(className));
      resolve();
    }, duration);
  });
}

/**
 * Animate highlighting positions one by one
 */
export async function animateHighlight(
  container: HTMLElement,
  positions: Position[],
  styleName: string,
  delayPerCell: number = 100,
  cellSelector?: (pos: Position) => string
): Promise<HTMLElement[]> {
  const elements: HTMLElement[] = [];
  const className = getHighlightClassName(styleName);

  for (const pos of positions) {
    const selector = cellSelector
      ? cellSelector(pos)
      : `[data-row="${pos.row}"][data-col="${pos.col}"]`;
    const cell = container.querySelector(selector) as HTMLElement | null;

    if (cell) {
      cell.classList.add(className);
      elements.push(cell);
    }

    await new Promise((resolve) => setTimeout(resolve, delayPerCell));
  }

  return elements;
}

/**
 * Create an SVG overlay for highlighting (for non-cell-based grids)
 */
export function createHighlightOverlay(
  positions: Position[],
  cellSize: number,
  style: HighlightStyle,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('alignment-highlight-overlay');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.pointerEvents = 'none';

  // Calculate bounds
  if (positions.length === 0) return svg;

  const minRow = Math.min(...positions.map((p) => p.row));
  const maxRow = Math.max(...positions.map((p) => p.row));
  const minCol = Math.min(...positions.map((p) => p.col));
  const maxCol = Math.max(...positions.map((p) => p.col));

  const width = (maxCol - minCol + 1) * cellSize;
  const height = (maxRow - minRow + 1) * cellSize;

  svg.setAttribute('width', String(width + offset.x));
  svg.setAttribute('height', String(height + offset.y));

  // Create highlight rectangles
  for (const pos of positions) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String((pos.col - minCol) * cellSize + offset.x));
    rect.setAttribute('y', String((pos.row - minRow) * cellSize + offset.y));
    rect.setAttribute('width', String(cellSize));
    rect.setAttribute('height', String(cellSize));
    rect.setAttribute('fill', style.color);
    rect.setAttribute('fill-opacity', String(style.opacity ?? 0.5));
    rect.setAttribute('stroke', style.color);
    rect.setAttribute('stroke-width', String(style.borderWidth ?? 2));

    if (style.pulseAnimation) {
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'fill-opacity');
      animate.setAttribute('values', `${style.opacity ?? 0.5};${(style.opacity ?? 0.5) + 0.2};${style.opacity ?? 0.5}`);
      animate.setAttribute('dur', '1s');
      animate.setAttribute('repeatCount', 'indefinite');
      rect.appendChild(animate);
    }

    svg.appendChild(rect);
  }

  return svg;
}

/**
 * Draw a line connecting alignment positions (for visual feedback)
 */
export function createAlignmentLine(
  positions: Position[],
  cellSize: number,
  color: string = '#4caf50',
  strokeWidth: number = 4,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('alignment-line-overlay');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.pointerEvents = 'none';
  svg.style.overflow = 'visible';

  if (positions.length < 2) return svg;

  // Create path through cell centers
  const halfCell = cellSize / 2;
  let pathD = `M ${positions[0].col * cellSize + halfCell + offset.x} ${positions[0].row * cellSize + halfCell + offset.y}`;

  for (let i = 1; i < positions.length; i++) {
    pathD += ` L ${positions[i].col * cellSize + halfCell + offset.x} ${positions[i].row * cellSize + halfCell + offset.y}`;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', String(strokeWidth));
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('fill', 'none');

  svg.appendChild(path);

  return svg;
}
