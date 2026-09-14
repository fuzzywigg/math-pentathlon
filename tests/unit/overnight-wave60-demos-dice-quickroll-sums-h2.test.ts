/**
 * Wave 60 leftover after #290 (unit-only) — Dice Quick Roll h2 + Possible Sums.
 * Distinct from wave59 polyhedral h2 leftover. Tests-only.
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

describe('Wave 60 demos — dice quickroll sums h2', () => {
  it('exposes Quick Roll and Possible Sums Display h2s', () => {
    const root = mount();
    renderDiceDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Quick Roll (No Animation)');
    expect(h2).toContain('Possible Sums Display');
    expect(h2).toContain('Interactive Selector (2d6 - Standard)');
  });
});
