/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — graph Path from status copy.
 * Distinct from Start-only / restart leftovers. Tests-only.
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

describe('Wave 51 demos — graph Path from status', () => {
  it('second node sets Path from A to B and fills path-result', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);

    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));

    expect(root.querySelector('#path-status')?.textContent ?? '').toMatch(
      /Path from .+ to .+/
    );
    expect(root.querySelector('#path-result')?.textContent ?? '').toMatch(
      /Path found|Distance|No path/i
    );
  });
});
