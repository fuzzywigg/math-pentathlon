/**
 * Dice UI Rendering
 * SVG-based dice rendering with animation support
 */

import {
  DiceType,
  DieRoll,
  DiceRollResult,
  DiceAnimationConfig,
  DiceColorScheme,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_DICE_COLORS,
  DICE_FACES,
} from './types';

// Size constants
const DIE_SIZE = 60;
const DIE_PADDING = 8;

/**
 * Create SVG element with namespace
 */
function createSvgElement(tag: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

/**
 * Generate pip positions for d6 faces
 */
function getD6PipPositions(value: number): Array<{ x: number; y: number }> {
  const center = DIE_SIZE / 2;
  const offset = DIE_SIZE / 4;

  const positions: Record<number, Array<{ x: number; y: number }>> = {
    1: [{ x: center, y: center }],
    2: [
      { x: center - offset, y: center - offset },
      { x: center + offset, y: center + offset },
    ],
    3: [
      { x: center - offset, y: center - offset },
      { x: center, y: center },
      { x: center + offset, y: center + offset },
    ],
    4: [
      { x: center - offset, y: center - offset },
      { x: center + offset, y: center - offset },
      { x: center - offset, y: center + offset },
      { x: center + offset, y: center + offset },
    ],
    5: [
      { x: center - offset, y: center - offset },
      { x: center + offset, y: center - offset },
      { x: center, y: center },
      { x: center - offset, y: center + offset },
      { x: center + offset, y: center + offset },
    ],
    6: [
      { x: center - offset, y: center - offset },
      { x: center + offset, y: center - offset },
      { x: center - offset, y: center },
      { x: center + offset, y: center },
      { x: center - offset, y: center + offset },
      { x: center + offset, y: center + offset },
    ],
  };

  return positions[value] || [];
}

/**
 * Render a standard d6 die as SVG
 */
export function renderD6(
  value: number,
  colors: DiceColorScheme = DEFAULT_DICE_COLORS.d6
): SVGSVGElement {
  const svg = createSvgElement('svg') as SVGSVGElement;
  svg.setAttribute('width', String(DIE_SIZE));
  svg.setAttribute('height', String(DIE_SIZE));
  svg.setAttribute('viewBox', `0 0 ${DIE_SIZE} ${DIE_SIZE}`);
  svg.classList.add('die', 'die-d6');

  // Die face (rounded rectangle)
  const rect = createSvgElement('rect');
  rect.setAttribute('x', '2');
  rect.setAttribute('y', '2');
  rect.setAttribute('width', String(DIE_SIZE - 4));
  rect.setAttribute('height', String(DIE_SIZE - 4));
  rect.setAttribute('rx', '8');
  rect.setAttribute('ry', '8');
  rect.setAttribute('fill', colors.face);
  rect.setAttribute('stroke', colors.border);
  rect.setAttribute('stroke-width', '2');
  svg.appendChild(rect);

  // Pips
  const pipPositions = getD6PipPositions(value);
  const pipRadius = DIE_SIZE / 10;

  for (const pos of pipPositions) {
    const pip = createSvgElement('circle');
    pip.setAttribute('cx', String(pos.x));
    pip.setAttribute('cy', String(pos.y));
    pip.setAttribute('r', String(pipRadius));
    pip.setAttribute('fill', colors.pip);
    svg.appendChild(pip);
  }

  return svg;
}

/**
 * Render a polyhedral die (d4, d8, d10, d12, d20) as SVG
 * Uses text-based display for simplicity
 */
export function renderPolyhedralDie(
  diceType: DiceType,
  value: number,
  colors: DiceColorScheme = DEFAULT_DICE_COLORS[diceType]
): SVGSVGElement {
  const svg = createSvgElement('svg') as SVGSVGElement;
  svg.setAttribute('width', String(DIE_SIZE));
  svg.setAttribute('height', String(DIE_SIZE));
  svg.setAttribute('viewBox', `0 0 ${DIE_SIZE} ${DIE_SIZE}`);
  svg.classList.add('die', `die-${diceType}`);

  const center = DIE_SIZE / 2;

  // Draw shape based on dice type
  if (diceType === 'd4') {
    // Triangle
    const points = `${center},8 ${DIE_SIZE - 8},${DIE_SIZE - 8} 8,${DIE_SIZE - 8}`;
    const polygon = createSvgElement('polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', colors.face);
    polygon.setAttribute('stroke', colors.border);
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
  } else if (diceType === 'd8') {
    // Diamond/rhombus
    const points = `${center},4 ${DIE_SIZE - 4},${center} ${center},${DIE_SIZE - 4} 4,${center}`;
    const polygon = createSvgElement('polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', colors.face);
    polygon.setAttribute('stroke', colors.border);
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
  } else if (diceType === 'd10' || diceType === 'd20') {
    // Pentagon-ish shape
    const r = center - 4;
    const sides = diceType === 'd10' ? 5 : 6;
    let points = '';
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points += `${x},${y} `;
    }
    const polygon = createSvgElement('polygon');
    polygon.setAttribute('points', points.trim());
    polygon.setAttribute('fill', colors.face);
    polygon.setAttribute('stroke', colors.border);
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
  } else if (diceType === 'd12') {
    // Hexagon
    const r = center - 4;
    let points = '';
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points += `${x},${y} `;
    }
    const polygon = createSvgElement('polygon');
    polygon.setAttribute('points', points.trim());
    polygon.setAttribute('fill', colors.face);
    polygon.setAttribute('stroke', colors.border);
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
  }

  // Value text
  const text = createSvgElement('text');
  text.setAttribute('x', String(center));
  text.setAttribute('y', String(center + 6));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '20');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('fill', colors.pip);
  text.textContent = String(value);
  svg.appendChild(text);

  return svg;
}

