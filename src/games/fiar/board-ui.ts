// FIAR Board UI — SVG rendering (marked chips, yellow center, gapped wins)

import type { FiarGameState, Player } from './types';
import { CONFIG } from './types';
import { injectStylesOnce } from '../../ui/inject-styles';
import {
  getValidMoves,
  getSelectableNodes,
  findPaths,
  canPlaceChip,
} from './rules';
import {
  getGameModeChromeRoot,
  getPlayerSeatColors,
} from '../../ui/player-colors';
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

/** Theme tokens for the 2D SVG board (marked-dot color matches kit green). */
const FIAR_THEME = {
  background: '#f5f0e6',
  edge: '#8b7355',
  edgeYellow: '#c9a227',
  node: '#dcd0c0',
  nodeHover: '#c9baa0',
  validMove: '#4caf50',
  selected: '#ff9800',
  winningPath: '#ffd700',
  blockedPath: '#ff9800',
  yellowCenter: 'rgba(255, 213, 79, 0.55)',
  yellowCenterStroke: '#e6b800',
  /** Marked Fire Extinguisher dot — kit uses green; rules PDFs say yellow. */
  markedDot: '#2e7d32',
};

const COLORS = FIAR_THEME;

/** True when vs-AI chrome is on and it is the computer's seat to act. */
function isComputerSeatTurn(state: FiarGameState): boolean {
  const root = getGameModeChromeRoot();
  if (root?.dataset.opponent !== 'ai') return false;
  const aiSeat = root.dataset.aiSeat === 'player1' ? 'player1' : 'player2';
  return state.currentPlayer === aiSeat;
}

/**
 * Render the FIAR game board as SVG
 */
