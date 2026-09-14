/**
 * Overnight HEAVY leftover after #274 — legend uses overridden player1 color.
 * Distinct from wave52 default four-label / no-disabled. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createGraphLegend } from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core graph-ui — legend custom p1', () => {
  it('Player 1 swatch background matches override color', () => {
    const legend = createGraphLegend({
      nodeColors: {
        default: '#eee',
        player1: '#112233',
        player2: '#aabbcc',
        highlighted: '#00ff00',
        disabled: '#999',
      },
    });
    document.body.appendChild(legend);
    const items = [...legend.children] as HTMLElement[];
    expect(items).toHaveLength(4);
    const p1 = items[1];
    expect(p1.textContent).toContain('Player 1');
    const dot = p1.querySelector('span') as HTMLElement;
    expect(dot.style.background).toBe('rgb(17, 34, 51)');
  });
});
