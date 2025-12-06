// Attribute UI - Visual rendering of attribute pieces and cards
// SVG-based rendering for attribute-based game elements

import {
  AttributePiece,
  AttributeDefinition,
  AttributeRenderConfig,
  getAttributeColor,
} from './types';

/** Default render configuration */
const DEFAULT_CONFIG: AttributeRenderConfig = {
  pieceSize: 80,
  showLabels: true,
  labelPosition: 'below',
  shape: 'card',
};

/**
 * Render a single attribute piece as SVG
 */
export function renderAttributePiece(
  piece: AttributePiece,
  definitions: AttributeDefinition[],
  config: Partial<AttributeRenderConfig> = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const size = cfg.pieceSize;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size + (cfg.showLabels && cfg.labelPosition === 'below' ? 20 : 0)));
  svg.setAttribute('viewBox', `0 0 ${size} ${size + (cfg.showLabels && cfg.labelPosition === 'below' ? 20 : 0)}`);
  svg.classList.add('attribute-piece');
  svg.dataset.pieceId = piece.id;

  // Get colors from attributes
  let bgColor = '#e0e0e0';
  let shapeColor = '#666';

  for (const def of definitions) {
    const value = piece.attributes[def.name];
    const color = getAttributeColor(definitions, def.name, value);
    if (color) {
      if (def.name === 'color' || def.name.includes('color')) {
        bgColor = color;
      } else {
        shapeColor = color;
      }
    }
  }

  // Render based on shape type
  switch (cfg.shape) {
    case 'card':
      renderCard(svg, size, bgColor, piece, definitions, cfg);
      break;
    case 'circle':
      renderCircle(svg, size, bgColor, shapeColor, piece, definitions);
      break;
    case 'square':
      renderSquare(svg, size, bgColor, piece, definitions, cfg);
      break;
    default:
      renderCard(svg, size, bgColor, piece, definitions, cfg);
  }

  return svg;
}

function renderCard(
  svg: SVGSVGElement,
  size: number,
  bgColor: string,
  piece: AttributePiece,
  definitions: AttributeDefinition[],
  cfg: AttributeRenderConfig
): void {
  // Card background
  const card = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  card.setAttribute('x', '2');
  card.setAttribute('y', '2');
  card.setAttribute('width', String(size - 4));
  card.setAttribute('height', String(size - 4));
  card.setAttribute('rx', '8');
  card.setAttribute('fill', bgColor);
  card.setAttribute('stroke', '#333');
  card.setAttribute('stroke-width', '2');
  svg.appendChild(card);

  // Display primary attribute value in center
  const primaryAttr = definitions[0];
  if (primaryAttr) {
    const value = piece.attributes[primaryAttr.name];

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(size / 2));
    text.setAttribute('y', String(size / 2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', String(size / 3));
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', getContrastColor(bgColor));
    text.textContent = String(value);
    svg.appendChild(text);
  }

  // Add labels below if configured
  if (cfg.showLabels && cfg.labelPosition === 'below') {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(size / 2));
    label.setAttribute('y', String(size + 14));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '11');
    label.setAttribute('fill', '#666');

    const labelParts: string[] = [];
    for (const def of definitions.slice(1, 3)) {
      const value = piece.attributes[def.name];
      if (value !== undefined) {
        labelParts.push(String(value));
      }
    }
    label.textContent = labelParts.join(' | ');
    svg.appendChild(label);
  }
}

function renderCircle(
  svg: SVGSVGElement,
  size: number,
  bgColor: string,
  shapeColor: string,
  piece: AttributePiece,
  definitions: AttributeDefinition[]
): void {
  const center = size / 2;
  const radius = size / 2 - 4;

  // Circle background
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(center));
  circle.setAttribute('cy', String(center));
  circle.setAttribute('r', String(radius));
  circle.setAttribute('fill', bgColor);
  circle.setAttribute('stroke', shapeColor);
  circle.setAttribute('stroke-width', '3');
  svg.appendChild(circle);

  // Value in center
  const primaryAttr = definitions[0];
  if (primaryAttr) {
    const value = piece.attributes[primaryAttr.name];

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(center));
    text.setAttribute('y', String(center));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', String(size / 3));
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', getContrastColor(bgColor));
    text.textContent = String(value);
    svg.appendChild(text);
  }
}

