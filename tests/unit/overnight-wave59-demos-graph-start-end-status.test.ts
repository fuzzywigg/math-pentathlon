/**
 * Wave 59 leftover after #281 (unit-only) — Graph start mid-status exact copy.
 * Distinct from wave58 Click a node to set start point leftovers. Tests-only.
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

describe('Wave 59 demos — graph start-end status exact', () => {
  it('first node click paints Click another node for end point', () => {
    const root = mount();
    renderGraphDemo(root);
    const node = root.querySelector(
      '#pathfinding-graph .graph-node'
    ) as HTMLElement;
    expect(node).toBeTruthy();
    const nodeId = node.dataset.nodeId;
    expect(nodeId).toBeTruthy();
    node.dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toBe(
      `Start: ${nodeId} - Click another node for end point`
    );
  });
});
