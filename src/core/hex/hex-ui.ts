// Hex Rendering UI
// SVG-based hex grid rendering utilities

import { AxialCoord, HexLayout, PixelCoord, coordKey } from './types';
import { axialToPixel, hexesInRange } from './coordinates';

// =============================================================================
// Style Injection
// =============================================================================

let stylesInjected = false;

export function injectHexStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .hex-cell {
      transition: fill 0.15s, stroke 0.15s, transform 0.15s;
      cursor: pointer;
    }

    .hex-cell:hover {
      filter: brightness(1.1);
    }

    .hex-cell.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .hex-cell.selected {
      stroke-width: 3;
      filter: drop-shadow(0 0 4px rgba(0,0,0,0.3));
    }

    .hex-cell.highlighted {
      animation: hex-pulse 0.6s ease-in-out infinite alternate;
    }

    @keyframes hex-pulse {
      from { filter: brightness(1); }
      to { filter: brightness(1.2); }
    }

    .hex-label {
      pointer-events: none;
      user-select: none;
      font-family: sans-serif;
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// Hex Shape Generation
// =============================================================================

/**
 * Get the 6 corner points of a hex at given center
 */
export function getHexCorners(center: PixelCoord, size: number, flat: boolean = false): PixelCoord[] {
  const corners: PixelCoord[] = [];
  const startAngle = flat ? 0 : 30;

  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i + startAngle;
    const angleRad = (Math.PI / 180) * angleDeg;
    corners.push({
      x: center.x + size * Math.cos(angleRad),
      y: center.y + size * Math.sin(angleRad),
    });
  }

  return corners;
}

/**
 * Create SVG path string for a hex
 */
