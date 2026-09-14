/**
 * Wave 56 leftover after #256 — Graph path Distance: N steps token.
 * Distinct from demos46 Distance:\d+ soft match. Tests-only.
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

describe('Wave 56 demos — graph distance steps', () => {
  it('path result includes Distance: N steps wording', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));

    expect(root.querySelector('#path-result')?.textContent).toMatch(
      /Distance:\s*\d+\s+steps/
    );
  });
});
