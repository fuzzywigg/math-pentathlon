// Remainder Islands Board UI
// Renders the hexagonal island grid, dice, and game status

import { pointyTopHexPolygonPoints } from '../../ui/hex-svg';
import { getDieFaceEmojiOrQuestion } from '../../ui/die-faces';
import { injectStylesOnce } from '../../ui/inject-styles';
import type { RemainderIslandsState, DiceRoll, Island } from './types';
import { getPlayerScore, getPlayerChips } from './types';
import { previewDivision } from './rules';
import { getPlayerSeatColors } from '../../ui/player-colors';
import { replaceWithSafeHtml, safeHtml } from '../../core/dom-security';

import {
  buildCellAriaLabel,
  makeSvgFocusable,
  bindCellActivateKeys,
} from '../../ui/board-a11y';
import { getPlayerName } from '../../ui/seat-labels';
import { bindPrimaryPointerActivate } from '../../ui/pointer-hygiene';
export { getPlayerName };

const HEX_SIZE = 45;
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const BOARD_PADDING = 40;

// =============================================================================
// Hexagon Helpers
// =============================================================================

function hexPoints(cx: number, cy: number, size: number): string {
  return pointyTopHexPolygonPoints(cx, cy, size);
}

function getHexCenter(row: number, col: number): { x: number; y: number } {
  const x = BOARD_PADDING + col * (HEX_WIDTH * 0.75) + HEX_SIZE;
  const y = BOARD_PADDING + row * HEX_HEIGHT + HEX_HEIGHT / 2;
  return { x, y };
}

// =============================================================================
// Board Rendering
// =============================================================================

type SeatColors = ReturnType<typeof getPlayerSeatColors>;

/** Prefer a seats snapshot so sync/render does not re-read CSS vars per island. */
function islandFillColor(
  owner: Island['owner'],
  seats: SeatColors = getPlayerSeatColors()
): string {
  if (owner === 'player1') {
    return seats.player1;
  }
  if (owner === 'player2') {
    return seats.player2;
  }
  return '#8bc34a';
}

function applyIslandSelectionVisual(
  group: SVGGElement,
  island: Island,
  state: RemainderIslandsState,
  selected: boolean
): void {
  const hex =
    group.querySelector('polygon.island-hex') ?? group.querySelector('polygon');
  if (!hex) {
    return;
  }

  const isValid = state.validIslands.includes(island.id);
  const { x, y } = getHexCenter(island.row, island.col);

  if (selected) {
    group.classList.add('selected');
    hex.setAttribute('stroke', '#fff');
    hex.setAttribute('stroke-width', '5');

    if (state.currentRoll && !group.querySelector('.island-r-preview')) {
      const preview = previewDivision(state, island.id);
      if (preview) {
        const previewText = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'text'
        );
        previewText.setAttribute('class', 'island-r-preview');
        previewText.setAttribute('x', String(x));
        previewText.setAttribute('y', String(y + HEX_SIZE * 0.6));
        previewText.setAttribute('text-anchor', 'middle');
        previewText.setAttribute('font-size', '14');
        previewText.setAttribute('fill', '#fff');
        previewText.setAttribute('font-weight', 'bold');
        previewText.textContent = `R=${preview.remainder}`;
        const hitArea = group.querySelector('polygon.island-hit');
        if (hitArea) {
          group.insertBefore(previewText, hitArea);
        } else {
          group.appendChild(previewText);
        }
      }
    }
    return;
  }

  group.classList.remove('selected');
  hex.setAttribute('stroke', isValid ? '#ffeb3b' : '#5d8a31');
  hex.setAttribute('stroke-width', isValid ? '4' : '2');
  group.querySelector('.island-r-preview')?.remove();
}

interface RemainderBoardHandlers {
  onIslandClick: (islandId: string) => void;
  onIslandHover: (islandId: string | null) => void;
}

const remainderBoardHandlers = new WeakMap<
  SVGElement,
  RemainderBoardHandlers
