/**
 * q-mp-327 — Characterize graph-ui soft-fail / animate-handle / empty-graph edges.
 *
 * Tests only. Structural asserts (DOM shape, promise settle, cancel idempotency,
 * attribute presence). No player-facing copy pins, no src edits.
 *
 * Narrowed vs open drafts: #814 wave 9 is attribute/fraction/dice (disjoint);
 * wave 8 mutation-ui8 covers reduced-motion guards only — this file targets
 * cancel handle, sparse-path skip, and empty-graph render residuals.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  animateMove,
  clearHighlights,
  createInteractiveGraph,
  highlightPath,
  renderGraph,
  showValidMoves,
} from '../../src/core/graph/graph-ui';
import {
  createTrackGraph,
  type Graph,
  type GraphBoard,
  type NodeId,
} from '../../src/core/graph/types';
import { stubRafClock } from '../helpers/raf-clock';

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.useRealTimers();
  // Targeted only — restoreAllMocks breaks hoisted vi.mock on isolate:false.
  const nowFn = performance.now as unknown as { mockRestore?: () => void };
  nowFn.mockRestore?.();
});

function emptyGraph(edges: Graph['edges'] = []): Graph {
  return { nodes: new Map(), edges, directed: false };
}

describe('q-mp-327 graph-ui — empty-graph soft paths', () => {
  it('renderGraph on empty nodes yields graph-view with zero nodes/edges', () => {
    const svg = renderGraph(emptyGraph());
    expect(svg.classList.contains('graph-view')).toBe(true);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(0);
    expect(svg.querySelectorAll('.edges line')).toHaveLength(0);
    expect(svg.querySelector('g.nodes')).toBeTruthy();
    expect(svg.querySelector('g.edges')).toBeTruthy();
    // Empty bounds → non-finite geometry; still emits width/height/viewBox attrs.
    expect(svg.hasAttribute('width')).toBe(true);
    expect(svg.hasAttribute('height')).toBe(true);
    expect(svg.hasAttribute('viewBox')).toBe(true);
    expect(Number.isFinite(Number(svg.getAttribute('width')))).toBe(false);
  });

  it('orphan edges on empty node map are soft-skipped (no lines)', () => {
    const svg = renderGraph(
      emptyGraph([
        { from: 'ghost-a', to: 'ghost-b' },
        { from: 'x', to: 'y', weight: 3 },
      ]),
      undefined,
      { showWeights: true }
    );
    expect(svg.querySelectorAll('.edges line')).toHaveLength(0);
    expect(svg.querySelectorAll('.edges text')).toHaveLength(0);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(0);
  });

  it('highlightPath / clearHighlights / showValidMoves no-op on empty svg graph', () => {
    const graph = emptyGraph();
    const svg = renderGraph(graph);
    const board: GraphBoard = { graph, nodeStates: new Map() };

    expect(() => highlightPath(svg, [], '#4caf50')).not.toThrow();
    expect(() => highlightPath(svg, ['missing'], '#4caf50')).not.toThrow();
    expect(() => clearHighlights(svg)).not.toThrow();
    expect(() =>
      showValidMoves(svg, graph, 'missing' as NodeId, board)
    ).not.toThrow();
    expect(svg.querySelectorAll('line[stroke-width="5"]')).toHaveLength(0);
    expect(svg.querySelectorAll('circle[stroke-dasharray]')).toHaveLength(0);
  });
});

/** Pair with stubRafClock so settle()'s cancelAnimationFrame clears setTimeout. */
function stubCancelAnimationFrameAsClearTimeout(): void {
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    clearTimeout(id);
  });
}

