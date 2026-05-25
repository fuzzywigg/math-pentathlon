// Ramrod Board UI
// Rendering Cuisenaire rods, sum boxes, and game state

import {
  RamrodState,
  SumBox,
  Rod,
  Player,
  CONFIG,
  ROD_COLORS,
} from './types';
import { getValidPlacements, getRemainingValue } from './rules';

// Dimensions
const BOX_WIDTH = 120;
const BOX_HEIGHT = 80;
const ROD_HEIGHT = 24;
const CM_SCALE = 10; // 10 pixels per cm

// Colors
const PLAYER_COLORS = {
  player1: '#2196f3',
  player2: '#f44336',
};

/**
 * Render the game board
 */
export function renderBoard(
  state: RamrodState,
  onBoxClick: (boxId: string, slot: number) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'ramrod-board';

  // Get valid placements for selected rod
  const validPlacements = state.selectedRod
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
      if (!box) continue;

      const boxEl = renderSumBox(state, box, validPlacements, onBoxClick);
      rowEl.appendChild(boxEl);
    }

    grid.appendChild(rowEl);
  }

  container.appendChild(grid);
  return container;
}

/**
 * Render a single sum box
 */
function renderSumBox(
  _state: RamrodState,
  box: SumBox,
  validPlacements: Set<string>,
  onClick: (boxId: string, slot: number) => void
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

    const isValid = validPlacements.has(`${box.id}-${slot}`);
    if (isValid) {
      slotEl.classList.add('valid');
      slotEl.addEventListener('click', () => onClick(box.id, slot));
    }

    const rod = box.rods[slot];
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
  if (inHand) rodEl.classList.add('in-hand');

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
  onRodClick: (rodId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = `ramrod-player-rods ramrod-player-${player}`;

  const rodIds = state.playerRods[player];
  const isCurrentPlayer = state.currentPlayer === player;
  const canSelect = isCurrentPlayer && state.phase === 'selectingRod';

  for (const rodId of rodIds) {
    const rod = state.rods.get(rodId);
    if (!rod) continue;

    const wrapper = document.createElement('div');
    wrapper.className = 'ramrod-rod-wrapper';
    if (state.selectedRod === rodId) {
      wrapper.classList.add('selected');
    }
    if (canSelect) {
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
  p1Score.innerHTML = `<span class="label">Blue:</span> <span class="value">${state.scores.player1}cm</span>`;

  const target = document.createElement('div');
  target.className = 'ramrod-target';
  target.textContent = `Goal: ${CONFIG.TARGET_SCORE}cm`;

  const p2Score = document.createElement('div');
  p2Score.className = 'ramrod-score player2';
  p2Score.innerHTML = `<span class="label">Red:</span> <span class="value">${state.scores.player2}cm</span>`;

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
    moveEl.innerHTML = `<strong>${playerName}</strong> captured ${move.pointsScored}cm box`;

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
    color.style.backgroundColor = ROD_COLORS[len];
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
 * Inject CSS styles
 */
export function injectRamrodStyles(): void {
  const existingStyle = document.getElementById('ramrod-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'ramrod-styles';
  style.textContent = `
    .ramrod-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .ramrod-main-layout {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    .ramrod-board {
      background: #e8d4b8;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .ramrod-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ramrod-row {
      display: flex;
      gap: 0.5rem;
    }

    .ramrod-box {
      width: ${BOX_WIDTH}px;
      min-height: ${BOX_HEIGHT}px;
      background: #f5f0e8;
      border: 2px solid #c9b89b;
      border-radius: 8px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .ramrod-box.completed.player1 {
      background: rgba(33, 150, 243, 0.1);
      border-color: ${PLAYER_COLORS.player1};
    }

    .ramrod-box.completed.player2 {
      background: rgba(244, 67, 54, 0.1);
      border-color: ${PLAYER_COLORS.player2};
    }

    .ramrod-box-label {
      font-size: 0.75rem;
      font-weight: bold;
      color: #666;
      text-align: center;
    }

    .ramrod-slot {
      height: ${ROD_HEIGHT + 8}px;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
    }

    .ramrod-slot.valid {
      background: rgba(76, 175, 80, 0.2);
      cursor: pointer;
      box-shadow: 0 0 0 2px #4caf50;
    }

    .ramrod-slot.valid:hover {
      background: rgba(76, 175, 80, 0.4);
    }

    .ramrod-hint {
      font-size: 0.7rem;
      color: #999;
      font-style: italic;
    }

    .ramrod-rod {
      height: ${ROD_HEIGHT}px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
      min-width: 20px;
    }

    .ramrod-rod-label {
      font-size: 0.7rem;
      font-weight: bold;
      color: #333;
    }

    .ramrod-player-rods {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255,255,255,0.9);
      border-radius: 8px;
      min-width: 120px;
    }

    .ramrod-player-player1 {
      border: 3px solid ${PLAYER_COLORS.player1};
    }

    .ramrod-player-player2 {
      border: 3px solid ${PLAYER_COLORS.player2};
    }

    .ramrod-rod-wrapper {
      padding: 4px;
      border-radius: 6px;
      transition: all 0.15s;
    }

    .ramrod-rod-wrapper.selectable {
      cursor: pointer;
    }

    .ramrod-rod-wrapper.selectable:hover {
      background: rgba(0,0,0,0.1);
    }

    .ramrod-rod-wrapper.selected {
      background: rgba(255,152,0,0.3);
      box-shadow: 0 0 0 2px #ff9800;
    }

    .ramrod-scores {
      display: flex;
      gap: 2rem;
      align-items: center;
      padding: 1rem 2rem;
      background: #333;
      border-radius: 8px;
    }

    .ramrod-score {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .ramrod-score.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .ramrod-score.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .ramrod-score .value {
      font-size: 1.5rem;
    }

    .ramrod-target {
      color: #999;
      font-size: 0.9rem;
    }

    .ramrod-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .ramrod-status.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .ramrod-status.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .ramrod-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 12px;
      margin: 1rem;
      animation: ramrod-glow 1s ease-in-out infinite alternate;
    }

    @keyframes ramrod-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    .ramrod-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .ramrod-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ramrod-btn-primary {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    .ramrod-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33,150,243,0.3);
    }

    .ramrod-btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .ramrod-btn-secondary:hover {
      background: #bdbdbd;
    }

    .ramrod-history {
      background: rgba(0,0,0,0.05);
      padding: 1rem;
      border-radius: 8px;
      max-width: 200px;
    }

    .ramrod-history h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .ramrod-history-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
    }

    .ramrod-history-move {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .ramrod-history-move.player1 {
      background: rgba(33,150,243,0.1);
    }

    .ramrod-history-move.player2 {
      background: rgba(244,67,54,0.1);
    }

    .ramrod-hand-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .ramrod-hand-label.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .ramrod-hand-label.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .ramrod-legend {
      background: rgba(0,0,0,0.05);
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
    }

    .ramrod-legend h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.8rem;
      color: #666;
    }

    .ramrod-legend-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .ramrod-legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ramrod-legend-color {
      height: 12px;
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      .ramrod-main-layout {
        flex-direction: column;
        align-items: center;
      }

      .ramrod-player-rods {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
