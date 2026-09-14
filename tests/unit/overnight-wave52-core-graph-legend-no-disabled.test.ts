/**
 * Overnight HEAVY leftover after #234 — legend omits disabled swatch.
 * Distinct from overnight-core-graph-ui-legend-four-items. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createGraphLegend } from '../../src/core/graph/graph-ui';
import { DEFAULT_GRAPH_CONFIG } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core graph-ui — legend no disabled', () => {
  it('four labels only; disabled color never used as swatch', () => {
    const legend = createGraphLegend();
    const labels = [...legend.querySelectorAll('span')].map((s) => s.textContent);
    const textLabels = labels.filter((t) => t && t.length > 1);
    expect(textLabels).toEqual(['Empty', 'Player 1', 'Player 2', 'Valid Move']);
    const backgrounds = [...legend.querySelectorAll('span')]
      .map((s) => (s as HTMLElement).style.background)
      .filter(Boolean);
    expect(backgrounds).not.toContain(DEFAULT_GRAPH_CONFIG.nodeColors.disabled);
  });
});
