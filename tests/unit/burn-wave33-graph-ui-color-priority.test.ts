/**
 * Wave 33 — graph-ui fill color priority (disabled > highlighted > owner).
 * Deepens wave 22 owner/highlight smoke into full precedence matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createStarGraph,
  DEFAULT_GRAPH_CONFIG,
  type NodeState,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function fillOf(svg: SVGSVGElement, id: string): string | null {
  return svg.querySelector(`circle[data-node-id="${id}"]`)?.getAttribute('fill') ?? null;
}

describe('Wave 33 graph-ui-color — state precedence matrix', () => {
  const colors = DEFAULT_GRAPH_CONFIG.nodeColors;

  it('owner 1 / owner 2 / default fill when no other flags', () => {
    const graph = createStarGraph(3);
    const states = new Map<string, NodeState>([
      ['center', { owner: 1 }],
      ['n0', { owner: 2 }],
      ['n1', {}],
    ]);
    const svg = renderGraph(graph, states);
    expect(fillOf(svg, 'center')).toBe(colors.player1);
    expect(fillOf(svg, 'n0')).toBe(colors.player2);
    expect(fillOf(svg, 'n1')).toBe(colors.default);
    expect(fillOf(svg, 'n2')).toBe(colors.default);
  });

  it('highlighted beats owner; disabled beats highlighted and owner', () => {
    const graph = createStarGraph(4);
    const states = new Map<string, NodeState>([
      ['n0', { owner: 1, highlighted: true }],
      ['n1', { owner: 2, disabled: true }],
      ['n2', { highlighted: true, disabled: true }],
      ['n3', { owner: 1, highlighted: true, disabled: true }],
      ['center', { highlighted: true }],
    ]);
    const svg = renderGraph(graph, states);
    expect(fillOf(svg, 'n0')).toBe(colors.highlighted);
    expect(fillOf(svg, 'n1')).toBe(colors.disabled);
    expect(fillOf(svg, 'n2')).toBe(colors.disabled);
    expect(fillOf(svg, 'n3')).toBe(colors.disabled);
    expect(fillOf(svg, 'center')).toBe(colors.highlighted);
    expect(
      svg.querySelector('circle[data-node-id="n0"]')?.classList.contains(
        'highlighted'
      )
    ).toBe(true);
    expect(
      svg.querySelector('circle[data-node-id="center"]')?.classList.contains(
        'highlighted'
      )
    ).toBe(true);
  });

  it('custom nodeColors override defaults for every role', () => {
    const graph = createStarGraph(2);
    const custom = {
      default: '#111111',
      player1: '#222222',
      player2: '#333333',
      highlighted: '#444444',
      disabled: '#555555',
    };
    const states = new Map<string, NodeState>([
      ['center', { owner: 1 }],
      ['n0', { owner: 2 }],
      ['n1', { disabled: true }],
    ]);
    const svg = renderGraph(graph, states, { nodeColors: custom });
    expect(fillOf(svg, 'center')).toBe(custom.player1);
    expect(fillOf(svg, 'n0')).toBe(custom.player2);
    expect(fillOf(svg, 'n1')).toBe(custom.disabled);
  });
});
