/**
 * Overnight TOKENMAXX — createGraphLegend always has 4 swatches; custom colors.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createGraphLegend } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — legend items', () => {
  it('default legend has Empty/Player 1/Player 2/Valid Move', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    const labels = [...legend.querySelectorAll('span')].map((s) => s.textContent);
    // spans alternate dot+label; labels are the text spans
    expect(labels.filter(Boolean)).toEqual([
      'Empty',
      'Player 1',
      'Player 2',
      'Valid Move',
    ]);
  });

  it('custom player1 color appears on second swatch', () => {
    const legend = createGraphLegend({
      nodeColors: {
        default: '#111',
        player1: '#ff00ff',
        player2: '#00ff00',
        highlighted: '#0000ff',
        disabled: '#999',
      },
    });
    // first child of each item is the dot span
    const swatches = [...legend.children].map(
      (item) => (item.firstElementChild as HTMLElement).style.background
    );
    // jsdom may normalize hex to rgb()
    expect(swatches[1].replace(/\s/g, '')).toMatch(/ff00ff|rgb\(255,0,255\)/i);
  });
});
