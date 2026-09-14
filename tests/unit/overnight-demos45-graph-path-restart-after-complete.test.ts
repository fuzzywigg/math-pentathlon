/**
 * Overnight TOKENMAXX HEAVY — graph path restart after completed path leftovers.
 * Distinct from #202 first-path clear. Tests-only.
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

describe('Overnight demos45 — graph path restart after complete', () => {
  it('third node click after a finished path starts a new selection', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(3);

    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-result')?.textContent).toMatch(
      /Path found|Distance|No path/i
    );

    nodes[2].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Start/i);
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
  });

  it('player seat toggle updates selected chrome without clearing claims', () => {
    const root = mount();
    renderGraphDemo(root);
    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    gameNodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    expect(
      root
        .querySelector('.player-btn[data-player="2"]')
        ?.classList.contains('selected')
    ).toBe(true);
    gameNodes[1].dispatchEvent(new Event('click', { bubbles: true }));
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 1/i);
    expect(analysis).toMatch(/Player 2/i);
  });
});