export function renderBoard(
  state: FiarGameState,
  onNodeClick: (nodeId: string) => void
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const node of state.board.nodes.values()) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  const padding = 60;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  svg.setAttribute(
    'viewBox',
    `${minX - padding} ${minY - padding} ${width} ${height}`
  );
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.maxWidth = `${width}px`;
  svg.style.maxHeight = `${height}px`;
  markBoardAsGrid(svg);

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', (minX - padding).toString());
  bg.setAttribute('y', (minY - padding).toString());
  bg.setAttribute('width', width.toString());
  bg.setAttribute('height', height.toString());
  bg.setAttribute('fill', COLORS.background);
  bg.setAttribute('rx', '12');
  svg.appendChild(bg);

  // Yellow center region (visual; layout may mark edges that cross it)
  if (state.board.yellowCenter) {
    const yc = state.board.yellowCenter;
    if (yc.kind === 'diamond') {
      const d = yc.halfDiagonal;
      const poly = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
      );
      poly.setAttribute(
        'points',
        `${yc.cx},${yc.cy - d} ${yc.cx + d},${yc.cy} ${yc.cx},${yc.cy + d} ${yc.cx - d},${yc.cy}`
      );
      poly.setAttribute('fill', COLORS.yellowCenter);
      poly.setAttribute('stroke', COLORS.yellowCenterStroke);
      poly.setAttribute('stroke-width', '2');
      poly.setAttribute('data-yellow-center', '1');
      poly.setAttribute('data-yellow-shape', 'diamond');
      if (state.board.layoutVerified) {
        poly.setAttribute('data-layout-verified', '1');
      }
      svg.appendChild(poly);
    } else {
      const ellipse = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'ellipse'
      );
      ellipse.setAttribute('cx', yc.cx.toString());
      ellipse.setAttribute('cy', yc.cy.toString());
      ellipse.setAttribute('rx', yc.rx.toString());
      ellipse.setAttribute('ry', yc.ry.toString());
      ellipse.setAttribute('fill', COLORS.yellowCenter);
      ellipse.setAttribute('stroke', COLORS.yellowCenterStroke);
      ellipse.setAttribute('stroke-width', '2');
      ellipse.setAttribute('data-yellow-center', '1');
      ellipse.setAttribute('data-yellow-shape', 'ellipse');
      if (!state.board.layoutVerified) {
        ellipse.setAttribute('data-layout-unverified', '1');
      }
      svg.appendChild(ellipse);
    }
  }

  // Hex #383 / Kings pattern: omit actionable chrome on the AI seat.
  const announceTargets = !isComputerSeatTurn(state);
  const validMoves =
    announceTargets && state.selectedNode
      ? getValidMoves(state, state.selectedNode)
      : [];
  const selectableNodes = announceTargets ? getSelectableNodes(state) : [];

  const winningNodes = new Set<string>(state.winningPath ?? []);
  const blockedNodes = new Set<string>();

  if (winningNodes.size === 0) {
    const p1Paths = findPaths(state, 'player1');
    const p2Paths = findPaths(state, 'player2');
    for (const path of [...p1Paths, ...p2Paths]) {
      if (path.nodes.length >= CONFIG.WIN_LENGTH) {
        const nodeSet = path.isBlocked ? blockedNodes : winningNodes;
        path.nodes.forEach((n) => nodeSet.add(n));
      }
    }
  }

  for (const edge of state.board.edges) {
    const from = state.board.nodes.get(edge.from)!;
    const to = state.board.nodes.get(edge.to)!;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x.toString());
    line.setAttribute('y1', from.y.toString());
    line.setAttribute('x2', to.x.toString());
    line.setAttribute('y2', to.y.toString());
    line.setAttribute(
      'stroke',
      edge.crossesYellowCenter ? COLORS.edgeYellow : COLORS.edge
    );
    line.setAttribute('stroke-width', CONFIG.EDGE_STROKE.toString());
    line.setAttribute('stroke-linecap', 'round');
    if (edge.crossesYellowCenter) {
      line.setAttribute('stroke-dasharray', '6 4');
      line.setAttribute('data-crosses-yellow', '1');
    }
    svg.appendChild(line);
  }

  for (const [nodeId, node] of state.board.nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-node-id', nodeId);
    const parsed = /^c(\d+)r(\d+)$/.exec(nodeId);
    if (parsed) {
      g.setAttribute('data-col', parsed[1]!);
      g.setAttribute('data-row', parsed[2]!);
    } else {
      // Synthetic fixture ids (a, b, …) — keep a stable grid cell for a11y.
      g.setAttribute('data-row', '0');
      g.setAttribute('data-col', nodeId);
    }
    if (announceTargets) {
      g.style.cursor = 'pointer';
    }

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('cx', node.x.toString());
    circle.setAttribute('cy', node.y.toString());
    circle.setAttribute('r', CONFIG.NODE_RADIUS.toString());

    let fill = COLORS.node;
    let strokeColor = COLORS.edge;
    let strokeWidth = 2;

    if (validMoves.includes(nodeId)) {
      fill = COLORS.validMove;
      strokeWidth = 3;
    } else if (state.selectedNode === nodeId) {
      strokeColor = COLORS.selected;
      strokeWidth = 4;
    } else if (winningNodes.has(nodeId)) {
      strokeColor = COLORS.winningPath;
      strokeWidth = 4;
    } else if (blockedNodes.has(nodeId)) {
      strokeColor = COLORS.blockedPath;
      strokeWidth = 3;
    } else if (
      announceTargets &&
      state.phase === 'placement' &&
      node.chip === null
    ) {
      fill = COLORS.nodeHover;
    }

    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth.toString());
    g.appendChild(circle);

    if (node.chip) {
      const chipCircle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      chipCircle.setAttribute('cx', node.x.toString());
      chipCircle.setAttribute('cy', node.y.toString());
      chipCircle.setAttribute('r', (CONFIG.NODE_RADIUS - 6).toString());
      const seats = getPlayerSeatColors();
      chipCircle.setAttribute(
        'fill',
        node.chip === 'player1' ? seats.player1 : seats.player2
      );
      chipCircle.setAttribute('stroke', '#fff');
      chipCircle.setAttribute('stroke-width', '2');
      if (node.chipKind === 'marked') {
        chipCircle.setAttribute('data-marked', '1');
      }

      const shine = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'ellipse'
      );
      shine.setAttribute('cx', (node.x - 4).toString());
      shine.setAttribute('cy', (node.y - 4).toString());
      shine.setAttribute('rx', '6');
      shine.setAttribute('ry', '4');
      shine.setAttribute('fill', 'rgba(255,255,255,0.3)');

      g.appendChild(chipCircle);
      g.appendChild(shine);

      if (node.chipKind === 'marked') {
        const dot = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        dot.setAttribute('cx', (node.x + 6).toString());
        dot.setAttribute('cy', (node.y + 6).toString());
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', COLORS.markedDot);
        dot.setAttribute('stroke', '#fff');
        dot.setAttribute('stroke-width', '1');
        dot.setAttribute('data-marked-dot', '1');
        // Legacy alias kept for older chrome tests.
        dot.setAttribute('data-yellow-dot', '1');
        g.appendChild(dot);
      }

      if (selectableNodes.includes(nodeId)) {
        const highlight = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        highlight.setAttribute('cx', node.x.toString());
        highlight.setAttribute('cy', node.y.toString());
        highlight.setAttribute('r', (CONFIG.NODE_RADIUS + 4).toString());
        highlight.setAttribute('fill', 'none');
        highlight.setAttribute('stroke', COLORS.selected);
        highlight.setAttribute('stroke-width', '2');
        highlight.setAttribute('stroke-dasharray', '4 2');
        highlight.setAttribute('class', 'pulse-highlight');
        g.insertBefore(highlight, g.firstChild);
      }
    }

    const owner =
      node.chip === 'player1'
        ? 'Blue'
        : node.chip === 'player2'
          ? 'Red'
          : undefined;
    const isValidMove = validMoves.includes(nodeId);
    const isPlaceable =
      announceTargets &&
      state.phase === 'placement' &&
      node.chip === null &&
      canPlaceChip(state, nodeId);
    const extras: string[] = [];
    if (state.selectedNode === nodeId) extras.push('selected');
    if (node.chipKind === 'marked') extras.push('marked blocker');

    const coordLabel = parsed
      ? `${parsed[2]},${parsed[1]}`
      : nodeId.includes('-')
        ? nodeId.replace('-', ',')
        : nodeId;

    makeGridCell(
      g,
      buildCellAriaLabel({
        coord: coordLabel,
        empty: node.chip === null,
        ...(owner !== undefined ? { owner } : {}),
        validMove: isValidMove,
        selectable:
          state.phase === 'movement' && selectableNodes.includes(nodeId),
        validPlacement: isPlaceable,
        ...(extras.length ? { extras } : {}),
      })
    );

    if (announceTargets) {
      const activate = () => onNodeClick(nodeId);
      g.addEventListener('click', activate);
      bindCellActivateKeys(g, activate);

      g.addEventListener('mouseenter', () => {
        circle.setAttribute('filter', 'brightness(1.1)');
      });
      g.addEventListener('mouseleave', () => {
        circle.removeAttribute('filter');
      });
    }

    svg.appendChild(g);
  }

  bindGridNavigation(svg);
  applyRovingTabindex(collectGridCells(svg));
  return svg;
}

