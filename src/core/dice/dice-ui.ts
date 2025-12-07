// Dice UI - SVG rendering with animations

import { DiceType, DieRoll, RollResult, DICE_CONFIGS } from './types';

/** Pip positions for d6 faces (normalized 0-1 coordinates) */
const D6_PIP_POSITIONS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.25, 0.25], [0.75, 0.75]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]],
};

/** Create SVG element helper */
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

/** Render a d6 (standard six-sided die) */
function renderD6(value: number, size: number, color: string): SVGElement {
  const svg = createSVGElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 100 100',
    class: 'die die-d6',
  });

  // Die body (rounded rectangle)
  const body = createSVGElement('rect', {
    x: 5,
    y: 5,
    width: 90,
    height: 90,
    rx: 12,
    ry: 12,
    fill: color,
    stroke: '#333',
    'stroke-width': 2,
  });
  svg.appendChild(body);

  // Add gradient for 3D effect
  const defs = createSVGElement('defs');
  const gradient = createSVGElement('linearGradient', { id: `d6-grad-${Math.random()}`, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  const stop1 = createSVGElement('stop', { offset: '0%', 'stop-color': 'rgba(255,255,255,0.3)' });
  const stop2 = createSVGElement('stop', { offset: '100%', 'stop-color': 'rgba(0,0,0,0.2)' });
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  const overlay = createSVGElement('rect', {
    x: 5,
    y: 5,
    width: 90,
    height: 90,
    rx: 12,
    ry: 12,
    fill: `url(#${gradient.getAttribute('id')})`,
  });
  svg.appendChild(overlay);

  // Draw pips
  const pips = D6_PIP_POSITIONS[value] || [];
  for (const [px, py] of pips) {
    const pip = createSVGElement('circle', {
      cx: 10 + px * 80,
      cy: 10 + py * 80,
      r: 8,
      fill: '#fff',
    });
    svg.appendChild(pip);
  }

  return svg;
}

/** Render a polyhedral die (d4, d8, d10, d12, d20) - shows number */
function renderPolyhedral(type: DiceType, value: number, size: number, color: string): SVGElement {
  const svg = createSVGElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 100 100',
    class: `die die-${type}`,
  });

  // Different shapes for different dice
  let shape: SVGElement;
  switch (type) {
    case 'd4':
      // Triangle
      shape = createSVGElement('polygon', {
        points: '50,10 90,85 10,85',
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
      break;
    case 'd8':
      // Diamond/octahedron face
      shape = createSVGElement('polygon', {
        points: '50,5 95,50 50,95 5,50',
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
      break;
    case 'd10':
      // Pentagon-ish
      shape = createSVGElement('polygon', {
        points: '50,5 92,35 75,90 25,90 8,35',
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
      break;
    case 'd12':
      // Pentagon
      shape = createSVGElement('polygon', {
        points: '50,5 95,38 77,90 23,90 5,38',
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
      break;
    case 'd20':
      // Hexagon-ish (icosahedron face approximation)
      shape = createSVGElement('polygon', {
        points: '50,5 90,25 90,75 50,95 10,75 10,25',
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
      break;
    default:
      // Fallback to square
      shape = createSVGElement('rect', {
        x: 5,
        y: 5,
        width: 90,
        height: 90,
        rx: 8,
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
      });
  }
  svg.appendChild(shape);

  // Add number
  const text = createSVGElement('text', {
    x: 50,
    y: type === 'd4' ? 65 : 58,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    fill: '#fff',
    'font-size': value >= 10 ? 28 : 36,
    'font-weight': 'bold',
    'font-family': 'Arial, sans-serif',
  });
  text.textContent = String(value);
  svg.appendChild(text);

  return svg;
}

/** Render a single die */
export function renderDie(die: DieRoll, size: number = 60): SVGElement {
  const config = DICE_CONFIGS[die.type];
  const color = config.color || '#2196f3';

  if (die.type === 'd6') {
    return renderD6(die.value, size, color);
  }
  return renderPolyhedral(die.type, die.value, size, color);
}

/** Create an interactive die element with click handling */
export function createInteractiveDie(
  die: DieRoll,
  size: number = 60,
  onClick?: (die: DieRoll) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `die-wrapper ${die.selected ? 'selected' : ''} ${die.used ? 'used' : ''}`;
  wrapper.setAttribute('data-die-id', die.id);

  const svg = renderDie(die, size);
  wrapper.appendChild(svg);

  if (onClick && !die.used) {
    wrapper.style.cursor = 'pointer';
    wrapper.addEventListener('click', () => onClick(die));
  }

  return wrapper;
}

/** Render a complete roll result */
export function renderRollResult(
  result: RollResult,
  container: HTMLElement,
  options: {
    dieSize?: number;
    showTotal?: boolean;
    selectable?: boolean;
    onDieClick?: (die: DieRoll) => void;
  } = {}
): void {
  const { dieSize = 60, showTotal = true, selectable = false, onDieClick } = options;

  container.innerHTML = '';
  container.className = 'dice-roll-result';

  const diceContainer = document.createElement('div');
  diceContainer.className = 'dice-container';

  for (const die of result.dice) {
    const dieEl = createInteractiveDie(
      die,
      dieSize,
      selectable ? onDieClick : undefined
    );
    diceContainer.appendChild(dieEl);
  }

  container.appendChild(diceContainer);

  if (showTotal) {
    const totalEl = document.createElement('div');
    totalEl.className = 'dice-total';
    totalEl.innerHTML = `<span class="total-label">Total:</span> <span class="total-value">${result.total}</span>`;
    container.appendChild(totalEl);
  }
}

/** Animation: Roll dice with tumbling effect */
export function animateRoll(
  container: HTMLElement,
  finalResult: RollResult,
  options: {
    duration?: number;
    dieSize?: number;
    onComplete?: () => void;
  } = {}
): void {
  const { duration = 1000, dieSize = 60, onComplete } = options;

  container.innerHTML = '';
  container.className = 'dice-roll-result rolling';

  const diceContainer = document.createElement('div');
  diceContainer.className = 'dice-container';

  // Create dice elements for animation
  const dieElements: HTMLElement[] = [];
  for (const die of finalResult.dice) {
    const wrapper = document.createElement('div');
    wrapper.className = 'die-wrapper rolling';

    // Start with random value
    const config = DICE_CONFIGS[die.type];
    const tempDie: DieRoll = { ...die, value: Math.ceil(Math.random() * config.faces) };
    const svg = renderDie(tempDie, dieSize);
    wrapper.appendChild(svg);

    diceContainer.appendChild(wrapper);
    dieElements.push(wrapper);
  }

  container.appendChild(diceContainer);

  // Animate through random values
  const startTime = Date.now();
  const interval = 50; // Update every 50ms

  const animate = () => {
    const elapsed = Date.now() - startTime;

    if (elapsed < duration) {
      // Update each die with random value
      dieElements.forEach((wrapper, index) => {
        const die = finalResult.dice[index];
        const config = DICE_CONFIGS[die.type];
        const randomValue = Math.ceil(Math.random() * config.faces);
        const tempDie: DieRoll = { ...die, value: randomValue };

        wrapper.innerHTML = '';
        wrapper.appendChild(renderDie(tempDie, dieSize));
      });

      setTimeout(animate, interval);
    } else {
      // Animation complete - show final values
      container.classList.remove('rolling');
      dieElements.forEach((wrapper, index) => {
        wrapper.classList.remove('rolling');
        wrapper.classList.add('settled');
        wrapper.innerHTML = '';
        wrapper.appendChild(renderDie(finalResult.dice[index], dieSize));
      });

      // Add total
      const totalEl = document.createElement('div');
      totalEl.className = 'dice-total';
      totalEl.innerHTML = `<span class="total-label">Total:</span> <span class="total-value">${finalResult.total}</span>`;
      container.appendChild(totalEl);

      if (onComplete) {
        onComplete();
      }
    }
  };

  animate();
}

/** Get CSS styles for dice UI */
export function getDiceStyles(): string {
  return `
    .dice-roll-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .dice-container {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .die-wrapper {
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      border-radius: 8px;
    }

    .die-wrapper:hover:not(.used) {
      transform: scale(1.1);
    }

    .die-wrapper.selected {
      box-shadow: 0 0 0 3px #4caf50, 0 4px 12px rgba(76, 175, 80, 0.4);
      transform: scale(1.05);
    }

    .die-wrapper.used {
      opacity: 0.4;
      filter: grayscale(0.5);
      cursor: not-allowed;
    }

    .die-wrapper.rolling {
      animation: dice-tumble 0.1s ease-in-out infinite;
    }

    .die-wrapper.settled {
      animation: dice-bounce 0.3s ease-out;
    }

    @keyframes dice-tumble {
      0%, 100% { transform: rotate(-5deg) scale(1); }
      50% { transform: rotate(5deg) scale(1.05); }
    }

    @keyframes dice-bounce {
      0% { transform: scale(1.2); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }

    .dice-total {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      padding: 0.5rem 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .total-label {
      color: #666;
      font-weight: normal;
    }

    .total-value {
      color: #1976d2;
      margin-left: 0.5rem;
    }

    .die {
      filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.3));
    }
  `;
}
