// Expression UI Components
// Visual rendering for expression cards, slots, and builders

import {
  ExpressionCard,
  ExpressionSlot,
  ExpressionBuilder,
  TargetChallenge,
} from './types';
import { validateSlots, evaluate, formatNumber } from './evaluator';

// =============================================================================
// Style Injection
// =============================================================================

let stylesInjected = false;

export function injectExpressionStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .expression-card {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 64px;
      border-radius: 8px;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s, box-shadow 0.15s;
      border: 2px solid #333;
    }

    .expression-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .expression-card.number {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      color: #1565c0;
    }

    .expression-card.operator {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #e65100;
    }

    .expression-card.lparen,
    .expression-card.rparen {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      color: #7b1fa2;
    }

    .expression-card.dragging {
      opacity: 0.5;
    }

    .expression-card.selected {
      box-shadow: 0 0 0 3px #2196f3;
    }

    .expression-slot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 68px;
      border: 2px dashed #bbb;
      border-radius: 8px;
      background: #fafafa;
      margin: 4px;
      transition: border-color 0.2s, background 0.2s;
    }

    .expression-slot.highlight {
      border-color: #4caf50;
      background: #e8f5e9;
    }

    .expression-slot.locked {
      border-style: solid;
      background: #eeeeee;
    }

    .expression-slot.filled {
      border-color: transparent;
      background: transparent;
    }

    .expression-builder {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 12px;
      min-height: 80px;
    }

    .expression-result {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      text-align: center;
      font-size: 1.25rem;
    }

    .expression-result.valid {
      border: 2px solid #4caf50;
      color: #2e7d32;
    }

    .expression-result.invalid {
      border: 2px solid #f44336;
      color: #c62828;
    }

    .expression-result.neutral {
      border: 2px solid #9e9e9e;
      color: #616161;
    }

    .card-tray {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 1rem;
      background: #fafafa;
      border-radius: 12px;
      justify-content: center;
    }

    .target-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .target-display .label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .target-display .value {
      font-size: 3rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .available-numbers {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .available-numbers .number-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 1.1rem;
      border: 2px solid #2e7d32;
      color: #2e7d32;
    }

    .challenge-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .challenge-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .challenge-card .target {
      font-size: 2rem;
      font-weight: bold;
      color: #1565c0;
      text-align: center;
    }

    .challenge-card .numbers {
      display: flex;
      gap: 0.25rem;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .challenge-card .numbers span {
      background: #e3f2fd;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .equation-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      padding: 1rem;
    }

    .equation-display .equals {
      font-size: 2rem;
      color: #666;
    }

    .equation-display.correct .equals {
      color: #4caf50;
    }

    .equation-display.incorrect .equals {
      color: #f44336;
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// Card Rendering
// =============================================================================

/**
 * Render an expression card as HTML element
 */
export function renderCard(
  card: ExpressionCard,
  options?: {
    onClick?: (card: ExpressionCard) => void;
    draggable?: boolean;
    selected?: boolean;
  }
): HTMLElement {
  const el = document.createElement('div');
  el.className = `expression-card ${card.tokenType}`;
  el.textContent = card.content;
  el.dataset.cardId = card.id;

  if (options?.selected) {
    el.classList.add('selected');
  }

  if (options?.draggable) {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      el.classList.add('dragging');
      e.dataTransfer?.setData('text/plain', card.id);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
  }

  if (options?.onClick) {
    el.addEventListener('click', () => options.onClick!(card));
  }

  return el;
}

/**
 * Render an expression card as SVG
 */
export function renderCardSVG(
  card: ExpressionCard,
  x: number,
  y: number,
  options?: {
    width?: number;
    height?: number;
  }
): SVGGElement {
  const width = options?.width ?? 40;
  const height = options?.height ?? 56;

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${x}, ${y})`);
  g.dataset.cardId = card.id;

  // Background colors based on type
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    number: { bg: '#e3f2fd', border: '#1565c0', text: '#1565c0' },
    operator: { bg: '#fff3e0', border: '#e65100', text: '#e65100' },
    lparen: { bg: '#f3e5f5', border: '#7b1fa2', text: '#7b1fa2' },
    rparen: { bg: '#f3e5f5', border: '#7b1fa2', text: '#7b1fa2' },
  };

  const color = colors[card.tokenType];

  // Card background
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', width.toString());
  rect.setAttribute('height', height.toString());
  rect.setAttribute('rx', '6');
  rect.setAttribute('fill', color.bg);
  rect.setAttribute('stroke', color.border);
  rect.setAttribute('stroke-width', '2');
  g.appendChild(rect);

  // Card text
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', (width / 2).toString());
  text.setAttribute('y', (height / 2 + 6).toString());
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', color.text);
  text.setAttribute('font-size', '20');
  text.setAttribute('font-weight', 'bold');
  text.textContent = card.content;
  g.appendChild(text);

  return g;
}

// =============================================================================
// Slot Rendering
// =============================================================================

/**
 * Render an expression slot
 */
export function renderSlot(
  slot: ExpressionSlot,
  options?: {
    onDrop?: (slot: ExpressionSlot, cardId: string) => void;
    onClick?: (slot: ExpressionSlot) => void;
    highlighted?: boolean;
  }
): HTMLElement {
  const el = document.createElement('div');
  el.className = 'expression-slot';
  el.dataset.slotId = slot.id;

  if (slot.locked) {
    el.classList.add('locked');
  }

  if (slot.card) {
    el.classList.add('filled');
    el.appendChild(
      renderCard(slot.card, {
        onClick: options?.onClick ? () => options.onClick!(slot) : undefined,
      })
    );
  }

  if (options?.highlighted) {
    el.classList.add('highlight');
  }

  // Drag and drop handling
  if (options?.onDrop && !slot.locked) {
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('highlight');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('highlight');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('highlight');
      const cardId = e.dataTransfer?.getData('text/plain');
      if (cardId) {
        options.onDrop!(slot, cardId);
      }
    });
  }

  if (options?.onClick && !slot.card) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => options.onClick!(slot));
  }

  return el;
}

// =============================================================================
// Expression Builder UI
// =============================================================================

/**
 * Render the expression builder with slots
 */
export function renderExpressionBuilder(
  builder: ExpressionBuilder,
  options?: {
    onSlotClick?: (slot: ExpressionSlot) => void;
    onDrop?: (slot: ExpressionSlot, cardId: string) => void;
    showResult?: boolean;
  }
): HTMLElement {
  const container = document.createElement('div');

  // Builder area
  const builderEl = document.createElement('div');
  builderEl.className = 'expression-builder';

  for (const slot of builder.slots) {
    builderEl.appendChild(
      renderSlot(slot, {
        onClick: options?.onSlotClick,
        onDrop: options?.onDrop,
      })
    );
  }

  container.appendChild(builderEl);

  // Result display
  if (options?.showResult) {
    const validation = validateSlots(builder.slots);
    const resultEl = document.createElement('div');
    resultEl.className = 'expression-result';

    if (validation.canEvaluate && validation.result !== undefined) {
      const matchesTarget =
        builder.targetValue !== undefined &&
        Math.abs(validation.result - builder.targetValue) < 0.0001;

      resultEl.classList.add(matchesTarget ? 'valid' : 'neutral');
      resultEl.innerHTML = `= <strong>${formatNumber(validation.result)}</strong>`;

      if (builder.targetValue !== undefined) {
        if (matchesTarget) {
          resultEl.innerHTML += ' ✓';
        } else {
          resultEl.innerHTML += ` (target: ${builder.targetValue})`;
        }
      }
    } else if (!validation.isValid || validation.errors.length > 0) {
      resultEl.classList.add('invalid');
      resultEl.textContent = validation.errors[0] || 'Invalid expression';
    } else {
      resultEl.classList.add('neutral');
      resultEl.textContent = 'Build your expression...';
    }

    container.appendChild(resultEl);
  }

  return container;
}

// =============================================================================
// Card Tray
// =============================================================================

/**
 * Render a tray of available cards
 */
export function renderCardTray(
  cards: ExpressionCard[],
  options?: {
    onClick?: (card: ExpressionCard) => void;
    draggable?: boolean;
    selectedId?: string;
    usedIds?: Set<string>;
  }
): HTMLElement {
  const tray = document.createElement('div');
  tray.className = 'card-tray';

  for (const card of cards) {
    const isUsed = options?.usedIds?.has(card.id);
    if (isUsed) continue;

    tray.appendChild(
      renderCard(card, {
        onClick: options?.onClick,
        draggable: options?.draggable,
        selected: card.id === options?.selectedId,
      })
    );
  }

  return tray;
}

// =============================================================================
// Target Challenge Display
// =============================================================================

/**
 * Render a target challenge header
 */
export function renderTargetDisplay(challenge: TargetChallenge): HTMLElement {
  const container = document.createElement('div');
  container.className = 'target-display';

  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = 'Make this number:';
  container.appendChild(label);

  const value = document.createElement('div');
  value.className = 'value';
  value.textContent = challenge.target.toString();
  container.appendChild(value);

  const numbers = document.createElement('div');
  numbers.className = 'available-numbers';

  for (const num of challenge.numbers) {
    const chip = document.createElement('span');
    chip.className = 'number-chip';
    chip.textContent = num.toString();
    numbers.appendChild(chip);
  }

  container.appendChild(numbers);

  return container;
}

/**
 * Render a challenge card (for selection)
 */
export function renderChallengeCard(
  challenge: TargetChallenge,
  onClick?: () => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'challenge-card';

  const target = document.createElement('div');
  target.className = 'target';
  target.textContent = `= ${challenge.target}`;
  card.appendChild(target);

  const numbers = document.createElement('div');
  numbers.className = 'numbers';

  for (const num of challenge.numbers) {
    const span = document.createElement('span');
    span.textContent = num.toString();
    numbers.appendChild(span);
  }

  card.appendChild(numbers);

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  return card;
}

// =============================================================================
// Interactive Expression Builder
// =============================================================================

export interface InteractiveBuilderOptions {
  slotCount: number;
  availableCards: ExpressionCard[];
  targetValue?: number;
  onComplete?: (expression: string, result: number) => void;
}

/**
 * Create a fully interactive expression builder
 */
export function createInteractiveBuilder(
  container: HTMLElement,
  options: InteractiveBuilderOptions
): {
  getExpression: () => string;
  getResult: () => number | null;
  reset: () => void;
} {
  injectExpressionStyles();

  // State
  const slots: ExpressionSlot[] = Array.from({ length: options.slotCount }, (_, i) => ({
    id: `slot-${i}`,
    index: i,
    card: null,
  }));

  let selectedCard: ExpressionCard | null = null;
  const usedCardIds = new Set<string>();

  function render(): void {
    container.innerHTML = '';

    // Target display
    if (options.targetValue !== undefined) {
      const targetEl = document.createElement('div');
      targetEl.className = 'target-display';
      targetEl.innerHTML = `
        <div class="label">Target:</div>
        <div class="value">${options.targetValue}</div>
      `;
      container.appendChild(targetEl);
    }

    // Expression builder
    const builder: ExpressionBuilder = {
      slots,
      targetValue: options.targetValue,
    };

    const builderEl = renderExpressionBuilder(builder, {
      showResult: true,
      onSlotClick: (slot) => {
        if (slot.card && !slot.locked) {
          // Remove card from slot
          usedCardIds.delete(slot.card.id);
          slot.card = null;
          render();
        } else if (selectedCard && !slot.card) {
          // Place selected card
          slot.card = selectedCard;
          usedCardIds.add(selectedCard.id);
          selectedCard = null;
          render();
          checkComplete();
        }
      },
    });

    container.appendChild(builderEl);

    // Card tray
    const trayLabel = document.createElement('div');
    trayLabel.style.cssText = 'margin: 1rem 0 0.5rem; color: #666; text-align: center;';
    trayLabel.textContent = selectedCard
      ? 'Click a slot to place the card'
      : 'Select a card to place';
    container.appendChild(trayLabel);

    const tray = renderCardTray(options.availableCards, {
      onClick: (card) => {
        selectedCard = selectedCard?.id === card.id ? null : card;
        render();
      },
      selectedId: selectedCard?.id,
      usedIds: usedCardIds,
    });

    container.appendChild(tray);

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Clear All';
    resetBtn.style.cssText =
      'margin-top: 1rem; padding: 0.5rem 1rem; border: 2px solid #ddd; border-radius: 6px; background: white; cursor: pointer;';
    resetBtn.addEventListener('click', () => {
      reset();
      render();
    });
    container.appendChild(resetBtn);
  }

  function checkComplete(): void {
    const validation = validateSlots(slots);
    if (
      validation.canEvaluate &&
      validation.result !== undefined &&
      options.targetValue !== undefined &&
      Math.abs(validation.result - options.targetValue) < 0.0001
    ) {
      const expr = slots
        .filter((s) => s.card)
        .map((s) => s.card!.content)
        .join(' ');
      options.onComplete?.(expr, validation.result);
    }
  }

  function getExpression(): string {
    return slots
      .filter((s) => s.card)
      .map((s) => s.card!.content)
      .join(' ');
  }

  function getResult(): number | null {
    const result = evaluate(getExpression());
    return result.success ? result.value ?? null : null;
  }

  function reset(): void {
    for (const slot of slots) {
      slot.card = null;
    }
    usedCardIds.clear();
    selectedCard = null;
  }

  render();

  return { getExpression, getResult, reset };
}

// =============================================================================
// Calculator Display
// =============================================================================

/**
 * Render a calculator-style expression display
 */
export function renderCalculatorDisplay(
  expression: string,
  result?: number,
  error?: string
): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = `
    background: #1a1a2e;
    color: #eee;
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
  `;

  const exprEl = document.createElement('div');
  exprEl.style.cssText = 'font-size: 1.25rem; color: #aaa; margin-bottom: 0.5rem;';
  exprEl.textContent = expression || '0';
  container.appendChild(exprEl);

  const resultEl = document.createElement('div');
  resultEl.style.cssText = 'font-size: 2rem; font-weight: bold;';

  if (error) {
    resultEl.style.color = '#f44336';
    resultEl.textContent = error;
  } else if (result !== undefined) {
    resultEl.style.color = '#4caf50';
    resultEl.textContent = `= ${formatNumber(result)}`;
  } else {
    resultEl.textContent = '';
  }

  container.appendChild(resultEl);

  return container;
}