/**
 * Render any die type as SVG
 */
export function renderDie(
  diceType: DiceType,
  value: number,
  colors?: DiceColorScheme
): SVGSVGElement {
  if (diceType === 'd6') {
    return renderD6(value, colors || DEFAULT_DICE_COLORS.d6);
  }
  return renderPolyhedralDie(diceType, value, colors || DEFAULT_DICE_COLORS[diceType]);
}

/**
 * Render a single DieRoll with state styling
 */
export function renderDieRoll(roll: DieRoll): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('die-container');
  container.dataset.dieId = roll.id;

  if (roll.isSelected) {
    container.classList.add('die-selected');
  }
  if (roll.isLocked) {
    container.classList.add('die-locked');
  }

  const svg = renderDie(roll.diceType, roll.value);
  container.appendChild(svg);

  return container;
}

/**
 * Render a complete dice roll result
 */
export function renderDiceRollResult(
  result: DiceRollResult,
  container: HTMLElement,
  onDieClick?: (dieId: string) => void
): void {
  container.innerHTML = '';
  container.classList.add('dice-roll-result');

  const diceRow = document.createElement('div');
  diceRow.classList.add('dice-row');

  for (const roll of result.rolls) {
    const dieElement = renderDieRoll(roll);

    if (onDieClick) {
      dieElement.addEventListener('click', () => onDieClick(roll.id));
      dieElement.classList.add('die-clickable');
    }

    diceRow.appendChild(dieElement);
  }

  container.appendChild(diceRow);

  // Total display
  const totalDisplay = document.createElement('div');
  totalDisplay.classList.add('dice-total');
  totalDisplay.innerHTML = `<span class="dice-total-label">Total:</span> <span class="dice-total-value">${result.total}</span>`;
  container.appendChild(totalDisplay);
}

/**
 * Animate a die roll with tumbling effect
 */
export async function animateDieRoll(
  dieElement: HTMLElement,
  finalValue: number,
  diceType: DiceType,
  config: DiceAnimationConfig = DEFAULT_ANIMATION_CONFIG
): Promise<void> {
  const faces = DICE_FACES[diceType];
  const intervalTime = config.duration / config.bounceCount;

  return new Promise((resolve) => {
    let bounces = 0;

    const interval = setInterval(() => {
      bounces++;

      // Show random intermediate values
      const intermediateValue = Math.floor(Math.random() * faces) + 1;
      const svg = renderDie(diceType, intermediateValue);

      // Apply rotation
      const rotation = (bounces * 45) % 360;
      svg.style.transform = `rotate(${rotation}deg)`;

      // Clear and update
      dieElement.innerHTML = '';
      dieElement.appendChild(svg);

      if (bounces >= config.bounceCount) {
        clearInterval(interval);

        // Show final value
        const finalSvg = renderDie(diceType, finalValue);
        finalSvg.style.transform = 'rotate(0deg)';
        dieElement.innerHTML = '';
        dieElement.appendChild(finalSvg);

        resolve();
      }
    }, intervalTime);
  });
}

/**
 * Animate multiple dice rolling simultaneously
 */
export async function animateDiceRoll(
  container: HTMLElement,
  result: DiceRollResult,
  config: DiceAnimationConfig = DEFAULT_ANIMATION_CONFIG,
  onDieClick?: (dieId: string) => void
): Promise<void> {
  container.innerHTML = '';
  container.classList.add('dice-roll-result', 'dice-rolling');

  const diceRow = document.createElement('div');
  diceRow.classList.add('dice-row');

  const dieElements: HTMLElement[] = [];

  // Create placeholder elements
  for (const roll of result.rolls) {
    const dieContainer = document.createElement('div');
    dieContainer.classList.add('die-container', 'die-animating');
    dieContainer.dataset.dieId = roll.id;

    // Initial placeholder
    const svg = renderDie(roll.diceType, 1);
    dieContainer.appendChild(svg);
    diceRow.appendChild(dieContainer);
    dieElements.push(dieContainer);
  }

  container.appendChild(diceRow);

  // Animate all dice
  const animations = result.rolls.map((roll, index) =>
    animateDieRoll(dieElements[index], roll.value, roll.diceType, config)
  );

  await Promise.all(animations);

  // Final render with click handlers
  container.classList.remove('dice-rolling');
  renderDiceRollResult(result, container, onDieClick);
}

/**
 * Get CSS styles for dice UI components
 */
export function getDiceStyles(): string {
  return `
    .dice-roll-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .dice-row {
      display: flex;
      gap: ${DIE_PADDING}px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .die-container {
      position: relative;
      width: ${DIE_SIZE}px;
      height: ${DIE_SIZE}px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .die-container.die-clickable {
      cursor: pointer;
    }

    .die-container.die-clickable:hover {
      transform: scale(1.1);
    }

    .die-container.die-selected {
      box-shadow: 0 0 0 3px #4caf50;
      border-radius: 10px;
    }

    .die-container.die-locked {
      opacity: 0.6;
    }

    .die-container.die-locked::after {
      content: '\\1F512';
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 14px;
    }

    .die-container.die-animating {
      animation: die-bounce 0.1s ease-in-out infinite;
    }

    @keyframes die-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .die {
      filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
    }

    .dice-total {
      font-size: 1.25rem;
      font-weight: bold;
      color: #333;
    }

    .dice-total-label {
      color: #666;
      font-weight: normal;
    }

    .dice-total-value {
      color: #1976d2;
    }

    .dice-rolling .dice-total {
      visibility: hidden;
    }
  `;
}
