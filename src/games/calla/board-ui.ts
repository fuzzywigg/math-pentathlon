// Calla Board UI - Renders the Mancala-style board

import {
  CallaGameState,
  PITS_PER_SIDE,
} from './types';
import { getPhaseMessage, getValidPits, getLastMoveInfo } from './rules';

export type PitClickCallback = (pitIndex: number) => void;

// Board dimensions
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 200;
const PIT_RADIUS = 32;
const CALLA_WIDTH = 50;
const CALLA_HEIGHT = 140;
const PIT_SPACING = (BOARD_WIDTH - CALLA_WIDTH * 2 - PIT_RADIUS * 2) / (PITS_PER_SIDE + 1);

// Render the game board
export function renderBoard(
  state: CallaGameState,
  container: HTMLElement,
  onPitClick?: PitClickCallback
): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'calla-wrapper';

  // Create SVG for the board
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'calla-board');
  svg.setAttribute('viewBox', `0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Board background
  const boardBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  boardBg.setAttribute('x', '0');
  boardBg.setAttribute('y', '0');
  boardBg.setAttribute('width', String(BOARD_WIDTH));
  boardBg.setAttribute('height', String(BOARD_HEIGHT));
  boardBg.setAttribute('rx', '20');
  boardBg.setAttribute('class', 'calla-board-bg');
  svg.appendChild(boardBg);

  // Get valid pits for highlighting
  const validPits = getValidPits(state);

  // Player 2's Calla (left side)
  const p2CallaX = 10;
  const p2CallaY = (BOARD_HEIGHT - CALLA_HEIGHT) / 2;
  svg.appendChild(createCalla(p2CallaX, p2CallaY, state.player2Calla, 'player2', state.currentPlayer === 'player2'));

  // Player 1's Calla (right side)
  const p1CallaX = BOARD_WIDTH - CALLA_WIDTH - 10;
  const p1CallaY = (BOARD_HEIGHT - CALLA_HEIGHT) / 2;
  svg.appendChild(createCalla(p1CallaX, p1CallaY, state.player1Calla, 'player1', state.currentPlayer === 'player1'));

  // Pits start after left calla
  const pitsStartX = CALLA_WIDTH + 30;

  // Player 2's pits (top row, from right to left - indices 4,3,2,1,0)
  const p2Y = BOARD_HEIGHT * 0.28;
  for (let i = 0; i < PITS_PER_SIDE; i++) {
    const displayIndex = PITS_PER_SIDE - 1 - i; // Reverse for display
    const x = pitsStartX + PIT_SPACING * (i + 0.5);
    const isValid = state.currentPlayer === 'player2' && validPits.includes(displayIndex);
    const isLastSown = state.lastSownPit?.side === 'player2' && state.lastSownPit?.index === displayIndex;

    const pitGroup = createPit(
      x,
      p2Y,
      state.player2Pits[displayIndex],
      'player2',
      displayIndex,
      isValid,
      isLastSown,
      onPitClick && isValid ? () => onPitClick(displayIndex) : undefined
    );
    svg.appendChild(pitGroup);
  }

  // Player 1's pits (bottom row, from left to right - indices 0,1,2,3,4)
  const p1Y = BOARD_HEIGHT * 0.72;
  for (let i = 0; i < PITS_PER_SIDE; i++) {
    const x = pitsStartX + PIT_SPACING * (i + 0.5);
    const isValid = state.currentPlayer === 'player1' && validPits.includes(i);
    const isLastSown = state.lastSownPit?.side === 'player1' && state.lastSownPit?.index === i;

    const pitGroup = createPit(
      x,
      p1Y,
      state.player1Pits[i],
      'player1',
      i,
      isValid,
      isLastSown,
      onPitClick && isValid ? () => onPitClick(i) : undefined
    );
    svg.appendChild(pitGroup);
  }

  // Add arrows showing direction
  const arrowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  arrowGroup.setAttribute('class', 'calla-arrows');

  // Arrow for player 1 (bottom row, left to right)
  const arrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow1.setAttribute('d', `M ${pitsStartX} ${p1Y + 25} L ${pitsStartX + PIT_SPACING * 4.5} ${p1Y + 25}`);
  arrow1.setAttribute('class', 'calla-arrow calla-arrow-p1');
  arrow1.setAttribute('marker-end', 'url(#arrowhead-p1)');
  arrowGroup.appendChild(arrow1);

  // Arrow for player 2 (top row, right to left)
  const arrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow2.setAttribute('d', `M ${pitsStartX + PIT_SPACING * 4.5} ${p2Y - 25} L ${pitsStartX} ${p2Y - 25}`);
  arrow2.setAttribute('class', 'calla-arrow calla-arrow-p2');
  arrow2.setAttribute('marker-end', 'url(#arrowhead-p2)');
  arrowGroup.appendChild(arrow2);

  // Arrowhead markers
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  const marker1 = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker1.setAttribute('id', 'arrowhead-p1');
  marker1.setAttribute('markerWidth', '10');
  marker1.setAttribute('markerHeight', '7');
  marker1.setAttribute('refX', '9');
  marker1.setAttribute('refY', '3.5');
  marker1.setAttribute('orient', 'auto');
  const polygon1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon1.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon1.setAttribute('fill', '#1976d2');
  marker1.appendChild(polygon1);
  defs.appendChild(marker1);

  const marker2 = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker2.setAttribute('id', 'arrowhead-p2');
  marker2.setAttribute('markerWidth', '10');
  marker2.setAttribute('markerHeight', '7');
  marker2.setAttribute('refX', '9');
  marker2.setAttribute('refY', '3.5');
  marker2.setAttribute('orient', 'auto');
  const polygon2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon2.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon2.setAttribute('fill', '#d32f2f');
  marker2.appendChild(polygon2);
  defs.appendChild(marker2);

  svg.appendChild(defs);
  svg.appendChild(arrowGroup);

  wrapper.appendChild(svg);

  // Last move info
  const lastMoveInfo = getLastMoveInfo(state);
  if (lastMoveInfo) {
    const infoEl = document.createElement('div');
    infoEl.className = 'calla-last-move';
    infoEl.textContent = lastMoveInfo;
    wrapper.appendChild(infoEl);
  }

  container.appendChild(wrapper);
}

// Create a pit element
function createPit(
  cx: number,
  cy: number,
  cubes: number,
  player: 'player1' | 'player2',
  _index: number,
  isValid: boolean,
  isLastSown: boolean,
  onClick?: () => void
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', `calla-pit calla-pit-${player === 'player1' ? 'p1' : 'p2'}${isValid ? ' calla-pit-valid' : ''}${isLastSown ? ' calla-pit-last' : ''}`);

  // Pit circle
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(cx));
  circle.setAttribute('cy', String(cy));
  circle.setAttribute('r', String(PIT_RADIUS));
  circle.setAttribute('class', 'calla-pit-circle');
  group.appendChild(circle);

  // Cube count
  const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  countText.setAttribute('x', String(cx));
  countText.setAttribute('y', String(cy + 6));
  countText.setAttribute('text-anchor', 'middle');
  countText.setAttribute('class', 'calla-pit-count');
  countText.textContent = String(cubes);
  group.appendChild(countText);

  // Cube indicators (small dots)
  if (cubes > 0 && cubes <= 6) {
    const cubeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    cubeGroup.setAttribute('class', 'calla-cubes');
    const angleStep = (Math.PI * 2) / Math.max(cubes, 1);
    const cubeRadius = PIT_RADIUS * 0.6;
    for (let i = 0; i < cubes; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const cubeX = cx + Math.cos(angle) * cubeRadius;
      const cubeY = cy + Math.sin(angle) * cubeRadius;
      const cube = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cube.setAttribute('cx', String(cubeX));
      cube.setAttribute('cy', String(cubeY));
      cube.setAttribute('r', '4');
      cube.setAttribute('class', 'calla-cube');
      cubeGroup.appendChild(cube);
    }
    group.appendChild(cubeGroup);
  }

  // Click handler
  if (onClick) {
    group.style.cursor = 'pointer';
    group.addEventListener('click', onClick);
  }

  return group;
}

// Create a Calla (store) element
function createCalla(
  x: number,
  y: number,
  cubes: number,
  player: 'player1' | 'player2',
  isCurrentPlayer: boolean
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', `calla-store calla-store-${player === 'player1' ? 'p1' : 'p2'}${isCurrentPlayer ? ' calla-store-active' : ''}`);

  // Calla rectangle (rounded)
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(x));
  rect.setAttribute('y', String(y));
  rect.setAttribute('width', String(CALLA_WIDTH));
  rect.setAttribute('height', String(CALLA_HEIGHT));
  rect.setAttribute('rx', '10');
  rect.setAttribute('class', 'calla-store-rect');
  group.appendChild(rect);

  // Cube count
  const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  countText.setAttribute('x', String(x + CALLA_WIDTH / 2));
  countText.setAttribute('y', String(y + CALLA_HEIGHT / 2 + 8));
  countText.setAttribute('text-anchor', 'middle');
  countText.setAttribute('class', 'calla-store-count');
  countText.textContent = String(cubes);
  group.appendChild(countText);

  // Label
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', String(x + CALLA_WIDTH / 2));
  label.setAttribute('y', String(y + 20));
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('class', 'calla-store-label');
  label.textContent = player === 'player1' ? '🔵' : '🔴';
  group.appendChild(label);

  return group;
}

// Render status display
export function renderStatus(
  state: CallaGameState,
  container: HTMLElement,
  _gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  isAIThinking: boolean = false
): void {
  container.innerHTML = '';

  const statusEl = document.createElement('div');
  statusEl.className = 'calla-status';

  // Turn indicator
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';

  if (state.winner) {
    turnEl.classList.add('status-winner');
    if (state.winner === 'tie') {
      turnEl.textContent = "🤝 It's a Tie! 🤝";
    } else {
      const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
      turnEl.textContent = `🎉 ${winnerName} Wins! 🎉`;
    }
  } else if (isAIThinking) {
    turnEl.textContent = '🤖 AI is thinking...';
    turnEl.classList.add('status-ai-thinking');
  } else {
    turnEl.textContent = getPhaseMessage(state);
  }

  statusEl.appendChild(turnEl);

  // Score display
  const scoreEl = document.createElement('div');
  scoreEl.className = 'calla-scores';

  const p1Score = document.createElement('div');
  p1Score.className = `calla-score calla-score-p1 ${state.currentPlayer === 'player1' ? 'active' : ''}`;
  p1Score.innerHTML = `🔵 Blue: <strong>${state.player1Calla}</strong>`;
  scoreEl.appendChild(p1Score);

  const p2Score = document.createElement('div');
  p2Score.className = `calla-score calla-score-p2 ${state.currentPlayer === 'player2' ? 'active' : ''}`;
  p2Score.innerHTML = `🔴 Red: <strong>${state.player2Calla}</strong>`;
  scoreEl.appendChild(p2Score);

  statusEl.appendChild(scoreEl);

  container.appendChild(statusEl);
}
