/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Dice demo exact h1/h2 section titles.
 * Distinct from wave56 quick-roll label leftovers. Tests-only.
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

describe('Wave 58 demos — dice section titles', () => {
  it('exposes exact Dice System Demo h1 and catalog h2s', () => {
    const root = mount();
    renderDiceDemo(root);
    expect(root.querySelector('h1')?.textContent).toMatch(/Dice System Demo/);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Quick Roll (No Animation)');
    expect(h2).toContain('Interactive Selector (2d6 - Standard)');
    expect(h2).toContain('Possible Sums Display');
  });
});
