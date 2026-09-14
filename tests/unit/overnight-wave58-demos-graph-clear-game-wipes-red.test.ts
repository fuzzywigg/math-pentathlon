/**
 * Overnight HEAVY leftover after #274 — clear-game resets Red count after P2 claim.
 * Distinct from wave57 player2-claim leftover. Tests-only.
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

describe('Wave 58 demos — graph clear-game wipes red', () => {
  it('Clear Board after Player 2 claim resets Red node count', () => {
    const root = mount();
    renderGraphDemo(root);
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    const node = root.querySelector(
      '#game-graph circle[data-node-id]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#game-analysis')?.textContent ?? '').toMatch(
      /Red[\s\S]*1\s*nodes/i
    );
    (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#game-analysis')?.textContent ?? '').toMatch(
      /Red[\s\S]*0\s*nodes/i
    );
  });
});
