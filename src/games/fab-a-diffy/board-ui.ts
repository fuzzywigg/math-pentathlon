// Fab-a-Diffy Board UI
// Rendering fraction bars, answer board, and operation selection

import type { FabADiffyState, FractionBar, AnswerBar } from './types';
import type { FractionOperation } from '../../core/fractions/types';
import { formatFraction, simplify } from '../../core/fractions/arithmetic';
import { injectStylesOnce } from '../../ui/inject-styles';
import {
  findMatchingAnswers,
  calculateResult,
  getOperationSymbol,
} from './rules';
import {
  renderHorizontalBar,
  getFractionColor,
} from '../../core/fractions/fraction-bar-ui';
import { getPlayerSeatColors, seatIcon } from '../../ui/player-colors';
import { replaceWithSafeHtml, safeHtml } from '../../core/dom-security';

import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindCellActivateKeys,
  collectGridCells,
  applyRovingTabindex,
} from '../../ui/board-a11y';
import { getPlayerName } from '../../ui/seat-labels';
export { getPlayerName };

// Colors
const COLORS = {
  background: '#f5f5f5',
  selected: '#ff9800',
  valid: '#4caf50',
  validLight: '#c8e6c9',
  disabled: '#bdbdbd',
};

export interface FabBoardRenderOptions {
  /** When false, suppress selectable/matchable chrome and click handlers (AI seat). */
  allowInput?: boolean;
}

/**
 * Render the fraction bar pool
 */
export function renderFractionBarPool(
  state: FabADiffyState,
  onBarClick: (barId: string) => void,
  options: FabBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'fab-bar-pool';

  const header = document.createElement('h2');
  header.textContent = 'Fraction Bars';
  header.className = 'fab-section-header';
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'fab-bar-grid';
  markBoardAsGrid(grid);

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

  let rowIndex = 0;
  for (const denom of denoms) {
    const bars = barsByDenom.get(denom)!;
    // Sort by numerator
    bars.sort((a, b) => a.fraction.numerator - b.fraction.numerator);

    const group = document.createElement('div');
    group.className = 'fab-bar-group';

    bars.forEach((bar, colIndex) => {
      const barEl = createFractionBarElement(
        state,
        bar,
        onBarClick,
        rowIndex,
        colIndex,
        allowInput
      );
      group.appendChild(barEl);
    });

    grid.appendChild(group);
    rowIndex++;
  }

  bindGridNavigation(grid);
  applyRovingTabindex(collectGridCells(grid));
  container.appendChild(grid);
  return container;
}

/**
 * Create a single fraction bar element
 */
function createFractionBarElement(
  state: FabADiffyState,
  bar: FractionBar,
  onClick: (barId: string) => void,
  row: number,
  col: number,
  allowInput: boolean = true
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fab-bar-wrapper';
  wrapper.dataset.barId = bar.id;
  wrapper.dataset.row = String(row);
  wrapper.dataset.col = String(col);

  // Determine state
  const isSelected =
    allowInput &&
    (state.selectedBar1 === bar.id || state.selectedBar2 === bar.id);
  const isUsed = bar.used;
  const isSelectable =
    allowInput &&
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
    const activate = () => onClick(bar.id);
    wrapper.addEventListener('click', activate);
    bindCellActivateKeys(wrapper, activate);
  }

  makeGridCell(
    wrapper,
    buildCellAriaLabel({
      coord: formatFraction(simplify(bar.fraction)),
      empty: !isUsed && !isSelected,
      selectable: isSelectable,
      extras: [isSelected ? 'selected' : '', isUsed ? 'used' : ''].filter(
        Boolean
      ),
    })
  );
  if (!isSelectable) {
    wrapper.setAttribute('aria-disabled', 'true');
  }

  return wrapper;
}

/**
 * Render the answer bar board
 */
