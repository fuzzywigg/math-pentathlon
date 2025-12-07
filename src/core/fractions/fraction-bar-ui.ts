// Fraction Bar UI - Visual representation of fractions

import {
  Fraction,
  FractionBarConfig,
  FractionBarPiece,
  FRACTION_COLORS,
} from './types';
import { simplify, toDecimal, formatFraction } from './arithmetic';

/** Default configuration */
const DEFAULT_CONFIG: Required<FractionBarConfig> = {
  style: 'horizontal',
  width: 200,
  height: 40,
  colors: {
    filled: '#2196f3',
    empty: '#e0e0e0',
    border: '#333',
  },
  showLabel: true,
  labelPosition: 'below',
  interactive: false,
};

/** Get color for a fraction based on denominator */
export function getFractionColor(denominator: number): string {
  return FRACTION_COLORS[denominator] || '#607d8b';
}

/** Create SVG namespace helper */
function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

/**
 * Render a horizontal fraction bar
 */
export function renderHorizontalBar(
  fraction: Fraction,
  config: FractionBarConfig = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config, colors: { ...DEFAULT_CONFIG.colors, ...config.colors } };
  const { width, height, colors, showLabel, labelPosition } = cfg;

  const simplified = simplify(fraction);
  const { numerator, denominator } = simplified;
  const fillRatio = Math.min(1, Math.max(0, numerator / denominator));

  const totalHeight = showLabel && labelPosition === 'below' ? height + 25 : height;

  const svg = createSVGElement('svg', {
    width,
    height: totalHeight,
    viewBox: `0 0 ${width} ${totalHeight}`,
    class: 'fraction-bar fraction-bar-horizontal',
  });

  // Background (empty)
  const bg = createSVGElement('rect', {
    x: 1,
    y: 1,
    width: width - 2,
    height: height - 2,
    fill: colors.empty || '#e0e0e0',
    stroke: colors.border || '#333',
    'stroke-width': 2,
    rx: 4,
    ry: 4,
  });
  svg.appendChild(bg);

  // Filled portion
  if (fillRatio > 0) {
    const fillWidth = (width - 2) * fillRatio;
    const fill = createSVGElement('rect', {
      x: 1,
      y: 1,
      width: fillWidth,
      height: height - 2,
      fill: colors.filled || getFractionColor(denominator),
      rx: 4,
      ry: 4,
    });
    svg.appendChild(fill);

    // Clip the right side if not full
    if (fillRatio < 1) {
      fill.setAttribute('clip-path', 'inset(0 0 0 0 round 4px 0 0 4px)');
    }
  }

  // Division lines
  if (denominator > 1 && denominator <= 12) {
    const segmentWidth = (width - 2) / denominator;
    for (let i = 1; i < denominator; i++) {
      const line = createSVGElement('line', {
        x1: 1 + i * segmentWidth,
        y1: 1,
        x2: 1 + i * segmentWidth,
        y2: height - 1,
        stroke: colors.border || '#333',
        'stroke-width': 1,
        'stroke-opacity': 0.5,
      });
      svg.appendChild(line);
    }
  }

  // Label
  if (showLabel) {
    const labelText = formatFraction(simplified);

    if (labelPosition === 'inside') {
      const text = createSVGElement('text', {
        x: width / 2,
        y: height / 2,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        fill: 'white',
        'font-size': 14,
        'font-weight': 'bold',
        'font-family': 'Arial, sans-serif',
      });
      text.textContent = labelText;
      svg.appendChild(text);
    } else if (labelPosition === 'below') {
      const text = createSVGElement('text', {
        x: width / 2,
        y: height + 18,
        'text-anchor': 'middle',
        fill: '#333',
        'font-size': 14,
        'font-family': 'Arial, sans-serif',
      });
      text.textContent = labelText;
      svg.appendChild(text);
    }
  }

  return svg;
}

/**
 * Render a vertical fraction bar
 */