function renderSquare(
  svg: SVGSVGElement,
  size: number,
  bgColor: string,
  piece: AttributePiece,
  definitions: AttributeDefinition[],
  cfg: AttributeRenderConfig
): void {
  // Square background
  const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  square.setAttribute('x', '4');
  square.setAttribute('y', '4');
  square.setAttribute('width', String(size - 8));
  square.setAttribute('height', String(size - 8));
  square.setAttribute('fill', bgColor);
  square.setAttribute('stroke', '#333');
  square.setAttribute('stroke-width', '2');
  svg.appendChild(square);

  // Value in center
  const primaryAttr = definitions[0];
  if (primaryAttr) {
    const value = piece.attributes[primaryAttr.name];

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(size / 2));
    text.setAttribute('y', String(size / 2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', String(size / 3));
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', getContrastColor(bgColor));
    text.textContent = String(value);
    svg.appendChild(text);
  }

  // Labels
  if (cfg.showLabels && cfg.labelPosition === 'below') {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(size / 2));
    label.setAttribute('y', String(size + 14));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', '#666');

    const attrs = Object.entries(piece.attributes)
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    label.textContent = attrs;
    svg.appendChild(label);
  }
}

/**
 * Render a SET-game style card with shapes
 */
export function renderSetCard(
  piece: AttributePiece,
  size: number = 100
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size * 1.4));
  svg.setAttribute('viewBox', `0 0 ${size} ${size * 1.4}`);
  svg.classList.add('set-card');

  // Card background
  const card = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  card.setAttribute('x', '2');
  card.setAttribute('y', '2');
  card.setAttribute('width', String(size - 4));
  card.setAttribute('height', String(size * 1.4 - 4));
  card.setAttribute('rx', '8');
  card.setAttribute('fill', 'white');
  card.setAttribute('stroke', '#333');
  card.setAttribute('stroke-width', '2');
  svg.appendChild(card);

  // Get attributes
  const count = (piece.attributes.number as number) || 1;
  const shape = (piece.attributes.shape as string) || 'oval';
  const shading = (piece.attributes.shading as string) || 'solid';
  const color = (piece.attributes.color as string) || 'red';

  // Color mapping
  const colorMap: Record<string, string> = {
    red: '#f44336',
    green: '#4caf50',
    purple: '#9c27b0',
  };
  const strokeColor = colorMap[color] || color;

  // Render shapes
  const shapeHeight = 30;
  const spacing = 10;
  const totalHeight = count * shapeHeight + (count - 1) * spacing;
  const startY = (size * 1.4 - totalHeight) / 2;

  for (let i = 0; i < count; i++) {
    const y = startY + i * (shapeHeight + spacing);
    renderSetShape(svg, shape, shading, strokeColor, size / 2, y, size * 0.6, shapeHeight);
  }

  return svg;
}