export function hexPath(center: PixelCoord, size: number, flat: boolean = false): string {
  const corners = getHexCorners(center, size, flat);
  const path = corners.map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`)).join(' ');
  return path + ' Z';
}

// =============================================================================
// Individual Hex Rendering
// =============================================================================

export interface HexRenderOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  label?: string;
  labelColor?: string;
  labelSize?: number;
  className?: string;
  onClick?: (coord: AxialCoord) => void;
  onHover?: (coord: AxialCoord, entering: boolean) => void;
}

/**
 * Render a single hex cell as SVG group
 */
export function renderHex(
  coord: AxialCoord,
  layout: HexLayout,
  options: HexRenderOptions = {}
): SVGGElement {
  const {
    fill = '#e0e0e0',
    stroke = '#999',
    strokeWidth = 1,
    label,
    labelColor = '#333',
    labelSize = 12,
    className = '',
    onClick,
    onHover,
  } = options;

  const center = axialToPixel(coord, layout);
  const flat = layout.orientation === 'flat';

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', `hex-cell ${className}`.trim());
  g.dataset.coord = coordKey(coord);

  // Hex polygon
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', hexPath(center, layout.size, flat));
  path.setAttribute('fill', fill);
  path.setAttribute('stroke', stroke);
  path.setAttribute('stroke-width', strokeWidth.toString());
  g.appendChild(path);

  // Label
  if (label) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', center.x.toString());
    text.setAttribute('y', (center.y + labelSize / 3).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', labelColor);
    text.setAttribute('font-size', labelSize.toString());
    text.setAttribute('class', 'hex-label');
    text.textContent = label;
    g.appendChild(text);
  }

  // Event handlers
  if (onClick) {
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => onClick(coord));
  }

  if (onHover) {
    g.addEventListener('mouseenter', () => onHover(coord, true));
    g.addEventListener('mouseleave', () => onHover(coord, false));
  }

  return g;
}

// =============================================================================
// Grid Rendering
// =============================================================================

export interface HexGridRenderOptions {
  getCellOptions?: (coord: AxialCoord) => HexRenderOptions;
  showCoords?: boolean;
  background?: string;
  padding?: number;
}

/**
 * Render a hex grid (hexagonal shape)
 */
export function renderHexGrid(
  radius: number,
  layout: HexLayout,
  options: HexGridRenderOptions = {}
): SVGSVGElement {
  const { getCellOptions, showCoords = false, background, padding = 20 } = options;

  const hexes = hexesInRange({ q: 0, r: 0 }, radius);

  // Calculate bounds
  const positions = hexes.map((h) => axialToPixel(h, layout));
  const minX = Math.min(...positions.map((p) => p.x)) - layout.size - padding;
  const maxX = Math.max(...positions.map((p) => p.x)) + layout.size + padding;
  const minY = Math.min(...positions.map((p) => p.y)) - layout.size - padding;
  const maxY = Math.max(...positions.map((p) => p.y)) + layout.size + padding;

  const width = maxX - minX;
  const height = maxY - minY;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());

  // Background
  if (background) {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', minX.toString());
    bg.setAttribute('y', minY.toString());
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', background);
    svg.appendChild(bg);
  }

  // Render each hex
  for (const coord of hexes) {
    const cellOptions = getCellOptions?.(coord) ?? {};

    if (showCoords && !cellOptions.label) {
      cellOptions.label = `${coord.q},${coord.r}`;
      cellOptions.labelSize = 8;
      cellOptions.labelColor = '#666';
    }

    svg.appendChild(renderHex(coord, layout, cellOptions));
  }

  return svg;
}

/**
 * Render a rectangular hex grid
 */
export function renderRectHexGrid(
  cols: number,
  rows: number,
  layout: HexLayout,
  options: HexGridRenderOptions = {}
): SVGSVGElement {
  const { getCellOptions, showCoords = false, background, padding = 20 } = options;

  // Generate hex coordinates for rectangular grid
  const hexes: AxialCoord[] = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      // Offset coordinates to axial
      const offset = col & 1;
      const q = col;
      const r = row - Math.floor((col + offset) / 2);
      hexes.push({ q, r });
    }
  }

  // Calculate bounds
  const positions = hexes.map((h) => axialToPixel(h, layout));
  const minX = Math.min(...positions.map((p) => p.x)) - layout.size - padding;
  const maxX = Math.max(...positions.map((p) => p.x)) + layout.size + padding;
  const minY = Math.min(...positions.map((p) => p.y)) - layout.size - padding;
  const maxY = Math.max(...positions.map((p) => p.y)) + layout.size + padding;

  const width = maxX - minX;
  const height = maxY - minY;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());

  // Background
  if (background) {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', minX.toString());
    bg.setAttribute('y', minY.toString());
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', background);
    svg.appendChild(bg);
  }

  // Render each hex
  for (const coord of hexes) {
    const cellOptions = getCellOptions?.(coord) ?? {};

    if (showCoords && !cellOptions.label) {
      cellOptions.label = `${coord.q},${coord.r}`;
      cellOptions.labelSize = 8;
      cellOptions.labelColor = '#666';
    }

    svg.appendChild(renderHex(coord, layout, cellOptions));
  }

  return svg;
}

// =============================================================================
// Interactive Hex Grid
// =============================================================================

export interface InteractiveHexOptions extends HexGridRenderOptions {
  onCellClick?: (coord: AxialCoord) => void;
  onCellHover?: (coord: AxialCoord | null) => void;
}

/**
 * Create an interactive hex grid
 */
export function createInteractiveHexGrid(
  container: HTMLElement,
  radius: number,
  layout: HexLayout,
  options: InteractiveHexOptions = {}
): {
  update: (getCellOptions: (coord: AxialCoord) => HexRenderOptions) => void;
  getHoveredCell: () => AxialCoord | null;
} {
  injectHexStyles();

  let hoveredCell: AxialCoord | null = null;
  let currentGetCellOptions = options.getCellOptions;

  function render(): void {
    container.innerHTML = '';

    const wrappedGetCellOptions = (coord: AxialCoord): HexRenderOptions => {
      const baseOptions = currentGetCellOptions?.(coord) ?? {};

      return {
        ...baseOptions,
        onClick: options.onCellClick
          ? () => options.onCellClick!(coord)
          : baseOptions.onClick,
        onHover: (c, entering) => {
          hoveredCell = entering ? c : null;
          options.onCellHover?.(hoveredCell);
        },
      };
    };

    const svg = renderHexGrid(radius, layout, {
      ...options,
      getCellOptions: wrappedGetCellOptions,
    });

    container.appendChild(svg);
  }

  render();

  return {
    update: (getCellOptions) => {
      currentGetCellOptions = getCellOptions;
      render();
    },
    getHoveredCell: () => hoveredCell,
  };
}

// =============================================================================
// Triangular Subdivision
// =============================================================================

/**
 * Get the 6 triangular sub-cells within a hex
 * Returns pixel coordinates for each triangle's center
 */
export function getHexTriangles(center: PixelCoord, size: number, flat: boolean = false): PixelCoord[] {
  const corners = getHexCorners(center, size, flat);
  const triangles: PixelCoord[] = [];

  // Each triangle is formed by center + two adjacent corners
  for (let i = 0; i < 6; i++) {
    const c1 = corners[i];
    const c2 = corners[(i + 1) % 6];
    // Triangle centroid
    triangles.push({
      x: (center.x + c1.x + c2.x) / 3,
      y: (center.y + c1.y + c2.y) / 3,
    });
  }

  return triangles;
}

/**
 * Render a hex with triangular subdivision
 */
export function renderHexWithTriangles(
  coord: AxialCoord,
  layout: HexLayout,
  getTriangleOptions?: (hexCoord: AxialCoord, triangleIndex: number) => {
    fill?: string;
    onClick?: () => void;
  }
): SVGGElement {
  const center = axialToPixel(coord, layout);
  const flat = layout.orientation === 'flat';
  const corners = getHexCorners(center, layout.size, flat);

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.dataset.coord = coordKey(coord);

  // Draw each triangle
  for (let i = 0; i < 6; i++) {
    const c1 = corners[i];
    const c2 = corners[(i + 1) % 6];

    const options = getTriangleOptions?.(coord, i) ?? {};

    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    triangle.setAttribute(
      'd',
      `M ${center.x} ${center.y} L ${c1.x} ${c1.y} L ${c2.x} ${c2.y} Z`
    );
    triangle.setAttribute('fill', options.fill ?? '#e0e0e0');
    triangle.setAttribute('stroke', '#999');
    triangle.setAttribute('stroke-width', '0.5');
    triangle.setAttribute('class', 'hex-triangle');

    if (options.onClick) {
      triangle.style.cursor = 'pointer';
      triangle.addEventListener('click', options.onClick);
    }

    g.appendChild(triangle);
  }

  return g;
}
