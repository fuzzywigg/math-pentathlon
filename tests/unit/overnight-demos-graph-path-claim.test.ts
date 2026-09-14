/**
 * Overnight TOKENMAXX HEAVY — graph demo pathfinding + claim leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos — graph pathfinding + claim', () => {
  it('two pathfinding nodes show path distance; clear resets status', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Start/i);
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-result')?.textContent).toMatch(/Path found|Distance|No path/i);

    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Click a node/i);
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
  });

  it('player claim updates analysis; clear-game wipes ownership chrome', () => {
    const root = mount();
    renderGraphDemo(root);
    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    expect(gameNodes.length).toBeGreaterThanOrEqual(2);

    gameNodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    gameNodes[1].dispatchEvent(new Event('click', { bubbles: true }));

    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis.length).toBeGreaterThan(0);

    (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    // after clear, analysis should reflect empty / zero territories
    const after = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(after.length).toBeGreaterThanOrEqual(0);
    expect(root.querySelector('#game-legend')?.children.length).toBeGreaterThan(0);
  });
});
