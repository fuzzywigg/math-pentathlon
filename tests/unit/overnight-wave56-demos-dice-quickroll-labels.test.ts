/**
 * Wave 56 leftover after #256 — Dice quick-roll CTA label catalog.
 * Distinct from data-dice matrix coverage. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';

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

describe('Wave 56 demos — dice quick-roll labels', () => {
  it('exposes Roll NdM labels on .quick-roll-btn', () => {
    const root = mount();
    renderDiceDemo(root);
    const labels = [...root.querySelectorAll('.quick-roll-btn')].map(
      (b) => b.textContent?.trim()
    );
    expect(labels).toEqual([
      'Roll 1d6',
      'Roll 2d6',
      'Roll 3d6',
      'Roll 1d20',
      'Roll 2d10',
    ]);
  });
});
