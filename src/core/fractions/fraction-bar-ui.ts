/**
 * Fraction Bar UI
 * Visual representation of fractions using Cuisenaire-style bars
 */

import type { Fraction, FractionBar, FractionStyle, FractionDisplayOptions } from './types';
import {
  getFractionBarColor,
  DEFAULT_FRACTION_STYLE,
  DEFAULT_DISPLAY_OPTIONS,
  UNICODE_FRACTIONS,
} from './types';
import { simplify, toMixedNumber, toDecimal } from './arithmetic';

/**
 * Format a fraction as a string
 */
export function formatFraction(
  f: Fraction,
  options: FractionDisplayOptions = DEFAULT_DISPLAY_OPTIONS
): string {
  let fraction = f;

  if (options.simplify) {
    const simplified = simplify(f);
    fraction = {
      numerator: simplified.isNegative ? -simplified.numerator : simplified.numerator,
      denominator: simplified.denominator,
    };
  }

  const sign = fraction.numerator < 0 ? '-' : options.showSign ? '+' : '';
  const absNum = Math.abs(fraction.numerator);

  // Check for unicode fraction
  if (options.useUnicodeFractions) {
    const key = `${absNum}/${fraction.denominator}`;
    if (UNICODE_FRACTIONS[key]) {
      return sign + UNICODE_FRACTIONS[key];
    }
  }

  // Mixed number format
  if (options.showMixedNumber && absNum >= fraction.denominator) {
    const mixed = toMixedNumber(fraction);
    if (mixed.fraction.numerator === 0) {
      return sign + String(mixed.whole);
    }
    return `${sign}${mixed.whole} ${mixed.fraction.numerator}/${mixed.fraction.denominator}`;
  }

  // Standard format
  return `${sign}${absNum}/${fraction.denominator}`;
}

/**
 * Create a fraction bar data object
 */
export function createFractionBar(
  f: Fraction,
  label?: string,
  customColor?: string
): FractionBar {
  const simplified = simplify(f);
  return {
    fraction: {
      numerator: simplified.isNegative ? -simplified.numerator : simplified.numerator,
      denominator: simplified.denominator,
    },
    color: customColor || getFractionBarColor(simplified.denominator),
    label,
  };
}

/**
 * Render a single fraction bar as HTML
 */
export function renderFractionBar(
  bar: FractionBar,
  style: FractionStyle = DEFAULT_FRACTION_STYLE
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('fraction-bar');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = '8px';

  // Calculate width based on fraction value
  const value = toDecimal(bar.fraction);
  const barWidth = Math.abs(value) * style.barWidth;

  // The bar itself
  const barEl = document.createElement('div');
  barEl.classList.add('fraction-bar-fill');
  barEl.style.height = `${style.barHeight}px`;
  barEl.style.width = `${barWidth}px`;
  barEl.style.minWidth = '20px';
  barEl.style.backgroundColor = bar.color;
  barEl.style.borderRadius = `${style.borderRadius}px`;
  barEl.style.border = `${style.borderWidth}px solid ${style.borderColor}`;
  barEl.style.position = 'relative';

  // Label inside bar if it fits
  if (style.showLabel && barWidth > 40) {
    const label = document.createElement('span');
    label.classList.add('fraction-bar-label');
    label.textContent = bar.label || formatFraction(bar.fraction);
    label.style.position = 'absolute';
    label.style.left = '50%';
    label.style.top = '50%';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.fontSize = `${style.fontSize}px`;
    label.style.fontWeight = 'bold';
    label.style.color = getContrastColor(bar.color);
    barEl.appendChild(label);
  }

  container.appendChild(barEl);

  // Value display outside bar
  if (style.showValue && (barWidth <= 40 || !style.showLabel)) {
    const valueEl = document.createElement('span');
    valueEl.classList.add('fraction-bar-value');
    valueEl.textContent = formatFraction(bar.fraction);
    valueEl.style.fontSize = `${style.fontSize}px`;
    valueEl.style.fontWeight = '600';
    container.appendChild(valueEl);
  }

  return container;
}

/**
 * Render multiple fraction bars stacked vertically
 */
export function renderFractionBars(
  bars: FractionBar[],
  style: FractionStyle = DEFAULT_FRACTION_STYLE
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('fraction-bars-container');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '4px';

  for (const bar of bars) {
    container.appendChild(renderFractionBar(bar, style));
  }

  return container;
}