export function renderVerticalBar(
  fraction: Fraction,
  config: FractionBarConfig = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config, colors: { ...DEFAULT_CONFIG.colors, ...config.colors } };
  const { width, height, colors, showLabel, labelPosition } = cfg;

  const simplified = simplify(fraction);
  const { numerator, denominator } = simplified;
  const fillRatio = Math.min(1, Math.max(0, numerator / denominator));

  const totalWidth = showLabel && labelPosition === 'right' ? width + 40 : width;

  const svg = createSVGElement('svg', {
    width: totalWidth,
    height,
    viewBox: `0 0 ${totalWidth} ${height}`,
    class: 'fraction-bar fraction-bar-vertical',
  });

  // Background
  const bg = createSVGElement('rect', {
    x: 1,
    y: 1,
    width: width - 2,
    height: height - 2,
    fill: colors.empty || '#e0e0e0',
    stroke: colors.border || '#333',
    'stroke-width': 2,
    rx: 4,
    ry: 4,
  });
  svg.appendChild(bg);

  // Filled portion (from bottom)
  if (fillRatio > 0) {
    const fillHeight = (height - 2) * fillRatio;
    const fill = createSVGElement('rect', {
      x: 1,
      y: height - 1 - fillHeight,
      width: width - 2,
      height: fillHeight,
      fill: colors.filled || getFractionColor(denominator),
      rx: 4,
      ry: 4,
    });
    svg.appendChild(fill);
  }

  // Division lines
  if (denominator > 1 && denominator <= 12) {
    const segmentHeight = (height - 2) / denominator;
    for (let i = 1; i < denominator; i++) {
      const line = createSVGElement('line', {
        x1: 1,
        y1: 1 + i * segmentHeight,
        x2: width - 1,
        y2: 1 + i * segmentHeight,
        stroke: colors.border || '#333',
        'stroke-width': 1,
        'stroke-opacity': 0.5,
      });
      svg.appendChild(line);
    }
  }

  // Label
  if (showLabel && labelPosition === 'right') {
    const text = createSVGElement('text', {
      x: width + 5,
      y: height / 2,
      'text-anchor': 'start',
      'dominant-baseline': 'central',
      fill: '#333',
      'font-size': 14,
      'font-family': 'Arial, sans-serif',
    });
    text.textContent = formatFraction(simplified);
    svg.appendChild(text);
  }

  return svg;
}

/**
 * Render a circular (pie) fraction representation
 */
export function renderCircleBar(
  fraction: Fraction,
  config: FractionBarConfig = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_CONFIG, ...config, colors: { ...DEFAULT_CONFIG.colors, ...config.colors } };
  const size = Math.min(cfg.width, cfg.height);
  const { colors, showLabel, labelPosition } = cfg;

  const simplified = simplify(fraction);
  const { numerator, denominator } = simplified;
  const fillRatio = Math.min(1, Math.max(0, numerator / denominator));

  const totalHeight = showLabel && labelPosition === 'below' ? size + 25 : size;

  const svg = createSVGElement('svg', {
    width: size,
    height: totalHeight,
    viewBox: `0 0 ${size} ${totalHeight}`,
    class: 'fraction-bar fraction-bar-circle',
  });

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 4) / 2;

  // Background circle
  const bgCircle = createSVGElement('circle', {
    cx,
    cy,
    r: radius,
    fill: colors.empty || '#e0e0e0',
    stroke: colors.border || '#333',
    'stroke-width': 2,
  });
  svg.appendChild(bgCircle);

  // Filled portion (pie slice)
  if (fillRatio > 0 && fillRatio < 1) {
    const angle = fillRatio * 2 * Math.PI;
    const endX = cx + radius * Math.sin(angle);
    const endY = cy - radius * Math.cos(angle);
    const largeArc = fillRatio > 0.5 ? 1 : 0;

    const path = createSVGElement('path', {
      d: `M ${cx} ${cy} L ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`,
      fill: colors.filled || getFractionColor(denominator),
    });
    svg.appendChild(path);
  } else if (fillRatio >= 1) {
    const fillCircle = createSVGElement('circle', {
      cx,
      cy,
      r: radius,
      fill: colors.filled || getFractionColor(denominator),
    });
    svg.appendChild(fillCircle);
  }

  // Division lines
  if (denominator > 1 && denominator <= 12) {
    for (let i = 0; i < denominator; i++) {
      const angle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
      const line = createSVGElement('line', {
        x1: cx,
        y1: cy,
        x2: cx + radius * Math.cos(angle),
        y2: cy + radius * Math.sin(angle),
        stroke: colors.border || '#333',
        'stroke-width': 1,
        'stroke-opacity': 0.5,
      });
      svg.appendChild(line);
    }
  }

  // Label
  if (showLabel && labelPosition === 'below') {
    const text = createSVGElement('text', {
      x: size / 2,
      y: size + 18,
      'text-anchor': 'middle',
      fill: '#333',
      'font-size': 14,
      'font-family': 'Arial, sans-serif',
    });
    text.textContent = formatFraction(simplified);
    svg.appendChild(text);
  }

  return svg;
}

/**
 * Render a fraction bar based on style config
 */
