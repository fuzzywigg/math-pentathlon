/**
 * Wave 58 leftover after #267 — Graph mid-path Start/end prompt.
 * Distinct from wave57 idle Clear restore. Tests-only.
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

describe('Wave 58 demos — graph start-end prompt', () => {
  it('first node click sets Start: id - Click another node for end point', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    const node = root.querySelector(
      '#pathfinding-graph circle[data-node-id]'
    ) as SVGCircleElement;
    const id = node.getAttribute('data-node-id');
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toBe(
      `Start: ${id} - Click another node for end point`
    );
  });
});
