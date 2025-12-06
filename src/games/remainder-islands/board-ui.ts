// Remainder Islands Board UI
// Renders the hexagonal island grid, dice, and game status

import {
  RemainderIslandsState,
  DiceRoll,
  Player,
  getPlayerScore,
  getPlayerChips,
} from './types';
import { previewDivision } from './rules';

const HEX_SIZE = 45;
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const BOARD_PADDING = 40;

// Player colors
const PLAYER_COLORS = {
  player1: '#2196F3',  // Blue
  player2: '#e53935',  // Red
};

// =============================================================================
// Hexagon Helpers
// =============================================================================

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

function getHexCenter(row: number, col: number): { x: number; y: number } {
  const x = BOARD_PADDING + col * (HEX_WIDTH * 0.75) + HEX_SIZE;
  const y = BOARD_PADDING + row * HEX_HEIGHT + HEX_HEIGHT / 2;
  return { x, y };
}

// =============================================================================
// Board Rendering
// =============================================================================

export function renderBoard(
  state: RemainderIslandsState,
  onIslandClick: (islandId: string) => void,
  onIslandHover: (islandId: string | null) => void
): SVGElement {
  const maxCol = Math.max(...state.islands.map(i => i.col));
  const maxRow = Math.max(...state.islands.map(i => i.row));

  const width = (maxCol + 1) * (HEX_WIDTH * 0.75) + HEX_SIZE + BOARD_PADDING * 2;
  const height = (maxRow + 1) * HEX_HEIGHT + BOARD_PADDING * 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('remainder-board');

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  bg.setAttribute('fill', '#e8f4f8');
  bg.setAttribute('rx', '8');
  svg.appendChild(bg);

  // Water pattern (decorative)
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', 'water-pattern');
  pattern.setAttribute('width', '20');
  pattern.setAttribute('height', '20');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wavePath.setAttribute('d', 'M0 10 Q5 5, 10 10 T20 10');
  wavePath.setAttribute('stroke', '#b3d9e6');
  wavePath.setAttribute('stroke-width', '1');
  wavePath.setAttribute('fill', 'none');
  pattern.appendChild(wavePath);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  // Water background
  const water = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  water.setAttribute('width', String(width));
  water.setAttribute('height', String(height));
  water.setAttribute('fill', 'url(#water-pattern)');
  water.setAttribute('opacity', '0.5');
  svg.appendChild(water);

  // Islands
  for (const island of state.islands) {
    const { x, y } = getHexCenter(island.row, island.col);
    const isValid = state.validIslands.includes(island.id);
    const isSelected = state.selectedIsland === island.id;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('island');
    if (isValid) group.classList.add('valid');
    if (isSelected) group.classList.add('selected');

    // Island hexagon
    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hex.setAttribute('points', hexPoints(x, y, HEX_SIZE - 2));

    // Color based on ownership
    let fillColor = '#8bc34a';  // Green for unclaimed
    if (island.owner === 'player1') fillColor = PLAYER_COLORS.player1;
    else if (island.owner === 'player2') fillColor = PLAYER_COLORS.player2;

    hex.setAttribute('fill', fillColor);
    hex.setAttribute('stroke', isValid ? '#ffeb3b' : '#5d8a31');
    hex.setAttribute('stroke-width', isValid ? '4' : '2');

    if (isSelected) {
      hex.setAttribute('stroke', '#fff');
      hex.setAttribute('stroke-width', '5');
    }

    group.appendChild(hex);

    // Island value (divisor)
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', String(x));
    valueText.setAttribute('y', String(y + 6));
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('font-size', '24');
    valueText.setAttribute('font-weight', 'bold');
    valueText.setAttribute('fill', island.owner ? 'white' : '#333');
    valueText.textContent = String(island.value);
    group.appendChild(valueText);

    // Chip count indicator
    if (island.chips > 0) {
      const chipBadge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      chipBadge.setAttribute('cx', String(x + HEX_SIZE * 0.6));
      chipBadge.setAttribute('cy', String(y - HEX_SIZE * 0.5));
      chipBadge.setAttribute('r', '12');
      chipBadge.setAttribute('fill', '#fff');
      chipBadge.setAttribute('stroke', '#333');
      chipBadge.setAttribute('stroke-width', '2');
      group.appendChild(chipBadge);

      const chipCount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chipCount.setAttribute('x', String(x + HEX_SIZE * 0.6));
      chipCount.setAttribute('y', String(y - HEX_SIZE * 0.5 + 5));
      chipCount.setAttribute('text-anchor', 'middle');
      chipCount.setAttribute('font-size', '12');
      chipCount.setAttribute('font-weight', 'bold');
      chipCount.setAttribute('fill', '#333');
      chipCount.textContent = String(island.chips);
      group.appendChild(chipCount);
    }

    // Preview division result
    if (isSelected && state.currentRoll) {
      const preview = previewDivision(state, island.id);
      if (preview) {
        const previewText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        previewText.setAttribute('x', String(x));
        previewText.setAttribute('y', String(y + HEX_SIZE * 0.6));
        previewText.setAttribute('text-anchor', 'middle');
        previewText.setAttribute('font-size', '14');
        previewText.setAttribute('fill', '#fff');
        previewText.setAttribute('font-weight', 'bold');
        previewText.textContent = `R=${preview.remainder}`;
        group.appendChild(previewText);
      }
    }

    // Interaction layer
    if (state.phase === 'selectIsland') {
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      hitArea.setAttribute('points', hexPoints(x, y, HEX_SIZE));
      hitArea.setAttribute('fill', 'transparent');
      hitArea.style.cursor = isValid ? 'pointer' : 'not-allowed';

      if (isValid) {
        hitArea.addEventListener('click', () => onIslandClick(island.id));
        hitArea.addEventListener('mouseenter', () => onIslandHover(island.id));
        hitArea.addEventListener('mouseleave', () => onIslandHover(null));
      }

      group.appendChild(hitArea);
    }

    svg.appendChild(group);
  }

  return svg;
}

