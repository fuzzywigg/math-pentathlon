/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Graph exact path-status start copy.
 * Distinct from soft Click a node leftovers. Tests-only.
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

describe('Wave 58 demos — graph path-status exact', () => {
  it('mount and clear restore Click a node to set start point', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(root.querySelector('#path-status')?.textContent).toBe(
      'Click a node to set start point'
    );
    const nodes = root.querySelectorAll('#pathfinding-graph .graph-node');
    (nodes[0] as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));
    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#path-status')?.textContent).toBe(
      'Click a node to set start point'
    );
  });
});
