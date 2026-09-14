/**
 * Overnight TOKENMAXX HEAVY — graph demo claim / same-node / connects leftovers.
 * Distinct from #197/#202 path clear/claim smoke. Tests-only.
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

describe('Overnight demos45 — graph claim / connects / reject', () => {
  it('same-node end click restarts selection instead of closing a path', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    const startStatus = root.querySelector('#path-status')?.textContent ?? '';
    expect(startStatus).toMatch(/Start/i);

    // Clicking same node again resets to new start (nodeId === startNode branch)
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Start/i);
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');

    // Clear with start-only selection
    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#path-status')?.textContent).toMatch(
      /Click a node/i
    );
  });

  it('reclaim owned game node is a no-op; analysis stays stable', () => {
    const root = mount();
    renderGraphDemo(root);
    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    expect(gameNodes.length).toBeGreaterThanOrEqual(2);
    gameNodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 1|1 nodes/i);

    gameNodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#game-analysis')?.textContent).toBe(analysis);
  });

  it('claiming many P1 nodes may surface Connects edges chrome when bridged', () => {
    const root = mount();
    renderGraphDemo(root);
    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    for (const node of gameNodes) {
      node.dispatchEvent(new Event('click', { bubbles: true }));
    }
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 1/i);
    expect(analysis).toMatch(/empty|Total/i);
    // Connects edges is geometry-dependent; accept presence OR all-claimed board
    expect(
      /Connects edges/i.test(analysis) || /0 empty/i.test(analysis)
    ).toBe(true);
  });
});
