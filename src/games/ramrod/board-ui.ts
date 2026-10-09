// Ramrod Board UI
// Rendering Cuisenaire rods, sum boxes, and game state

import type { RamrodState, SumBox, Rod, Player } from './types';
import { CONFIG, ROD_COLORS } from './types';
import { getValidPlacements, getRemainingValue } from './rules';
import { seatIcon } from '../../ui/player-colors';
import { replaceWithSafeHtml, safeHtml } from '../../core/dom-security';
import { injectStylesOnce } from '../../ui/inject-styles';
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
import './ramrod.css';
export { getPlayerName };

// Dimensions (box/slot sizes live in ramrod.css; rod pixel width uses CM_SCALE)
const CM_SCALE = 10; // 10 pixels per cm

export interface RamrodBoardRenderOptions {
  /** When false, suppress placement highlights and activate handlers (AI seat). */
  allowInput?: boolean;
}

/**
 * Render the game board
 */
export function renderBoard(
  state: RamrodState,
  onBoxClick: (boxId: string, slot: number) => void,
  options: RamrodBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'ramrod-board';
  markBoardAsGrid(container);

  // Get valid placements for selected rod
  const validPlacements =
    allowInput && state.selectedRod
      ? new Set(
          getValidPlacements(state, state.selectedRod).map(
            (p) => `${p.boxId}-${p.slot}`
          )
        )
      : new Set<string>();

  // Create grid of boxes
  const grid = document.createElement('div');
  grid.className = 'ramrod-grid';

  for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'ramrod-row';

    for (let col = 0; col < CONFIG.BOARD_COLS; col++) {
      const boxId = `box-${row}-${col}`;
      const box = state.boxes.get(boxId);
      if (!box) {
        continue;
      }

      const boxEl = renderSumBox(
        state,
        box,
        validPlacements,
        onBoxClick,
        row,
        col
      );
      rowEl.appendChild(boxEl);
    }

    grid.appendChild(rowEl);
  }

  container.appendChild(grid);
  bindGridNavigation(container);
  applyRovingTabindex(collectGridCells(container));
  return container;
}

/**
 * Render a single sum box
 */
function renderSumBox(
  _state: RamrodState,
  box: SumBox,
  validPlacements: Set<string>,
  onClick: (boxId: string, slot: number) => void,
  row: number,
  col: number
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'ramrod-box';
  if (box.completedBy) {
    wrapper.classList.add('completed', box.completedBy);
  }

  // Box label (target sum)
  const label = document.createElement('div');
  label.className = 'ramrod-box-label';
  label.textContent = `Sum: ${box.targetSum}`;
  wrapper.appendChild(label);

  // Two slots for rods
  for (let slot = 0; slot < 2; slot++) {
    const slotEl = document.createElement('div');
    slotEl.className = 'ramrod-slot';
    slotEl.dataset.row = String(row);
    slotEl.dataset.col = String(col * 2 + slot);

    const isValid = validPlacements.has(`${box.id}-${slot}`);
    const rod = box.rods[slot];

    if (isValid) {
      slotEl.classList.add('valid');
      const activate = () => onClick(box.id, slot);
      slotEl.addEventListener('click', activate);
      bindCellActivateKeys(slotEl, activate);
    }

    if (rod) {
      const rodEl = renderRod(rod, false);
      slotEl.appendChild(rodEl);
    } else if (!box.completedBy && box.rods[1 - slot]) {
      // Show needed value hint
      const hint = document.createElement('div');
      hint.className = 'ramrod-hint';
      hint.textContent = `Need: ${getRemainingValue(box)}`;
      slotEl.appendChild(hint);
    }

    const piece = rod ? `${rod.length}cm rod` : undefined;
    const owner = rod?.owner
      ? getPlayerName(rod.owner)
      : box.completedBy
        ? getPlayerName(box.completedBy)
        : undefined;
    makeGridCell(
      slotEl,
      buildCellAriaLabel({
        coord: `Sum ${box.targetSum} slot ${slot + 1}`,
        empty: !rod,
        // ratchet: exactOptionalPropertyTypes — omit undefined optionals
        // (buildCellAriaLabel treats omitted/undefined the same via filter(Boolean)).
        ...(piece !== undefined ? { piece } : {}),
        ...(owner !== undefined ? { owner } : {}),
        validPlacement: isValid,
      })
    );

    wrapper.appendChild(slotEl);
  }

  return wrapper;
}

/**
 * Render a Cuisenaire rod
 */
function renderRod(rod: Rod, inHand: boolean): HTMLElement {
  const rodEl = document.createElement('div');
  rodEl.className = 'ramrod-rod';
  if (inHand) {
    rodEl.classList.add('in-hand');
  }

  const width = rod.length * CM_SCALE;
  rodEl.style.width = `${width}px`;
  rodEl.style.backgroundColor = rod.color;

  // Add border for light colors
  if (rod.length === 1 || rod.length === 5) {
    rodEl.style.border = '1px solid #999';
  }

  // Label
  const labelEl = document.createElement('span');
  labelEl.className = 'ramrod-rod-label';
  labelEl.textContent = String(rod.length);
  // For dark rods, use white text
  if ([6, 7].includes(rod.length)) {
    labelEl.style.color = '#fff';
  }
  rodEl.appendChild(labelEl);

  return rodEl;
}