// =============================================================================
// Dice Display
// =============================================================================

export function renderDice(roll: DiceRoll | null): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-dice';

  if (!roll) {
    container.innerHTML = `
      <div class="dice-placeholder">
        <span class="dice-icon">🎲</span>
        <span class="dice-icon">🎲</span>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div class="dice-result">
      <div class="die">${getDieFace(roll.die1)}</div>
      <div class="dice-plus">+</div>
      <div class="die">${getDieFace(roll.die2)}</div>
      <div class="dice-equals">=</div>
      <div class="dice-total">${roll.total}</div>
    </div>
  `;

  return container;
}

function getDieFace(value: number): string {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return faces[value - 1] || '?';
}

// =============================================================================
// Score Display
// =============================================================================

export function renderScores(state: RemainderIslandsState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-scores';

  const p1Score = getPlayerScore(state, 'player1');
  const p2Score = getPlayerScore(state, 'player2');
  const p1Chips = getPlayerChips(state, 'player1');
  const p2Chips = getPlayerChips(state, 'player2');

  container.innerHTML = `
    <div class="remainder-player-score ${state.currentPlayer === 'player1' ? 'active' : ''} player1">
      <div class="remainder-player-name">Blue</div>
      <div class="remainder-score-value">${p1Score}</div>
      <div class="remainder-chips">🪙 ${p1Chips}</div>
    </div>
    <div class="remainder-turns">
      <div class="remainder-turns-label">Turns Left</div>
      <div class="remainder-turns-value">${state.turnsRemaining}</div>
    </div>
    <div class="remainder-player-score ${state.currentPlayer === 'player2' ? 'active' : ''} player2">
      <div class="remainder-player-name">Red</div>
      <div class="remainder-score-value">${p2Score}</div>
      <div class="remainder-chips">🪙 ${p2Chips}</div>
    </div>
  `;

  return container;
}

// =============================================================================
// Division Preview
// =============================================================================

export function renderDivisionPreview(state: RemainderIslandsState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-preview';

  if (!state.currentRoll || !state.selectedIsland) {
    return container;
  }

  const preview = previewDivision(state, state.selectedIsland);
  if (!preview) return container;

  container.innerHTML = `
    <div class="division-equation">
      <span class="dividend">${preview.dividend}</span>
      <span class="operator">÷</span>
      <span class="divisor">${preview.divisor}</span>
      <span class="equals">=</span>
      <span class="quotient">${preview.quotient}</span>
      <span class="r-label">R</span>
      <span class="remainder">${preview.remainder}</span>
    </div>
    <div class="points-preview">+${preview.remainder} points</div>
  `;

  return container;
}

// =============================================================================
// Game Over Display
// =============================================================================

