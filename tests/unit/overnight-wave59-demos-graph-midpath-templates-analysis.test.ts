/**
 * Wave 59 leftover after #281 — Graph mid-path status / templates / analysis / Clear Board.
 * Distinct from wave58 Path found! / idle path-status / Templates+Pathfinding h2s. Tests-only.
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

describe('Wave 59 demos — graph midpath templates analysis', () => {
  it('locks Start/end prompt, Path from, template labels, leftover h2s, Clear Board, empty analysis', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);

    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Interactive Game Board');
    expect(h2s).toContain('Connectivity Analysis');
    expect(root.querySelector('#clear-game-btn')?.textContent?.trim()).toBe(
      'Clear Board'
    );
    expect(
      root.querySelector('.template-btn[data-template="circular"]')?.textContent?.trim()
    ).toBe('Circular (8)');
    expect(
      root.querySelector('.template-btn[data-template="star"]')?.textContent?.trim()
    ).toBe('Star (6)');
    expect(
      root.querySelector('.template-btn[data-template="track"]')?.textContent?.trim()
    ).toBe('Track (10)');

    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/0 nodes/);
    expect(analysis).toMatch(/0 region\(s\)/);

    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph circle[data-node-id]'),
    ] as SVGCircleElement[];
    const a = nodes[0].getAttribute('data-node-id');
    const b = nodes[1].getAttribute('data-node-id');
    nodes[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toBe(
      `Start: ${a} - Click another node for end point`
    );
    nodes[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toBe(
      `Path from ${a} to ${b}`
    );
  });
});
