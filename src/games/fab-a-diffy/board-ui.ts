// Fab-a-Diffy Board UI
// Rendering fraction bars, answer board, and operation selection

import { FabADiffyState, FractionBar, AnswerBar } from './types';
import { FractionOperation } from '../../core/fractions/types';
import { formatFraction, simplify } from '../../core/fractions/arithmetic';
import {
  findMatchingAnswers,
  calculateResult,
  getOperationSymbol,
} from './rules';
import { renderHorizontalBar, getFractionColor } from '../../core/fractions/fraction-bar-ui';

// Colors
const COLORS = {
  background: '#f5f5f5',
  player1: '#2196f3',
  player2: '#f44336',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  selected: '#ff9800',
  valid: '#4caf50',
  validLight: '#c8e6c9',
  disabled: '#bdbdbd',
};

/**
 * Render the fraction bar pool
 */
export function renderFractionBarPool(
  state: FabADiffyState,
  onBarClick: (barId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fab-bar-pool';

  const header = document.createElement('h3');
  header.textContent = 'Fraction Bars';
  header.className = 'fab-section-header';
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'fab-bar-grid';

  // Group bars by denominator
  const barsByDenom = new Map<number, FractionBar[]>();
  for (const bar of state.fractionBars.values()) {
    const denom = bar.fraction.denominator;
    if (!barsByDenom.has(denom)) {
      barsByDenom.set(denom, []);
    }
    barsByDenom.get(denom)!.push(bar);
  }

  // Sort denominators
  const denoms = Array.from(barsByDenom.keys()).sort((a, b) => a - b);

  for (const denom of denoms) {
    const bars = barsByDenom.get(denom)!;
    // Sort by numerator
    bars.sort((a, b) => a.fraction.numerator - b.fraction.numerator);

    const group = document.createElement('div');
    group.className = 'fab-bar-group';

    for (const bar of bars) {
      const barEl = createFractionBarElement(state, bar, onBarClick);
      group.appendChild(barEl);
    }

    grid.appendChild(group);
  }

  container.appendChild(grid);
  return container;
}

/**
 * Create a single fraction bar element
 */
function createFractionBarElement(
  state: FabADiffyState,
  bar: FractionBar,
  onClick: (barId: string) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fab-bar-wrapper';
  wrapper.dataset.barId = bar.id;

  // Determine state
  const isSelected = state.selectedBar1 === bar.id || state.selectedBar2 === bar.id;
  const isUsed = bar.used;
  const isSelectable =
    !isUsed &&
    (state.phase === 'selectingBar1' ||
      (state.phase === 'selectingBar2' && state.selectedBar1 !== bar.id));

  // Apply classes
  if (isSelected) wrapper.classList.add('fab-bar-selected');
  if (isUsed) wrapper.classList.add('fab-bar-used');
  if (!isSelectable) wrapper.classList.add('fab-bar-disabled');

  // Create visual bar
  const svg = renderHorizontalBar(bar.fraction, {
    width: 100,
    height: 30,
    colors: {
      filled: isUsed
        ? COLORS.disabled
        : isSelected
          ? COLORS.selected
          : getFractionColor(bar.fraction.denominator),
      empty: '#e0e0e0',
      border: isSelected ? COLORS.selected : '#666',
    },
    showLabel: true,
    labelPosition: 'below',
  });

  wrapper.appendChild(svg);

  // Click handler
  if (isSelectable) {
    wrapper.style.cursor = 'pointer';
    wrapper.addEventListener('click', () => onClick(bar.id));
  }

  return wrapper;
}

/**
 * Render the answer bar board
 */
export function renderAnswerBoard(
  state: FabADiffyState,
  onAnswerClick: (answerId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fab-answer-board';

  const header = document.createElement('h3');
  header.textContent = 'Answer Bars';
  header.className = 'fab-section-header';
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'fab-answer-grid';

  // Find which answers are currently matchable
  const matchableAnswers = new Set<string>();
  if (state.selectedBar1 && state.selectedBar2 && state.selectedOperation) {
    const bar1 = state.fractionBars.get(state.selectedBar1);
    const bar2 = state.fractionBars.get(state.selectedBar2);
    if (bar1 && bar2) {
      const result = calculateResult(bar1.fraction, bar2.fraction, state.selectedOperation);
      if (result) {
        const matches = findMatchingAnswers(state, result);
        matches.forEach((id) => matchableAnswers.add(id));
      }
    }
  }

  for (const answer of state.answerBars.values()) {
    const answerEl = createAnswerBarElement(
      answer,
      matchableAnswers.has(answer.id),
      onAnswerClick
    );
    grid.appendChild(answerEl);
  }

  container.appendChild(grid);
  return container;
}

/**
 * Create an answer bar element
 */
function createAnswerBarElement(
  answer: AnswerBar,
  isMatchable: boolean,
  onClick: (answerId: string) => void
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fab-answer-wrapper';
  wrapper.dataset.answerId = answer.id;

  // Determine state
  const isClaimed = answer.claimedBy !== null;

  if (isClaimed) {
    wrapper.classList.add(`fab-answer-${answer.claimedBy}`);
  }
  if (isMatchable) {
    wrapper.classList.add('fab-answer-matchable');
  }

  // Create visual bar
  const color = isClaimed
    ? answer.claimedBy === 'player1'
      ? COLORS.player1
      : COLORS.player2
    : isMatchable
      ? COLORS.valid
      : getFractionColor(answer.fraction.denominator);

  const svg = renderHorizontalBar(answer.fraction, {
    width: 80,
    height: 25,
    colors: {
      filled: color,
      empty: '#e0e0e0',
      border: isMatchable ? COLORS.valid : '#666',
    },
    showLabel: true,
    labelPosition: 'below',
  });

  wrapper.appendChild(svg);

  // Click handler
  if (isMatchable && !isClaimed) {
    wrapper.style.cursor = 'pointer';
    wrapper.addEventListener('click', () => onClick(answer.id));
  }

  return wrapper;
}

/**
 * Render operation selection
 */
export function renderOperationSelector(
  state: FabADiffyState,
  onSelect: (op: FractionOperation) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fab-operation-selector';

  if (!state.selectedBar1 || !state.selectedBar2) {
    return container;
  }

  const bar1 = state.fractionBars.get(state.selectedBar1);
  const bar2 = state.fractionBars.get(state.selectedBar2);
  if (!bar1 || !bar2) return container;

  // Show selected fractions
  const preview = document.createElement('div');
  preview.className = 'fab-operation-preview';
  preview.innerHTML = `
    <span class="fab-fraction">${formatFraction(simplify(bar1.fraction))}</span>
    <span class="fab-op-placeholder">?</span>
    <span class="fab-fraction">${formatFraction(simplify(bar2.fraction))}</span>
    <span class="fab-equals">=</span>
    <span class="fab-result">?</span>
  `;
  container.appendChild(preview);

  // Get possible results for each operation
  const operations: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

  const buttons = document.createElement('div');
  buttons.className = 'fab-operation-buttons';

  for (const op of operations) {
    const result = calculateResult(bar1.fraction, bar2.fraction, op);
    const hasMatch = result ? findMatchingAnswers(state, result).length > 0 : false;

    const btn = document.createElement('button');
    btn.className = 'fab-op-btn';
    if (state.selectedOperation === op) {
      btn.classList.add('fab-op-selected');
    }
    if (hasMatch) {
      btn.classList.add('fab-op-valid');
    }

    const symbol = getOperationSymbol(op);
    const resultStr = result ? formatFraction(simplify(result)) : '—';

    btn.innerHTML = `
      <span class="fab-op-symbol">${symbol}</span>
      <span class="fab-op-result">${resultStr}</span>
    `;

    if (result && result.numerator >= 0) {
      btn.addEventListener('click', () => onSelect(op));
    } else {
      btn.disabled = true;
      btn.classList.add('fab-op-disabled');
    }

    buttons.appendChild(btn);
  }

  container.appendChild(buttons);
  return container;
}

/**
 * Render score display
 */
export function renderScores(state: FabADiffyState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fab-scores';

  const p1 = document.createElement('div');
  p1.className = 'fab-score fab-score-p1';
  p1.innerHTML = `<span class="fab-score-label">Blue</span><span class="fab-score-value">${state.scores.player1}</span>`;

  const p2 = document.createElement('div');
  p2.className = 'fab-score fab-score-p2';
  p2.innerHTML = `<span class="fab-score-label">Red</span><span class="fab-score-value">${state.scores.player2}</span>`;

  container.appendChild(p1);
  container.appendChild(p2);

  return container;
}

/**
 * Render move history
 */
export function renderMoveHistory(state: FabADiffyState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fab-history';

  const header = document.createElement('h3');
  header.textContent = 'Move History';
  header.className = 'fab-section-header';
  container.appendChild(header);

  const list = document.createElement('div');
  list.className = 'fab-history-list';

  for (const move of state.moveHistory.slice(-10)) {
    const bar1 = state.fractionBars.get(move.bar1Id);
    const bar2 = state.fractionBars.get(move.bar2Id);
    const answer = state.answerBars.get(move.resultId);

    if (!bar1 || !bar2 || !answer) continue;

    const moveEl = document.createElement('div');
    moveEl.className = `fab-history-move fab-history-${move.player}`;
    moveEl.innerHTML = `
      <span class="fab-move-num">${move.moveNumber}.</span>
      <span class="fab-move-expr">
        ${formatFraction(simplify(bar1.fraction))}
        ${getOperationSymbol(move.operation)}
        ${formatFraction(simplify(bar2.fraction))}
        =
        ${formatFraction(simplify(answer.fraction))}
      </span>
    `;
    list.appendChild(moveEl);
  }

  container.appendChild(list);
  return container;
}

/**
 * Inject CSS styles
 */
export function injectFabStyles(): void {
  const existingStyle = document.getElementById('fab-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'fab-styles';
  style.textContent = `
    .fab-game-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .fab-main-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
    }

    .fab-section-header {
      margin: 0 0 0.75rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e0e0e0;
      font-size: 1.1rem;
      color: #333;
    }

    .fab-bar-pool {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .fab-bar-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .fab-bar-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .fab-bar-wrapper {
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s ease;
    }

    .fab-bar-wrapper:not(.fab-bar-disabled):hover {
      background: #e3f2fd;
      transform: translateY(-2px);
    }

    .fab-bar-selected {
      background: #fff3e0 !important;
      box-shadow: 0 0 0 2px ${COLORS.selected};
    }

    .fab-bar-used {
      opacity: 0.4;
    }

    .fab-bar-disabled {
      cursor: not-allowed;
    }

    .fab-answer-board {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .fab-answer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.5rem;
    }

    .fab-answer-wrapper {
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s ease;
    }

    .fab-answer-matchable {
      background: ${COLORS.validLight};
      animation: fab-pulse 1s ease-in-out infinite;
    }

    @keyframes fab-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
    }

    .fab-answer-player1 {
      background: ${COLORS.player1Light};
    }

    .fab-answer-player2 {
      background: ${COLORS.player2Light};
    }

    .fab-operation-selector {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .fab-operation-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 600;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .fab-fraction {
      color: #333;
    }

    .fab-op-placeholder, .fab-result {
      color: #999;
    }

    .fab-equals {
      color: #666;
    }

    .fab-operation-buttons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }

    .fab-op-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 1.25rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .fab-op-btn:hover:not(:disabled) {
      border-color: ${COLORS.selected};
      background: #fff8e1;
    }

    .fab-op-valid {
      border-color: ${COLORS.valid};
      background: ${COLORS.validLight};
    }

    .fab-op-selected {
      border-color: ${COLORS.selected};
      background: #fff3e0;
    }

    .fab-op-disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .fab-op-symbol {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .fab-op-result {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.25rem;
    }

    .fab-scores {
      display: flex;
      justify-content: center;
      gap: 2rem;
      padding: 0.75rem;
    }

    .fab-score {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .fab-score-p1 {
      background: ${COLORS.player1Light};
      color: ${COLORS.player1};
    }

    .fab-score-p2 {
      background: ${COLORS.player2Light};
      color: ${COLORS.player2};
    }

    .fab-score-value {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .fab-history {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .fab-history-list {
      max-height: 200px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .fab-history-move {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .fab-history-player1 {
      background: ${COLORS.player1Light};
    }

    .fab-history-player2 {
      background: ${COLORS.player2Light};
    }

    .fab-move-num {
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .fab-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .fab-status.player1 {
      color: ${COLORS.player1};
    }

    .fab-status.player2 {
      color: ${COLORS.player2};
    }

    .fab-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 12px;
      margin: 1rem;
      animation: fab-glow 1s ease-in-out infinite alternate;
    }

    @keyframes fab-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    .fab-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 0.5rem;
    }

    .fab-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .fab-btn-primary {
      background: ${COLORS.player1};
      color: white;
    }

    .fab-btn-primary:hover {
      background: #1976d2;
    }

    .fab-btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .fab-btn-secondary:hover {
      background: #bdbdbd;
    }

    @media (max-width: 768px) {
      .fab-main-layout {
        grid-template-columns: 1fr;
      }

      .fab-operation-preview {
        font-size: 1.2rem;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
