// Star Track Board UI - Renders the star-shaped track and game elements

import { StarTrackGameState, Player, TRACK_LENGTH, ChainLink } from './types';
import { getProgress, getPhaseMessage } from './rules';

export type DrawChainsCallback = () => void;
export type SelectChainCallback = (index: 0 | 1) => void;

// Render the star track board
export function renderBoard(
  state: StarTrackGameState,
  container: HTMLElement,
  onDrawChains?: DrawChainsCallback,
  onSelectChain?: SelectChainCallback
): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'star-track-wrapper';

  // Create SVG for the star track
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'star-track-board');
  svg.setAttribute('viewBox', '0 0 400 400');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Draw the star-shaped track
  // We'll draw two paths from opposite points toward the center
  const centerX = 200;
  const centerY = 200;
  const outerRadius = 180;

  // Player 1 starts from top, Player 2 from bottom
  // Both race to the center

  // Draw track backgrounds
  const trackGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  trackGroup.setAttribute('class', 'star-track-paths');

  // Draw spaces for Player 1 (top to center - blue path)
  const p1Spaces = createTrackSpaces(centerX, centerY - outerRadius, centerX, centerY, 'player1');
  trackGroup.appendChild(p1Spaces);

  // Draw spaces for Player 2 (bottom to center - red path)
  const p2Spaces = createTrackSpaces(centerX, centerY + outerRadius, centerX, centerY, 'player2');
  trackGroup.appendChild(p2Spaces);

  // Draw center goal
  const goalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  goalCircle.setAttribute('cx', String(centerX));
  goalCircle.setAttribute('cy', String(centerY));
  goalCircle.setAttribute('r', '25');
  goalCircle.setAttribute('class', 'star-track-goal');
  trackGroup.appendChild(goalCircle);

  // Goal label
  const goalLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  goalLabel.setAttribute('x', String(centerX));
  goalLabel.setAttribute('y', String(centerY + 5));
  goalLabel.setAttribute('text-anchor', 'middle');
  goalLabel.setAttribute('class', 'star-track-goal-label');
  goalLabel.textContent = '★';
  trackGroup.appendChild(goalLabel);

  svg.appendChild(trackGroup);

  // Draw player pieces
  const piecesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  piecesGroup.setAttribute('class', 'star-track-pieces');

  // Player 1 piece
  const p1Pos = getSpacePosition(state.player1Position, centerX, centerY - outerRadius, centerX, centerY);
  const p1Piece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p1Piece.setAttribute('cx', String(p1Pos.x));
  p1Piece.setAttribute('cy', String(p1Pos.y));
  p1Piece.setAttribute('r', '12');
  p1Piece.setAttribute('class', 'star-track-piece star-track-piece-p1');
  piecesGroup.appendChild(p1Piece);

  // Player 2 piece
  const p2Pos = getSpacePosition(state.player2Position, centerX, centerY + outerRadius, centerX, centerY);
  const p2Piece = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p2Piece.setAttribute('cx', String(p2Pos.x));
  p2Piece.setAttribute('cy', String(p2Pos.y));
  p2Piece.setAttribute('r', '12');
  p2Piece.setAttribute('class', 'star-track-piece star-track-piece-p2');
  piecesGroup.appendChild(p2Piece);

  svg.appendChild(piecesGroup);

  // Add decorative star points
  const decorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  decorGroup.setAttribute('class', 'star-track-decor');

  // Add star rays for visual appeal
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const rayLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rayLine.setAttribute('x1', String(centerX));
    rayLine.setAttribute('y1', String(centerY));
    rayLine.setAttribute('x2', String(centerX + Math.cos(angle) * outerRadius * 0.4));
    rayLine.setAttribute('y2', String(centerY + Math.sin(angle) * outerRadius * 0.4));
    rayLine.setAttribute('class', 'star-track-ray');
    decorGroup.appendChild(rayLine);
  }

  svg.appendChild(decorGroup);

  wrapper.appendChild(svg);

  // Chain selection area
  const chainArea = document.createElement('div');
  chainArea.className = 'star-track-chain-area';

  if (state.phase === 'drawChains' && onDrawChains) {
    // Show draw button
    const drawBtn = document.createElement('button');
    drawBtn.className = 'star-track-draw-btn';
    drawBtn.textContent = '🔗 Draw Chains';
    drawBtn.addEventListener('click', onDrawChains);
    chainArea.appendChild(drawBtn);

    const bucketInfo = document.createElement('div');
    bucketInfo.className = 'star-track-bucket-info';
    bucketInfo.textContent = `${state.chainBucket.length} chains in bucket`;
    chainArea.appendChild(bucketInfo);
  } else if (state.phase === 'selectChain' && state.drawnChains && onSelectChain) {
    // Show chain choices
    const choiceLabel = document.createElement('div');
    choiceLabel.className = 'star-track-choice-label';
    choiceLabel.textContent = 'Choose a chain:';
    chainArea.appendChild(choiceLabel);

    const choices = document.createElement('div');
    choices.className = 'star-track-choices';

    state.drawnChains.forEach((chain, index) => {
      const chainBtn = document.createElement('button');
      chainBtn.className = 'star-track-chain-btn';
      chainBtn.innerHTML = renderChainLink(chain);
      chainBtn.addEventListener('click', () => onSelectChain(index as 0 | 1));
      choices.appendChild(chainBtn);
    });

    chainArea.appendChild(choices);
  } else if (state.phase === 'gameOver') {
    const winnerMsg = document.createElement('div');
    winnerMsg.className = 'star-track-winner';
    const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
    winnerMsg.textContent = `🎉 ${winnerName} reaches the star! 🎉`;
    chainArea.appendChild(winnerMsg);
  }

  wrapper.appendChild(chainArea);
  container.appendChild(wrapper);
}

