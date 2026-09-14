/**
 * Wave 59 leftover after #281 (unit-only) — Dice polyhedral h2 exact leftover.
 * Distinct from wave58 three other h2 leftovers. Tests-only.
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

describe('Wave 59 demos — dice polyhedral h2 exact', () => {
  it('exposes Interactive Selector (3 Polyhedral - Prime Gold Style) h2', () => {
    const root = mount();
    renderDiceDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain(
      'Interactive Selector (3 Polyhedral - Prime Gold Style)'
    );
  });
});
