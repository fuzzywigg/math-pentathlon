/**
 * Overnight TOKENMAXX HEAVY — graph demo path restart + template node counts.
 * Tests-only. No product inventing.
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

describe('Overnight demos — graph path restart + counts', () => {
  it('third pathfinding click restarts start selection', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-result')?.textContent?.length).toBeGreaterThan(0);
    nodes[2].dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Start:/i);
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
  });

  it('circular template reports 8 nodes; complete reports 5', () => {
    const root = mount();
    renderGraphDemo(root);
    (
      root.querySelector(
        '.template-btn[data-template="circular"]'
      ) as HTMLButtonElement
    ).click();
    expect(root.querySelector('#template-info')?.textContent).toMatch(/Nodes:\s*8/);
    (
      root.querySelector(
        '.template-btn[data-template="complete"]'
      ) as HTMLButtonElement
    ).click();
    expect(root.querySelector('#template-info')?.textContent).toMatch(/Nodes:\s*5/);
  });
});