/**
 * Render a fraction bar comparison (side by side)
 */
export function renderFractionComparison(
  fractions: Fraction[],
  style: FractionStyle = DEFAULT_FRACTION_STYLE
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('fraction-comparison');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '8px';

  // Find max value for scaling
  const maxValue = Math.max(...fractions.map((f) => Math.abs(toDecimal(f))));
  const scaledStyle = { ...style, barWidth: style.barWidth / maxValue };

  for (const f of fractions) {
    const bar = createFractionBar(f);
    container.appendChild(renderFractionBar(bar, scaledStyle));
  }

  return container;
}

/**
 * Render fraction as a circle (pie chart style)
 */
export function renderFractionCircle(
  f: Fraction,
  size: number = 100,
  color?: string
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('fraction-circle');

  const simplified = simplify(f);
  const fillColor = color || getFractionBarColor(simplified.denominator);
  const decimal = toDecimal(f);
  const angle = decimal * 360;

  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '50');
  bgCircle.setAttribute('cy', '50');
  bgCircle.setAttribute('r', '45');
  bgCircle.setAttribute('fill', '#f5f5f5');
  bgCircle.setAttribute('stroke', '#333');
  bgCircle.setAttribute('stroke-width', '2');
  svg.appendChild(bgCircle);

  // Filled arc
  if (decimal > 0 && decimal < 1) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startAngle = -90; // Start at top
    const endAngle = startAngle + angle;

    const startX = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
    const endY = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    const d = `M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArc} 1 ${endX} ${endY} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', fillColor);
    svg.appendChild(path);
  } else if (decimal >= 1) {
    // Full circle
    const fullCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fullCircle.setAttribute('cx', '50');
    fullCircle.setAttribute('cy', '50');
    fullCircle.setAttribute('r', '45');
    fullCircle.setAttribute('fill', fillColor);
    svg.appendChild(fullCircle);
  }

  // Label
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', '50');
  text.setAttribute('y', '55');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '16');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('fill', '#333');
  text.textContent = formatFraction(f);
  svg.appendChild(text);

  return svg;
}

/**
 * Render fraction as a rectangular grid
 */
export function renderFractionGrid(
  f: Fraction,
  cellSize: number = 30,
  cols?: number
): HTMLElement {
  const simplified = simplify(f);
  const numerator = simplified.numerator;
  const denominator = simplified.denominator;
  const color = getFractionBarColor(denominator);

  // Determine grid dimensions
  const gridCols = cols || Math.ceil(Math.sqrt(denominator));

  const container = document.createElement('div');
  container.classList.add('fraction-grid');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${gridCols}, ${cellSize}px)`;
  container.style.gap = '2px';
  container.style.padding = '4px';
  container.style.backgroundColor = '#f5f5f5';
  container.style.borderRadius = '4px';
  container.style.border = '1px solid #333';
  container.style.width = 'fit-content';

  for (let i = 0; i < denominator; i++) {
    const cell = document.createElement('div');
    cell.classList.add('fraction-grid-cell');
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.style.borderRadius = '2px';
    cell.style.border = '1px solid #999';

    if (i < numerator) {
      cell.style.backgroundColor = color;
      cell.classList.add('filled');
    } else {
      cell.style.backgroundColor = '#fff';
      cell.classList.add('empty');
    }

    container.appendChild(cell);
  }

  return container;
}

/**
 * Get contrasting text color for a background
 */
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Get CSS styles for fraction UI components
 */
export function getFractionStyles(): string {
  return `
    .fraction-bar {
      transition: opacity 0.2s ease;
    }
    .fraction-bar:hover {
      opacity: 0.9;
    }
    .fraction-bar-fill {
      transition: width 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .fraction-bars-container {
      padding: 8px;
    }
    .fraction-circle {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    .fraction-grid {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .fraction-grid-cell {
      transition: background-color 0.2s ease;
    }
    .fraction-grid-cell.filled:hover {
      filter: brightness(1.1);
    }
  `;
}

/**
 * Inject fraction styles into document
 */
export function injectFractionStyles(): void {
  const styleId = 'fraction-ui-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = getFractionStyles();
  document.head.appendChild(style);
}