>();
const remainderKeysBound = new WeakSet<SVGGElement>();
const remainderHitCleanups = new WeakMap<SVGGElement, () => void>();

export function renderBoard(
  state: RemainderIslandsState,
  onIslandClick: (islandId: string) => void,
  onIslandHover: (islandId: string | null) => void,
  interactive = true
): SVGElement {
  const maxCol = Math.max(...state.islands.map((i) => i.col));
  const maxRow = Math.max(...state.islands.map((i) => i.row));

  const width =
    (maxCol + 1) * (HEX_WIDTH * 0.75) + HEX_SIZE + BOARD_PADDING * 2;
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
  const pattern = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'pattern'
  );
  pattern.setAttribute('id', 'water-pattern');
  pattern.setAttribute('width', '20');
  pattern.setAttribute('height', '20');
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  const wavePath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
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

  // One CSS-var read for the whole board (avoids 3×getComputedStyle per island).
  const seats = getPlayerSeatColors();
  remainderBoardHandlers.set(svg, { onIslandClick, onIslandHover });

  // Islands
  for (const island of state.islands) {
    const { x, y } = getHexCenter(island.row, island.col);
    const isValid = state.validIslands.includes(island.id);
    const isSelected = state.selectedIsland === island.id;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('island');
    if (isValid) {
      group.classList.add('valid');
    }
    if (isSelected) {
      group.classList.add('selected');
    }
    group.setAttribute('data-island-id', island.id);
    group.setAttribute('data-row', String(island.row));
    group.setAttribute('data-col', String(island.col));

    // Island hexagon
    const hex = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    hex.classList.add('island-hex');
    hex.setAttribute('points', hexPoints(x, y, HEX_SIZE - 2));

    hex.setAttribute('fill', islandFillColor(island.owner, seats));
    hex.setAttribute('stroke', isValid ? '#ffeb3b' : '#5d8a31');
    hex.setAttribute('stroke-width', isValid ? '4' : '2');
    group.appendChild(hex);

    // Island value (divisor)
    const valueText = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    valueText.classList.add('island-value');
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
      const chipBadge = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      chipBadge.classList.add('island-chip-badge');
      chipBadge.setAttribute('cx', String(x + HEX_SIZE * 0.6));
      chipBadge.setAttribute('cy', String(y - HEX_SIZE * 0.5));
      chipBadge.setAttribute('r', '12');
      chipBadge.setAttribute('fill', '#fff');
      chipBadge.setAttribute('stroke', '#333');
      chipBadge.setAttribute('stroke-width', '2');
      group.appendChild(chipBadge);

      const chipCount = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      chipCount.classList.add('island-chip-count');
      chipCount.setAttribute('x', String(x + HEX_SIZE * 0.6));
      chipCount.setAttribute('y', String(y - HEX_SIZE * 0.5 + 5));
      chipCount.setAttribute('text-anchor', 'middle');
      chipCount.setAttribute('font-size', '12');
      chipCount.setAttribute('font-weight', 'bold');
      chipCount.setAttribute('fill', '#333');
      chipCount.textContent = String(island.chips);
      group.appendChild(chipCount);
    }

    if (isSelected) {
      applyIslandSelectionVisual(group, island, state, true);
    }

    const owner =
      island.owner === 'player1'
        ? 'Blue'
        : island.owner === 'player2'
          ? 'Red'
          : undefined;
    const ariaLabel = buildCellAriaLabel({
      coord: `${island.row},${island.col}`,
      empty: !island.owner,
      ...(owner !== undefined ? { owner } : {}),
      validMove: isValid,
      extras: [
        `value ${island.value}`,
        ...(island.chips > 0 ? [`${island.chips} chips`] : []),
        ...(isSelected ? ['selected'] : []),
      ],
    });

    // Interaction layer — skip during the computer's turn so taps cannot steal AI moves.
    if (state.phase === 'selectIsland' && interactive) {
      const hitArea = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
      );
      hitArea.classList.add('island-hit');
      hitArea.setAttribute('points', hexPoints(x, y, HEX_SIZE));
      hitArea.setAttribute('fill', 'transparent');
      hitArea.style.cursor = isValid ? 'pointer' : 'not-allowed';

      if (isValid) {
        // Only activatable islands are keyboard buttons; others stay announced.
        makeSvgFocusable(group, ariaLabel);
        const activate = () => {
          remainderBoardHandlers.get(svg)?.onIslandClick(island.id);
        };
        // Primary pointer tap (cancel/multi-touch/slop safe) + click fallback.
        bindPrimaryPointerActivate(hitArea, activate);
        hitArea.addEventListener('mouseenter', () => {
          applyIslandSelectionVisual(group, island, state, true);
          remainderBoardHandlers.get(svg)?.onIslandHover(island.id);
        });
        hitArea.addEventListener('mouseleave', () => {
          applyIslandSelectionVisual(group, island, state, false);
          remainderBoardHandlers.get(svg)?.onIslandHover(null);
        });
        bindCellActivateKeys(group, activate);
        remainderKeysBound.add(group);
      } else {
        group.setAttribute('aria-label', ariaLabel);
      }

      group.appendChild(hitArea);
    } else {
      group.setAttribute('aria-label', ariaLabel);
    }

    svg.appendChild(group);
  }

  return svg;
}

