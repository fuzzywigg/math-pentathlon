/**
 * Overnight HEAVY leftover after #256 — animateMove path length < 2 resolves.
 * Distinct from wave55 highlight mid-ghost. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createTrackGraph,
  renderGraph,
  animateMove,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core graph-ui — animate short path', () => {
  it('empty and single-node paths resolve without marker', async () => {
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    await expect(animateMove(svg, [], graph, 10)).resolves.toBeUndefined();
    await expect(animateMove(svg, ['t0'], graph, 10)).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });
});