export function renderFractionBar(
  fraction: Fraction,
  config: FractionBarConfig = {}
): SVGSVGElement {
  const style = config.style || 'horizontal';

  switch (style) {
    case 'vertical':
      return renderVerticalBar(fraction, config);
    case 'circle':
      return renderCircleBar(fraction, config);
    case 'horizontal':
    default:
      return renderHorizontalBar(fraction, config);
  }
}

/**
 * Create an interactive fraction bar that can be clicked to set value
 */
export function createInteractiveFractionBar(
  fraction: Fraction,
  denominator: number,
  onChange: (newFraction: Fraction) => void,
  config: FractionBarConfig = {}
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'interactive-fraction-bar';

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const { width, height, colors } = cfg;

  const segments: HTMLElement[] = [];
  const segmentWidth = (width - 2) / denominator;

  for (let i = 0; i < denominator; i++) {
    const segment = document.createElement('div');
    segment.className = 'fraction-segment';
    segment.style.cssText = `
      width: ${segmentWidth}px;
      height: ${height - 2}px;
      background: ${i < fraction.numerator ? (colors?.filled || getFractionColor(denominator)) : (colors?.empty || '#e0e0e0')};
      border-right: 1px solid ${colors?.border || '#333'};
      display: inline-block;
      cursor: pointer;
      transition: background 0.2s ease;
    `;

    segment.addEventListener('click', () => {
      const newNumerator = i + 1;
      onChange({ numerator: newNumerator, denominator });
    });

    segment.addEventListener('mouseenter', () => {
      // Highlight potential selection
      for (let j = 0; j <= i; j++) {
        segments[j].style.opacity = '0.8';
      }
    });

    segment.addEventListener('mouseleave', () => {
      segments.forEach(s => s.style.opacity = '1');
    });

    segments.push(segment);
    wrapper.appendChild(segment);
  }

  wrapper.style.cssText = `
    display: inline-flex;
    border: 2px solid ${colors?.border || '#333'};
    border-radius: 4px;
    overflow: hidden;
  `;

  return wrapper;
}

/**
 * Create a fraction bar piece for dragging/manipulation
 */
export function createFractionBarPiece(
  piece: FractionBarPiece,
  config: FractionBarConfig = {}
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fraction-bar-piece';
  wrapper.setAttribute('data-piece-id', piece.id);
  wrapper.setAttribute('data-fraction', `${piece.fraction.numerator}/${piece.fraction.denominator}`);
  wrapper.setAttribute('draggable', 'true');

  const svg = renderFractionBar(piece.fraction, {
    ...config,
    colors: { filled: piece.color, ...config.colors },
  });

  wrapper.appendChild(svg);

  wrapper.style.cssText = `
    display: inline-block;
    cursor: grab;
    transition: transform 0.2s ease;
  `;

  wrapper.addEventListener('dragstart', (e) => {
    wrapper.style.opacity = '0.5';
    e.dataTransfer?.setData('text/plain', piece.id);
  });

  wrapper.addEventListener('dragend', () => {
    wrapper.style.opacity = '1';
  });

  return wrapper;
}

/**
 * Get CSS styles for fraction bar components
 */
export function getFractionBarStyles(): string {
  return `
    .fraction-bar {
      display: inline-block;
    }

    .fraction-bar-piece {
      display: inline-block;
      margin: 4px;
      padding: 4px;
      border-radius: 8px;
      background: #f5f5f5;
    }

    .fraction-bar-piece:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .fraction-bar-piece.selected {
      box-shadow: 0 0 0 3px #2196f3;
    }

    .interactive-fraction-bar .fraction-segment:hover {
      filter: brightness(1.1);
    }

    .fraction-comparison {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .fraction-comparison .operator {
      font-size: 1.5rem;
      font-weight: bold;
      color: #666;
    }
  `;
}

/**
 * Inject fraction bar styles into document
 */
export function injectFractionBarStyles(): void {
  const styleId = 'fraction-bar-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = getFractionBarStyles();
    document.head.appendChild(style);
  }
}

/**
 * Render a comparison of two fractions side by side
 */
export function renderFractionComparison(
  a: Fraction,
  b: Fraction,
  config: FractionBarConfig = {}
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fraction-comparison';

  const aBar = renderFractionBar(a, config);
  const bBar = renderFractionBar(b, config);

  // Determine comparison symbol
  const aValue = toDecimal(a);
  const bValue = toDecimal(b);
  let symbol = '=';
  if (aValue < bValue) symbol = '<';
  else if (aValue > bValue) symbol = '>';

  const operator = document.createElement('span');
  operator.className = 'operator';
  operator.textContent = symbol;

  wrapper.appendChild(aBar);
  wrapper.appendChild(operator);
  wrapper.appendChild(bBar);

  return wrapper;
}