describe('q-mp-327 graph-ui — animateMove handle soft-fail', () => {
  it('cancel mid-flight settles promise and removes orange marker', async () => {
    stubRafClock();
    stubCancelAnimationFrameAsClearTimeout();
    const graph = createTrackGraph(4);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    const handle = animateMove(svg, ['t0', 't1', 't2', 't3'], graph, 500);
    expect(typeof handle.cancel).toBe('function');

    // First RAF step creates the marker.
    await vi.advanceTimersByTimeAsync(16);
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(1);

    handle.cancel();
    await expect(handle).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });

  it('double cancel is idempotent; promise settles once', async () => {
    stubRafClock();
    stubCancelAnimationFrameAsClearTimeout();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    const handle = animateMove(svg, ['t0', 't1', 't2'], graph, 400);
    await vi.advanceTimersByTimeAsync(16);
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(1);

    handle.cancel();
    handle.cancel();
    handle.cancel();
    await expect(handle).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);

    // Advance leftover stub RAF timers — must stay settled, no marker revival.
    await vi.advanceTimersByTimeAsync(2000);
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });

  it('sparse path holes soft-skip undefined steps and still resolve', async () => {
    stubRafClock();
    stubCancelAnimationFrameAsClearTimeout();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    // Hole at index 1 → fromId/toId undefined branches in animateStep.
    const path = ['t0', undefined, 't2'] as unknown as NodeId[];
    const handle = animateMove(svg, path, graph, 80);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(handle).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });

  it('cancel after start hits in-flight cancelled branch without leftover marker', async () => {
    stubRafClock();
    // No-op cancelAnimationFrame so the pending stub setTimeout still fires
    // after cancel(), exercising the cancelled guard inside nested animate().
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    const handle = animateMove(svg, ['t0', 't1', 't2'], graph, 320);
    await vi.advanceTimersByTimeAsync(32);
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(1);

    handle.cancel();
    await vi.advanceTimersByTimeAsync(64);
    await expect(handle).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });

  it('cancel during missing mid-node lookup hits cancelled animateStep guard', async () => {
    stubRafClock();
    stubCancelAnimationFrameAsClearTimeout();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    const handleRef: {
      current: (Promise<void> & { cancel: () => void }) | null;
    } = { current: null };
    const origGet = graph.nodes.get.bind(graph.nodes);
    graph.nodes.get = ((id: NodeId) => {
      if (id === 'ghost') {
        // Second step only — handleRef is set after animateMove returns.
        handleRef.current?.cancel();
        return undefined;
      }
      return origGet(id);
    }) as typeof graph.nodes.get;

    // ghost on step 1 so cancel runs after the returned handle is assigned.
    handleRef.current = animateMove(
      svg,
      ['t0', 't1', 'ghost'],
      graph,
      80
    );
    await vi.advanceTimersByTimeAsync(1000);
    await expect(handleRef.current).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });

  it('cancel during live node lookup nulls marker before interpolate setup', async () => {
    stubRafClock();
    stubCancelAnimationFrameAsClearTimeout();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);

    const handleRef: {
      current: (Promise<void> & { cancel: () => void }) | null;
    } = { current: null };
    let lookups = 0;
    const origGet = graph.nodes.get.bind(graph.nodes);
    graph.nodes.get = ((id: NodeId) => {
      const node = origGet(id);
      lookups += 1;
      // Step 0 uses lookups 1–2; step 1's from-lookup cancels after handle exists.
      if (lookups >= 3 && handleRef.current) {
        handleRef.current.cancel();
      }
      return node;
    }) as typeof graph.nodes.get;

    handleRef.current = animateMove(svg, ['t0', 't1', 't2'], graph, 80);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(handleRef.current).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });
});

describe('q-mp-327 graph-ui — interactive soft wiring', () => {
  it('createInteractiveGraph on empty board mounts container with no clickable nodes', () => {
    const board: GraphBoard = {
      graph: emptyGraph(),
      nodeStates: new Map(),
    };
    const clicks: NodeId[] = [];
    const hovers: Array<NodeId | null> = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      (id) => hovers.push(id)
    );

    expect(el.classList.contains('graph-container')).toBe(true);
    expect(el.querySelectorAll('.graph-node')).toHaveLength(0);
    expect(clicks).toHaveLength(0);
    expect(hovers).toHaveLength(0);
  });

  it('stripping data-node-id before re-wiring leaves existing listeners intact', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const clicks: NodeId[] = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      () => undefined
    );

    const t0 = el.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    const t1 = el.querySelector(
      'circle[data-node-id="t1"]'
    ) as SVGCircleElement;
    t1.removeAttribute('data-node-id');

    t0.dispatchEvent(new Event('click'));
    t1.dispatchEvent(new Event('click'));
    // t1 listener closed over id at wire time — still fires with original id.
    expect(clicks).toEqual(['t0', 't1']);
  });

  it('soft-skips anonymous .graph-node injected before interactive wiring', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const clicks: NodeId[] = [];
    const origAppend = HTMLElement.prototype.appendChild;
    HTMLElement.prototype.appendChild = function appendChildPatched<T extends Node>(
      this: HTMLElement,
      node: T
    ): T {
      if (node instanceof SVGSVGElement) {
        const stray = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        stray.classList.add('graph-node');
        // intentionally no data-node-id — exercises createInteractiveGraph early return
        node.querySelector('g.nodes')?.appendChild(stray);
      }
      return origAppend.call(this, node) as T;
    };

    try {
      const el = createInteractiveGraph(
        board,
        (id) => clicks.push(id),
        () => undefined
      );
      const anonymous = [
        ...el.querySelectorAll('.graph-node'),
      ].filter((n) => !(n as SVGElement).dataset.nodeId);
      expect(anonymous).toHaveLength(1);

      anonymous[0]!.dispatchEvent(new Event('click'));
      expect(clicks).toHaveLength(0);

      (
        el.querySelector('circle[data-node-id="t0"]') as SVGElement
      ).dispatchEvent(new Event('click'));
      expect(clicks).toEqual(['t0']);
    } finally {
      HTMLElement.prototype.appendChild = origAppend;
    }
  });
});
