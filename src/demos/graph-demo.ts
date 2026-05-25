// Graph/Network System Demo Page
// Interactive demo for testing graph structures, algorithms, and rendering

import { navigate } from '../core/router';
import {
  Graph,
  GraphBoard,
  NodeId,
  NodeState,
  createGridGraph,
  createCircularGraph,
  createStarGraph,
  createHexLatticeGraph,
  createTrackGraph,
  createCompleteGraph,
} from '../core/graph/types';
import {
  bfs,
  isConnected,
  findComponents,
  findAllPlayerRegions,
  playerConnectsSets,
} from '../core/graph/algorithms';
import {
  renderGraph,
  createInteractiveGraph,
  highlightPath,
  injectGraphStyles,
  createGraphLegend,
} from '../core/graph/graph-ui';

export function renderGraphDemo(container: HTMLElement): void {
  injectGraphStyles();

  container.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to home">← Back</button>
      <h1>Graph/Network System Demo</h1>
    </header>

    <div class="demo-container">
      <div class="demo-section">
        <h2>Graph Templates</h2>
        <p>Pre-built graph structures for different game types</p>

        <div class="template-selector">
          <button class="template-btn selected" data-template="grid">4x4 Grid</button>
          <button class="template-btn" data-template="circular">Circular (8)</button>
          <button class="template-btn" data-template="star">Star (6)</button>
          <button class="template-btn" data-template="hex">Hex Lattice</button>
          <button class="template-btn" data-template="track">Track (10)</button>
          <button class="template-btn" data-template="complete">Complete (5)</button>
        </div>

        <div id="template-graph" class="graph-display"></div>
        <div id="template-info" class="graph-info"></div>
      </div>

      <div class="demo-section">
        <h2>Pathfinding</h2>
        <p>Click two nodes to find the shortest path between them</p>

        <div class="pathfinding-controls">
          <span id="path-status">Click a node to set start point</span>
          <button id="clear-path-btn">Clear</button>
        </div>

        <div id="pathfinding-graph" class="graph-display"></div>
        <div id="path-result" class="path-result"></div>
      </div>

      <div class="demo-section">
        <h2>Interactive Game Board</h2>
        <p>Click to claim nodes for Player 1 (blue) or Player 2 (red)</p>

        <div class="game-controls">
          <button class="player-btn selected" data-player="1">Player 1</button>
          <button class="player-btn" data-player="2">Player 2</button>
          <button id="clear-game-btn">Clear Board</button>
        </div>

        <div id="game-legend"></div>
        <div id="game-graph" class="graph-display"></div>
        <div id="game-analysis" class="game-analysis"></div>
      </div>

      <div class="demo-section">
        <h2>Connectivity Analysis</h2>
        <p>Analyze graph properties and player territories</p>

        <div id="connectivity-info" class="connectivity-info"></div>
      </div>
    </div>

    <style>
      .demo-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
      }

      .demo-section {
        background: #f9f9f9;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .demo-section h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .demo-section p {
        color: #666;
        margin: 0 0 1rem 0;
      }

      .template-selector,
      .game-controls,
      .pathfinding-controls {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
        align-items: center;
      }

      .template-btn,
      .player-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      }

      .template-btn:hover,
      .player-btn:hover {
        border-color: #2196f3;
      }

      .template-btn.selected {
        background: #2196f3;
        border-color: #2196f3;
        color: white;
      }

      .player-btn[data-player="1"].selected {
        background: #2196f3;
        border-color: #2196f3;
        color: white;
      }

      .player-btn[data-player="2"].selected {
        background: #f44336;
        border-color: #f44336;
        color: white;
      }

      #clear-path-btn,
      #clear-game-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        margin-left: auto;
      }

      #clear-path-btn:hover,
      #clear-game-btn:hover {
        border-color: #f44336;
        background: #ffebee;
      }

      #path-status {
        flex: 1;
        color: #666;
        font-size: 0.9rem;
      }

      .graph-display {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        min-height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .graph-info,
      .path-result,
      .game-analysis,
      .connectivity-info {
        margin-top: 1rem;
        padding: 0.75rem;
        background: white;
        border-radius: 6px;
        font-size: 0.9rem;
        color: #555;
      }

      .graph-info strong,
      .path-result strong {
        color: #333;
      }

      #game-legend {
        margin-bottom: 1rem;
      }

      .game-analysis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .analysis-card {
        background: #f5f5f5;
        padding: 0.75rem;
        border-radius: 6px;
      }

      .analysis-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.85rem;
        color: #666;
      }

      .analysis-card .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }

      .connectivity-info ul {
        margin: 0.5rem 0 0 0;
        padding-left: 1.5rem;
      }

      @media (max-width: 600px) {
        .template-selector {
          flex-direction: column;
        }

        .template-btn {
          width: 100%;
        }
      }
    </style>
  `;

  // Wire up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('/'));
  }

  // Initialize sections
  initTemplateSection();
  initPathfindingSection();
  initGameSection();
}

function initTemplateSection(): void {
  const graphContainer = document.getElementById('template-graph');
  const infoContainer = document.getElementById('template-info');
  const templateBtns = document.querySelectorAll('.template-btn');

  let currentGraph: Graph = createGridGraph(4, 4);

  function renderCurrentGraph(): void {
    if (!graphContainer || !infoContainer) return;

    graphContainer.innerHTML = '';
    const svg = renderGraph(currentGraph, undefined, { nodeRadius: 18, showLabels: true });
    graphContainer.appendChild(svg);

    // Show graph info
    const nodeCount = currentGraph.nodes.size;
    const edgeCount = currentGraph.edges.length;
    const connected = isConnected(currentGraph);
    const components = findComponents(currentGraph);

    infoContainer.innerHTML = `
      <strong>Nodes:</strong> ${nodeCount} |
      <strong>Edges:</strong> ${edgeCount} |
      <strong>Connected:</strong> ${connected ? 'Yes' : 'No'} |
      <strong>Components:</strong> ${components.length}
    `;
  }

  templateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      templateBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      const template = (btn as HTMLElement).dataset.template;

      switch (template) {
        case 'grid':
          currentGraph = createGridGraph(4, 4);
          break;
        case 'circular':
          currentGraph = createCircularGraph(8);
          break;
        case 'star':
          currentGraph = createStarGraph(6);
          break;
        case 'hex':
          currentGraph = createHexLatticeGraph(2, 35);
          break;
        case 'track':
          currentGraph = createTrackGraph(10);
          break;
        case 'complete':
          currentGraph = createCompleteGraph(5, 100);
          break;
      }

      renderCurrentGraph();
    });
  });

  renderCurrentGraph();
}

function initPathfindingSection(): void {
  const graphContainer = document.getElementById('pathfinding-graph');
  const statusEl = document.getElementById('path-status');
  const resultEl = document.getElementById('path-result');
  const clearBtn = document.getElementById('clear-path-btn');

  const graph = createGridGraph(5, 5, 70);
  let startNode: NodeId | null = null;
  let endNode: NodeId | null = null;
  let svg: SVGSVGElement | null = null;

  function render(): void {
    if (!graphContainer) return;

    graphContainer.innerHTML = '';

    const nodeStates = new Map<NodeId, NodeState>();

    if (startNode) {
      nodeStates.set(startNode, { highlighted: true });
    }
    if (endNode) {
      nodeStates.set(endNode, { highlighted: true });
    }

    svg = renderGraph(graph, nodeStates, { nodeRadius: 20, showLabels: true });
    graphContainer.appendChild(svg);

    // Add click handlers
    svg.querySelectorAll('.graph-node').forEach((node) => {
      const nodeId = (node as SVGElement).dataset.nodeId;
      if (!nodeId) return;

      (node as SVGElement).style.cursor = 'pointer';
      node.addEventListener('click', () => handleNodeClick(nodeId));
    });

    // Show path if both nodes selected
    if (startNode && endNode && svg) {
      const result = bfs(graph, startNode, endNode);

      if (result.found) {
        highlightPath(svg, result.path, '#4caf50');

        if (resultEl) {
          resultEl.innerHTML = `
            <strong>Path found!</strong><br>
            Distance: ${result.distance} steps<br>
            Path: ${result.path.join(' → ')}
          `;
        }
      } else {
        if (resultEl) {
          resultEl.innerHTML = '<strong>No path found</strong>';
        }
      }
    }
  }

  function handleNodeClick(nodeId: NodeId): void {
    if (!startNode) {
      startNode = nodeId;
      if (statusEl) statusEl.textContent = `Start: ${nodeId} - Click another node for end point`;
    } else if (!endNode && nodeId !== startNode) {
      endNode = nodeId;
      if (statusEl) statusEl.textContent = `Path from ${startNode} to ${endNode}`;
    } else {
      // Reset and start new selection
      startNode = nodeId;
      endNode = null;
      if (statusEl) statusEl.textContent = `Start: ${nodeId} - Click another node for end point`;
      if (resultEl) resultEl.innerHTML = '';
    }

    render();
  }

  clearBtn?.addEventListener('click', () => {
    startNode = null;
    endNode = null;
    if (statusEl) statusEl.textContent = 'Click a node to set start point';
    if (resultEl) resultEl.innerHTML = '';
    render();
  });

  render();
}

function initGameSection(): void {
  const graphContainer = document.getElementById('game-graph');
  const legendContainer = document.getElementById('game-legend');
  const analysisContainer = document.getElementById('game-analysis');
  const playerBtns = document.querySelectorAll('.player-btn');
  const clearBtn = document.getElementById('clear-game-btn');

  const graph = createHexLatticeGraph(2, 40);
  const nodeStates = new Map<NodeId, NodeState>();
  let currentPlayer = 1;

  // Add legend
  if (legendContainer) {
    legendContainer.appendChild(createGraphLegend());
  }

  function render(): void {
    if (!graphContainer) return;

    graphContainer.innerHTML = '';

    const board: GraphBoard = { graph, nodeStates };

    const interactive = createInteractiveGraph(
      board,
      (nodeId) => {
        const state = nodeStates.get(nodeId);
        if (!state?.owner) {
          nodeStates.set(nodeId, { owner: currentPlayer });
          render();
          updateAnalysis();
        }
      },
      () => {},
      { nodeRadius: 22, showLabels: false }
    );

    graphContainer.appendChild(interactive);
  }

  function updateAnalysis(): void {
    if (!analysisContainer) return;

    const board: GraphBoard = { graph, nodeStates };

    // Count territories
    let p1Count = 0;
    let p2Count = 0;
    nodeStates.forEach((state) => {
      if (state.owner === 1) p1Count++;
      if (state.owner === 2) p2Count++;
    });

    // Find regions
    const p1Regions = findAllPlayerRegions(board, 1);
    const p2Regions = findAllPlayerRegions(board, 2);

    // Check edge connections (for Hex-style win)
    const nodeIds = Array.from(graph.nodes.keys());
    const topEdge = nodeIds.filter((id) => {
      const node = graph.nodes.get(id);
      return node && node.position.y < -50;
    });
    const bottomEdge = nodeIds.filter((id) => {
      const node = graph.nodes.get(id);
      return node && node.position.y > 50;
    });

    const p1Connects = playerConnectsSets(board, 1, topEdge, bottomEdge);
    const p2Connects = playerConnectsSets(board, 2, topEdge, bottomEdge);

    analysisContainer.innerHTML = `
      <div class="analysis-card">
        <h4>Player 1 (Blue)</h4>
        <div class="value">${p1Count} nodes</div>
        <div>${p1Regions.length} region(s)</div>
        ${p1Connects ? '<div style="color: #4caf50;">Connects edges!</div>' : ''}
      </div>
      <div class="analysis-card">
        <h4>Player 2 (Red)</h4>
        <div class="value">${p2Count} nodes</div>
        <div>${p2Regions.length} region(s)</div>
        ${p2Connects ? '<div style="color: #4caf50;">Connects edges!</div>' : ''}
      </div>
      <div class="analysis-card">
        <h4>Board Status</h4>
        <div class="value">${graph.nodes.size - p1Count - p2Count} empty</div>
        <div>Total: ${graph.nodes.size} nodes</div>
      </div>
    `;
  }

  playerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playerBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentPlayer = parseInt((btn as HTMLElement).dataset.player!, 10);
    });
  });

  clearBtn?.addEventListener('click', () => {
    nodeStates.clear();
    render();
    updateAnalysis();
  });

  render();
  updateAnalysis();
}