// Create track spaces from start to end
function createTrackSpaces(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  player: Player
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', `star-track-path star-track-path-${player === 'player1' ? 'p1' : 'p2'}`);

  // Draw the track line
  const trackLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  trackLine.setAttribute('x1', String(startX));
  trackLine.setAttribute('y1', String(startY));
  trackLine.setAttribute('x2', String(endX));
  trackLine.setAttribute('y2', String(endY));
  trackLine.setAttribute('class', 'star-track-line');
  group.appendChild(trackLine);

  // Draw space markers
  for (let i = 0; i <= TRACK_LENGTH; i++) {
    const t = i / TRACK_LENGTH;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;

    const space = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    space.setAttribute('cx', String(x));
    space.setAttribute('cy', String(y));
    space.setAttribute('r', i === TRACK_LENGTH ? '8' : '6');
    space.setAttribute('class', `star-track-space ${i === 0 ? 'star-track-start' : ''} ${i === TRACK_LENGTH ? 'star-track-end' : ''}`);
    group.appendChild(space);

    // Add number labels for some spaces
    if (i > 0 && i < TRACK_LENGTH && i % 3 === 0) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const offsetX = player === 'player1' ? -15 : 15;
      label.setAttribute('x', String(x + offsetX));
      label.setAttribute('y', String(y + 4));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'star-track-space-label');
      label.textContent = String(i);
      group.appendChild(label);
    }
  }

  return group;
}

// Get position coordinates for a space
function getSpacePosition(
  space: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number } {
  const t = Math.min(space, TRACK_LENGTH) / TRACK_LENGTH;
  return {
    x: startX + (endX - startX) * t,
    y: startY + (endY - startY) * t,
  };
}

// Render a chain link as HTML
function renderChainLink(chain: ChainLink): string {
  const links = '🔗'.repeat(chain.length);
  return `<span class="chain-links">${links}</span><span class="chain-length">${chain.length}</span>`;
}

// Render status display
export function renderStatus(
  state: StarTrackGameState,
  container: HTMLElement,
  _gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  isAIThinking: boolean = false
): void {
  container.innerHTML = '';

  const statusEl = document.createElement('div');
  statusEl.className = 'star-track-status';

  // Turn indicator
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';

  if (state.winner) {
    turnEl.classList.add('status-winner');
    const winnerName = state.winner === 'player1' ? 'Blue' : 'Red';
    turnEl.textContent = `🎉 ${winnerName} Wins! 🎉`;
  } else if (isAIThinking) {
    turnEl.textContent = '🤖 AI is thinking...';
    turnEl.classList.add('status-ai-thinking');
  } else {
    turnEl.textContent = getPhaseMessage(state);
  }

  statusEl.appendChild(turnEl);

  // Progress bars
  const progressEl = document.createElement('div');
  progressEl.className = 'star-track-progress';

  const p1Progress = document.createElement('div');
  p1Progress.className = 'progress-bar progress-p1';
  p1Progress.innerHTML = `
    <span class="progress-label">🔵 Blue</span>
    <div class="progress-track">
      <div class="progress-fill" style="width: ${getProgress(state, 'player1')}%"></div>
    </div>
    <span class="progress-value">${state.player1Position}/${TRACK_LENGTH}</span>
  `;
  progressEl.appendChild(p1Progress);

  const p2Progress = document.createElement('div');
  p2Progress.className = 'progress-bar progress-p2';
  p2Progress.innerHTML = `
    <span class="progress-label">🔴 Red</span>
    <div class="progress-track">
      <div class="progress-fill" style="width: ${getProgress(state, 'player2')}%"></div>
    </div>
    <span class="progress-value">${state.player2Position}/${TRACK_LENGTH}</span>
  `;
  progressEl.appendChild(p2Progress);

  statusEl.appendChild(progressEl);

  container.appendChild(statusEl);
}
