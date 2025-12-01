// Graph UI - Visual rendering of graphs and network boards
// SVG-based rendering for nodes, edges, and interactive elements

import {
  Graph,
  GraphBoard,
  NodeId,
  GraphRenderConfig,
  DEFAULT_GRAPH_CONFIG,
  NodeState,
} from './types';
import { getNeighbors } from './algorithms';

/**
 * Calculate the bounding box of all nodes
 */
function getBounds(graph: Graph): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  graph.nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x);
    maxY = Math.max(maxY, node.position.y);
  });

  return { minX, minY, maxX, maxY };
}

/**
 * Render a graph as SVG
 */
export function renderGraph(
  graph: Graph,
  nodeStates?: Map<NodeId, NodeState>,
  config: Partial<GraphRenderConfig> = {}
): SVGSVGElement {
  const cfg = { ...DEFAULT_GRAPH_CONFIG, ...config };
  const bounds = getBounds(graph);

  const width = bounds.maxX - bounds.minX + cfg.padding * 2 + cfg.nodeRadius * 2;
  const height = bounds.maxY - bounds.minY + cfg.padding * 2 + cfg.nodeRadius * 2;
  const offsetX = -bounds.minX + cfg.padding + cfg.nodeRadius;
  const offsetY = -bounds.minY + cfg.padding + cfg.nodeRadius;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('graph-view');

  // Render edges first (behind nodes)
  const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgesGroup.classList.add('edges');

  for (const edge of graph.edges) {
    const fromNode = graph.nodes.get(edge.from);
    const toNode = graph.nodes.get(edge.to);
    if (!fromNode || !toNode) continue;

    const x1 = fromNode.position.x + offsetX;
    const y1 = fromNode.position.y + offsetY;
    const x2 = toNode.position.x + offsetX;
    const y2 = toNode.position.y + offsetY;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', cfg.edgeColor);
    line.setAttribute('stroke-width', String(cfg.edgeWidth));
    line.setAttribute('stroke-linecap', 'round');
    line.dataset.from = edge.from;
    line.dataset.to = edge.to;

    edgesGroup.appendChild(line);

    // Add weight label if configured
    if (cfg.showWeights && edge.weight !== undefined) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(midX));
      text.setAttribute('y', String(midY));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.textContent = String(edge.weight);

      edgesGroup.appendChild(text);
    }
  }

  svg.appendChild(edgesGroup);

  // Render nodes
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.classList.add('nodes');

  graph.nodes.forEach((node, nodeId) => {
    const x = node.position.x + offsetX;
    const y = node.position.y + offsetY;
    const state = nodeStates?.get(nodeId);

    // Determine node color
    let fillColor = cfg.nodeColors.default;
    if (state?.disabled) {
      fillColor = cfg.nodeColors.disabled;
    } else if (state?.highlighted) {
      fillColor = cfg.nodeColors.highlighted;
    } else if (state?.owner === 1) {
      fillColor = cfg.nodeColors.player1;
    } else if (state?.owner === 2) {
      fillColor = cfg.nodeColors.player2;
    }

    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', String(cfg.nodeRadius));
    circle.setAttribute('fill', fillColor);
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    circle.dataset.nodeId = nodeId;
    circle.classList.add('graph-node');

    if (state?.highlighted) {
      circle.classList.add('highlighted');
    }

    nodesGroup.appendChild(circle);

    // Node label
    if (cfg.showLabels && node.label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(y));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', state?.owner ? 'white' : '#333');
      text.setAttribute('pointer-events', 'none');
      text.textContent = node.label;

      nodesGroup.appendChild(text);
    }

    // Value indicator
    if (state?.value !== undefined) {
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', String(x));
      valueText.setAttribute('y', String(y + cfg.nodeRadius + 14));
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '11');
      valueText.setAttribute('fill', '#666');
      valueText.textContent = String(state.value);

      nodesGroup.appendChild(valueText);
    }
  });

  svg.appendChild(nodesGroup);

  return svg;
}

/**
 * Create an interactive graph board
 */
export function createInteractiveGraph(
  board: GraphBoard,
  onNodeClick: (nodeId: NodeId) => void,
  onNodeHover: (nodeId: NodeId | null) => void,
  config: Partial<GraphRenderConfig> = {}
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'graph-container';
  container.style.cssText = 'position: relative; display: inline-block;';

  const svg = renderGraph(board.graph, board.nodeStates, config);
  container.appendChild(svg);

  // Add event listeners to nodes
  const nodes = svg.querySelectorAll('.graph-node');
  nodes.forEach((node) => {
    const nodeId = (node as SVGElement).dataset.nodeId;
    if (!nodeId) return;

    node.addEventListener('click', () => onNodeClick(nodeId));
    node.addEventListener('mouseenter', () => onNodeHover(nodeId));
    node.addEventListener('mouseleave', () => onNodeHover(null));

    (node as SVGElement).style.cursor = 'pointer';
  });

  return container;
}

/**
 * Highlight a path on the graph
 */
export function highlightPath(
  svg: SVGSVGElement,
  path: NodeId[],
  color: string = '#4caf50'
): void {
  // Highlight edges in path
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    const edge = svg.querySelector(`line[data-from="${from}"][data-to="${to}"]`) ||
      svg.querySelector(`line[data-from="${to}"][data-to="${from}"]`);

    if (edge) {
      (edge as SVGElement).setAttribute('stroke', color);
      (edge as SVGElement).setAttribute('stroke-width', '5');
    }
  }

  // Highlight nodes in path
  for (const nodeId of path) {
    const node = svg.querySelector(`circle[data-node-id="${nodeId}"]`);
    if (node) {
      (node as SVGElement).setAttribute('stroke', color);
      (node as SVGElement).setAttribute('stroke-width', '4');
    }
  }
}

