/**
 * Wave 58 leftover after #267 — Graph exact Path found! bang copy.
 * Distinct from wave57 clear-path status leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — graph Path found!', () => {
  it('two-node path yields exact Path found! strong copy', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph circle[data-node-id]'),
    ] as SVGCircleElement[];
    expect(nodes.length).toBeGreaterThan(1);
    nodes[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    nodes[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-result strong')?.textContent).toBe(
      'Path found!'
    );
  });
});