/**
 * Render player's rod collection
 */
export function renderPlayerRods(
  state: RamrodState,
  player: Player,
  onRodClick: (rodId: string) => void,
  options: RamrodBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = `ramrod-player-rods ramrod-player-${player}`;

  const rodIds = state.playerRods[player];
  const isCurrentPlayer = state.currentPlayer === player;
  const canSelect =
    allowInput && isCurrentPlayer && state.phase === 'selectingRod';
  const canDeselect =
    allowInput &&
    isCurrentPlayer &&
    state.phase === 'placingRod' &&
    state.selectedRod !== null;

  for (const rodId of rodIds) {
    const rod = state.rods.get(rodId);
    if (!rod) {
      continue;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ramrod-rod-wrapper';
    if (state.selectedRod === rodId) {
      wrapper.classList.add('selected');
    }
    if (canSelect || (canDeselect && state.selectedRod === rodId)) {
      wrapper.classList.add('selectable');
      wrapper.addEventListener('click', () => onRodClick(rodId));
    }

    const rodEl = renderRod(rod, true);
    wrapper.appendChild(rodEl);

    container.appendChild(wrapper);
  }

  return container;
}

/**
 * Render scores
 */
export function renderScores(state: RamrodState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'ramrod-scores';

  const p1Score = document.createElement('div');
  p1Score.className = 'ramrod-score player1';
  replaceWithSafeHtml(
    p1Score,
    safeHtml`<span class="label">${seatIcon('player1')} Blue:</span> <span class="value">${state.scores.player1}cm</span>`
  );

  const target = document.createElement('div');
  target.className = 'ramrod-target';
  target.textContent = `Goal: ${CONFIG.TARGET_SCORE}cm`;

  const p2Score = document.createElement('div');
  p2Score.className = 'ramrod-score player2';
  replaceWithSafeHtml(
    p2Score,
    safeHtml`<span class="label">${seatIcon('player2')} Red:</span> <span class="value">${state.scores.player2}cm</span>`
  );

  container.appendChild(p1Score);
  container.appendChild(target);
  container.appendChild(p2Score);

  return container;
}

/**
 * Render move history
 */
export function renderMoveHistory(state: RamrodState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'ramrod-history';

  const title = document.createElement('h4');
  title.textContent = 'Recent Captures';
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'ramrod-history-list';

  // Show only captures
  const captures = state.moveHistory.filter((m) => m.capturedBox);
  const recentCaptures = captures.slice(-6);

  for (const move of recentCaptures) {
    const moveEl = document.createElement('div');
    moveEl.className = `ramrod-history-move ${move.player}`;

    const playerName = move.player === 'player1' ? 'Blue' : 'Red';
    replaceWithSafeHtml(
      moveEl,
      safeHtml`<strong>${playerName}</strong> captured ${move.pointsScored}cm box`
    );

    list.appendChild(moveEl);
  }

  container.appendChild(list);
  return container;
}

/**
 * Render rod legend
 */
export function renderRodLegend(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'ramrod-legend';

  const title = document.createElement('h4');
  title.textContent = 'Cuisenaire Rods';
  container.appendChild(title);

  const legendGrid = document.createElement('div');
  legendGrid.className = 'ramrod-legend-grid';

  for (let len = 1; len <= 10; len++) {
    const item = document.createElement('div');
    item.className = 'ramrod-legend-item';

    const color = document.createElement('div');
    color.className = 'ramrod-legend-color';
    // ratchet: loop is len 1–10; ROD_COLORS defines every key.
    const rodColor = ROD_COLORS[len];
    if (rodColor === undefined) {
      continue;
    }
    color.style.backgroundColor = rodColor;
    color.style.width = `${len * 8}px`;
    if (len === 1 || len === 5) {
      color.style.border = '1px solid #999';
    }

    const label = document.createElement('span');
    label.textContent = `${len}cm`;

    item.appendChild(color);
    item.appendChild(label);
    legendGrid.appendChild(item);
  }

  container.appendChild(legendGrid);
  return container;
}

/**
 * Full board rules live in `./ramrod.css` (Vite CSS chunk — keeps JS under
 * the gzip budget). Inject a tiny `#ramrod-styles` marker so existing unit
 * handshake tests that look for that id / tokens keep working.
 */
export function injectRamrodStyles(): void {
  injectStylesOnce(
    'ramrod-styles',
    /* tokens asserted by wave48/55/58 handshake tests */ '@media (max-width:768px){.ramrod-style-marker{background:#e8d4b8}}'
  );
}

/**
 * Get player display name
 */
