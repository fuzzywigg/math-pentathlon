/**
 * Wave 58 leftover after #267 — Graph Path from A to B status after end pick.
 * Distinct from start-end prompt leftover. Tests-only.
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

describe('Wave 58 demos — graph Path from status', () => {
  it('second node click sets Path from start to end', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph circle[data-node-id]'),
    ] as SVGCircleElement[];
    const a = nodes[0].getAttribute('data-node-id');
    const b = nodes[1].getAttribute('data-node-id');
    nodes[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    nodes[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toBe(
      `Path from ${a} to ${b}`
    );
  });
});