function renderSetShape(
  svg: SVGSVGElement,
  shape: string,
  shading: string,
  color: string,
  cx: number,
  cy: number,
  width: number,
  height: number
): void {
  let element: SVGElement;
  const halfW = width / 2;
  const halfH = height / 2;

  switch (shape) {
    case 'diamond':
      element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      element.setAttribute('points', `${cx},${cy - halfH} ${cx + halfW},${cy} ${cx},${cy + halfH} ${cx - halfW},${cy}`);
      break;
    case 'oval':
      element = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      element.setAttribute('cx', String(cx));
      element.setAttribute('cy', String(cy));
      element.setAttribute('rx', String(halfW));
      element.setAttribute('ry', String(halfH));
      break;
    case 'squiggle': {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${cx - halfW} ${cy}
        Q ${cx - halfW} ${cy - halfH}, ${cx} ${cy - halfH * 0.5}
        Q ${cx + halfW} ${cy}, ${cx + halfW} ${cy + halfH * 0.5}
        Q ${cx + halfW} ${cy + halfH}, ${cx} ${cy + halfH * 0.5}
        Q ${cx - halfW} ${cy}, ${cx - halfW} ${cy}
        Z`;
      element.setAttribute('d', d);
      break;
    }
    default:
      element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      element.setAttribute('x', String(cx - halfW));
      element.setAttribute('y', String(cy - halfH));
      element.setAttribute('width', String(width));
      element.setAttribute('height', String(height));
  }

  // Apply shading
  switch (shading) {
    case 'solid':
      element.setAttribute('fill', color);
      element.setAttribute('stroke', color);
      break;
    case 'striped': {
      // Create pattern for stripes
      const patternId = `stripes-${Math.random().toString(36).substr(2, 9)}`;
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttribute('id', patternId);
      pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      pattern.setAttribute('width', '4');
      pattern.setAttribute('height', '4');

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '0');
      line.setAttribute('x2', '0');
      line.setAttribute('y2', '4');
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2');

      pattern.appendChild(line);
      defs.appendChild(pattern);
      svg.insertBefore(defs, svg.firstChild);

      element.setAttribute('fill', `url(#${patternId})`);
      element.setAttribute('stroke', color);
      break;
    }
    case 'empty': {
      element.setAttribute('fill', 'none');
      element.setAttribute('stroke', color);
      break;
    }
  }

  element.setAttribute('stroke-width', '2');
  svg.appendChild(element);
}

/**
 * Create a grid of attribute pieces
 */
export function createPieceGrid(
  pieces: AttributePiece[],
  definitions: AttributeDefinition[],
  onSelect: (piece: AttributePiece) => void,
  selectedIds: Set<string> = new Set(),
  config: Partial<AttributeRenderConfig> = {}
): HTMLElement {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const grid = document.createElement('div');
  grid.className = 'piece-grid';
  grid.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
  `;

  for (const piece of pieces) {
    const wrapper = document.createElement('div');
    wrapper.className = `piece-wrapper ${selectedIds.has(piece.id) ? 'selected' : ''}`;
    wrapper.style.cssText = `
      cursor: pointer;
      padding: 4px;
      border: 3px solid ${selectedIds.has(piece.id) ? '#2196f3' : 'transparent'};
      border-radius: 8px;
      transition: all 0.2s;
    `;

    wrapper.addEventListener('click', () => onSelect(piece));
    wrapper.addEventListener('mouseenter', () => {
      if (!selectedIds.has(piece.id)) {
        wrapper.style.borderColor = '#90caf9';
      }
    });
    wrapper.addEventListener('mouseleave', () => {
      if (!selectedIds.has(piece.id)) {
        wrapper.style.borderColor = 'transparent';
      }
    });

    const svg = renderAttributePiece(piece, definitions, cfg);
    wrapper.appendChild(svg);
    grid.appendChild(wrapper);
  }

  return grid;
}

/**
 * Get contrasting text color for a background
 */
function getContrastColor(bgColor: string): string {
  // Parse hex color
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#333' : '#fff';
}

/**
 * Inject CSS styles for attribute UI
 */
export function injectAttributeStyles(): void {
  const styleId = 'attribute-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .attribute-piece {
      display: block;
      transition: transform 0.2s;
    }

    .piece-wrapper:hover .attribute-piece {
      transform: scale(1.05);
    }

    .piece-wrapper.selected {
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
    }

    .piece-grid {
      user-select: none;
    }

    .set-card {
      display: block;
    }

    @keyframes highlight-piece {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .piece-wrapper.highlight .attribute-piece {
      animation: highlight-piece 0.5s ease-in-out;
    }
  `;

  document.head.appendChild(style);
}