export function renderAnswerBoard(
  state: FabADiffyState,
  onAnswerClick: (answerId: string) => void,
  options: FabBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'fab-answer-board';

  const header = document.createElement('h2');
  header.textContent = 'Answer Bars';
  header.className = 'fab-section-header';
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'fab-answer-grid';
  markBoardAsGrid(grid);

  // Find which answers are currently matchable (suppressed while AI thinks)
  const matchableAnswers = new Set<string>();
  if (
    allowInput &&
    state.selectedBar1 &&
    state.selectedBar2 &&
    state.selectedOperation
  ) {
    const bar1 = state.fractionBars.get(state.selectedBar1);
    const bar2 = state.fractionBars.get(state.selectedBar2);
    if (bar1 && bar2) {
      const result = calculateResult(
        bar1.fraction,
        bar2.fraction,
        state.selectedOperation
      );
      if (result) {
        const matches = findMatchingAnswers(state, result);
        matches.forEach((id) => matchableAnswers.add(id));
      }
    }
  }

  const ANSWER_COLS = 4;
  let answerIndex = 0;
  for (const answer of state.answerBars.values()) {
    const answerEl = createAnswerBarElement(
      answer,
      matchableAnswers.has(answer.id),
      onAnswerClick,
      Math.floor(answerIndex / ANSWER_COLS),
      answerIndex % ANSWER_COLS
    );
    grid.appendChild(answerEl);
    answerIndex++;
  }

  bindGridNavigation(grid);
  applyRovingTabindex(collectGridCells(grid));
  container.appendChild(grid);
  return container;
}

/**
 * Create an answer bar element
 */
function createAnswerBarElement(
  answer: AnswerBar,
  isMatchable: boolean,
  onClick: (answerId: string) => void,
  row: number,
  col: number
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'fab-answer-wrapper';
  wrapper.dataset.answerId = answer.id;
  wrapper.dataset.row = String(row);
  wrapper.dataset.col = String(col);

  // Determine state
  const isClaimed = answer.claimedBy !== null;

  if (isClaimed) {
    wrapper.classList.add(`fab-answer-${answer.claimedBy}`);
  }
  if (isMatchable) {
    wrapper.classList.add('fab-answer-matchable');
  }

  // Create visual bar
  const seats = getPlayerSeatColors();
  const color = isClaimed
    ? answer.claimedBy === 'player1'
      ? seats.player1
      : seats.player2
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
    const activate = () => onClick(answer.id);
    wrapper.addEventListener('click', activate);
    bindCellActivateKeys(wrapper, activate);
  } else if (!isClaimed) {
    wrapper.setAttribute('aria-disabled', 'true');
  }

  const owner =
    isClaimed && answer.claimedBy ? getPlayerName(answer.claimedBy) : undefined;
  makeGridCell(
    wrapper,
    buildCellAriaLabel({
      coord: formatFraction(simplify(answer.fraction)),
      empty: !isClaimed,
      ...(owner !== undefined ? { owner } : {}),
      validPlacement: isMatchable && !isClaimed,
    })
  );

  return wrapper;
}

/**
 * Render operation selection
 */