function syncIslandChips(group: SVGGElement, island: Island): void {
  const existingBadge = group.querySelector('circle.island-chip-badge');
  const chipCountEl = group.querySelector('text.island-chip-count');
  const shownChips = chipCountEl ? Number(chipCountEl.textContent) : 0;
  if (island.chips === shownChips) {
    return;
  }

  existingBadge?.remove();
  chipCountEl?.remove();
  if (island.chips <= 0) {
    return;
  }

  const { x, y } = getHexCenter(island.row, island.col);
  const chipBadge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  );
  chipBadge.classList.add('island-chip-badge');
  chipBadge.setAttribute('cx', String(x + HEX_SIZE * 0.6));
  chipBadge.setAttribute('cy', String(y - HEX_SIZE * 0.5));
  chipBadge.setAttribute('r', '12');
  chipBadge.setAttribute('fill', '#fff');
  chipBadge.setAttribute('stroke', '#333');
  chipBadge.setAttribute('stroke-width', '2');
  const chipCount = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'text'
  );
  chipCount.classList.add('island-chip-count');
  chipCount.setAttribute('x', String(x + HEX_SIZE * 0.6));
  chipCount.setAttribute('y', String(y - HEX_SIZE * 0.5 + 5));
  chipCount.setAttribute('text-anchor', 'middle');
  chipCount.setAttribute('font-size', '12');
  chipCount.setAttribute('font-weight', 'bold');
  chipCount.setAttribute('fill', '#333');
  chipCount.textContent = String(island.chips);
  const hit = group.querySelector('polygon.island-hit');
  if (hit) {
    group.insertBefore(chipBadge, hit);
    group.insertBefore(chipCount, hit);
  } else {
    group.appendChild(chipBadge);
    group.appendChild(chipCount);
  }
}

/**
 * Sync island fills / validity / chips / hit areas on an existing board SVG.
 * Avoids recreating water pattern + every island group on each roll/click.
 */
