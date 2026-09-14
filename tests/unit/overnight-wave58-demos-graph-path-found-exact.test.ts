/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Graph exact Path found! result copy.
 * Distinct from soft /Path found/i leftovers. Tests-only.
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

describe('Wave 58 demos — graph Path found exact', () => {
  it('two node clicks paint exact Path found! in #path-result', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = root.querySelectorAll('#pathfinding-graph .graph-node');
    expect(nodes.length).toBeGreaterThan(1);
    (nodes[0] as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));
    (nodes[1] as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));
    const strong = root.querySelector('#path-result strong');
    expect(strong?.textContent).toBe('Path found!');
  });
});
