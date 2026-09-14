/**
 * Overnight HEAVY leftover after #264 — Player 2 claim updates Red card count.
 * Distinct from wave56 Blue/Red analysis headings only. Tests-only.
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

describe('Wave 57 demos — graph player2 claim', () => {
  it('selecting Player 2 then claiming bumps Red node count', () => {
    const root = mount();
    renderGraphDemo(root);
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    const node = root.querySelector(
      '#game-graph circle[data-node-id]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Red[\s\S]*1\s*nodes/i);
  });
});
