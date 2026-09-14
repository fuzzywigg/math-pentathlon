/**
 * Wave 33 — createGraphLegend default + custom color labels.
 * Deepens wave 22 default-legend smoke. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  DEFAULT_GRAPH_CONFIG,
  type GraphRenderConfig,
} from '../../src/core/graph/types';
import { createGraphLegend } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

/** Normalize css color from style.background (jsdom may emit rgb()). */
function rgbOf(hexOrRgb: string): string {
  const probe = document.createElement('span');
  probe.style.background = hexOrRgb;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return resolved;
}

describe('Wave 33 graph-ui-legend — labels and custom colors', () => {
  it('default legend has four items with DEFAULT colors', () => {
    const legend = createGraphLegend();
    expect(legend.classList.contains('graph-legend')).toBe(true);
    const items = legend.querySelectorAll(':scope > div');
    expect(items).toHaveLength(4);
    const labels = [...items].map(
      (el) => el.querySelector('span:last-child')?.textContent
    );
    expect(labels).toEqual(['Empty', 'Player 1', 'Player 2', 'Valid Move']);

    const backgrounds = [...items].map(
      (el) =>
        (el.querySelector('span:first-child') as HTMLElement).style.background
    );
    expect(backgrounds.map((b) => rgbOf(b))).toEqual([
      rgbOf(DEFAULT_GRAPH_CONFIG.nodeColors.default),
      rgbOf(DEFAULT_GRAPH_CONFIG.nodeColors.player1),
      rgbOf(DEFAULT_GRAPH_CONFIG.nodeColors.player2),
      rgbOf(DEFAULT_GRAPH_CONFIG.nodeColors.highlighted),
    ]);
  });

  it('custom nodeColors flow into legend dot backgrounds', () => {
    const nodeColors: GraphRenderConfig['nodeColors'] = {
      default: '#010101',
      player1: '#020202',
      player2: '#030303',
      highlighted: '#040404',
      disabled: '#050505',
    };
    const legend = createGraphLegend({ nodeColors });
    const backgrounds = [...legend.querySelectorAll(':scope > div')].map(
      (el) =>
        (el.querySelector('span:first-child') as HTMLElement).style.background
    );
    expect(backgrounds.map((b) => rgbOf(b))).toEqual([
      rgbOf('#010101'),
      rgbOf('#020202'),
      rgbOf('#030303'),
      rgbOf('#040404'),
    ]);
  });
});