export function injectFiarStyles(): void {
  injectStylesOnce(
    'fiar-styles',
    `
    .fiar-board-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    .fiar-board-container svg {
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
    }

    .pulse-highlight {
      animation: fiar-pulse 1s ease-in-out infinite;
    }

    @keyframes fiar-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pulse-highlight,
      .fiar-winner-banner {
        animation: none !important;
      }
    }

    .fiar-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .fiar-status.player1 {
      color: var(--color-player1-text, #1d4ed8);
    }

    .fiar-status.player2 {
      color: var(--color-player2-text, #b91c1c);
    }

    .fiar-starter-banner {
      text-align: center;
      font-size: 0.95rem;
      padding: 0.35rem 0.75rem;
      margin: 0.25rem auto 0.5rem;
      max-width: 28rem;
      border-radius: 6px;
      background: rgba(0,0,0,0.06);
    }

    .fiar-chips-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 2rem;
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .fiar-chip-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .fiar-chip-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      position: relative;
    }

    .fiar-chip-icon.player1 {
      background: var(--color-player1, #2196f3);
    }

    .fiar-chip-icon.player2 {
      background: var(--color-player2, #f44336);
    }

    .fiar-chip-icon.marked::after {
      content: '';
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fiar-marked-dot, #2e7d32);
      border: 1px solid #fff;
    }

    .fiar-chip-kind-picker {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.5rem;
      flex-wrap: wrap;
    }

    .fiar-chip-kind-btn {
      appearance: none;
      border: 2px solid #8b7355;
      background: #fff;
      border-radius: 8px;
      padding: 0.45rem 0.85rem;
      min-height: 44px;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .fiar-chip-kind-btn[aria-pressed="true"] {
      border-color: #ff9800;
      background: #fff3e0;
      font-weight: 600;
    }

    .fiar-chip-kind-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .fiar-winner-banner {
      text-align: center;
      padding: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
      border-radius: 8px;
      margin: 1rem;
      animation: winner-glow 1s ease-in-out infinite alternate;
    }

    @keyframes winner-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }
  `
  );
}

export function getPlayerColor(player: Player): string {
  const colors = getPlayerSeatColors();
  return player === 'player1' ? colors.player1 : colors.player2;
}
