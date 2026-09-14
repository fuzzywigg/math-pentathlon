/**
 * Overnight TOKENMAXX HEAVY — graph Path arrow format + P2 Connects leftovers.
 * Distinct from #220 claim/restart OR-ish Connects. Tests-only.
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

describe('Overnight demos46 — graph path format / P2 connects', () => {
  it('path result uses Path: a → b arrow format after start+end', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = [
      ...root.querySelectorAll('#pathfinding-graph .graph-node'),
    ] as SVGElement[];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    nodes[0].dispatchEvent(new Event('click', { bubbles: true }));
    nodes[1].dispatchEvent(new Event('click', { bubbles: true }));

    const result = root.querySelector('#path-result')?.textContent ?? '';
    expect(result).toMatch(/Path found/i);
    expect(result).toMatch(/Path:\s*.+→.+/);
    expect(result).toMatch(/Distance:\s*\d+/i);
  });

  it('Player 2 claim can surface Connects edges when board bridges', () => {
    const root = mount();
    renderGraphDemo(root);
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    expect(
      root
        .querySelector('.player-btn[data-player="2"]')
        ?.classList.contains('selected')
    ).toBe(true);

    const gameNodes = [
      ...root.querySelectorAll('#game-graph .graph-node'),
    ] as SVGElement[];
    for (const node of gameNodes) {
      node.dispatchEvent(new Event('click', { bubbles: true }));
    }

    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 2/i);
    // Prefer Connects edges; fall back to full P2 claim (0 empty)
    expect(
      /Connects edges/i.test(analysis) || /0 empty/i.test(analysis)
    ).toBe(true);
    expect(analysis).toMatch(/Player 2[\s\S]*\d+\s*nodes/i);
  });
});
