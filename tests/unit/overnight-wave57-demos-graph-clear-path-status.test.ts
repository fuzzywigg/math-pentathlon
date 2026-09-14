/**
 * Overnight HEAVY leftover after #264 — clear-path resets status after selection.
 * Distinct from overnight-demo matrix clear; focuses post-#264 residual. Tests-only.
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

describe('Wave 57 demos — graph clear path status', () => {
  it('Clear restores Click a node after a start selection', () => {
    const root = mount();
    renderGraphDemo(root);
    const node = root.querySelector(
      '#pathfinding-graph circle[data-node-id]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent ?? '').toMatch(
      /Start:/
    );
    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#path-status')?.textContent ?? '').toMatch(
      /Click a node to set start point/
    );
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
  });
});
