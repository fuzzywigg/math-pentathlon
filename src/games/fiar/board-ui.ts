// FIAR Board UI
// SVG rendering for the network-based game board

import { FiarGameState, CONFIG, Player } from './types';
import { getValidMoves, getSelectableNodes, findPaths } from './rules';

// Colors
const COLORS = {
  background: '#f5f0e6',
  edge: '#8b7355',
  node: '#dcd0c0',
  nodeHover: '#c9baa0',
  player1: '#2196f3',
  player2: '#f44336',
  validMove: '#4caf50',
  selected: '#ff9800',
  winningPath: '#ffd700',
  blockedPath: '#ff9800',
};

/**
 * Render the FIAR game board as SVG
 */
export function renderBoard(
  state: FiarGameState,
  onNodeClick: (nodeId: string) => void
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of state.board.nodes.values()) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  const padding = 60;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.maxWidth = `${width}px`;
  svg.style.maxHeight = `${height}px`;

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', (minX - padding).toString());
  bg.setAttribute('y', (minY - padding).toString());
  bg.setAttribute('width', width.toString());
  bg.setAttribute('height', height.toString());
  bg.setAttribute('fill', COLORS.background);
  bg.setAttribute('rx', '12');
  svg.appendChild(bg);

  // Get valid moves and selectable nodes
  const validMoves = state.selectedNode ? getValidMoves(state, state.selectedNode) : [];
  const selectableNodes = getSelectableNodes(state);

  // Get winning paths for highlighting
  const p1Paths = state.phase === 'movement' ? findPaths(state, 'player1') : [];
  const p2Paths = state.phase === 'movement' ? findPaths(state, 'player2') : [];
  const winningNodes = new Set<string>();
  const blockedNodes = new Set<string>();

  for (const path of [...p1Paths, ...p2Paths]) {
    if (path.nodes.length >= CONFIG.WIN_LENGTH) {
      const nodeSet = path.isBlocked ? blockedNodes : winningNodes;
      path.nodes.forEach((n) => nodeSet.add(n));
    }
  }

  // Draw edges
  for (const edge of state.board.edges) {
    const from = state.board.nodes.get(edge.from)!;
    const to = state.board.nodes.get(edge.to)!;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x.toString());
    line.setAttribute('y1', from.y.toString());
    line.setAttribute('x2', to.x.toString());
    line.setAttribute('y2', to.y.toString());
    line.setAttribute('stroke', COLORS.edge);
    line.setAttribute('stroke-width', CONFIG.EDGE_STROKE.toString());
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  }

  // Draw nodes
  for (const [nodeId, node] of state.board.nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-node-id', nodeId);
    g.style.cursor = 'pointer';

    // Node circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x.toString());
    circle.setAttribute('cy', node.y.toString());
    circle.setAttribute('r', CONFIG.NODE_RADIUS.toString());

    // Determine fill color
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
    } else if (state.phase === 'placement' && node.chip === null) {
      // Highlight empty nodes during placement
      fill = COLORS.nodeHover;
    }

    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth.toString());
    g.appendChild(circle);

    // Draw chip if present
    if (node.chip) {
      const chipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      chipCircle.setAttribute('cx', node.x.toString());
      chipCircle.setAttribute('cy', node.y.toString());
      chipCircle.setAttribute('r', (CONFIG.NODE_RADIUS - 6).toString());
      chipCircle.setAttribute('fill', node.chip === 'player1' ? COLORS.player1 : COLORS.player2);
      chipCircle.setAttribute('stroke', '#fff');
      chipCircle.setAttribute('stroke-width', '2');

      // Add shine effect
      const shine = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      shine.setAttribute('cx', (node.x - 4).toString());
      shine.setAttribute('cy', (node.y - 4).toString());
      shine.setAttribute('rx', '6');
      shine.setAttribute('ry', '4');
      shine.setAttribute('fill', 'rgba(255,255,255,0.3)');

      g.appendChild(chipCircle);
      g.appendChild(shine);

      // Highlight selectable chips
      if (selectableNodes.includes(nodeId)) {
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
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

    // Click handler
    g.addEventListener('click', () => onNodeClick(nodeId));

    // Hover effects
    g.addEventListener('mouseenter', () => {
      circle.setAttribute('filter', 'brightness(1.1)');
    });
    g.addEventListener('mouseleave', () => {
      circle.removeAttribute('filter');
    });

    svg.appendChild(g);
  }

  return svg;
}

/**
 * Inject CSS styles for FIAR
 */
export function injectFiarStyles(): void {
  const existingStyle = document.getElementById('fiar-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'fiar-styles';
  style.textContent = `
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

    .fiar-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .fiar-status.player1 {
      color: ${COLORS.player1};
    }

    .fiar-status.player2 {
      color: ${COLORS.player2};
    }

    .fiar-chips-info {
      display: flex;
      justify-content: center;
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
    }

    .fiar-chip-icon.player1 {
      background: ${COLORS.player1};
    }

    .fiar-chip-icon.player2 {
      background: ${COLORS.player2};
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
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

/**
 * Get player color
 */
export function getPlayerColor(player: Player): string {
  return player === 'player1' ? COLORS.player1 : COLORS.player2;
}