/**
 * Clear all highlights from graph
 */
export function clearHighlights(svg: SVGSVGElement, config: Partial<GraphRenderConfig> = {}): void {
  const cfg = { ...DEFAULT_GRAPH_CONFIG, ...config };

  // Reset edges
  svg.querySelectorAll('line').forEach((edge) => {
    edge.setAttribute('stroke', cfg.edgeColor);
    edge.setAttribute('stroke-width', String(cfg.edgeWidth));
  });

  // Reset nodes
  svg.querySelectorAll('.graph-node').forEach((node) => {
    (node as SVGElement).setAttribute('stroke', '#333');
    (node as SVGElement).setAttribute('stroke-width', '2');
  });
}

/**
 * Show valid moves (highlight neighbor nodes)
 */
export function showValidMoves(
  svg: SVGSVGElement,
  graph: Graph,
  fromNode: NodeId,
  board: GraphBoard,
  config: Partial<GraphRenderConfig> = {}
): void {
  const cfg = { ...DEFAULT_GRAPH_CONFIG, ...config };
  const neighbors = getNeighbors(graph, fromNode);

  for (const neighborId of neighbors) {
    const state = board.nodeStates.get(neighborId);

    // Only highlight if not owned
    if (!state?.owner) {
      const node = svg.querySelector(`circle[data-node-id="${neighborId}"]`);
      if (node) {
        (node as SVGElement).setAttribute('stroke', cfg.nodeColors.highlighted);
        (node as SVGElement).setAttribute('stroke-width', '4');
        (node as SVGElement).setAttribute('stroke-dasharray', '5,3');
      }
    }
  }
}

/**
 * Animate a move along a path
 */
export function animateMove(
  svg: SVGSVGElement,
  path: NodeId[],
  graph: Graph,
  duration: number = 500
): Promise<void> {
  return new Promise((resolve) => {
    if (path.length < 2) {
      resolve();
      return;
    }

    // Create animated marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('r', '10');
    marker.setAttribute('fill', '#ff9800');
    marker.setAttribute('stroke', '#f57c00');
    marker.setAttribute('stroke-width', '2');
    svg.appendChild(marker);

    const bounds = svg.viewBox.baseVal;
    const offsetX = bounds.x;
    const offsetY = bounds.y;

    let currentStep = 0;
    const totalSteps = path.length - 1;
    const stepDuration = duration / totalSteps;

    function animateStep(): void {
      if (currentStep >= totalSteps) {
        marker.remove();
        resolve();
        return;
      }

      const fromNode = graph.nodes.get(path[currentStep]);
      const toNode = graph.nodes.get(path[currentStep + 1]);

      if (!fromNode || !toNode) {
        currentStep++;
        animateStep();
        return;
      }

      const startX = fromNode.position.x - offsetX + 40;
      const startY = fromNode.position.y - offsetY + 40;
      const endX = toNode.position.x - offsetX + 40;
      const endY = toNode.position.y - offsetY + 40;

      marker.setAttribute('cx', String(startX));
      marker.setAttribute('cy', String(startY));

      const startTime = performance.now();

      function animate(currentTime: number): void {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / stepDuration, 1);

        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;

        marker.setAttribute('cx', String(x));
        marker.setAttribute('cy', String(y));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          currentStep++;
          animateStep();
        }
      }

      requestAnimationFrame(animate);
    }

    animateStep();
  });
}

/**
 * Inject CSS styles for graph components
 */
export function injectGraphStyles(): void {
  const styleId = 'graph-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .graph-view {
      display: block;
    }

    .graph-node {
      transition: all 0.2s ease;
    }

    .graph-node:hover {
      filter: brightness(1.1);
      transform-origin: center;
    }

    .graph-node.highlighted {
      animation: pulse-node 0.8s ease-in-out infinite alternate;
    }

    @keyframes pulse-node {
      from { filter: brightness(1); }
      to { filter: brightness(1.2); }
    }

    .edges line {
      transition: all 0.2s ease;
    }

    .graph-container {
      user-select: none;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Create a legend for the graph
 */
export function createGraphLegend(
  config: Partial<GraphRenderConfig> = {}
): HTMLElement {
  const cfg = { ...DEFAULT_GRAPH_CONFIG, ...config };

  const legend = document.createElement('div');
  legend.className = 'graph-legend';
  legend.style.cssText = `
    display: flex;
    gap: 16px;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 6px;
    font-size: 13px;
  `;

  const items = [
    { color: cfg.nodeColors.default, label: 'Empty' },
    { color: cfg.nodeColors.player1, label: 'Player 1' },
    { color: cfg.nodeColors.player2, label: 'Player 2' },
    { color: cfg.nodeColors.highlighted, label: 'Valid Move' },
  ];

  for (const item of items) {
    const itemEl = document.createElement('div');
    itemEl.style.cssText = 'display: flex; align-items: center; gap: 6px;';

    const dot = document.createElement('span');
    dot.style.cssText = `
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${item.color};
      border: 2px solid #333;
    `;

    const label = document.createElement('span');
    label.textContent = item.label;

    itemEl.appendChild(dot);
    itemEl.appendChild(label);
    legend.appendChild(itemEl);
  }

  return legend;
}
