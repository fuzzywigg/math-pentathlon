/**
 * Overnight TOKENMAXX — DEFAULT_GRAPH_CONFIG not mutated by partial overrides.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph, createGraphLegend } from '../../src/core/graph/graph-ui';
import {
  createStarGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — config isolation', () => {
  it('partial config does not mutate DEFAULT_GRAPH_CONFIG', () => {
    const before = structuredClone(DEFAULT_GRAPH_CONFIG);
    const g = createStarGraph(2);
    renderGraph(g, undefined, {
      edgeColor: '#abcdef',
      nodeRadius: 99,
      showLabels: false,
    });
    createGraphLegend({
      nodeColors: {
        ...DEFAULT_GRAPH_CONFIG.nodeColors,
        player1: '#010101',
      },
    });
    expect(DEFAULT_GRAPH_CONFIG).toEqual(before);
  });
});