export function renderGameOver(state: RemainderIslandsState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-game-over';

  const p1Score = getPlayerScore(state, 'player1');
  const p2Score = getPlayerScore(state, 'player2');

  let winnerText: string;
  if (state.winner === 'player1') {
    winnerText = 'Blue Wins! 🎉';
  } else if (state.winner === 'player2') {
    winnerText = 'Red Wins! 🎉';
  } else {
    winnerText = "It's a Draw!";
  }

  container.innerHTML = `
    <div class="remainder-winner-banner">${winnerText}</div>
    <div class="remainder-final-scores">
      <div class="remainder-final-score player1">
        <div class="remainder-final-name">Blue</div>
        <div class="remainder-final-value">${p1Score} points</div>
      </div>
      <div class="remainder-final-score player2">
        <div class="remainder-final-name">Red</div>
        <div class="remainder-final-value">${p2Score} points</div>
      </div>
    </div>
  `;

  return container;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

// =============================================================================
// Styles
// =============================================================================

export function injectRemainderIslandsStyles(): void {
  if (document.getElementById('remainder-islands-styles')) return;

  const style = document.createElement('style');
  style.id = 'remainder-islands-styles';
  style.textContent = `
    .remainder-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .remainder-board {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .island.valid polygon:first-child {
      filter: drop-shadow(0 0 8px #ffeb3b);
    }

    .island.selected polygon:first-child {
      filter: drop-shadow(0 0 12px #fff);
    }

    .remainder-dice {
      display: flex;
      justify-content: center;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .dice-placeholder,
    .dice-result {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dice-icon,
    .die {
      font-size: 48px;
    }

    .dice-plus,
    .dice-equals {
      font-size: 24px;
      font-weight: bold;
      color: #666;
    }

    .dice-total {
      font-size: 36px;
      font-weight: bold;
      color: #333;
      background: #fff3e0;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .remainder-scores {
      display: flex;
      align-items: center;
      gap: 24px;
      width: 100%;
      justify-content: space-around;
    }

    .remainder-player-score {
      text-align: center;
      padding: 12px 24px;
      border-radius: 8px;
      background: #f5f5f5;
      transition: all 0.3s;
    }

    .remainder-player-score.active {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .remainder-player-score.player1 .remainder-player-name { color: #1565c0; }
    .remainder-player-score.player2 .remainder-player-name { color: #c62828; }

    .remainder-player-name {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .remainder-score-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .remainder-chips {
      font-size: 14px;
      color: #666;
    }

    .remainder-turns {
      text-align: center;
    }

    .remainder-turns-label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
    }

    .remainder-turns-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .remainder-preview {
      text-align: center;
      padding: 12px;
      background: #fff3e0;
      border-radius: 8px;
      min-height: 60px;
    }

    .division-equation {
      font-size: 24px;
      font-weight: 500;
    }

    .division-equation .dividend { color: #1976d2; }
    .division-equation .divisor { color: #388e3c; }
    .division-equation .quotient { color: #333; }
    .division-equation .remainder {
      color: #d32f2f;
      font-weight: bold;
    }
    .division-equation .r-label {
      color: #999;
      font-size: 18px;
    }

    .points-preview {
      margin-top: 8px;
      font-size: 18px;
      font-weight: bold;
      color: #4caf50;
    }

    .remainder-status {
      font-size: 18px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .remainder-status.player1 {
      background: #e3f2fd;
      color: #1565c0;
    }

    .remainder-status.player2 {
      background: #ffebee;
      color: #c62828;
    }

    .remainder-game-over {
      text-align: center;
    }

    .remainder-winner-banner {
      font-size: 32px;
      font-weight: bold;
      padding: 16px 32px;
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #333;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .remainder-final-scores {
      display: flex;
      gap: 24px;
      justify-content: center;
    }

    .remainder-final-score {
      padding: 20px 32px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .remainder-final-score.player1 { border-top: 4px solid #2196F3; }
    .remainder-final-score.player2 { border-top: 4px solid #e53935; }

    .remainder-final-name {
      font-size: 18px;
      font-weight: 600;
    }

    .remainder-final-value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }

    .remainder-btn {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .remainder-btn-roll {
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
      font-size: 18px;
      padding: 16px 32px;
    }

    .remainder-btn-roll:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255,152,0,0.4);
    }

    .remainder-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .remainder-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
  `;
  document.head.appendChild(style);
}
