/**
 * Overnight TOKENMAXX — renderGraph skips edges whose endpoints are missing.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import type { Graph } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — orphan edge skip', () => {
  it('only draws lines for edges with both endpoints present', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 40, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'missing' },
        { from: 'gone', to: 'b' },
        { from: 'x', to: 'y' },
      ],
    };
    const svg = renderGraph(g, undefined, { showLabels: false });
    expect(svg.querySelectorAll('line')).toHaveLength(1);
    expect(svg.querySelector('line')?.getAttribute('data-from')).toBe('a');
    expect(svg.querySelector('line')?.getAttribute('data-to')).toBe('b');
  });
});