export function syncBoard(
  svg: SVGElement,
  state: RemainderIslandsState,
  onIslandClick: (islandId: string) => void,
  onIslandHover: (islandId: string | null) => void,
  interactive = true
): void {
  remainderBoardHandlers.set(svg, { onIslandClick, onIslandHover });
  const seats = getPlayerSeatColors();

  for (const island of state.islands) {
    const group = svg.querySelector(
      `g.island[data-island-id="${island.id}"]`
    ) as SVGGElement | null;
    if (!group) {
      continue;
    }

    const isValid = state.validIslands.includes(island.id);
    const isSelected = state.selectedIsland === island.id;
    group.classList.toggle('valid', isValid);
    group.classList.toggle('selected', isSelected);

    const hex =
      group.querySelector('polygon.island-hex') ??
      group.querySelector('polygon');
    if (hex) {
      hex.setAttribute('fill', islandFillColor(island.owner, seats));
      if (!isSelected) {
        hex.setAttribute('stroke', isValid ? '#ffeb3b' : '#5d8a31');
        hex.setAttribute('stroke-width', isValid ? '4' : '2');
      }
    }

    const valueText =
      group.querySelector('text.island-value') ??
      group.querySelector(
        'text:not(.island-r-preview):not(.island-chip-count)'
      );
    if (valueText) {
      valueText.classList.add('island-value');
      valueText.setAttribute('fill', island.owner ? 'white' : '#333');
      valueText.textContent = String(island.value);
    }

    syncIslandChips(group, island);

    const owner =
      island.owner === 'player1'
        ? 'Blue'
        : island.owner === 'player2'
          ? 'Red'
          : undefined;
    const ariaLabel = buildCellAriaLabel({
      coord: `${island.row},${island.col}`,
      empty: !island.owner,
      ...(owner !== undefined ? { owner } : {}),
      validMove: isValid,
      extras: [
        `value ${island.value}`,
        ...(island.chips > 0 ? [`${island.chips} chips`] : []),
        ...(isSelected ? ['selected'] : []),
      ],
    });

    let hit = group.querySelector(
      'polygon.island-hit'
    ) as SVGPolygonElement | null;
    const wantHit = state.phase === 'selectIsland' && interactive;

    remainderHitCleanups.get(group)?.();
    remainderHitCleanups.delete(group);

    if (wantHit) {
      const { x, y } = getHexCenter(island.row, island.col);
      if (!hit) {
        hit = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hit.classList.add('island-hit');
        hit.setAttribute('points', hexPoints(x, y, HEX_SIZE));
        hit.setAttribute('fill', 'transparent');
        group.appendChild(hit);
      } else {
        // Drop prior listeners without recreating the whole island group.
        const fresh = hit.cloneNode(true) as SVGPolygonElement;
        hit.replaceWith(fresh);
        hit = fresh;
      }
      hit.style.cursor = isValid ? 'pointer' : 'not-allowed';

      if (isValid) {
        makeSvgFocusable(group, ariaLabel);
        const activate = () => {
          remainderBoardHandlers.get(svg)?.onIslandClick(island.id);
        };
        const unbind = bindPrimaryPointerActivate(hit, activate);
        const onEnter = (): void => {
          applyIslandSelectionVisual(group, island, state, true);
          remainderBoardHandlers.get(svg)?.onIslandHover(island.id);
        };
        const onLeave = (): void => {
          applyIslandSelectionVisual(group, island, state, false);
          remainderBoardHandlers.get(svg)?.onIslandHover(null);
        };
        hit.addEventListener('mouseenter', onEnter);
        hit.addEventListener('mouseleave', onLeave);
        remainderHitCleanups.set(group, () => {
          unbind();
          hit?.removeEventListener('mouseenter', onEnter);
          hit?.removeEventListener('mouseleave', onLeave);
        });
        if (!remainderKeysBound.has(group)) {
          remainderKeysBound.add(group);
          bindCellActivateKeys(group, () => {
            remainderBoardHandlers.get(svg)?.onIslandClick(island.id);
          });
        }
      } else {
        group.removeAttribute('role');
        group.removeAttribute('tabindex');
        group.setAttribute('aria-label', ariaLabel);
      }
    } else {
      hit?.remove();
      group.removeAttribute('role');
      group.removeAttribute('tabindex');
      group.setAttribute('aria-label', ariaLabel);
      group.querySelector('.island-r-preview')?.remove();
      group.classList.remove('selected');
    }

    if (isSelected && wantHit) {
      applyIslandSelectionVisual(group, island, state, true);
    }
  }
}

// =============================================================================
// Dice Display
// =============================================================================

