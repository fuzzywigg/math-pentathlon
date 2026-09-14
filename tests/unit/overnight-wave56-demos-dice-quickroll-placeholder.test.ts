/**
 * Wave 56 leftover after #256 — Dice quick-roll mount placeholder exact copy.
 * Distinct from wave55 log-cap / wave51 confirm leftovers. Tests-only.
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

describe('Wave 56 demos — dice quick-roll placeholder', () => {
  it('mounts exact italic Click a button to roll copy', () => {
    const root = mount();
    renderDiceDemo(root);
    expect(root.querySelector('#quick-roll-result')?.textContent?.trim()).toBe(
      'Click a button to roll'
    );
  });
});