export function renderOperationSelector(
  state: FabADiffyState,
  onSelect: (op: FractionOperation) => void,
  options: FabBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
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
  replaceWithSafeHtml(
    preview,
    safeHtml`
    <span class="fab-fraction">${formatFraction(simplify(bar1.fraction))}</span>
    <span class="fab-op-placeholder">?</span>
    <span class="fab-fraction">${formatFraction(simplify(bar2.fraction))}</span>
    <span class="fab-equals">=</span>
    <span class="fab-result">?</span>
  `
  );
  container.appendChild(preview);

  // Get possible results for each operation
  const operations: FractionOperation[] = [
    'add',
    'subtract',
    'multiply',
    'divide',
  ];

  const buttons = document.createElement('div');
  buttons.className = 'fab-operation-buttons';

  for (const op of operations) {
    const result = calculateResult(bar1.fraction, bar2.fraction, op);
    const hasMatch =
      allowInput && result
        ? findMatchingAnswers(state, result).length > 0
        : false;

    const btn = document.createElement('button');
    btn.className = 'fab-op-btn';
    if (allowInput && state.selectedOperation === op) {
      btn.classList.add('fab-op-selected');
    }
    if (hasMatch) {
      btn.classList.add('fab-op-valid');
    }

    const symbol = getOperationSymbol(op);
    const resultStr = result ? formatFraction(simplify(result)) : '—';

    replaceWithSafeHtml(
      btn,
      safeHtml`
      <span class="fab-op-symbol">${symbol}</span>
      <span class="fab-op-result">${resultStr}</span>
    `
    );

    // Only enable ops that claim at least one answer — avoids a confirmingMove
    // dead-end with no matchable targets (Clear Selection still recovers).
    if (allowInput && result && result.numerator >= 0 && hasMatch) {
      btn.addEventListener('click', () => onSelect(op));
    } else {
      btn.disabled = true;
      btn.classList.add('fab-op-disabled');
      btn.setAttribute('aria-disabled', 'true');
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
  replaceWithSafeHtml(
    p1,
    safeHtml`<span class="fab-score-label">${seatIcon('player1')} Blue</span><span class="fab-score-value">${state.scores.player1}</span>`
  );

  const p2 = document.createElement('div');
  p2.className = 'fab-score fab-score-p2';
  replaceWithSafeHtml(
    p2,
    safeHtml`<span class="fab-score-label">${seatIcon('player2')} Red</span><span class="fab-score-value">${state.scores.player2}</span>`
  );

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

  const header = document.createElement('h2');
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
    replaceWithSafeHtml(
      moveEl,
      safeHtml`
      <span class="fab-move-num">${move.moveNumber}.</span>
      <span class="fab-move-expr">
        ${formatFraction(simplify(bar1.fraction))}
        ${getOperationSymbol(move.operation)}
        ${formatFraction(simplify(bar2.fraction))}
        =
        ${formatFraction(simplify(answer.fraction))}
      </span>
    `
    );
    list.appendChild(moveEl);
  }

  container.appendChild(list);
  return container;
}

/**
 * Inject CSS styles
 */
export function injectFabStyles(): void {
  injectStylesOnce(
    'fab-styles',
    `
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
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
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
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .fab-answer-matchable {
      background: ${COLORS.validLight};
      box-shadow: 0 0 0 3px ${COLORS.valid};
      animation: fab-pulse 1s ease-in-out infinite;
    }

    @keyframes fab-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
    }

    .fab-answer-player1 {
      background: #bbdefb;
    }

    .fab-answer-player2 {
      background: #ffcdd2;
    }

    [data-opponent="ai"] .fab-answer-player2 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-answer-player1 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-answer-player2 {
      background: #ffcdd2;
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
      color: #64748b; /* was #999 (~2.9:1); AA ≥4.5:1 */
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
      min-height: 44px;
      min-width: 44px;
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
      background: #bbdefb;
      color: var(--color-player1-text, #1d4ed8);
    }

    .fab-score-p2 {
      background: #ffcdd2;
      color: var(--color-player2-text, #b91c1c);
    }

    [data-opponent="ai"] .fab-score-p2 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-score-p1 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-score-p2 {
      background: #ffcdd2;
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
      background: #bbdefb;
    }

    .fab-history-player2 {
      background: #ffcdd2;
    }

    [data-opponent="ai"] .fab-history-player2 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-history-player1 {
      background: #ddd6fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .fab-history-player2 {
      background: #ffcdd2;
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
      color: var(--color-player1-text, #1d4ed8);
    }

    .fab-status.player2 {
      color: var(--color-player2-text, #b91c1c);
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
      min-height: 44px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .fab-btn-primary {
      background: var(--color-player1, #2196f3);
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

      /* While claiming, float answers above the long bar pool. */
      .fab-main-layout.fab-phase-confirmingMove .fab-left-column {
        order: 2;
      }

      .fab-main-layout.fab-phase-confirmingMove .fab-right-column {
        order: 1;
      }

      .fab-operation-preview {
        font-size: 1.2rem;
      }

      .fab-operation-buttons {
        flex-wrap: wrap;
      }
    }

    @media (pointer: coarse) {
      .fab-bar-wrapper,
      .fab-answer-wrapper,
      .fab-op-btn,
      .fab-btn {
        min-height: 44px;
        min-width: 44px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .fab-answer-matchable,
      .fab-winner-banner {
        animation: none !important;
      }

      .fab-bar-wrapper:not(.fab-bar-disabled):hover,
      .fab-answer-wrapper:hover,
      .fab-op-btn:hover:not(:disabled),
      .fab-btn:hover {
        transform: none;
      }
    }
  `
  );
}

/**
 * Get player display name
 */