export function renderDice(roll: DiceRoll | null): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-dice';

  if (!roll) {
    // trusted constant markup
    container.innerHTML = `
      <div class="dice-placeholder">
        <span class="dice-icon">🎲</span>
        <span class="dice-icon">🎲</span>
      </div>
    `;
    return container;
  }

  replaceWithSafeHtml(
    container,
    safeHtml`
    <div class="dice-result">
      <div class="die">${getDieFace(roll.die1)}</div>
      <div class="dice-plus">+</div>
      <div class="die">${getDieFace(roll.die2)}</div>
      <div class="dice-equals">=</div>
      <div class="dice-total">${roll.total}</div>
    </div>
  `
  );

  return container;
}

function getDieFace(value: number): string {
  return getDieFaceEmojiOrQuestion(value);
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

  replaceWithSafeHtml(
    container,
    safeHtml`
    <div class="remainder-player-score player1">
      <div class="remainder-player-name">Blue</div>
      <div class="remainder-score-value">${p1Score}</div>
      <div class="remainder-chips">🪙 ${p1Chips}</div>
    </div>
    <div class="remainder-turns">
      <div class="remainder-turns-label">Turns Left</div>
      <div class="remainder-turns-value">${state.turnsRemaining}</div>
    </div>
    <div class="remainder-player-score player2">
      <div class="remainder-player-name">Red</div>
      <div class="remainder-score-value">${p2Score}</div>
      <div class="remainder-chips">🪙 ${p2Chips}</div>
    </div>
  `
  );
  const p1El = container.querySelector('.remainder-player-score.player1');
  const p2El = container.querySelector('.remainder-player-score.player2');
  if (p1El) {
    p1El.className = `remainder-player-score ${state.currentPlayer === 'player1' ? 'active' : ''} player1`;
  }
  if (p2El) {
    p2El.className = `remainder-player-score ${state.currentPlayer === 'player2' ? 'active' : ''} player2`;
  }

  return container;
}

// =============================================================================
// Division Preview
// =============================================================================

export function renderDivisionPreview(
  state: RemainderIslandsState
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'remainder-preview';

  if (!state.currentRoll || !state.selectedIsland) {
    return container;
  }

  const preview = previewDivision(state, state.selectedIsland);
  if (!preview) {
    return container;
  }

  replaceWithSafeHtml(
    container,
    safeHtml`
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
  `
  );

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

  replaceWithSafeHtml(
    container,
    safeHtml`
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
  `
  );

  return container;
}

// =============================================================================
// Helper Functions
// =============================================================================

// =============================================================================
// Styles
// =============================================================================

export function injectRemainderIslandsStyles(): void {
  injectStylesOnce(
    'remainder-islands-styles',
    `
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

    .remainder-player-score.player1 .remainder-player-name { color: var(--color-player1-text, #1d4ed8); }
    .remainder-player-score.player2 .remainder-player-name { color: var(--color-player2-text, #b91c1c); }

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
      color: #475569;
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
      color: #64748b; /* was #999 (~2.9:1); AA ≥4.5:1 */
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
      color: var(--color-player1-text, #1d4ed8);
    }

    .remainder-status.player2 {
      background: #ffebee;
      color: var(--color-player2-text, #b91c1c);
    }

    [data-opponent="ai"] .remainder-status.player2 {
      background: #ede9fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .remainder-status.player1 {
      background: #ede9fe;
    }

    [data-opponent="ai"][data-ai-seat="player1"] .remainder-status.player2 {
      background: #ffebee;
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

    .remainder-final-score.player1 { border-top: 4px solid var(--color-player1, #2196F3); }
    .remainder-final-score.player2 { border-top: 4px solid var(--color-player2, #e53935); }

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

    @media (prefers-reduced-motion: reduce) {
      .island.valid polygon:first-child,
      .island.selected polygon:first-child {
        filter: none;
      }

      .remainder-player-score {
        transition: none;
      }

      .remainder-player-score.active {
        transform: none;
      }

      .remainder-btn,
      .remainder-btn-roll:hover {
        transition: none;
        transform: none;
      }
    }
  `
  );
}
